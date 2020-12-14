import React, { useEffect, useState, useCallback } from "react";
import BookingStepper from "@Components/Modals/DemoBooking/BookingStepper";
import { Spin } from "antd";
import * as Yup from "yup";
import styled from "styled-components";
import Top from "./Top";
import Bottom from "./Bottom";
import ChangeStatusModal from "./ChangeStatusModal";
import BookingInfoAction from "./Action";
import { debounce, getCurrentStep } from "@Helpers/utility";
import ServiceBase from "@Services/ServiceBase";
import { URI } from "@Containers/DemoBooking/constants";
import _ from "lodash";
import { Map, List, fromJS, OrderedMap } from "immutable";
import { Ui } from "@Helpers/Ui";
import { hashByTimeStamp, convertArrayToObject } from "@Helpers/utility";
import hash from "object-hash";
import { Grid } from "@material-ui/core";
import {
  checkMoment,
  phoneNumberRegex,
  phoneNumber8DigitRegex,
} from "helpers/utility";
import { DATE_TIME_FORMAT } from "@Constants/common";

const steps = [
  "Tạo mới",
  "Chờ xác nhận",
  "Đã xác nhận",
  "Đã thanh toán",
  "Đã chuyển điều phối",
  "Đã báo giá",
  "Đã hoàn thành",
  "Hủy",
];

const _convertToFormData = (dataSource) => {
  let bookingInfoTop = _.pick(dataSource, [
    "uuid",
    "ownerId",
    "organizationId",
    "additionalCost",
    "totalDistance",
    "totalDays",
    "totalCost",
    "status",
    "discountId",
    "discountValue",
    "contactId",
    "code",
    "typeOfService",
    "nameCountry",
    "guideName",
    "guidePhone",
    "note",
    "contactAddress",
    "typeContact",
    "contactName",
    "contactEmail",
    "contactTel",
    "contactPhone",
    "contactFax",
    "vehicleThingInformation",
    "guestNumber",
    "rating",
    "VAT",
    "createdBy",
    "createdAt",
    "typeContactHD",
    "tourId",
    "enterprise",
    "enterpriseCode",
    "username",
    "ownerName",
    "ownerCode",
    "MOU",
    "source",
    "sourceUrl",
    "prepayment",
    "promotion",
  ]);
  bookingInfoTop.activeStep = getCurrentStep(bookingInfoTop.status);
  let bookingInfoBottom = _.pick(dataSource, ["tripsID", "dateIn", "dateOut"]);
  let rowId = 0;
  let initial = _.map(dataSource.khoiTao, (kh, khId) => {
    kh.rowKey = hashByTimeStamp(khId + 1);
    _.map(kh.requireVehicleTypes, (vh) => {
      vh.itemKey = hashByTimeStamp(rowId);
      let tempHash = hash(
        {
          rowKey: kh.rowKey,
          itemKey: vh.itemKey,
        },
        { algorithm: "md5", encoding: "base64" }
      );
      dataSource.detailRoute[rowId].key = tempHash;
      ++rowId;
      return vh;
    });
    return kh;
  });
  let partnersTotalDistance = dataSource.detailRoute.reduce(
    (total, nextValue) => {
      return nextValue["partnersDistance"]
        ? total + nextValue["partnersDistance"]
        : total;
    },
    0
  );
  let partnersTotalCost = dataSource.detailRoute.reduce((total, nextValue) => {
    return nextValue["partnersAmount"]
      ? total + parseFloat(nextValue["partnersAmount"])
      : total;
  }, 0);
  let orderedTemp = _.orderBy(
    dataSource.detailRoute,
    ["pickUpAt", "vehicleNumber"],
    ["asc", "asc"]
  );
  let detail = OrderedMap();
  _.forEach(orderedTemp, (or) => {
    detail = detail.set(
      or.key,
      fromJS({ ...or, points: { [or.fixedRoutesId]: [] } })
    );
  });

  return {
    top: bookingInfoTop,
    bottom: {
      initialDataSource: {
        initial: initial,
        ...bookingInfoBottom,
      },
      detailDataSource: {
        detail: detail,
        totalDistance: dataSource.totalDistance,
        totalDays: dataSource.totalDays,
        totalCost: dataSource.totalCost,
        partnersTotalDistance: partnersTotalDistance,
        partnersTotalCost: partnersTotalCost,
      },
    },
  };
};

