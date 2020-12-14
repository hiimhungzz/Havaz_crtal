import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Input } from "antd";

const VehicleCode = memo(
  withStyles({
    col: {
      minWidth: 180
    }
  })(({ vehicleCode, rowId, classes, handleChangeRestInput }) => {
    return (
      <td className={`align-middle ${classes.col}`}>
        <Input
          value={vehicleCode}
          onChange={e =>
            handleChangeRestInput({
              value: e.target.value,
              name: "vehicleCode",
              rowId: rowId
            })
          }
        />
      </td>
    );
  })
);
export default VehicleCode;