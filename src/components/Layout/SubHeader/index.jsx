import React, { memo } from "react";
import SubHeaderLink from "./SubHeaderLink";
import IntlMessages from "../../IntlMessages";

const SubHeader = memo(({ path }) => {
  let pathName = path === "/" ? "/demoBooking" : path;
  return (
    <div className="kt-subheader kt-grid__item" id="kt_subheader">
      <div className="kt-container  kt-container--fluid">
        <div className="kt-subheader__main">
          <div className="kt-subheader__breadcrumbs">
            <SubHeaderLink to="/" className="kt-subheader__breadcrumbs-home">
              <i className="flaticon2-shelter" />
            </SubHeaderLink>
            <span className="kt-subheader__breadcrumbs-separator" />
            <SubHeaderLink to="/" className="kt-subheader__breadcrumbs-link">
              Trang chủ &nbsp;
            </SubHeaderLink>
            <span className="kt-subheader__breadcrumbs-separator" />
            <SubHeaderLink to={path} className="kt-subheader__breadcrumbs-link">
              <IntlMessages id={pathName} />
            </SubHeaderLink>
          </div>
        </div>
      </div>
    </div>
  );
});
export default SubHeader;