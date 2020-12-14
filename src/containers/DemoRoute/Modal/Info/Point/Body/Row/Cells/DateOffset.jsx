import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";

const DateOffset = memo(
  withStyles({
    col: {
      width: 80
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
export default DateOffset;
