import React, { memo, useState, useEffect, useCallback } from "react";
import { Spin, Modal, Button } from "antd";
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
import Cell from "./Cell/index";
const cell = memo(({}) => {
  const [data, setData] = useState([
    {
      id: "Chuột",
      criteria: "Đồng hồ",
      type: "Bắt buộc",
      driverEvalute: "Bắc giang",
      commentLead: "ok ngon",
      typeStyle:1
    },
    {
      id: "Chuột",
      criteria: "Đồng hồ",
      type: "Bắt buộc",
      driverEvalute: "Đạt",
      commentLead: "ok ngon",
      typeStyle:1
    },
    {
      id: "Chuột",
      criteria: "Cốc",
      type: "Bắt buộc",
      driverEvalute: "Không đạt",
      commentLead: "ok ngon",
      typeStyle:2
    },
    {
      id: "Chuột",
      criteria: "Lao Động",
      type: "Bắt buộc",
      driverEvalute: "Không đạt",
      commentLead: "ok ngon",
      typeStyle:2
    },
    {
      id: "Chuột",
      criteria: "Lao Động",
      type: "Bắt buộc",
      driverEvalute: "Đạt",
      commentLead: "ok ngon",
      typeStyle:1
    },
    {
      id: "Chuột",
      criteria: "Lao Động",
      type: "Bắt buộc",
      driverEvalute: "Không đạt",
      commentLead: "ok ngon",
      typeStyle:2
    },
    {
      id: "Chuột",
      criteria: "Lao Động",
      type: "Bắt buộc",
      driverEvalute: "Đạt",
      commentLead: "ok ngon",
      typeStyle:1
    },
    {
      id: "Chuột",
      criteria: "Lao Động",
      type: "Bắt buộc",
      driverEvalute: "Đạt",
      commentLead: "ok ngon",
      typeStyle:1
    },
    {
      id: "Chuột",
      criteria: "Lao Động",
      type: "Bắt buộc",
      driverEvalute: "Đạt",
      commentLead: "ok ngon",
      typeStyle:1
    },
    {
      id: "Chuột",
      criteria: "Quần áo",
      type: "Bắt buộc",
      driverEvalute: "Đạt",
      commentLead: "ok ngon",
      typeStyle:1
    },
    {
      id: "Chuột",
      criteria: "Quần áo",
      type: "Bắt buộc",
      driverEvalute: "Không đạt",
      commentLead: "ok ngon",
      typeStyle:2
    },
    {
      id: "Chuột",
      criteria: "Cốc",
      type: "Bắt buộc",
      driverEvalute: "Đạt",
      commentLead: "ok ngon",
      typeStyle:1
    },
  ]);
  return (
    <Paper>
      <Grid
        rows={data}
        columns={[
          {
            name: "id",
            title: "#",
          },
          {
            name: "criteria",
            title: "TIÊU CHÍ",
          },
          {
            name: "type",
            title: "LOẠI",
          },
          {
            name: "driverEvalute",
            title: "LÁI XE ĐÁNH GIÁ",
          },
          {
            name: "commentLead",
            title: "NHẬN XÉT QUẢN LÍ",
          },
        ]}
      >
        <GroupingState grouping={[{ columnName: "criteria" }]} />
        <IntegratedGrouping />
        <Table cellComponent={(props) => Cell({ props })} />
        <TableHeaderRow />
        <TableGroupRow />
      </Grid>
    </Paper>
  );
});
export default cell;
