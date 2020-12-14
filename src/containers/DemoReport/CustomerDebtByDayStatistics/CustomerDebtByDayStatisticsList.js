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
              name: "customerCode",
              title: ["Code khách hàng"]
            },
            {
              name: "customerName",
              title: ["Mã khách hàng"]
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
              name: "vehicleTypeName",
              title: ["Loại xe yêu cầu"]
            },
            {
              name: "routeName",
              title: ["Tuyến đường"]
            },
            {
              name: "note",
              title: ["Ghi Chú"]
            },
            {
              name: "licensePlates",
              title: ["Biển kiểm soát"]
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
            {
              name: "paymentPartner",
              title: ["Phải trả CTV"]
            },
            {
              name: "profitPartner",
              title: ["Lợi nhuận CTV"]
            },
          ]}
        >
          <Table
            columnExtensions={[
              { columnName: "dateIn", width: 100, wordWrapEnabled: true },
              { columnName: "customerCode", width: 100, wordWrapEnabled: true },
              { columnName: "customerName", wordWrapEnabled: true },
              { columnName: "dateAction", wordWrapEnabled: true, width: 100 },
              { columnName: "tripStatusText", wordWrapEnabled: true },
              { columnName: "vehicleTypeName", width: 100, wordWrapEnabled: true },
              { columnName: "routeName", width: 190, wordWrapEnabled: true },
              { columnName: "note", wordWrapEnabled: true },
              { columnName: "licensePlates", wordWrapEnabled: true },
              { columnName: "distance", wordWrapEnabled: true },
              { columnName: "costPerKm", wordWrapEnabled: true },
              { columnName: "overNightCost", wordWrapEnabled: true },
              { columnName: "Highway", wordWrapEnabled: true },
              { columnName: "amount", wordWrapEnabled: true },
              { columnName: "paymentPartner", wordWrapEnabled: true },
              { columnName: "profitPartner", wordWrapEnabled: true },
            ]}
            cellComponent={props => {
              const nameColumn = props.column.name;
              if(nameColumn === "costPerKm" || nameColumn === "amount" || nameColumn === "overNightCost"|| nameColumn === "Highway"
              || nameColumn === "discount" || nameColumn === "paymentPartner" || nameColumn === "profitPartner"
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
