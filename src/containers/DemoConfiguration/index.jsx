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
import ConfigurationModal from "./Modal";

let loadDataTimer = null;

const ConfigurationManagement = memo(({ appParam }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [modal, setModal] = useState(
    Map({
      configurationId: null,
      actionName: "",
      isShow: false
    })
  );
  const [grid, setGrid] = useState(
    fromJS({
      data: [],
      total: 0,
      totalPages: 0,
      pages: _.get(appParam[APP_MODULE.CONFIGURATION], "pages", 0) || 0,
      pageSize: _.get(appParam[APP_MODULE.CONFIGURATION], "pageSize", 0) || 15
    })
  );
  const [param, setParam] = useState(
    appParam[APP_MODULE.CONFIGURATION]
      ? Map(appParam[APP_MODULE.CONFIGURATION])
      : Map({
          pageSize: 15,
          pages: 0,
          name: ""
        })
  );
  /**
   * Lấy dữ liệu Configuration
   */
  const browseConfiguration = useCallback(async () => {
    setIsFetching(true);
    let result = await ServiceBase.requestJson({
      method: "GET",
      url: URI.BROWSE_CONFIGURATION,
      data: param.toJS()
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      appParam[APP_MODULE.CONFIGURATION] = param.toJS();
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

  const _onShowConfigurationModal = useCallback(payload => {
    setModal(prevState => {
      let nextState = prevState;
      nextState = nextState.set("actionName", payload.actionName);
      nextState = nextState.set("configurationId", payload.configurationId);
      nextState = nextState.set("isShow", payload.isShow);
      return nextState;
    });
  }, []);
  // Load data
  useEffect(() => {
    if (modal.get("isShow") === false) {
      clearTimeout(loadDataTimer);
      loadDataTimer = setTimeout(browseConfiguration, 300);
    }
  }, [browseConfiguration, modal]);

  return (
    <Grid container spacing={3}>
      <Helmet title="CẤU HÌNH">
        <meta name="description" content="Cấu hình - Car Rental" />
      </Helmet>
      <Grid item xs={12}>
        <Portlet>
          <Filter
            setParam={setParam}
            onShowConfigurationModal={_onShowConfigurationModal}
            name={param.get("name")}
          />
          <PortletBody className="pt-0">
            <Spin spinning={isFetching} tip="Đang lấy dữ liệu...">
              <List
                grid={grid}
                setParam={setParam}
                onShowConfigurationModal={_onShowConfigurationModal}
              />
            </Spin>
          </PortletBody>
        </Portlet>
      </Grid>
      <ConfigurationModal
        modal={modal}
        onShowModal={_onShowConfigurationModal}
      />
    </Grid>
  );
});

export default withStyles({})(ConfigurationManagement);
