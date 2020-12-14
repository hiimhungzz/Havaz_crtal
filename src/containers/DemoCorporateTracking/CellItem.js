import React from "react";
import { Table } from "@devexpress/dx-react-grid-material-ui";
import moment from "moment";

const formatNumber = (num) => {
  if (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  }
  return num;
};

const Cell = ({ props, isNumber, isRight, onShowModal,onShowCheckIn ,setShowCheckIn,setInfoHeader}) => {
  const { column, row, value } = props;
  const cellData = props.value;
  const onClickCheckIn = ()=>{
    let item = row.uuidTrip
    onShowCheckIn(item)
    setInfoHeader(row)
  }
  // isRight chi để căn phải ko ko cần format
  if (props.column.name === "stt") {
    return (
      <Table.Cell {...props} value={<div>{props.tableRow.rowId + 1}</div>} />
    );
  }
  if (props.column.name === "actionHA") {
    return (
      <Table.Cell
        {...props}
        value={
          <div
            onClick={() => {
              const item = {
                uuidContract: props.row.uuidContract,
                uuidTrip: props.row.uuidTrip,
              };
              onShowModal(item);
            }}
          >
            <i className="fa fa-plus" />
          </div>
        }
      />
    );
  }
  if (props.column.name === "plate") {
    return <Table.Cell {...props} style={{color:'blue'}} value={<a onClick={onClickCheckIn}>{cellData}</a>} />;
  }
  if (!cellData) {
    return (
      <Table.Cell
        {...props}
        value={<div style={isNumber ? { textAlign: "right" } : {}}>-</div>}
      />
    );
  }
  if (props.column.name === "trackingDate") {
    return (
      <Table.Cell
        {...props}
        value={<div>{moment(cellData).format("DD-MM-YYYY")}</div>}
      />
    );
  }
  if (
    props.column.name === "trackingTimeBegin" ||
    props.column.name === "trackingTimeEnd"
  ) {
    return (
      <Table.Cell
        {...props}
        value={<div>{moment(cellData).format("HH:mm")}</div>}
      />
    );
  }

  return (
    <Table.Cell
      {...props}
      value={
        isNumber ? (
          <div style={{ textAlign: "right" }}>
            {isRight ? cellData : formatNumber(cellData)}
          </div>
        ) : (
          <div>{cellData}</div>
        )
      }
    />
  );
};
export default Cell;
