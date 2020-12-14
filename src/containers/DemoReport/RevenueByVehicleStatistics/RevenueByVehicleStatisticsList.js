import React,{memo} from "react";
import { Spin, Pagination } from "antd";
import { Paper } from '@material-ui/core';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableColumnReordering,
  TableBandHeader,
} from "@devexpress/dx-react-grid-material-ui";
import {
  TableHeaderContent
} from "@Components/Utility/common";

// import Cell from '../CellItem';
import BottomPage from '../BottomPage';

const columnBands = [
  {
    title: 'Doanh thu khách hàng',
    children: [
      { columnName: 'totalRevenueVat' },
      { columnName: 'totalRevenueNotVat' },
    ],
  },
]

const formatNumber = (num) => {
  if (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  }
  return num;
}

const Cell = (props, isNumber, isRight) => {
  // isRight chi để căn phải ko ko cần format
  let cellData = props.value;
  if(props.column.name === "driverCode") {
    return (
      <Table.Cell
        {...props}
        style={props.row.isBold === true ? { fontWeight: "bold", background: '#eee' } : {}}
        className="dev_table_body"
        value={
          <div>
            <div>{props.row.driverCode}</div>
            {props.row.driverName}
          </div>
        }
      />
    );
  }
  if(props.column.name === "customerCode") {
    return (
      <Table.Cell
        {...props}
        style={props.row.isBold === true ? { fontWeight: "bold", background: '#eee' } : {}}
        className="dev_table_body"
        value={
          <div>
            <div>{props.row.customerCode}</div>
            {props.row.customerName}
          </div>
        }
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

const RevenueByVehicleStatisticsList = memo(
  ({data, pageSize, setParams, pages, count}) => {
    return (
      <Paper>
        <Grid
          rows={data || []}
          columns={[
            {
              name: "licensePlates",
              title: ["Biển kiểm soát"]
            },
            {
              name: "driverCode",
              title: ["Mã LX"]
            },
            {
              name: "customerCode",
              title: ["Mã KH"]
            },
            {
              name: "bookingCode",
              title: ["Code đoàn"]
            },
            {
              name: "totalRevenue",
              title: ["Tổng Doanh thu"]
            },
            {
              name: "totalRevenueVat",
              title: ["DT KH có VAT"]
            },
            {
              name: "totalRevenueNotVat",
              title: ["DT KH chưa VAT"]
            },
            {
              name: "cost",
              title: ["Phải trả CTV"]
            },
            {
              name: "profit",
              title: ["Lợi nhuận CTV"]
            },
            {
              name: "note",
              title: ["Ghi chú"]
            },
          ]}
        >
          <Table
            columnExtensions={[
              { columnName: "licensePlates", wordWrapEnabled: true },
              { columnName: "driverCode", wordWrapEnabled: true },
              { columnName: "customerCode", wordWrapEnabled: true },
              { columnName: "bookingCode", wordWrapEnabled: true },
              { columnName: "totalRevenue", wordWrapEnabled: true },
              { columnName: "totalRevenueVat", wordWrapEnabled: true },
              { columnName: "totalRevenueNotVat", wordWrapEnabled: true },
              { columnName: "cost", wordWrapEnabled: true },
              { columnName: "profit", wordWrapEnabled: true },  
              { columnName: "note", wordWrapEnabled: true },
            ]}
            cellComponent={props => {
              const nameColumn = props.column.name;
              if(nameColumn === "cost" || nameColumn === "profit" || nameColumn === "totalRevenueNotVat" ||
                nameColumn === "totalRevenueVat" || nameColumn === "totalRevenue"
              ) {
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
          <TableBandHeader
            cellComponent={props => {
              return (
                <TableBandHeader.Cell
                  {...props}
                  style={{ ...props.style, background: "#f2f3f8", textAlign: 'center', fontSize: 17, color: 'rgb(108, 114, 147)'}}
                />
              );
            }}
            columnBands={columnBands}
          />
        </Grid>
        <BottomPage
          isShow
          count={count}
          setParams={setParams}
          pages={pages}
          pageSize={pageSize}
        />
      </Paper>
      )
  }
)

export default RevenueByVehicleStatisticsList;
