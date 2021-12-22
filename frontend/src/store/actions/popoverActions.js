
export function setCurrPopover(popover=null) {
    return async dispatch => {
        try {
            dispatch({ type: 'SET_CURR_POPOVER', popover })
        } catch (err) {
            console.log('Could not set popover status, ', err);
        }
    }
}