import React, { Component, Fragment } from 'react'

export class QuickEditButton extends Component {

    state = {
        isLabelsPopoverOpen: false
    }

    render() {
        const { title, Component, setCurrPopover, currPopover, Icon } = this.props
        return (
            <>
            <a className="quick-task-editor-buttons-item js-edit-labels" onClick={ev => {
                ev.stopPropagation()
                currPopover === title ? setCurrPopover() : setCurrPopover(title)
            }} data-for={'editLabels'}>
                <span className="quick-task-editor-buttons-item-text flex align-center">{Icon && <Icon className="quick-task-editor-buttons-item-icon" />}{title}</span>
            </a >
                { Component && (currPopover === title) && <Component {...this.props} />}
            </>
        )
    }
}



