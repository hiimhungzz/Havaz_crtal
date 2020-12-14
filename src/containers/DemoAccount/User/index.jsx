import React, { memo, useState, useEffect, useCallback } from "react";
import { Spin, Tabs } from "antd";
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
import Filter from "./Filter";
import List from "./List";
import UserModal from "./Modal";
import { isEmpty } from "@Helpers/utility";
import { STATUS } from "@Constants/common";
let loadDataTimer = null;

const User = ({ profile, appParam }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [modal, setModal] = useState(
    Map({
      userId: null,
      actionName: "",
      isShow: false
    })
  );
  const [grid, setGrid] = useState(
    fromJS({
      data: [],
      totalLength: 0,
      totalPages: 0,
      currentPage: _.get(appParam, "currentPage", 0),
      pageLimit: _.get(appParam, "pageLimit", 0)
    })
  );
  const [param, setParam] = useState(
    appParam
      ? Map({ ...appParam, query: Map(appParam.query) })
      : Map({
          pageLimit: 5,
          currentPage: 0,
          searchInput: "",
          orderBy: { createdAt: 1 },
          query: Map({
            userCode: "",
            fullnamePhoneEmail: "",
            organizationIds: [],
            status: ["1"],
            rolesIds: []
          })
        })
  );
  /**
   * Lấy dữ liệu Account
   */
  const browseAccount = useCallback(async () => {
    let jsParam = param.toJS();
    let organizationIds = _.map(
      _.get(jsParam, "query.organizationIds", []),
      x => x.value
    );
    let rolesIds = _.map(_.get(jsParam, "query.rolesIds", []), x => x.key);
    _.set(jsParam, "query.organizationIds", organizationIds);
    _.set(jsParam, "query.rolesIds", rolesIds);
    setIsFetching(true);
    let result = await ServiceBase.requestJson({
      method: "POST",
      url: URI.BROWSE_USER,
      data: jsParam
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      let tempAppParam = isEmpty($LocalStorage.sls.getObject(APP_PARAM), {});
      tempAppParam[APP_MODULE.USER] = param.toJS();
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
            let createdAt = checkMoment(_.get(x, "createdAt"));
            let findedStatus = _.find(
              STATUS,
              st =>
                _.get(st, "value", "").toString() ===
                _.get(x, "status", "").toString()
            );

            _.set(x, "col_1", {
              usersCode: x.usersCode,
              createdAt: createdAt
                ? createdAt.format(DATE_TIME_FORMAT.DD_MM_YYYY)
                : createdAt
            });
            _.set(x, "col_3", {
              fullName: x.fullName,
              phoneNumber: x.phoneNumber,
              email: x.email
            });
            _.set(x, "col_4", {
              organizationIds: _.map(x.organizationIds, org =>
                _.get(org, "label")
              ),
              citiesName: x.citiesName
            });
            _.set(
              x,
              "rolesIds",
              _.map(x.rolesIds, org => _.get(org, "label"))
            );
            x.status = {
              name: _.get(findedStatus, "label", ""),
              color: _.get(findedStatus, "color", "red"),
              icon: _.get(findedStatus, "icon", "fa-question-circle")
            };
            return x;
          })
        );
        return nextState;
      });
    }
    setIsFetching(false);
  }, [appParam, param]);

  const _onShowUserModal = useCallback(payload => {
    setModal(prevState => {
      let nextState = prevState;
      nextState = nextState.set("actionName", payload.actionName);
      nextState = nextState.set("userId", payload.userId);
      nextState = nextState.set("isShow", payload.isShow);
      return nextState;
    });
  }, []);

  // Load data
  useEffect(() => {
    if (modal.get("isShow") === false) {
      clearTimeout(loadDataTimer);
      loadDataTimer = setTimeout(browseAccount, 300);
    }
  }, [browseAccount, modal]);

  return (
    <Portlet>
      <Filter
        setParam={setParam}
        onShowUserModal={_onShowUserModal}
        query={param.get("query")}
      />
      <PortletBody className="pt-0">
        <Spin spinning={isFetching} tip="Đang lấy dữ liệu...">
          <List
            grid={grid}
            setParam={setParam}
            onShowUserModal={_onShowUserModal}
          />
        </Spin>
      </PortletBody>
      <UserModal modal={modal} onShowModal={_onShowUserModal} />
    </Portlet>
  );
};
export default withStyles({})(User);
