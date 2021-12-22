import React, { Component, Fragment } from 'react'
import { boardService } from '../services/boardService'
import { toggleTask, setCurrListAndTaskIdx, updateBoard } from '../store/actions/boardActions'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ContentEditable from "react-contenteditable";
import EditIcon from '@material-ui/icons/CreateOutlined';
import CheckIcon from '@material-ui/icons/CheckBoxOutlined';
import DueDateIcon from '@material-ui/icons/QueryBuilderOutlined';
import NotesOutlinedIcon from '@material-ui/icons/NotesOutlined';
import { TaskEdit } from './TaskEdit'
import CommentIcon from '@material-ui/icons/TextsmsOutlined';
import { format } from 'date-fns'
import { Draggable } from 'react-beautiful-dnd';
import BoardMemberImg from './BoardMemberImg'

export class _TaskPreview extends Component {

    state = {
        isTaskHovered: false,
        isEditOpen: false,
        taskTitle: '',
        titleBeforeChange: '',
        unreadNotificationsCount: 0,
        isLabelOpen: false,
        isManyMembers: false,
    }

    membersRef = React.createRef()


    componentDidMount() {
        const { task } = this.props
        this.setState({ taskTitle: task.title, titleBeforeChange: task.title })

        if (this.membersRef.current) {
            this.membersRef.current.clientWidth > 97 ?
                this.membersRef.current.classList.add('narrow-down')
                : this.membersRef.current.classList.remove('narrow-down')
        }
    }

    onTaskUpdated = (activityTxt) => {
        const { unreadNotificationsCount } = { ...this.state }
        this.setState({ unreadNotificationsCount: unreadNotificationsCount + 1 }, () => {
        })
    }

    componentDidUpdate(prevProps) {
        const { task } = this.props
        if (prevProps.task === task) return
        this.setState({ taskTitle: task.title, titleBeforeChange: task.title })
    }


    setDefaultTitle = () => {
        const { titleBeforeChange } = this.state
        this.setState({ taskTitle: titleBeforeChange })
    }

    get doesContainIndics() {
        const { task } = this.props
        return task.description || task.checklists?.length || task.dueDate || task.comments?.length || task.members?.length
    }
    onOpenDetails = async (ev) => {
        ev.stopPropagation()
        if (this.state.isEditOpen) return

        const { list, board, task } = this.props
        const { taskIdx, listIdx } = boardService.getListAndTaskIdxById(board, list.id, task.id)

        await this.props.setCurrListAndTaskIdx(listIdx, taskIdx)
        await this.props.toggleOverlay()

        // await this.props.toggleTask()
        this.props.history.push(`/board/${board._id}/${list.id}/${task.id}`)
    }

    taskPreviewHandlers = {
        //To identify hover state (for revealing quick edit icon)
        onMouseEnter: () => {
            this.setState({ isTaskHovered: true })
        },
        onMouseLeave: () => {
            this.setState({ isTaskHovered: false })
        }
    }

    onToggleEdit = ev => {
        ev.stopPropagation()
        const { isEditOpen } = this.state
        this.setState({ isEditOpen: !isEditOpen })
        if (isEditOpen) this.setDefaultTitle()
        this.props.setListDnd(isEditOpen)
    }



    get taskTodosLength() {
        const { task } = this.props
        const totalLen = task.checklists.reduce((acc, checklist) => { return acc + checklist.todos.length }, 0)
        return totalLen
    }

    get taskDoneTodosLength() {
        const { task } = this.props
        var doneTodos = []
        task.checklists.forEach(checklist => {
            const checklistDoneTodos = checklist.todos.filter(todo => todo.isDone)
            doneTodos = [...doneTodos, ...checklistDoneTodos]
        })
        return doneTodos.length
    }


    handleChange = evt => {
        this.setState({ taskTitle: evt.target.value });
    };

    onSaveTitle = async (ev) => {
        const { taskTitle } = this.state
        if (!taskTitle) return
        const { list, board, task } = this.props
        if (taskTitle === task.title) {
            this.onToggleEdit(ev)
            return
        }
        const { listIdx, taskIdx } = boardService.getListAndTaskIdxById(board, list.id, task.id)
        const copyBoard = { ...board }
        copyBoard.lists[listIdx].tasks[taskIdx].title = taskTitle
        const { user } = this.props
        await this.props.updateBoard(copyBoard, { user, txt: `has changed task (${task.title}) title`, task: { ...this.props.task } })
        this.onToggleEdit(ev)
    }

