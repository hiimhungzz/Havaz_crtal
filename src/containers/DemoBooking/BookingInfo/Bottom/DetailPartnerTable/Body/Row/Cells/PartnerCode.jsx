import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";

const PartnerCode = memo(
  withStyles({
    col: {
      minWidth: 80
    }
  })(({ partnerCode, classes }) => {
    return (
      <td className={`align-middle text-center kt-font-danger kt-font-lg ${classes.col}`}>
        {partnerCode}
      </td>
    );
  })
);
export default PartnerCode;