let validateSeatsTimer = null;

const topSchema = Yup.object().shape({
  ownerId: Yup.string().required("*Trường bắt buộc"),
  organizationId: Yup.string().required("*Trường bắt buộc"),
  contactName: Yup.string().required("*Trường bắt buộc"),
  contactPhone: Yup.string()
    .required("*Trường bắt buộc")
    .matches(phoneNumber8DigitRegex, "Sai định dạng."),
  guidePhone: Yup.string()
    .transform((value) => (_.isEmpty(value) ? null : value))
    .nullable()
    .matches(phoneNumberRegex, "Sai định dạng."),
  code: Yup.string().required("*Trường bắt buộc"),
  guestNumber: Yup.number().integer().required("*Trường bắt buộc"),
  nameCountry: Yup.string().required("*Trường bắt buộc"),
});
const bottomSchema = Yup.object().shape({
  dateIn: Yup.mixed().required("*Trường bắt buộc"),
  dateOut: Yup.mixed().required("*Trường bắt buộc"),
  initial: Yup.array()
    .required("*Chưa có khởi tạo nào.")
    .of(
      Yup.object().shape({
        tripDate: Yup.string().required("*Trường bắt buộc"),
        fixedRoutesId: Yup.string().required("*Trường bắt buộc"),
        requireVehicleTypes: Yup.array()
          .required("*Chưa có loại xe.")
          .of(
            Yup.object().shape({
              requireVehicleTypeId: Yup.string().required("*Trường bắt buộc"),
              vehicleNumber: Yup.number()
                .integer()
                .required("*Trường bắt buộc"),
            })
          ),
      })
    ),
});

