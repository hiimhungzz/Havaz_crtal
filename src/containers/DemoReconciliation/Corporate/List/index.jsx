import React, { memo, useState, useCallback } from "react";
import { Paper } from "@material-ui/core";
import {
  PagingContainer,
  CustomizeTableHeaderRow,
  CustomizeTableBandHeader,
  TableCell,
} from "components/Utility/common";
import {
  Grid,
  PagingPanel,
  Table,
  TableColumnReordering,
  TableGroupRow,
} from "@devexpress/dx-react-grid-material-ui";
import {
  IntegratedPaging,
  PagingState,
  GroupingState,
  IntegratedGrouping,
} from "@devexpress/dx-react-grid";
import { calculatePageInfo } from "helpers/utility";
const Cell = ({ ...restProps }) => {
  if (restProps.column.name === "kmExceed") {
    return (
      <TableCell
        {...restProps}
        value={restProps.value > 0 ? restProps.value : ""}
      />
    );
  }
  return <TableCell {...restProps} />;
};

const CorporateReconciliationList = memo(({ grid, setParam }) => {
  const [gridConfig] = useState({
    columns: [
      {
        name: "date",
        title: "NGÀY",
      },
      {
        name: "contractNumber",
        title: "SỐ HĐ",
      },
      {
        name: "fixedRouteName",
        title: "TUYẾN ĐƯỜNG",
      },
      {
        name: "plate",
        title: "BKS",
      },
      {
        name: "km",
        title: "KM",
      },
      {
        name: "kmExceed",
        title: "VƯỢT",
      },
      {
        name: "kmBegin",
        title: "ĐẦU",
      },
      {
        name: "kmFinish",
        title: "CUỐI",
      },
      {
        name: "timePickUp",
        title: "B.ĐẦU",
      },
      {
        name: "timeDropOff",
        title: "K.THÚC",
      },
      {
        name: "timeExceed",
        title: "OT",
      },
      {
        name: "extraTurnPrice",
        title: "CHI PHÍ LƯỢT",
      },
    ],
    tableMessages: { noData: "Không có dữ liệu đối soát" },
    order: [
      "contractNumber",
      "date",
      "fixedRouteName",
      "plate",
      "driverName",
      "km",
      "kmExceed",
      "kmBegin",
      "kmFinish",
      "timePickUp",
      "timeDropOff",
      "timeExceed",
      "extraTurnPrice",
    ],
    rowsPerPage: "Số bản ghi trên mỗi trang",
    columnExtensions: [
      { columnName: "contractNumber", wordWrapEnabled: true, width: 150 },
      { columnName: "date", wordWrapEnabled: true, width: 100 },
      { columnName: "fixedRouteName", wordWrapEnabled: true },
      {
        columnName: "plate",
        width: 100,
        wordWrapEnabled: true,
        align: "center",
      },
      {
        columnName: "extraTurnPrice",
        width: 100,
        wordWrapEnabled: true,
        align: "right",
      },
      { columnName: "km", width: 60, wordWrapEnabled: true, align: "center" },
      {
        columnName: "kmExceed",
        width: 60,
        wordWrapEnabled: true,
        align: "center",
      },
      {
        columnName: "kmBegin",
        width: 60,
        wordWrapEnabled: true,
        align: "center",
      },
      {
        columnName: "kmFinish",
        width: 60,
        wordWrapEnabled: true,
        align: "center",
      },
      {
        columnName: "timeExceed",
        width: 60,
        wordWrapEnabled: true,
        align: "center",
      },
      {
        columnName: "timePickUp",
        width: 80,
        wordWrapEnabled: true,
        align: "center",
      },
      {
        columnName: "timeDropOff",
        width: 80,
        wordWrapEnabled: true,
        align: "center",
      },
    ],
    columnBands: [
      {
        title: "KM THỰC HIỆN",
        children: [
          { columnName: "km" },
          { columnName: "kmExceed" },
          { columnName: "kmBegin" },
          { columnName: "kmFinish" },
        ],
      },
      {
        title: "THỜI GIAN THỰC HIỆN",
        children: [
          { columnName: "timePickUp" },
          { columnName: "timeDropOff" },
          { columnName: "timeExceed" },
        ],
      },
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
  console.log("grid.get()", grid.get("data"))
  console.log("grouping", grouping)
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
          stubHeaderCellComponent={(props) => (
            <Table.StubHeaderCell
              {...props}
              style={{ ...props.style, background: "#f2f3f8" }}
            />
          )}
          cellComponent={(props) => Cell(props)}
        />
        <TableColumnReordering order={gridConfig.order} />
        <CustomizeTableHeaderRow />
        <TableGroupRow />
        <CustomizeTableBandHeader columnBands={gridConfig.columnBands} />
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
export default CorporateReconciliationList;
