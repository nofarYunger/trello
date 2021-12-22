import { sessionService } from "../../services/sessionStorageService";
import { userService } from "../../services/userService";

export function setUser(user, isNewUser, isGoogle) {
  return async (dispatch) => {
    var loggedUser;
    try {
      if (isNewUser) loggedUser = await userService.signup(user, isGoogle);
      else loggedUser = await userService.login(user);
      // delete loggedUser.password
      const action = {
        type: "SET_USER",
        loggedUser,
      };
      // sessionService.store('loggedUserDB', loggedUser)
      dispatch(action);
    } catch (err) {
      console.log("had problem seting the user", err);
    }
  };
}

export function clearUser() {
  return async (dispatch) => {
    try {
      userService.logout();

      const action = {
        type: "CLEAR_USER",
      };
      dispatch(action);
    } catch {
      console.log("couldnt log out!!");
    }
  };
}
export function setUserAfterRefresh(loggedUser) {
  return (dispatch) => {
    const action = {
      type: "SET_USER",
      loggedUser,
    };
    dispatch(action);
  };
}
