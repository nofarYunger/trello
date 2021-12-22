import { Component } from 'react'
import React, { Fragment } from 'react'
import { boardService } from '../services/boardService.js'
import { userService } from '../services/userService.js'
import { withRouter } from 'react-router-dom'
import { utilService } from '../services/utilService.js'
import { styleService } from '../services/styleService.js'
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import CloseIcon from '@material-ui/icons/Close';
import { BoardMemberComposer } from './BoardMembersComposer.jsx'

export class _BoardComposer extends Component {

    state = {
        isMembersPreviewOpen: false,
        newBoard: {
            title: '',
            members: [],
            style: {
                bg: '#3d3d3d'
            }

        },
        users: [],
        bgs: [],
        filterMembersBy: '',
        btnTxt: 'Create Board'
    }


    componentDidUpdate(prevProps) {
        const { board } = this.props
        if (prevProps.board === this.props.board) return
        if (this.props.board) {
            this.setState({
                newBoard: {
                    title: board.title,
                    style: {
                        bg: board.style.bg
                    },
                    members: board.members,
                    _id: board._id
                },
                btnTxt: 'Update Board'
            })
        }
    }

    componentDidMount() {
        this.getUsers()
        this.loadBgs()
    }

    componentWillUnmount() {
        this.setState({
            isMembersPreviewOpen: false,
            newBoard: {
                title: '',
                members: [],
                style: {
                    bg: '#3d3d3d'
                }

            },
            users: [],
            bgs: [],
            filterMembersBy: '',
            btnTxt: 'Create Board'
        })
    }

    onAddBoard = async (ev) => {
        ev.preventDefault()
        var { newBoard } = this.state
        if (newBoard._id) {
            newBoard = { ...this.props.board, ...newBoard }
        }

        const activity = {
            txt: 'updated the board'
        }
        const savedBoard = await boardService.save(newBoard, activity)//add a new board to data
        this.props.history.push(`/board/${savedBoard._id}`)//then gos to the board page
    }



    //gets all the bg style options from the service
    loadBgs = async () => {
        const bgs = await styleService.getBgOptions()
        this.setState({ bgs })
    }


    //gets the filterd users from the data
    getUsers = async () => {
        const { filterMembersBy } = this.state
        const usersToShow = await userService.filterUsersBy(filterMembersBy)
        this.setState({ users: usersToShow })
    }


    handleInput = ({ target }) => {
        const value = target.value
        const field = target.name
        this.setState(prevState => {
            return {
                newBoard: {
                    ...prevState.newBoard,
                    [field]: value
                }
            }
        })
    }


    setBg = (bg) => {
        this.setState({
            newBoard: {
                ...this.state.newBoard,
                style: { ...this.state.newBoard.style, bg }
            }
        })
    }


    toggleMemberPreview = () => {
        const memberPreview = this.state.isMembersPreviewOpen
        this.setState({ isMembersPreviewOpen: !memberPreview })
    }


    closeMembersPreview = () => {
        this.setState({ isMembersPreviewOpen: false })
    }


    isBoardMember = (id) => {
        const { members } = this.state.newBoard
        return members?.some(member => member._id === id)
    }



    toggleMember = (user) => {
        let { members } = { ...this.state.newBoard }
        const isMember = this.isBoardMember(user._id)

        if (isMember) {//if the member is part of the board remove it
            members = members.filter(member => member._id !== user._id)
        } else { //else put it in
            members.unshift(user)
        }

        const copyBoard = { ...this.state.newBoard }
        copyBoard.members = members
        this.setState({ newBoard: copyBoard })
    }


    render() {
        const { bgs, newBoard, isMembersPreviewOpen, btnTxt } = this.state
        const { onToggleCompose } = this.props
        return (
            <Fragment>

                <form className="board-composer board-composer-layout flex column" onClick={(ev) => ev.stopPropagation()} onSubmit={this.onAddBoard} >
                    <div className="close-btn flex align-center justify-center">
                        <CloseIcon onClick={onToggleCompose} />
                    </div>
                    <div className="flex justify-center align-center board-details-wrapper">

                        <div className="demo-board board-card  flex justify-center align-center" style={{ backgroundImage: newBoard.style.bg, backgroundSize: "cover" }}>
                            <textarea className="title" onChange={this.handleInput} placeholder="Enter Board Title " name="title" autoComplete="off" value={newBoard.title} />
                        </div>
                        <span className="edit-board-members">
                            <GroupAddIcon className="addIcon" onClick={this.toggleMemberPreview} />
                            {isMembersPreviewOpen && <BoardMemberComposer isBoardMember={this.isBoardMember} toggleMember={this.toggleMember} closeModal={this.closeMembersPreview} />}
                        </span>
                    </div>

                    <div className="bg-options">
                        {bgs.map(bg => {
                            return <div className="bg-preview" key={utilService.makeId()} onClick={() => this.setBg(bg)} style={{ backgroundImage: bg, backgroundSize: "cover" }}> </div>
                        })}
                    </div>


                    <button className="primary-btn compose-board-btn">{btnTxt}</button>
                </form>
            </Fragment >
        )
    }
}

export const BoardComposer = withRouter(_BoardComposer)
