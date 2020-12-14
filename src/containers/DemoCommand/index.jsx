import React, { memo, useState, useEffect, useCallback } from "react";
import { Spin } from "antd";
import _ from "lodash";
import { withStyles } from "@material-ui/core/styles";
import { Ui } from "@Helpers/Ui";
import Portlet from "@Components/Portlet";
import PortletBody from "@Components/Portlet/PortletBody";
import { fromJS, Map } from "immutable";
import { calculateTotalPage, checkMoment } from "@Helpers/utility";
import { APP_MODULE, DATE_TIME_FORMAT } from "@Constants/common";
import ServiceBase from "@Services/ServiceBase";
import { APP_PARAM } from "@Constants";
import { URI } from "./constants";
import { $LocalStorage } from "@Helpers/localStorage";
import { Grid } from "@material-ui/core";
import Helmet from "react-helmet";
import Filter from "./Filter";
import List from "./List";
import { createStructuredSelector } from "reselect";
import { makeSelectAppConfig } from "redux/app/selectors";
import { connect } from "react-redux";
import { compose } from "recompose";
import moment from "moment";
let loadDataTimer = null;

const CommandManagement = ({ appConfig, appParam }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [grid, setGrid] = useState(
    Map({
      data: [],
      totalLength: 0,
      totalPages: 0,
      currentPage: appParam[APP_MODULE.COMMAND]
        ? appParam[APP_MODULE.COMMAND].currentPage || 0
        : 0,
      pageLimit: appParam[APP_MODULE.COMMAND]
        ? appParam[APP_MODULE.COMMAND].pageLimit || 0
        : 0,
    })
  );
  const [param, setParam] = useState(
    Map({
      pageLimit: 5,
      currentPage: 0,
      searchInput: "",
      orderBy: { createdAt: 1 },
      ...appParam[APP_MODULE.COMMAND],
      query: Map(
        _.get(appParam[APP_MODULE.COMMAND], "query", {
          tripCode: "",
          bookingCode: "",
          namePhoneGuide: "",
          organizationUuid: [],
          subDriverUuid: [],
          driverUuid: [],
          plate: "",
          startDate: moment().startOf("day"),
          endDate: moment().endOf("day"),
          status: undefined,
        })
      ),
    })
  );
  const [isSelectAllDriver, setIsSelectAllDriver] = useState(false);
  const [selectDriverList, setSelectDriverList] = useState(Map());
  const [isSelectAllGuideInfo, setIsSelectAllGuideInfo] = useState(false);
  const [selectGuideInfoList, setSelectGuideInfoList] = useState(Map());
  /**
   * Lấy dữ liệu Command
   */
  const browseCommand = useCallback(async () => {
    let jsData = param.toJS();
    let data = {
      ...jsData,
      query: _.pick(jsData.query, [
        "startDate",
        "endDate",
        "tripCode",
        "bookingCode",
        "plate",
        "status",
        "driverUuids",
        "subDriverUuids",
        "organizationUuids",
        "namePhoneGuide",
      ]),
    };
    let organizationIds = _.map(
      _.get(data, "query.organizationUuids", []),
      (x) => x.value
    );
    let driverUuids = _.map(_.get(data, "query.driverUuids", []), (x) => x.key);
    let subDrivers = _.map(
      _.get(data, "query.subDriverUuids", []),
      (x) => x.key
    );

    _.set(data, "query.organizationUuids", organizationIds);
    _.set(data, "query.driverUuids", driverUuids);
    _.set(data, "query.subDriverUuid", subDrivers);
    setIsFetching(true);
    let result = await ServiceBase.requestJson({
      method: "POST",
      url: URI.BROWSE_COMMAND,
      data: data,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      appParam[APP_MODULE.COMMAND] = param.toJS();
      $LocalStorage.sls.setObject(APP_PARAM, appParam);
      setGrid((prevState) => {
        let nextState = prevState;
        nextState = nextState.set(
          "totalLength",
          _.parseInt(result.value.totalLength)
        );
        nextState = nextState.set("currentPage", param.get("currentPage"));
        nextState = nextState.set("pageLimit", param.get("pageLimit"));

        nextState = nextState.set(
          "data",
          _.map(result.value.data, (x, xId) => {
            x.recordId = xId;
            x.pickUpAt = x.pickUpAt
              ? checkMoment(x.pickUpAt).format(DATE_TIME_FORMAT.DD_MM_YYYY)
              : null;
            let findedStatus = _.find(
              appConfig.statusTrip,
              (s) => s.id === x.status
            );
            x.status = _.get(findedStatus, "name") || "";
            x.statusId = _.get(findedStatus, "id");
            x.statusColor = _.get(findedStatus, "color") || "red";
            return x;
          })
        );
        return nextState;
      });
    }
    setIsFetching(false);
  }, [appConfig.statusTrip, appParam, param]);

  const onCommandSendMessage = useCallback(
    async (data) => {
      let result = await ServiceBase.requestJson({
        method: "POST",
        url: "/scheduler/send/notification/create",
        data: data,
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      }
      _.delay(browseCommand, 400);
    },
    [browseCommand]
  );
  const onCommandSendSms = useCallback(
    async (data) => {
      let result = await ServiceBase.requestJson({
        method: "POST",
        url: "/trip/guider/send-sms",
        data: data,
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      }
      _.delay(browseCommand, 400);
    },
    [browseCommand]
  );
  // Load data
  useEffect(() => {
    clearTimeout(loadDataTimer);
    loadDataTimer = setTimeout(browseCommand, 300);
  }, [browseCommand]);

  return (
    <Grid container spacing={3}>
      <Helmet title="ĐIỀU LỆNH">
        <meta name="description" content="Điều lệnh - Car Rental" />
      </Helmet>
      <Grid item xs={12}>
        <Portlet>
          <Filter
            setParam={setParam}
            grid={grid}
            onCommandSendMessage={onCommandSendMessage}
            onCommandSendSms={onCommandSendSms}
            query={param.get("query")}
            selectDriverList={selectDriverList}
            selectGuideInfoList={selectGuideInfoList}
            statusTrip={_.get(appConfig, "statusTrip")}
          />
          <PortletBody className="pt-0">
            <Spin spinning={isFetching} tip="Đang lấy dữ liệu...">
              <List
                grid={grid}
                setParam={setParam}
                onCommandSendMessage={onCommandSendMessage}
                isSelectAllDriver={isSelectAllDriver}
                setIsSelectAllDriver={setIsSelectAllDriver}
                selectDriverList={selectDriverList}
                setSelectDriverList={setSelectDriverList}
                isSelectAllGuideInfo={isSelectAllGuideInfo}
                setIsSelectAllGuideInfo={setIsSelectAllGuideInfo}
                selectGuideInfoList={selectGuideInfoList}
                setSelectGuideInfoList={setSelectGuideInfoList}
              />
            </Spin>
          </PortletBody>
        </Portlet>
      </Grid>
    </Grid>
  );
};
const mapStateToProps = createStructuredSelector({
  appConfig: makeSelectAppConfig(),
});
export default compose(
  withStyles({}),
  connect(mapStateToProps, null),
  memo
)(CommandManagement);
