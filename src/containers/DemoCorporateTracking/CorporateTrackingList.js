import React, { memo } from "react";
import { Paper } from "@material-ui/core";
import {
  Grid,
  PagingPanel,
  Table,
  TableHeaderRow,
  TableColumnReordering,
  TableBandHeader,
  TableFixedColumns,
} from "@devexpress/dx-react-grid-material-ui";
import { IntegratedPaging, PagingState } from "@devexpress/dx-react-grid";
import {
  PagingContainer,
  TableHeaderContent,
} from "@Components/Utility/common";

import Cell from "./CellItem";
import { calculatePageInfo } from "helpers/utility";
const columnBands = [
  {
    title: "Km thực hiện",
    children: [
      { columnName: "km" },
      { columnName: "kmExceed" },
      { columnName: "kmBegin" },
      { columnName: "kmEnd" },
    ],
  },
  {
    title: "Thời gian thực hiện",
    children: [
      { columnName: "trackingTimeBegin" },
      { columnName: "trackingTimeEnd" },
      { columnName: "timeExceed" },
    ],
  },
];

const PerformanceMonitorList = memo(
  ({ data, onShowModal, totalLength, pageSize, currentPage, setParams,onShowCheckIn,setShowCheckIn,setInfoHeader }) => {
    return (
      <>
        <Paper>
          <Grid
            rows={data || []}
            columns={[
              {
                name: "stt",
                title: ["#"],
              },
              {
                name: "trackingDate",
                title: "NGÀY",
              },
              {
                name: "contractNumber",
                title: "SỐ HĐ",
              },
              {
                name: "routeName",
                title: "TUYẾN ĐƯỜNG",
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
                name: "km",
                title: "KM",
              },
              {
                name: "kmExceed",
                title: "KM Vượt",
              },
              {
                name: "kmBegin",
                title: "ĐẦU",
              },
              {
                name: "kmEnd",
                title: "CUỐI",
              },
              {
                name: "trackingTimeBegin",
                title: "B.ĐẦU",
              },
              {
                name: "trackingTimeEnd",
                title: "K.THÚC",
              },
              {
                name: "timeExceed",
                title: "OT",
              },
              {
                name: "unit",
                title: "ĐƠN VỊ TÍNH",
              },
              {
                name: "confirmer",
                title: "NGƯỜI XÁC NHẬN",
              },
              {
                name: "status",
                title: "TRẠNG THÁI",
              },
              {
                name: "actionHA",
                title: [""],
              },
            ]}
          >
            <Table
              columnExtensions={[
                { columnName: "stt", width: 50, wordWrapEnabled: true },
                {
                  columnName: "trackingDate",
                  width: 100,
                  wordWrapEnabled: true,
                },
                {
                  columnName: "contractNumber",
                  wordWrapEnabled: true,
                  width: 150,
                },
                {
                  columnName: "routeName",
                  wordWrapEnabled: true,
                  minWidth: 170,
                },
                { columnName: "plate", wordWrapEnabled: true, width: 100 },
                { columnName: "driverName", wordWrapEnabled: true, width: 150 },
                {
                  columnName: "km",
                  wordWrapEnabled: true,
                  width: 50,
                  align: "right",
                  textAlign: "right",
                },
                {
                  columnName: "kmExceed",
                  wordWrapEnabled: true,
                  width: 75,
                  align: "right",
                  textAlign: "right",
                },
                {
                  columnName: "kmBegin",
                  wordWrapEnabled: true,
                  width: 50,
                  align: "right",
                  textAlign: "right",
                },
                {
                  columnName: "kmEnd",
                  wordWrapEnabled: true,
                  width: 50,
                  align: "right",
                  textAlign: "right",
                },
                {
                  columnName: "trackingTimeBegin",
                  wordWrapEnabled: true,
                  width: 75,
                },
                {
                  columnName: "trackingTimeEnd",
                  wordWrapEnabled: true,
                  width: 75,
                },
                { columnName: "timeExceed", wordWrapEnabled: true, width: 70 },
                { columnName: "unit", wordWrapEnabled: true, width: 130 },
                { columnName: "confirmer", wordWrapEnabled: true, width: 130 },
                { columnName: "status", wordWrapEnabled: true, width: 100 },
                {
                  columnName: "actionHA",
                  align: "center",
                  textAlign: "center",
                  width: 50,
                },
              ]}
              rightColumns={["actionHA"]}
              cellComponent={(props) => {
                return Cell({ props, onShowModal ,onShowCheckIn,setShowCheckIn,setInfoHeader});
              }}
            />
            <TableColumnReordering />
            <TableHeaderRow
              cellComponent={(props) => {
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
              cellComponent={(props) => {
                return (
                  <TableBandHeader.Cell
                    {...props}
                    style={{
                      ...props.style,
                      background: "#f2f3f8",
                      textAlign: "center",
                      fontSize: 17,
                      color: "rgb(108, 114, 147)",
                      paddingTop: 0,
                      paddingBottom: 0,
                    }}
                  />
                );
              }}
              columnBands={columnBands}
            />
            <TableFixedColumns rightColumns={["actionHA"]} />
            <PagingState currentPage={currentPage} pageSize={pageSize} />
            <IntegratedPaging />
            <PagingPanel
              messages={{
                info: calculatePageInfo(currentPage, pageSize, totalLength),
                rowsPerPage: "Số bản ghi trên mỗi trang",
              }}
              containerComponent={(props) => (
                <PagingContainer
                  {...props}
                  onCurrentPageChange={(page) => {
                    setParams((prevState) => {
                      let nextState = { ...prevState };
                      nextState.pages = page;
                      return nextState;
                    });
                  }}
                  onPageSizeChange={(size) => {
                    setParams((prevState) => {
                      let nextState = { ...prevState };
                      nextState.pageSize = size;
                      return nextState;
                    });
                  }}
                  pageSize={pageSize}
                  totalCount={totalLength}
                  currentPage={currentPage}
                />
              )}
            />
          </Grid>
        </Paper>
      </>
    );
  }
);

export default PerformanceMonitorList;
