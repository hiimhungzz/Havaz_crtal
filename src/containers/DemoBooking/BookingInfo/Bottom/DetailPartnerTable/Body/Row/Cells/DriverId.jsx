import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";

const DriverId = memo(
  withStyles({
    col: { width: "fit-content", whiteSpace: "nowrap" }
  })(({ classes, driverId, driverName, rowId }) => {
    return (
      <td key={rowId} className={`align-middle ${classes.col}`}>
        {driverId ? driverName : "(Chưa có lái xe)"}
      </td>
    );
  })
);
export default DriverId;
