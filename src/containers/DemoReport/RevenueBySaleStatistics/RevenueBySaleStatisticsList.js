import React,{memo} from "react";
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

import Cell from '../CellItem';
import BottomPage from '../BottomPage';

const RevenueBySaleStatisticsList = memo(
  ({data, pageSize, setParams, pages, count}) => {
    return (
      <Paper>
        <Grid
          rows={data || []}
          columns={[
            {
              name: "bookingCode",
              title: ["Code đoàn"]
            },
            {
              name: "saleName",
              title: ["Nhân viên"]
            },
            {
              name: "customerCode",
              title: ["Mã khách hàng"]
            },
            {
              name: "customerName",
              title: ["Tên khách hàng"]
            },
            {
              name: "totalRevenue",
              title: ["Tổng doanh thu"]
            },
            {
              name: "totalRevenueVat",
              title: ["DT có VAT"]
            },
            {
              name: "totalRevenueNotVat",
              title: ["DT chưa VAT"]
            },
          ]}
        >
          <Table
            columnExtensions={[
              { columnName: "saleName", width: 200, wordWrapEnabled: true },
              { columnName: "customerCode", wordWrapEnabled: true, width: 210 },
              { columnName: "bookingCode", wordWrapEnabled: true, width: 130 },
              { columnName: "customerName", wordWrapEnabled: true },
              { columnName: "totalRevenue", wordWrapEnabled: true, width: 130 },
              { columnName: "totalRevenueVat", wordWrapEnabled: true, width: 130 },
              { columnName: "totalRevenueNotVat", wordWrapEnabled: true, width: 130 },
            ]}
            cellComponent={props => {
              const nameColumn = props.column.name;
              if(nameColumn === "totalRevenueNotVat" || nameColumn === "totalRevenueVat" || nameColumn === "totalRevenue") {
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
          data={data}
          pages={pages}
          pageSize={pageSize}
        />
        {/* <div className="kt-portlet__head">
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
        </div> */}
      </Paper>
      )
  }
)

export default RevenueBySaleStatisticsList;
