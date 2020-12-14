import React, { memo, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import SubHeader from "./SubHeader";
import Error from "../Error";
import ErrorBoundary from "react-error-boundary";
import { browseGlobalConfig } from "../../redux/app/actions";
import { connect } from "react-redux";
import { compose } from "recompose";

const AuthorizedLayout = ({ location, children, onBrowseGlobalConfig }) => {
  useEffect(() => {
    onBrowseGlobalConfig();
  }, [onBrowseGlobalConfig]);
  return (
    <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver kt-page">
      <Sidebar path={location.pathname} />
      <div
        className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-wrapper"
        id="kt_wrapper"
      >
        <Topbar />
        <div
          className="kt-content kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor"
          id="kt_content"
        >
          <SubHeader path={location.pathname} />
          <div className="kt-container kt-container--fluid kt-grid__item kt-grid__item--fluid p-0">
            <ErrorBoundary FallbackComponent={Error}>{children}</ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
};
const mapDispatchToProps = dispatch => {
  return {
    onBrowseGlobalConfig: () => dispatch(browseGlobalConfig())
  };
};
const withConnect = connect(null, mapDispatchToProps);
export default compose(withConnect, memo)(AuthorizedLayout);
