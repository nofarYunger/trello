import React, { Component } from 'react'
import LabelOutlinedIcon from '@material-ui/icons/LabelOutlined'
import ChangeMembersIcon from '@material-ui/icons/PeopleOutline'
import QueryBuilderOutlinedIcon from '@material-ui/icons/QueryBuilderOutlined'
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined'
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined'
import ArrowRightAltOutlinedIcon from '@material-ui/icons/ArrowRightAltOutlined'
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import { ChangeMembersPopover } from './ChangeMembersPopover'
import { LabelsPopover } from './LabelsPopover'
import { DateTimePopover } from './DateTimePopover'
import { MoveTaskPopover } from './MoveTaskPopover'
import { CopyTaskPopover } from './CopyTaskPopover'
import { cloneDeep } from 'lodash'
import { utilService } from '../services/utilService'
import { cloudinaryService } from '../services/cloudinaryService'
import { parseISO } from 'date-fns'
import { getTime } from 'date-fns'
import { formatRelative } from 'date-fns'
import { boardService } from '../services/boardService';

export class TaskSidebar extends Component {

    state = {
        dueDate: {
            timestamp: '',
            isDone: false
        },
        taskImgUrl: ''
    }

    onAddNewList = () => {
        const { board, list, task, updateBoard, user } = this.props
        const { listIdx, taskIdx } = boardService.getListAndTaskIdxById(board, list.id, task.id)
        const copyBoard = cloneDeep(board)
        const newChecklist = {
            "id": utilService.makeId(),
            "title": "Checklist",
            "todos": []
        }
        if (!copyBoard.lists[listIdx].tasks[taskIdx].checklists) {
            copyBoard.lists[listIdx].tasks[taskIdx].checklists = []
        }
        copyBoard.lists[listIdx].tasks[taskIdx].checklists.push(newChecklist)
        const activity = {
            user,
            txt: `added ${newChecklist.title} to`,
            task,
        }
        updateBoard(copyBoard, activity)
    }

    onRemoveTask = async () => {
        const { board, list, task, updateBoard, user } = this.props
        const { listIdx, taskIdx } = boardService.getListAndTaskIdxById(board, list.id, task.id)
        const copyBoard = cloneDeep(board)
        copyBoard.lists[listIdx].tasks.splice(taskIdx, 1)
        const activity = {
            user,
            txt: `removed task`,
            task,
        }
        this.props.history.push(`/board/${board._id}`)
        await updateBoard(copyBoard, activity)
    }

    onDateChange = (ev) => {
        let parsedString = parseISO(ev.target.value)
        let timestamp = getTime(parsedString)
        const dueDate = {
            timestamp,
            isDone: false
        }
        this.setState({ dueDate })
    }

    onSaveDate = () => {

        const { board, list, task, updateBoard, user } = this.props
        const { listIdx, taskIdx } = boardService.getListAndTaskIdxById(board, list.id, task.id)
        const copyBoard = cloneDeep(board)
        if (!this.state.dueDate.timestamp) return
        copyBoard.lists[listIdx].tasks[taskIdx].dueDate = this.state.dueDate
        const activity = {
            user,
            txt: `set a due date to ${formatRelative(this.state.dueDate.timestamp, Date.now())} on`,
            task,
        }
        updateBoard(copyBoard, activity)
        this.props.togglePopover('')
    }

    onUploadImg = async ev => {
        try {
            const { secure_url } = await cloudinaryService.uploadImg(ev.target.files[0])
            this.setState({ taskImgUrl: secure_url }, async () => {
                const { board, list, task, updateBoard, user } = this.props
                const { listIdx, taskIdx } = boardService.getListAndTaskIdxById(board, list.id, task.id)
                const copyBoard = cloneDeep(board)
                let currTask = copyBoard.lists[listIdx].tasks[taskIdx]
                if (currTask.attachments?.length) {
                    currTask.attachments = [
                        ...copyBoard.lists[listIdx].tasks[taskIdx].attachments,
                        this.state.taskImgUrl
                    ]
                } else {
                    currTask.attachments = []
                    currTask.attachments.push(this.state.taskImgUrl)
                }
                const activity = {
                    user,
                    txt: `uploaded an image to`,
                    task,
                }
                await updateBoard(copyBoard, activity)
            })

        } catch (err) {
            this.setState({ msg: 'Couldnt upload your image try again' })
            console.log('problem loading the img ', err);
        }
    }

    render() {
        const { currPopover, togglePopover } = this.props
        return (
            <aside className="sidebar flex column">
                <h3 className="sidebar-heading">Actions</h3>
                <div className="sidebar-actions flex column">
                    <div className="action-container flex align-center" onClick={() => togglePopover('labels')} >
                        <span className="action-icon"><LabelOutlinedIcon /></span>
                        <span className="action-txt">Labels</span>
                        {currPopover === 'labels' && <LabelsPopover setCurrPopover={() => togglePopover('')} {...this.props} />}

                    </div>
                    <div className="action-container flex align-center" onClick={() => togglePopover('members')}>
                        <span className="action-icon"><ChangeMembersIcon /></span>
                        <span className="action-txt">Members</span>
                        {currPopover === 'members' && <ChangeMembersPopover setCurrPopover={() => togglePopover('')} {...this.props} />}
                    </div>
                    <div className="action-container flex align-center" onClick={() => togglePopover('date')}>
                        <span className="action-icon"><QueryBuilderOutlinedIcon /></span>
                        <span className="action-txt">Due Date</span>
                        {currPopover === 'date' && <DateTimePopover
                            onClick={(ev) => ev.stopPropagation()}
                            setCurrPopover={() => togglePopover('')}
                            onDateChange={this.onDateChange}
                            onSaveDate={this.onSaveDate}
                            {...this.props} />}

                    </div>
                    <div className="action-container flex align-center" onClick={this.onAddNewList}>
                        <span className="action-icon"><CheckBoxOutlinedIcon /></span>
                        <span className="action-txt">Checklist</span>
                    </div>
                    <div className="action-container flex align-center">
                        <label className="action-icon" style={{ width: '100%', cursor: 'pointer' }}>  <ImageOutlinedIcon className="add-img-icon" />
                            <input onChange={this.onUploadImg} type="file" hidden />
                            <span className="action-txt">Image</span>
                        </label>
                    </div>
                    <div className="action-container flex align-center" onClick={() => togglePopover('move')}>
                        <span className="action-icon"><ArrowRightAltOutlinedIcon /></span>
                        <span className="action-txt">Move</span>
                        {currPopover === 'move' && <MoveTaskPopover setCurrPopover={() => togglePopover('')} {...this.props} />}
                    </div>
                    <div className="action-container flex align-center" onClick={() => togglePopover('copy')}>
                        <span className="action-icon"><FileCopyOutlinedIcon /></span>
                        <span className="action-txt">Copy</span>
                        {currPopover === 'copy' && <CopyTaskPopover setCurrPopover={() => togglePopover('')} {...this.props} />}
                    </div>
                    <div className="action-container flex align-center" onClick={this.onRemoveTask}>
                        <span className="action-icon"><DeleteOutlineOutlinedIcon /></span>
                        <span className="action-txt">Delete</span>
                    </div>
                </div>
            </aside>
        )
    }
}
