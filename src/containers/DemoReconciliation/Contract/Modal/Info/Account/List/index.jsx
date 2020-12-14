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

const Cell = ({ ...restProps }, { _onReadCorporate }) => {
  const { column, value, row } = restProps;
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

const ContractList = memo(({ grid, setParam, onShowContractModal }) => {
  const [gridConfig] = useState({
    columns: [
      {
        name: "id",
        title: "#",
      },
      {
        name: "accountName",
        title: "TÀI KHOẢN",
      },
      {
        name: "corporateName",
        title: "CÔNG TY",
      },
      {
        name: "corporatePhone",
        title: "SỐ ĐIỆN THOẠI",
      },
      {
        name: "roleName",
        title: "CHỨC DANH",
      },
      {
        name: "status",
        title: "TRẠNG THÁI",
      },
    ],
    order: [
      "id",
      "accountName",
      "corporateName",
      "corporatePhone",
      "roleName",
      "status",
    ],
    tableMessages: { noData: "Không có tài khoản" },
    rowsPerPage: "Số bản ghi trên mỗi trang",
    columnExtensions: [
      { columnName: "id", wordWrapEnabled: true, width: 50 },
      { columnName: "accountName", wordWrapEnabled: true, width: 120 },
      { columnName: "corporatePhone", wordWrapEnabled: true, width: 350 },
      { columnName: "roleName", width: 150, wordWrapEnabled: true },
      { columnName: "status", width: 130 },
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
  const _onReadCorporate = useCallback(
    (contractId) => {
      onShowContractModal({
        actionName: "read",
        isShow: true,
        contractId: contractId,
      });
    },
    [onShowContractModal]
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
          messages={gridConfig.tableMessages}
          columnExtensions={gridConfig.columnExtensions}
          cellComponent={(props) => Cell(props, { _onReadCorporate })}
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
export default ContractList;
