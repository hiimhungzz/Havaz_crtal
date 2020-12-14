import React from "react";
import A from "../../../A";
const DrawerTabPane = ({ tabName, icon, ...restProps }) => {
  return (
    <span>
      <A
        {...restProps}
        onClick={e => {
          e.preventDefault();
        }}
      >
        <i className={`${icon} mr-2`} />
        {tabName}
      </A>
    </span>
  );
};
export default DrawerTabPane;
