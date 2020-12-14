import React from "react";
import Card from "components/Card";
import Statistic from "components/Statistic";

const component = ({
  title,
  value,
  precision = 0,
  cardStyle = {},
  cardBodyStyle = {},
  ...restProps
}) => {
  return (
    <Card {...restProps} bodyStyle={cardBodyStyle} style={cardStyle}>
      <Statistic title={title} value={value} precision={precision} />
    </Card>
  );
};
export default component;
