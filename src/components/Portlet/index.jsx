import React from "react";
import { buildClassName } from "@Helpers/utility";
const Portlet = ({ className, ...restProps }) => {
  let _originClassName = 'kt-portlet mb-0';
  let _template = ' {}';
  let _className = `${_originClassName}${buildClassName(_template,className)}`;
  return <div {...restProps} className={_className} />;
};
export default Portlet;
