import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";

const Stt = memo(
  withStyles({
    col: {
      minWidth: 30,
      position: "sticky",
      left: 0,
      zIndex: 300,
      backgroundColor: "whitesmoke"
    }
  })(({ stt, classes }) => {
    return (
      <td
        className={`align-middle text-center kt-font-bold kt-font-lg ${classes.col}`}
      >
        {stt + 1}
      </td>
    );
  })
);
export default Stt;
