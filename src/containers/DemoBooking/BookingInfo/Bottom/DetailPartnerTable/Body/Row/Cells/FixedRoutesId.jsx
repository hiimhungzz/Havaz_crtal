import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";

const FixedRoutesId = memo(
  withStyles({
    col: {
      width: "fit-content"
    },
    gridContainer: {
      display: "grid"
    },
    gridItem: {
      whiteSpace: "nowrap"
    }
  })(({ fixedRoutesName, fixedRoutesCode, classes }) => {
    return (
      <td className={`align-middle text-center ${classes.col}`}>
        <div className={classes.gridContainer}>
          <div
            className={`d-flex align-items-center justify-content-center kt-font-lg kt-font-bold ${classes.gridItem}`}
          >
            {fixedRoutesName}
          </div>
          <div
            className={`d-flex align-items-center justify-content-center kt-font-lg font-italic ${classes.gridItem}`}
          >
            {fixedRoutesCode}
          </div>
        </div>
      </td>
    );
  })
);
export default FixedRoutesId;