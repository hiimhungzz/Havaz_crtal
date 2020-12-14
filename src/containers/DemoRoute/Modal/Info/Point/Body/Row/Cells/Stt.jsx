import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";

const Stt = memo(
  withStyles({
    col: {
      width: 50
    }
  })(({ order, classes }) => {
    return (
      <td
        className={`align-middle text-center kt-font-bold kt-font-lg ${classes.col}`}
      >
        {order}
      </td>
    );
  })
);
export default Stt;
