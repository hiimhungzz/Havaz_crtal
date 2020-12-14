import React, { memo, useCallback } from "react";
import PortletHead from "@Components/Portlet/PortletHead";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import { SCHEDULER_STATUS } from "@Constants/common";
import { checkMoment } from "@Helpers/utility";
import { Button, DatePicker, Input } from "antd";
import { momentRange } from "@Helpers/utility";
import _ from "lodash";
import A from "components/A";
import I from "components/I";
import { fromJS } from "immutable";
import { DATE_TIME_FORMAT } from "constants/common";

const InfoAfter = React.memo(
  withStyles({
    root: {
      width: 146,
      display: "grid",
      gridGap: 3,
      gridTemplateColumns: "100px 20px 20px"
    }
  })(({ classes, content, func }) => {
    const _prev = useCallback(
      e => {
        e.preventDefault();
        func("down");
      },
      [func]
    );
    const _next = useCallback(
      e => {
        e.preventDefault();
        func("up");
      },
      [func]
    );
    return (
      <div className={classes.root}>
        <code>{content}</code>
        <A className="align-items-center" onClick={_prev}>
          <I className="fa fa-arrow-up" />
        </A>
        <A className="align-items-center" onClick={_next}>
          <I className="fa fa-arrow-down" />
        </A>
      </div>
    );
  })
);

