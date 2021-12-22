import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateBoard, toggleOverlay } from '../store/actions/boardActions'
import { boardService } from '../services/boardService'
import { utilService } from '../services/utilService'
import { setCurrPopover } from '../store/actions/popoverActions'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { ListActions } from './ListActions'
import { LoadingSpinner } from './LoadingSpinner'

export class _ListTitle extends Component {
    state = {
        title: '',
        isListActionsOpen: false
    }

    elListTitleRef = React.createRef()

    componentDidMount() {
        const { title } = this.props
        this.setState({ title })
    }

    updateBoard = async (board) => {
        await this.props.updateBoard(board)
    }

    listTitleHandlers = {
        onChange: (ev) => {
            const { name, value } = ev.target
            this.setState({ [name]: value })
        },
        onBlur: ({ target }) => {
            const board = { ...this.props.board }
            const { list } = this.props
            const listIdx = boardService.getListIdxById(board, list.id)
            board.lists[listIdx][target.name] = target.value
            target.style.backgroundColor = list.style.title.bgColor
            target.style.color = '#fff'
            this.props.updateBoard(board)
        },
        onFocus: ({ target }) => {
            target.style.backgroundColor = '#fff'
            target.style.color = '#212121'
            target.style.borderRadius = "2px"
        }
    }

    editIconHandlers = {
        onMouseEnter: ({ target }) => {
            const { list } = this.props
            const bgColor = utilService.lightenColor(list.style.title.bgColor, 10)
            target.style.backgroundColor = bgColor
        },
        onMouseLeave: ({ target }) => {
            target.style.backgroundColor = 'transparent'
        }
    }
    onPressEnter = (ev) => {
        ev.preventDefault()
        this.elListTitleRef.current.blur()
    }

    onToggleListActions = (ev) => {
        this.setState({ isListActionsOpen: !this.state.isListActionsOpen })
    }

    handleClickOutside = ev => {
        this.setState({ isListActionsOpen: false })
    }

    render() {
        const { list, isComposerOpen } = this.props
        const { isListActionsOpen } = this.state
        if (!list) return <LoadingSpinner />
        return (
            <form onSubmit={this.onPressEnter}
                autoComplete="off"
                className="list-title flex align-center"
                style={{ backgroundColor: `${list.style.title.bgColor}` }}>
                <input
                    {...this.listTitleHandlers}
                    placeholder="Enter list title"
                    ref={this.elListTitleRef}
                    value={this.state.title}
                    name="title" />
                <div className="list-actions-popover-wrapper">
                    {<MoreHorizIcon
                        {...this.editIconHandlers}
                        onClick={this.onToggleListActions}

                        className={`toggle-actions-icon ${isComposerOpen && 'close'}`} />}
                    {isListActionsOpen && <ListActions {...this.props} handleClickOutside={this.handleClickOutside} />}
                </div>
            </form>
        )
    }
}



const mapStateToProps = state => {
    return {
        board: state.boardReducer.currBoard,
    }
}

const mapDispatchToProps = {
    updateBoard,
    setCurrPopover,
    toggleOverlay
}

export const ListTitle = connect(mapStateToProps, mapDispatchToProps)(_ListTitle)