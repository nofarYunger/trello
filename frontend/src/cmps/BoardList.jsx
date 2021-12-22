import React, { Component } from 'react'
import { BoardPreview } from './BoardPreview'
import AddIcon from '@material-ui/icons/Add';

export class BoardList extends Component {
    render() {
        const { boards, onRemove, onEdit, onToggleCompose } = this.props
        return (
            <div className="board-box board-layout">
                {boards.map(board => <BoardPreview key={board._id} onRemove={onRemove} board={board} onEdit={onEdit} />)}
                <div className="board-card flex flex justify-center align-center add-board" onClick={onToggleCompose}>
                    <AddIcon className="add-board-icon" /><div className="add-board-txt">New</div></div>
            </div>
        )
    }
}
