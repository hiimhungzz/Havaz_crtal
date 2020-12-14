import React, { useEffect, useCallback, useState } from "react";
import { Spin, Modal, Button, Input } from "antd";
import BookingStatus from "./BookingStatus";
import moment from "moment";
import _ from "lodash";
import PortletBody from "@Components/Portlet/PortletBody";
import Portlet from "@Components/Portlet";
import { isEmpty } from "@Helpers/utility";
import { APP_MODULE } from "@Constants/common";
import { Ui } from "@Helpers/Ui";
import { memo } from "react";
import BookingModal from "./BookingModal";
import BookingList from "./List";
import Filter from "./Filter";

import Helmet from "react-helmet";
import { Map, List, fromJS } from "immutable";
import { Grid, Paper } from "@material-ui/core";
import { calculateTotalPage, formatDateTime } from "@Helpers/utility";
import { $LocalStorage } from "@Helpers/localStorage";
import { APP_PARAM } from "@Constants";
import ServiceBase from "@Services/ServiceBase";

let loadDataTimer = null;
const BookingManagement = ({ appParam }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [bookingId, setBookingId] = useState(false);
  const [cancelBookingFetching] = useState(false);
  const [showCancelBooking, setShowCancelBooking] = useState(false);
  const [cancelComment, setCancelComment] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [modal, setModal] = useState(
    Map({
      bookingId: null,
      actionName: "",
      isShow: false,
    })
  );
  const [bookingStatus, setBookingStatus] = useState(List());

  const [grid, setGrid] = useState(
    fromJS({
      data: [],
      totalLength: 0,
      totalPages: 0,
      currentPage: appParam[APP_MODULE.BOOKING]
        ? appParam[APP_MODULE.BOOKING].currentPage || 0
        : 0,
      pageLimit: appParam[APP_MODULE.BOOKING]
        ? appParam[APP_MODULE.BOOKING].pageLimit || 0
        : 0,
    })
  );
  const [param, setParam] = useState(
    Map({
      pageLimit: 5,
      currentPage: 0,
      searchInput: "",
      orderBy: { createdAt: 1 },
      ...appParam[APP_MODULE.BOOKING],
      query: Map(
        _.get(appParam[APP_MODULE.BOOKING], "query", {
          isOwner: [],
          nameOrAddress: "",
          code: [],
          status: [],
          namePhoneEmai: "",
          guideNamePhone: "",
          typeCustomer: "",
          typeBooking: undefined,
          TypeDate: undefined,
          startDate: "",
          EndDate: "",
        })
      ),
    })
  );

  const _onShowModal = useCallback((payload) => {
    setModal((prevState) => {
      let nextState = prevState;
      nextState = nextState.set("actionName", payload.actionName);
      nextState = nextState.set("bookingId", payload.bookingId);
      nextState = nextState.set("bookingStatus", payload.bookingStatus);
      nextState = nextState.set("isShow", payload.isShow);
      return nextState;
    });
  }, []);

  const _browseBooking = useCallback(async () => {
    let jsData = param.toJS();
    if (jsData.query.code[0] === "") {
      jsData.query.code = [];
    }
    if (jsData.query.startDate && !jsData.query.TypeDate) {
      Ui.showWarning({ message: "Chưa chọn loại ngày." });
      return;
    } else if (jsData.query.TypeDate && !jsData.query.startDate) {
      return;
    }
    jsData.query.isOwner = _.map(jsData.query.isOwner, (x) =>
      _.get(_.split(x.value, "__", 1), 0)
    );
    setIsFetching(true);
    let result = await ServiceBase.requestJson({
      method: "POST",
      url: "/booking/list",
      data: jsData,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      appParam[APP_MODULE.BOOKING] = param.toJS();
      $LocalStorage.sls.setObject(APP_PARAM, appParam);
      setGrid((prevState) => {
        let nextState = prevState;
        let totalPages = calculateTotalPage(
          result.value.totalLength,
          param.get("pageLimit")
        );
        nextState = nextState.set(
          "totalLength",
          _.parseInt(result.value.totalLength)
        );
        nextState = nextState.set("currentPage", param.get("currentPage"));
        nextState = nextState.set("pageLimit", param.get("pageLimit"));
        nextState = nextState.set("totalPages", totalPages);
        nextState = nextState.set(
          "data",
          _.map(result.value.data, (data) => {
            let findedStatus = bookingStatus.find(
              (x) => x.get("id") === data.status
            );
            return {
              uuid: data.uuid,
              code: data.code,
              ownerId: data.ownerId,
              status: data.status,
              col_1: {
                code: data.code || "",
              },
              col_2: {
                companyName: data.enterprise || "",
              },
              col_3: {
                customerName: data.contactName || "",
                phone: data.contactPhone || "",
                email: data.contactEmail || "",
              },
              col_4: {
                registeredFrom: data.sourceUrl || "",
                source: data.source || "",
              },
              col_5: {
                dataIn: formatDateTime(data.dateIn),
                dataOut: formatDateTime(data.dateOut),
              },
              col_6: {
                initialPrice: data.totalCost || "",
                numberOfPeople: data.guestNumber || "",
                numberOfDay:
                  (data.dateIn && data.dateOut
                    ? moment(data.dateOut).diff(moment(data.dateIn), "days") + 1
                    : null) || "",
              },
              col_7: {
                status: findedStatus ? findedStatus.get("name") : "",
                color: findedStatus ? findedStatus.get("color") : "red",
              },
              col_8: {
                fullName: data.fullName || "",
                source: data.source,
              },
              col_9: {
                createdAt: formatDateTime(data.createdAt),
                lastUpdatedAt: formatDateTime(data.lastUpdatedAt),
              },
              col_12: {
                requireVehiclesTypeName: data.requireVehiclesTypeName || [],
              },
            };
          })
        );
        return nextState;
      });
    }
    setIsFetching(false);
  }, [appParam, bookingStatus, param]);
  const _browseBookingStatus = useCallback(async () => {
    let result = await ServiceBase.requestJson({
      method: "GET",
      url: "/booking/stats/status",
      data: {},
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setBookingStatus(fromJS(result.value));
    }
  }, []);
  const _onCancelBooking = useCallback(async () => {
    let result = await ServiceBase.requestJson({
      method: "POST",
      url: "/booking/status/update",
      data: {
        uuid: bookingId,
        status: 500,
        comment: cancelComment,
      },
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      Ui.showSuccess({ message: "Hủy booking thành công." });
      setShowCancelBooking(false);
      _browseBooking();
    }
  }, [_browseBooking, bookingId, cancelComment]);
  const _onShowDeleteConfirm = useCallback((data) => {
    setBookingId(_.get(data, "uuid"));
    setShowCancelBooking(true);
  }, []);

  useEffect(() => {
    if (modal.get("isShow") === false) {
      clearTimeout(loadDataTimer);
      loadDataTimer = setTimeout(_browseBooking, 800);
    }
    return () => {
      clearTimeout(loadDataTimer);
    };
  }, [_browseBooking, modal]);
  useEffect(() => {
    setParam((prevState) => {
      let nextState = prevState;
      let initParam = isEmpty(appParam[APP_MODULE.BOOKING], {});
      nextState = nextState.merge(
        Map({
          ...initParam,
          query: Map(
            _.get(initParam, "query", {
              isOwner: [],
              nameOrAddress: "",
              code: [],
              status: [],
              namePhoneEmai: "",
              guideNamePhone: "",
              typeCustomer: "",
              typeBooking: undefined,
              TypeDate: undefined,
              startDate: "",
              EndDate: "",
            })
          ),
        })
      );
      let urlSearchParams = new URLSearchParams(window.location.search);
      let codeBooking = urlSearchParams.get("codeBooking") || "";
      let bookingId = urlSearchParams.get("bookingId") || "";
      let tripId = urlSearchParams.get("tripId") || "";
      let queryCode = urlSearchParams.get("code") || "";
      let queryName = urlSearchParams.get("orgId") || "";
      if (queryCode || queryName) {
        nextState = nextState.setIn(["query", "nameOrAddress"], queryName);
        nextState = nextState.setIn(["query", "code"], [queryCode]);
        return nextState;
      } else if (bookingId && tripId) {
        nextState = nextState.setIn(["query", "code"], [codeBooking]);
        _.delay(() => {
          setIsFirstTime(false);
          _onShowModal({
            isShow: true,
            bookingId: bookingId,
            tripId: tripId,
            actionName: "read",
          });
        }, 1000);
        return nextState;
      }
      return nextState;
    });
  }, [_onShowModal, appParam, setIsFirstTime]);

  useEffect(() => {
    _browseBookingStatus();
  }, [_browseBookingStatus]);
  return (
    <Grid container spacing={1}>
      <Helmet title="BOOKING">
        <meta name="description" content="BOOKING - Car Rental" />
      </Helmet>
      <Grid item xs={12}>
        <Paper>
          <BookingStatus data={bookingStatus} setParam={setParam} />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Portlet>
          <Filter
            query={param.get("query")}
            bookingStatus={bookingStatus}
            onShowModal={_onShowModal}
            setParam={setParam}
          />
          <PortletBody className="pt-0">
            <Spin spinning={isFetching} tip="Đang lấy dữ liệu...">
              <BookingList
                grid={grid}
                setParam={setParam}
                onShowDeleteConfirm={_onShowDeleteConfirm}
                onShowModal={_onShowModal}
              />
            </Spin>
          </PortletBody>
        </Portlet>
      </Grid>
      <BookingModal
        modal={modal}
        onSetModal={setModal}
        onShowModal={_onShowModal}
      />
      <Modal
        destroyOnClose={true}
        visible={showCancelBooking}
        title="Xác nhận hủy booking này ?"
        footer={[
          <Button
            onClick={() => {
              setShowCancelBooking(false);
              setCancelComment("");
            }}
            key="back"
          >
            Quay lại
          </Button>,
          <Button
            disabled={!cancelComment}
            key="submit"
            type="danger"
            loading={cancelBookingFetching}
            onClick={_onCancelBooking}
          >
            Xác nhận
          </Button>,
        ]}
      >
        <p>
          <Input.TextArea
            rows={5}
            value={cancelComment}
            onChange={(e) => {
              let value = e.target.value;
              setCancelComment(value);
            }}
            placeholder="Nhập lý do hủy"
          />
        </p>
      </Modal>
    </Grid>
  );
};
export default memo(BookingManagement);
