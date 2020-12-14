import React, { memo, useCallback } from "react";
import { withStyles } from "@material-ui/core/styles";
import { TimePicker } from "antd";
import moment from "moment";
import { DATE_TIME_FORMAT } from "constants/common";

const ETA = memo(
  withStyles({
    col: {
      width: 100,
      "& .ant-time-picker": {
        width: 90
      }
    }
  })(({ ETA, setTour, recordId, classes }) => {
    const _handleChange = useCallback(
      (time, timeString) => {
        setTour(prevState => {
          let nextState = prevState;
          nextState = nextState.setIn(
            ["listRoute", recordId, "ETA"],
            timeString
          );
          return nextState;
        });
      },
      [recordId, setTour]
    );
    return (
      <td
        className={`align-middle text-center kt-font-bold kt-font-lg ${classes.col}`}
      >
        <TimePicker
          value={moment(ETA, "HH:mm")}
          onChange={_handleChange}
          format={DATE_TIME_FORMAT.HH_MM}
        />
      </td>
    );
  })
);
export default ETA;
