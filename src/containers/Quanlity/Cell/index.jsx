import React, { memo, useState, useEffect, useCallback } from "react";
import { Spin } from "antd";
import _ from "lodash";
import { Table } from "@devexpress/dx-react-grid-material-ui";

const Cell = ({props }) => {
  const { column, value, row } = props;
  const cellData = props.value;
  if(column.name == "afternoonAway"){
    return (
      <Table.Cell
        {...props}
        value={<b style={{color:"red"}}>{cellData}</b>}
      />
    );
  }
  return (
    <Table.Cell
      {...props}
      value={<div>{cellData}</div>}
    />
  );
};
export default Cell;
