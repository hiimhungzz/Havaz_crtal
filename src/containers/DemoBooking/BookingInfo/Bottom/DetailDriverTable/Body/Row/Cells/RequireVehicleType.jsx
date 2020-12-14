import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";

const RequireVehicleType = memo(
  withStyles({
    col: { width: "fit-content", minWidth: 140, whiteSpace: "nowrap" }
  })(({ classes, vehicleTypeId, requireVehiclesTypeName, rowId }) => {
    return (
      <td key={rowId} className={`align-middle ${classes.col}`}>
        {vehicleTypeId ? requireVehiclesTypeName : "(Chưa có loại xe yêu cầu)"}
      </td>
    );
  })
);
export default RequireVehicleType;
