import React, { Component } from 'react'
import { updateBoard } from '../store/actions/boardActions'
import { boardService } from '../services/boardService'
import { connect } from 'react-redux'
import { PopoverHeader } from './PopoverHeader';
import { cloneDeep } from 'lodash'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

export class _LabelsPopover extends Component {
    state = {
        labels: [
            { id: '101', color: "#61bd4f", title: '', isPicked: false },
            { id: '102', color: "#f2d602", title: '', isPicked: false },
            { id: '103', color: "#f99f1b", title: '', isPicked: false },
            { id: '104', color: "#eb5a46", title: '', isPicked: false },
            { id: '105', color: "#c377e0", title: '', isPicked: false },
            { id: '107', color: "#1f79bf", title: '', isPicked: false },
            { id: '108', color: "#3cc2e0", title: '', isPicked: false },
        ],
        elRefs: []
    }


    componentDidMount() {
        this.markExistingLabels()
        this.setRefs()
    }

    markExistingLabels() {
        const { task } = this.props
        if (!task.labels?.length) return;
        let { labels } = { ...this.state }
        const labelsIdsMap = labels.map(label => label.id)
        task.labels.forEach(taskLabel => {
            if (labelsIdsMap.includes(taskLabel.id)) {
                const labelIdx = labels.findIndex(currLabel => currLabel.id === taskLabel.id)
                labels[labelIdx].isPicked = true
                labels[labelIdx].title = taskLabel.title
            }
        })
        this.setState({ labels })
    }

    setRefs() {
        const refs = []
        this.state.labels.forEach(label => {
            refs.push(React.createRef())
        })
        this.setState({ elRefs: refs })

    }
    onToggleLabel = ev => {
        ev.stopPropagation()
        const { labels } = { ...this.state }
        const { board, list, task, updateBoard } = { ...this.props }
        const labelId = ev.target.dataset.id
        const labelIdx = this.getLabelIdxById(labelId)
        labels[labelIdx].isPicked = !labels[labelIdx].isPicked
        this.setState({ labels }, async () => {
            delete labels[labelIdx].isPicked
            const { listIdx, taskIdx } = boardService.getListAndTaskIdxById(board, list.id, task.id)
            const activity = { task }
            if (task.labels?.some(label => label.id === labelId)) {
                const taskLabelIdx = task.labels.findIndex(label => label.id === labelId)
                task.labels.splice(taskLabelIdx, 1)
                board.lists[listIdx].tasks[taskIdx] = task
                activity.txt = `has removed label from task`
            }
            else {
                task.labels = task.labels ? [...task.labels, labels[labelIdx]] : [labels[labelIdx]]
                board.lists[listIdx].tasks[taskIdx] = task
                activity.txt = `has added label to task`
            }

            this.markExistingLabels()
            await updateBoard(board, activity)
        })
    }

    getLabelIdxById(labelId) {
        const { labels } = this.state
        return labels.findIndex(label => label.id === labelId)
    }

    handleChange = (labelIdx, ev) => {
        const { labels } = this.state
        const labelsCopy = cloneDeep(labels)
        labelsCopy[labelIdx].title = ev.target.value
        this.setState({ labels: labelsCopy })
    }

    onEnterPress = ev => {
        if (!ev.target.value) return
        if (ev.keyCode === 13 && ev.shiftKey === false) {
            ev.preventDefault()
            const { board, list, task, updateBoard } = this.props
            const { listIdx, taskIdx } = boardService.getListAndTaskIdxById(board, list.id, task.id)
            const boardCopy = cloneDeep(board)
            const { labels } = this.state
            const labelsToAdd = labels.filter(label => label.isPicked)
            boardCopy.lists[listIdx].tasks[taskIdx].labels = labelsToAdd
            updateBoard(boardCopy)
        }
    }

    onEditLabel = (labelIdx, ev) => {
        ev.stopPropagation()
        const { elRefs } = this.state
        elRefs[labelIdx].current.focus()
    }


    render() {
        const { labels, elRefs } = this.state
        return (
            <div className="labels-popover quick-edit-popover" >
                <PopoverHeader title='Labels' setCurrPopover={this.props.setCurrPopover} />
                <section className="popover-section">
                    <ul className="popover-section-list clear-list flex column">
                        <h3 className="popover-section-header">Labels</h3>
                        {labels.map((label, labelIdx) => {
                            return (

                                <div className="flex" key={label.id}>
                                    <input
                                        data-id={label.id}
                                        onClick={this.onToggleLabel}
                                        onMouseDown={(ev) => ev.preventDefault()}
                                        key={label.id}
                                        onChange={(ev) => this.handleChange(labelIdx, ev)}
                                        value={labels[labelIdx].title}
                                        onKeyDown={this.onEnterPress}
                                        ref={elRefs[labelIdx]}
                                        className={`popover-section-list-item ${label.isPicked && 'picked'}`} style={{ backgroundColor: label.color }}></input>
                                    <EditOutlinedIcon onClick={(ev) => this.onEditLabel(labelIdx, ev)} />
                                </div>

                            )
                        })}
                    </ul>
                </section>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        board: state.boardReducer.currBoard
    }
}

const mapDispatchToProps = {
    updateBoard,
}

export const LabelsPopover = connect(mapStateToProps, mapDispatchToProps)(_LabelsPopover)
