import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Board } from '../cmps/Board'
import { setBoard, toggleOverlay, updateBoard } from '../store/actions/boardActions'
import { setCurrPopover } from '../store/actions/popoverActions'
import { BoardHeader } from '../cmps/BoardHeader'
import { TaskDetails } from '../cmps/TaskDetails'
import { socketService } from '../services/socketService'
import { Dashboard } from '../cmps/Dashboard'
import { LoadingSpinner } from '../cmps/LoadingSpinner.jsx'


class _TrelloApp extends Component {

    state = {
        isDashboardOpen: false,
        isBoardClosed: false
    }

    componentDidMount = async () => {
        const { boardId } = this.props.match.params
        socketService.setup()
        socketService.emit('member connected', { userId: '123', boardId })
        socketService.on('board updated fs', this.onBoardUpdated)
        await this.props.setBoard(boardId)
    }

    toggleDashboard = (boolean = !this.state.isDashboardOpen) => {
        this.setState({ isDashboardOpen: boolean }, () => {
            this.state.isBoardClosed ? this.setState({ isBoardClosed: false }) :
                setTimeout(() => {
                    this.setState({ isBoardClosed: true })
                }, 1000)
        })
    }

    async componentWillUnmount() {
        socketService.off('board updated fs', this.onBoardUpdated)
        socketService.terminate()
        const { setBoard } = this.props
        setBoard(null)
    }

    componentDidUpdate(prevProps) {
        const { boardId } = this.props.match.params
        if (prevProps.match.params.boardId !== boardId) {
            this.props.setBoard(boardId)
        }
    }

    onBoardUpdated = async ({ updatedBoard }) => {
        const board = { ...updatedBoard }
        console.log('INSIDE ONBOARDUPDATED');
        this.props.updateBoard(board, null, false)
    }

    render() {
        const { board, setCurrPopover } = this.props
        const { isDashboardOpen, isBoardClosed } = this.state
        if (!board) return <LoadingSpinner />
        return (
            <div onClick={() => {
                setCurrPopover()
                // if (isOverlayOpen) toggleOverlay()
            }} style={{ paddingTop: '54px' }}>
                <div className="main-bg" style={{ backgroundImage: board.style.bg }} onClick={ev => { ev.stopPropagation() }}></div>
                <div className={`bg-overlay `}>
                    <BoardHeader {...this.props} className={isDashboardOpen && 'dashboard-mode'} isDashboardOpen={isDashboardOpen} onToggleDashboard={this.toggleDashboard} />
                    {!isBoardClosed && <Board {...this.props} isDashboardOpen={isDashboardOpen} />}
                    {this.props.match.params.listId && <TaskDetails />}
                </div>
                <div
                    className={`dashboard-screen ${isDashboardOpen && 'slide-to-right'} ${!isDashboardOpen && 'hidden'}`}>
                    <Dashboard board={board} />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        board: state.boardReducer.currBoard,
        isOverlayOpen: state.boardReducer.isOverlayOpen,
        currPopover: state.popoverReducer.currPopover,
        user: state.userReducer.user
    }
}

const mapDispatchToProps = {
    setBoard,
    updateBoard,
    setCurrPopover,
    toggleOverlay
}

export const TrelloApp = connect(mapStateToProps, mapDispatchToProps)(_TrelloApp)