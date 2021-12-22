import { PopoverHeader } from './PopoverHeader'
import onClickOutside from 'react-onclickoutside'
import { Component } from 'react'

 class _BoardActions extends Component {
 
    handleClickOutside = ev => {
        this.props.toggleBoardActions(false)
    }

    render() {
        const { board, onEditBoard, onRemoveBoard, toggleBoardActions } = this.props
        return (
            <div className="board-actions-popover" onClick={(ev) => ev.stopPropagation()}>
                <PopoverHeader title='Board Actions' setCurrPopover={(ev) => {
                    ev.stopPropagation()
                    toggleBoardActions()
                }} />
                <section className="popover-section">
                    <ul className="popover-section-list clear-list">
                        <li className="add-task popover-section-list-item" onClick={(ev) => {
                            toggleBoardActions()
                            onEditBoard(board)
                        }}>Edit board...</li>
                        <li className="remove-list popover-section-list-item" onClick={(ev) => {
                            toggleBoardActions()
                            onRemoveBoard(board._id)
                        }}>Remove board...</li>
                    </ul>
                </section>
            </div>
        )
    }
}

export const BoardActions = onClickOutside(_BoardActions)