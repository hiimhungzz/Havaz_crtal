import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";
import { checkMoment } from "@Helpers/utility";
import { Ui } from "@Helpers/Ui";
import _ from "lodash";
import { DATE_TIME_FORMAT } from "@Constants/common";
import { _$ } from "components/Utility/common";

const TripDate = memo(
  withStyles({
    col: {
      minWidth: 200
    },
    gridContainer: {
      display: "grid",
      gridTemplateColumns: "40px 80px auto",
      gridGap: 5
    },
    gridInputTime: {
      display: "grid",
      width: 120,
      gridTemplateColumns: "50px 10px 50px",
      gridGap: 5
    }
  })(({ pickUpAt, dropOffAt }) => {
    let pickUpAtTemp = checkMoment(pickUpAt);
    let dropOffAtTemp = checkMoment(dropOffAt);
    let pickUpAtDate = "";
    let pickUpAtTime = "";
    let dropOffAtDate = "";
    let dropOffAtTime = "";
    if (pickUpAt) {
      pickUpAtDate = pickUpAtTemp.format(DATE_TIME_FORMAT.DD_MM_YYYY);
      pickUpAtTime = pickUpAtTemp.format(DATE_TIME_FORMAT.HH_MM);
    }
    if (dropOffAt) {
      dropOffAtDate = dropOffAtTemp.format(DATE_TIME_FORMAT.DD_MM_YYYY);
      dropOffAtTime = dropOffAtTemp.format(DATE_TIME_FORMAT.HH_MM);
    }
    return (
      <td>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "40px 80px auto",
            gridGap: 5
          }}
        >
          <div className="d-flex align-items-center justify-content-center kt-font-lg kt-font-bold kt-font-primary">
            Đi:
          </div>
          <div className="d-flex align-items-center justify-content-center">
            {pickUpAtDate}
          </div>
          <div className="d-flex align-items-center kt-font-lg kt-font-bold">
            {pickUpAtTime}
          </div>
          <div className="d-flex align-items-center justify-content-center kt-font-lg kt-font-bold kt-font-danger">
            Về:
          </div>
          <div className="d-flex align-items-center justify-content-center">
            {dropOffAtDate}
          </div>
          <div className="d-flex align-items-center kt-font-lg kt-font-bold">
            {dropOffAtTime}
          </div>
        </div>
      </td>
    );
  })
);
export default TripDate;