let codeBookingTimer = null;
let otherTimer = null;
const ToolBar = memo(
  withStyles({
    left: {
      flex: "0 0 350px"
    },
    right: {
      "& .ant-input-group-addon": {
        padding: "0px 0px !important"
      }
    },
    hasPermission: {
      color: "#646c9a"
    },
    noPermission: {
      color: "#fd397a"
    },
    datePicker: {
      flex: "0 0 210px",
      "& .ant-calendar-picker-clear, .ant-calendar-picker-icon": {
        top: "45% !important"
      }
    }
  })(
    ({
      classes,
      dataSource,
      profile,
      hasPermission,
      activeUser,
      param,
      onSetParam,
      search,
      onSetSearch,
      onSetIsShowFilter,
      onRefresh,
      onEmitSocket
    }) => {
      const _onShowFilter = useCallback(() => {
        onSetIsShowFilter(true);
      }, [onSetIsShowFilter]);
      const _onRequestPermission = useCallback(() => {
        onEmitSocket(SCHEDULER_STATUS.REQUEST_PERMISSTION, profile.uuid);
      }, [onEmitSocket, profile.uuid]);

      const _changeFindedTripIndex = useCallback(
        type => {
          onSetSearch(prevState => {
            let nextState = prevState;
            if (type === "up") {
              if (
                nextState.get("findedTripIndex") + 1 >
                nextState.get("findedTrip").size
              ) {
                return nextState;
              }
              return nextState.set(
                "findedTripIndex",
                nextState.get("findedTripIndex") + 1
              );
            }
            if (nextState.get("findedTripIndex") - 1 === 0) {
              return nextState;
            }
            return nextState.set(
              "findedTripIndex",
              nextState.get("findedTripIndex") - 1
            );
          });
        },
        [onSetSearch]
      );
      const _changeFindedOtherIndex = useCallback(
        type => {
          onSetSearch(prevState => {
            let nextState = prevState;
            if (type === "up") {
              if (
                nextState.get("findedOtherIndex") + 1 >
                nextState.get("findedOther").size
              ) {
                return nextState;
              }
              return nextState.set(
                "findedOtherIndex",
                nextState.get("findedOtherIndex") + 1
              );
            }
            if (nextState.get("findedOtherIndex") - 1 === 0) {
              return nextState;
            }
            return nextState.set(
              "findedOtherIndex",
              nextState.get("findedOtherIndex") - 1
            );
          });
        },
        [onSetSearch]
      );
      const _searchOther = useCallback(
        searchText => {
          let rootMerge = {
            ...dataSource.rootData.leftSide.merge,
            ...dataSource.rootData.leftSide.cells
          };
          let findedOther = [];
          let findedOtherAddress = {};
          if (searchText) {
            _.find(rootMerge, (value, key) => {
              if (
                value
                  .getSearchInput()
                  .toLowerCase()
                  .includes(searchText.toLowerCase())
              ) {
                let splitStr = key.split("-");
                findedOther.push({
                  columnIndex: parseInt(splitStr[0]),
                  rowIndex: parseInt(splitStr[1])
                });
                findedOtherAddress[key] = key;
              }
            });
          }
          onSetSearch(
            fromJS({
              otherSearchText: searchText,
              findedOther: _.sortBy(findedOther, x => x.rowIndex),
              findedOtherIndex: 1,
              findedTripIndex: 1,
              findedTrip: [],
              findedTripAddress: {},
              findedOtherAddress: findedOtherAddress
            })
          );
        },
        [
          dataSource.rootData.leftSide.cells,
          dataSource.rootData.leftSide.merge,
          onSetSearch
        ]
      );
      const _searchCodeBooking = useCallback(
        searchText => {
          let rootTrip = {
            ...dataSource.rootData.trips
          };
          let findedTrip = [];
          let findedTripAddress = {};
          if (searchText) {
            _.forEach(rootTrip, (value, key) => {
              let splitStr = key.split("-");
              if (_.isPlainObject(value)) {
                if (
                  value.codeBooking
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
                ) {
                  findedTrip.push({
                    columnIndex: parseInt(splitStr[0]),
                    rowIndex: parseInt(splitStr[1])
                  });
                  findedTripAddress[key] = key;
                }
              } else if (_.isArray(value)) {
                _.forEach(value, arr => {
                  if (
                    arr.codeBooking
                      .toLowerCase()
                      .includes(searchText.toLowerCase())
                  ) {
                    findedTrip.push({
                      columnIndex: parseInt(splitStr[0]),
                      rowIndex: parseInt(splitStr[1])
                    });
                    findedTripAddress[key] = key;
                  }
                });
              }
            });
          }
          onSetSearch(
            fromJS({
              bookingCodeSearchText: searchText,
              findedOther: [],
              findedOtherIndex: 1,
              findedOtherAddress: {},
              findedTripIndex: 1,
              findedTrip: _.sortBy(findedTrip, x => x.rowIndex),
              findedTripAddress: findedTripAddress
            })
          );
        },
        [dataSource.rootData.trips, onSetSearch]
      );
      return (
        <PortletHead>
          <div
            className={classNames({
              "kt-portlet__head-label": true,
              [classes.left]: true
            })}
          >
            <Button.Group>
              <Button title="Xin quyền" onClick={_onRequestPermission}>
                <I
                  className={classNames({
                    fa: true,
                    [`flaticon-lock ${classes.noPermission}`]: !hasPermission,
                    [`flaticon-edit-1 ${classes.hasPermission}`]: hasPermission
                  })}
                />
                {activeUser ? activeUser.fullName : null}
              </Button>
              <Button onClick={onRefresh}>
                <I
                  className={classNames({
                    "flaticon2-reload": true,
                    [classes.hasPermission]: true
                  })}
                />
                Làm mới
              </Button>
              <Button onClick={_onShowFilter} title="Bộ filter">
                <i className="flaticon-squares-2" />
              </Button>
            </Button.Group>
          </div>
          <div
            className={classNames({
              "kt-portlet__head-toolbar": true,
              [classes.right]: true
            })}
          >
            <div className="kt-portlet__head-actions d-flex">
              <Input
                placeholder="Tìm Xe/Lái xe/SĐT"
                title="Tìm Xe/Lái xe/SĐT"
                value={search.get("otherSearchText")}
                onChange={e => {
                  let searchInput = e.target.value;
                  onSetSearch(prevState =>
                    prevState.set("otherSearchText", searchInput)
                  );
                  if (otherTimer) {
                    clearTimeout(otherTimer);
                  }
                  otherTimer = setTimeout(() => {
                    _searchOther(searchInput);
                  }, 800);
                }}
                type="text"
                addonAfter={
                  <InfoAfter
                    content={`${
                      search.get("findedOther").size === 0
                        ? 0
                        : search.get("findedOtherIndex")
                    } trong ${search.get("findedOther").size}`}
                    func={_changeFindedOtherIndex}
                  />
                }
              />
              &nbsp;
              <Input
                placeholder="Tìm mã booking"
                title="Tìm Xe/Lái xe/SĐT"
                value={search.get("bookingCodeSearchText")}
                onChange={e => {
                  let searchInput = e.target.value;
                  onSetSearch(prevState =>
                    prevState.set("bookingCodeSearchText", searchInput)
                  );
                  if (codeBookingTimer) {
                    clearTimeout(codeBookingTimer);
                  }
                  codeBookingTimer = setTimeout(() => {
                    _searchCodeBooking(searchInput);
                  }, 800);
                }}
                type="text"
                addonAfter={
                  <InfoAfter
                    content={`${
                      search.get("findedTrip").size === 0
                        ? 0
                        : search.get("findedTripIndex")
                    } trong ${search.get("findedTrip").size}`}
                    func={_changeFindedTripIndex}
                  />
                }
              />
              &nbsp;
              <DatePicker.RangePicker
                format={DATE_TIME_FORMAT.DD_MM_YYYY}
                className={classes.datePicker}
                allowClear={false}
                value={[
                  checkMoment(param.get("startAt")),
                  checkMoment(param.get("endDate"))
                ]}
                onChange={dates => {
                  onSetParam(prevState => {
                    let nextState = prevState;
                    if (dates) {
                      nextState = nextState.set(
                        "startAt",
                        dates[0].startOf("day")
                      );
                      nextState = nextState.set(
                        "endDate",
                        dates[1].endOf("day")
                      );
                    } else {
                      nextState = nextState.set("startAt", undefined);
                      nextState = nextState.set("endDate", undefined);
                    }

                    return nextState;
                  });
                }}
                ranges={momentRange}
              />
            </div>
          </div>
        </PortletHead>
      );
    }
  )
);
export default ToolBar;
