import React, { useCallback } from "react";
import _ from "lodash";
import Table from "react-bootstrap/Table";
import { withStyles } from "@material-ui/core/styles";
import TourTableHead from "./Head";
import TourTableBody from "./Body";
import { Paper, Grid } from "@material-ui/core";
import { Button } from "antd";
import { Map } from "immutable";

const columns = [
  { name: "action", title: " " },
  { name: "dateOffSet", title: "NGÀY THỨ" },
  { name: "order", title: "THỨ TỰ" },
  { name: "name", title: "TUYẾN/ĐIỂM" },
  { name: "preDistance", title: "KM ĐỀ XUẤT" },
  { name: "distance", title: "KM THỰC TẾ" },
  { name: "ETA", title: "THỜI GIAN" }
];

const TourPlaces = ({ grid, errors, setTour, classes }) => {
  return (
    <Paper elevation={2}>
      <Table hover className="mb-0">
        <TourTableHead columns={columns} />
        <TourTableBody
          grid={grid}
          errors={errors}
          columns={columns}
          setTour={setTour}
        />
      </Table>
    </Paper>
  );
};
export default withStyles({})(TourPlaces);