const BookingInfo = ({
  className,
  bookingId,
  tripId,
  actionName,
  onChangeActionName,
  onSetBookingStatus,
  onClose,
}) => {
  const [topData, setTopData] = useState(
    Map({
      dataSource: Map({
        rating: 0,
        prepayment: 0,
        promotion: 0,
      }),
    })
  );
  const [topErrors, setTopErrors] = useState(Map());
  const [bottomInitialDataSource, setBottomInitialDataSource] = useState(
    Map({
      dateIn: undefined,
      dateOut: undefined,
      initial: List(),
    })
  );
  const [bottomDetailDataSource, setBottomDetailDataSource] = useState(Map());
  const [bottomConfig, setBottomConfig] = useState(() =>
    Map({ tabId: "1", status: 0 })
  );
  const [bottomInitialErrors, setBottomInitialErrors] = useState(() => Map());
  const [bottomDetailErrors, setBottomDetailErrors] = useState(() => Map());
  const [validateSeatsErrors, setValidateSeatsErrors] = useState(() => List());

  const [canValidate, setCanValidate] = useState(() => false);
  const [readBookingFetching, setReadBookingFetching] = useState(() => false);
  const [saveBookingFetching, setSaveBookingFetching] = useState(() => false);
  const [saveOperatingFetching, setSaveOperatingFetching] = useState(
    () => false
  );
  const [showChangeStatus, setShowChangeStatusModal] = useState(() => false);
  const [quotationToAgencyFetching, setQuotationToAgencyFetching] = useState(
    () => false
  );
  const [
    changeBookingStatusFetching,
    setChangeStatusBookingFetching,
  ] = useState(() => false);

  const topDataSource = topData.get("dataSource");
  const guestNumber = topDataSource.get("guestNumber");
  const bottomTabId = bottomConfig.get("tabId");
  const detail = bottomDetailDataSource.get("detail");
  const initial = bottomInitialDataSource.get("initial");

  const onClearBookingInfo = useCallback(() => {
    onChangeActionName("add");
    setTopData((prevState) => {
      let nextState = prevState;
      nextState = nextState.set(
        "dataSource",
        Map({ prepayment: 0, promotion: 0, rating: 0 })
      );
      return nextState;
    });
    setBottomConfig((prevState) => {
      let nextState = prevState;
      nextState = nextState.set("tabId", "1");
      nextState = nextState.set("status", 0);
      return nextState;
    });
    setBottomInitialDataSource((prevState) => {
      let nextState = prevState;
      nextState = nextState.set("dateIn", undefined);
      nextState = nextState.set("dateOut", undefined);
      nextState = nextState.set("initial", List());
      return nextState;
    });
    setBottomDetailDataSource((prevState) => {
      let nextState = prevState;
      nextState = nextState.clear();
      return nextState;
    });
  }, [onChangeActionName]);

  const onCopyBookingInfo = useCallback(() => {
    Ui.showSuccess({ message: "Sao chép booking thành công." });
    setBottomConfig((prevState) => {
      let nextState = prevState;
      nextState = nextState.set("tabId", "1");
      nextState = nextState.set("status", 0);
      return nextState;
    });
    setBottomDetailDataSource((prevState) => {
      let nextState = prevState;
      nextState = nextState.clear();
      return nextState;
    });
    onChangeActionName("add");
  }, [onChangeActionName]);

  const onSaveBookingInfo = useCallback(
    ({ status = null, isSaveOperating = false }) => {
      let initialDataSource = bottomInitialDataSource.toJS();
      let detailDataSource = bottomDetailDataSource.toJS();
      let topData = topDataSource.toJS();
      let data = {
        ...topData,
        rating: topData.rating || 0,
        dateIn: initialDataSource.dateIn,
        dateOut: initialDataSource.dateOut,
        totalDistance: detailDataSource.totalDistance,
        totalCost: detailDataSource.totalCost,
        totalDays: detailDataSource.totalDays,
        partnersTotalDistance: detailDataSource.partnersTotalDistance,
        partnersTotalCost: detailDataSource.partnersTotalCost,
        detailRoute: _.map(detailDataSource.detail, (x) => {
          let result = _.pickBy(x, (value, key) => {
            return key !== "key";
          });
          result.points = _.map(result.points[result.fixedRoutesId], (p, pId) => {
            p.order = pId;
            return p;
          });
          return result;
        }),
      };
      data.rating = data.rating || 0;
      if (!data.prepayment) {
        data.prepayment = 0;
      }
      if (status) {
        data.status = status;
      } else {
        if (actionName === "add") {
          if (data.MOU && data.prepayment === 0) {
            data.status = 302;
          } else {
            data.status = 100;
          }
        }
      }
      if (actionName === "read") {
        data.tripsID = initialDataSource.tripsID;
      } else {
        delete data.uuid;
      }
      let url = actionName === "add" ? URI.ADD_BOOKING : URI.EDIT_BOOKING;
      let _onSaveBooking = debounce(async () => {
        if (isSaveOperating) {
          setSaveOperatingFetching(true);
        } else {
          setSaveBookingFetching(true);
        }
        let result = await ServiceBase.requestJson({
          url: url,
          method: "POST",
          data: data,
        });
        if (!result.hasErrors) {
          if (actionName === "add") {
            Ui.showSuccess({
              message: "Thêm booking thành công.",
            });
            onClearBookingInfo();
          } else if (actionName === "read") {
            onClose();
            Ui.showSuccess({
              message: "Sửa booking thành công.",
            });
          }
        } else {
          Ui.showErrors(result.errors);
        }
        if (isSaveOperating) {
          setSaveOperatingFetching(false);
        } else {
          setSaveBookingFetching(false);
        }
      }, 100);
      _onSaveBooking();
    },
    [
      actionName,
      bottomDetailDataSource,
      bottomInitialDataSource,
      onClearBookingInfo,
      onClose,
      topDataSource,
    ]
  );
  const onSaveOperating = useCallback(() => {
    onSaveBookingInfo({ status: 302, isSaveOperating: true });
  }, [onSaveBookingInfo]);

  const onShowChangeStatusModal = useCallback(() => {
    setShowChangeStatusModal(true);
  }, []);

  const onChangeBookingStatus = useCallback(
    (status) => {
      let data = {
        uuid: topData.get("dataSource").get("uuid"),
        status: status,
      };
      let _onChangeStatusBooking = debounce(async () => {
        setChangeStatusBookingFetching(true);
        let result = await ServiceBase.requestJson({
          url: URI.CHANGE_BOOKING_STATUS,
          method: "POST",
          data: data,
        });
        if (!result.hasErrors) {
          if (status === 302) {
            Ui.showSuccess({
              message: "Chuyển điều phối thành công.",
            });
          } else if (status === 500) {
            Ui.showSuccess({
              message: "Hủy booking thành công.",
            });
          }
          onClose();
        } else {
          Ui.showErrors(result.errors);
        }
        setChangeStatusBookingFetching(false);
      }, 100);
      _onChangeStatusBooking();
    },
    [onClose, topData]
  );
  const onQuotationToAgency = useCallback(() => {
    let _onQuotationToAgency = debounce(async () => {
      setQuotationToAgencyFetching(true);
      let result = await ServiceBase.requestJson({
        url: `${URI.QUOTATION_BOOKING_AGENCY}/${bookingId}`,
        method: "PUT",
        data: {},
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        Ui.showSuccess({
          message: result.value,
        });
      }
      setQuotationToAgencyFetching(false);
    }, 100);
    _onQuotationToAgency();
  }, [bookingId]);
  useEffect(() => {
    if (bookingId) {
      _.delay(async () => {
        setReadBookingFetching(true);
        let result = await ServiceBase.requestJson({
          url: URI.READ_BOOKING,
          method: "POST",
          data: { uuid: bookingId },
        });
        if (result.hasErrors) {
          Ui.showErrors(result.errors);
        } else {
          let _convertResult = _convertToFormData(result.value.data);
          setTopData((prevState) => {
            let newState = prevState.set(
              "dataSource",
              fromJS(_convertResult.top)
            );
            return newState;
          });
          setBottomDetailDataSource((prevState) => {
            let newState = prevState;
            newState = newState.set(
              "detail",
              _convertResult.bottom.detailDataSource.detail
            );
            newState = newState.set(
              "totalDistance",
              _convertResult.bottom.detailDataSource.totalDistance
            );
            newState = newState.set(
              "totalDays",
              _convertResult.bottom.detailDataSource.totalDays
            );
            newState = newState.set(
              "totalCost",
              _convertResult.bottom.detailDataSource.totalCost
            );
            newState = newState.set(
              "partnersTotalDistance",
              _convertResult.bottom.detailDataSource.partnersTotalDistance
            );
            newState = newState.set(
              "partnersTotalCost",
              _convertResult.bottom.detailDataSource.partnersTotalCost
            );

            return newState;
          });
          setBottomConfig((prevState) => {
            let nextState = prevState;
            nextState = nextState.set("status", 3);
            nextState = nextState.set("tabId", "2");
            return nextState;
          });
          setBottomInitialDataSource((prevState) => {
            let newState = prevState;
            newState = fromJS({
              ..._convertResult.bottom.initialDataSource,
            });
            return newState;
          });

          onSetBookingStatus(_convertResult.top.status);
        }
        setReadBookingFetching(false);
        setCanValidate(true);
      }, 600);
    } else {
      _.delay(() => {
        setCanValidate(true);
      }, 600);
    }
  }, [bookingId, onSetBookingStatus]);
  useEffect(() => {
    return () => {
      console.log("BookingInfo cleaned up!");
    };
  }, []);

  useEffect(() => {
    if (canValidate && bottomTabId === "1") {
      _.delay(() => {
        bottomSchema
          .validate(bottomInitialDataSource.toJS(), {
            abortEarly: false,
          })
          .then(() => {
            if (bottomInitialErrors.size > 0) {
              setBottomInitialErrors((prevState) => prevState.clear());
            }
          })
          .catch((err) => {
            let tempErrors = {};
            _.map(err.inner, (ner) => {
              _.set(tempErrors, ner.path, ner.message);
            });
            setBottomInitialErrors((prevState) => {
              let nextState = prevState;
              nextState = nextState.clear();

              _.forEach(tempErrors, (tempValue, tempKey) => {
                if (_.isArray(tempValue)) {
                  _.forEach(tempValue, (tmp, tmpId) => {
                    _.forEach(tmp, (tmpValue, tmpKey) => {
                      if (_.isString(tmpValue)) {
                        nextState = nextState.setIn(
                          [tempKey, tmpId, tmpKey],
                          tmpValue
                        );
                      } else if (_.isArray(tmpValue)) {
                        _.forEach(tmpValue, (t, tId) => {
                          _.forEach(t, (tValue, tKey) => {
                            if (_.isString(tValue)) {
                              nextState = nextState.setIn(
                                [tempKey, tmpId, tmpKey, tId, tKey],
                                tValue
                              );
                            }
                          });
                        });
                      }
                    });
                  });
                } else if (_.isString(tempValue)) {
                  nextState = nextState.set(tempKey, tempValue);
                }
              });
              return nextState;
            });
          });
      }, 200);
    }
  }, [
    bottomInitialDataSource,
    bottomInitialErrors.size,
    bottomTabId,
    canValidate,
  ]);
  useEffect(() => {
    if (canValidate) {
      _.delay(() => {
        topSchema
          .validate(topDataSource.toJS(), {
            abortEarly: false,
          })
          .then(() => {
            if (topErrors.size > 0) {
              setTopErrors((prevState) => {
                let nextState = prevState;
                nextState = nextState.clear();
                return nextState;
              });
            }
          })
          .catch((err) => {
            let tempErrors = {};
            _.map(err.inner, (ner) => {
              _.set(tempErrors, ner.path, ner.message);
            });
            setTopErrors((prevState) => {
              let nextState = prevState;
              nextState = nextState.clear();
              _.forEach(tempErrors, (tempValue, tempKey) => {
                nextState = nextState.set(tempKey, tempValue);
              });
              return nextState;
            });
          });
      }, 100);
    }
  }, [canValidate, topDataSource, topErrors.size]);
  useEffect(() => {
    if (canValidate && bottomTabId === "1") {
      let initialJs = initial.toJS();
      if (validateSeatsTimer) {
        clearTimeout(validateSeatsTimer);
      }
      validateSeatsTimer = setTimeout(() => {
        if (guestNumber) {
          let groupByDay = _.groupBy(initialJs, (init) => {
            return checkMoment(init.tripDate).format(
              DATE_TIME_FORMAT.DD_MM_YYYY
            );
          });
          let notEnoughDate = {};
          _.forEach(groupByDay, (grouped, groupKey) => {
            let totalSeat = _.sumBy(grouped, (g) => {
              let seats = _.sumBy(
                g.requireVehicleTypes,
                (vh) => vh.requireVehicleTypeSeats
              );
              return seats;
            });
            totalSeat = totalSeat || 0;

            if (totalSeat < guestNumber) {
              notEnoughDate[groupKey] = totalSeat;
            }
          });

          let rows = [];
          _.forEach(initialJs, (initial) => {
            let tripDateStr = checkMoment(initial.tripDate).format(
              DATE_TIME_FORMAT.DD_MM_YYYY
            );
            let row = { notEnoughSeat: null };
            if (_.includes(_.keysIn(notEnoughDate), tripDateStr)) {
              row.notEnoughSeat = `Chưa đủ số ghế: ${notEnoughDate[tripDateStr]}/${guestNumber}`;
              row.date = tripDateStr;
              row.current = notEnoughDate[tripDateStr];
              row.target = guestNumber;
            } else {
              row.notEnoughSeat = null;
            }
            rows.push(row);
          });
          setValidateSeatsErrors((prevState) => {
            let nextState = prevState;
            nextState = fromJS(rows);
            return nextState;
          });
        } else {
          if (initial.size > 0) {
            Ui.showWarning({ message: "Chưa nhập số khách." });
          }
        }
      }, 300);
    }
  }, [canValidate, initial, guestNumber, bottomTabId]);

  useEffect(() => {
    if (canValidate && Map.isMap(detail) && detail.size > 0) {
      setBottomDetailErrors((prevState) => {
        let nextState = prevState;
        let groupedDetailByDate = detail.groupBy(
          (x) =>
            `${checkMoment(x.get("pickUpAt")).format(
              DATE_TIME_FORMAT.DD_MM_YYYY
            )}-${x.get("vehicleNumber")}`
        );
        groupedDetailByDate.keySeq().forEach((grDate) => {
          let gr = groupedDetailByDate
            .get(grDate)
            .sortBy((y) =>
              checkMoment(y.get("pickUpAt")).format(DATE_TIME_FORMAT.HH_MM)
            );
          let [...grKeys] = gr.keys();
          gr.valueSeq().forEach((z, zId) => {
            let currentItem = checkMoment(z.get("dropOffAt"));
            if (zId < grKeys.length - 1) {
              for (let index = zId + 1; index < grKeys.length; index++) {
                let nextItem = checkMoment(
                  gr.getIn([grKeys[index], "pickUpAt"])
                );
                if (nextItem.isAfter(currentItem)) {
                  nextState = nextState.setIn([z.get("key"), "pickUpAt"], null);
                  nextState = nextState.setIn(
                    [z.get("key"), "dropOffAt"],
                    null
                  );
                  nextState = nextState.setIn(
                    [grKeys[index], "pickUpAt"],
                    null
                  );
                  nextState = nextState.setIn(
                    [grKeys[index], "dropOffAt"],
                    null
                  );
                } else {
                  nextState = nextState.setIn(
                    [z.get("key"), "pickUpAt"],
                    "failed"
                  );
                  nextState = nextState.setIn(
                    [z.get("key"), "dropOffAt"],
                    "failed"
                  );
                  nextState = nextState.setIn(
                    [grKeys[index], "pickUpAt"],
                    "failed"
                  );
                  nextState = nextState.setIn(
                    [grKeys[index], "dropOffAt"],
                    "failed"
                  );
                }
              }
            }

            if (
              z.get("perDay") &&
              z.get("costPerKm") &&
              _.parseInt(z.get("perDay")) > 0 &&
              _.parseInt(z.get("costPerKm")) > 0
            ) {
              nextState = nextState.setIn([z.get("key"), "perDay"], "failed");
              nextState = nextState.setIn(
                [z.get("key"), "costPerKm"],
                "failed"
              );
            } else {
              nextState = nextState.deleteIn([z.get("key"), "perDay"]);
              nextState = nextState.deleteIn([z.get("key"), "costPerKm"]);
            }
          });
        });
        return nextState;
      });
    }
  }, [detail, canValidate]);
  return (
    <Grid container spacing={4} className={className}>
      <Grid item xs={12}>
        <BookingStepper
          steps={steps}
          activeStep={topDataSource.get("activeStep")}
        />
      </Grid>
      <Grid item xs={12}>
        <Spin spinning={readBookingFetching}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Top
                values={topDataSource}
                initialDataSource={bottomInitialDataSource}
                setBottomInitialDataSource={setBottomInitialDataSource}
                errors={topErrors}
                setTopData={setTopData}
              />
            </Grid>
            <Grid item xs={12}>
              <Bottom
                initialDataSource={bottomInitialDataSource}
                setBottomInitialDataSource={setBottomInitialDataSource}
                detailDataSource={bottomDetailDataSource}
                setBottomDetailDataSource={setBottomDetailDataSource}
                setBottomConfig={setBottomConfig}
                tabId={bottomConfig.get("tabId")}
                tripId={tripId}
                status={bottomConfig.get("status")}
                initialErrors={bottomInitialErrors}
                detailErrors={bottomDetailErrors}
                setBottomDetailErrors={setBottomDetailErrors}
                setBottomInitialErrors={setBottomInitialErrors}
                validateSeats={validateSeatsErrors}
                organizationId={topDataSource.get("organizationId")}
                schema={bottomSchema}
              />
            </Grid>
          </Grid>
        </Spin>
      </Grid>
      <div className="bookingInfo__action p-2">
        {(topDataSource.get("status") || !topDataSource.get("status")) <
          500 && (
          <BookingInfoAction
            setTopData={setTopData}
            createdBy={topDataSource.get("createdBy")}
            ownerId={topDataSource.get("ownerId")}
            isMou={topDataSource.get("MOU")}
            uuid={topDataSource.get("uuid")}
            detail={detail}
            bookingStatus={topDataSource.get("status")}
            topErrors={topErrors}
            bottomDetailErrors={bottomDetailErrors}
            bottomInitialErrors={bottomInitialErrors}
            validateSeats={validateSeatsErrors}
            status={bottomConfig.get("status")}
            actionName={actionName}
            saveBookingFetching={saveBookingFetching}
            saveOperatingFetching={saveOperatingFetching}
            changeBookingStatusFetching={changeBookingStatusFetching}
            quotationToAgencyFetching={quotationToAgencyFetching}
            onSaveBookingInfo={onSaveBookingInfo}
            onCopyBookingInfo={onCopyBookingInfo}
            onClearBookingInfo={onClearBookingInfo}
            onSaveOperating={onSaveOperating}
            onShowChangeStatusModal={onShowChangeStatusModal}
            onQuotationToAgency={onQuotationToAgency}
          />
        )}
      </div>
      <ChangeStatusModal
        open={showChangeStatus}
        isMou={topDataSource.get("MOU")}
        onConfirm={onChangeBookingStatus}
        onClose={() => setShowChangeStatusModal(false)}
      />
    </Grid>
  );
};
const BookingInfoWrapper = styled(BookingInfo)`
  margin: 1rem;
  .fixed-header {
    max-height: 500px;
    overflow: scroll;
    table > thead > tr > th {
      top: 0;
      background: rgb(250, 250, 250);
      z-index: 301;
      position: sticky;
    }
  }
  .ant-tabs-ink-bar {
    width: 3px;
    background: #ffc10e;
  }
  .ant-tabs-nav .ant-tabs-tab-active {
    a {
      font-weight: 500;
    }
  }

  .zui-wrapper {
    position: relative;
  }
  .sticky-col {
    position: sticky;
    right: 0px;
    background-color: whitesmoke;
    z-index: 300 !important;
  }
  .sticky-left-col {
    position: sticky;
    left: 0px;
    background-color: whitesmoke;
    z-index: 300;
  }
  .zui-scroller {
    width: 100%;
  }
  #bookingInfoBottom__Portlet {
    .ant-tabs-content {
      padding-top: 0px;
      padding-left: 0px;
      padding-right: 0px;
    }
    .ant-tabs-bar {
      margin-bottom: 10px;
    }
    .customTab .ant-tabs-tab {
      padding-left: 8px;
    }
  }
  .kt-portlet--bordered {
    margin-bottom: 5px !important;
    border: 1px solid #d9d9d9;
  }
  .ant-form-item-label {
    padding-bottom: 0 !important;
  }
  .ant-input-group-addon {
    padding: 0 !important;
  }
  .ant-checkbox-inner {
    width: 21px;
    height: 21px;
  }
  label {
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    font-size: 13px;
  }
  .small-label {
    font-size: 0.9rem;
  }
  .mark-required-color {
    color: #fd397a;
  }
  .selectedTrip {
    background: #ebedf2;
  }
`;
export default BookingInfoWrapper;
