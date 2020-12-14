import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";
import A from "@Components/A";
import { DatePicker } from "antd";
import classNames from "classnames";
import { DATE_TIME_FORMAT } from "@Constants/common";
import { disabledDate, checkMoment, hasError } from "@Helpers/utility";

const TripDate = memo(
  withStyles({
    gridContainer: {
      display: "grid",
      gridGap: 2,
      gridAutoFlow: "column"
    },
    notLastItem: {
      width: "38px !important"
    },
    gridActionItem: {
      width: 14,
      justifyContent: "center",
      justifySelf: "center",
      alignSelf: "center"
    },
    gridActionDateItem: {
      width: 120,
      display: "flex",
      alignItems: "center"
    },
    col: {
      width: 150,
      paddingTop: "26.5px !important"
    }
  })(
    ({
      dateIn,
      dateOut,
      isLastRow,
      rowIndex,
      tripDate,
      classes,
      errors,
      handleCloneTrip,
      handleChangeTripDate
    }) => {
      return (
        <td className={`align-middle ${classes.col}`}>
          <div className={classes.gridContainer}>
            <div
              className={`${isLastRow ? "" : classes.notLastItem} ${
                classes.gridActionItem
              } d-flex`}
            >
              <A
                onClick={e =>
                  handleCloneTrip({
                    evt: e,
                    type: "up",
                    rowIndex: rowIndex
                  })
                }
                title="Thêm tuyến trên"
              >
                <i className="flaticon2-up" />
              </A>
            </div>
            {isLastRow && (
              <div className={`${classes.gridActionItem} d-flex`}>
                <A
                  onClick={e =>
                    handleCloneTrip({
                      evt: e,
                      type: "down",
                      rowIndex: rowIndex
                    })
                  }
                  title="Thêm tuyến dưới"
                >
                  <i className="flaticon2-down" />
                </A>
              </div>
            )}
            <div
              className={`${classes.gridActionDateItem}`}
            >
              <DatePicker
                className={classNames({
                  "border-invalid": hasError(errors)
                })}
                format={DATE_TIME_FORMAT.DD_MM_YYYY}
                disabledDate={e => disabledDate(e, dateIn, dateOut)}
                value={checkMoment(tripDate)}
                onChange={date =>
                  handleChangeTripDate({
                    date: date,
                    rowIndex: rowIndex
                  })
                }
              />
            </div>
          </div>
        </td>
      );
    }
  )
);
export default TripDate;
