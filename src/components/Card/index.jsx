import React from "react";
import { Card } from "antd";
const component = ({ bodyStyle = 10, style = {}, ...restProps }) => {
  return <Card {...restProps} bodyStyle={bodyStyle} style={style} />;
};
export default component;
