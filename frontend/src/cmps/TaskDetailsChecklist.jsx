import React, { Component } from 'react'
import { boardService } from '../services/boardService'
import { utilService } from '../services/utilService'
import { connect } from 'react-redux'
import { updateBoard } from '../store/actions/boardActions'
import { cloneDeep } from 'lodash'
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { LoadingSpinner } from './LoadingSpinner'

export class _TaskDetailsChecklist extends Component {

    state = {
        checklists: [],
        newTodo: {
            txt: ''
        },
        newTodos: []


    }

    elTitleRef = React.createRef()


    componentDidMount() {
        const { checklists } = this.props.task
        if (checklists) {

            const copyChecklists = cloneDeep(checklists)
            this.setState({ checklists: copyChecklists })
        } else {
            this.setState({ checklists: [] })
        }
    }

    componentDidUpdate(prevProps) {
        const { checklists } = this.props.task
        if (prevProps.task.checklists !== checklists) {

            const copyChecklists = cloneDeep(checklists)
            this.setState({ checklists: copyChecklists })
        }
    }



    handleInput = (idx, { target }) => {
        const field = target.name
        const value = target.value
        const checkListToUpdate = cloneDeep(this.state.checklists[idx])
        const checklistsCopy = cloneDeep(this.state.checklists)
        checkListToUpdate[field] = value
        checklistsCopy[idx] = checkListToUpdate
        this.setState({ checklists: checklistsCopy })
    }


    handleCheckbox = (todoIdx, listIdx, ev) => {
        const copyChecklists = cloneDeep(this.state.checklists)
        const todo = copyChecklists[listIdx].todos[todoIdx]
        todo.isDone = ev.target.checked
        this.setState({ checklists: copyChecklists }, () => {
            if (todo.isDone) {
                this.onUpdateBoard('completed', todo.title)
            } else {
                this.onUpdateBoard('unchecked', todo.title)
            }
        })
    }

    handleTodoChange = (todoIdx, listIdx, ev) => {
        const copyChecklists = cloneDeep(this.state.checklists)
        copyChecklists[listIdx].todos[todoIdx].title = ev.target.value
        this.setState({ checklists: copyChecklists })
    }

    percentDone = (checklist) => {
        const doneTodos = checklist.todos.filter(todo => todo.isDone)
        const percent = parseInt((doneTodos.length / checklist.todos.length) * 100)
        return percent
    }

    handleNewTodo = (ev) => {
        const checklistIdx = ev.target.name
        const value = ev.target.value
        const newTodos = [...this.state.newTodos]
        newTodos[checklistIdx] = value
        this.setState({ newTodos })
    }

    onEnterPress = ev => {
        if (!ev.target.value) return
        if (ev.keyCode === 13 && ev.shiftKey === false) {
            ev.preventDefault()
            if (ev.target.name === 'title') {
                this.onUpdateBoard('changeTitle')
            } else {
                this.onUpdateBoard('changeTxt')

            }
        }
    }

    onUpdateBoard = async (activityType, title) => {
        const { board, list, task } = this.props
        const { checklists } = this.state
        const boardCopy = cloneDeep(board)
        const listIdx = boardService.getListIdxById(board, list.id)
        const taskIdx = boardService.getTaskIdxById(list, task.id)
        boardCopy.lists[listIdx].tasks[taskIdx].checklists = checklists
        const { user } = this.props
        let txt
        if (activityType === 'completed') {
            txt = `completed "${title}" on task `
        } else if (activityType === 'changeTxt') {
            txt = 'changed a todo in task'
        } else if (activityType === 'unchecked') {
            txt = `unchecked "${title}" on task`
        } else if (activityType === 'remove') {
            txt = `removed "${title}" from task`
        } else if (activityType === 'newTodo') {
            txt = `added a todo: "${title}" to task`
        } else {
            txt = 'changed checklist title in'
        }
        const activity = {
            user,
            txt,
            task,
        }
        await this.props.updateBoard(boardCopy, activity)
        this.elTitleRef.current?.blur()
    }

    onRemoveTodo = (todoIdx, listIdx, ev) => {
        let copyChecklists = cloneDeep(this.state.checklists)
        const todoToRemove = copyChecklists[listIdx].todos[todoIdx]
        copyChecklists[listIdx].todos.splice(todoIdx, 1)
        if (!copyChecklists[listIdx].todos.length) {
            copyChecklists.splice(listIdx, 1)
        }
        this.setState({ checklists: copyChecklists }, () => this.onUpdateBoard('remove', todoToRemove.title))

    }

