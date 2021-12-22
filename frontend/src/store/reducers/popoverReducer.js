const initialState = {
    currPopover: '',
}

//IMPORTANT TO REMEMBER TO ADD STOPPROPAGATION TO PREVENT CLOSING OF POPOVERS.

export function popoverReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_CURR_POPOVER':
            return { ...state, currPopover: action.popover }
        default:
            return state
    }
}