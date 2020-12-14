import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";
const StewardessUuid = memo(
  withStyles({
    col: {
      minWidth: 135
    }
  })(
    ({
      stewardessUuid,
      stewardessName,
      classes
    }) => {
      return (
        <td className={`align-middle ${classes.col}`}>
          {stewardessUuid ? stewardessName : "(Chưa có tiếp viên)"}
        </td>
      );
    }
  )
);
export default StewardessUuid;
