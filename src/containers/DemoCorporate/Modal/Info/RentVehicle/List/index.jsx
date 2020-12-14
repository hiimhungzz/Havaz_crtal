import React, { memo, useState, useCallback } from "react";
import { Paper } from "@material-ui/core";
import {
  PagingContainer,
  CustomizeTableHeaderRow,
  TableCell,
} from "@Components/Utility/common";
import {
  Grid,
  PagingPanel,
  Table,
  TableColumnReordering,
  TableGroupRow,
} from "@devexpress/dx-react-grid-material-ui";
import {
  IntegratedPaging,
  IntegratedGrouping,
  PagingState,
  GroupingState,
} from "@devexpress/dx-react-grid";
import { calculatePageInfo } from "helpers/utility";

const Cell = ({ ...restProps }, { _onReadCorporate }) => {
  return <TableCell {...restProps} />;
};
const RentVehicleList = memo(({ grid, setParam, onShowContractModal }) => {
  const [gridConfig] = useState({
    columns: [
      {
        name: "id",
        title: "#",
      },
      {
        name: "contractNumber",
        title: "HỢP ĐỒNG",
      },
      {
        name: "organizationName",
        title: "DOANH NGHIỆP",
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
        name: "vehiclesTypeName",
        title: "LOẠI XE",
      },
      {
        name: "period",
        title: "THỜI GIAN",
      },
      {
        name: "status",
        title: "TRẠNG THÁI",
      },
    ],
    order: [
      "id",
      "contractNumber",
      "organizationName",
      "plate",
      "driverName",
      "vehiclesTypeName",
      "period",
      "status",
    ],
    tableMessages: { noData: "Không có xe thuê" },
    rowsPerPage: "Số bản ghi trên mỗi trang",
    columnExtensions: [
      { columnName: "id", wordWrapEnabled: true, width: 50 },
      { columnName: "contractNumber", wordWrapEnabled: true, width: 200 },
      { columnName: "organizationName", wordWrapEnabled: true },
      { columnName: "period", width: 200, wordWrapEnabled: true },
      { columnName: "status", width: 130 },
    ],
  });
  const [grouping, setGrouping] = useState([{ columnName: "contractNumber" }]);
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
        <GroupingState grouping={grouping} onGroupingChange={setGrouping} />
        <IntegratedGrouping />
        <PagingState
          currentPage={grid.get("currentPage")}
          pageSize={grid.get("totalRows")}
        />
        <IntegratedPaging />
        <Table
          messages={gridConfig.tableMessages}
          columnExtensions={gridConfig.columnExtensions}
          cellComponent={(props) => Cell(props, { _onReadCorporate })}
          stubHeaderCellComponent={(props) => (
            <Table.StubHeaderCell
              {...props}
              style={{ ...props.style, background: "#f2f3f8" }}
            />
          )}
        />
        <TableColumnReordering order={gridConfig.order} />
        <CustomizeTableHeaderRow />
        <TableGroupRow />
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
export default RentVehicleList;
