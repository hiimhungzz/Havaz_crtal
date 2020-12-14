import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";
import _ from "lodash";
import classNames from "classnames";

const TimePickup = memo(
  withStyles({
    col: {
      minWidth: 140
    },
    gridInputTime: {
      display: "grid",
      width: 120,
      gridTemplateColumns: "50px 10px 50px",
      gridGap: 5
    }
  })(({ timePickup, errors, rowId, classes, handleChangeRestInput }) => {
    let timePickupArray = [];
    let timePickupHour = "";
    let timePickupMinute = "";
    if (timePickup) {
      timePickupArray = _.split(timePickup, ":");
      timePickupHour = timePickupArray[0];
      timePickupMinute = timePickupArray[1];
    }
    return (
      <td className={`align-middle ${classes.col}`}>
        <div className={classes.gridInputTime}>
          <input
            type="number"
            min={0}
            value={timePickupHour}
            onChange={e => {
              let value = e.target.value;
              if (!_.startsWith(value, "0") && value.length > 2) {
                value = value.substring(value.length - 2);
              }
              if (value > 23) {
                value = "23";
              }
              if (value.length === 1) {
                value = `0${value}`;
              } else if (_.startsWith(value, "0") && value.length > 2) {
                value = value.substring(value.length - 2);
              }
              let fieldValue = `${value}:${timePickupMinute}`;
              if (_.isEmpty(timePickupMinute) && _.isEmpty(value)) {
                fieldValue = null;
              }
              handleChangeRestInput({
                value: fieldValue,
                name: "timePickup",
                rowId: rowId
              });
            }}
            name="timePickUpAtHour"
            className={classNames({
              "border-invalid": errors ? true : false,
              "form-control text-center kt-font-lg kt-font-bold": true
            })}
            pattern="^([0-1]?[0-9]|2[0-4])?$"
          />
          <span className="kt-font-lg kt-font-bold align-items-center text-center">
            :
          </span>
          <input
            min={0}
            type="number"
            value={timePickupMinute}
            onChange={e => {
              let value = e.target.value;
              if (!_.startsWith(value, "0") && value.length > 2) {
                value = value.substring(value.length - 2);
              }
              if (value > 59) {
                value = "59";
              }
              if (value.length === 1) {
                value = `0${value}`;
              } else if (_.startsWith(value, "0") && value.length > 2) {
                value = value.substring(value.length - 2);
              }
              let fieldValue = `${timePickupHour}:${value}`;
              if (_.isEmpty(timePickupHour) && _.isEmpty(value)) {
                fieldValue = null;
              }
              handleChangeRestInput({
                value: fieldValue,
                name: "timePickup",
                rowId: rowId
              });
            }}
            name="timePickUpAtMinute"
            className={classNames({
              "border-invalid": errors ? true : false,
              "form-control text-center kt-font-lg kt-font-bold": true
            })}
            pattern="^([0-5][0-9])?$"
          />
        </div>
      </td>
    );
  })
);
export default TimePickup;
