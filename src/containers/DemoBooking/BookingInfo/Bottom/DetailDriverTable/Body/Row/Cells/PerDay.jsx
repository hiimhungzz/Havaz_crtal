import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";
import { InputNumber } from "antd";
import classNames from "classnames";
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
  })(
    ({
      perDay,
      errors,
      disabled,
      rowId,
      classes,
      handleChangeAffectAmount
    }) => {
      return (
        <td className={`align-middle ${classes.col}`}>
          <InputNumber
            className={classNames({
              "border-invalid": errors ? true : false
            })}
            disabled={disabled}
            formatter={value =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={value => value.replace(/\$\s?|(,*)/g, "")}
            value={perDay}
            onChange={e =>
              handleChangeAffectAmount({
                value: e || 0,
                name: "perDay",
                rowId: rowId
              })
            }
          />
        </td>
      );
    }
  )
);
export default PerDay;
