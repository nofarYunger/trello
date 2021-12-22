import React, { Component } from 'react'
import CloseIcon from '@material-ui/icons/Close';
import { PopoverHeader } from './PopoverHeader'
import onClickOutside from 'react-onclickoutside'


export class _ListActions extends Component {
    state = {
        listColors: ['#9895E0', '#4A94F8', '#56c991', '#3cc2e0', '#eb5a46', '#ac0275', '#67c0a4', '#E91E63'],
    }

    onSetListColor = (color) => {
        const { board, listIdx, updateBoard } = { ...this.props }
        board.lists[listIdx].style.title.bgColor = color
        const activity = {
            txt: `has changed list "${board.lists[listIdx].title}" color`
        }
        updateBoard(board, activity)
    }

    handleClickOutside = () => {
        this.props.handleClickOutside()
    }
    render() {
        const { onToggleComposer, onRemoveList, setCurrPopover } = this.props
        return (
            <div className="list-actions-popover" onClick={(ev) => ev.stopPropagation()}>
                <PopoverHeader title='List Actions' setCurrPopover={setCurrPopover} />
                <section className="popover-section">
                    <ul className="popover-section-list clear-list">
                        <li className="add-task popover-section-list-item" onClick={(ev) => {
                            setCurrPopover()
                            onToggleComposer(ev)
                        }}>Add task...</li>
                        <li className="remove-list popover-section-list-item" onClick={(ev) => {
                            setCurrPopover()
                            onRemoveList(ev)
                        }}>Remove list...</li>
                        <li className=" popover-section-list-item">
                            {/* <div className="pick-list-color">Change color...</div> */}
                            <div className="list-colors-grid">{this.state.listColors.map(color => {
                                return <div key={color} className="list-color-option" onClick={() => this.onSetListColor(color)} style={{ backgroundColor: color }}></div>
                            })}
                            </div>
                        </li>
                    </ul>
                </section>
            </div>
        )
    }
}

export const ListActions = onClickOutside(_ListActions)