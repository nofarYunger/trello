import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateBoard } from '../store/actions/boardActions'
import { boardService } from '../services/boardService'
import { utilService } from '../services/utilService'

export class _TaskComposer extends Component {

    state = {
        task: {
            title: '',
            description: '',
        }
    }

    handleChange = ev => {
        const { name, value } = ev.target
        this.setState(prevState => ({ task: { ...prevState.task, [name]: value } }))
    }

    onAddTask = ev => {
        ev.preventDefault()
        ev.stopPropagation()
        const { task } = { ...this.state }
        if (!task.title) return
        const { board } = { ...this.props }
        const { list } = this.props
        const listIdx = boardService.getListIdxById(board, list.id)
        task.createdAt = Date.now()
        task.id = utilService.makeId()
        if (!board.lists[listIdx].tasks) {
            board.lists[listIdx].tasks = []
        }
        board.lists[listIdx].tasks.push(task)
        this.setState({
            task: {
                title: '',
                description: '',
            }
        }, () => {
            const activity = { task }
            activity.txt = `has added new task ${task.title} to list ${list.title}`
            this.props.updateBoard(board, activity)
        })
    }

    updateBoard(board = this.props.board) {
        this.props.updateBoard(board)
    }

    render() {
        const { isComposerOpen, titleRef, setCurrPopover, list } = this.props
        const { task } = this.state
        return (
            <form className={`task-composer`} onSubmit={this.onAddTask}>
                <input value={task.title} type="text" ref={titleRef} name="title" onClick={() => { setCurrPopover(`TASK_COMPOSER${list.id}`) }} onChange={this.handleChange}
                    placeholder={list.tasks.length ? "+ Add another card" : "+ Add a card"} autoComplete="off" id="" />
                <div className={`open-composer-section ${!isComposerOpen && 'display-none'}`}>
                    <button className={`save-task-btn primary-btn `}>Add</button>
                </div>
            </form>
        )
    }
}


const mapStateToProps = state => {
    return {
        board: state.boardReducer.currBoard
    }
}

const mapDispatchToProps = {
    updateBoard
}

export const TaskComposer = connect(mapStateToProps, mapDispatchToProps)(_TaskComposer)
