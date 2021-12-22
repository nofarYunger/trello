import React, { Component } from 'react'
import DateTime from './MUIDateTime'
import { PopoverHeader } from './PopoverHeader'

export class DateTimePopover extends Component {


    render() {
        const { className } = this.props
        return (
            <div className={`due-date-popover quick-edit-popover ${className && className}`} onClick={(ev) => ev.stopPropagation()}>
                <PopoverHeader title='Due Date' setCurrPopover={this.props.setCurrPopover} />
                <div className="due-date-body flex justify-center align-center">
                    <DateTime onChange={this.props.onDateChange} />
                    <button onClick={() => this.props.onSaveDate()} className="date-close-btn primary-btn">Save</button>
                </div>
            </div>
        )
    }
}

