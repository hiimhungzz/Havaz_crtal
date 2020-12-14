import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";
import { FormattedNumber } from "react-intl";

const Profit = memo(
  withStyles({
    col: {
      minWidth: 120
    }
  })(({ profit, isShow, classes }) => {
    return (
      <td
        className={`align-middle text-right kt-font-bold kt-font-lg sticky-col ${classes.col}`}
      >
        {isShow ? <FormattedNumber value={profit} /> : 0}
      </td>
    );
  })
);
export default Profit;
