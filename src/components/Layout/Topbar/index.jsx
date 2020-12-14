import React, { memo } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import Globals from "globals.js";
import { Redirect } from "react-router";
import { makeSelectIsAuthenticated } from "redux/app/selectors";
import { createStructuredSelector } from "reselect";
import { bindActionCreators } from "redux";
import { logOut } from "redux/app/actions";
import { Link } from "react-router-dom";

const Topbar = ({ logOut, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Redirect to="/signin" />;
  }
  let profile = Globals.currentUser;
  return (
    <div id="kt_header" className="kt-header kt-grid__item  kt-header--fixed ">
      <div className="kt-header-menu-wrapper" id="kt_header_menu_wrapper">
        <div
          id="kt_header_menu"
          className="kt-header-menu kt-header-menu-mobile  kt-header-menu--layout-default "
        />
      </div>
      <div className="kt-header__topbar">
        <div className="kt-header__topbar-item kt-header__topbar-item--user">
          <div className="kt-header__topbar-wrapper">
            <div className="kt-header__topbar-user">
              <span className="kt-header__topbar-welcome kt-hidden-mobile">
                Hi,
              </span>
              <Link to="/profile">
                <span className="kt-header__topbar-username kt-hidden-mobile">
                  {profile.fullName}
                </span>
              </Link>
              <img
                className="kt-hidden"
                alt="Pic"
                src="./assets/media/users/300_25.jpg"
              />
              <span className="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--rounded kt-badge--bold">
                {profile && profile.fullName
                  ? profile.fullName.charAt(0).toUpperCase()
                  : ""}
              </span>
            </div>
          </div>
        </div>
        <div className="kt-header__topbar-item kt-header__topbar-item--search">
          <div className="kt-header__topbar-wrapper" data-offset="10px,0px">
            <span onClick={logOut} className="kt-header__topbar-icon">
              <i className="flaticon-logout" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = createStructuredSelector({
  isAuthenticated: makeSelectIsAuthenticated(),
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      logOut,
    },
    dispatch
  );
const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(withConnect, memo)(Topbar);
