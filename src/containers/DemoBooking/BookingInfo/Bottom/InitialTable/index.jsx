import React from "react";
import _ from "lodash";
import { hashByTimeStamp } from "@Helpers/utility";
import Table from "react-bootstrap/Table";
import { Ui } from "@Helpers/Ui";
import { withStyles } from "@material-ui/core/styles";
import InitialTableHead from "./Head";
import InitialTableBody from "./Body";
import { Paper } from "@material-ui/core";
import ServiceBase from "@Services/ServiceBase";
import { API_URI } from "@Constants";
import { Map, fromJS } from "immutable";
import { checkMoment } from "@Helpers/utility";

export const columns = {
  tripDate: {
    name: "tripDate",
    title: "NGÀY",
    style: {
      gridContainer: {
        display: "grid",
        gridGap: 10,
        gridAutoFlow: "column",
      },
      gridActionItem: {
        width: 14,
        justifyContent: "center",
        justifySelf: "center",
        alignSelf: "center",
      },
      col: {
        width: 200,
        paddingTop: 31.5,
      },
    },
  },
  fixedRoutesId: {
    name: "fixedRoutesId",
    title: "CHƯƠNG TRÌNH",
    style: {
      col: {
        minWidth: 120,
        paddingTop: 31.5,
      },
    },
  },
  requireVehicleTypeId: {
    name: "requireVehicleTypeId",
    title: "CHỌN XE",
    style: {
      gridRootContainer: {
        display: "grid",
        gridTemplateColumns: "auto",
        gridGap: 5,
      },
      gridVehicleContainer: {
        display: "grid",
        gridRow: 1,
        gridTemplateColumns: "25px auto 50px 80px 120px 120px 25px 25px 25px",
        gridGap: 10,
      },
      col: { minWidth: 750 },
    },
  },
  action: {
    name: "action",
    title: " ",
    style: {
      root: {
        flexDirection: "column",
      },
      col: {
        minWidth: 120,
        paddingTop: 31.5,
      },
    },
  },
};

class InitialTable extends React.PureComponent {
  render() {
    const {
      props,
      _handleChangeRoute,
      _handleChangeRequireVehilceType,
      _handleChangeTripDate,
      _handleCloneTrip,
      _handleDeleteRequireVehicleType,
      _handleCopyRequireVehicleTypeItem,
      _handleAddNextRequireVehicleTypeItem,
      _handleAddAllRequireVehicleTypeItem,
      _handleAddVehicleType,
      _handleDeleteTrip,
      _handleChangeVehicleNumber,
      _handleChangeDistance,
      _handleChangeOverNightCost,
      _handleChangeHighway,
    } = this;
    const {
      dateIn,
      dateOut,
      organizationId,
      grid,
      errors,
      validateSeats,
      classes,
    } = props;
    return (
      <Paper elevation={3} classes={{ root: classes.paperRoot }}>
        <div className="zui-wrapper p-0">
          <div className="zui-scroller fixed-header">
            <Table hover className="mb-0">
              <InitialTableHead columns={columns} />
              <InitialTableBody
                organizationId={organizationId}
                grid={grid}
                columns={columns}
                errors={errors}
                validateSeats={validateSeats}
                dateIn={dateIn}
                dateOut={dateOut}
                handleChangeRoute={_handleChangeRoute}
                handleCloneTrip={_handleCloneTrip}
                handleChangeTripDate={_handleChangeTripDate}
                handleDeleteRequireVehicleType={_handleDeleteRequireVehicleType}
                handleChangeRequireVehilceType={_handleChangeRequireVehilceType}
                handleCopyRequireVehicleTypeItem={
                  _handleCopyRequireVehicleTypeItem
                }
                handleAddNextRequireVehicleTypeItem={
                  _handleAddNextRequireVehicleTypeItem
                }
                handleAddAllRequireVehicleTypeItem={
                  _handleAddAllRequireVehicleTypeItem
                }
                handleAddVehicleType={_handleAddVehicleType}
                handleDeleteTrip={_handleDeleteTrip}
                handleChangeVehicleNumber={_handleChangeVehicleNumber}
                handleChangeDistance={_handleChangeDistance}
                handleChangeOverNightCost={_handleChangeOverNightCost}
                handleChangeHighway={_handleChangeHighway}
              />
            </Table>
          </div>
        </div>
      </Paper>
    );
  }

  _handleDeleteRequireVehicleType = ({ itemIndex, rowIndex }) => {
    let { setBottomInitialDataSource } = this.props;
    setBottomInitialDataSource((prevState) => {
      let nextState = prevState;
      nextState = nextState.updateIn(
        ["initial", rowIndex, "requireVehicleTypes"],
        (x) => x.delete(itemIndex)
      );
      return nextState;
    });
  };

