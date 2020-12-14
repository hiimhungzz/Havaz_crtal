import React, { memo, useState, useCallback } from "react";
import { Modal } from "antd";
import _ from "lodash";
import { Paper } from "@material-ui/core";
import A from "@Components/A";
import { PagingContainer, TableHeaderContent } from "components/Utility/common";
import {
  Grid,
  PagingPanel,
  Table,
  TableColumnReordering,
  TableHeaderRow,
} from "@devexpress/dx-react-grid-material-ui";
import { IntegratedPaging, PagingState } from "@devexpress/dx-react-grid";
import { calculatePageInfo } from "helpers/utility";

const Cell = ({ ...restProps }, { _onShowDeleteRoute, _onReadRoute }) => {
  const { column, value, row } = restProps;
  if (column.name === "status") {
    return (
      <Table.Cell
        {...restProps}
        value={
          <i
            style={{ color: row.color }}
            title={value}
            className={`fa ${row.icon}`}
          />
        }
      />
    );
  }
  if (column.name === "action") {
    return (
      <Table.Cell
        {...restProps}
        value={
          <>
            <A
              onClick={(e) => {
                e.preventDefault();
                _onReadRoute(row.uuid);
              }}
              title="Sửa tuyến đường"
              className="fa fa-edit pr-2"
            />
            <A
              onClick={(e) => {
                e.preventDefault();
                _onShowDeleteRoute(row.uuid);
              }}
              title="Xóa tuyến đường"
              className="fa fa-trash"
            />
          </>
        }
      />
    );
  }
  return <Table.Cell {...restProps} />;
};

const RouteList = memo(
  ({ grid, setParam, onDeleteRoute, onShowRouteModal }) => {
    const [gridConfig] = useState({
      columns: [
        {
          name: "code",
          title: "MÃ",
        },
        {
          name: "name",
          title: "TUYẾN ĐƯỜNG",
        },
        {
          name: "parentName",
          title: "ĐƠN VỊ QUẢN LÝ",
        },
        {
          name: "distance",
          title: "KM THỰC TẾ",
        },
        {
          name: "preDistance",
          title: "KM ĐỀ XUẤT",
        },
        {
          name: "days",
          title: "SỐ NGÀY",
        },
        {
          name: "numberPoint",
          title: "SỐ ĐIỂM",
        },
        {
          name: "createdAt",
          title: "NGÀY TẠO",
        },
        {
          name: "status",
          title: "TRẠNG THÁI",
        },
        {
          name: "action",
          title: " ",
        },
      ],
      order: [
        "code",
        "name",
        "parentName",
        "distance",
        "preDistance",
        "days",
        "numberPoint",
        "createdAt",
        "status",
        "action",
      ],
      rowsPerPage: "Số bản ghi trên mỗi trang",
      columnExtensions: [
        {
          columnName: "code",
          width: 120,
          wordWrapEnabled: true,
          align: "left",
        },
        {
          columnName: "name",
          wordWrapEnabled: true,
          align: "left",
        },
        {
          columnName: "distance",
          width: 100,
          align: "right",
        },
        {
          columnName: "parentName",
          width: 200,
          align: "center",
          wordWrapEnabled: true,
        },
        {
          columnName: "preDistance",
          width: 100,
          align: "right",
        },
        { columnName: "days", width: 80, align: "right" },
        { columnName: "numberPoint", width: 80, align: "right" },
        { columnName: "createdAt", width: 100 },
        { columnName: "status", width: 80, align: "center" },
        {
          columnName: "action",
          width: 50,
        },
      ],
    });
    const _onChangePageSize = useCallback(
      (pageSize) => {
        setParam((prevState) => {
          let nextState = prevState;
          nextState = nextState.set("pageLimit", pageSize);
          nextState = nextState.set("currentPage", 0);
          return nextState;
        });
      },
      [setParam]
    );
    const _onChangeCurrentPage = useCallback(
      (currentPage) => {
        setParam((prevState) => {
          let nextState = prevState;
          nextState = nextState.set("currentPage", currentPage);
          return nextState;
        });
      },
      [setParam]
    );
    const _onShowDeleteRoute = useCallback(
      (routeId) => {
        Modal.confirm({
          title: "Xác nhận xóa tuyến đường ?",
          content: "",
          okText: "Xác nhận",
          okType: "danger",
          cancelText: "Hủy",
          onOk() {
            onDeleteRoute({ uuid: routeId });
          },
          onCancel() {
            console.log("Cancel");
          },
        });
      },
      [onDeleteRoute]
    );
    const _onReadRoute = useCallback(
      (routeId) => {
        onShowRouteModal({
          actionName: "read",
          isShow: true,
          routeId: routeId,
        });
      },
      [onShowRouteModal]
    );
    return (
      <Paper variant="outlined" square>
        <Grid rows={grid.get("data")} columns={gridConfig.columns}>
          <PagingState
            currentPage={grid.get("currentPage")}
            pageSize={grid.get("pageLimit")}
          />
          <IntegratedPaging />
          <Table
            columnExtensions={gridConfig.columnExtensions}
            cellComponent={(props) =>
              Cell(props, { _onShowDeleteRoute, _onReadRoute })
            }
          />
          <TableColumnReordering order={gridConfig.order} />
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
          <PagingPanel
            messages={{
              info: calculatePageInfo(
                grid.get("currentPage"),
                grid.get("pageLimit"),
                grid.get("totalLength")
              ),
              rowsPerPage: gridConfig.rowsPerPage,
            }}
            containerComponent={(props) => (
              <PagingContainer
                {...props}
                onCurrentPageChange={_onChangeCurrentPage}
                onPageSizeChange={_onChangePageSize}
                pageSize={grid.get("pageLimit")}
                totalCount={grid.get("totalLength")}
                currentPage={grid.get("currentPage")}
              />
            )}
          />
        </Grid>
      </Paper>
    );
  }
);
export default RouteList;
