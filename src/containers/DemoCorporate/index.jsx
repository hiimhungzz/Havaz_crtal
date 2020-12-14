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
import CorporateModal from "./Modal";
import { createStructuredSelector } from "reselect";
import { makeSelectAppConfig } from "redux/app/selectors";
import { connect } from "react-redux";
import { compose } from "recompose";
import { STATUS } from "constants/common";
let loadDataTimer = null;

const CorporateManagement = ({ appConfig, appParam }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [modal, setModal] = useState(
    Map({
      corporateId: null,
      corporateName: null,
      actionName: "",
      isShow: false,
    })
  );
  const [grid, setGrid] = useState(
    Map({
      data: [],
      totalLength: 1,
      totalPages: 1,
      currentPage: _.get(appParam[APP_MODULE.CORPORATE], "currentPage", 0) || 0,
      pageLimit: _.get(appParam[APP_MODULE.CORPORATE], "pageLimit", 5) || 5,
    })
  );
  const [param, setParam] = useState(
    appParam[APP_MODULE.CORPORATE]
      ? Map({
          ...appParam[APP_MODULE.CORPORATE],
          query: Map(_.get(appParam[APP_MODULE.CORPORATE], "query", {})),
        })
      : Map({
          pageLimit: 5,
          currentPage: 0,
          searchInput: "",
          orderBy: { createdAt: 1 },
          query: Map({
            codeAndName: "",
            phoneAndAddress: "",
          }),
        })
  );
  /**
   * Lấy dữ liệu Corporate
   */
  const browseCorporate = useCallback(async () => {
    setIsFetching(true);
    let result = await ServiceBase.requestJson({
      method: "POST",
      url: URI.BROWSE_CORPORATE,
      data: param.toJS(),
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      appParam[APP_MODULE.CORPORATE] = param.toJS();
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
          _.map(_.get(result, "value.data", []), (item) => {
            let findedStatus = _.find(
              STATUS,
              (st) =>
                _.toString(_.get(st, "value")) ===
                _.toString(_.get(item, "status"))
            );
            if (findedStatus) {
              item.status = findedStatus.label;
              item.color = findedStatus.color;
              item.icon = findedStatus.icon;
            } else {
              item.status = "N/A";
              item.color = "red";
              item.icon = "fa-question-circle";
            }
            return item;
          })
        );
        return nextState;
      });
    }
    setIsFetching(false);
  }, [appParam, param]);

  const _onShowCorporateModal = useCallback((payload) => {
    setModal((prevState) => {
      let nextState = prevState;
      nextState = nextState.set("actionName", payload.actionName);
      nextState = nextState.set("corporateId", payload.corporateId);
      nextState = nextState.set("corporateName", payload.corporateName);
      nextState = nextState.set("isShow", payload.isShow);
      return nextState;
    });
  }, []);
  const _onDeleteCorporate = useCallback(
    async (param) => {
      setIsFetching(true);
      let result = await ServiceBase.requestJson({
        method: "POST",
        url: URI.DELETE_CORPORATE,
        data: param,
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        Ui.showSuccess({ message: "Xóa doanh nghiệp thành công." });
        _.delay(browseCorporate, 300);
      }
      setIsFetching(false);
    },
    [browseCorporate]
  );
  // Load data
  useEffect(() => {
    if (modal.get("isShow") === false) {
      clearTimeout(loadDataTimer);
      loadDataTimer = setTimeout(browseCorporate, 300);
    }
  }, [browseCorporate, modal]);

  return (
    <Grid container spacing={3}>
      <Helmet title="DOANH NGHIỆP">
        <meta name="description" content="Doanh nghiệp - Car Rental" />
      </Helmet>
      <Grid item xs={12}>
        <Portlet>
          <Filter
            setParam={setParam}
            onShowCorporateModal={_onShowCorporateModal}
            query={param.get("query")}
          />
          <PortletBody className="pt-0">
            <Spin spinning={isFetching} tip="Đang lấy dữ liệu...">
              <List
                grid={grid}
                setParam={setParam}
                onDeleteCorporate={_onDeleteCorporate}
                onShowCorporateModal={_onShowCorporateModal}
              />
            </Spin>
          </PortletBody>
        </Portlet>
      </Grid>
      <CorporateModal modal={modal} onShowModal={_onShowCorporateModal} />
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
)(CorporateManagement);