  _handleAddVehicleType = ({ evt, rowIndex }) => {
    evt.preventDefault();
    let { setBottomInitialDataSource } = this.props;
    setBottomInitialDataSource((prevState) => {
      let nextState = prevState;
      nextState = nextState.updateIn(
        ["initial", rowIndex, "requireVehicleTypes"],
        (x) =>
          x.push(
            Map({
              itemKey: hashByTimeStamp(1),
              requireVehicleTypeId: null,
              requireVehicleTypeName: null,
            })
          )
      );
      return nextState;
    });
  };

  _handleCopyRequireVehicleTypeItem = ({ itemIndex, rowIndex }) => {
    let { setBottomInitialDataSource } = this.props;
    setBottomInitialDataSource((prevState) => {
      let nextState = prevState;
      nextState = nextState.updateIn(
        ["initial", rowIndex, "requireVehicleTypes"],
        (x) =>
          x.push(
            Map({
              ...x.get(itemIndex).toJS(),
              itemKey: hashByTimeStamp(1),
            })
          )
      );
      return nextState;
    });
  };
  _handleChangeRequireVehilceType = ({ rowIndex, itemIndex, vehicleType }) => {
    let { setBottomInitialDataSource } = this.props;
    setBottomInitialDataSource((prevState) => {
      let nextState = prevState;
      nextState = nextState.updateIn(
        ["initial", rowIndex, "requireVehicleTypes", itemIndex],
        (x) => {
          x = x.set("requireVehicleTypeId", vehicleType.key);
          x = x.set("requireVehicleTypeName", vehicleType.label);
          x = x.set("requireVehicleTypeSeats", vehicleType.seats || 0);
          x = x.set("distance", vehicleType.distance || 0);
          x = x.set("costPerKm", vehicleType.costPerKm || 0);
          x = x.set("perDay", vehicleType.perDay || 0);
          x = x.set("overNightCost", vehicleType.overNightCost || 0);
          x = x.set("highway", vehicleType.highway || 0);
          x = x.set("hasHighway", vehicleType.highway || false);
          x = x.set("hasOverNightCost", vehicleType.hasOverNightCost || false);
          return x;
        }
      );
      return nextState;
    });
  };

  _handleAddNextRequireVehicleTypeItem = async ({ rowIndex, itemIndex }) => {
    let { setBottomInitialDataSource } = this.props;

    setBottomInitialDataSource((prevState) => {
      let nextState = prevState;
      let nextRow = nextState.get("initial").get(rowIndex + 1);
      if (Map.isMap(nextRow)) {
        if (nextRow.get("fixedRoutesId")) {
          nextState = nextState.updateIn(
            ["initial", rowIndex + 1, "requireVehicleTypes"],
            (x) =>
              x.push(
                Map({
                  ...prevState
                    .get("initial")
                    .get(rowIndex)
                    .get("requireVehicleTypes")
                    .get(itemIndex)
                    .toJS(),
                  key: nextRow.get("requireVehicleTypes").size + 1,
                  itemKey: hashByTimeStamp(1),
                })
              )
          );

          if (
            nextRow.get("fixedRoutesId") !==
            nextState.getIn(["initial", rowIndex, "fixedRoutesId"])
          ) {
            ServiceBase.requestJson({
              url: API_URI.READ_ROUTE_BOOKING,
              method: "POST",
              data: {
                fixedRoutesId: nextRow.get("fixedRoutesId"),
                customerId: this.props.organizationId,
                filterDatetime: checkMoment(nextRow.get("tripDate")).format(),
                vehicleTypeId: nextState.getIn([
                  "initial",
                  rowIndex,
                  "requireVehicleTypes",
                  itemIndex,
                  "requireVehicleTypeId",
                ]),
              },
            }).then((result) => {
              if (result.hasErrors) {
                Ui.showErrors(result.errors);
              } else {
                let vehicleType = result.value.data;
                let mergeObj = {
                  distance: vehicleType.distance || undefined,
                  costPerKm: vehicleType.costPerKm || 0,
                  perDay: vehicleType.perDay || 0,
                  overNightCost: vehicleType.overNightCost || 0,
                  highway: vehicleType.highway || 0,
                  hasHighway: vehicleType.hasHighway || false,
                  hasOverNightCost: vehicleType.hasOverNightCost || false,
                };
                setBottomInitialDataSource((prev) => {
                  let next = prev;
                  next = next.updateIn(
                    [
                      "initial",
                      rowIndex + 1,
                      "requireVehicleTypes",
                      next.getIn([
                        "initial",
                        rowIndex + 1,
                        "requireVehicleTypes",
                      ]).size - 1,
                    ],
                    (x) => {
                      _.forIn(mergeObj, (value, key) => {
                        x = x.set(key, mergeObj[key]);
                      });
                      return x;
                    }
                  );
                  return next;
                });
              }
            });
          }
        }
      } else {
        Ui.showWarning({ message: "Chưa có dòng dưới." });
      }
      return nextState;
    });
  };

