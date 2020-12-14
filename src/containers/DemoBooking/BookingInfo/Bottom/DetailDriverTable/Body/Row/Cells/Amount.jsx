import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";
import { FormattedNumber } from "react-intl";

const Amount = memo(
  withStyles({
    col: {
      minWidth: 120
    }
  })(({ amount, classes }) => {
    return (
      <td
        className={`align-middle text-right kt-font-bold kt-font-lg sticky-col ${classes.col}`}
      >
        <FormattedNumber value={amount} />
      </td>
    );
  })
);
export default Amount;
