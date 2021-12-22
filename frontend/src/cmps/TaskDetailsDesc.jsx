import React, { Component } from 'react'
import { boardService } from '../services/boardService'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { updateBoard } from '../store/actions/boardActions'
import { cloneDeep } from 'lodash'
import NotesOutlinedIcon from '@material-ui/icons/NotesOutlined'
import CloseIcon from '@material-ui/icons/Close'

export class _TaskDetailsDesc extends Component {
    state = {
        currTask: '',
        isTxtAreaOpen: false,

    }

    componentDidMount() {
        const { task } = this.props
        this.setState({ currTask: task })
    }


    handleInput = ({ target }) => {
        const field = target.name
        const value = target.value
        this.setState(prevState => {
            return {
                currTask: {
                    ...prevState.currTask,
                    [field]: value
                }
            }
        })
    }

    toggleControls = (boolean) => {
        this.setState({ isTxtAreaOpen: boolean })
    }

    closeInput = () => {
        this.setState({ currTask: this.props.task }, () => this.toggleControls(false))
    }

    saveDescription = (ev) => {
        const { board, user } = this.props
        const { listId, taskId } = this.props.match.params
        const { listIdx, taskIdx } = boardService.getListAndTaskIdxById(board, listId, taskId)
        let task = cloneDeep(this.props.task)
        const currTask = cloneDeep(this.state.currTask)
        task = currTask
        const boardCopy = cloneDeep(board)
        boardCopy.lists[listIdx].tasks[taskIdx] = task
        const activity = {
            user,
            txt: `changed task description on`,
            task,
        }
        this.props.updateBoard(boardCopy, activity)
        this.toggleControls(false)
    }

    render() {
        const { board, list, task } = this.props
        const { currTask, isTxtAreaOpen } = this.state
        return (
            <div className="task-middle-details">
                <div className="details-description">
                    <NotesOutlinedIcon style={{ position: 'absolute', left: '-30px', top: '3px' }} />
                    <h3 className="task-section-heading">Description</h3>
                    {(task.description)
                        ? <textarea className="task-textarea" style={{ fontSize: '16px', fontWeight: '400px', height: 'auto' }}
                            value={currTask.description}
                            name="description"
                            spellCheck="false"
                            onChange={this.handleInput}
                            rows="3"
                            onFocus={() => this.toggleControls(true)}
                            onBlur={() => this.saveDescription()}
                        />
                        : <textarea className="task-textarea" style={{ fontSize: '16px', fontWeight: '400px', height: 'auto', backgroundColor: 'rgba(9,30,66,.04)' }}
                            value={currTask.description}
                            placeholder="Add a more detailed description..."
                            name="description"
                            spellCheck="false"
                            onChange={this.handleInput}
                            rows="3"
                            onFocus={() => this.toggleControls(true)}
                            onBlur={() => this.saveDescription()}
                        />
                    }
                    <div className={`task-desc-buttons flex align-center ${!isTxtAreaOpen && "hidden"}`}>
                        <button onClick={this.saveDescription} className="primary-btn">Save</button>
                        <CloseIcon onClick={() => this.closeInput()} />
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        board: state.boardReducer.currBoard,
        currListIdx: state.boardReducer.currListIdx,
        currTaskIdx: state.boardReducer.currTaskIdx,

    }
}

const mapDispatchToProps = {
    updateBoard
}

export const TaskDetailsDesc = connect(mapStateToProps, mapDispatchToProps)(withRouter(_TaskDetailsDesc))
