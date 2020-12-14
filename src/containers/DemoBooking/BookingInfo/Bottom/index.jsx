/* eslint-disable no-loop-func */
import React, { memo, useState, useCallback } from "react";
import _ from "lodash";
import { DatePicker, Tabs, Modal } from "antd";
import classNames from "classnames";
import { checkMoment, momentRange, hashByTimeStamp } from "@Helpers/utility";
import hash from "object-hash";
import clone from "clone";
import PortletBody from "@Components/Portlet/PortletBody";
import Portlet from "@Components/Portlet";
import DrawerTabPane from "@Components/Modals/DemoBooking/DrawerTabPane";
import PortletHead from "@Components/Portlet/PortletHead";
import { Paper, Grid } from "@material-ui/core";
import InitialTable from "./InitialTable";
import PortletFoot from "@Components/Portlet/PortletFoot";
import { Ui } from "@Helpers/Ui";
import DetailPartnerTable from "./DetailPartnerTable";
import DetailDriverTable from "./DetailDriverTable";
import ConfirmSeatsDialog from "./ConfirmSeatsDialog";
import { Map, List, fromJS } from "immutable";

const RangePicker = DatePicker.RangePicker;
let templateInitData = Map({
  tripDate: null,
  fixedRoutesName: null,
  fixedRoutesId: null,
  requireVehicleTypes: List(),
});
const _generateInitData = ({ dateIn, dateOut, initial }) => {
  let data = List();
  let dayDiff = dateOut.diff(dateIn, "days") + 1;

  if (initial.size === 0) {
    for (let i = 0; i < dayDiff; i++) {
      let temp = templateInitData;
      temp = temp.set("rowKey", hashByTimeStamp(i));
      temp = temp.set("tripDate", dateIn.clone().add(i, "days").startOf("day"));
      data = data.push(temp);
    }
  } else {
    let grouped = initial.groupBy((x) => x.get("tripDate"));
    let [...groupedKeys] = grouped.keys();
    for (let i = 0; i < dayDiff; i++) {
      if (i < groupedKeys.length) {
        let array = grouped.get(groupedKeys[i]);
        array.forEach((trip) => {
          let tripDate = dateIn.clone().add(i, "days").startOf("day");
          let clonedTrip = trip.set("tripDate", tripDate);
          data = data.push(clonedTrip);
        });
      } else {
        let tripDate = dateIn.clone().add(i, "days").startOf("day");
        let temp = templateInitData;
        temp = temp.set("rowKey", hashByTimeStamp(i));
        temp = temp.set("tripDate", tripDate);
        data = data.push(temp);
      }
    }
  }
  return data.map((x, id) => {
    if (!x.get("rowKey")) {
      x = x.set("rowKey", hashByTimeStamp(id));
    }
    return x;
  });
};
const calculateAmountPriceRow = (record) => {
  let discountType = "";
  if (
    (record["discount"] === 0 || !record["discount"]) &&
    record["discountByPercentage"] &&
    record["discountByPercentage"] !== 0
  ) {
    discountType = "percent";
  } else if (
    (record["discountByPercentage"] === 0 || !record["discountByPercentage"]) &&
    record["discount"] !== 0 &&
    record["discount"]
  ) {
    discountType = "cash";
  }
  let costPer = 0;
  let costAmount = 0;
  if (
    (record["costPerKm"] &&
      record["costPerKm"] > 0 &&
      record["perDay"] &&
      record["perDay"] > 0) ||
    (record["discount"] &&
      record["discount"] > 0 &&
      record["discountByPercentage"] &&
      record["discountByPercentage"] > 0)
  ) {
    return 0;
  }
  if (
    (!record["costPerKm"] || record["costPerKm"] === 0) &&
    record["perDay"] &&
    record["perDay"] !== 0
  ) {
    costAmount = record["perDay"];
  } else if (
    (!record["perDay"] || record["perDay"] === 0) &&
    record["costPerKm"] &&
    record["costPerKm"] !== 0
  ) {
    costPer = record["costPerKm"];
    costAmount = (record["distance"] || 0) * costPer;
  }
  let amountPre =
    costAmount + (record["overNightCost"] || 0) + (record["Highway"] || 0);
  let diss = 0;
  if (discountType === "cash") {
    diss = record["discount"] || 0;
  } else {
    diss = (amountPre * parseFloat(record["discountByPercentage"] || 0)) / 100;
  }
  let amount = amountPre - diss;
  return amount;
};

