import React, { memo } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import styled from "styled-components";
import { connect } from "react-redux";
import { isEmpty } from "@Helpers/utility";
import IntlMessages from "@Components/Utility/intlMessages";
import { createStructuredSelector } from "reselect";
import { compose } from "recompose";
import { makeSelectAppConfig } from "redux/app/selectors";
import { injectIntl } from "react-intl";
import _ from "lodash";
import A from "@Components/A";
import Globals from "globals.js";

const SidebarWrapper = styled.div`
  .kt-aside__brand-logo h5 {
    font-family: Segoe UI Bold, Tahoma, Geneva, Verdana, sans-serif;
    font-weight: 700;
    color: white;
    margin-bottom: 0;
  }
  #kt_aside_menu {
    margin-top: 0;
    .kt-menu__nav {
      padding-top: 0;
      li a {
        width: 100% !important;
      }
      li:first-child {
        margin-top: 0;
      }
      .kt-menu__section-text {
        font-size: 17px;
        font-weight: bold;
        color: #fff;
      }
      .kt-menu__link-text {
        font-size: 16px;
        font-weight: normal;
      }
    }
  }
  .kt-menu__link-icon {
    svg {
      height: 16px !important;
      width: 16px !important;
    }
  }
  .kt-aside-menu
    .kt-menu__nav
    > .kt-menu__item:not(.kt-menu__item--parent):not(.kt-menu__item--open):not(.kt-menu__item--here):not(.kt-menu__item--active):hover,
  .kt-menu__item--active {
    border-left: 3px solid #ffc10e;
  }
  .not-auth {
    display: none;
  }
  .kt-menu__submenu .kt-menu__item {
    margin-top: 5px !important;
  }
`;

