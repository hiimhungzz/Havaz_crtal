import React, { memo, useState, useEffect, useCallback } from "react";
import { Spin } from "antd";
import _ from "lodash";
import { Paper, Grid as CoreGrid } from "@material-ui/core";
import {
  Grid,
  Table,
  TableGroupRow,
  TableColumnReordering,
  PagingPanel,
  TableBandHeader,
  TableHeaderRow
} from "@devexpress/dx-react-grid-material-ui";
import {
  PagingState,
  IntegratedPaging,
  GroupingState,
  IntegratedGrouping,
} from "@devexpress/dx-react-grid";
import {
  CustomizeTableHeaderRow,
  PagingContainer,
  TableCell,
} from "components/Utility/common";
import { Ui } from "@Helpers/Ui";
import ServiceBase from "@Services/ServiceBase";
import Cell from "./../Cell/index";
import { Map } from 'immutable';

const columnBands = [
  {
    title: "KM/GIỜ CHẠY",
    children: [
      { columnName: "distance" },
      { columnName: "pickUpTime" },
      { columnName: "actualPickUpTime" },
    ],
  },
  {
    title: "LỖI MUỘN GIỜ",
    children: [{ columnName: "errDeparture" }, { columnName: "errDoiBen" }],
  },
];
const quanlityList = memo(({currentPage,pageSize,setParams,gird,loading}) => {

  return (
    <Spin spinning={loading} tip="Đang tải dữ liệu...">
    <Paper variant="outlined" square>
      <Grid
        rows={gird.get('data')}
        columns={[
          
          {
            name: "pickUpAt",
            title: "NGÀY",
          },
          {
            name: "contractNumber",
            title: "HỢP ĐỒNG",
          },
          {
            name: "fixedRouteName",
            title: "TUYẾN ĐƯỜNG",
          },
          {
            name: "afternoonAway",
            title: "CHIỀU",
          },
          {
            name: "plate",
            title: "BKS",
          },
          {
            name: "driverName",
            title: "LÁI XE",
          },
          {
            name: "distance",
            title: "KM",
          },

          {
            name: "pickUpTime",
            title: "LỊCH",
          },

          {
            name: "actualPickUpTime",
            title: "THỰC TẾ",
          },
          {
            name: "errDeparture",
            title: "XUẤT BẾN",
          },
          {
            name: "errDoiBen",
            title: "QUA ĐIỂM",
          },
          {
            name: "totalErrDeparture",
            title: "SỐ LỖI KTRA XUẤT BẾN",
          },
          {
            name: "confirmName",
            title: "NGƯỜI XÁC NHẬN",
          },
          {
            name: "status",
            title: "TRẠNG THÁI",
          },
        ]}
      >
        <PagingState defaultCurrentPage={0} pageSize={5} />
        <Table
          columnExtensions={[
            { columnName: 'plate', wordWrapEnabled: true,width: 100, },
            { columnName: 'pickUpAt', wordWrapEnabled: true,width: 100, },
            { columnName: 'fixedRouteName', wordWrapEnabled: true,width: 200, },
            { columnName: 'afternoonAway', wordWrapEnabled: true },
            { columnName: 'driverName', wordWrapEnabled: true,width: 150 },
            { columnName: 'distance', wordWrapEnabled: true,width: 80 },
            { columnName: 'pickUpTime', wordWrapEnabled: true,width: 80  },
            { columnName: 'actualPickUpTime', wordWrapEnabled: true,width: 80  },
            { columnName: 'errDeparture', wordWrapEnabled: true,width: 80  },
            { columnName: 'errDoiBen', wordWrapEnabled: true,width: 80  },
            { columnName: 'totalErrDeparture', wordWrapEnabled: true, width: 80,align: 'right' },
            { columnName: 'confirmName', wordWrapEnabled: true, minWidth: 150 },
            { columnName: 'status', wordWrapEnabled: true, width: 100},

          ]}
          cellComponent={props => Cell({props})}
        />
         <TableColumnReordering />
        <TableHeaderRow
          cellComponent={props => (
            <TableHeaderRow.Cell
              {...props}
              style={{ ...props.style, background: '#f2f3f8' }}
            />
          )}
        //   contentComponent={TableHeaderContent}
        />
        <TableBandHeader
          cellComponent={(props) => (
            <TableBandHeader.Cell
              {...props}
              style={{
                ...props.style,
                background: "#f2f3f8",
                textAlign: "center",
                fontSize: 14,
                color: "rgba(0, 0, 0, 0.87)",
                paddingTop: 0,
                paddingBottom: 0,
              }}
            />
          )}
          columnBands={columnBands}
        />
         <PagingState currentPage={gird.get('pages')} pageSize={gird.get('pageSize')} />
        <IntegratedPaging />
        <PagingPanel
          messages={{
            info: `1-${gird.get('pageSize')} của ${parseInt(gird.get('totalLength'))}`,
            rowsPerPage: 'Số bản ghi trên mỗi trang',
          }}
          containerComponent={props => (
            <PagingContainer
              {...props}
              pageSizes={[5, 10, 15]}
              pageSize={gird.get('pageSize')}
              totalCount={gird.get('totalLength')}
              currentPage={currentPage}
              totalPages={
                gird.get('totalLength') % gird.get('pageSize') > 0
                  ? parseInt(gird.get('totalLength') / gird.get('pageSize')) + 1
                  : gird.get('totalLength') / gird.get('pageSize')
              }
              onCurrentPageChange={page => {
                setParams(prevState => {
                  const nextState = { ...prevState };
                  nextState.pages = page;
                  return nextState;
                });
              }}
              onPageSizeChange={size => {
                setParams(prevState => {
                  const nextState = { ...prevState };
                  nextState.pageSize = size;
                  return nextState;
                });
              }}
            />
          )}
        />
      </Grid>
    </Paper>
     </Spin>
  );
});
export default quanlityList;
