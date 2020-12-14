import React, { memo, useState, useEffect, useCallback } from "react";
import { Spin } from "antd";
import _ from "lodash";
import { withStyles } from "@material-ui/core/styles";
import { STATUS } from "@Constants/common";
import { Ui } from "@Helpers/Ui";
import Portlet from "../../components/Portlet";
import PortletBody from "../../components/Portlet/PortletBody";
import { fromJS, Map } from "immutable";
import { calculateTotalPage, checkMoment } from "helpers/utility";
import { APP_MODULE, DATE_TIME_FORMAT } from "constants/common";
import ServiceBase from "@Services/ServiceBase";
import { APP_PARAM } from "@Constants";
import { $LocalStorage } from "helpers/localStorage";
import { Grid } from "@material-ui/core";
import Helmet from "react-helmet";
import Filter from "./Filter";
import List from "./List";
import RouteModal from "./Modal";

let loadDataTimer = null;

const RouteManagement = memo(({ appParam }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [modal, setModal] = useState(
    Map({
      routeId: null,
      actionName: "",
      isShow: false,
    })
  );
  const [grid, setGrid] = useState(
    fromJS({
      data: [],
      totalLength: 0,
      totalPages: 0,
      currentPage: appParam[APP_MODULE.ROUTE]
        ? appParam[APP_MODULE.ROUTE].currentPage || 0
        : 0,
      pageLimit: appParam[APP_MODULE.ROUTE]
        ? appParam[APP_MODULE.ROUTE].pageLimit || 0
        : 0,
    })
  );
  const [param, setParam] = useState(
    fromJS(
      appParam[APP_MODULE.ROUTE]
        ? fromJS({
            ...appParam[APP_MODULE.ROUTE],
          })
        : fromJS({
            pageLimit: 5,
            currentPage: 0,
            searchInput: "",
            orderBy: { createdAt: 1 },
            query: {
              routesCode: "",
              status: [],
              startPoint: "",
              endPoint: "",
            },
          })
    )
  );
  /**
   * Lấy dữ liệu Route
   */
  const browseRoute = useCallback(async () => {
    setIsFetching(true);
    let result = await ServiceBase.requestJson({
      method: "POST",
      url: "/routes/list",
      data: param.toJS(),
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      appParam[APP_MODULE.ROUTE] = param.toJS();
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
          _.map(result.value.data, (x) => {
            x.preDistance = _.get(x, "path.preDistance", "");
            x.distance = _.get(x, "path.distance", "");
            x.createdAt = checkMoment(x.createdAt).format(
              DATE_TIME_FORMAT.DD_MM_YYYY
            );
            let findedStatus = _.find(
              STATUS,
              (y) => x.status && y.value === x.status.toString()
            );
            if (findedStatus) {
              x.status = findedStatus.label;
              x.color = findedStatus.color;
              x.icon = findedStatus.icon;
            } else {
              x.status = "N/A";
              x.color = "red";
              x.icon = "fa-question-circle";
            }
            return x;
          })
        );
        return nextState;
      });
    }
    setIsFetching(false);
  }, [param]);

  const _onShowRouteModal = useCallback((payload) => {
    setModal((prevState) => {
      let nextState = prevState;
      nextState = nextState.set("actionName", payload.actionName);
      nextState = nextState.set("routeId", payload.routeId);
      nextState = nextState.set("isShow", payload.isShow);
      return nextState;
    });
  }, []);
  const _onDeleteRoute = useCallback(
    async (param) => {
      setIsFetching(true);
      let result = await ServiceBase.requestJson({
        method: "POST",
        url: "/routes/delete",
        data: param,
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        Ui.showSuccess({ message: "Xóa tuyến đường thành công." });
        _.delay(browseRoute, 300);
      }
      setIsFetching(false);
    },
    [browseRoute]
  );
  // Load data
  useEffect(() => {
    if (modal.get("isShow") === false) {
      clearTimeout(loadDataTimer);
      loadDataTimer = setTimeout(browseRoute, 300);
    }
    return () => {
      clearTimeout(loadDataTimer);
    };
  }, [browseRoute, modal]);

  return (
    <Grid container spacing={3}>
      <Helmet title="TUYẾN ĐƯỜNG">
        <meta name="description" content="Tuyến đường - Car Rental" />
      </Helmet>
      <Grid item xs={12}>
        <Portlet>
          <Filter
            setParam={setParam}
            onShowRouteModal={_onShowRouteModal}
            query={param.get("query")}
          />
          <PortletBody className="pt-0">
            <Spin spinning={isFetching} tip="Đang lấy dữ liệu...">
              <List
                grid={grid}
                setParam={setParam}
                onDeleteRoute={_onDeleteRoute}
                onShowRouteModal={_onShowRouteModal}
              />
            </Spin>
          </PortletBody>
        </Portlet>
      </Grid>
      <RouteModal modal={modal} onShowModal={_onShowRouteModal} />
    </Grid>
  );
});

export default withStyles({})(RouteManagement);
