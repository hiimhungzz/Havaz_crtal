/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { memo, useState, useEffect, useCallback } from "react";
import moment from "moment";
import { connect } from "react-redux";
import _ from "lodash";
import "./styles.scss";
import Globals from "globals.js";
import {
  makeSelectSocket,
  makeSelectActiveUser,
} from "../../redux/app/selectors";
import { createStructuredSelector } from "reselect";
import { compose } from "recompose";
import { Ui } from "@Helpers/Ui";
import { Grid } from "@material-ui/core";
import FilterModal from "./FilterModal";
import ToolBar from "./ToolBar";
import MainGrid from "./MainGrid";
import { checkMoment, appParam } from "helpers/utility";
import { fromJS } from "immutable";
import ServiceBase from "services/ServiceBase";
import CellInfo from "./CellInfo";
import { MergeItem } from "./MergeItem";
import { DataEntry, APP_MODULE } from "@Constants/common";
import Portlet from "@Components/Portlet";
import { _$ } from "components/Utility/common";
import { $LocalStorage } from "@Helpers/localStorage";
import { APP_PARAM } from "@Constants";
import "moment-lunar";
import { Spin } from "antd";
import Helmet from "react-helmet";
const formatDate = "DD/MM";

const convertToDayOfWeek = (dayInt) => {
  switch (dayInt) {
    case 1:
      return "T2";
    case 2:
      return "T3";
    case 3:
      return "T4";
    case 4:
      return "T5";
    case 5:
      return "T6";
    case 6:
      return "T7";
    case 0:
      return "CN";
    default:
      return "";
  }
};
const generateHeaderTime = (startTime, endTime) => {
  let data = [];
  let start = !moment.isMoment(startTime)
    ? moment(startTime).clone()
    : startTime;
  let end = !moment.isMoment(endTime) ? moment(endTime).clone() : endTime;
  let numberDays = end.diff(start, "days") + 1;
  let str = start.clone();
  for (let i = 0; i < numberDays; i++) {
    let tempData = {
      id: i,
      key: "key_" + i,
      date: str.format(formatDate),
      dateLunar: str.clone().lunar().format(formatDate),
      dateObj: str.clone(),
      dayOfWeek: convertToDayOfWeek(str.day()),
    };
    data.push(tempData);
    str.add(1, "days");
  }
  return data;
};
const schedulerConfig = (times = 1) => {
  return {
    blockWidth: 1.5 * times, // 1 block rộng 2px
    blockUnit: 15 * times, // 1 block là 5 phút
  };
};
let getTaskSchduler = (
  taskSchedule = [],
  objCurrentRowNumber,
  operating,
  numberRows
) => {
  // let _rand = _.random(0, 20);
  // taskSchedule = [
  //   {
  //     startDate: moment()
  //       .add(_rand, "day")
  //       .startOf("day"),
  //     endDate: moment()
  //       .add(_rand, "day")
  //       .endOf("day"),
  //     status: "approve"
  //   }
  // ];
  let { startAt } = operating.param;
  let { schedulerConfig, times } = operating;

  let startAtLocal = checkMoment(startAt);

  let tasks = {};
  _.forEach(taskSchedule, (task) => {
    let start = checkMoment(task.startDate);
    let end = checkMoment(task.endDate);
    let startNumber = start.diff(startAtLocal, "days");

    let startMinute = start.minute();
    let startHour = start.hour();
    let startTotal = startMinute + startHour * 60;
    let startPixel =
      startTotal *
      ((schedulerConfig.blockWidth / schedulerConfig.blockUnit) * times);
    let endMinute = end.minute();
    let endHour = end.hour();
    let endTotal = endMinute + endHour * 60;
    let widthTrip =
      (endTotal - startTotal) *
      ((schedulerConfig.blockWidth / schedulerConfig.blockUnit) * times);

    let currentRow = objCurrentRowNumber.currentRowNumber;
    for (let index = 0; index < numberRows; index++) {
      let key = `${startNumber + 2}-${currentRow + index}`;
      if (!(_.isArray(tasks[key]) && tasks[key])) {
        tasks[key] = [];
      }
      tasks[key].push({
        key: key,
        startPixel: startPixel,
        widthTrip: widthTrip,
        type: "task",
        status: task.status,
        color: task.status === "approve" ? "ap" : "nap",
      });
    }
  });
  return tasks;
};
let getInActiveTripData = (
  inActiveTripList,
  objCurrentRowNumber,
  dustbinInfo,
  operating,
  deactive
) => {
  let { startAt } = operating.param;
  let { schedulerConfig, times } = operating;

  let startAtLocal = checkMoment(startAt);

  let inActiveTripData = {};
  inActiveTripList.forEach((inActive) => {
    let start = checkMoment(inActive.startDate);
    let end = checkMoment(inActive.endDate);
    let startNumber = start.diff(startAtLocal, "days");

    let startMinute = start.minute();
    let startHour = start.hour();
    let startTotal = startMinute + startHour * 60;
    let startPixel =
      startTotal *
      ((schedulerConfig.blockWidth / schedulerConfig.blockUnit) * times);
    let endMinute = end.minute();
    let endHour = end.hour();
    let endTotal = endMinute + endHour * 60;
    let widthTrip =
      (endTotal - startTotal) *
      ((schedulerConfig.blockWidth / schedulerConfig.blockUnit) * times);

    let currentRow = objCurrentRowNumber.currentRowNumber;
    let key = `${startNumber + 2}-${currentRow}`;
    let isHasFreeTime = inActive.freeTime.length > 0 ? true : false;
    if (!(_.isArray(inActiveTripData[key]) && inActiveTripData[key])) {
      inActiveTripData[key] = [];
    }
    inActiveTripData[key].push({
      key: key,
      deactive: deactive,
      startPixel: startPixel,
      widthTrip: widthTrip,
      isHasFreeTime: isHasFreeTime,
      freeTime: isHasFreeTime
        ? _.map(inActive.freeTime, (free) => {
            let startFree = (widthTrip * free.freeTimeStart) / 100;
            let startFreeOffset = (widthTrip * free.freeTimeOffset) / 100;
            return {
              address: free.address,
              startDate: checkMoment(free.startDate),
              endDate: checkMoment(free.endDate),
              left: startFree,
              width: startFreeOffset,
            };
          })
        : [],
      codeBooking: inActive.codeBooking || "-",
      isOneWay: inActive.isOneWay || false,
      uuidBooking: inActive.uuidBooking || "",
      actualVehicleTypeId: inActive.actualVehicleTypeId || "",
      vehicleTypeId: inActive.vehicleTypeId || "",
      guideInfo: inActive.guideInfo || [],
      customerCode: inActive.customerCode || [],
      guideName: inActive.guideName || "",
      tripId: inActive.tripId || "",
      guidePhone: inActive.guidePhone || "",
      codeTrip: inActive.codeTrip || "",
      fixedRouteCode: inActive.fixedRouteCode || "",
      vehiclesName: inActive.vehiclesName || "",
      seats: inActive.seats || "",
      subDriverName: inActive.subDriverName || "",
      vehicleType: inActive.vehicleType || "",
      vehicleCodesIn: inActive.vehicleCodesIn || "",
      vehicleTimeIn: inActive.vehicleTimeIn || "",
      tripsNote: inActive.tripsNote || "",
      colorCode: inActive.colorCode || "",
      guestNumber: inActive.guestNumber || "",
      nameCountry: inActive.nameCountry || "",
      locationPickup: inActive.locationPickup || "",
      startDate: checkMoment(inActive.startDate),
      endDate: checkMoment(inActive.endDate),
      bookingNote: inActive.bookingNote || "-",
      comfirmedByDriver: inActive.comfirmedByDriver || false,
      isPartner: inActive.isPartner || false,
      partnerUuid: inActive.partnerUuid || null,
      partnerName: inActive.partnerName || null,
    });
  });
  return inActiveTripData;
};
const getRootData = (
  { vehicle = [], vehicleType = [], trips = [] },
  operating
) => {
  let root = {
    vehicleLine: {},
    leftSide: {
      merge: {},
      cells: {},
    },
    rightSide: {
      vehicleTypeData: {},
    },
    trips: {},
    tasks: {},
  };
  let objCurrentRowNumber = {
    currentRowNumber: 1,
  };
  trips = _.sortBy(trips, (x) => x.endDate);
  vehicleType.forEach((sh) => {
    let vehicleData = {};
    let tempRowIndex = objCurrentRowNumber.currentRowNumber;
    let increaseRowNumber = 0;
    // Lấy danh sách xe trong loại xe
    let listVehicle = vehicle.filter((x) => {
      if (x.isPartner) {
        return (
          x.vehicleTypeId === sh.uuid &&
          x.isPartner === sh.isPartner &&
          x.partnerUuid === sh.partnerUuid
        );
      } else {
        return x.vehicleTypeId === sh.uuid && x.isPartner === sh.isPartner;
      }
    });

    // Lấy danh sách trip chưa được gán xe và lái xe theo loại xe
    let inActiveTripList = trips.filter((t) => {
      if (t.isPartner) {
        return (
          t.driverId === null &&
          t.vehicleId === null &&
          t.vehicleTypeId === sh.uuid &&
          t.isPartner === sh.isPartner &&
          t.partnerUuid === sh.partnerUuid
        );
      } else {
        return (
          t.driverId === null &&
          t.vehicleId === null &&
          t.isPartner === sh.isPartner &&
          t.vehicleTypeId === sh.uuid
        );
      }
    });
    if (inActiveTripList.length > 0) {
      // Nhóm trip chưa được gán xe và lái xe theo booking
      let inActiveTripGroupByBooking = _.groupBy(
        inActiveTripList,
        (x) => x["uuidBooking"]
      );
      _.map(
        inActiveTripGroupByBooking,
        (inActiveTripGroup, inActiveTripGroupIndex) => {
          // Nhóm những trip cùng booking theo xe số
          let inActiveTripGroupByVehicleNumber = _.groupBy(
            inActiveTripGroup,
            (x) => x["vehicleNumber"]
          );
          _.map(
            inActiveTripGroupByVehicleNumber,
            (inActiveTripVehicleNumber, inActiveTripVehicleNumberId) => {
              let dustInfo = {
                sh: sh,
              };
              let inActiveTripData = getInActiveTripData(
                inActiveTripVehicleNumber,
                objCurrentRowNumber,
                dustInfo,
                operating,
                true
              );
              root.trips = {
                ...root.trips,
                ...inActiveTripData,
              };

              if (
                inActiveTripVehicleNumberId !==
                Object.keys(inActiveTripGroupByVehicleNumber)[
                  Object.keys(inActiveTripGroupByVehicleNumber).length - 1
                ]
              ) {
                ++objCurrentRowNumber.currentRowNumber;
                ++increaseRowNumber;
              }
            }
          );
          if (
            inActiveTripGroupIndex !==
            Object.keys(inActiveTripGroupByBooking)[
              Object.keys(inActiveTripGroupByBooking).length - 1
            ]
          ) {
            ++objCurrentRowNumber.currentRowNumber;
            ++increaseRowNumber;
          }
        }
      );
    }
    let vehicleTypeRowNumber =
      objCurrentRowNumber.currentRowNumber - increaseRowNumber;
    let content = `<div class="${
      sh.isPartner ? "pvhT" : "vhT"
    }" style="font-weight:bold;color:${sh.color}">${
      sh.isPartner
        ? `${sh.partnerName} - ${sh.name} - ${sh.seats} chỗ`
        : `${sh.name} - ${sh.seats} chỗ`
    } </div>`;
    if ((increaseRowNumber + 1) * 30 > 500) {
      content = `<div class="${
        sh.isPartner ? "pvhT" : "vhT"
      }" style="font-weight:bold;margin-top:${500 / 2}px;color:${sh.color}">${
        sh.isPartner
          ? `${sh.partnerName} - ${sh.name} - ${sh.seats} chỗ`
          : `${sh.name} - ${sh.seats} chỗ`
      } </div>`;
    }
    let mergeVehicleTypeItem = new MergeItem({
      content: content,
      row: increaseRowNumber + 1,
      col: 2,
      rowIndex: vehicleTypeRowNumber,
      colIndex: 0,
    });
    let startInActiveIndex = vehicleTypeRowNumber;
    let endInActiveIndex = vehicleTypeRowNumber + increaseRowNumber + 1;
    for (let i = startInActiveIndex; i < endInActiveIndex; i++) {
      if (i < endInActiveIndex - 1) {
        vehicleData[i] = (data) => {
          return data[endInActiveIndex - 1];
        };
      } else {
        vehicleData[i] = "inActive";
      }
    }

    root.leftSide.merge[`0-${vehicleTypeRowNumber}`] = mergeVehicleTypeItem;
    if (listVehicle.length > 0) {
      ++objCurrentRowNumber.currentRowNumber;
      _.forEach(listVehicle, (ve, veId) => {
        let driverData = {};
        let vehicleLength = listVehicle.length - 1;
        let rowInVehicle = 0;
        let sortedDriver = _.sortBy(ve.drivers, (x) => x.driverName);
        if (sortedDriver.length > 0) {
          _.forEach(sortedDriver, (dr) => {
            let isPushDriver = true;
            let content = `<div class="dvC">
                            ${dr.driverName || DataEntry.NA}</br>
                            <span>${dr.driverPhone || DataEntry.NA}</span>
                        </div>`;
            if (!(dr.driverName && dr.driverPhone)) {
              content = DataEntry.NA;
            }
            let activeTripsByDriver = trips.filter((t) => {
              if (t.isPartner) {
                return (
                  t.vehicleId &&
                  (t.actualVehicleTypeId
                    ? t.actualVehicleTypeId === sh.uuid
                    : t.vehicleTypeId === sh.uuid) &&
                  t.partnerUuid === sh.partnerUuid &&
                  t.isPartner === sh.isPartner &&
                  t.driverId === dr.driverId &&
                  t.vehicleId === ve.vehicleId
                );
              } else {
                return (
                  t.vehicleId &&
                  (t.actualVehicleTypeId
                    ? t.actualVehicleTypeId === sh.uuid
                    : t.vehicleTypeId === sh.uuid) &&
                  t.driverId === dr.driverId &&
                  t.isPartner === sh.isPartner &&
                  t.vehicleId === ve.vehicleId
                );
              }
            });

            if (activeTripsByDriver.length > 0) {
              //Danh sách trip của xe và lái xe nhóm theo booking
              let activeTripGroupByBooking = _.groupBy(
                activeTripsByDriver,
                (x) => x["uuidBooking"]
              );
              let activeTripGroupByBookingLength = Object.keys(
                activeTripGroupByBooking
              ).length;
              if (activeTripGroupByBookingLength > 1) {
                let startDriverIndex = objCurrentRowNumber.currentRowNumber;
                let endDriverIndex =
                  objCurrentRowNumber.currentRowNumber +
                  activeTripGroupByBookingLength;
                for (let i = startDriverIndex; i < endDriverIndex; i++) {
                  if (i < endDriverIndex - 1) {
                    driverData[i] = (data) => {
                      return data[endDriverIndex - 1];
                    };
                  } else {
                    driverData[i] = {
                      dr,
                    };
                  }
                }
                root.leftSide.merge[
                  `1-${objCurrentRowNumber.currentRowNumber}`
                ] = new MergeItem({
                  content: content,
                  row: activeTripGroupByBookingLength,
                  col: 1,
                  type: "driver",
                  rowIndex: objCurrentRowNumber.currentRowNumber,
                  colIndex: 1,
                  info: dr,
                  searchInput: `${dr.driverName || ""} - ${
                    dr.driverPhone || ""
                  }`,
                });

                let tasks = getTaskSchduler(
                  dr.taskSchedule,
                  objCurrentRowNumber,
                  operating,
                  activeTripGroupByBookingLength
                );
                root.tasks = {
                  ...root.tasks,
                  ...tasks,
                };
                isPushDriver = false;
              }
              _.forEach(activeTripGroupByBooking, (activeTrips, bookingId) => {
                let dustInfo = {
                  sh: sh,
                };
                let activeTripData = getInActiveTripData(
                  activeTrips,
                  objCurrentRowNumber,
                  dustInfo,
                  operating,
                  false
                );
                root.trips = {
                  ...root.trips,
                  ...activeTripData,
                };
                if (
                  bookingId !==
                  Object.keys(activeTripGroupByBooking)[
                    activeTripGroupByBookingLength - 1
                  ]
                ) {
                  ++objCurrentRowNumber.currentRowNumber;
                  ++increaseRowNumber;
                  ++rowInVehicle;
                }
              });
            }
            if (isPushDriver) {
              driverData[objCurrentRowNumber.currentRowNumber] = {
                dr,
              };
              root.leftSide.cells[
                `1-${objCurrentRowNumber.currentRowNumber}`
              ] = new CellInfo({
                colIndex: 1,
                rowIndex: objCurrentRowNumber.currentRowNumber,
                styles: {
                  className: "",
                },
                type: "driver",
                content: content,
                info: dr,
                searchInput: `${dr.driverName || ""} - ${dr.driverPhone || ""}`,
              });
              let tasks = getTaskSchduler(
                dr.taskSchedule,
                objCurrentRowNumber,
                operating,
                1
              );
              root.tasks = {
                ...root.tasks,
                ...tasks,
              };
            }
            ++objCurrentRowNumber.currentRowNumber;
            ++increaseRowNumber;
            ++rowInVehicle;
          });
          if (rowInVehicle > 1) {
            root.leftSide.merge[
              `0-${objCurrentRowNumber.currentRowNumber - rowInVehicle}`
            ] = new MergeItem({
              content: `<div class="${
                sh.isPartner ? "pvh" : "vh"
              }" style="color:${sh.color};font-weight:bold;">
                                ${ve.vehicleName}</div>`,
              row: rowInVehicle,
              col: 1,
              rowIndex: objCurrentRowNumber.currentRowNumber - rowInVehicle,
              colIndex: 0,
              searchInput: ve.vehicleName,
            });
            root.vehicleLine[
              objCurrentRowNumber.currentRowNumber - rowInVehicle - 1
            ] = true;
            root.vehicleLine[objCurrentRowNumber.currentRowNumber - 1] = true;
            let startVehicleIndex =
              objCurrentRowNumber.currentRowNumber - rowInVehicle;
            let endVehicleIndex = objCurrentRowNumber.currentRowNumber;
            for (let i = startVehicleIndex; i < endVehicleIndex; i++) {
              if (i < endVehicleIndex - 1) {
                vehicleData[i] = (data) => {
                  return data[endVehicleIndex - 1];
                };
              } else {
                vehicleData[i] = {
                  ve: ve,
                  ...driverData,
                };
              }
            }
          } else {
            root.leftSide.cells[
              `0-${objCurrentRowNumber.currentRowNumber - rowInVehicle}`
            ] = new CellInfo({
              colIndex: 0,
              rowIndex: objCurrentRowNumber.currentRowNumber - rowInVehicle,
              styles: {
                className: "",
              },
              content: `
                            <div class="${
                              sh.isPartner ? "pvh" : "vh"
                            }" style="color:${sh.color};font-weight:bold;">
                            ${ve.vehicleName}</div>`,
              searchInput: ve.vehicleName,
            });
            root.vehicleLine[
              objCurrentRowNumber.currentRowNumber - rowInVehicle - 1
            ] = true;
            root.vehicleLine[objCurrentRowNumber.currentRowNumber - 1] = true;
            vehicleData[objCurrentRowNumber.currentRowNumber - rowInVehicle] = {
              ve: ve,
              ...driverData,
            };
          }
        } else {
          if (veId < vehicleLength) {
            ++objCurrentRowNumber.currentRowNumber;
            ++increaseRowNumber;
          }
        }
      });
    } else {
      ++objCurrentRowNumber.currentRowNumber;
    }
    let currentRowId = objCurrentRowNumber.currentRowNumber;
    for (let x = tempRowIndex; x < currentRowId; x++) {
      if (x === currentRowId - 1) {
        root.rightSide.vehicleTypeData[x] = {
          sh: sh,
          ...vehicleData,
        };
      } else {
        root.rightSide.vehicleTypeData[x] = (data) => {
          return data[currentRowId - 1];
        };
      }
    }
  });
  root.totalRow = objCurrentRowNumber.currentRowNumber;
  let ignore = _.reduce(
    root.leftSide.merge,
    (flattend, other) => {
      return flattend.concat(other.getIgnore());
    },
    []
  );
  root.leftSide.ignore = ignore;
  return root;
};
const Scheduler = ({ socket, activeUser }) => {
  const [profile] = useState(Globals.currentUser);
  const [dataSource, setDataSource] = useState({
    info: {
      inActiveTripNumber: 0,
      activeTripNumber: 0,
      bookings: [],
      vehicleTypes: [],
    },
    headerScheduler: generateHeaderTime(
      appParam[APP_MODULE.SCHEDULER] &&
        checkMoment(appParam[APP_MODULE.SCHEDULER].startDate)
        ? checkMoment(appParam[APP_MODULE.SCHEDULER].startDate)
        : moment().startOf("month"),
      appParam[APP_MODULE.SCHEDULER] &&
        checkMoment(appParam[APP_MODULE.SCHEDULER].endDate)
        ? checkMoment(appParam[APP_MODULE.SCHEDULER].endDate)
        : moment().endOf("month")
    ),
    rootData: {
      leftSide: {
        merge: {},
        cells: {},
      },
      rightSide: {
        vehicleTypeData: {},
      },
      trips: {},
      totalRow: 0,
    },
  });
  const [hasPermission, setHasPermission] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isShowFilter, setIsShowFilter] = useState(false);

  const [param, setParam] = useState(
    appParam[APP_MODULE.SCHEDULER]
      ? fromJS({
          ...appParam[APP_MODULE.SCHEDULER],
          partners: [],
          bookingCode: [],
          vehicleTypes: [],
          contractType: undefined,
        })
      : fromJS({
          contractType: undefined,
          partners: [],
          bookingCode: [],
          vehicleTypes: [],
          startAt: moment().startOf("month"),
          endDate: moment().endOf("month"),
        })
  );

  const [search, setSearch] = useState(
    fromJS({
      input: "",
      findedTrip: [],
      findedTripIndex: 0,
      findedOther: [],
      findedOtherIndex: 0,
      findedTripAddress: {},
      findedOtherAddress: {},
    })
  );

  /**
   * Emit Socket
   */
  const emitSocket = useCallback(
    (status, uuid) => {
      if (socket) {
        socket.emit(`LDH-${Globals.currentUser.organizationUuid}`, {
          status: status,
          uuid: uuid,
          organizationUuid: Globals.currentUser.organizationUuid,
        });
      }
    },
    [socket]
  );
  /**
   * Lấy dữ liệu LĐH
   */
  const browseScheduler = useCallback(async () => {
    setIsFetching(true);
    let exactParam = param.toJS();
    exactParam.partners = _.map(exactParam.partners, (x) => x.key) || [];
    exactParam.bookingCode =
      _.map(exactParam.bookingCode, (x) => x.label) || [];

    let result = await ServiceBase.requestJson({
      method: "POST",
      url: "/scheduler/filter/list",
      data: exactParam,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      appParam[APP_MODULE.SCHEDULER] = param.toJS();
      $LocalStorage.sls.setObject(APP_PARAM, appParam);
      let config = schedulerConfig(1);
      let headerScheduler = generateHeaderTime(
        param.get("startAt"),
        param.get("endDate")
      );
      let start = performance.now();
      let rootData = getRootData(result.value.data, {
        param: param.toJS(),
        schedulerConfig: config,
        times: 1,
      });
      let end = performance.now();
      console.log(`Generate master data took ${(end - start) / 1000} s`);
      let inActiveTripList = result.value.data.trips
        ? result.value.data.trips.filter(
            (t) => t.driverId === null && t.vehicleId === null
          )
        : [];
      let bookings = [];
      _.forEach(result.value.data.trips, (trip) => {
        let isHas = _.find(bookings, (x) => x.key === trip.uuidBooking);
        if (bookings.length === 0 || !isHas) {
          bookings.push({ key: trip.uuidBooking, label: trip.codeBooking });
        }
      });
      let vehicleTypes = [];
      _.forEach(result.value.data.vehicleType, (ve) => {
        let isHas = _.find(vehicleTypes, (x) => x.key === ve.uuid);
        if (vehicleTypes.length === 0 || !isHas) {
          vehicleTypes.push({
            key: ve.uuid,
            label: `${ve.vehicleType} - ${ve.name}`,
          });
        }
      });

      setDataSource((prevState) => {
        let nextState = { ...prevState };
        nextState.headerScheduler = headerScheduler;
        nextState.rootData = rootData;
        nextState.vehicle = result.value.data.vehicle;
        nextState.info.inActiveTripNumber = inActiveTripList.length;
        nextState.info.activeTripNumber = result.value.data.trips
          ? result.value.data.trips.length - inActiveTripList.length
          : 0;
        if (bookings.length > nextState.info.bookings.length) {
          nextState.info.bookings = bookings;
        }
        if (vehicleTypes.length > nextState.info.vehicleTypes.length) {
          nextState.info.vehicleTypes = vehicleTypes;
        }
        return nextState;
      });
    }
    setIsFetching(false);
  }, [param]);

  // Load data
  useEffect(() => {
    _.delay(() => {
      browseScheduler();
    }, 600);
    _$("body").addClass("kt-aside--minimize");
  }, [browseScheduler]);

  // Kiểm tra quyền
  useEffect(() => {
    if (profile) {
      let permissions = profile.permissions["SCHEDULER"].permissions;
      if (
        (permissions["E"] || permissions["EA"]) &&
        activeUser &&
        activeUser.uuid === profile.uuid
      ) {
        setHasPermission(true);
      } else {
        setHasPermission(false);
      }
    }
  }, [profile, activeUser]);
  return (
    <Grid container spacing={3}>
      <Helmet title="LỊCH ĐIỀU HÀNH">
        <meta name="description" content="Lịch điều hành - Car Rental" />
      </Helmet>
      <Grid item xs={12}>
        <Portlet className="mb-0">
          <ToolBar
            dataSource={dataSource}
            profile={profile}
            activeUser={activeUser}
            hasPermission={hasPermission}
            param={param}
            onSetParam={setParam}
            search={search}
            onSetSearch={setSearch}
            onSetIsShowFilter={setIsShowFilter}
            onEmitSocket={emitSocket}
            onRefresh={browseScheduler}
          />
          <Spin spinning={isFetching} tip="Đang lấy dữ liệu...">
            <MainGrid
              hasPermission={hasPermission}
              rootData={dataSource.rootData}
              vehicle={dataSource.vehicle}
              headerScheduler={dataSource.headerScheduler}
              inActiveTripNumber={dataSource.info.inActiveTripNumber}
              activeTripNumber={dataSource.info.activeTripNumber}
              onRefresh={browseScheduler}
              search={search}
            />
          </Spin>
        </Portlet>
      </Grid>
      <FilterModal
        param={param}
        bookings={dataSource.info.bookings}
        vehicleTypes={dataSource.info.vehicleTypes}
        isShowFilter={isShowFilter}
        onSetIsShowFilter={setIsShowFilter}
        onSetParam={setParam}
      />
    </Grid>
  );
};

const mapStateToProps = createStructuredSelector({
  socket: makeSelectSocket(),
  activeUser: makeSelectActiveUser(),
});
const withConnect = connect(mapStateToProps, null);
export default compose(withConnect, memo)(Scheduler);