const Bottom = ({
  tabId,
  tripId,
  schema,
  organizationId,
  initialDataSource,
  setBottomInitialDataSource,
  detailDataSource,
  setBottomDetailDataSource,
  setBottomConfig,
  initialErrors,
  detailErrors,
  setBottomDetailErrors,
  validateSeats,
}) => {
  let arrNotEnoughSeat = validateSeats.filter((x) => x.get("notEnoughSeat"));
  const [openDialog, setOpenDialog] = useState(false);
  const [innerTabId, setInnerTabId] = useState("2.1");
  const _handleChangeDateInOut = useCallback(
    (dates) => {
      if (dates[0] && dates[1]) {
        let dateIn = dates[0].startOf("day").clone();
        let dateOut = dates[1].endOf("day").clone();
        let initData = _generateInitData({
          dateIn: dateIn,
          dateOut: dateOut,
          initial: initialDataSource.get("initial"),
        });
        setBottomInitialDataSource((prevState) => {
          let nextState = prevState;
          nextState = nextState.set("dateIn", dates[0].startOf("day"));
          nextState = nextState.set("dateOut", dates[1].endOf("day"));
          nextState = nextState.set("initial", initData);
          return nextState;
        });
      } else {
        setBottomInitialDataSource((prevState) => {
          let nextState = prevState;
          nextState = nextState.set("dateIn", undefined);
          nextState = nextState.set("dateOut", undefined);
          nextState = nextState.set("initial", List([]));
          return nextState;
        });
      }
    },
    [initialDataSource, setBottomInitialDataSource]
  );
  const _toDetail = useCallback(() => {
    schema
      .validate(
        {
          dateIn: initialDataSource.get("dateIn"),
          dateOut: initialDataSource.get("dateOut"),
          initial: initialDataSource.get("initial").toJS(),
        },
        { abortEarly: false }
      )
      .then((result) => {
        let keysInA = [];
        let dateIn = checkMoment(result.dateIn);
        let dateOut = checkMoment(result.dateOut);
        let numberOfDays = dateOut.diff(dateIn, "days") + 1;

        setBottomDetailDataSource((prevState) => {
          let nextState = prevState;

          _.forEach(result.initial, (i) => {
            _.forEach(i.requireVehicleTypes, (vhType) => {
              let tripDate = checkMoment(i.tripDate);
              let tempHash = hash(
                {
                  rowKey: i.rowKey,
                  itemKey: vhType.itemKey,
                },
                { algorithm: "md5", encoding: "base64" }
              );
              keysInA.push(tempHash);
              let isAInB = prevState.getIn(["detail", tempHash]);
              if (isAInB && isAInB.get("key")) {
                let detailDate = checkMoment(
                  prevState.getIn(["detail", tempHash, "pickUpAt"])
                );
                let isSameDate = detailDate.isSame(tripDate, "day");
                let mergeObj = {
                  vehicleTypeId: vhType.requireVehicleTypeId,
                  requireVehiclesTypeName: vhType.requireVehicleTypeName,
                  requireVehiclesTypeSeats: vhType.requireVehicleTypeSeats,
                  fixedRoutesId: i.fixedRoutesId,
                  fixedRoutesName: i.fixedRoutesName,
                  fixedRoutesCode: i.fixedRoutesCode,

                  distance: vhType.distance,
                  vehicleNumber: vhType.vehicleNumber,
                  perDay: vhType.perDay,
                  costPerKm: vhType.costPerKm,
                  overNightCost: vhType.hasOverNightCost
                    ? vhType.overNightCost || 0
                    : 0,
                  Highway: vhType.hasHighway ? vhType.highway || 0 : 0,

                  partnersPerDay: 0,
                  partnersCostPerKm: 0,
                  partnersOverNightCost: 0,
                  partnersHighway: 0,

                  partnersDiscount: 0,
                  partnersDiscountByPercentage: 0,

                  partnersAmount: 0,
                };
                if (!isSameDate) {
                  mergeObj = {
                    ...mergeObj,
                    vehicleNumber: vhType.vehicleNumber,
                    pickUpAt: tripDate
                      ? clone(tripDate).startOf("day")
                      : undefined,
                    dropOffAt: tripDate
                      ? clone(tripDate).endOf("day")
                      : undefined,
                  };
                }
                _.map(_.keysIn(mergeObj), (mergeKey) => {
                  nextState = nextState.setIn(
                    ["detail", tempHash, mergeKey],
                    mergeObj[mergeKey]
                  );
                });
              } else {
                let tempObj = {
                  key: tempHash,
                  isOneWay: i.isOneWay,
                  vehicleTypeId: vhType.requireVehicleTypeId,
                  requireVehiclesTypeName: vhType.requireVehicleTypeName,
                  requireVehiclesTypeSeats: vhType.requireVehicleTypeSeats,

                  actualVehiclesTypeId: null,
                  actualVehiclesTypeName: null,
                  actualVehiclesTypeSeats: null,

                  vehicleNumber: vhType.vehicleNumber,
                  pickUpAt: tripDate
                    ? clone(tripDate).startOf("day").format()
                    : undefined,
                  dropOffAt: tripDate
                    ? clone(tripDate).endOf("day").format()
                    : undefined,

                  fixedRoutesId: i.fixedRoutesId,
                  fixedRoutesName: i.fixedRoutesName,
                  fixedRoutesCode: i.fixedRoutesCode,

                  distance: vhType.distance,
                  guideInfo: List(),
                  points: List(),

                  stewardessUuid: "",
                  stewardessName: "",

                  vehicleCode: "",
                  vehicleTime: null,

                  timePickup: null,

                  perDay: vhType.perDay,
                  costPerKm: vhType.costPerKm,
                  overNightCost: vhType.hasOverNightCost
                    ? vhType.overNightCost
                    : 0,
                  Highway: vhType.hasHighway ? vhType.highway : 0,

                  partnersPerDay: 0,
                  partnersCostPerKm: 0,
                  partnersOverNightCost: 0,
                  partnersHighway: 0,

                  discount: 0,
                  discountByPercentage: 0,

                  partnersDiscount: 0,
                  partnersDiscountByPercentage: 0,

                  locationPickup: "",
                  locationPickupId: "",
                  location: null,

                  routeNote: "",
                  amount: 0,
                  partnersAmount: 0,
                };
                _.forEach(_.keysIn(tempObj), (mergeKey) => {
                  nextState = nextState.setIn(
                    ["detail", tempHash, mergeKey],
                    tempObj[mergeKey]
                  );
                });
              }
              nextState = nextState.setIn(
                ["detail", tempHash, "amount"],
                calculateAmountPriceRow(
                  nextState.getIn(["detail", tempHash]).toJS()
                )
              );
            });
          });
          let [...keysInB] = nextState.getIn(["detail"]).keys();
          let subKeys = keysInB.filter((x) => !keysInA.includes(x));
          nextState = nextState.update("detail", (x) => {
            let diff = _.difference(keysInB, subKeys);
            x = x.filter((v, k) => diff.includes(k));
            return x;
          });
          let totalDistance = _.map(
            nextState.get("detail").toJS(),
            (x) => x
          ).reduce((total, nextValue) => {
            return nextValue["distance"]
              ? total + nextValue["distance"]
              : total;
          }, 0);
          let totalCost = _.map(
            nextState.get("detail").toJS(),
            (x) => x
          ).reduce((total, nextValue) => {
            return nextValue["amount"]
              ? total + parseFloat(nextValue["amount"])
              : total;
          }, 0);
          let partnersTotalDistance = _.map(
            nextState.get("detail").toJS(),
            (x) => x
          ).reduce((total, nextValue) => {
            return nextValue["partnersDistance"]
              ? total + nextValue["partnersDistance"]
              : total;
          }, 0);
          let partnersTotalCost = _.map(
            nextState.get("detail").toJS(),
            (x) => x
          ).reduce((total, nextValue) => {
            return nextValue["partnersAmount"]
              ? total + parseFloat(nextValue["partnersAmount"])
              : total;
          }, 0);
          Ui.showSuccess({
            message: "Khởi tạo thành công.",
          });
          console.log(nextState.get("detail").toJS());
          let orderedDetail = _.orderBy(
            _.map(nextState.get("detail").toJS(), (x) => x),
            ["vehicleNumber", "pickUpAt"],
            ["asc", "asc"]
          );
          nextState = nextState.update("detail",x=>x.clear());

          _.map(orderedDetail, (x) => {
            nextState = nextState.setIn(["detail", x.key], fromJS(x));
          });
          nextState = nextState.set("totalDistance", totalDistance);
          nextState = nextState.set("totalDays", numberOfDays);
          nextState = nextState.set("totalCost", totalCost);
          nextState = nextState.set(
            "partnersTotalDistance",
            partnersTotalDistance
          );
          nextState = nextState.set("partnersTotalCost", partnersTotalCost);
          return nextState;
        });
        setBottomConfig((prevState) => {
          let nextState = prevState;
          nextState = nextState.set("tabId", "2");
          nextState = nextState.set("status", "3");
          return nextState;
        });
      })
      .catch(() => {
        Ui.showError({
          message: "Dữ liệu khởi tạo không đúng.",
        });
      });
  }, [initialDataSource, schema, setBottomConfig, setBottomDetailDataSource]);

  const _handleChangeTab = useCallback(
    (payload) => {
      setBottomConfig((prevState) => {
        let nextState = prevState;
        nextState = nextState.set("tabId", payload.tabId);
        nextState = nextState.set("status", 0);
        return nextState;
      });
      setBottomInitialDataSource((prevState) => {
        let nextState = prevState;
        if (payload.tabId === "1") {
          _.forEach(prevState.get("initial").toJS(), (i, iIndex) => {
            _.forEach(i.requireVehicleTypes, (vhType, vhTypeIndex) => {
              let tempHash = hash(
                {
                  rowKey: i.rowKey,
                  itemKey: vhType.itemKey,
                },
                { algorithm: "md5", encoding: "base64" }
              );
              let objectInB = detailDataSource.getIn(["detail", tempHash]);

              nextState = nextState.update("initial", (x) => {
                x = x.setIn(
                  [iIndex, "requireVehicleTypes", vhTypeIndex, "distance"],
                  !(
                    _.isNull(objectInB.get("distance")) &&
                    _.isUndefined(objectInB.get("distance"))
                  ) && objectInB.get("distance") > 0
                    ? objectInB.get("distance")
                    : x.getIn([
                        iIndex,
                        "requireVehicleTypes",
                        vhTypeIndex,
                        "distance",
                      ])
                );
                x = x.setIn(
                  [iIndex, "requireVehicleTypes", vhTypeIndex, "perDay"],
                  !(
                    _.isNull(objectInB.get("perDay")) &&
                    _.isUndefined(objectInB.get("perDay"))
                  ) && objectInB.get("perDay") > 0
                    ? objectInB.get("perDay")
                    : x.getIn([
                        iIndex,
                        "requireVehicleTypes",
                        vhTypeIndex,
                        "perDay",
                      ])
                );
                x = x.setIn(
                  [iIndex, "requireVehicleTypes", vhTypeIndex, "costPerKm"],
                  !(
                    _.isNull(objectInB.get("costPerKm")) &&
                    _.isUndefined(objectInB.get("costPerKm"))
                  ) && objectInB.get("costPerKm") > 0
                    ? objectInB.get("costPerKm")
                    : x.getIn([
                        iIndex,
                        "requireVehicleTypes",
                        vhTypeIndex,
                        "costPerKm",
                      ])
                );
                x = x.setIn(
                  [iIndex, "requireVehicleTypes", vhTypeIndex, "overNightCost"],
                  !(
                    _.isNull(objectInB.get("overNightCost")) &&
                    _.isUndefined(objectInB.get("overNightCost"))
                  ) && objectInB.get("overNightCost") > 0
                    ? objectInB.get("overNightCost")
                    : x.getIn([
                        iIndex,
                        "requireVehicleTypes",
                        vhTypeIndex,
                        "overNightCost",
                      ])
                );
                x = x.setIn(
                  [
                    iIndex,
                    "requireVehicleTypes",
                    vhTypeIndex,
                    "hasOverNightCost",
                  ],
                  !(
                    _.isNull(objectInB.get("overNightCost")) &&
                    _.isUndefined(objectInB.get("overNightCost"))
                  ) && objectInB.get("overNightCost") > 0
                    ? true
                    : false
                );

                x = x = x.setIn(
                  [iIndex, "requireVehicleTypes", vhTypeIndex, "hasHighway˝"],
                  !(
                    _.isNull(objectInB.get("Highway")) &&
                    _.isUndefined(objectInB.get("Highway"))
                  ) && objectInB.get("Highway") > 0
                    ? true
                    : false
                );

                x = x.setIn(
                  [iIndex, "requireVehicleTypes", vhTypeIndex, "highway"],
                  !(
                    _.isNull(objectInB.get("Highway")) &&
                    _.isUndefined(objectInB.get("Highway"))
                  ) && objectInB.get("Highway") > 0
                    ? objectInB.get("Highway")
                    : x.getIn([
                        iIndex,
                        "requireVehicleTypes",
                        vhTypeIndex,
                        "highway",
                      ])
                );
                return x;
              });
            });
          });
        }

        return nextState;
      });
    },
    [detailDataSource, setBottomConfig, setBottomInitialDataSource]
  );
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <h4>
          <i className="fa fa-calendar-alt" />
          &nbsp; THÔNG TIN LỊCH TRÌNH
        </h4>
      </Grid>
      <Grid item xs={12}>
        <Paper variant="outlined" square>
          <Portlet id="bookingInfoBottom__Portlet" className="mb-0">
            <PortletHead>
              <div className="kt-portlet__head-label">
                <div className="kt-portlet__head-title">
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <label>
                        Ngày In/Out
                        <span className="ml-2 mark-required-color">*</span>
                      </label>
                    </Grid>
                    <Grid item xs={8}>
                      <RangePicker
                        format="DD-MM-YYYY"
                        disabled={tabId === "2" || !organizationId}
                        className={classNames({
                          "border-invalid":
                            initialErrors.get("dateIn") ||
                            initialErrors.get("dateOut"),
                        })}
                        value={
                          checkMoment(initialDataSource.get("dateIn")) &&
                          checkMoment(initialDataSource.get("dateOut"))
                            ? [
                                checkMoment(initialDataSource.get("dateIn")),
                                checkMoment(initialDataSource.get("dateOut")),
                              ]
                            : undefined
                        }
                        onChange={_handleChangeDateInOut}
                        ranges={momentRange}
                      />
                    </Grid>
                  </Grid>
                </div>
              </div>
            </PortletHead>
            <PortletBody className="p-0">
              <Tabs
                activeKey={tabId}
                type="card"
                tabBarExtraContent={
                  _.isString(initialErrors.get("initial")) ? (
                    <span className="kt-font-danger kt-font-bold mr-3">
                      {initialErrors.get("initial")}
                    </span>
                  ) : null
                }
                onChange={(tabId) => {
                  Modal.confirm({
                    title: "Xác nhận chuyển về khởi tạo lịch trình ?",
                    content: "",
                    okText: "Xác nhận",
                    cancelText: "Hủy",
                    onOk: () => {
                      _handleChangeTab({ tabId: tabId });
                    },
                    okButtonProps: {
                      type: "danger",
                    },
                  });
                }}
                defaultActiveKey="1"
              >
                <Tabs.TabPane
                  tab={<DrawerTabPane tabName="Khởi tạo" icon="fa fa-edit" />}
                  key="1"
                >
                  {tabId === "1" && organizationId && (
                    <InitialTable
                      errors={initialErrors}
                      validateSeats={validateSeats}
                      organizationId={organizationId}
                      grid={initialDataSource.get("initial")}
                      dateIn={initialDataSource.get("dateIn")}
                      dateOut={initialDataSource.get("dateOut")}
                      setBottomInitialDataSource={setBottomInitialDataSource}
                    />
                  )}
                  <PortletFoot className="pt-1 pb-1" style={{ paddingLeft: 8 }}>
                    <button
                      disabled={!organizationId}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          validateSeats.size > 0 &&
                          arrNotEnoughSeat.size > 0
                        ) {
                          setOpenDialog(true);
                        } else {
                          _toDetail();
                        }
                      }}
                      className="btn btn-brand btn-icon-sm"
                    >
                      <i className="flaticon2-right-arrow" />
                      Tiếp tục
                    </button>
                  </PortletFoot>
                </Tabs.TabPane>
                <Tabs.TabPane
                  disabled={tabId === "1"}
                  tab={
                    <DrawerTabPane
                      tabName="Chi tiết"
                      icon="fa fa-list"
                      disabled={tabId === "1"}
                    />
                  }
                  key="2"
                >
                  <Tabs
                    className="customTab"
                    renderTabBar={(props, DefaultTabBar) => {
                      return <DefaultTabBar {...props} />;
                    }}
                    tabBarStyle={{ width: 60 }}
                    onChange={setInnerTabId}
                    tabPosition="left"
                  >
                    <Tabs.TabPane
                      tab={<DrawerTabPane tabName="Lái xe" />}
                      key="2.1"
                    >
                      {tabId === "2" &&
                        innerTabId === "2.1" &&
                        Map.isMap(detailDataSource.get("detail")) && (
                          <DetailDriverTable
                            tripId={tripId}
                            setBottomDetailDataSource={
                              setBottomDetailDataSource
                            }
                            errors={detailErrors}
                            setBottomDetailErrors={setBottomDetailErrors}
                            grid={detailDataSource.get("detail")}
                            totalCost={detailDataSource.get("totalCost")}
                            totalDistance={detailDataSource.get(
                              "totalDistance"
                            )}
                            totalDays={detailDataSource.get("totalDays")}
                          />
                        )}
                    </Tabs.TabPane>
                    <Tabs.TabPane
                      tab={<DrawerTabPane tabName="CTV" />}
                      key="2.2"
                    >
                      {tabId === "2" &&
                        innerTabId === "2.2" &&
                        Map.isMap(detailDataSource.get("detail")) && (
                          <DetailPartnerTable
                            tripId={tripId}
                            grid={detailDataSource.get("detail")}
                            setBottomDetailDataSource={
                              setBottomDetailDataSource
                            }
                            partnersTotalCost={detailDataSource.get(
                              "partnersTotalCost"
                            )}
                            partnersTotalDistance={detailDataSource.get(
                              "partnersTotalDistance"
                            )}
                            totalDays={detailDataSource.get("totalDays")}
                          />
                        )}
                    </Tabs.TabPane>
                  </Tabs>
                </Tabs.TabPane>
              </Tabs>
            </PortletBody>
          </Portlet>
        </Paper>
      </Grid>
      <ConfirmSeatsDialog
        open={openDialog}
        validateSeats={validateSeats}
        onDisagree={() => setOpenDialog(false)}
        onConfirm={() => {
          setOpenDialog(false);
          _toDetail();
        }}
      />
    </Grid>
  );
};
export default memo(Bottom);
