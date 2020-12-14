import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Input } from "antd";

const RouteNote = memo(
  withStyles({
    col: {
      minWidth: 200
    }
  })(({ routeNote, rowId, classes, handleChangeRestInput }) => {
    return (
      <td className={`align-middle ${classes.col}`}>
        <Input.TextArea
          value={routeNote}
          onChange={e =>
            handleChangeRestInput({
              value: e.target.value,
              name: "routeNote",
              rowId: rowId
            })
          }
        />
      </td>
    );
  })
);
export default RouteNote;