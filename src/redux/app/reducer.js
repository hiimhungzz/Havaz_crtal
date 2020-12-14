/* eslint-disable default-case */

import { browseGlobalConfig } from "./actions";
import produce from "immer";
import {
  INITIAL_SOCKET,
  SET_ACTIVE_USER,
  SET_AUTHENTICATED,
  LOGOUT
} from "./constants";
import Globals from "globals.js";
import { setupSession } from "@Helpers/utility";
setupSession();
const initState = {
  loading: false,
  socket: null,
  appConfig: {},
  isAuthenticated: Globals.isAuthenticated,
  profile: Globals.currentUser
};

const appReducer = (state = initState, action) =>
  produce(state, draft => {
    const { payload } = action;
    switch (action.type) {
      case browseGlobalConfig.SUCCESS:
        draft.appConfig = {
          ...payload
        };
        setTimeout(() => {
          window.KTApp.init(window.KTAppOptions);
          window.KTLayout.init();
        }, 200);
        break;
      case browseGlobalConfig.FAILURE:
        draft.loading = false;
        break;
      case INITIAL_SOCKET:
        draft.socket = payload.socket;
        break;
      case SET_ACTIVE_USER:
        draft.activeUser = payload.activeUser;
        break;
      case SET_AUTHENTICATED:
        draft.isAuthenticated = payload.isAuthenticated;
        draft.profile = payload.profile;
        break;
      case LOGOUT:
        draft.isAuthenticated = false;
        Globals.clear();
        break;
    }
  });
export default appReducer;
