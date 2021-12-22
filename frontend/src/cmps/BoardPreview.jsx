import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { BoardActions } from './BoardActions'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { LoadingSpinner } from './LoadingSpinner';

export class BoardPreview extends Component {

    state = {
        isBoardActionsOpen: false,
        isBoardHovered: false
    }
    toggleBoardActions = (toggle = !this.state.isBoardActionsOpen) => {
        this.setState({ isBoardActionsOpen: toggle })
    }

    boardPreviewHandlers = {
        onMouseEnter: () => {
            this.setState({ isBoardHovered: true })
        },
        onMouseLeave: () => {
            this.setState({ isBoardHovered: false })
        }
    }

    render() {
        const { board, onRemove, onEdit } = this.props
        if (!board) return <LoadingSpinner/>
        return (
            <div {...this.boardPreviewHandlers}
                className={`board-card flex flex justify-center align-center ${this.state.isBoardActionsOpen && 'board-actions-open'}`} style={{ backgroundImage: board.style?.bg }} >
                <Link to={`/board/${board._id}`}><h1>{board.title}</h1></Link>
                <div className="card-overlay"></div>
                <div className="board-actions-popover-wrapper">
                    {this.state.isBoardHovered && <MoreHorizIcon className={`toggle-actions-icon`} onClick={this.toggleBoardActions} />}
                    {this.state.isBoardActionsOpen &&
                        <BoardActions
                            board={board}
                            onRemoveBoard={onRemove}
                            onEditBoard={onEdit}
                            {...this.props}
                            toggleBoardActions={this.toggleBoardActions} />}
                </div>
            </div>
        )
    }
}
