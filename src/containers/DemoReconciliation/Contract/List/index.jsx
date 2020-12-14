import React, { memo, useState } from "react";
import { Paper } from "@material-ui/core";
import _ from "lodash";
import { CustomizeTableHeaderRow, TableCell } from "@Components/Utility/common";
import {
  Grid,
  Table,
  TableColumnReordering,
} from "@devexpress/dx-react-grid-material-ui";
const Cell = ({ ...restProps }) => {
  if (
    _.includes(["totalPrice", "totalCount"], _.get(restProps, "column.name"))
  ) {
    return <TableCell {...restProps} style={{ background: "whitesmoke" }} />;
  }
  return <TableCell {...restProps} />;
};

const ContractReconciliationList = memo(({ grid, contract }) => {
  const [gridConfig] = useState({
    columns: [
      {
        name: "id",
        title: "#",
      },
      {
        name: "vehiclesTypeName",
        title: "LOẠI XE",
      },
      {
        name: "fixedRouteName",
        title: "TUYẾN ĐƯỜNG",
      },
      {
        name: "unit",
        title: "ĐƠN VỊ",
      },
      {
        name: "turnNumber",
        title: "SỐ LƯỢT HĐ",
      },
      {
        name: "monthlyCount",
        title: "SỐ LƯỢT TH THEO HĐ",
      },
      {
        name: "extraTurnCount",
        title: "SỐ LƯỢT PS",
      },
      {
        name: "extraOTCount",
        title: "SỐ LƯỢT PS OT",
      },
      {
        name: "extraHolidayCount",
        title: "SỐ LƯỢT PS LỄ",
      },
      {
        name: "monthlyPrice",
        title: "CHI PHÍ HĐ THUÊ THÁNG",
      },
      {
        name: "extraTurnPrice",
        title: "CHI PHÍ PS LƯỢT",
      },
      {
        name: "extraOTPrice",
        title: "CHI PHÍ PS NGOÀI GIỜ",
      },
      {
        name: "extraHolidayPrice",
        title: "CHI PHÍ HĐ CN, LỄ TẾT",
      },
      {
        name: "totalCount",
        title: "TỔNG SỐ LƯỢT TH",
      },
      {
        name: "totalPrice",
        title: "TỔNG",
      },
    ],
    columnsByContract: [
      {
        name: "id",
        title: "#",
      },
      {
        name: "vehiclesTypeName",
        title: "LOẠI XE",
      },
      {
        name: "fixedRouteName",
        title: "TUYẾN ĐƯỜNG",
      },
      {
        name: "unit",
        title: "ĐƠN VỊ",
      },
      {
        name: "turnNumber",
        title: "SỐ KM TRỌN GÓI",
      },
      {
        name: "monthlyCount",
        title: "SỐ KM TH THEO HĐ",
      },
      {
        name: "extraTurnCount",
        title: "SỐ KM PS",
      },
      {
        name: "extraOTCount",
        title: "PHÁT SINH OT",
      },
      {
        name: "extraHolidayCount",
        title: "PS CN LỄ TẾT",
      },
      {
        name: "monthlyPrice",
        title: "CHI PHÍ HĐ THUÊ THÁNG",
      },
      {
        name: "extraTurnPrice",
        title: "CHI PHÍ PS KM",
      },
      {
        name: "extraOTPrice",
        title: "CHI PHÍ PS NGOÀI GIỜ",
      },
      {
        name: "extraHolidayPrice",
        title: "CHI PHÍ HĐ CN, LỄ TẾT",
      },
      {
        name: "totalCount",
        title: "TỔNG SỐ KM TH",
      },
      {
        name: "totalPrice",
        title: "TỔNG",
      },
    ],
    tableMessages: { noData: "Không có dữ liệu đối soát" },
    order: [
      "id",
      "vehiclesTypeName",
      "fixedRouteName",
      "unit",
      "turnNumber",
      "monthlyCount",
      "extraTurnCount",
      "extraOTCount",
      "extraHolidayCount",
      "totalCount",
      "monthlyPrice",
      "extraTurnPrice",
      "extraOTPrice",
      "extraHolidayPrice",
      "totalPrice",
    ],
    rowsPerPage: "Số bản ghi trên mỗi trang",
    columnExtensions: [
      { columnName: "id", wordWrapEnabled: true, width: 60 },
      { columnName: "vehiclesTypeName", wordWrapEnabled: true, width: 120 },
      { columnName: "fixedRouteName", wordWrapEnabled: true },
      {
        columnName: "unit",
        width: 60,
        wordWrapEnabled: true,
        align: "center",
      },
      {
        columnName: "turnNumber",
        width: 95,
        wordWrapEnabled: true,
        align: "center",
      },
      {
        columnName: "monthlyCount",
        width: 95,
        wordWrapEnabled: true,
        align: "center",
      },
      {
        columnName: "extraTurnCount",
        width: 75,
        wordWrapEnabled: true,
        align: "center",
      },
      {
        columnName: "extraOTCount",
        width: 75,
        wordWrapEnabled: true,
        align: "center",
      },
      {
        columnName: "extraHolidayCount",
        width: 75,
        wordWrapEnabled: true,
        align: "center",
      },
      {
        columnName: "monthlyPrice",
        width: 100,
        wordWrapEnabled: true,
        align: "right",
      },
      {
        columnName: "extraTurnPrice",
        width: 100,
        wordWrapEnabled: true,
        align: "right",
      },
      {
        columnName: "extraOTPrice",
        width: 90,
        wordWrapEnabled: true,
        align: "right",
      },
      {
        columnName: "extraHolidayPrice",
        width: 90,
        wordWrapEnabled: true,
        align: "right",
      },
      {
        columnName: "totalCount",
        width: 75,
        wordWrapEnabled: true,
        align: "center",
      },
      {
        columnName: "totalPrice",
        width: 100,
        wordWrapEnabled: true,
        align: "right",
      },
    ],
  });
  return (
    <Paper variant="outlined" square>
      <Grid rows={grid.get("data")} columns={contract && contract.contractType === "1.4" ? gridConfig.columnsByContract : gridConfig.columns}>
        <Table
          messages={gridConfig.tableMessages}
          columnExtensions={gridConfig.columnExtensions}
          cellComponent={(props) => Cell(props)}
          tableComponent={(props) => (
            <Table.Table {...props} style={{ minWidth: 1366 }} />
          )}
        />
        <TableColumnReordering order={gridConfig.order} />
        <CustomizeTableHeaderRow />
      </Grid>
    </Paper>
  );
});
export default ContractReconciliationList;
