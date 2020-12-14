import React from "react";
import _ from "lodash";
import Table from "react-bootstrap/Table";
import { Ui } from "@Helpers/Ui";
import * as Yup from "yup";
import { withStyles } from "@material-ui/core/styles";
import { Map, fromJS } from "immutable";
import DetailDriverTableHead from "./Head";
import DetailDriverTableBody from "./Body";
import ServiceBase from "@Services/ServiceBase";
import DetailDriverTableFoot from "./Foot";
import { Paper } from "@material-ui/core";
import { phoneNumberRegex, timeFormatRegex, checkMoment } from "helpers/utility";

export const columns = {
  stt: {
    name: "stt",
    title: "#",
    style: {
      minWidth: 50,
      maxWidth: 50
    }
  },
  vehicleTypeId: {
    name: "vehicleTypeId",
    title: "LOẠI XE YÊU CẦU",
    style: { minWidth: 220 }
  },

  vehicleNumber: {
    name: "vehicleNumber",
    title: "XE SỐ",
    style: { minWidth: 80 }
  },
  vehicleCode: {
    name: "vehicleCode",
    title: "MÃ CHUYẾN BAY/TÀU",
    style: {
      minWidth: 200
    }
  },
  vehicleTime: {
    name: "vehicleTime",
    title: "GIỜ ĐI/ĐẾN",
    style: {
      minWidth: 95
    }
  },
  tripDate: {
    name: "tripDate",
    title: "NGÀY",
    style: { width: 200 }
  },
  fixedRoutesId: {
    name: "fixedRoutesId",
    title: "TUYẾN ĐƯỜNG"
    // style: { minWidth: 200 }
  },
  distance: {
    name: "distance",
    title: "KM",
    style: {
      minWidth: 80
    }
  },
  costPerKm: {
    name: "costPerKm",
    title: "ĐƠN GIÁ (KM)",
    style: {
      minWidth: 120
    }
  },
  perDay: {
    name: "perDay",
    title: "ĐƠN GIÁ (NGÀY)",
    style: {
      minWidth: 130
    }
  },
  overNightCost: {
    name: "overNightCost",
    title: "LƯU ĐÊM (VND)",
    style: {
      minWidth: 120
    }
  },
  Highway: {
    name: "Highway",
    title: "CAO TỐC (VND)",
    style: {
      minWidth: 130
    }
  },
  discount: {
    name: "discount",
    title: "GIẢM GIÁ (VND)",
    style: {
      minWidth: 130
    }
  },
  discountByPercentage: {
    name: "discountByPercentage",
    title: "GIẢM GIÁ (%)",
    style: {
      minWidth: 120
    }
  },
  vehicleId: {
    name: "vehicleId",
    title: "BIỂN SỐ",
    style: {
      minWidth: 120
    }
  },
  driverId: {
    name: "driverId",
    title: "LÁI XE",
    style: {
      minWidth: 120
    }
  },
  stewardessUuid: {
    name: "stewardessUuid",
    title: "TIẾP VIÊN",
    style: {
      minWidth: 200
    }
  },
  guideInfo: {
    name: "guideInfo",
    title: "HƯỚNG DẪN VIÊN",
    style: {
      minWidth: 150
    }
  },

  locationPickup: {
    name: "locationPickup",
    title: "ĐỊA ĐIỂM ĐÓN KHÁCH",
    style: {
      minWidth: 150
    }
  },
  timePickup: {
    name: "timePickup",
    title: "GIỜ ĐÓN KHÁCH",
    style: {
      minWidth: 140
    }
  },
  isOneWay: {
    name: "isOneWay",
    title: "LOẠI CHUYẾN",
    style: { minWidth: 120 }
  },
  actualVehiclesTypeId: {
    name: "actualVehiclesTypeId",
    title: "LOẠI XE THỰC TẾ",
    style: { minWidth: 220 }
  },
  routeNote: {
    name: "routeNote",
    title: "GHI CHÚ",
    style: {
      minWidth: 200
    }
  },
  amount: {
    name: "amount",
    title: "THÀNH TIỀN (VND)",
    style: {
      minWidth: 200,
      maxWidth: 200
    }
  }
};

