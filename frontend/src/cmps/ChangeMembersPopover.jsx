import React, { Component } from 'react'
import { boardService } from '../services/boardService'
import DoneIcon from '@material-ui/icons/Done'
import { PopoverHeader } from './PopoverHeader'
import BoardMemberImg from './BoardMemberImg'

export class ChangeMembersPopover extends Component {
    state = {
        currTask: {},
    }

    loadTaskMembers() {
        const { task } = this.props
        return task.members
    }

    onUpdateTaskMember = async (ev) => {
        ev.stopPropagation()
        const { membersRef } = this.props
        const { id } = ev.target.dataset
        const { board } = { ...this.props }
        const { members } = board
        const member = members.find(member => member._id === id)
        this.isTaskMember(member._id) ? await this.onRemoveTaskMember(member)
            : await this.onAddTaskMember(member)
        if (membersRef?.current) {
            membersRef.current.clientWidth > 97 ?
                membersRef.current.classList.add('narrow-down')
                : membersRef.current.classList.remove('narrow-down')
        }
    }

    onAddTaskMember = async (member) => {
        const { board, updateBoard } = { ...this.props }
        const { listIdx, taskIdx } = this.listAndTaskIdx
        const currTask = board.lists[listIdx].tasks[taskIdx]
        const { _id, username, fullname, imgUrl } = member
        const miniMember = { _id, username, fullname, imgUrl }
        currTask.members ? currTask.members.push(miniMember) : currTask.members = [miniMember]
        this.setState({ currTask })
        const activity = { txt: `has added ${miniMember.fullname} to task`, task: { ...currTask } }
        await updateBoard(board, activity)
    }

    onRemoveTaskMember = async (member) => {
        const { board, updateBoard, task } = { ...this.props },
            { members } = task,
            memberIdx = members.findIndex(currMember => member._id === currMember._id)
        const { listIdx, taskIdx } = this.listAndTaskIdx
        const { fullname } = { ...members[memberIdx] }
        const currTask = board.lists[listIdx].tasks[taskIdx]
        currTask.members.splice(memberIdx, 1)
        this.setState({ currTask })
        const activity = { txt: `has removed ${fullname} from task`, task: { ...currTask } }
        await updateBoard(board, activity)
    }

    isTaskMember(id) {
        const currTask = this.props.task
        const isTaskMember = currTask.members?.some(currMember => id === currMember._id)
        return isTaskMember
    }

    get listAndTaskIdx() {
        const { board, list, task } = this.props
        const { listIdx, taskIdx } = boardService.getListAndTaskIdxById(board, list.id, task.id)
        return { listIdx, taskIdx }
    }

    render() {
        const boardMembers = this.props.board.members
        return (
            <div className="change-members-popover " onClick={(ev) => { ev.stopPropagation() }}>
                <PopoverHeader title='Members' setCurrPopover={this.props.setCurrPopover} />
                <section className="popover-section">
                    <ul className="popover-section-list clear-list">
                        <h3 className="popover-section-header">Board members</h3>
                        {boardMembers.map(member => {
                            return <li key={member._id} data-id={member._id} onClick={this.onUpdateTaskMember} className={`popover-section-list-item flex align-center ${this.isTaskMember(member._id) && 'picked'}`}>
                                    <BoardMemberImg member={member} size={40} className="board-member-img"/>
                                
                                <span data-id={member._id}>{member.fullname}  ({member.username})</span>
                                {this.isTaskMember(member._id) && <DoneIcon className="picked-icon" />}
                            </li>
                        })}
                    </ul>
                </section>
            </div>
        )
    }
}

