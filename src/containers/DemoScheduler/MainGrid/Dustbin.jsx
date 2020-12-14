import React, { memo, useCallback } from "react";
import { useDrop } from "react-dnd";
import ItemTypes from "./ItemTypes";
import Box from "./Box";
import _ from "lodash";
import { Popover, Button, Divider } from "antd";
import { DATE_TIME_FORMAT } from "constants/common";
import { checkMoment } from "helpers/utility";
const Dustbin = ({
  isTripArray,
  tripArray,
  columnIndex,
  rowIndex,
  vehicleTypeData,
  isHasPermission,
  isSelect,
  findedTripAddress,
  dustInfo,
  trip,
  tripId,
  tasks,
  onOpenDragDialog,
  onOpenDragLockTrip,
  onSelectTrip
}) => {
  const _renderFreeTime = useCallback(trip => {
    return trip.freeTime.map((free, freeId) => {
      return (
        <Popover
          key={freeId}
          content={
            <div style={{ maxWidth: 240 }}>
              <label className="font-weight-bolder">Địa chỉ:</label>
              {` ${free.address}`}
              <br />
              <label className="font-weight-bolder">Thời gian:</label>
              {` ${checkMoment(free.startDate).format(
                DATE_TIME_FORMAT.DD_MM_YYYY
              )} -`}
              <span className="ml-1 kt-font-danger">{` ${checkMoment(
                free.startDate
              ).format(DATE_TIME_FORMAT.HH_MM)} - ${checkMoment(
                free.endDate
              ).format(DATE_TIME_FORMAT.HH_MM)}`}</span>
            </div>
          }
        >
          <Button
            type="danger"
            style={{
              left: free.left,
              width: free.width
            }}
            className="fT"
          >
            <Divider type="horizontal" />
            <Divider type="horizontal" />
            <Divider type="horizontal" />
            <Divider type="horizontal" />
            <Divider type="horizontal" />
            <Divider type="horizontal" />
            <Divider type="horizontal" />
            <Divider type="horizontal" />
            <Divider type="horizontal" />
            <Divider type="horizontal" />
            <Divider type="horizontal" />
            <Divider type="horizontal" />
            <Divider type="horizontal" />
            <Divider type="horizontal" />
            <Divider type="horizontal" />
          </Button>
        </Popover>
      );
    });
  }, []);
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.BOX,
    drop: () => {
      if (isTripArray) {
        let dust = {};
        let finded = _.find(
          tripArray,
          x => x.key === `${columnIndex}-${rowIndex}`
        );
        if (finded) {
          let loaiXeTmp = vehicleTypeData[rowIndex];
          let xeTmp = {};
          let driverTmp = {};
          let loaiXe = {};
          let xe = {};
          let driver = {};
          if (_.isFunction(loaiXeTmp)) {
            loaiXe = loaiXeTmp(vehicleTypeData); // data câp 1
            xeTmp = loaiXe[rowIndex];
            if (_.isFunction(xeTmp)) {
              xe = xeTmp(loaiXe); // data cấp 2
              if (xe === "inActive") {
                dust = {
                  sh: loaiXe.sh,
                  ve: {},
                  dr: {},
                  active: false
                };
              } else if (_.isObject(xe)) {
                driverTmp = xe[rowIndex];
                if (_.isFunction(driverTmp)) {
                  driver = driverTmp(xe);
                  if (_.isObject(driver)) {
                    dust = {
                      sh: loaiXe.sh,
                      ve: xe.ve,
                      dr: driver.dr,
                      active: true
                    };
                  }
                } else if (_.isObject(driverTmp)) {
                  driver = driverTmp;
                  dust = {
                    sh: loaiXe.sh,
                    ve: xe.ve,
                    dr: driver.dr,
                    active: true
                  };
                }
              }
            } else if (_.isObject(xeTmp)) {
              xe = xeTmp;
              driverTmp = xe[rowIndex];
              if (_.isFunction(driverTmp)) {
                driver = driverTmp(xe);
                if (_.isObject(driver)) {
                  dust = {
                    sh: loaiXe.sh,
                    vh: xe.vh,
                    dr: driver.dr,
                    active: true
                  };
                }
              } else if (_.isObject(driverTmp)) {
                driver = driverTmp;
                dust = {
                  sh: loaiXe.sh,
                  ve: xe.ve,
                  dr: driver.dr,
                  active: true
                };
              }
            } else if (xeTmp === "inActive") {
              dust = {
                sh: loaiXe.sh,
                ve: {},
                dr: {},
                active: false
              };
            }
          } else if (_.isObject(loaiXeTmp)) {
            loaiXe = loaiXeTmp;
            xeTmp = loaiXe[rowIndex];
            if (_.isFunction(xeTmp)) {
              xe = xeTmp(loaiXe); // data cấp 2
              driverTmp = xe[rowIndex];
              if (_.isFunction(driverTmp)) {
                driver = driverTmp(xe);
                if (_.isObject(driver)) {
                  dust = {
                    sh: loaiXe.sh,
                    ve: xe.ve,
                    dr: driver.dr,
                    active: true
                  };
                }
              } else if (_.isObject(driverTmp)) {
                driver = driverTmp;
                dust = {
                  sh: loaiXe.sh,
                  ve: xe.ve,
                  dr: driver.dr,
                  active: true
                };
              }
            } else if (_.isObject(xeTmp)) {
              xe = xeTmp;
              driverTmp = xe[rowIndex];
              if (_.isFunction(driverTmp)) {
                driver = driverTmp(xe);
                if (_.isObject(driver)) {
                  dust = {
                    sh: loaiXe.sh,
                    ve: xe.ve,
                    dr: driver.dr,
                    active: true
                  };
                }
              } else if (_.isObject(driverTmp)) {
                driver = driverTmp;
                dust = {
                  sh: loaiXe.sh,
                  ve: xe.ve,
                  dr: driver.dr,
                  active: true
                };
              }
            } else if (xeTmp === "inActive") {
              dust = {
                sh: loaiXe.sh,
                ve: {},
                dr: {},
                active: false
              };
            }
          }
        }
        let sh = dust.sh || {};
        let ve = dust.ve || {};
        let dr = dust.dr || {};
        return {
          key: dustInfo.key,
          dustTask: tasks[dustInfo.key],
          active: dust.active,
          vehicleTypeId: sh.uuid,
          vehicleId: ve.vehicleId,
          seats: sh.seats,
          isPartner: sh.isPartner,
          partnerUuid: sh.partnerUuid,
          partnerName: sh.partnerName,
          vehicleType: sh.vehicleType,
          vehicleName: ve.vehicleName,
          subDrivers: dr.subDrivers,
          driverId: dr.driverId,
          driverName: dr.driverName
        };
      }
      let sh = dustInfo.sh || {};
      let ve = dustInfo.ve || {};
      let dr = dustInfo.dr || {};
      return {
        key: dustInfo.key,
        dustTask: tasks[dustInfo.key],
        active: dustInfo.active,
        vehicleTypeId: sh.uuid,
        vehicleId: ve.vehicleId,
        seats: sh.seats,
        isPartner: sh.isPartner,
        partnerUuid: sh.partnerUuid,
        partnerName: sh.partnerName,
        vehicleType: sh.vehicleType,
        vehicleName: ve.vehicleName,
        subDrivers: dr.subDrivers,
        driverId: dr.driverId,
        driverName: dr.driverName
      };
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  let backgroundColor = "";
  if (isOver) {
    backgroundColor = "isOver";
  }
  if (isTripArray) {
    let _renderArray = [];
    let isFinded,
      isSelect,
      dustInfo,
      loaiXeTmp,
      xeTmp,
      driverTmp,
      loaiXe,
      xe,
      driver,
      renderBox;
    _.forEach(tripArray, (trip, tripIndex) => {
      isFinded = findedTripAddress.get(trip.key) ? true : false;
      isSelect = tripId && tripId === trip.tripId;
      dustInfo = {};
      loaiXeTmp = vehicleTypeData[rowIndex];
      xeTmp = {};
      driverTmp = {};
      loaiXe = {};
      xe = {};
      driver = {};
      renderBox = null;
      if (_.isFunction(loaiXeTmp)) {
        loaiXe = loaiXeTmp(vehicleTypeData); // data câp 1
        xeTmp = loaiXe[rowIndex];
        if (_.isFunction(xeTmp)) {
          xe = xeTmp(loaiXe); // data cấp 2
          if (xe === "inActive") {
            dustInfo = {
              sh: loaiXe.sh,
              ve: {},
              dr: {},
              active: false
            };
            renderBox = (
              <Box
                name="trip"
                key={tripIndex}
                isSelect={isSelect}
                isFinded={isFinded}
                isHasPermission={isHasPermission}
                dustInfo={dustInfo}
                trip={trip}
                onOpenDragDialog={onOpenDragDialog}
                onSelectTrip={onSelectTrip}
                onOpenDragLockTrip={onOpenDragLockTrip}
              />
            );
          } else if (_.isObject(xe)) {
            driverTmp = xe[rowIndex];
            if (_.isFunction(driverTmp)) {
              driver = driverTmp(xe);
              if (_.isObject(driver)) {
                dustInfo = {
                  sh: loaiXe.sh,
                  ve: xe.ve,
                  dr: driver.dr,
                  active: true
                };
                renderBox = (
                  <Box
                    name="trip"
                    key={tripIndex}
                    isSelect={isSelect}
                    isFinded={isFinded}
                    isHasPermission={isHasPermission}
                    dustInfo={dustInfo}
                    trip={trip}
                    onOpenDragDialog={onOpenDragDialog}
                    onSelectTrip={onSelectTrip}
                    onOpenDragLockTrip={onOpenDragLockTrip}
                  />
                );
              }
            } else if (_.isObject(driverTmp)) {
              driver = driverTmp;
              dustInfo = {
                sh: loaiXe.sh,
                ve: xe.ve,
                dr: driver.dr,
                active: true
              };
              renderBox = (
                <Box
                  name="trip"
                  key={tripIndex}
                  isSelect={isSelect}
                  isFinded={isFinded}
                  isHasPermission={isHasPermission}
                  dustInfo={dustInfo}
                  trip={trip}
                  onOpenDragDialog={onOpenDragDialog}
                  onSelectTrip={onSelectTrip}
                  onOpenDragLockTrip={onOpenDragLockTrip}
                />
              );
            }
          }
        } else if (_.isObject(xeTmp)) {
          xe = xeTmp;
          driverTmp = xe[rowIndex];
          if (_.isFunction(driverTmp)) {
            driver = driverTmp(xe);
            if (_.isObject(driver)) {
              dustInfo = {
                sh: loaiXe.sh,
                vh: xe.vh,
                dr: driver.dr,
                active: true
              };
              renderBox = (
                <Box
                  name="trip"
                  key={tripIndex}
                  isSelect={isSelect}
                  isFinded={isFinded}
                  isHasPermission={isHasPermission}
                  dustInfo={dustInfo}
                  trip={trip}
                  onOpenDragDialog={onOpenDragDialog}
                  onSelectTrip={onSelectTrip}
                  onOpenDragLockTrip={onOpenDragLockTrip}
                />
              );
            }
          } else if (_.isObject(driverTmp)) {
            driver = driverTmp;
            dustInfo = {
              sh: loaiXe.sh,
              ve: xe.ve,
              dr: driver.dr,
              active: true
            };
            renderBox = (
              <Box
                name="trip"
                key={tripIndex}
                isSelect={isSelect}
                isFinded={isFinded}
                isHasPermission={isHasPermission}
                dustInfo={dustInfo}
                trip={trip}
                onOpenDragDialog={onOpenDragDialog}
                onSelectTrip={onSelectTrip}
                onOpenDragLockTrip={onOpenDragLockTrip}
              />
            );
          }
        } else if (xeTmp === "inActive") {
          dustInfo = {
            sh: loaiXe.sh,
            ve: {},
            dr: {},
            active: false
          };
          renderBox = (
            <Box
              name="trip"
              key={tripIndex}
              isSelect={isSelect}
              isFinded={isFinded}
              isHasPermission={isHasPermission}
              dustInfo={dustInfo}
              trip={trip}
              onOpenDragDialog={onOpenDragDialog}
              onSelectTrip={onSelectTrip}
              onOpenDragLockTrip={onOpenDragLockTrip}
            />
          );
        }
      } else if (_.isObject(loaiXeTmp)) {
        loaiXe = loaiXeTmp;
        xeTmp = loaiXe[rowIndex];
        if (_.isFunction(xeTmp)) {
          xe = xeTmp(loaiXe); // data cấp 2
          driverTmp = xe[rowIndex];
          if (_.isFunction(driverTmp)) {
            driver = driverTmp(xe);
            if (_.isObject(driver)) {
              dustInfo = {
                sh: loaiXe.sh,
                ve: xe.ve,
                dr: driver.dr,
                active: true
              };
              renderBox = (
                <Box
                  name="trip"
                  key={tripIndex}
                  isSelect={isSelect}
                  isFinded={isFinded}
                  isHasPermission={isHasPermission}
                  dustInfo={dustInfo}
                  trip={trip}
                  onOpenDragDialog={onOpenDragDialog}
                  onSelectTrip={onSelectTrip}
                  onOpenDragLockTrip={onOpenDragLockTrip}
                />
              );
            }
          } else if (_.isObject(driverTmp)) {
            driver = driverTmp;
            dustInfo = {
              sh: loaiXe.sh,
              ve: xe.ve,
              dr: driver.dr,
              active: true
            };
            renderBox = (
              <Box
                name="trip"
                key={tripIndex}
                isSelect={isSelect}
                isFinded={isFinded}
                isHasPermission={isHasPermission}
                dustInfo={dustInfo}
                trip={trip}
                onOpenDragDialog={onOpenDragDialog}
                onSelectTrip={onSelectTrip}
                onOpenDragLockTrip={onOpenDragLockTrip}
              />
            );
          }
        } else if (_.isObject(xeTmp)) {
          xe = xeTmp;
          driverTmp = xe[rowIndex];
          if (_.isFunction(driverTmp)) {
            driver = driverTmp(xe);
            if (_.isObject(driver)) {
              dustInfo = {
                sh: loaiXe.sh,
                ve: xe.ve,
                dr: driver.dr,
                active: true
              };
              renderBox = (
                <Box
                  name="trip"
                  key={tripIndex}
                  isSelect={isSelect}
                  isFinded={isFinded}
                  isHasPermission={isHasPermission}
                  dustInfo={dustInfo}
                  trip={trip}
                  onOpenDragDialog={onOpenDragDialog}
                  onSelectTrip={onSelectTrip}
                  onOpenDragLockTrip={onOpenDragLockTrip}
                />
              );
            }
          } else if (_.isObject(driverTmp)) {
            driver = driverTmp;
            dustInfo = {
              sh: loaiXe.sh,
              ve: xe.ve,
              dr: driver.dr,
              active: true
            };
            renderBox = (
              <Box
                name="trip"
                key={tripIndex}
                isSelect={isSelect}
                isFinded={isFinded}
                isHasPermission={isHasPermission}
                dustInfo={dustInfo}
                trip={trip}
                onOpenDragDialog={onOpenDragDialog}
                onSelectTrip={onSelectTrip}
                onOpenDragLockTrip={onOpenDragLockTrip}
              />
            );
          }
        } else if (xeTmp === "inActive") {
          dustInfo = {
            sh: loaiXe.sh,
            ve: {},
            dr: {},
            active: false
          };
          renderBox = (
            <Box
              name="trip"
              key={tripIndex}
              isSelect={isSelect}
              isFinded={isFinded}
              isHasPermission={isHasPermission}
              dustInfo={dustInfo}
              trip={trip}
              onOpenDragDialog={onOpenDragDialog}
              onSelectTrip={onSelectTrip}
              onOpenDragLockTrip={onOpenDragLockTrip}
            />
          );
        }
      } else {
        renderBox = (
          <Box
            name="trip"
            key={tripIndex}
            isSelect={isSelect}
            isFinded={isFinded}
            isHasPermission={isHasPermission}
            dustInfo={dustInfo}
            trip={trip}
            onOpenDragDialog={onOpenDragDialog}
            onSelectTrip={onSelectTrip}
            onOpenDragLockTrip={onOpenDragLockTrip}
          />
        );
      }
      _renderArray.push(
        <React.Fragment key={tripIndex}>
          {trip && trip.isHasFreeTime ? _renderFreeTime(trip) : null}
          {trip && renderBox}
        </React.Fragment>
      );
    });
    let _renderTasks = null;
    let task = tasks[dustInfo.key];
    if (task) {
      _renderTasks = _.map(task, (x, xId) => (
        <span
          key={xId}
          style={{
            left: x.startPixel,
            width: x.widthTrip - 1
          }}
          className={`b ${x.color}`}
        >
          {/* Bố nghỉ */}
        </span>
      ));
    }
    return (
      <div className={`dz ${backgroundColor}`} ref={drop}>
        {_renderTasks}
        {_renderArray}
      </div>
    );
  }
  let _renderTasks = null;
  let task = tasks[dustInfo.key];
  if (task) {
    _renderTasks = _.map(task, (x, xId) => (
      <span
        key={xId}
        style={{
          left: x.startPixel,
          width: x.widthTrip - 1
        }}
        className={`b ${x.color}`}
      >
        Bố nghỉ
      </span>
    ));
  }
  return (
    <div className={`dz ${backgroundColor}`} ref={drop}>
      {_renderTasks}
      {trip && trip.isHasFreeTime ? _renderFreeTime(trip) : null}
      {trip && (
        <Box
          name="trip"
          isSelect={isSelect}
          isFinded={findedTripAddress.get(trip.key) ? true : false}
          isHasPermission={isHasPermission}
          dustInfo={dustInfo}
          trip={trip}
          onOpenDragDialog={onOpenDragDialog}
          onSelectTrip={onSelectTrip}
          onOpenDragLockTrip={onOpenDragLockTrip}
        />
      )}
    </div>
  );
};
export default memo(Dustbin);
