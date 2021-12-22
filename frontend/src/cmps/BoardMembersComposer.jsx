import React, { Component } from 'react'
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import AddIcon from '@material-ui/icons/Add';
import { userService } from '../services/userService';
import { LoadingSpinner } from './LoadingSpinner';
import BoardMemberImg from './BoardMemberImg';

export class BoardMemberComposer extends Component {
    state = {
        users: [],
        filterBy: ''
    }

    componentDidMount() {
        this.getUsers()
    }


    filterMembers = ({ target }) => {
        const value = target.value
        this.setState({ filterBy: value }, () => this.getUsers())

    }


    getUsers = async () => {
        const { filterBy } = this.state
        const usersToShow = await userService.filterUsersBy(filterBy)
        this.setState({ users: usersToShow })
    }



    render() {
        const { isBoardMember, toggleMember, closeModal } = this.props
        const { users } = this.state
        if (!users) return <LoadingSpinner/>
        return (
            <div className="change-members-popover boards " onClick={(ev) => { ev.stopPropagation() }}>
                <div className="popover-header boards flex align-center justify-center">
                    <span className="popover-header-title"> <input type="text" placeholder="Add Members" name="filterBy" value={this.state.filterMembers} onChange={this.filterMembers} /></span>
                    <CloseIcon className="close-icon" onClick={() => closeModal()} />
                </div>
                <section className="popover-section">
                    <ul className="popover-section-list clear-list">
                        <h3 className="popover-section-header ">Board members</h3>
                        {users.map(user => {
                            return <li key={user._id} data-id={user._id} onClick={() => toggleMember(user)} style={{ height: '60px' }} className={`popover-section-list-item flex align-center ${isBoardMember(user._id) && 'picked'}`}>
                                {isBoardMember(user._id) ? <DoneIcon /> : <AddIcon />}
                                <BoardMemberImg member={user} size={40} />
                                <span className="member-name" data-id={user._id}>{user.fullname} </span>

                            </li>
                        })}
                    </ul>
                </section>
            </div>
        )
    }
}

