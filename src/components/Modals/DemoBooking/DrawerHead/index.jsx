import React from "react";
import A from "../../../A";

const DrawerHead = ({ onClose, title, ...restProps }) => {
  return (
    <h5 {...restProps} className="mb-0">
      <A onClick={onClose}>
        <i className="fa fa-chevron-left" /> &nbsp;
        {title}
      </A>
    </h5>
  );
};
export default DrawerHead;
