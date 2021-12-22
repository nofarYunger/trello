import React, { Component } from 'react'
import { cloneDeep } from 'lodash'
import { boardService } from '../services/boardService'
import { formatRelative } from 'date-fns'
import { connect } from 'react-redux'
import { updateBoard } from '../store/actions/boardActions'
import { ChangeMembersPopover } from './ChangeMembersPopover'
import BoardMemberImg from './BoardMemberImg'
import { LabelsPopover } from './LabelsPopover'
import AddIcon from '@material-ui/icons/Add'

export class _TaskDetailsInfo extends Component {
    state = {
        isMemberModalOpen: false,
    }


    onToggleMembersModal = () => {
        this.setState({ isMemberModalOpen: !this.state.isMemberModalOpen })
    }

    onDateCheckChange = (listIdx, taskIdx, ev) => {
        const { currBoard, updateBoard, user, task } = this.props
        const copyBoard = cloneDeep(currBoard)
        const taskDueDate = copyBoard.lists[listIdx].tasks[taskIdx].dueDate
        taskDueDate.isDone = ev.target.checked
        let txt
        if (taskDueDate.isDone) {
            txt = 'marked the due date complete on'
        } else {
            txt = 'marked the due date incomplete on'
        }
        const activity = {
            user,
            txt,
            task,
        }
        updateBoard(copyBoard, activity)
    }


    render() {
        const { currBoard, currPopver, togglePopover } = this.props
        const { listId, taskId } = this.props.match.params
        const { listIdx, taskIdx } = boardService.getListAndTaskIdxById(currBoard, listId, taskId)
        const list = currBoard.lists[listIdx]
        const task = currBoard.lists[listIdx].tasks[taskIdx]
        const { isMemberModalOpen } = this.state
        return (
            <div className="details-info">
                <div className="flex" style={{ flexWrap: 'wrap' }}>

                    {task?.members?.length ? <div className="card-detail">
                        <h3>Members</h3>
                        <div className="member-imgs flex align-center">

                            {task.members.map(member => {
                                return <div key={member._id} className="task-member-img">
                                    {/* <img src={member.imgUrl} /> */}
                                    <BoardMemberImg member={member} />
                                </div>
                            })}
                            <div className="task-add-member small-btn-bgc" title="Add Member">
                                {<AddIcon onClick={this.onToggleMembersModal} style={{ height: '32px' }} />}
                                {isMemberModalOpen && <ChangeMembersPopover board={currBoard} list={list} task={task} setCurrPopover={this.onToggleMembersModal} currListIdx={this.props.currListIdx}
                                    currTaskIdx={this.props.currTaskIdx}
                                    updateBoard={this.props.updateBoard}
                                />}
                            </div>
                        </div>
                    </div> : ''}
                    {(task.labels?.length) ? <div className="card-detail detail-labels">
                        <h3>Labels</h3>
                        <div className="task-labels flex">
                            {task.labels.map(label => {
                                return <span onClick={() => togglePopover('labels')} key={label.id} className="task-label-preview flex align-center justify-center" style={{ backgroundColor: label.color }}>
                                    <span className="label-title">{label?.title}</span>
                                </span>
                            })}
                            <div className="task-add-label small-btn-bgc" title="Add Label">
                                {<AddIcon onClick={() => togglePopover('labels')} style={{ height: '32px' }} />}
                                {currPopver === 'labels' && <LabelsPopover setCurrPopover={() => togglePopover('')} {...this.props} />}
                            </div>
                        </div>
                    </div> : ''}
                    {task.dueDate?.timestamp && <div className="card-detail">
                        <h3>Due Date</h3>
                        <div className="task-due-time flex align-center justify-center">
                            <span style={{ marginLeft: '5px' }}>
                                <span className="date-checkbox">
                                    <input checked={task.dueDate.isDone} onChange={(ev) => this.onDateCheckChange(listIdx, taskIdx, ev)} type="checkbox" />
                                </span>
                                {formatRelative(task?.dueDate?.timestamp, Date.now())}</span>
                            <span className={`date-complete ${!task.dueDate.isDone && "hidden"}`}>COMPLETE</span>
                        </div>
                    </div>}
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        currBoard: state.boardReducer.currBoard,
        currListIdx: state.boardReducer.currListIdx,
        currTaskIdx: state.boardReducer.currTaskIdx,

    }
}

const mapDispatchToProps = {
    updateBoard
}

export const TaskDetailsInfo = connect(mapStateToProps, mapDispatchToProps)(_TaskDetailsInfo)
