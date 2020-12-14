import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";

const VehicleNumber = memo(
  withStyles({
    col: {
      minWidth: 60
    }
  })(({ vehicleNumber, classes }) => {
    return <td className={`align-middle text-center ${classes.col}`}>{vehicleNumber}</td>;
  })
);
export default VehicleNumber;