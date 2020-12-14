import React, { memo, useState, useEffect, useCallback } from "react";
import { Spin, Row, Col, Form, Icon, Input, Button, Checkbox } from "antd";
import _ from "lodash";
import QuanlityTotalList from "./List/index";
import Fillter from "./Fillter/index";
import Portlet from "@Components/Portlet";
import PortletBody from "@Components/Portlet/PortletBody";
import PortletHead from "@Components/Portlet/PortletHead";
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
import Cell from "./Cell/index";
import { toArray, List, fromJS, OrderedMap, Map } from "immutable";

const test = memo(({}) => {
  const onData = ()=>{
    console.log('data',data)
  }
  const [styles, setStyle] = useState("");
  const [keyRow, setKeyRow] = useState("");
  const [data, setData] = useState([
    {
      id: "1",
      date: "30-03-2020",
      plate: [
        {
          name: "1",
        },
        {
          name: "2",
        },
      ],
      fixedRouteName: "Hưng yên - Bắc giang",
    },
    {
      id: "2",
      date: "30-03-2020",
      plate: [
        {
          name: "3",
        },
        {
          name: "4",
        },
      ],
      fixedRouteName: "Hưng yên - Bắc giang",
    },
    {
      id: "3",
      date: "31-03-2020",
      plate: [
        {
          name: "5",
        },
        {
          name: "6",
        },
      ],
      fixedRouteName: "Hưng yên - Bắc giang",
    },
    {
      id: "4",
      date: "31-03-2020",
      plate: [
        {
          name: "7",
        },
        {
          name: "8",
        },
      ],
      fixedRouteName: "Hưng yên - Bắc giang",
    },
  ]);

  return (
    <Paper variant="outlined" square>
      <Grid
        rows={data}
        columns={[
          {
            name: "id",
            title: "#",
          },
          {
            name: "date",
            title: "NGÀY",
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
            name: "driverName",
            title: "Xóa",
          },
        ]}
      >
        <PagingState defaultCurrentPage={0} pageSize={5} />
        <Table
          columnExtensions={[
            { columnName: "id", wordWrapEnabled: true, width: 100 },
            { columnName: "date", wordWrapEnabled: true, width: 100 },
            { columnName: "fixedRouteName", wordWrapEnabled: true },
            { columnName: "plate", wordWrapEnabled: true, width: 250 },
            {
              columnName: "driverName",
              wordWrapEnabled: true,
              width: 80,
              align: "center",
            },
          ]}
          cellComponent={(props) =>
            Cell({ props, setData, data, setStyle, styles, keyRow, setKeyRow })
          }
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
          //   contentComponent={TableHeaderContent}
        />
      </Grid>
      <Button type="primary" onClick={onData}>Cập nhật</Button>
    </Paper>
  );
});
export default test;