class DetailDriverTable extends React.PureComponent {
  render() {
    const {
      props,
      _handleChangeTime,
      _handleChangeIsOneWay,
      _handleChangeAffectAmount,
      _handleChangeStewardess,
      _handleAddNewGuide,
      _handleDeleteGuide,
      _handleChangeGuideInfo,
      _handleCopyNextGuideInfo,
      _handleCopyAllGuideInfo,
      _handleChangeRestInput,
      _handleChangeLocationPickup,
      _handleChangeTimeArray
    } = this;
    const {
      grid,
      tripId,
      errors,
      totalCost,
      totalDistance,
      totalDays,
      setBottomDetailDataSource,
      classes
    } = props;
    return (
      <Paper classes={{ root: classes.paperRoot }}>
        <div className="zui-wrapper p-0">
          <div className="zui-scroller fixed-header">
            <Table hover className="mb-0">
              <DetailDriverTableHead columns={columns} />
              <DetailDriverTableBody
                grid={grid}
                tripId={tripId}
                columns={columns}
                errors={errors}
                setBottomDetailDataSource={setBottomDetailDataSource}
                handleChangeIsOneWay={_handleChangeIsOneWay}
                handleChangeTime={_handleChangeTime}
                handleChangeTimeArray={_handleChangeTimeArray}
                handleChangeAffectAmount={_handleChangeAffectAmount}
                handleChangeStewardess={_handleChangeStewardess}
                handleAddNewGuide={_handleAddNewGuide}
                handleDeleteGuide={_handleDeleteGuide}
                handleChangeGuideInfo={_handleChangeGuideInfo}
                handleCopyNextGuideInfo={_handleCopyNextGuideInfo}
                handleCopyAllGuideInfo={_handleCopyAllGuideInfo}
                handleChangeRestInput={_handleChangeRestInput}
                handleChangeLocationPickup={_handleChangeLocationPickup}
              />
              <DetailDriverTableFoot
                columns={columns}
                totalCost={totalCost}
                totalDistance={totalDistance}
                totalDays={totalDays}
              />
            </Table>
          </div>
        </div>
      </Paper>
    );
  }
  _handleChangeIsOneWay = ({ fieldValue, rowId }) => {
    this.props.setBottomDetailDataSource(prevState => {
      let nextState = prevState;
      nextState = nextState.setIn(["detail", rowId, "isOneWay"], fieldValue);
      return nextState;
    });
  };
  _handleChangeTime = ({ value, type, rowId, fieldValue, fieldName }) => {
    let fieldValueTemp = _.cloneDeep(fieldValue);
    if (fieldName === "pickUpAt") {
      if (type === "hour") {
        fieldValueTemp.set({
          hour: value,
          second: 0,
          millisecond: 0
        });
      } else {
        fieldValueTemp.set({
          minute: value,
          second: 0,
          millisecond: 0
        });
      }
    } else {
      if (type === "hour") {
        fieldValueTemp.set({
          hour: value,
          second: 59,
          millisecond: 999
        });
      } else {
        fieldValueTemp.set({
          minute: value,
          second: 59,
          millisecond: 999
        });
      }
    }
    let str = fieldValueTemp.format();
    this.props.setBottomDetailDataSource(prevState => {
      let nextState = prevState;
      nextState = nextState.setIn(["detail", rowId, fieldName], str);
      return nextState;
    });
  };
  _handleChangeTimeArray = ({ payload, rowId }) => {
    this.props.setBottomDetailDataSource(prevState => {
      let nextState = prevState;
      _.forEach(payload, pay => {
        let fieldValueTemp = _.cloneDeep(pay.fieldValue);
        if (pay.fieldName === "pickUpAt") {
          fieldValueTemp.set({
            hour: pay.hour,
            minute: pay.minute,
            second: 0,
            millisecond: 0
          });
        } else {
          fieldValueTemp.set({
            hour: pay.hour,
            minute: pay.minute,
            second: 59,
            millisecond: 999
          });
        }
        let str = fieldValueTemp.format();
        nextState = nextState.setIn(["detail", rowId, pay.fieldName], str);
      });
      return nextState;
    });
  };
  _handleChangeAffectAmount = _.debounce(payload => {
    let { setBottomDetailDataSource } = this.props;

    setBottomDetailDataSource(prevState => {
      let nextState = prevState;
      nextState = nextState.setIn(
        ["detail", payload.rowId, payload.name],
        payload.value
      );
      nextState = nextState.setIn(
        ["detail", payload.rowId, "amount"],
        this._calculateAmountPriceRow(
          nextState.getIn(["detail", payload.rowId]).toJS()
        )
      );
      let totalCost = _.map(nextState.get("detail").toJS(), x => x).reduce(
        (total, nextValue) => {
          return nextValue["amount"]
            ? total + parseFloat(nextValue["amount"])
            : total;
        },
        0
      );
      nextState = nextState.set("totalCost", totalCost);
      if (payload.name === "distance") {
        let totalDistance = _.map(
          nextState.get("detail").toJS(),
          x => x
        ).reduce((total, nextValue) => {
          return nextValue["distance"] ? total + nextValue["distance"] : total;
        }, 0);
        nextState = nextState.set("totalDistance", totalDistance);
      }
      return nextState;
    });
  }, 150);
  _calculateAmountPriceRow = record => {
    let discountType = "";
    if (
      (record["discount"] === 0 || !record["discount"]) &&
      record["discountByPercentage"] &&
      record["discountByPercentage"] !== 0
    ) {
      discountType = "percent";
    } else if (
      (record["discountByPercentage"] === 0 ||
        !record["discountByPercentage"]) &&
      record["discount"] !== 0 &&
      record["discount"]
    ) {
      discountType = "cash";
    }
    let costPer = 0;
    let costAmount = 0;

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
      diss =
        (amountPre * parseFloat(record["discountByPercentage"] || 0)) / 100;
    }
    let amount = amountPre - diss;
    return amount;
  };
  _handleChangeStewardess = ({ stewardess, rowId }) => {
    let { setBottomDetailDataSource } = this.props;
    setBottomDetailDataSource(prevState => {
      let nextState = prevState;
      nextState = nextState.setIn(
        ["detail", rowId, "stewardessUuid"],
        stewardess.key
      );
      nextState = nextState.setIn(
        ["detail", rowId, "stewardessName"],
        stewardess.label
      );
      return nextState;
    });
  };
  _handleAddNewGuide = ({ rowId }) => {
    let { setBottomDetailDataSource } = this.props;
    setBottomDetailDataSource(prevState => {
      let nextState = prevState;
      nextState = nextState.update("detail", x => {
        let newKey =
          x.getIn([rowId, "guideInfo"]).size === 0
            ? 0
            : x.getIn([rowId, "guideInfo"]).size;
        x = x.updateIn([rowId, "guideInfo"], y => {
          y = y.push(Map({ key: newKey }));
          return y;
        });
        return x;
      });
      return nextState;
    });
  };
  _handleDeleteGuide = ({ rowId, itemKey }) => {
    let { setBottomDetailDataSource } = this.props;
    setBottomDetailDataSource(prevState => {
      let nextState = prevState;
      nextState = nextState.update("detail", x => {
        x = x.updateIn([rowId, "guideInfo"], y => {
          y = y.filterNot(z => z.get("key") === itemKey);
          return y;
        });
        return x;
      });
      nextState = nextState.setIn(
        ["detail", rowId, "guideInfo"],
        nextState.getIn(["detail", rowId, "guideInfo"]).map((x, xId) => {
          x = x.set("key", xId);
          return x;
        })
      );
      return nextState;
    });

    // _.delay(() => {
    //   let errors = _.cloneDeep(this.props.errors);
    //   _.set(errors, `${rowId}.guideInfo["${itemKey}"].phone`, null);
    //   this.props.onSetErrors({
    //     prefix: "bottom.detail",
    //     fieldValue: errors
    //   });
    // }, 200);
  };
  guideInfoPhoneTimer = null;
  timeTimer = null;
  _handleChangeGuideInfo = async ({
    rowId,
    itemKey,
    fieldName,
    fieldValue
  }) => {
    let { setBottomDetailDataSource, setBottomDetailErrors } = this.props;
    setBottomDetailDataSource(prevState => {
      let nextState = prevState;
      nextState = nextState.setIn(
        ["detail", rowId, "guideInfo", itemKey, fieldName],
        fieldValue
      );
      return nextState;
    });

    if (fieldName === "phone") {
      if (this.guideInfoPhoneTimer) {
        clearTimeout(this.guideInfoPhoneTimer);
      }
      this.guideInfoPhoneTimer = setTimeout(async () => {
        let isValidPhone = await Yup.string()
          .matches(phoneNumberRegex, { excludeEmptyString: true })
          .isValid(fieldValue);

        setBottomDetailErrors(prev => {
          let next = prev;
          if (isValidPhone) {
            next = next.setIn([rowId, "guideInfo", itemKey, "phone"], null);
          } else {
            next = next.setIn(
              [rowId, "guideInfo", itemKey, "phone"],
              "invalid"
            );
          }
          return next;
        });
      }, 300);
    }
  };
  _handleCopyNextGuideInfo = ({ rowId, itemKey }) => {
    let { setBottomDetailDataSource } = this.props;
    setBottomDetailDataSource(prevState => {
      let nextState = prevState;
      let [...rowKeys] = nextState.get("detail").keys();
      let currentIndex = _.findIndex(rowKeys, x => x === rowId);
      let nextRow = nextState.getIn(["detail", rowKeys[currentIndex + 1]]);
      if (Map.isMap(nextRow)) {
        nextState = nextState.updateIn(
          ["detail", rowKeys[currentIndex + 1], "guideInfo"],
          x => {
            x = x.push(
              fromJS({
                ...prevState
                  .getIn(["detail", rowId, "guideInfo", itemKey])
                  .toJS(),
                key: prevState.getIn([
                  "detail",
                  rowKeys[currentIndex + 1],
                  "guideInfo"
                ]).size
              })
            );
            return x;
          }
        );
      } else {
        Ui.showWarning({ message: "Chưa có dòng dưới." });
      }
      return nextState;
    });
  };
  _handleCopyAllGuideInfo = ({ rowId, itemKey }) => {
    let { setBottomDetailDataSource } = this.props;
    setBottomDetailDataSource(prevState => {
      let nextState = prevState;
      let [...rowKeys] = nextState.get("detail").keys();
      let currentIndex = _.findIndex(rowKeys, x => x === rowId);
      _.forEach(rowKeys, (gKeys, gKeysIndex) => {
        if (gKeysIndex > currentIndex) {
          nextState = nextState.updateIn(
            ["detail", rowKeys[gKeysIndex], "guideInfo"],
            x => {
              x = x.push(
                fromJS({
                  ...prevState
                    .getIn(["detail", rowId, "guideInfo", itemKey])
                    .toJS(),
                  key: prevState.getIn(["detail", gKeys, "guideInfo"]).size
                })
              );
              return x;
            }
          );
        }
      });
      return nextState;
    });
  };

  _handleChangeRestInput = ({ rowId, value, name }) => {
    let { setBottomDetailDataSource, setBottomDetailErrors } = this.props;
    setBottomDetailDataSource(prevState => {
      let nextState = prevState;
      nextState = nextState.setIn(["detail", rowId, name], value);
      return nextState;
    });
    if (name === "vehicleTime" || name === "timePickup") {
      if (this.timeTimer) {
        clearTimeout(this.timeTimer);
      }
      this.timeTimer = setTimeout(async () => {
        let isValidPhone = await Yup.string()
          .nullable()
          .matches(timeFormatRegex, { excludeEmptyString: true })
          .isValid(value);

        setBottomDetailErrors(prev => {
          let next = prev;
          if (isValidPhone) {
            next = next.deleteIn([rowId, name]);
          } else {
            next = next.setIn([rowId, name], "invalid");
          }
          return next;
        });
      }, 500);
    }
  };
  _handleChangeLocationPickup = ({ rowId, place }) => {
    let { setBottomDetailDataSource } = this.props;
    setBottomDetailDataSource(prevState => {
      let nextState = prevState;
      nextState = nextState.setIn(
        ["detail", rowId, "locationPickup"],
        place ? place.label : ""
      );
      nextState = nextState.setIn(
        ["detail", rowId, "locationPickupId"],
        place ? place.key : ""
      );
      nextState = nextState.setIn(["detail", rowId, "location"], null);
      return nextState;
    });

    if (place && place.key) {
      _.delay(async () => {
        let result = await ServiceBase.requestJson({
          baseUrl: "https://place.havaz.vn/api",
          method: "GET",
          url: `/v1/places/${place.key}`,
          data: {
            api_token:
              "hmtvxAd5AQLAaUpjDGEqTZIj2DnR1dGBW7uugUG1gJyvsWVFzIh6n5It6RMk"
          }
        });
        if (result.hasErrors) {
          Ui.showErrors(result.errors);
        } else {
          setBottomDetailDataSource(prevState => {
            let nextState = prevState;
            nextState = nextState.setIn(
              ["detail", rowId, "location"],
              `${result.value.location.lat},${result.value.location.lng}`
            );
            return nextState;
          });
        }
      }, 100);
    }
  };
}
export default withStyles({
  paperRoot: {
    margin: "0.7rem"
  }
})(DetailDriverTable);
