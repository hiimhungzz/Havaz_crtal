import React,{memo} from "react";
import { Pagination } from "antd";
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

import Cell from '../CellItem';


const columnBands = [
  {
    title: 'Doanh thu khách hàng',
    children: [
      { columnName: 'totalRevenueVat' },
      { columnName: 'totalRevenueNotVat' },
    ],
  },
]

const DebtByCTVStatisticsList = memo(
  ({data, pageSize, setParams, pages}) => {
    return (
      <Paper>
        <Grid
          rows={data || []}
          columns={[
            {
              name: "licensePlates",
              title: ["Mã CTV"]
            },
            {
              name: "driverCode",
              title: ["Tên CTV"]
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
              title: ["Tổng Doanh thu KH"]
            },
            {
              name: "totalRevenueVat",
              title: ["Tổng phải trả CTV"]
            },
            {
              name: "totalRevenueNotVat",
              title: ["Phải trả CTV có VAT"]
            },
            {
              name: "cost",
              title: ["Phải trả CTV không VAT"]
            },
            {
              name: "profit",
              title: ["LN CTV"]
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
              // if(nameColumn === "cost" || nameColumn === "profit" || nameColumn === "totalRevenueNotVat" ||
              //   nameColumn === "totalRevenueVat" || nameColumn === "totalRevenue"
              // ) {
              //   return Cell(props, true)
              // }
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
        <div className="kt-portlet__head">
          <div className="kt-portlet__head-label"></div>
          <Pagination
            style={{paddingTop: 20, marginRight: 40}}
            current={pages}
            total={data.length}
            pageSize={pageSize}
            showSizeChanger
            onChange={(pages, pageSize) => {
              setParams(prevState=>{
                let nextState= {...prevState};
                nextState.pages = pages;
                return nextState;
              })
            }}
            onShowSizeChange={(current, size) => {
              setParams(prevState=>{
              let nextState= {...prevState};
                nextState.pages = 0;
                nextState.pageSize = size;
                return nextState;
              })
            }}
          />
        </div>
      </Paper>
      )
  }
)

export default DebtByCTVStatisticsList;
