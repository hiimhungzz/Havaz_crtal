import React, { memo, useState, useCallback } from "react";
import { Modal, Checkbox, Tag } from "antd";
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

const Cell = ({ ...restProps }, { _onShowDeleteTour, _onReadTour }) => {
  const { column, value, row } = restProps;
  if (column.name === "action") {
    return (
      <Table.Cell
        {...restProps}
        value={
          <>
            <A
              onClick={(e) => {
                e.preventDefault();
                _onReadTour(row.uuid);
              }}
              title="Sửa tour"
              className="fa fa-edit pr-2"
            />
            <A
              onClick={(e) => {
                e.preventDefault();
                _onShowDeleteTour(row.uuid);
              }}
              title="Xóa tour"
              className="fa fa-trash"
            />
          </>
        }
      />
    );
  }
  if (column.name === "isPublic") {
    return (
      <Table.Cell
        {...restProps}
        value={<Checkbox disabled checked={value} />}
      />
    );
  }
  if (column.name === "status") {
    return (
      <Table.Cell
        {...restProps}
        value={<Tag color={row.statusColor}>{row.status}</Tag>}
      />
    );
  }
  return <Table.Cell {...restProps} />;
};

const TourList = memo(({ grid, setParam, onDeleteTour, onShowTourModal }) => {
  const [gridConfig] = useState({
    columns: [
      {
        name: "code",
        title: "MÃ",
      },
      {
        name: "name",
        title: "TÊN",
      },
      {
        name: "route",
        title: "LỘ TRÌNH",
      },
      {
        name: "parentName",
        title: "ĐƠN VỊ QUẢN LÝ",
      },
      {
        name: "isPublic",
        title: "CÔNG KHAI",
      },
      {
        name: "numberOfDays",
        title: "SỐ NGÀY",
      },
      {
        name: "numberOfNights",
        title: "SỐ ĐÊM",
      },
      {
        name: "rating",
        title: "ĐÁNH GIÁ",
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
        title: "",
      },
    ],
    order: [
      "code",
      "name",
      "route",
      "parentName",
      "isPublic",
      "numberOfDays",
      "numberOfNights",
      "rating",
      "createdAt",
      "status",
      "action",
    ],
    rowsPerPage: "Số bản ghi trên mỗi trang",
    columnExtensions: [
      { columnName: "name", width: 280, wordWrapEnabled: true },
      { columnName: "route", wordWrapEnabled: true },
      { columnName: "status", width: 130 },
      { columnName: "parentName", wordWrapEnabled: true, width: 200 },
      { columnName: "action", width: 50 },
      { columnName: "numberOfDays", width: 80, align: "right" },
      { columnName: "numberOfNights", width: 80, align: "right" },
      { columnName: "rating", width: 80, align: "right" },
      { columnName: "isPublic", width: 100, align: "center" },
      { columnName: "createdAt", width: 100, align: "center" },
      { columnName: "code", wordWrapEnabled: true, width: 120 },
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
  const _onShowDeleteTour = useCallback(
    (tourId) => {
      Modal.confirm({
        title: "Xác nhận xóa tour ?",
        content: "",
        okText: "Xác nhận",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          onDeleteTour({ uuid: tourId });
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    [onDeleteTour]
  );
  const _onReadTour = useCallback(
    (tourId) => {
      onShowTourModal({
        actionName: "read",
        isShow: true,
        tourId: tourId,
      });
    },
    [onShowTourModal]
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
            Cell(props, { _onShowDeleteTour, _onReadTour })
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
});
export default TourList;
