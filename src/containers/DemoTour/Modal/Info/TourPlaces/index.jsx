import React from "react";
import Table from "react-bootstrap/Table";
import { withStyles } from "@material-ui/core/styles";
import TourTableHead from "./Head";
import TourTableBody from "./Body";
import { Paper } from "@material-ui/core";

const columns = [
  { name: "action", title: " " },
  { name: "dateOffSet", title: "NGÀY THỨ" },
  { name: "order", title: "THỨ TỰ" },
  { name: "name", title: "TUYẾN/ĐIỂM" },
  { name: "preDistance", title: "KM ĐỀ XUẤT" },
  { name: "distance", title: "KM THỰC TẾ" },
  { name: "ETA", title: "THỜI GIAN" }
];

const TourPlaces = ({ grid, errors, setTour }) => {
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
