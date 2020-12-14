import { createRoutine } from "redux-saga-routines";
import {
  BROWSE_GLOBAL_CONFIG,
  INITIAL_SOCKET,
  SET_ACTIVE_USER,
  SET_AUTHENTICATED,
  LOGOUT
} from "./constants";
const browseGlobalConfig = createRoutine(BROWSE_GLOBAL_CONFIG, null, {
  prefix: BROWSE_GLOBAL_CONFIG
});
const initialSocket = socket => {
  return {
    type: INITIAL_SOCKET,
    payload: {
      socket
    }
  };
};
const setActiveUser = activeUser => {
  return {
    type: SET_ACTIVE_USER,
    payload: {
      activeUser
    }
  };
};
const setAuthenticated = ({ isAuthenticated, profile }) => {
  return {
    type: SET_AUTHENTICATED,
    payload: {
      isAuthenticated,
      profile
    }
  };
};
const logOut = () => {
  return {
    type: LOGOUT
  };
};
export {
  browseGlobalConfig,
  initialSocket,
  setActiveUser,
  setAuthenticated,
  logOut
};
