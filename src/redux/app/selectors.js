import { createSelector } from "reselect";

export const selectApp = state => state.App;
export const makeSelectAppConfig = () =>
  createSelector(selectApp, App => App.appConfig);
export const makeSelectSocket = () =>
  createSelector(selectApp, App => App.socket);
export const makeSelectActiveUser = () =>
  createSelector(selectApp, App => App.activeUser);
export const makeSelectIsAuthenticated = () =>
  createSelector(selectApp, App => App.isAuthenticated);
export const makeSelectProfile = () =>
  createSelector(selectApp, App => App.profile);
