import React, { Component } from 'react'
import { TaskPreview } from './TaskPreview'
import { boardService } from '../services/boardService'
import { ListTitle } from './ListTitle'
import { TaskComposer } from './TaskComposer'
import { Droppable, Draggable } from 'react-beautiful-dnd';


export class TaskList extends Component {
    state = {
        isComposerOpen: false,
        isDragDisabled: false
    }

    elTaskTitleRef = React.createRef()

    updateBoard = async (board = this.props.board) => {
        await this.props.updateBoard(board)
    }

    onEditTask = () => {
        const { list } = this.props
        const { task } = this.state
        const board = { ...this.props.board }
        const taskIdx = boardService.getTaskIdxById(list, task.id)
        board.lists.tasks[taskIdx] = task
        this.updateBoard()
    }

    listTitleHandlersProps = {
        onRemoveList: () => {
            const listIdx = this.listIdx
            const { board, updateBoard } = { ...this.props }
            const activity = { txt: `has removed list ${board.lists[listIdx].title}` }
            board.lists.splice(listIdx, 1)
            updateBoard(board, activity)

        },
        onToggleComposer: ev => {
            ev.stopPropagation()
            this.props.setCurrPopover(`TASK_COMPOSER${this.props.list.id}`)
            this.setState({ isComposerOpen: !this.state.isComposerOpen }, () => {
                this.elTaskTitleRef.current.focus()
            })
        }
    }

    get listIdx() {
        const { list, board } = this.props
        const listIdx = boardService.getListIdxById(board, list.id)
        return listIdx
    }

    setDragability = (boolean) => {
        this.setState({ isDragDisabled: !boolean })
    }

    render() {
        const { list, currPopover, listIdx } = this.props
        const { tasks } = list

        return (
            <Draggable draggableId={list.id} index={listIdx} isDragDisabled={this.state.isDragDisabled} >

                {(provided, snapshot) => (
                    <li
                        style={{ backgroundColor: list.style.bgColor }}
                        className={`task-list task-list-container ${snapshot.isDragging && 'moving'}  `}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        ref={provided.innerRef}>

                        <ListTitle
                            {...provided.dragHandleProps}
                            {...this.props}
                            {...this.listTitleHandlersProps}
                        />

                        <div className="task-previews-container">
                            <Droppable droppableId={list.id} type="task">
                                {provided => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} className="flex column" style={{ flexGrow: "1", minHeight: "1px" }}>

                                        {tasks ? tasks.map((task, idx) => <TaskPreview key={task.id} taskIdx={idx} {...this.props} setListDnd={this.setDragability} task={task} className={(idx === tasks.length - 1) && "last-child"} />) : ''}

                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                        <TaskComposer {...this.props} titleRef={this.elTaskTitleRef} isComposerOpen={currPopover === `TASK_COMPOSER${list.id}`} onToggleComposer={this.onToggleComposer} />
                    </li>
                )
                }
            </Draggable>

        )
    }
}

