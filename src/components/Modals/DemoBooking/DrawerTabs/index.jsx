import React from "react";
import { Tabs } from "antd";

const renderTabBar = (props, DefaultTabBar) => (
  <DefaultTabBar
    {...props}
    style={{
      zIndex: 2,
      width: "calc(100% - 15px)",
      position: "absolute",
      top: 60,
      left: 0,
      background: "#fff"
    }}
  />
);

const DrawerTabs = props => {
  return (
    <Tabs
      {...props}
      type="card"
      renderTabBar={renderTabBar}
    />
  );
};
export default DrawerTabs;
