import React, { memo, useState, useEffect, useCallback } from "react";
import { Spin } from "antd";
import _ from "lodash";
import { withStyles } from "@material-ui/core/styles";
import { Ui } from "@Helpers/Ui";
import Portlet from "@Components/Portlet";
import PortletBody from "@Components/Portlet/PortletBody";
import downloadFile from "@Components/Utility/downloadFile";
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
import { compose } from "recompose";
import { STATUS } from "constants/common";
import moment from "moment";
import { isEmpty } from "helpers/utility";
let loadDataTimer = null;

const CorporateReconciliation = ({ appParam }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [grid, setGrid] = useState(
    Map({
      data: [],
      totalLength: 0,
      totalPages: 0,
      totalRows: 0,
      currentPage: _.get(appParam, "currentPage", 0) || 0,
      pageLimit: _.get(appParam, "pageLimit", 5) || 5,
    })
  );
  const [param, setParam] = useState(
    Map({
      pageLimit: 5,
      currentPage: 0,
      searchInput: "",
      orderBy: { createdAt: 1 },
      ...appParam,
      query: Map(
        _.get(appParam, "query", {
          contractNumber: "",
          corporates: undefined,
          contractTypes: undefined,
          routes: undefined,
          startDate: undefined,
          endDate: undefined,
          vehicleTypes: undefined,
          vehicles: undefined,
        })
      ),
    })
  );
  /**
   * Lấy dữ liệu Reconcilication
   */
  const browseCorporateReconcilication = useCallback(async () => {
    setIsFetching(true);
    let jsParam = param.toJS();
    let data = {
      contractId: _.get(jsParam, "query.contract.key", null),
      organizationIds: _.map(_.get(jsParam, "query.corporates"), (x) =>
        _.get(x, "key")
      ),
      contractType: _.get(jsParam, "query.contractTypes", []),
      status: _.get(jsParam, "query.status", []),
      routes: _.map(_.get(jsParam, "query.routes"), (x) => _.get(x, "key")),
      startDate: _.get(jsParam, "query.startDate", null),
      endDate: _.get(jsParam, "query.endDate", null),
      vehicleTypes: _.map(_.get(jsParam, "query.vehicleTypes"), (x) =>
        _.get(x, "key")
      ),
      vehicles: _.map(_.get(jsParam, "query.vehicles"), (x) => _.get(x, "key")),
    };
    _.set(jsParam, "query", data);
    let result = await ServiceBase.requestJson({
      method: "GET",
      url: URI.BROWSE_CORPORATE_RECONCILIATION,
      data: jsParam,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      let tempAppParam = isEmpty($LocalStorage.sls.getObject(APP_PARAM), {});
      _.set(tempAppParam, APP_MODULE.CORPORATE_RECONCILIATION, param.toJS());
      $LocalStorage.sls.setObject(APP_PARAM, tempAppParam);
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
        let data = _.map(_.get(result, "value.data", []), (item) => {
          item.date = item.date
            ? checkMoment(item.date).format(DATE_TIME_FORMAT.DD_MM_YYYY)
            : null;
          item.timeDropOff = item.timeDropOff
            ? moment(item.timeDropOff, "hh:mm:ss").format(
                DATE_TIME_FORMAT.HH_MM
              )
            : null;
          item.timePickUp = item.timePickUp
            ? moment(item.timePickUp, "hh:mm:ss").format(DATE_TIME_FORMAT.HH_MM)
            : null;
          item.extraTurnPrice = _.replace(
            item.extraTurnPrice,
            /\B(?=(\d{3})+(?!\d))/g,
            ","
          );
          return item;
        });
        let groupedData = _.groupBy(data, (x) => x.contractNumber);
        let totalRows = _.keysIn(groupedData).length;
        _.forEach(groupedData, (x) => {
          totalRows += x.length;
        });
        nextState = nextState.set(
          "data",
          _.orderBy(data, ["date", "fixedRouteName", "plate"])
        );
        nextState = nextState.set("totalRows", totalRows);
        return nextState;
      });
    }
    setIsFetching(false);
  }, [param]);

  const onExportExcel = useCallback(async () => {
    let jsParam = param.toJS();
    let data = {
      contractId: _.get(jsParam, "query.contract.key", null),
      organizationIds: _.map(_.get(jsParam, "query.corporates"), (x) =>
        _.get(x, "key")
      ),
      contractType: _.get(jsParam, "query.contractTypes", []),
      status: _.get(jsParam, "query.status", []),
      routes: _.map(_.get(jsParam, "query.routes"), (x) => _.get(x, "key")),
      startDate: _.get(jsParam, "query.startDate", null),
      endDate: _.get(jsParam, "query.endDate", null),
      vehicleTypes: _.map(_.get(jsParam, "query.vehicleTypes"), (x) =>
        _.get(x, "key")
      ),
      vehicles: _.map(_.get(jsParam, "query.vehicles"), (x) => _.get(x, "key")),
    };
    _.set(jsParam, "query", data);
    let result = await ServiceBase.requestJson({
      method: "GET",
      url: URI.BROWSE_CORPORATE_RECONCILIATION,
      data: {
        ...jsParam,
        result: "excel"
      },
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      downloadFile(result.value, "Đối soát theo KHDN thuê xe")
      Ui.showSuccess({ message: "Xuất Excel thành công" });
    }
  }, [param]);

  // Load data
  useEffect(() => {
    clearTimeout(loadDataTimer);
    loadDataTimer = setTimeout(browseCorporateReconcilication, 300);
  }, [browseCorporateReconcilication]);

  return (
    <Grid container spacing={3}>
      <Helmet title="ĐỐI SOÁT DOANH NGHIỆP">
        <meta name="description" content="Đối soát Doanh nghiệp - Car Rental" />
      </Helmet>
      <Grid item xs={12}>
        <Portlet className="mb-0">
          <Filter setParam={setParam} query={param.get("query")} onExportExcel={onExportExcel}/>
          <PortletBody className="pt-0">
            <Spin spinning={isFetching} tip="Đang lấy dữ liệu...">
              <List grid={grid} setParam={setParam} />
            </Spin>
          </PortletBody>
        </Portlet>
      </Grid>
    </Grid>
  );
};
export default compose(withStyles({}), memo)(CorporateReconciliation);
