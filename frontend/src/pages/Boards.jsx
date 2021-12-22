import React, { Component, Fragment } from 'react'
import { boardService } from '../services/boardService.js'
import { BoardList } from '../cmps/BoardList'
import { BoardComposer } from '../cmps/BoardComposer.jsx'
import { LoadingSpinner } from '../cmps/LoadingSpinner.jsx'

export class Boards extends Component {

    state = {
        boards: [],
        isComposerOpen: false,
        boardToEdit: null
    }

    componentDidMount() {
        this.loadBoards()
    }

    loadBoards = async () => {
        const boards = await boardService.query()
        this.setState({ boards })
    }


    onRemove = async (boardId) => {
        await boardService.remove(boardId)
        let boards = this.state.boards
        const newBoards = boards.filter(currBoard => currBoard._id !== boardId)
        this.setState({ boards: newBoards })
    }

    onToggleCompose = () => {
        const lastState = this.state.isComposerOpen
        this.setState({ isComposerOpen: !lastState })//opens the add board form
    }

    editBoard = (board) => {
        this.setState({ isComposerOpen: true, boardToEdit: board })
    }

    render() {

        const { boards, isComposerOpen, boardToEdit } = this.state
        if (!boards.length) return <LoadingSpinner />
        return (
            <Fragment>
                <div className="glass-container">
                    <div className="glass-screen  ">
                        <h3 className="boards-title board-layout">Your boards</h3>
                        <BoardList boards={boards} onRemove={this.onRemove} onEdit={this.editBoard} onToggleCompose={this.onToggleCompose} />
                    </div>
                </div>
                <div className="boards-bg "></div>
                <div onClick={this.onToggleCompose} className={`composer-screen flex justify-center align-center ${!isComposerOpen && 'transparent'}`}>
                    <BoardComposer board={boardToEdit} onToggleCompose={this.onToggleCompose} />
                </div>

            </Fragment>
        )
    }
}
