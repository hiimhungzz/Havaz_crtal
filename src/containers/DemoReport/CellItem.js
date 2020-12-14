import React,{memo} from "react";
import {
  Table,
} from "@devexpress/dx-react-grid-material-ui";


const formatNumber = (num) => {
  if (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  }
  return num;
}

const Cell = (props, isNumber, isRight) => {
  // isRight chi để căn phải ko ko cần format
  let cellData = props.value;
  if(cellData === undefined || cellData === null) {
    return (
      <Table.Cell
        {...props}
        style={props.row.isBold === true ? { fontWeight: "bold", background: '#eee' } : {}}
        className="dev_table_body"
        value={<div style={isNumber ? {textAlign: 'right'} : {}} >-</div>}
      />
    );
  }
  return (
    <Table.Cell
      {...props}
      style={props.row.isBold === true ? { fontWeight: "bold", background: '#eee' } : {}}
      className="dev_table_body"
      value={
        isNumber ? (
          <div style={{textAlign: 'right'}}>
            {
              isRight ? (
                cellData
              ) : 
                formatNumber(cellData)
            }</div>
        ) : (
          <div>{cellData}</div>
        )
      }
    />
  );
};
export default Cell;