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

const CustomerDebtByDayStatisticsList = memo(
  ({data, pageSize, setParams, pages, count}) => {
    return (
      <Paper>
        <Grid
          rows={data || []}
          columns={[
            {
              name: "dateIn",
              title: ["Ngày IN"]
            },
            {
              name: "bookingCode",
              title: ["Code đoàn"]
            },
            {
              name: "dateOut",
              title: ["Ngày out"]
            },
            {
              name: "dateAction",
              title: ["Ngày thực hiện"]
            },
            {
              name: "tripStatusText",
              title: ["Tình trạng"]
            },
            {
              name: "customerName",
              title: ["Tên khách hàng"]
            },
            {
              name: "creatorName",
              title: ["Tên KH đặt"]
            },
            {
              name: "contactName",
              title: ["Tên hành khách"]
            },
            {
              name: "vehicleTypeName",
              title: ["Loại xe"]
            },
            {
              name: "routeName",
              title: ["Tuyến đường"]
            },
            {
              name: "distance",
              title: ["Km"]
            },
            {
              name: "costPerKm",
              title: ["Đơn giá"]
            },
            {
              name: "overNightCost",
              title: ["Lưu đêm"]
            },
            {
              name: "Highway",
              title: ["Cao tốc"]
            },
            {
              name: "discount",
              title: ["Tăng giảm"]
            },
            {
              name: "amount",
              title: ["Thành tiền"]
            },
          ]}
        >
          <Table
            columnExtensions={[
              { columnName: "dateIn", width: 100, wordWrapEnabled: true },
              { columnName: "bookingCode", wordWrapEnabled: true },
              { columnName: "dateOut", wordWrapEnabled: true, width: 100 },
              { columnName: "dateAction", wordWrapEnabled: true, width: 100 },
              { columnName: "tripStatusText", wordWrapEnabled: true },
              { columnName: "customerName", wordWrapEnabled: true, width: 180, },
              { columnName: "contactName", wordWrapEnabled: true },
              { columnName: "creatorName", wordWrapEnabled: true },
              { columnName: "vehicleTypeName", wordWrapEnabled: true },
              { columnName: "routeName", wordWrapEnabled: true, width: 190, },
              { columnName: "distance", wordWrapEnabled: true, width: 80, },
              { columnName: "costPerKm", wordWrapEnabled: true },
              { columnName: "overNightCost", wordWrapEnabled: true },
              { columnName: "Highway", wordWrapEnabled: true },
              { columnName: "discount", wordWrapEnabled: true },
              { columnName: "amount", wordWrapEnabled: true },
            ]}
            cellComponent={props => {
              const nameColumn = props.column.name;
              if(nameColumn === "costPerKm" || nameColumn === "amount" 
              || nameColumn === "overNightCost"
              || nameColumn === "Highway"
              || nameColumn === "discount") {
                return Cell(props, true)
              }
              if(nameColumn === "distance") {
                return Cell(props, true, true)
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


export default CustomerDebtByDayStatisticsList;
