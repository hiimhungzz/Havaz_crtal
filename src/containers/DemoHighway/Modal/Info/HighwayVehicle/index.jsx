import React from "react";
import Table from "react-bootstrap/Table";
import { withStyles } from "@material-ui/core/styles";
import HighwayTableHead from "./Head";
import HighwayTableBody from "./Body";
import { Paper } from "@material-ui/core";

const columns = [
  { name: "type", title: "LOẠI XE" },
  { name: "price", title: "GIÁ" }
];

const HighwayVehicle = ({ grid, setHighway }) => {
  return (
    <Paper elevation={2}>
      <Table hover className="mb-0">
        <HighwayTableHead columns={columns} />
        <HighwayTableBody
          grid={grid}
          columns={columns}
          setHighway={setHighway}
        />
      </Table>
    </Paper>
  );
};
export default withStyles({})(HighwayVehicle);
