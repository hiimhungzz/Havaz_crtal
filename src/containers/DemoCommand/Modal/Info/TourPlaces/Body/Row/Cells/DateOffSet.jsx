import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";

const DateOffSet = memo(
  withStyles({
    col: {
      width: 75
    }
  })(({ dateOffSet, classes }) => {
    return (
      <td
        className={`align-middle text-center kt-font-bold kt-font-lg ${classes.col}`}
      >
        {dateOffSet}
      </td>
    );
  })
);
export default DateOffSet;
