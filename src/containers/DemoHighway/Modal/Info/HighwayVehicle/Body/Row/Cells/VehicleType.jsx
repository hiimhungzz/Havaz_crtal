import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";

const VehicleType = memo(
  withStyles({
    col: {
      width: 250
    }
  })(({ type, classes }) => {
    return (
      <td
        className={`align-middle text-center kt-font-bold kt-font-lg ${classes.col}`}
      >
        {type}
      </td>
    );
  })
);
export default VehicleType;
