import React, { Component } from 'react'
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { boardService } from '../services/boardService'
import { cloneDeep } from 'lodash'



export class TaskDetailsAttachments extends Component {

    onDeleteImg = (imgIdx) => {
        const { board, list, task, updateBoard, user } = this.props
        const { listIdx, taskIdx } = boardService.getListAndTaskIdxById(board, list.id, task.id)
        const boardCopy = cloneDeep(board)
        boardCopy.lists[listIdx].tasks[taskIdx].attachments.splice(imgIdx, 1)
        const activity = {
            user,
            txt: `removed an image from`,
            task,
        }
        updateBoard(boardCopy, activity)

    }
    render() {
        const { board, list, task } = this.props
        const taskImages = task.attachments
        return (
            <section className="attachments">
                <div className="details-images">
                    <ImageOutlinedIcon style={{ position: 'absolute', left: '-30px', top: '3px' }} />
                    <h3 className="task-section-heading">Images</h3>
                    {(taskImages ? <div className="img-list">
                        {taskImages.map((img, imgIdx) => {
                            return <div className="img-preview flex" style={{ backgroundImage: `url('${img}')` }}>
                                <DeleteOutlinedIcon onClick={() => this.onDeleteImg(imgIdx)} className="todo-delete-btn" style={{ position: 'absolute', right: '0' }} />
                            </div>
                        })}
                    </div>

                        : ''
                    )}
                </div>
            </section>
        )
    }
}
