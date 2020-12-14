import React from "react";
import { Statistic } from "antd";
import Wrapper from "./Wrapper";

const component = ({ title = "", value = "", precision = 0 }) => {
  return (
    <Wrapper>
      <Statistic title={title} value={value} precision={precision} />
    </Wrapper>
  );
};
export default component;