    render() {
        const { task, list, taskIdx, toggleLabels, isLabelOpen } = this.props
        const { isEditOpen, isTaskHovered } = this.state
        return (
            <Fragment>
                <div className={`${isEditOpen && 'main-overlay'}`} onClick={this.onToggleEdit}></div>
                <Draggable
                    draggableId={task.id}
                    index={taskIdx}
                    isDragDisabled={isEditOpen}
                >
                    {(provided, snapshot) => (
                        <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                        >
                            <div {...this.taskPreviewHandlers} className={`task-preview ${snapshot.isDragging && 'moving'} ${isEditOpen && ' quickEdit'} ${this.props.className}`} onClick={this.onOpenDetails} >
                                {(task.attachments?.length) ?
                                    <div className="preview-img" style={{ backgroundImage: `url(${task.attachments.slice(-1)[0]})` }}>
                                    </div>
                                    : ''
                                }
                                {task.labels?.length ? <div className="top-line-preview-container flex">
                                    <div className="labels-container flex">
                                        {task.labels.map(label => {
                                            return (
                                                <div onClick={(ev) => {
                                                    ev.stopPropagation()
                                                    toggleLabels()
                                                }} style={{ backgroundColor: label.color }} key={label.id} className={`task-label ${isLabelOpen && "open"}`} title={label.title}>{isLabelOpen ? label.title : ''}</div>
                                            )

                                        })}

                                    </div>
                                    <div className="quick-edit-wrapper">
                                        {isTaskHovered && <EditIcon className="edit-icon" onClick={this.onToggleEdit} />}
                                        {isEditOpen && <TaskEdit
                                            {...this.props}
                                            membersRef={this.membersRef}
                                            task={task}
                                            list={list}
                                            onToggleEdit={this.onToggleEdit} />}
                                    </div>
                                </div> : ''}
                                <div className="task-title-wrapper flex space-between ">


                                    <ContentEditable
                                        style={{ color: list.style.title.bgColor }}
                                        html={this.state.taskTitle} // innerHTML of the editable div
                                        disabled={!isEditOpen} // use true to disable edition
                                        onChange={this.handleChange} // handle innerHTML change
                                        className="task-title-input"
                                    />

                                    {!task.labels?.length && <div className="quick-edit-wrapper">
                                        {(isTaskHovered || isEditOpen) &&
                                            <EditIcon className="edit-icon" onClick={this.onToggleEdit} />}
                                        {isEditOpen && <TaskEdit {...this.props} task={task} membersRef={this.membersRef} list={list} onToggleEdit={this.onToggleEdit} />}
                                    </div>}
                                </div>
                                {this.doesContainIndics &&
                                    <div className="task-preview-icons-container indication-icon flex ">
                                        <div className="task-preview-indication-icons flex start">
                                            {task.description && <NotesOutlinedIcon className="description-indication-icon indication-icon" />}
                                            {task.checklists?.length ? <div className="flex align-center"><CheckIcon className="indication-icon" />{this.taskDoneTodosLength}/{this.taskTodosLength}</div> : ''}
                                            {task.dueDate ? <div className={`date-indication  flex align-center ${task.dueDate.isDone ? "complete" : ""}`}><DueDateIcon className="indication-icon" /><div>{format(new Date(task?.dueDate?.timestamp), 'LLL')} {format(new Date(task?.dueDate?.timestamp), 'd')}</div></div> : ''}
                                            {task.comments && <CommentIcon className="comment-indication-icon indication-icon" />}
                                        </div>
                                        {task.members?.length ?
                                            <div ref={this.membersRef} className="task-members-imgs flex">
                                                {task.members.map(member => { return <BoardMemberImg key={member._id} member={member} /> })}
                                            </div>
                                            : ''}

                                    </div>
                                }
                                {isEditOpen && <button className="primary-btn quick-btn" onClick={this.onSaveTitle}> Save </button>}
                            </div >

                        </div>
                    )}
                </Draggable>

            </Fragment>
        )
    }
}


const mapDispatchToProps = {
    toggleTask,
    setCurrListAndTaskIdx,
    updateBoard
}

const mapStateToProps = state => {
    return {
        isTaskOpen: state.boardReducer.isTaskOpen,
        isOverlayOpen: state.boardReducer.isOverlayOpen,
        board: state.boardReducer.currBoard
    }
}

export const TaskPreview = connect(mapStateToProps, mapDispatchToProps)(withRouter(_TaskPreview))


/*
Sockets activities plan:
logged in user is adding somebody to a task.
at the same time board is updated ,
updateUserActivities is sent,
"you have been added to the task."

*/