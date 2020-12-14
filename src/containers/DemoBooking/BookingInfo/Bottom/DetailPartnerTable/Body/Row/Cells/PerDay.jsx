import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";
import { InputNumber } from "antd";

const PerDay = memo(
  withStyles({
    col: {
      minWidth: 100,
      "& .ant-input-number": {
        width: "100%",
        "& .ant-input-number-input": {
          textAlign: "right !important"
        }
      }
    }
  })(({ partnersPerDay, disabled, rowId, classes, handleChangeAffectAmount }) => {
    return (
      <td className={`align-middle ${classes.col}`}>
        <InputNumber
          disabled={disabled}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={value => value.replace(/\$\s?|(,*)/g, "")}
          value={partnersPerDay}
          onChange={e =>
            handleChangeAffectAmount({
              value: e || 0,
              name: "partnersPerDay",
              rowId: rowId
            })
          }
        />
      </td>
    );
  })
);
export default PerDay;
