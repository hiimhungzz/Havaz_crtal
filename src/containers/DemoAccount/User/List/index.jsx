import React, { memo, useState, useCallback } from "react";
import { Modal, Checkbox, Tag } from "antd";
import _ from "lodash";
import { Paper } from "@material-ui/core";
import A from "@Components/A";
import {
  PagingContainer,
  TableHeaderContent,
  TableCell,
} from "components/Utility/common";
import {
  Grid,
  PagingPanel,
  VirtualTable,
  TableColumnReordering,
  TableHeaderRow,
} from "@devexpress/dx-react-grid-material-ui";
import { IntegratedPaging, PagingState } from "@devexpress/dx-react-grid";
import { calculatePageInfo } from "helpers/utility";
import { withStyles } from "@material-ui/core/es/styles";

const Cell = memo(
  withStyles({
    listContainer: {
      display: "grid",
      gridAutoFlow: "row",
    },
  })(({ classes, onReadUser, ...restProps }) => {
    const { column, value, row } = restProps;
    if (
      _.includes(["col_1", "col_3", "col_4", "rolesIds"], _.get(column, "name"))
    ) {
      return (
        <TableCell
          {...restProps}
          value={
            <div className={classes.listContainer}>
              {_.map(value, (item, itemId) => {
                return <span key={itemId}>{item}</span>;
              })}
            </div>
          }
        />
      );
    }
    if (column.name === "action") {
      return (
        <TableCell
          {...restProps}
          value={
            <A
              onClick={(e) => {
                e.preventDefault();
                onReadUser(row.uuid);
              }}
              title="Sửa tài khoản"
              className="fa fa-edit pr-2"
            />
          }
        />
      );
    }
    if (column.name === "status") {
      return (
        <TableCell
          {...restProps}
          value={
            <i
              style={{ color: value.color, fontSize: 14 }}
              title={value.name}
              className={`fa ${value.icon}`}
            />
          }
        />
      );
    }
    return <TableCell {...restProps} />;
  })
);

const UserList = memo(({ classes, grid, setParam, onShowUserModal }) => {
  console.log("grid", grid.toJS());
  const [gridConfig] = useState({
    columns: [
      {
        name: "col_1",
        title: ["MÃ", "NGÀY TẠO"],
      },
      {
        name: "refCode",
        title: "REF CODE",
      },
      {
        name: "col_3",
        title: ["HỌ TÊN", "SĐT", "EMAIL"],
      },
      {
        name: "col_4",
        title: ["DOANH NGHIỆP", "THÀNH PHỐ"],
      },

      {
        name: "parentName",
        title: "ĐƠN VỊ QUẢN LÝ",
      },
      {
        name: "rolesIds",
        title: "CHỨC DANH",
      },
      {
        name: "guestNumber",
        title: "SỐ KHÁCH QUẢN LÝ",
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
      "col_1",
      "refCode",
      "col_3",
      "col_4",
      "parentName",
      "rolesIds",
      "guestNumber",
      "status",
      "action",
    ],
    tableMessages: { noData: "Không có dữ liệu" },
    rowsPerPage: "Số bản ghi trên mỗi trang",
    columnExtensions: [
      { columnName: "col_1", width: 120, wordWrapEnabled: true },
      { columnName: "refCode", width: 100, wordWrapEnabled: true },
      { columnName: "col_3", width: 180, wordWrapEnabled: true },
      { columnName: "col_4", wordWrapEnabled: true },
      { columnName: "parentName", wordWrapEnabled: true, width: 200 },
      { columnName: "rolesIds", wordWrapEnabled: true, width: 120 },
      { columnName: "guestNumber", wordWrapEnabled: true, width: 70 },
      {
        columnName: "status",
        width: 60,
        wordWrapEnabled: true,
        align: "center",
      },
      { columnName: "action", width: 50 },
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
  const _onReadUser = useCallback(
    (userId) => {
      onShowUserModal({
        actionName: "read",
        isShow: true,
        userId: userId,
      });
    },
    [onShowUserModal]
  );
  return (
    <Paper variant="outlined" square>
      <Grid
        rootComponent={(props) => {
          return <Grid.Root {...props} className={classes.rootBase} />;
        }}
        rows={grid.get("data")}
        columns={gridConfig.columns}
      >
        <PagingState
          currentPage={grid.get("currentPage")}
          pageSize={grid.get("pageLimit")}
        />
        <IntegratedPaging />
        <VirtualTable
          height="auto"
          messages={gridConfig.tableMessages}
          tableComponent={(props) => {
            return (
              <VirtualTable.Table
                {...props}
                style={{ ...props.style, marginBottom: 0 }}
              />
            );
          }}
          columnExtensions={gridConfig.columnExtensions}
          cellComponent={(props) => (
            <Cell {...props} onReadUser={_onReadUser} />
          )}
        />
        <TableColumnReordering order={gridConfig.order} />
        <TableHeaderRow
          cellComponent={(props) => {
            return (
              <TableHeaderRow.Cell
                {...props}
                style={{
                  ...props.style,
                  paddingTop: 2,
                  paddingBottom: 2,
                  background: "#f2f3f8",
                }}
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
export default withStyles({
  rootBase: {
    maxHeight: "calc(100vh - 292px)",
    height: "auto !important",
  },
})(UserList);