  _handleAddAllRequireVehicleTypeItem = ({ rowIndex, itemIndex }) => {
    let needToCall = [];
    let { setBottomInitialDataSource } = this.props;
    setBottomInitialDataSource((prevState) => {
      let nextState = prevState;
      nextState = nextState.update("initial", (x) =>
        x.map((dr, drId) => {
          if (drId > rowIndex && dr.get("fixedRoutesId")) {
            if (
              dr.get("fixedRoutesId") !==
              prevState.get("initial").get(rowIndex).get("fixedRoutesId")
            ) {
              needToCall.push({
                rowInfo: {
                  rowIndex: drId,
                },
                filterDatetime: dr.get("tripDate"),
                fixedRoutesId: dr.get("fixedRoutesId"),
                requireVehicleTypeId: prevState.getIn([
                  "initial",
                  rowIndex,
                  "requireVehicleTypes",
                  itemIndex,
                  "requireVehicleTypeId",
                ]),
              });
            }
            dr = dr.update("requireVehicleTypes", (x) => {
              x = x.push(
                Map({
                  ...nextState
                    .get("initial")
                    .get(rowIndex)
                    .get("requireVehicleTypes")
                    .get(itemIndex)
                    .toJS(),
                  itemKey: hashByTimeStamp(drId),
                })
              );
              return x;
            });
          }
          return dr;
        })
      );
      Promise.all(
        _.map(needToCall, (need) => {
          return ServiceBase.requestJson({
            url: API_URI.READ_ROUTE_BOOKING,
            method: "POST",
            data: {
              rowInfo: need.rowInfo,
              fixedRoutesId: need.fixedRoutesId,
              customerId: this.props.organizationId,
              filterDatetime: need.filterDatetime,
              vehicleTypeId: need.requireVehicleTypeId,
            },
          });
        })
      )
        .then((data) => {
          setBottomInitialDataSource((prevState) => {
            let nextState = prevState;
            nextState = nextState.update("initial", (x) => {
              _.forEach(data, (dt) => {
                let vehicle = dt.value.data;
                let insertId = vehicle.rowInfo.rowIndex;
                let mergeObj = {
                  distance: vehicle.distance || undefined,
                  costPerKm: vehicle.costPerKm || 0,
                  perDay: vehicle.perDay || 0,
                  overNightCost: vehicle.overNightCost || 0,
                  highway: vehicle.highway || 0,
                  hasHighway: vehicle.hasHighway || false,
                  hasOverNightCost: vehicle.hasOverNightCost || false,
                };
                x = x.updateIn(
                  [
                    insertId,
                    "requireVehicleTypes",
                    x.getIn([insertId, "requireVehicleTypes"]).size - 1,
                  ],
                  (y) => {
                    _.forIn(mergeObj, (value, key) => {
                      y = y.set(key, mergeObj[key]);
                    });
                    return y;
                  }
                );
              });
              return x;
            });
            return nextState;
          });
        })

        .catch((err) => {
          Ui.showErrors(err.message);
        });
      return nextState;
    });
  };

