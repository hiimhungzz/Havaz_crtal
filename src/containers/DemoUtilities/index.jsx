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
import UtilitiesModal from "./Modal";

let loadDataTimer = null;

const UtilitiesManagement = memo(({ appParam }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [modal, setModal] = useState(
    Map({
      utilitiesId: null,
      actionName: "",
      isShow: false
    })
  );
  const [grid, setGrid] = useState(
    fromJS({
      data: [],
      total: 0,
      totalPages: 0,
      pages: _.get(appParam[APP_MODULE.UTILITIES], "pages", 0) || 0,
      pageSize: _.get(appParam[APP_MODULE.UTILITIES], "pageSize", 0) || 15
    })
  );
  const [param, setParam] = useState(
    appParam[APP_MODULE.UTILITIES]
      ? Map(appParam[APP_MODULE.UTILITIES])
      : Map({
          pageSize: 15,
          pages: 0,
          name: ""
        })
  );
  /**
   * Lấy dữ liệu Utilities
   */
  const browseUtilities = useCallback(async () => {
    setIsFetching(true);
    let result = await ServiceBase.requestJson({
      method: "GET",
      url: URI.BROWSE_UTILITIES,
      data: param.toJS()
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      appParam[APP_MODULE.UTILITIES] = param.toJS();
      $LocalStorage.sls.setObject(APP_PARAM, appParam);
      setGrid(prevState => {
        let nextState = prevState;
        let totalPages = calculateTotalPage(
          _.parseInt(_.get(result.value, "total", 0)),
          param.get("pageSize")
        );
        nextState = nextState.set(
          "total",
          _.parseInt(_.get(result.value, "total", 0))
        );
        nextState = nextState.set("pages", param.get("pages"));
        nextState = nextState.set("pageSize", param.get("pageSize"));
        nextState = nextState.set("totalPages", totalPages);
        nextState = nextState.set(
          "data",
          _.map(_.get(result.value, "docs", []), x => {
            x.parentName = _.get(x, "refParent.name", "");
            return x;
          })
        );
        return nextState;
      });
    }
    setIsFetching(false);
  }, [appParam, param]);

  const _onShowUtilitiesModal = useCallback(payload => {
    setModal(prevState => {
      let nextState = prevState;
      nextState = nextState.set("actionName", payload.actionName);
      nextState = nextState.set("utilitiesId", payload.utilitiesId);
      nextState = nextState.set("isShow", payload.isShow);
      return nextState;
    });
  }, []);
  const _onDeleteUtilities = useCallback(
    async param => {
      setIsFetching(true);
      let result = await ServiceBase.requestJson({
        method: "DELETE",
        url: `/categorySurvey/${param.id}`,
        data: {}
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        Ui.showSuccess({ message: "Xóa tiện ích thành công." });
        _.delay(browseUtilities, 300);
      }
      setIsFetching(false);
    },
    [browseUtilities]
  );
  // Load data
  useEffect(() => {
    if (modal.get("isShow") === false) {
      clearTimeout(loadDataTimer);
      loadDataTimer = setTimeout(browseUtilities, 300);
    }
  }, [browseUtilities, modal]);

  return (
    <Grid container spacing={3}>
      <Helmet title="TIÊU CHÍ">
        <meta name="description" content="Tiêu chí - Car Rental" />
      </Helmet>
      <Grid item xs={12}>
        <Portlet>
          <Filter
            setParam={setParam}
            onShowUtilitiesModal={_onShowUtilitiesModal}
            name={param.get("name")}
          />
          <PortletBody className="pt-0">
            <Spin spinning={isFetching} tip="Đang lấy dữ liệu...">
              <List
                grid={grid}
                setParam={setParam}
                onShowUtilitiesModal={_onShowUtilitiesModal}
                onDeleteUtilities={_onDeleteUtilities}
              />
            </Spin>
          </PortletBody>
        </Portlet>
      </Grid>
      <UtilitiesModal modal={modal} onShowModal={_onShowUtilitiesModal} />
    </Grid>
  );
});

export default withStyles({})(UtilitiesManagement);
