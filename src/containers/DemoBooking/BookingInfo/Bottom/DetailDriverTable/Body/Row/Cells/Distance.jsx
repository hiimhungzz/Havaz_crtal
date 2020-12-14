import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";
import { InputNumber } from "antd";

const Distance = memo(
  withStyles({
    col: {
      minWidth: 90,
      "& .ant-input-number-input": {
        textAlign: "right !important"
      }
    }
  })(({ distance, rowId, classes, handleChangeAffectAmount }) => {
    return (
      <td className={`align-middle ${classes.col}`}>
        <InputNumber
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={value => value.replace(/\$\s?|(,*)/g, "")}
          value={distance}
          onChange={e =>
            handleChangeAffectAmount({
              value: e || 0,
              name: "distance",
              rowId: rowId
            })
          }
        />
      </td>
    );
  })
);
export default Distance;
