import React, { memo, useState, useCallback } from "react";
import _ from "lodash";
import { Paper } from "@material-ui/core";
import A from "@Components/A";
import { TableHeaderContent, PagingContainer } from "components/Utility/common";
import {
  Grid,
  Table,
  PagingPanel,
  TableColumnReordering,
  TableHeaderRow,
} from "@devexpress/dx-react-grid-material-ui";
import { calculatePageInfo } from "helpers/utility";
import { IntegratedPaging, PagingState } from "@devexpress/dx-react-grid";

const Cell = ({ ...restProps }, { _onReadRole, _onDelete }) => {
  const { column, row } = restProps;
  if (column.name === "action") {
    return (
      <Table.Cell
        {...restProps}
        value={
          <>
            <A
              onClick={(e) => {
                e.preventDefault();
                _onReadRole(row.uuid);
              }}
              title="Sửa role"
              className="fa fa-edit pr-2"
            />
          </>
        }
      />
    );
  }

  return <Table.Cell {...restProps} />;
};

const RoleList = memo(({ grid, setParam, onShowRoleModal, onHandleDelete }) => {
  const [gridConfig] = useState({
    columns: [
      {
        name: "name",
        title: "TÊN",
      },
      {
        name: "organizationName",
        title: "DOANH NGHIỆP",
      },
      // {
      //   name: "entity",
      //   title: "ĐỐI TƯỢNG",
      // },
      {
        name: "action",
        title: "",
      },
    ],
    order: ["name", "organizationName", "entity", "action"],
    rowsPerPage: "Số bản ghi trên mỗi trang",
    tableMessages: { noData: "Không có dữ liệu" },
    columnExtensions: [
      { columnName: "name", width: 280, wordWrapEnabled: true },
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

  const _onReadRole = useCallback(
    (roleId) => {
      onShowRoleModal({
        actionName: "read",
        isShow: true,
        roleId: roleId,
      });
    },
    [onShowRoleModal]
  );
  const _onDelete = useCallback(
    (roleId) => {
      onHandleDelete({
        roleId: roleId,
      });
      console.log("indexChild/90", roleId);
    },
    [onHandleDelete]
  );
  return (
    <Paper variant="outlined" square>
      <Grid rows={grid.get("data")} columns={gridConfig.columns}>
        <Table
          columnExtensions={gridConfig.columnExtensions}
          cellComponent={(props) => Cell(props, { _onReadRole, _onDelete })}
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
        <PagingState
          currentPage={grid.get("currentPage")}
          pageSize={grid.get("pageLimit")}
        />
        <IntegratedPaging />
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
export default RoleList;
