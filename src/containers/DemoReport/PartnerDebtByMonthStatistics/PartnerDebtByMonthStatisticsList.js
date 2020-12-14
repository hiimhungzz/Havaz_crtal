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

import Cell from '../CellItem';
import BottomPage from '../BottomPage';

const columnBands = [
  {
    title: 'Doanh thu với khách hàng',
    children: [
      { columnName: 'promotionMoney'},
      { columnName: 'unitPrice' },
      { columnName: 'priceNightWay' },
      { columnName: 'totalMoney' },
    ],
  },
  {
    title: 'Công nợ phải trả CTV',
    children: [
      { columnName: 'promotionMoneySupplier'},
      { columnName: 'unitPriceSupplier' },
      { columnName: 'priceNightWaySupplier' },
      { columnName: 'totalMoneySupplier' },
    ],
  },
]

const PartnerDebtByMonthStatisticsList = memo(
  ({data, pageSize, setParams, pages, count}) => {
    return (
      <Paper>
        <Grid
          rows={data || []}
          columns={[
            {
              name: "supplierCode",
              title: ["Mã CTV"]
            },
            {
              name: "supplierName",
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
              name: "dateIn",
              title: ["Ngày IN"]
            },
            {
              name: "dateAction",
              title: ["Ngày thực hiện"]
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
              name: "note",
              title: ["Ghi chú"]
            },
            {
              name: "promotionMoney",
              title: ["Km"]
            },
            {
              name: "unitPrice",
              title: ["Đơn giá"]
            },
            {
              name: "priceNightWay",
              title: ["Lưu đêm + Cao tốc"]
            },
            {
              name: "totalMoney",
              title: ["Thành tiền"]
            },
            {
              name: "promotionMoneySupplier",
              title: ["KM"]
            },
            {
              name: "unitPriceSupplier",
              title: ["Đơn giá"]
            },
            {
              name: "priceNightWaySupplier",
              title: ["Lưu đêm + Cao tốc"]
            },
            {
              name: "totalMoneySupplier",
              title: ["Thành tiền"]
            },
            {
              name: "profit",
              title: ["Lợi nhuận CTV"]
            },
          ]}
        >
          <Table
            columnExtensions={[
              { columnName: "supplierCode", width: 130, wordWrapEnabled: true },
              { columnName: "supplierName", wordWrapEnabled: true, width: 160 },
              { columnName: "customerCode", wordWrapEnabled: true, width: 100 },
              { columnName: "bookingCode", wordWrapEnabled: true, width: 100 },
              { columnName: "dateIn", wordWrapEnabled: true, width: 100 },
              { columnName: "dateAction", wordWrapEnabled: true, width: 100 },
              { columnName: "vehicleTypeName", wordWrapEnabled: true },
              { columnName: "routeName", wordWrapEnabled: true, width: 160 },
              { columnName: "note", wordWrapEnabled: true },
              { columnName: "promotionMoney", wordWrapEnabled: true },
              { columnName: "unitPrice", wordWrapEnabled: true },
              { columnName: "priceNightWay", wordWrapEnabled: true, width: 130 },
              { columnName: "totalMoney", wordWrapEnabled: true },
              { columnName: "promotionMoneySupplier", wordWrapEnabled: true },
              { columnName: "unitPriceSupplier", wordWrapEnabled: true },
              { columnName: "priceNightWaySupplier", wordWrapEnabled: true, width: 130 },
              { columnName: "totalMoneySupplier", wordWrapEnabled: true },
              { columnName: "profit", wordWrapEnabled: true },
            ]}
            cellComponent={props => {
              const nameColumn = props.column.name;
              if(nameColumn === "totalMoneySupplier" || nameColumn === "totalMoney"
                || nameColumn === "unitPrice" || nameColumn === "unitPriceSupplier"
                || nameColumn === "priceNightWay" || nameColumn === "priceNightWaySupplier"
                || nameColumn === "profit"
              ) {
                return Cell(props, true)
              }
              if(nameColumn === "promotionMoney" || nameColumn === "promotionMoneySupplier") {
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
          count={count}
          setParams={setParams}
          pages={pages}
          pageSize={pageSize}
        />
      </Paper>
      )
  }
)


export default PartnerDebtByMonthStatisticsList;
