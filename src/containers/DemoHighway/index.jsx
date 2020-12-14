import React, { memo, useState, useEffect, useCallback } from "react";
import { Spin } from "antd";
import _ from "lodash";
import { withStyles } from "@material-ui/core/styles";
import { Ui } from "@Helpers/Ui";
import Portlet from "@Components/Portlet";
import PortletBody from "@Components/Portlet/PortletBody";
import { fromJS, Map } from "immutable";
import { calculateTotalPage } from "helpers/utility";
import { APP_MODULE } from "constants/common";
import ServiceBase from "@Services/ServiceBase";
import { APP_PARAM } from "@Constants";
import { URI } from "./constants";
import { $LocalStorage } from "helpers/localStorage";
import { Grid } from "@material-ui/core";
import Helmet from "react-helmet";
import Filter from "./Filter";
import List from "./List";
import RouteModal from "./Modal";

let loadDataTimer = null;

const HighwayManagement = memo(({ appParam }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [modal, setModal] = useState(
    Map({
      highwayId: null,
      actionName: "",
      isShow: false
    })
  );
  const [grid, setGrid] = useState(
    fromJS({
      data: [],
      totalLength: 0,
      totalPages: 0,
      currentPage: appParam[APP_MODULE.HIGHWAY]
        ? appParam[APP_MODULE.HIGHWAY].currentPage || 0
        : 0,
      pageLimit: appParam[APP_MODULE.HIGHWAY]
        ? appParam[APP_MODULE.HIGHWAY].pageLimit || 0
        : 0
    })
  );
  const [param, setParam] = useState(
    fromJS(
      appParam[APP_MODULE.HIGHWAY]
        ? fromJS({
            ...appParam[APP_MODULE.HIGHWAY]
          })
        : fromJS({
            pageLimit: 5,
            currentPage: 0,
            searchInput: "",
            orderBy: { name: 1 },
            query: {
              code: ""
            }
          })
    )
  );
  /**
   * Lấy dữ liệu Route
   */
  const browseHighway = useCallback(async () => {
    setIsFetching(true);
    let result = await ServiceBase.requestJson({
      method: "POST",
      url: URI.BROWSE_HIGHWAY,
      data: param.toJS()
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      appParam[APP_MODULE.HIGHWAY] = param.toJS();
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
        nextState = nextState.set("data", result.value.data);
        return nextState;
      });
    }
    setIsFetching(false);
  }, [appParam, param]);

  const _onShowHighwayModal = useCallback(payload => {
    setModal(prevState => {
      let nextState = prevState;
      nextState = nextState.set("actionName", payload.actionName);
      nextState = nextState.set("highwayId", payload.highwayId);
      nextState = nextState.set("isShow", payload.isShow);
      return nextState;
    });
  }, []);
  const _onDeleteHighway = useCallback(
    async param => {
      setIsFetching(true);
      let result = await ServiceBase.requestJson({
        method: "POST",
        url: "/routes/highway/delete",
        data: param
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        Ui.showSuccess({ message: "Xóa cao tốc thành công." });
        _.delay(browseHighway, 300);
      }
      setIsFetching(false);
    },
    [browseHighway]
  );
  // Load data
  useEffect(() => {
    if (modal.get("isShow") === false) {
      clearTimeout(loadDataTimer);
      loadDataTimer = setTimeout(browseHighway, 300);
    }
  }, [browseHighway, modal]);

  return (
    <Grid container spacing={3}>
      <Helmet title="CAO TỐC">
        <meta name="description" content="Cao tốc - Car Rental" />
      </Helmet>
      <Grid item xs={12}>
        <Portlet>
          <Filter
            setParam={setParam}
            onShowHighwayModal={_onShowHighwayModal}
            query={param.get("query")}
          />
          <PortletBody className="pt-0">
            <Spin spinning={isFetching} tip="Đang lấy dữ liệu...">
              <List
                grid={grid}
                setParam={setParam}
                onDeleteHighway={_onDeleteHighway}
                onShowHighwayModal={_onShowHighwayModal}
              />
            </Spin>
          </PortletBody>
        </Portlet>
      </Grid>
      <RouteModal modal={modal} onShowModal={_onShowHighwayModal} />
    </Grid>
  );
});

export default withStyles({})(HighwayManagement);
