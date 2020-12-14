import React, { memo, useState, useEffect, useCallback } from "react";
import { Spin } from "antd";
import _ from "lodash";
import { Table } from "@devexpress/dx-react-grid-material-ui";

const Cell = ({props }) => {
  const { column, value, row } = props;
  const cellData = props.value;
  if (column.name == "date") {
    return (
      <Table.Cell
        {...props}
        value={
          <div>
            {cellData.map((item, index) => {
              return <div>{item.dropOffAt}</div>;
            })}
          </div>
        }
      />
    );
  } else {
    return <Table.Cell  className="Table_body" {...props} value={<div>{cellData}</div>} />;
  }
};
export default Cell;
