import React, { Component } from 'react'
import { boardService } from '../services/boardService'
import { LabelsPopover } from './LabelsPopover'
import { ChangeMembersPopover } from './ChangeMembersPopover'
import { QuickEditButton } from './QuickEditButton'
import LabelIcon from '@material-ui/icons/LabelOutlined';
import ChangeMembersIcon from '@material-ui/icons/PeopleOutline';
import RemoveIcon from '@material-ui/icons/DeleteOutline';
import ChangeDueDateIcon from '@material-ui/icons/QueryBuilder';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { DateTimePopover } from './DateTimePopover'
import { MoveTaskPopover } from './MoveTaskPopover'
import { parseISO } from 'date-fns'
import { getTime } from 'date-fns'


const popovers = [
    {
        title: 'Edit Labels',
        Component: LabelsPopover,
        Icon: LabelIcon
    },
    {
        title: 'Change Members',
        Component: ChangeMembersPopover,
        Icon: ChangeMembersIcon
    },
    {
        title: 'Move',
        Icon: ArrowForwardIcon,
        Component: MoveTaskPopover
    },
    {
        title: 'Change Due Date',
        Component: DateTimePopover,
        Icon: ChangeDueDateIcon,
        className: 'quick-edit-datepicker'
    },
]


export class TaskEdit extends Component {

    state = {
        dueDate: {
            timestamp: '',
            isDone: false
        }
    }

    dueDateHandlers = {
        onDateChange: (ev) => {
            let parsedString = parseISO(ev.target.value)
            let timestamp = getTime(parsedString)
            const dueDate = {
                timestamp,
                isDone: false
            }
            this.setState({ dueDate })
        },
        onSaveDate: () => {
            const { board, list, task, updateBoard } = this.props
            const { listIdx, taskIdx } = boardService.getListAndTaskIdxById(board, list.id, task.id)
            const boardCopy = { ...board }
            if (!this.state.dueDate.timestamp) return
            boardCopy.lists[listIdx].tasks[taskIdx].dueDate = this.state.dueDate
            updateBoard(boardCopy)
            this.props.setCurrPopover()
        }
    }

    onRemoveTask = ev => {
        ev.stopPropagation()
        const { task, list, board } = this.props
        const { listIdx, taskIdx } = boardService.getListAndTaskIdxById(board, list.id, task.id)
        const boardCopy = { ...this.props.board }
        boardCopy.lists[listIdx].tasks.splice(taskIdx, 1)
        this.props.updateBoard(boardCopy)
    }

    render() {
        return (
            <div className="quick-task-editor-buttons">
                {popovers.map(popover => {
                    return <QuickEditButton
                        key={popover.title}
                        {...this.dueDateHandlers}
                        {...this.props}
                        {...popover}
                    />
                })}
                <a className="quick-task-editor-buttons-item js-edit-labels" href="#" onClick={this.onRemoveTask}>
                    <span className="icon-sm icon-label light"></span>
                    <span className="quick-task-editor-buttons-item-text flex align-center">
                        <RemoveIcon className="quick-task-editor-buttons-item-icon" />Remove</span>
                </a>
            </div>

        )
    }
}
