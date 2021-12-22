import { boardService } from "../../services/boardService";
import { userService } from '../../services/userService';
import { socketService } from '../../services/socketService'

export function setBoard(boardId) {
  return async (dispatch) => {
    try {
      var board;
      if (!boardId) board = null;
      else board = await boardService.getById(boardId);

      dispatch({ type: "SET_BOARD", board });
    } catch (err) {
      console.log("Couldnt get Board", err);
    }
  };
}

export function updateBoard(board, activity, isEmitting = true) {
  //ACTIVITY PARAM MUST BE AN OBJECT!
  return async (dispatch) => {
    try {
      const action = {
        type: "UPDATE_BOARD",
        updatedBoard: { ...board }
      };
      dispatch(action);
      if (isEmitting) {
        const loggedinUser = await userService.getLoggedinUser()
        const updatedBoard = await boardService.save(board, activity)
        socketService.emit('board updated', { updatedBoard, loggedinUser, activity })
      }
    } catch (err) {
      console.log("couldnt update board", err);
    }
  };
}

export function toggleTask() {
  return async (dispatch) => {
    try {
      dispatch({ type: "TOGGLE_TASK" });
    } catch (err) {
      console.log("Board actions, failed to toggle task", err);
    }
  };
}

export function toggleOverlay() {
  return async (dispatch) => {
    try {
      dispatch({ type: "TOGGLE_OVERLAY" });
    } catch (err) {
      console.log("Couldnt put overlay", err);
    }
  };
}

export function setCurrListAndTaskIdx(listIdx, taskIdx) {
  return async (dispatch) => {
    try {
      const action = {
        type: "SET_CURR_LIST_AND_TASK",
        listIdx,
        taskIdx,
      };
      dispatch(action);
    } catch (err) {
      console.log("Borad actions, failed to get curr list", err);
    }
  };
}
