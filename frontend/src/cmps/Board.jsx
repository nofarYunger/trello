import React, { Component } from 'react'
import { TaskList } from './TaskList'
import { boardService } from '../services/boardService'
import AddIcon from '@material-ui/icons/Add';
import { connect } from 'react-redux'
import { updateBoard } from '../store/actions/boardActions'
import { utilService } from '../services/utilService'
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { LoadingSpinner } from './LoadingSpinner';


export class _Board extends Component {
    state = {
        listColors: ['#9895E0', '#4A94F8', '#56c991', '#3cc2e0', '#eb5a46'],
        listToAdd: {
            title: '',
            tasks: [],
            style: {
                bgColor: '',
                title: { bgColor: '' }
            }
        },
        isLabelOpen: false
    }

    elListTitleRef = React.createRef()

    toggleLabels = (boolean = !this.state.isLabelOpen) => {
        this.setState({ isLabelOpen: boolean })
    }

    addListHandlers = {
        onClick: (ev) => {
            ev.stopPropagation()
            this.elListTitleRef.current.focus()
            const { setCurrPopover } = this.props
            setCurrPopover('LIST_ADD')
        },
        onSubmit: ev => {
            ev.preventDefault()
            const { board, updateBoard } = { ...this.props }
            const { listToAdd } = { ...this.state }
            const listToAddIdx = board.lists.length
            let listColor = this.state.listColors[listToAddIdx]
            if (!listColor) listColor = utilService.getRandomColor()
            listToAdd.id = utilService.makeId()
            listToAdd.style.title.bgColor = listColor
            listToAdd.style.bgColor = listToAdd.style.title.bgColor + '82'
            board.lists.push(listToAdd)
            this.setState({
                listToAdd: {
                    title: '',
                    tasks: [],
                    style: {
                        title: { bgColor: '' }
                    }
                }
            })
            var activity = { txt: `has added list (${listToAdd.title}) to the board.` }
            updateBoard(board, activity)
        }
    }

    handleChange = ({ target }) => {
        const { name, value } = target
        this.setState(prevState => ({ listToAdd: { ...prevState.listToAdd, [name]: value } }))
    }



    // activate when a dragged item is released
    onDragEnd = (res) => {
        const { destination, source, type } = res;

        if (!destination) return

        if (//if the item stayed in the same spot 
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) return;

        const copyBoard = { ...this.props.board }

        const activity = {}
        if (type === 'task') {

            const sourceListIdx = boardService.getListIdxById(copyBoard, source.droppableId)
            const destinationListIdx = boardService.getListIdxById(copyBoard, destination.droppableId)
            const task = copyBoard.lists[sourceListIdx].tasks.splice(source.index, 1);
            copyBoard.lists[destinationListIdx].tasks.splice(destination.index, 0, task[0]);

            const sourceListName = copyBoard.lists[sourceListIdx].title
            const destinationListName = copyBoard.lists[destinationListIdx].title
            activity.txt = `has moved ${task[0].title} from ${sourceListName} to ${destinationListName}`

        } else {

            const list = copyBoard.lists.splice(source.index, 1);
            copyBoard.lists.splice(destination.index, 0, list[0]);

            activity.txt = `has moved list ${list[0].title}`
        }



        this.props.updateBoard(copyBoard, activity)
    }



    render() {
        const { board, currPopover, isDashboardOpen } = this.props
        const { lists } = board
        const isCurrPopover = (currPopover === 'LIST_ADD')
        const { listToAdd, isLabelOpen } = this.state
        if (!board) return <LoadingSpinner />
        return (
            <div className={`board board-layout ${isDashboardOpen && 'slide-from-left'}`} style={{ height: "76vh" }}>

                <DragDropContext onDragEnd={this.onDragEnd} >
                    <Droppable
                        droppableId="all-columns"
                        direction="horizontal"
                        type="list"
                    >
                        {provided => (
                            <ul
                                className="lists-group clear-list flex  "
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {lists.map((list, idx) =>
                                    <TaskList
                                        toggleLabels={this.toggleLabels}
                                        isLabelOpen={isLabelOpen}
                                        key={list.id} list={list} listIdx={idx}
                                        title={list.title} {...this.props}
                                    />)}

                                {provided.placeholder}


                                <li className="add-list task-list-container flex column">

                                    <form {...this.addListHandlers} className={`add-list-form  flex column ${isCurrPopover && 'open'}`}>
                                        <div className="input-wrapper align-center flex">
                                            {!isCurrPopover && <AddIcon />}
                                            <input type="text" value={listToAdd.title} className="add-list-title" placeholder="Add New List" name="title" autoComplete="off" ref={this.elListTitleRef} onChange={this.handleChange} />
                                        </div>

                                        <button type="submit" className={`add-list-btn primary-btn ${isCurrPopover && 'open'}`}>Add list</button>
                                    </form>

                                </li>
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>

            </div >
        )
    }
}




const mapStateToProps = state => {
    return {
        currPopover: state.popoverReducer.currPopover
    }
}

const mapDispatchToProps = {
    updateBoard,
}

export const Board = connect(mapStateToProps, mapDispatchToProps)(_Board)