import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";

const ActualVehicleType = memo(
  withStyles({
    col: { width: "fit-content", minWidth: 140, whiteSpace: "nowrap" }
  })(({ classes, actualVehiclesTypeId, actualVehiclesTypeName, rowId }) => {
    return (
      <td key={rowId} className={`align-middle ${classes.col}`}>
        {actualVehiclesTypeId
          ? actualVehiclesTypeName
          : "(Chưa có loại xe thực tế)"}
      </td>
    );
  })
);
export default ActualVehicleType;
