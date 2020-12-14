import React, { memo } from "react";
import { Spin, Pagination } from "antd";
import { Paper } from '@material-ui/core';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableColumnReordering,
} from "@devexpress/dx-react-grid-material-ui";
import {
  TableHeaderContent
} from "@Components/Utility/common";
import BottomPage from '../BottomPage'


const formatNumber = (num) => {
  if (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  }
  return num;
}


const Cell = (props, isNumber) => {
  let cellData = props.value;
  if(!cellData) {
    return (
      <Table.Cell
        style={props.row.isBold === true ? { background: "#8ca5b3" } : {}}
        {...props}
        className="dev_table_body"
        value={<div>-</div>}
      />
    );
  }
  return (
    <Table.Cell
      {...props}
      style={props.row.isBold === true ? { background: "#8ca5b3" } : {}}
      className="dev_table_body"
      value={Object.keys(cellData) && Object.keys(cellData).map((key, index) => (
        isNumber ? (
          <div style={{textAlign: 'right'}} key={index}>{formatNumber(cellData[key])}</div>
        ) : (
          <div key={index}>{cellData[key]}</div>
        )
      ))}
    />
  );
};

const BookingStatisticsList = memo(
  ({data, pageSize, setParams, pages, count}) => {
    return (
      <Paper>
        <Grid
          rows={data || []}
          columns={[
            {
              name: "col_1",
              title: ["Ngày thực hiện", "Mã chuyến đi"]
            },
            {
              name: "col_2",
              title: ["Mã khách hàng", "Khách hàng"]
            },
            {
              name: "col_3",
              title: ["Code đoàn"]
            },
            {
              name: "col_4",
              title: ["Ngày IN", "Ngày OUT"]
            },
            {
              name: "col_5",
              title: ["Tình trạng"]
            },
            {
              name: "col_6",
              title: ["Người đặt"]
            },
            {
              name: "col_7",
              title: ["Tên hành khách"]
            },
            {
              name: "col_8",
              title: ["Loại xe"]
            },
            {
              name: "col_9",
              title: ["Tuyến đường"]
            },
            {
              name: "col_10",
              title: ["Giờ đón khách", "Địa điểm đón khách"]
            },
            {
              name: "col_11",
              title: ["Thông tin chuyến bay-tàu", "Giờ bay"]
            },
            {
              name: "col_12",
              title: ["Loại xe sắp xếp", "Biển kiểm soát"]
            },
            {
              name: "col_13",
              title: ["Tên lái xe", "Số điện thoại lái xe"]
            },
            {
              name: "col_14",
              title: ["Doanh thu"]
            }
          ]}
        >
          <Table
            columnExtensions={
              [
              { columnName: "col_1", wordWrapEnabled: true, width: 130 },
              { columnName: "col_2", wordWrapEnabled: true, width: 170 },
              { columnName: "col_3", wordWrapEnabled: true, width: 100 },
              { columnName: "col_4", wordWrapEnabled: true, width: 80 },
              { columnName: "col_5", wordWrapEnabled: true, width: 80 },
              { columnName: "col_6", wordWrapEnabled: true },
              { columnName: "col_7", wordWrapEnabled: true },
              { columnName: "col_8", wordWrapEnabled: true },
              { columnName: "col_9", wordWrapEnabled: true, width: 190 },
              { columnName: "col_10", wordWrapEnabled: true },
              { columnName: "col_11", wordWrapEnabled: true },
              { columnName: "col_12", wordWrapEnabled: true },
              { columnName: "col_13", wordWrapEnabled: true },
              ]
            }
            cellComponent={props => {
              const nameColumn = props.column.name;
              if(nameColumn === "col_14") {
                return Cell(props, true)
              }
              return Cell(props)
            }}
          />
          <TableColumnReordering/>

          <TableHeaderRow
            cellComponent={props => {
              return (
                <TableHeaderRow.Cell
                  {...props}
                  style={{ ...props.style, background: "#f2f3f8" }}
                />
              );
            }}
            contentComponent={TableHeaderContent}
          />
        </Grid>
        <BottomPage
          count={count}
          setParams={setParams}
          pages={pages}
          pageSize={pageSize}
        />
      </Paper>
    )
  }
)


export default BookingStatisticsList;
