import React from "react";
import { buildClassName } from "@Helpers/utility";
const PortletBody = ({ className, ...restProps }) => {
  let _originClassName = 'kt-portlet__body';
  let _template = ' {}';
  let _className = `${_originClassName}${buildClassName(_template,className)}`;
  return <div {...restProps} className={_className} />;
};
export default PortletBody;
