import React, { Component } from 'react'
import { BoardFilter } from './BoardFilter'
import { NotificationPopover } from './NotificationPopover'
import NotificationsIcon from '@material-ui/icons/NotificationsNone';
import MoreHorizOutlinedIcon from '@material-ui/icons/MoreHorizOutlined';
// import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import DashboardOutlinedIcon from '@material-ui/icons/TimelineOutlined';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { SideMenu } from './SideMenu'
import BoardMemberImg from './BoardMemberImg'

export class BoardHeader extends Component {

    state = {
        currBadgeCount: 0,
    }


    incNotificationBadge = (notification) => {
        this.setState({ currBadgeCount: this.state.currBadgeCount + 1 }, () => {
        })
    }
    render() {
        const { board, setCurrPopover, currPopover, onToggleDashboard, className, isDashboardOpen } = this.props
        const { members } = board
        const { currBadgeCount } = this.state
        const isCurrPopover = currPopover === 'NOTIFICATION_POPOVER'
        // const isActivityCurrPopover = currPopover === 'ACTIVITY_MENU'
        return (
            <>
                <header className={`board-header board-layout  ${className}`}>
                    {isDashboardOpen && <ArrowBackIcon className="go-back-icon" onClick={() => onToggleDashboard()} />}
                    <div className="board-title">{board.title}</div>
                    <div className="members-nav-display flex">
                        {members.map(member => {
                            return <div key={member._id} className="board-member-img-wrapper">

                                <BoardMemberImg member={member} />

                            </div>
                        })}
                    </div>
                    <ul className="board-nav clear-list flex">
                        {/* <li className="board-filter-container"><BoardFilter /></li> */}
                        {/* <li className={`notification-icon-container ${currBadgeCount && 'unread'}`}>
                            <NotificationsIcon onClick={ev => {
                                ev.stopPropagation()
                                this.setState({ currBadgeCount: 0 })
                                setCurrPopover('NOTIFICATION_POPOVER')
                            }} />
                        </li> */}
                        <li title="dashboard">
                            <DashboardOutlinedIcon
                                className="dashboard-icon"
                                onClick={() => onToggleDashboard()}
                            />
                        </li>
                        <li title="activity"><MoreHorizOutlinedIcon className="activity-menu-icon" onClick={ev => {
                            ev.stopPropagation()
                            setCurrPopover('ACTIVITY_MENU')
                        }} /></li>
                    </ul>
                </header>
                {isCurrPopover
                    &&
                    <NotificationPopover {...this.props} />}
                <SideMenu {...this.props} />
            </>
        )
    }
}
