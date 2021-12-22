import React, { Component, Fragment } from 'react'
import { boardService } from '../services/boardService'
import { TaskDetailsInfo } from './TaskDetailsInfo'
import { TaskDetailsDesc } from './TaskDetailsDesc'
import { TaskDetailsChecklist } from './TaskDetailsChecklist'
import { TaskDetailsActivity } from './TaskDetailsActivity'
import { TaskDetailsAttachments } from './TaskDetailsAttachments'
import { TaskSidebar } from './TaskSidebar'
import { cloneDeep } from 'lodash'
import { connect } from 'react-redux'
import { updateBoard, toggleTask, toggleOverlay } from '../store/actions/boardActions'
import { withRouter } from 'react-router-dom'
import DvrOutlinedIcon from '@material-ui/icons/DvrOutlined';
import CloseIcon from '@material-ui/icons/Close';
export class _TaskDetails extends Component {
    state = {
        isDetailsOpen: false,
        currPopover: '',
        board: {},
        list: {},
        task: {}

    }

    elTitleRef = React.createRef()

    componentDidMount() {
        const { listId, taskId } = this.props.match.params // Whenever someone opens task through URL
        const details = this.getDetails()
        if (details) {

            const { board, list, task } = details
            this.getCurrTask(board._id, taskId)
            this.setState({ board, list, task })
        }

    }

    componentDidUpdate() {
        const { listId, taskId } = this.props.match.params
        const details = this.getDetails()
        if (details) {

            const { board, list, task } = details
            if (taskId && listId && !this.state.isDetailsOpen) { // When task is clicked on board
                this.setState({ isDetailsOpen: true, board, list, task }, async () => {
                    this.getCurrTask(board._id, taskId)
                    if (!this.props.isOverlayOpen) {
                        await this.props.toggleOverlay()
                    }

                })
            }
        }
    }

    componentWillUnmount() {
        this.props.toggleOverlay()
    }

    // TRY TO REFACTOR
    getDetails = () => {
        const { listId, taskId } = this.props.match.params
        if (listId && taskId) {
            const { board } = { ...this.props }
            const { listIdx, taskIdx } = boardService.getListAndTaskIdxById(board, listId, taskId)
            const list = board.lists[listIdx]
            const task = list.tasks[taskIdx]
            return { board, list, task }
        }
    }

    handleTitle = ({ target }) => {
        const field = target.name
        const value = target.value
        const copyTask = cloneDeep(this.state.task)
        copyTask.title = value
        this.setState({ task: copyTask })
    }

    onEnterPress = ev => {
        if (ev.keyCode === 13 && ev.shiftKey === false) {
            ev.preventDefault()
            this.onSubmitForm(ev)
        }
    }

    onSubmitForm = async (ev) => {
        ev.preventDefault()
        const { board, list, task } = this.state
        if (!task.title) return
        const boardCopy = { ...this.state.board }
        const currListIdx = boardService.getListIdxById(board, list.id)
        const taskIdx = boardCopy.lists[currListIdx].tasks.findIndex(currTask => currTask.id === task.id)
        boardCopy.lists[currListIdx].tasks[taskIdx] = task
        const { user } = this.props
        const activity = {
            user,
            txt: `has changed task (${task.title}) title`,
            task,
        }
        this.elTitleRef.current.blur()
        await this.props.updateBoard(boardCopy, activity)
    }

    getCurrTask = async (boardId, taskId) => {
        const task = await boardService.getTaskById(boardId, taskId)
        this.setState({ task })
    }

    onCloseModal = (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        const { board } = this.state
        this.setState({ isDetailsOpen: false }, async () => {
            this.props.history.push(`/board/${board._id}`)
        })
    }

    togglePopover = (name) => {
        const { currPopover } = this.state
        if (currPopover === name) {
            this.setState({ currPopover: '' })
        } else {
            this.setState({ currPopover: name })

        }
    }

    onOverlayClick = () => {
        const { board } = this.props
        this.props.history.push(`/board/${board._id}`)
    }


    render() {
        const { isDetailsOpen, currPopover } = this.state
        const { board, user } = this.props
        const { listId, taskId } = this.props.match.params
        const { listIdx, taskIdx } = boardService.getListAndTaskIdxById(board, listId, taskId)
        const currList = board.lists[listIdx]
        const currTask = board.lists[listIdx].tasks[taskIdx]


        if (!currTask) return <div>Loading details...</div>
        return (
            <section onClick={() => currPopover ? this.togglePopover('') : ''} className="task-details">
                {this.state.isDetailsOpen &&
                    <div className={`${this.props.isOverlayOpen && "main-overlay"} ${!isDetailsOpen && "hidden"}`} onClick={this.onOverlayClick}>
                        <div className="details-modal flex" onClick={(ev) => {
                            ev.stopPropagation()
                            if (currPopover) this.togglePopover('')
                        }}>
                            <div className="main-details flex column">

                                <div className="details-header flex column">
                                    <form className="flex">
                                        <DvrOutlinedIcon style={{ position: 'absolute', left: '-30px', top: '3px' }} />
                                        <textarea onKeyDown={this.onEnterPress} ref={this.elTitleRef} className="task-textarea"
                                            name="title"
                                            onChange={this.handleTitle}
                                            value={this.state.task?.title}
                                            spellCheck="false"
                                            onBlur={this.onSubmitForm}
                                        />
                                        <div className="task-details-close-btn close-btn flex align-center justify-center">
                                            <CloseIcon onClick={this.onCloseModal} />
                                        </div>
                                    </form>
                                    <p>in list <span className="details-list-name">{currList?.title}</span></p>
                                </div>
                                <div className="details-info">
                                    <TaskDetailsInfo board={board} list={currList} task={currTask} togglePopover={this.togglePopover} currPopover={this.state.currPopover}  {...this.props} />
                                </div>
                                <div className="details-description">
                                    <TaskDetailsDesc board={board} list={currList} task={currTask} user={user} />
                                </div>
                                {currTask.attachments?.length ?
                                    <div className="details-attachments">
                                        <TaskDetailsAttachments board={board} list={currList} task={currTask} {...this.props} />
                                    </div>
                                    : ''
                                }
                                <div className="details-checklist">
                                    <TaskDetailsChecklist board={board} list={currList} task={currTask} user={user} />
                                </div>
                                <div className="details-activity">
                                    <TaskDetailsActivity board={board} list={currList} task={currTask} {...this.props} />
                                </div>
                            </div>
                            <div className="details-buttons">


                                <div className="task-sidebar">
                                    <TaskSidebar board={board} list={currList} task={currTask} togglePopover={this.togglePopover} currPopover={this.state.currPopover} {...this.props} />
                                </div>

                            </div>
                        </div>
                    </div>
                }
            </section>
        )
    }
}

const mapDispatchToProps = {
    updateBoard,
    toggleTask,
    toggleOverlay
}

const mapStateToProps = state => {
    return {
        isTaskOpen: state.boardReducer.isTaskOpen,
        board: state.boardReducer.currBoard,
        currListIdx: state.boardReducer.currListIdx,
        currTaskIdx: state.boardReducer.currTaskIdx,
        isOverlayOpen: state.boardReducer.isOverlayOpen,
        user: state.userReducer.user
    }
}

export const TaskDetails = connect(mapStateToProps, mapDispatchToProps)(withRouter(_TaskDetails))