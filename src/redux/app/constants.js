import {
  actionCreator
} from "@Helpers/utility";

export const APP = 'CAR_RENTAL/APP/';
export const BROWSE_GLOBAL_CONFIG = actionCreator(APP, 'BROWSE_GLOBAL_CONFIG');
export const INITIAL_SOCKET = actionCreator(APP, 'INITIAL_SOCKET');
export const SET_ACTIVE_USER = actionCreator(APP, 'SET_ACTIVE_USER');
export const SET_AUTHENTICATED = actionCreator(APP, 'SET_AUTHENTICATED');
export const LOGOUT = actionCreator(APP, 'LOGOUT');