const Sidebar = ({ path, intl, appConfig }) => {
  let sideBar = Object.keys(isEmpty(appConfig.left_menu, {}));
  let sideBarRender = [];
  let profile = Globals.currentUser;
  sideBar.forEach((key, keyId) => {
    sideBarRender.push(
      <li key={`section-${keyId}`} className="kt-menu__section ">
        <h4 className="kt-menu__section-text">{key}</h4>
        <i className="kt-menu__section-icon flaticon-more-v2" />
      </li>
    );
    let sectionArr = appConfig.left_menu[key];
    sectionArr.forEach((value, valueId) => {
      let translatedText = intl.formatMessage({ id: value.name });
      if (!value.hasSub) {
        sideBarRender.push(
          <li
            key={value.route}
            className={classNames({
              "kt-menu__item": true,
              "kt-menu__item--active":
                value.route === path ||
                (value.route === "/demoBooking" &&
                  (path === "/demoBooking" || path === "/"))
            })}
          >
            <Link
              data-html="true"
              data-toggle="kt-tooltip"
              data-placement="right"
              data-skin="dark"
              data-title={`<h6 class='kt-font-havaz'>${translatedText}</h6>`}
              to={value.route}
              className="kt-menu__link"
            >
              <i className={`kt-menu__link-icon ${value.icon}`} />
              <IntlMessages className="kt-menu__link-text" id={value.name} />
              {value.demo ? (
                <span className="kt-badge kt-badge--warning kt-badge--inline kt-badge--pill kt-badge--rounded">
                  mới
                </span>
              ) : null}
            </Link>
          </li>
        );
      } else {
        sideBarRender.push(
          <li
            key={`subMenu-${valueId}-${keyId}`}
            className={classNames({
              "kt-menu__item kt-menu__item--submenu": true
            })}
            aria-haspopup="true"
            data-ktmenu-submenu-toggle="hover"
          >
            <A
              data-html="true"
              data-toggle="kt-tooltip"
              data-placement="right"
              data-skin="dark"
              data-title={`<h6 class='kt-font-havaz'>${translatedText}</h6>`}
              className="kt-menu__link kt-menu__toggle"
            >
              <i className="kt-menu__link-icon fa fa-chart-line" />
              <IntlMessages className="kt-menu__link-text" id={value.name} />
              <i className="kt-menu__ver-arrow la la-angle-right" />
            </A>
            <div className="kt-menu__submenu ">
              <span className="kt-menu__arrow" />
              <ul className="kt-menu__subnav">
                {value.subs.map((sub, subId) => {
                  // if (sub.name === "sidebar.report.exportBooking") {
                  //   return (
                  //     <li
                  //       key={sub.route}
                  //       className={classNames({
                  //         "kt-menu__item ": true,
                  //         "kt-menu__item--active": sub.route === path
                  //       })}
                  //       aria-haspopup="true"
                  //     >
                  //       <div className="kt-menu__link " onClick={this.onApi}>
                  //         <i className="kt-menu__link-bullet kt-menu__link-bullet--dot">
                  //           <span></span>
                  //         </i>
                  //         <span className="kt-menu__link-text">
                  //           <IntlMessages
                  //             className="kt-menu__link-text"
                  //             id={sub.name}
                  //           />
                  //         </span>
                  //       </div>
                  //     </li>
                  //   );
                  // }
                  return (
                    <li
                      key={sub.route}
                      className={classNames({
                        "kt-menu__item ": true,
                        "kt-menu__item--active": sub.route === path
                      })}
                      aria-haspopup="true"
                    >
                      <Link to={sub.route} className="kt-menu__link ">
                        <i className="kt-menu__link-bullet kt-menu__link-bullet--dot">
                          <span></span>
                        </i>
                        <span className="kt-menu__link-text">
                          <IntlMessages
                            className="kt-menu__link-text"
                            id={sub.name}
                          />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </li>
        );
      }
    });
  });
  return (
    <SidebarWrapper>
      <div
        className="kt-aside kt-aside--fixed kt-grid__item kt-grid kt-grid--desktop kt-grid--hor-desktop"
        id="kt_aside"
      >
        <div className="kt-aside__brand kt-grid__item" id="kt_aside_brand">
          <div className="kt-aside__brand-logo">
            <Link className="d-flex align-items-center" to="/dashboard">
              <h5>{_.get(profile, "webName") || "CAR RENTAL"}</h5>
            </Link>
          </div>
          <div className="kt-aside__brand-tools">
            <button
              className="kt-aside__brand-aside-toggler"
              onClick={e => {
                e.preventDefault();
                let body = document.body;
                if (body.classList.contains("kt-aside--minimize")) {
                  body.classList.remove("kt-aside--minimize");
                } else {
                  body.classList.add("kt-aside--minimize");
                }
              }}
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xlink="http://www.w3.org/1999/xlink"
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  version="1.1"
                  className="kt-svg-icon"
                >
                  <g
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                  >
                    <polygon id="Shape" points="0 0 24 0 24 24 0 24" />
                    <path
                      d="M5.29288961,6.70710318 C4.90236532,6.31657888 4.90236532,5.68341391 5.29288961,5.29288961 C5.68341391,4.90236532 6.31657888,4.90236532 6.70710318,5.29288961 L12.7071032,11.2928896 C13.0856821,11.6714686 13.0989277,12.281055 12.7371505,12.675721 L7.23715054,18.675721 C6.86395813,19.08284 6.23139076,19.1103429 5.82427177,18.7371505 C5.41715278,18.3639581 5.38964985,17.7313908 5.76284226,17.3242718 L10.6158586,12.0300721 L5.29288961,6.70710318 Z"
                      id="Path-94"
                      fill="#000000"
                      fillRule="nonzero"
                      transform="translate(8.999997, 11.999999) scale(-1, 1) translate(-8.999997, -11.999999) "
                    />
                    <path
                      d="M10.7071009,15.7071068 C10.3165766,16.0976311 9.68341162,16.0976311 9.29288733,15.7071068 C8.90236304,15.3165825 8.90236304,14.6834175 9.29288733,14.2928932 L15.2928873,8.29289322 C15.6714663,7.91431428 16.2810527,7.90106866 16.6757187,8.26284586 L22.6757187,13.7628459 C23.0828377,14.1360383 23.1103407,14.7686056 22.7371482,15.1757246 C22.3639558,15.5828436 21.7313885,15.6103465 21.3242695,15.2371541 L16.0300699,10.3841378 L10.7071009,15.7071068 Z"
                      id="Path-94"
                      fill="#000000"
                      fillRule="nonzero"
                      opacity="0.3"
                      transform="translate(15.999997, 11.999999) scale(-1, 1) rotate(-270.000000) translate(-15.999997, -11.999999) "
                    />
                  </g>
                </svg>
              </span>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xlink="http://www.w3.org/1999/xlink"
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  version="1.1"
                  className="kt-svg-icon"
                >
                  <g
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                  >
                    <polygon id="Shape" points="0 0 24 0 24 24 0 24" />
                    <path
                      d="M12.2928955,6.70710318 C11.9023712,6.31657888 11.9023712,5.68341391 12.2928955,5.29288961 C12.6834198,4.90236532 13.3165848,4.90236532 13.7071091,5.29288961 L19.7071091,11.2928896 C20.085688,11.6714686 20.0989336,12.281055 19.7371564,12.675721 L14.2371564,18.675721 C13.863964,19.08284 13.2313966,19.1103429 12.8242777,18.7371505 C12.4171587,18.3639581 12.3896557,17.7313908 12.7628481,17.3242718 L17.6158645,12.0300721 L12.2928955,6.70710318 Z"
                      id="Path-94"
                      fill="#000000"
                      fillRule="nonzero"
                    />
                    <path
                      d="M3.70710678,15.7071068 C3.31658249,16.0976311 2.68341751,16.0976311 2.29289322,15.7071068 C1.90236893,15.3165825 1.90236893,14.6834175 2.29289322,14.2928932 L8.29289322,8.29289322 C8.67147216,7.91431428 9.28105859,7.90106866 9.67572463,8.26284586 L15.6757246,13.7628459 C16.0828436,14.1360383 16.1103465,14.7686056 15.7371541,15.1757246 C15.3639617,15.5828436 14.7313944,15.6103465 14.3242754,15.2371541 L9.03007575,10.3841378 L3.70710678,15.7071068 Z"
                      id="Path-94"
                      fill="#000000"
                      fillRule="nonzero"
                      opacity="0.3"
                      transform="translate(9.000003, 11.999999) rotate(-270.000000) translate(-9.000003, -11.999999) "
                    />
                  </g>
                </svg>
              </span>
            </button>
          </div>
        </div>
        <div
          className="kt-aside-menu-wrapper kt-grid__item kt-grid__item--fluid"
          id="kt_aside_menu_wrapper"
        >
          <div
            id="kt_aside_menu"
            className="kt-aside-menu "
            data-ktmenu-vertical="1"
            data-ktmenu-scroll="1"
            data-ktmenu-dropdown-timeout="500"
          >
            <ul className="kt-menu__nav ">{sideBarRender}</ul>
          </div>
        </div>
      </div>
    </SidebarWrapper>
  );
};
const mapStateToProps = createStructuredSelector({
  appConfig: makeSelectAppConfig()
});

const withConnect = connect(mapStateToProps, null);
export default compose(withConnect, memo, injectIntl)(Sidebar);
