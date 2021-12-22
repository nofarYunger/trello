import React, { Component } from 'react'
import BoardMemberImg from './BoardMemberImg'
import { PopoverHeader } from './PopoverHeader'
import { boardService } from '../services/boardService'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { BackgroundMenu } from './BackgroundMenu'
import { styleService } from '../services/styleService'


export class SideMenu extends Component {
    state = {
        activites: [],
        currSection: 'activity',
        bgs: []
    }

    componentDidMount() {
        this.loadBgs()
    }

    loadBgs = async () => {
        const bgs = await styleService.getBgOptions()
        this.setState({ bgs })
    }

    onChangeBoardBg = (bg) => {
        const { board, updateBoard } = { ...this.props }
        board.style.bg = bg
        updateBoard(board)
    }
    onOpenTask = (taskId) => {
        const list = boardService.getListByTaskId(this.props.board, taskId)
        this.props.history.push(`/board/${this.props.board._id}/${list.id}/${taskId}`)
    }

    onChangeSection = (section) => {
        this.setState({ currSection: section })
    }

    render() {
        const { setCurrPopover } = this.props;
        const { board } = { ...this.props },
            { activities } = board
        const isCurrPopover = this.props.currPopover === 'ACTIVITY_MENU'
        const { currSection, bgs } = this.state
        return (
            <div className={`activity-menu ${isCurrPopover && 'open'}`} onClick={ev => { ev.stopPropagation() }}>
                <PopoverHeader title='Menu' setCurrPopover={setCurrPopover} />

                {
                    (currSection === 'activity' && <section className="popover-section flex column  activities-section">
                        <button className="change-background-go-to-btn" onClick={() => { this.onChangeSection('background') }}>Change background</button>
                        <ul className="popover-section-list clear-list">
                            {activities.map(activity => {
                                return <li key={activity.id} className="popover-section-list-item">
                                    <BoardMemberImg member={activity.byMember} />
                                    <div className="activity-txt">
                                        <span className="activity-by">{activity.byMember.fullname} </span>
                                        <span className="txt">
                                            {activity.txt} {activity.task && <span className="task-title" onClick={() => { this.onOpenTask(activity.task.id) }}>{activity.task.title}</span>}</span>
                                        <div className="activity-at">
                                            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                                        </div>
                                    </div>
                                </li>
                            })}
                        </ul>
                    </section>)
                }

                {
                    (currSection === 'background' && <BackgroundMenu goBack={() => { this.onChangeSection('activity') }} backgrounds={bgs} onChangeBoardBg={this.onChangeBoardBg} />)
                }
            </div>
        )
    }
}
