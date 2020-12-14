import React, { memo } from "react";
import { withStyles } from "@material-ui/core/styles";
import { checkMoment } from "@Helpers/utility";
import { Ui } from "@Helpers/Ui";
import _ from "lodash";
import { DATE_TIME_FORMAT } from "@Constants/common";
import classNames from "classnames";

let hourTimer = null;
let minuteTimer = null;

const TripDate = memo(
  withStyles({
    col: {
      minWidth: 200
    },
    gridContainer: {
      display: "grid",
      gridTemplateColumns: "80px auto",
      gridGap: 2
    },
    gridInputTime: {
      display: "grid",
      width: 120,
      gridTemplateColumns: "50px 10px 50px",
      gridGap: 5
    },
    inputContainer: {
      display: "grid",
      gridAutoFlow: "row",
      gridGap: 2
    }
  })(
    ({
      rowId,
      pickUpAt,
      dropOffAt,
      pickUpAtErrors,
      dropOffAtErrors,
      classes,
      handleChangeTime,
      handleChangeTimeArray
    }) => {
      let pickUpAtTemp = checkMoment(pickUpAt);
      let dropOffAtTemp = checkMoment(dropOffAt);
      let pickUpAtDate = "";
      let pickUpAtTime = "";
      let pickUpAtTimeHour = "";
      let pickUpAtTimeMinute = "";
      let dropOffAtDate = "";
      let dropOffAtTime = "";
      let dropOffAtTimeHour = "";
      let dropOffAtTimeMinute = "";
      if (pickUpAtTemp) {
        pickUpAtDate = pickUpAtTemp.format(DATE_TIME_FORMAT.DD_MM_YYYY);
        pickUpAtTime = pickUpAtTemp.format(DATE_TIME_FORMAT.HH_MM);
        let pickUpAtTimeArr = pickUpAtTime.split(":");
        pickUpAtTimeHour = pickUpAtTimeArr[0];
        pickUpAtTimeMinute = pickUpAtTimeArr[1];
      }
      if (dropOffAtTemp) {
        dropOffAtDate = dropOffAtTemp.format(DATE_TIME_FORMAT.DD_MM_YYYY);
        dropOffAtTime = dropOffAtTemp.format(DATE_TIME_FORMAT.HH_MM);
        let dropOffAtTimeArr = dropOffAtTime.split(":");
        dropOffAtTimeHour = dropOffAtTimeArr[0];
        dropOffAtTimeMinute = dropOffAtTimeArr[1];
      }
      let dayMinutes = 23 * 60 + 59;
      return (
        <td className={`align-middle ${classes.col}`}>
          <div className={classes.gridContainer}>
            <div className="d-flex align-items-center justify-content-center kt-font-bold">
              {pickUpAtDate}
            </div>
            <div className={classes.inputContainer}>
              <div className={classes.gridInputTime}>
                <input
                  type="number"
                  min={0}
                  value={pickUpAtTimeHour}
                  onChange={e => {
                    let value = e.target.value;
                    if (!_.startsWith(value, "0") && value.length > 2) {
                      value = value.substring(value.length - 2);
                    }
                    if (value > 23) {
                      value = "23";
                    }
                    handleChangeTime({
                      value: value,
                      rowId: rowId,
                      type: "hour",
                      fieldName: "pickUpAt",
                      fieldValue: pickUpAtTemp
                    });
                    clearTimeout(hourTimer);
                    hourTimer = setTimeout(() => {
                      let totalMinuteDropOffAt =
                        60 * _.parseInt(dropOffAtTimeHour) +
                        _.parseInt(dropOffAtTimeMinute);
                      let totalMinutePickUpAt =
                        60 * _.parseInt(value) + _.parseInt(pickUpAtTimeMinute);
                      if (totalMinuteDropOffAt - 30 < totalMinutePickUpAt) {
                        if (totalMinutePickUpAt + 30 <= dayMinutes) {
                          let hour = _.parseInt(
                            (totalMinutePickUpAt + 30) / 60
                          );
                          let minute = _.parseInt(
                            (totalMinutePickUpAt + 30) % 60
                          );
                          Ui.showWarning({
                            message: `Giờ kết thúc phải sau giờ bắt đầu(${value}:${pickUpAtTimeMinute}) : 30 phút. Tự động chuyển giờ kết thúc về : ${hour}:${minute}`
                          });
                          _.delay(
                            payload => {
                              handleChangeTimeArray({
                                payload: [
                                  {
                                    hour: payload.hour,
                                    minute: payload.minute,
                                    fieldName: "dropOffAt",
                                    fieldValue: dropOffAtTemp
                                  }
                                ],
                                rowId: rowId
                              });
                            },
                            0,
                            { hour, minute }
                          );
                        } else {
                          Ui.showWarning({
                            message: `Giờ kết thúc vượt quá thời gian trong ngày. Tự động chuyển giờ kết thúc về :  23:59`
                          });
                          _.delay(() => {
                            handleChangeTimeArray({
                              payload: [
                                {
                                  hour: 23,
                                  minute: 29,
                                  fieldName: "pickUpAt",
                                  fieldValue: pickUpAtTemp
                                },
                                {
                                  hour: 23,
                                  minute: 59,
                                  fieldName: "dropOffAt",
                                  fieldValue: dropOffAtTemp
                                }
                              ],
                              rowId: rowId
                            });
                          }, 0);
                        }
                      }
                    }, 800);
                  }}
                  name="timePickUpAtHour"
                  className={classNames({
                    "form-control text-center kt-font-lg kt-font-bold": true,
                    "border-invalid": pickUpAtErrors
                  })}
                  pattern="^([0-1]?[0-9]|2[0-4])?$"
                />
                <span className="kt-font-lg kt-font-bold align-items-center text-center">
                  :
                </span>
                <input
                  type="number"
                  min={0}
                  value={pickUpAtTimeMinute}
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
                    handleChangeTime({
                      value: value,
                      rowId: rowId,
                      type: "minute",
                      fieldName: "pickUpAt",
                      fieldValue: pickUpAtTemp
                    });
                    clearTimeout(minuteTimer);
                    minuteTimer = setTimeout(() => {
                      let totalMinuteDropOffAt =
                        60 * _.parseInt(dropOffAtTimeHour) +
                        _.parseInt(dropOffAtTimeMinute);
                      let totalMinutePickUpAt =
                        60 * _.parseInt(pickUpAtTimeHour) + _.parseInt(value);
                      if (totalMinuteDropOffAt - 30 < totalMinutePickUpAt) {
                        if (totalMinutePickUpAt + 30 <= dayMinutes) {
                          let hour = _.parseInt(
                            (totalMinutePickUpAt + 30) / 60
                          );
                          let minute = _.parseInt(
                            (totalMinutePickUpAt + 30) % 60
                          );
                          Ui.showWarning({
                            message: `Giờ kết thúc phải sau giờ bắt đầu(${pickUpAtTimeHour}:${value}): 30 phút. Tự động chuyển giờ kết thúc về: ${hour}:${minute}`
                          });
                          _.delay(
                            payload => {
                              handleChangeTimeArray({
                                payload: [
                                  {
                                    hour: payload.hour,
                                    minute: payload.minute,
                                    fieldName: "dropOffAt",
                                    fieldValue: dropOffAtTemp
                                  }
                                ],
                                rowId: rowId
                              });
                            },
                            0,
                            { hour: hour, minute: minute }
                          );
                        } else {
                          Ui.showWarning({
                            message: `Giờ kết thúc vượt quá thời gian trong ngày. Tự động chuyển giờ kết thúc về :  23:59`
                          });
                          _.delay(() => {
                            handleChangeTimeArray({
                              payload: [
                                {
                                  hour: 23,
                                  minute: 29,
                                  fieldName: "pickUpAt",
                                  fieldValue: pickUpAtTemp
                                },
                                {
                                  hour: 23,
                                  minute: 59,
                                  fieldName: "dropOffAt",
                                  fieldValue: dropOffAtTemp
                                }
                              ],
                              rowId: rowId
                            });
                          }, 0);
                        }
                      }
                    }, 800);
                  }}
                  name="timePickUpAtMinute"
                  className={classNames({
                    "form-control text-center kt-font-lg kt-font-bold": true,
                    "border-invalid": pickUpAtErrors
                  })}
                  pattern="^([0-5][0-9])?$"
                />
              </div>
              <div className={classes.gridInputTime}>
                <input
                  type="number"
                  min={0}
                  value={dropOffAtTimeHour}
                  onChange={e => {
                    let value = e.target.value;
                    if (!_.startsWith(value, "0") && value.length > 2) {
                      value = value.substring(value.length - 2);
                    }
                    if (value > 23) {
                      value = "23";
                    }
                    handleChangeTime({
                      value: value,
                      rowId: rowId,
                      type: "hour",
                      fieldName: "dropOffAt",
                      fieldValue: dropOffAtTemp
                    });
                    clearTimeout(hourTimer);
                    hourTimer = setTimeout(() => {
                      let totalMinuteDropOffAt =
                        60 * _.parseInt(value) +
                        _.parseInt(dropOffAtTimeMinute);
                      let totalMinutePickUpAt =
                        60 * _.parseInt(pickUpAtTimeHour) +
                        _.parseInt(pickUpAtTimeMinute);
                      if (totalMinuteDropOffAt - 30 < totalMinutePickUpAt) {
                        if (totalMinuteDropOffAt - 30 >= 0) {
                          let hour = _.parseInt(
                            (totalMinuteDropOffAt - 30) / 60
                          );
                          let minute = _.parseInt(
                            (totalMinuteDropOffAt - 30) % 60
                          );
                          Ui.showWarning({
                            message: `Giờ bắt đầu phải trước giờ kết thúc(${value}:${dropOffAtTimeMinute}) : 30 phút. Tự động chuyển giờ bắt đầu về: ${hour}:${minute}`
                          });
                          _.delay(
                            payload => {
                              handleChangeTimeArray({
                                payload: [
                                  {
                                    hour: payload.hour,
                                    minute: payload.minute,
                                    fieldName: "pickUpAt",
                                    fieldValue: pickUpAtTemp
                                  }
                                ],
                                rowId: rowId
                              });
                            },
                            0,
                            { hour, minute }
                          );
                        } else {
                          Ui.showWarning({
                            message: `Giờ bắt đầu nhỏ hơn thời gian trong ngày. Tự động chuyển giờ bắt đầu về:  00:00`
                          });
                          _.delay(() => {
                            handleChangeTimeArray({
                              payload: [
                                {
                                  hour: 0,
                                  minute: 0,
                                  fieldName: "pickUpAt",
                                  fieldValue: pickUpAtTemp
                                },
                                {
                                  hour: 0,
                                  minute: 30,
                                  fieldName: "dropOffAt",
                                  fieldValue: dropOffAtTemp
                                }
                              ],
                              rowId: rowId
                            });
                          }, 0);
                        }
                      }
                    }, 800);
                  }}
                  name="timePickUpAtHour"
                  className={classNames({
                    "form-control text-center kt-font-lg kt-font-bold": true,
                    "border-invalid": dropOffAtErrors
                  })}
                  pattern="^([0-1]?[0-9]|2[0-4])?$"
                />
                <span className="kt-font-lg kt-font-bold align-items-center text-center">
                  :
                </span>
                <input
                  type="number"
                  min={0}
                  value={dropOffAtTimeMinute}
                  onChange={e => {
                    let value = e.target.value;
                    if (!_.startsWith(value, "0") && value.length > 2) {
                      value = value.substring(value.length - 2);
                    }
                    if (value > 59) {
                      value = "59";
                    }
                    handleChangeTime({
                      value: value,
                      rowId: rowId,
                      type: "minute",
                      fieldName: "dropOffAt",
                      fieldValue: dropOffAtTemp
                    });
                    clearTimeout(minuteTimer);
                    minuteTimer = setTimeout(() => {
                      let totalMinuteDropOffAt =
                        60 * _.parseInt(dropOffAtTimeHour) + _.parseInt(value);
                      let totalMinutePickUpAt =
                        60 * _.parseInt(pickUpAtTimeHour) +
                        _.parseInt(pickUpAtTimeMinute);
                      if (totalMinuteDropOffAt - 30 < totalMinutePickUpAt) {
                        if (totalMinuteDropOffAt - 30 >= 0) {
                          let hour = _.parseInt(
                            (totalMinuteDropOffAt - 30) / 60
                          );
                          let minute = _.parseInt(
                            (totalMinuteDropOffAt - 30) % 60
                          );
                          Ui.showWarning({
                            message: `Giờ bắt đầu phải trước giờ kết thúc(${dropOffAtTimeHour}:${value}) : 30 phút. Tự động chuyển giờ bắt đầu về: ${hour}:${minute}`
                          });
                          _.delay(
                            payload => {
                              handleChangeTimeArray({
                                payload: [
                                  {
                                    hour: payload.hour,
                                    minute: payload.minute,
                                    fieldName: "pickUpAt",
                                    fieldValue: pickUpAtTemp
                                  }
                                ],
                                rowId: rowId
                              });
                            },
                            0,
                            { hour, minute }
                          );
                        } else {
                          Ui.showWarning({
                            message: `Giờ bắt đầu nhỏ hơn thời gian trong ngày. Tự động chuyển giờ bắt đầu về:  00:00`
                          });
                          _.delay(() => {
                            handleChangeTimeArray({
                              payload: [
                                {
                                  hour: 0,
                                  minute: 0,
                                  fieldName: "pickUpAt",
                                  fieldValue: pickUpAtTemp
                                },
                                {
                                  hour: 0,
                                  minute: 30,
                                  fieldName: "dropOffAt",
                                  fieldValue: dropOffAtTemp
                                }
                              ],
                              rowId: rowId
                            });
                          }, 0);
                        }
                      }
                    }, 800);
                  }}
                  name="timePickUpAtMinute"
                  className={classNames({
                    "form-control text-center kt-font-lg kt-font-bold": true,
                    "border-invalid": dropOffAtErrors
                  })}
                  pattern="^([0-5][0-9])?$"
                />
              </div>
            </div>
          </div>
        </td>
      );
    }
  )
);
export default TripDate;
