import React, { Component } from 'react'
import { utilService } from '../services/utilService'
import { PopoverHeader } from './PopoverHeader'
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { cloneDeep } from 'lodash'

export class CopyTaskPopover extends Component {
    state = {
        selectedListIdx: 0
    }

    handleInput = (ev) => {
        this.setState({ selectedListIdx: ev.target.value })
    }

    onCopyClick = async () => {
        const { board, task, updateBoard, setCurrPopover } = this.props
        const { selectedListIdx } = this.state
        const copyBoard = cloneDeep(board)
        const copyTask = cloneDeep(task)
        copyTask.id = utilService.makeId()
        copyTask.createdAt = Date.now()
        copyBoard.lists[selectedListIdx].tasks.push(copyTask)
        await updateBoard(copyBoard)
        setCurrPopover()
    }

    render() {
        const { board } = this.props
        return (
            <div className="copy-task-popover" onClick={(ev) => ev.stopPropagation()}>
                <PopoverHeader title="Copy Task" setCurrPopover={this.props.setCurrPopover} />
                <div className="copy-task-body flex column  justify-center align-center">
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
                    <button onClick={this.onCopyClick} className="date-close-btn primary-btn">Copy</button>
                </div>
            </div>
        )
    }
}
