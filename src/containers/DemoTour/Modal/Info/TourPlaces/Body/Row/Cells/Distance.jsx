import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";
import _ from "lodash";

const Distance = memo(
  withStyles({
    col: {
      width: 90
    }
  })(({ distance, classes }) => {
    return (
      <td
        className={`align-middle text-right kt-font-bold kt-font-lg ${classes.col}`}
      >
        {distance ? _.parseInt(distance) : null}
      </td>
    );
  })
);
export default Distance;