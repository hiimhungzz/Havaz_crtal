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
import ContractModal from "./Modal";
import { createStructuredSelector } from "reselect";
import { makeSelectAppConfig } from "redux/app/selectors";
import { connect } from "react-redux";
import { compose } from "recompose";
import moment from "moment";
import queryString from "query-string";
import { CONTRACT_TYPE } from "constants/common";
let loadDataTimer = null;

const ContractManagement = ({ appConfig, appParam }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [modal, setModal] = useState(
    Map({
      contractId: null,
      actionName: "",
      isShow: false,
    })
  );
  const [grid, setGrid] = useState(
    Map({
      data: [],
      totalLength: 1,
      totalPages: 1,
      currentPage: _.get(appParam[APP_MODULE.CONTRACT], "currentPage", 0) || 0,
      pageLimit: _.get(appParam[APP_MODULE.CONTRACT], "pageLimit", 5) || 5,
    })
  );
  const [param, setParam] = useState(
    Map({
      pageLimit: 5,
      currentPage: 0,
      searchInput: "",
      orderBy: { createdAt: 1 },
      ...appParam[APP_MODULE.CONTRACT],
      query: Map(
        _.get(appParam[APP_MODULE.CONTRACT], "query", {
          contractNumber: "",
          codeAndName: "",
          phoneAndAddress: "",
          contractType: undefined,
        })
      ),
    })
  );
  /**
   * Lấy dữ liệu Contract
   */
  const browseContract = useCallback(async () => {
    setIsFetching(true);
    let jsParam = param.toJS();
    let result = await ServiceBase.requestJson({
      method: "GET",
      url: URI.BROWSE_CONTRACT,
      data: jsParam,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      appParam[APP_MODULE.CONTRACT] = jsParam;
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
            x.signatureDate = checkMoment(x.signatureDate).format(
              DATE_TIME_FORMAT.DD_MM_YYYY
            );
            let findedStatus = _.find(
              appConfig.contractStatus,
              (s) => s.id === _.toString(x.status)
            );
            x.contractType = CONTRACT_TYPE[x.contractType];
            x.duration = `${_.get(x, "duration", 0)} tháng`;
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
  }, [appConfig.contractStatus, appParam, param]);

  const _onShowContractModal = useCallback((payload) => {
    setModal((prevState) => {
      let nextState = prevState;
      nextState = nextState.set("actionName", payload.actionName);
      nextState = nextState.set("contractId", payload.contractId);
      nextState = nextState.set("isShow", payload.isShow);
      return nextState;
    });
  }, []);
  const _onDeleteContract = useCallback(
    async (param) => {
      setIsFetching(true);
      let result = await ServiceBase.requestJson({
        method: "DELETE",
        url: `/contract/${param.uuid}/delete`,
        data: param,
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        Ui.showSuccess({ message: "Xóa hợp đồng thành công." });
        _.delay(browseContract, 300);
      }
      setIsFetching(false);
    },
    [browseContract]
  );
  // Load data
  useEffect(() => {
    if (modal.get("isShow") === false) {
      clearTimeout(loadDataTimer);
      loadDataTimer = setTimeout(browseContract, 300);
    }
  }, [browseContract, modal]);

  return (
    <Grid container spacing={3}>
      <Helmet title="HỢP ĐỒNG">
        <meta name="description" content="Hợp đồng - Car Rental" />
      </Helmet>
      <Grid item xs={12}>
        <Portlet>
          <Filter
            setParam={setParam}
            onShowContractModal={_onShowContractModal}
            query={param.get("query")}
          />
          <PortletBody className="pt-0">
            <Spin spinning={isFetching} tip="Đang lấy dữ liệu...">
              <List
                grid={grid}
                setParam={setParam}
                onDeleteContract={_onDeleteContract}
                onShowContractModal={_onShowContractModal}
              />
            </Spin>
          </PortletBody>
        </Portlet>
      </Grid>
      <ContractModal modal={modal} onShowModal={_onShowContractModal} />
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
)(ContractManagement);
