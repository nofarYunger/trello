import React, { Component } from 'react'
import { boardService } from '../services/boardService'
import { PopoverHeader } from './PopoverHeader'
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { cloneDeep } from 'lodash'


export class MoveTaskPopover extends Component {

    state = {
        selectedListIdx: 0
    }

    handleInput = (ev) => {
        this.setState({ selectedListIdx: ev.target.value })
    }

    onMoveSaveClick = async () => {
        const { board, list, task, updateBoard, setCurrPopover } = this.props
        const { selectedListIdx } = this.state
        const { listIdx, taskIdx } = boardService.getListAndTaskIdxById(board, list.id, task.id)
        const copyBoard = cloneDeep(board)
        const taskToMove = copyBoard.lists[listIdx].tasks.splice(taskIdx, 1)
        copyBoard.lists[+selectedListIdx].tasks.push(taskToMove[0])
        await updateBoard(copyBoard)
        setCurrPopover()
        const { taskId, listId } = this.props.match.params
        if (taskId && listId) {
            this.props.history.push(`/board/${board._id}/${board.lists[selectedListIdx].id}/${task.id}`)
        }
    }
    render() {
        const { board } = this.props
        return (
            <div className="move-task-popover" onClick={(ev) => ev.stopPropagation()}>
                <PopoverHeader title="Move Task" setCurrPopover={this.props.setCurrPopover} />
                <div className="move-task-body flex column  justify-center align-center">
                    <h3>Select Destination</h3>
                    <FormControl style={{ marginBottom: '10px', minWidth: '120px' }} >
                        <Select
                            native
                            onChange={this.handleInput}
                            inputProps={{
                                name: 'list',
                                id: 'age-native-simple',
                            }}
                        >
                            {board.lists.map((list, listIdx) => {
                                if (!list.title) return
                                return <option value={listIdx}>{list.title}</option>
                            })}
                        </Select>
                    </FormControl>
                    <button onClick={this.onMoveSaveClick} className="date-close-btn primary-btn">Move</button>
                </div>
            </div>
        )
    }
}
