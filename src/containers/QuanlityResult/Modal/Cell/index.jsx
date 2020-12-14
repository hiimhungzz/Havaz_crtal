import React, { memo, useState, useEffect, useCallback } from "react";
import { Spin } from "antd";
import _ from "lodash";
import { Table } from "@devexpress/dx-react-grid-material-ui";

const Cell = ({ props }) => {
  const { column, value, row } = props;
  const cellData = props.value;
  if (column.name == "surResult") {
    let type = row.ckExists ? row.ckExists : false;
    let style = type == true ? { color: "black" } : { color: "red" };
    return (
      <Table.Cell {...props} value={<div style={style}>{cellData}</div>} />
    );
  } else {
    return (
      <Table.Cell
        className="Table_body"
        {...props}
        value={<div>{cellData}</div>}
      />
    );
  }
};
export default Cell;
