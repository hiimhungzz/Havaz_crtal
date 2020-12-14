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
import TourModal from "./Modal";
import { createStructuredSelector } from "reselect";
import { makeSelectAppConfig } from "redux/app/selectors";
import { connect } from "react-redux";
import { compose } from "recompose";
let loadDataTimer = null;

const TourManagement = ({ appConfig, appParam }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [modal, setModal] = useState(
    Map({
      tourId: null,
      actionName: "",
      isShow: false
    })
  );
  const [grid, setGrid] = useState(
    fromJS({
      data: [],
      totalLength: 0,
      totalPages: 0,
      currentPage: appParam[APP_MODULE.TOUR]
        ? appParam[APP_MODULE.TOUR].currentPage || 0
        : 0,
      pageLimit: appParam[APP_MODULE.TOUR]
        ? appParam[APP_MODULE.TOUR].pageLimit || 0
        : 0
    })
  );
  const [param, setParam] = useState(
    appParam[APP_MODULE.TOUR]
      ? Map({
          ...appParam[APP_MODULE.TOUR],
          query: Map(_.get(appParam[APP_MODULE.TOUR], "query", {}))
        })
      : Map({
          pageLimit: 5,
          currentPage: 0,
          searchInput: "",
          orderBy: { createdAt: 1 },
          query: Map({
            nameCode: "",
            pointName: "",
            numberOfDaysAndNights: undefined,
            rating: undefined,
            status: undefined
          })
        })
  );
  /**
   * Lấy dữ liệu Tour
   */
  const browseTour = useCallback(async () => {
    setIsFetching(true);
    let result = await ServiceBase.requestJson({
      method: "POST",
      url: URI.BROWSE_TOUR,
      data: param.toJS()
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      appParam[APP_MODULE.TOUR] = param.toJS();
      $LocalStorage.sls.setObject(APP_PARAM, appParam);
      setGrid(prevState => {
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
          _.map(result.value.data, x => {
            x.createdAt = checkMoment(x.createdAt).format(
              DATE_TIME_FORMAT.DD_MM_YYYY
            );
            let findedStatus = _.find(
              appConfig.tourStatus,
              s => s.id === _.toString(x.status)
            );
            x.status = _.get(findedStatus, "name");
            x.statusId = _.get(findedStatus, "id");
            x.statusColor = _.get(findedStatus, "color");
            return x;
          })
        );
        return nextState;
      });
    }
    setIsFetching(false);
  }, [appConfig.tourStatus, appParam, param]);

  const _onShowTourModal = useCallback(payload => {
    setModal(prevState => {
      let nextState = prevState;
      nextState = nextState.set("actionName", payload.actionName);
      nextState = nextState.set("tourId", payload.tourId);
      nextState = nextState.set("isShow", payload.isShow);
      return nextState;
    });
  }, []);
  const _onDeleteTour = useCallback(
    async param => {
      setIsFetching(true);
      let result = await ServiceBase.requestJson({
        method: "POST",
        url: "/routes/tour/delete",
        data: param
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        Ui.showSuccess({ message: "Xóa tour thành công." });
        _.delay(browseTour, 300);
      }
      setIsFetching(false);
    },
    [browseTour]
  );
  // Load data
  useEffect(() => {
    if (modal.get("isShow") === false) {
      clearTimeout(loadDataTimer);
      loadDataTimer = setTimeout(browseTour, 300);
    }
  }, [browseTour, modal]);

  return (
    <Grid container spacing={3}>
      <Helmet title="TOUR">
        <meta name="description" content="Tour - Car Rental" />
      </Helmet>
      <Grid item xs={12}>
        <Portlet>
          <Filter
            setParam={setParam}
            onShowTourModal={_onShowTourModal}
            query={param.get("query")}
          />
          <PortletBody className="pt-0">
            <Spin spinning={isFetching} tip="Đang lấy dữ liệu...">
              <List
                grid={grid}
                setParam={setParam}
                onDeleteTour={_onDeleteTour}
                onShowTourModal={_onShowTourModal}
              />
            </Spin>
          </PortletBody>
        </Portlet>
      </Grid>
      <TourModal modal={modal} onShowModal={_onShowTourModal} />
    </Grid>
  );
};
const mapStateToProps = createStructuredSelector({
  appConfig: makeSelectAppConfig()
});
export default compose(
  withStyles({}),
  connect(mapStateToProps, null),
  memo
)(TourManagement);