  // ĐÃ sửa
  _handleCloneTrip = ({ evt, type, rowIndex }) => {
    evt.preventDefault();

    let { setBottomInitialDataSource } = this.props;
    setBottomInitialDataSource((prevState) => {
      let nextState = prevState;
      if (type === "down") {
        nextState = nextState.update("initial", (x) =>
          x.push(
            fromJS({ ...x.get(rowIndex).toJS(), rowKey: hashByTimeStamp(1) })
          )
        );
      } else {
        nextState = nextState.update("initial", (x) => {
          x = x.insert(
            rowIndex,
            fromJS({ ...x.get(rowIndex).toJS(), rowKey: hashByTimeStamp(1) })
          );
          return x;
        });
      }
      return nextState;
    });
  };
  _handleChangeTripDate = ({ date, rowIndex }) => {
    let { setBottomInitialDataSource } = this.props;
    setBottomInitialDataSource((prevState) => {
      let nextState = prevState;
      nextState = nextState.updateIn(["initial", rowIndex], (x) => {
        x = x.set("tripDate", date ? date.startOf("day") : undefined);
        return x;
      });
      return nextState;
    });
  };
  _handleChangeRoute = ({ route, data, rowIndex }) => {
    let { setBottomInitialDataSource } = this.props;
    setBottomInitialDataSource((prevState) => {
      let nextState = prevState;
      nextState = nextState.updateIn(["initial", rowIndex], (x) => {
        x = x.set("fixedRoutesId", route ? route.key : undefined);
        x = x.set("fixedRoutesName", route ? route.label : undefined);
        x = x.set("fixedRoutesCode", data ? data.code : undefined);
        return x;
      });

      let requireVehicleTypes = nextState
        .get("initial")
        .get(rowIndex)
        .get("requireVehicleTypes")
        .filter((x) => x.get("requireVehicleTypeId"));
      if (requireVehicleTypes.size > 0 && route && route.key) {
        Promise.all(
          requireVehicleTypes.map((rq) => {
            let itemIndex = nextState
              .get("initial")
              .get(rowIndex)
              .get("requireVehicleTypes")
              .findIndex((re) => re.get("itemKey") === rq.get("itemKey"));
            return ServiceBase.requestJson({
              url: API_URI.READ_ROUTE_BOOKING,
              method: "POST",
              data: {
                rowInfo: { itemIndex: itemIndex },
                fixedRoutesId: nextState
                  .get("initial")
                  .get(rowIndex)
                  .get("fixedRoutesId"),
                customerId: this.props.organizationId,
                filterDatetime: nextState
                  .get("initial")
                  .get(rowIndex)
                  .get("tripDate"),
                vehicleTypeId: rq.get("requireVehicleTypeId"),
              },
            });
          })
        )
          .then((data) => {
            setBottomInitialDataSource((prev) => {
              let next = prev;
              _.forEach(data, (dt) => {
                let vehicle = dt.value.data;
                let mergeObj = {
                  distance: vehicle.distance || undefined,
                  costPerKm: vehicle.costPerKm || 0,
                  perDay: vehicle.perDay || 0,
                  overNightCost: dt.overNightCost || 0,
                  highway: vehicle.highway || 0,
                  hasHighway: vehicle.hasHighway || false,
                  hasOverNightCost: vehicle.hasOverNightCost || false,
                };
                next = next.updateIn(
                  [
                    "initial",
                    rowIndex,
                    "requireVehicleTypes",
                    vehicle.rowInfo.itemIndex,
                  ],
                  (x) => {
                    _.forIn(mergeObj, (value, key) => {
                      x = x.set(key, mergeObj[key]);
                    });
                    return x;
                  }
                );
              });
              return next;
            });
          })
          .catch((err) => {
            Ui.showErrors(err.message);
          });
      }
      return nextState;
    });
  };
  _handleDeleteTrip = ({ evt, rowIndex }) => {
    evt.preventDefault();
    let { setBottomInitialDataSource } = this.props;
    setBottomInitialDataSource((prevState) => {
      let nextState = prevState;
      nextState = nextState.update("initial", (x) => x.delete(rowIndex));
      if (nextState.get("initial").size === 0) {
        nextState = nextState.set("dateIn", undefined);
        nextState = nextState.set("dateOut", undefined);
      }
      return nextState;
    });
  };
  _handleChangeHighway = ({ rowIndex, itemIndex, hasHighway }) => {
    let { setBottomInitialDataSource } = this.props;
    setBottomInitialDataSource((prevState) => {
      let nextState = prevState;
      nextState = nextState.updateIn(
        ["initial", rowIndex, "requireVehicleTypes", itemIndex],
        (x) => {
          x = x.set("hasHighway", hasHighway);
          return x;
        }
      );
      return nextState;
    });
  };
  _handleChangeOverNightCost = ({ rowIndex, itemIndex, hasOverNightCost }) => {
    let { setBottomInitialDataSource } = this.props;
    setBottomInitialDataSource((prevState) => {
      let nextState = prevState;
      nextState = nextState.updateIn(
        ["initial", rowIndex, "requireVehicleTypes", itemIndex],
        (x) => {
          x = x.set("hasOverNightCost", hasOverNightCost);
          return x;
        }
      );
      return nextState;
    });
  };

  _handleChangeDistance = ({ rowIndex, itemIndex, distance }) => {
    let { setBottomInitialDataSource } = this.props;
    setBottomInitialDataSource((prevState) => {
      let nextState = prevState;
      nextState = nextState.updateIn(
        ["initial", rowIndex, "requireVehicleTypes", itemIndex],
        (x) => {
          x = x.set("distance", distance);
          return x;
        }
      );
      return nextState;
    });
  };
  _handleChangeVehicleNumber = ({ rowIndex, itemIndex, vehicleNumber }) => {
    let { setBottomInitialDataSource } = this.props;
    setBottomInitialDataSource((prevState) => {
      let nextState = prevState;
      nextState = nextState.updateIn(
        ["initial", rowIndex, "requireVehicleTypes", itemIndex],
        (x) => {
          x = x.set("vehicleNumber", vehicleNumber);
          return x;
        }
      );
      return nextState;
    });
  };
}
export default withStyles({
  paperRoot: {
    margin: "0.7rem",
  },
})(InitialTable);
