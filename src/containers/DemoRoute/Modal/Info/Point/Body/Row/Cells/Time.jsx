import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";
import { TimePicker,InputNumber  } from "antd";
import moment from "moment";

const format = "HH:mm";
const Time = memo(
  withStyles({
    col: {
      width: 100,
    },
  })(({ classes, setRoute, rowId, time,value }) => {
    const setTime = (value,valueString) => {
      setRoute((preState) => {
        let nextState = preState;
        nextState = nextState.setIn(["point", rowId, "timePickup"], value);
        return nextState;
      });
    };
    return (
      <td
        className={`align-middle text-center kt-font-bold kt-font-lg ${classes.col}`}
      >
        {/* <TimePicker value={time} format={format} onChange={setTime} /> */}
        <InputNumber value={value}  onChange={setTime} />
      </td>
    );
  })
);
export default Time;
