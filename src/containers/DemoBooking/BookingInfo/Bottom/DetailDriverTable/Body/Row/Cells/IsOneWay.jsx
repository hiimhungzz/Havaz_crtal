import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Checkbox } from "antd";

const IsOneWay = memo(
  withStyles({
    col: {
      minWidth: 120
    }
  })(({ checked, rowId, classes, handleChangeIsOneWay }) => {
    return (
      <td className={`align-middle text-center ${classes.col}`}>
        <Checkbox
          checked={checked}
          onChange={e =>
            handleChangeIsOneWay({ fieldValue: e.target.checked, rowId: rowId })
          }
        >
          1 chiều
        </Checkbox>
      </td>
    );
  })
);
export default IsOneWay;