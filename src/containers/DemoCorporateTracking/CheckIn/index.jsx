import React, { memo, useState, useEffect, useCallback } from "react";
import { Spin, Modal, Button, Row, Col } from "antd";
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

import { Ui } from "@Helpers/Ui";
import { requestJsonGet } from "@Services/base";
import Cell from "./cell";
import { Map } from "immutable";
import moment from "moment";
const checkIn = memo(({ dataCheckIn, infoHeader }) => {
  const data = dataCheckIn.map((item, index) => {
    let pickUpAt = item.pickUpAt ? moment(item.pickUpAt).format('YYYY-MM-DD HH:mm')+':00' : null;
    let estimateTime = item.estimateTime ? moment(item.estimateTime).format('YYYY-MM-DD HH:mm')+':00' : null;
    let minutes =
      pickUpAt && estimateTime
        ? Math.abs(moment.duration(moment(estimateTime).diff(moment(pickUpAt))).asMinutes())
        : 0;

    let result =
      minutes >= 0 && minutes <= item.timeDelay ? "Đạt" : "Không đạt";
    item.result = result;
    item.timeTo = estimateTime ? moment(estimateTime).format("HH:mm") : "";
    item.timeFrom = pickUpAt ? moment(pickUpAt).format("HH:mm") : "";
    item.mintue = Math.ceil(minutes);
    item.numberError = result == "Đạt" ? "Không" : "Có";
    return item;
  });
  console.log("data", data);

  let routeName = infoHeader.routeName ? infoHeader.routeName : "";
  let plate = infoHeader.plate ? infoHeader.plate : "";
  let driverName = infoHeader.driverName ? infoHeader.driverName : "";
  let trackingDate = infoHeader.trackingDate
    ? moment(infoHeader.trackingDate).format("DD-MM-YYYY")
    : "";
  let pickUpAt = infoHeader.pickUpAt
    ? moment(infoHeader.pickUpAt).format("HH:mm")
    : "";
  let dropOffAt = infoHeader.dropOffAt
    ? moment(infoHeader.dropOffAt).format("HH:mm")
    : "";
  let date =
    pickUpAt && dropOffAt
      ? `${pickUpAt} - ${dropOffAt}`
      : "";
  return (
    <>
      <Row gutter={15} className="mb_20">
        <Col md={5} style={{ display: "grid" }}>
          <b className="text-body">Tuyến đường</b>
          <b className="text-primary">{routeName}</b>
        </Col>
        <Col md={5} style={{ display: "grid" }}>
          <b className="text-body">BKS</b>
          <b className="text-primary">{plate}</b>
        </Col>
        <Col md={5} style={{ display: "grid" }}>
          <b className="text-body">Lái xe</b>
          <b className="text-primary">{driverName}</b>
        </Col>
        <Col md={5} style={{ display: "grid" }}>
          <b className="text-body">Ngày</b>
          <b className="text-primary">{trackingDate}</b>
        </Col>
        <Col md={4} style={{ display: "grid" }}>
          <b className="text-body">Lịch chạy</b>
          <b className="text-primary">{date}</b>
        </Col>
      </Row>
      <Paper variant="outlined" square>
        <Grid
          rows={data}
          columns={[
            {
              name: "pickUpAddress",
              title: "ĐIỂM ĐÓN",
            },
            {
              name: "timeTo",
              title: "DỰ KIẾN",
            },
            {
              name: "timeFrom",
              title: "THỰC TẾ",
            },
            {
              name: "mintue",
              title: "SỐ PHÚT",
            },
            {
              name: "result",
              title: "KẾT QUẢ",
            },
            {
              name: "numberError",
              title: "ĐẾM LỖI",
            },
          ]}
        >
          <Table
            cellComponent={(props) => Cell({ props })}
            columnExtensions={[
              { columnName: "pickUpAddress", wordWrapEnabled: true },
              { columnName: "timeTo", width: 100, wordWrapEnabled: true },
              { columnName: "timeFrom", width: 100, wordWrapEnabled: true },
              { columnName: "mintue", width: 100, wordWrapEnabled: true },
              { columnName: "result", width: 100, wordWrapEnabled: true },
              { columnName: "numberError", width: 100, wordWrapEnabled: true },
            ]}
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
        </Grid>
      </Paper>
    </>
  );
});
export default checkIn;
