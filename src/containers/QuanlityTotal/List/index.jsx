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
  TableHeaderRow,
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

const totalLength = 10;
const quanlityTotalList = memo(
  ({ currentPage, pageSize, setParams, gird, loading }) => {
    return (
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <Paper variant="outlined" square>
          <Grid
            rows={gird.get("data")}
            columns={[
              {
                name: "date",
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
                name: "totalDistance",
                title: "TỔNG KM",
              },
              {
                name: "turn",
                title: "SỐ LƯỢT",
              },
              {
                name: "loiXuatben",
                title: "SỐ LƯỢT CÓ LỖI XB",
              },
              {
                name: "luotDenMuon",
                title: "SỐ LƯỢT ĐẾN MUỘN",
              },

              {
                name: "loiQuaDiem",
                title: "SỐ LỖI QUA ĐIỂM",
              },

              {
                name: "tiLeLoiXuatBen",
                title: "TỈ LỆ LỖI XB",
              },
              {
                name: "tiLeLuotDenMuon",
                title: "TỈ LỆ ĐẾN MUỘN",
              },
              {
                name: "tiLeXeQuaDiemMuon",
                title: "TỈ LỆ QUA ĐIỂM MUỘN",
              },
              {
                name: "tiLeKM",
                title: "TỈ LỆ KM THỰC TẾ/KM HĐ",
              },
            ]}
          >
            <PagingState
              defaultCurrentPage={gird.get("pages")}
              pageSize={gird.set("pageSize")}
            />
            <Table
              columnExtensions={[
                { columnName: "pickUpAt", wordWrapEnabled: true, width: 100 },
                { columnName: "contractNumber", wordWrapEnabled: true },
                { columnName: "fixedRouteName", wordWrapEnabled: true },
                {
                  columnName: "totalDistance",
                  wordWrapEnabled: true,
                  align: "right",
                  width: 100,
                },
                {
                  columnName: "loiXuatben",
                  wordWrapEnabled: true,
                  width: 100,
                  align: "right",
                },
                {
                  columnName: "turn",
                  wordWrapEnabled: true,
                  width: 100,
                  align: "right",
                },
                {
                  columnName: "luotDenMuon",
                  wordWrapEnabled: true,
                  width: 100,
                  align: "right",
                },
                {
                  columnName: "turnNumber",
                  wordWrapEnabled: true,
                  width: 100,
                  align: "right",
                },
                {
                  columnName: "loiQuaDiem",
                  wordWrapEnabled: true,
                  width: 100,
                  align: "right",
                },
                {
                  columnName: "tiLeLoiXuatBen",
                  wordWrapEnabled: true,
                  width: 100,
                  align: "right",
                },
                {
                  columnName: "export",
                  wordWrapEnabled: true,
                  width: 100,
                  align: "right",
                },
                {
                  columnName: "tiLeXeQuaDiemMuon",
                  wordWrapEnabled: true,
                  width: 100,
                  align: "right",
                },
                {
                  columnName: "tiLeLuotDenMuon",
                  wordWrapEnabled: true,
                  width: 100,
                  align: "right",
                },
                {
                  columnName: "tiLeKM",
                  wordWrapEnabled: true,
                  width: 130,
                  align: "right",
                },
              ]}
              cellComponent={(props) => Cell({ props })}
            />
            <TableColumnReordering />
            <TableHeaderRow
              cellComponent={(props) => (
                <TableHeaderRow.Cell
                  {...props}
                  style={{
                    ...props.style,
                    background: "#f2f3f8",
                    textAlign: "center",
                  }}
                />
              )}
              //   contentComponent={TableHeaderContent}
            />

            <PagingState
              currentPage={gird.get("pages")}
              pageSize={gird.get("pageSize")}
            />
            <IntegratedPaging />
            <PagingPanel
              messages={{
                info: `1-${gird.get("pageSize")} của ${parseInt(
                  gird.get("totalLength")
                )}`,
                rowsPerPage: "Số bản ghi trên mỗi trang",
              }}
              containerComponent={(props) => (
                <PagingContainer
                  {...props}
                  pageSizes={[5, 10, 15]}
                  pageSize={gird.get("pageSize")}
                  totalCount={gird.get("totalLength")}
                  currentPage={gird.get("pages")}
                  totalPages={
                    gird.get("totalLength") % gird.get("pageSize") > 0
                      ? parseInt(
                          gird.get("totalLength") / gird.get("pageSize")
                        ) + 1
                      : gird.get("totalLength") / gird.get("pageSize")
                  }
                  onCurrentPageChange={(page) => {
                    setParams((prevState) => {
                      const nextState = { ...prevState };
                      nextState.pages = page;
                      return nextState;
                    });
                  }}
                  onPageSizeChange={(size) => {
                    setParams((prevState) => {
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
  }
);
export default quanlityTotalList;
