import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";

const Order = memo(
  withStyles({
    col: {
      width: 75
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
export default Order;