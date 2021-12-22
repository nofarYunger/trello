
const initialState = {
    currBoard: null,
    isTaskOpen: false,
    currListIdx: null,
    currTaskIdx: null,
    isOverlayOpen: false,
    isPopoverOpen: false
}

export function boardReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_BOARD':
            return { ...state, currBoard: action.board }
        case 'TOGGLE_TASK':
            return { ...state, isTaskOpen: !state.isTaskOpen }
        case 'SET_CURR_LIST_AND_TASK':
            return { ...state, currListIdx: action.listIdx, currTaskIdx: action.taskIdx }
        case "UPDATE_BOARD":
            return { ...state, currBoard: action.updatedBoard }
        case "TOGGLE_OVERLAY":
            return { ...state, isOverlayOpen: !state.isOverlayOpen }
        case "SET_POPOVER_STATUS":
            return { ...state, isPopoverOpen: action.isPopover }
        default:
            return state
    }
}