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
import { requestJsonGet } from "@Services/base";
import Cell from "./Cell/index";
import { Map } from "immutable";
let time = null;
const cell = memo(({ uuidTrip, typeStation }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(
    Map({
      data: [],
    })
  );
  const boweLoad = useCallback(async () => {
    setLoading(true);
    let result = await requestJsonGet({
      url: `/report/trip-quality/${uuidTrip}/detail`,
      method: "GET",
      data: {
        type: typeStation,
      },
    });
    if (result.hasErrors) {
      setLoading(false);
    } else {
      setLoading(false);
      setData((preState) => {
        let nextState = preState;
        nextState = nextState.set("data", result.data);
        return nextState;
      });
    }
  }, []);
  useEffect(() => {
    clearTimeout(time);
    time = setTimeout(boweLoad, 800);
  }, [boweLoad]);
  return (
    <>
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <Paper variant="outlined" square>
          <Grid
            rows={data.get("data")}
            columns={[
              {
                name: "surParentName",
                title: "TIÊU CHÍ",
              },
              {
                name: "surName",
                title: "TIÊU CHÍ",
              },
              {
                name: "surType",
                title: "LOẠI",
              },
              {
                name: "surResult",
                title: "LÁI XE ĐÁNH GIÁ",
              },
              {
                name: "ckNote",
                title: "NHẬN XÉT LÁI XE",
              },
            ]}
          >
            <GroupingState grouping={[{ columnName: "surParentName" }]} />
            <IntegratedGrouping />
            <Table
            columnExtensions={[
              { columnName: "surName", wordWrapEnabled: true, width: 200 },
              { columnName: "surType", wordWrapEnabled: true,width: 150 },
              { columnName: "surResult", wordWrapEnabled: true,width: 150 },
              { columnName: "ckNote", wordWrapEnabled: true },
            ]}
              cellComponent={(props) => Cell({ props })}
              stubHeaderCellComponent={(props) => (
                <Table.StubHeaderCell
                  {...props}
                  style={{ ...props.style, background: "#f2f3f8" }}
                />
              )}
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
            />
            <TableGroupRow />
          </Grid>
        </Paper>
      </Spin>
    </>
  );
});
export default cell;