    onAddItem = (listIdx, ev) => {
        if (!ev.target.value) return
        if (ev.keyCode === 13 && ev.shiftKey === false) {
            const todoToAdd = {
                id: utilService.makeId(),
                title: this.state.newTodos[listIdx],
                isDone: false
            }
            const copyChecklists = cloneDeep(this.state.checklists)
            copyChecklists[listIdx].todos.push(todoToAdd)
            this.setState({ checklists: copyChecklists }, () => {
                this.onUpdateBoard('newTodo', todoToAdd.title)
                const newTodos = [...this.state.newTodos]
                newTodos[listIdx] = ''
                this.setState({ newTodos })
            })
        }
    }

    onDeleteChecklist = (checklistIdx) => {
        const boardCopy = cloneDeep(this.props.board)
        const { list, task, updateBoard } = this.props
        const { listIdx, taskIdx } = boardService.getListAndTaskIdxById(boardCopy, list.id, task.id)
        boardCopy.lists[listIdx].tasks[taskIdx].checklists.splice(checklistIdx, 1)
        updateBoard(boardCopy)
    }

    render() {
        const { checklists, newTodos } = this.state
        const { percentDone } = this
        if (!checklists) return <LoadingSpinner />
        return (
            <div className="task-checklist">
                { checklists?.map((checklist, listIdx) => {
                    return <div className="checklist-header">
                        <CheckBoxOutlinedIcon style={{ position: 'absolute', left: '-30px', top: '3px' }} />
                        <div className="flex align-center space-between">

                            <textarea style={{ width: '70%' }}
                                className="task-textarea"
                                value={checklist.title}
                                name="title"
                                onChange={(ev) => this.handleInput(listIdx, ev)}
                                spellCheck="false"
                                onKeyDown={this.onEnterPress}
                                ref={this.elTitleRef}
                            />
                            <span onClick={() => this.onDeleteChecklist(listIdx)}><button className="secondary-btn" style={{ padding: '5px 8px' }}>Delete</button></span>
                        </div>
                        {checklist?.todos.length ? <LinearProgressWithLabel value={percentDone(checklist)} /> : ''}

                        {checklist?.todos &&
                            checklist.todos.map((todo, todoIdx) => {
                                return <div className="task-todo-container flex align-center justify-center">
                                    <input
                                        type="checkbox"
                                        name="checkbox"
                                        onChange={(ev) => this.handleCheckbox(todoIdx, listIdx, ev)}
                                        checked={todo.isDone}
                                    />
                                    <input
                                        type="text"
                                        className={`${todo.isDone && "checked"} todo-title task-todo-input`}
                                        value={todo.title}
                                        onChange={(ev) => this.handleTodoChange(todoIdx, listIdx, ev)}
                                        onKeyDown={this.onEnterPress}
                                        autoComplete="false"
                                        onBlur={this.onUpdateBoard}
                                    />
                                    <DeleteOutlinedIcon className="todo-delete-btn" onClick={(ev) => this.onRemoveTodo(todoIdx, listIdx, ev)} />
                                </div>

                            })

                        }
                        <input
                            type="text"
                            autoComplete="false"
                            name={listIdx}
                            placeholder="Add an item"
                            className="task-todo-input"
                            value={newTodos[listIdx]}
                            onChange={this.handleNewTodo}
                            onKeyDown={(ev) => this.onAddItem(listIdx, ev)}
                            onBlur={() => {
                                const newTodo = { txt: '' }
                                this.setState({ newTodo })
                            }}
                        />
                    </div>
                })
                }
            </div >
        )
    }
}



const mapDispatchToProps = {
    updateBoard,
}

const mapStateToProps = state => {
    return {
        currListIdx: state.boardReducer.currListIdx,
    }
}

export const TaskDetailsChecklist = connect(mapStateToProps, mapDispatchToProps)(_TaskDetailsChecklist)


function LinearProgressWithLabel(props) {
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {

    value: PropTypes.number.isRequired,
};

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
});

export default function LinearWithValueLabel() {
    const classes = useStyles();
    const [progress, setProgress] = React.useState(10);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
        }, 800);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div className={classes.root}>
            <LinearProgressWithLabel value={progress} />
        </div>
    );
}

