import React, { memo, useCallback } from "react";
import { withStyles } from "@material-ui/core/styles";
import { InputNumber } from "antd";
import _ from "lodash";

const PreDistance = memo(
  withStyles({
    col: {
      width: 90
    }
  })(({ preDistance, classes }) => {
    return (
      <td
        className={`align-middle text-right kt-font-bold kt-font-lg ${classes.col}`}
      >
        {preDistance ? _.parseInt(preDistance) : null}
      </td>
    );
  })
);
export default PreDistance;
