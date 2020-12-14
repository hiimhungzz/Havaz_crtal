import React from "react";
import { buildClassName } from "@Helpers/utility";
const PortletFoot = ({ className, ...restProps }) => {
  let _originClassName = 'kt-portlet__foot';
  let _template = ' {}';
  let _className = `${_originClassName}${buildClassName(_template,className)}`;
  return <div {...restProps} className={_className} />;
};
export default PortletFoot;
