import React, { memo, useState, useEffect, useCallback } from "react";
import { Spin } from "antd";
import _ from "lodash";
import { Table } from "@devexpress/dx-react-grid-material-ui";

const Cell = ({props,setShow,setUuidTrip,setTypeStation}) => {
  const { column, value, row } = props;
  const cellData = props.value;
  const showModal = ()=>{
    setShow(true)
    setUuidTrip(row.uuidTrip)
    setTypeStation(row.typeStation)
  }
  if (column.name == "pickUpAt") {

    return <Table.Cell {...props} value={<a style={{color:"blue"}} onClick={showModal}>{cellData}</a>} />;
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
