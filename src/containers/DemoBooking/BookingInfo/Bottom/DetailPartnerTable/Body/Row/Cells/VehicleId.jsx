import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";

const VehicleId = memo(
  withStyles({
    col: { width: "fit-content", whiteSpace: "nowrap" }
  })(({ classes, vehicleId, plate, rowId }) => {
    return (
      <td key={rowId} className={`align-middle ${classes.col}`}>
        {vehicleId ? plate : "(Chưa có xe)"}
      </td>
    );
  })
);
export default VehicleId;