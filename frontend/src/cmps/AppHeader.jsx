import React, { Component } from 'react'
import { NavLink, withRouter } from 'react-router-dom'

import { connect } from 'react-redux'
import { clearUser, setUserAfterRefresh } from '../store/actions/userAction'
import { eventBusService } from '../services/eventBusService'
import { userService } from '../services/userService'

class _AppHeader extends Component {
    state = {
        navBgc: ''
    }

    componentDidMount() {
        document.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.setState({ navBgc: 'colored-nav' })
            } else {
                this.setState({ navBgc: 'homepage-nav' })
            }
        })

        const loggedUser = userService.checkLoggedUser()
        if (loggedUser) this.props.setUserAfterRefresh(loggedUser)

    }


    render() {
        const currPath = this.props.history.location.pathname
        const { navBgc } = this.state
        const { user } = this.props
        return (
            <header className={`main-nav-header flex align-center  ${currPath === '/' ? navBgc : ''} ${currPath === '/login' || currPath === '/board' ? "homepage-nav" : ""}`}>
                <ul className="main-nav  flex clear-list flex ">
                    <li className="logo"><span><NavLink to="/">Chello</NavLink></span></li>
                    {user && <li className="user-desc flex align-center"> Hello, {user.fullname.substring(0, user.fullname.indexOf(' '))} </li>}
                    <li><NavLink to="/board"><span>Boards</span></NavLink></li>
                    {!user && <li><NavLink to="/login"><span >Login</span></NavLink></li>}
                    {user && <li className="logout flex align-center" onClick={this.props.clearUser} > Logout </li>}
                </ul>
            </header>
        )
    }
}



const mapStateToProps = state => {
    return {
        isOverlayOpen: state.boardReducer.isOverlayOpen,
        user: state.userReducer.user

    }
}


const mapDispatchToProps = {
    clearUser,
    setUserAfterRefresh
}




export const AppHeader = connect(mapStateToProps, mapDispatchToProps)(withRouter(_AppHeader))