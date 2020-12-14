import { createSelector } from 'reselect';
export const selectAuth = state => state.Auth; 
export const makeSelectTabId  = () =>
createSelector(
  selectAuth,
  Auth => Auth.tabId,
);
export const makeSelectIsAuthenticated  = () =>
createSelector(
  selectAuth,
  Auth => Auth.isAuthenticated,
);