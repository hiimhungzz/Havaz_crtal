import React, { useState, useEffect, useCallback, memo } from "react";
import { Spin, Drawer, Button, Icon } from "antd";
import PortletHead from "@Components/Portlet/PortletHead";
import DrawerHead from "@Components/Modals/DemoBooking/DrawerHead";
import _ from "lodash";
import { withStyles } from "@material-ui/core/styles";
import { Ui } from "@Helpers/Ui";
import Portlet from "@Components/Portlet";
import PortletBody from "@Components/Portlet/PortletBody";
import { fromJS, Map } from "immutable";
import { calculateTotalPage } from "@Helpers/utility";
import ServiceBase from "@Services/ServiceBase";
import { URI } from "./constants";
import List from "./List";
import RoleModal from "./Modal";
import A from "@Components/A";
import { Grid } from "@material-ui/core";
import { Input, Select } from "antd";
import Role from "components/SelectContainer/Role";
import AddRole from "./AddRole";

let loadDataTimer = null;

const RoleManagement = memo(({ appParam, query }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [isShowModalCreate, setShowModalCreate] = useState(false);
  const [modal, setModal] = useState(
    Map({
      roleId: null,
      actionName: "",
      isShow: false,
    })
  );
  const [grid, setGrid] = useState(
    fromJS({
      data: [],
      totalLength: 0,
      totalPages: 0,
      currentPage: _.get(appParam, "currentPage", 0),
      pageLimit: _.get(appParam, "pageLimit", 0),
    })
  );
  const [param, setParam] = useState(
    Map({
      pageLimit: 5,
      currentPage: 0,
      searchInput: "",
      orderBy: { createdAt: 1 },
    })
  );

  /**
   * Lấy dữ liệu Role
   */

  const browseRole = useCallback(async () => {
    let jsParam = param.toJS();
    setIsFetching(true);
    let result = await ServiceBase.requestJson({
      method: "POST",
      url: URI.BROWSE_ROLE,
      data: jsParam,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
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

        nextState = nextState.set("data", result.value.data);
        return nextState;
      });
    }
    setIsFetching(false);
  }, [param]);

  const _onShowRoleModal = useCallback((payload) => {
    setModal((prevState) => {
      let nextState = prevState;
      nextState = nextState.set("actionName", payload.actionName);
      nextState = nextState.set("roleId", payload.roleId);
      nextState = nextState.set("isShow", payload.isShow);
      return nextState;
    });
  }, []);
  const onSave = useCallback(async (values) => {
    console.log(`role`, values);
    let result = await ServiceBase.requestJson({
      method: "POST",
      url: "roles/create",
      data: {
        name: values.name,
        code: values.code,
        organizationId: values.organizationId.key,
        parentId: values.parentId.key,
        level: values.level,
      },
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setShowModalCreate(false);
      Ui.showSuccess({ message: "Thêm mới chức danh thành công." });
    }

    browseRole();
  }, []);

  // Load data
  useEffect(() => {
    if (modal.get("isShow") === false) {
      clearTimeout(loadDataTimer);
      loadDataTimer = setTimeout(browseRole, 300);
    }
  }, [browseRole, modal]);

  return (
    <>
      <Portlet>
        <PortletHead className="border-bottom-0">
          <div className="kt-portlet__head-label"></div>
          <div className="kt-portlet__head-toolbar">
            <div className="kt-portlet__head-wrapper">
              <button
                onClick={() => setShowModalCreate(true)}
                type="button"
                className="ml-1 btn btn-brand btn-icon-sm"
              >
                <i className="flaticon2-plus" />
                Thêm chức danh
              </button>
            </div>
          </div>
        </PortletHead>
        <PortletBody>
          <Spin spinning={isFetching} tip="Đang lấy dữ liệu...">
            <List
              grid={grid}
              setParam={setParam}
              onShowRoleModal={_onShowRoleModal}
            />
          </Spin>
        </PortletBody>
        <RoleModal modal={modal} onShowModal={_onShowRoleModal} />
      </Portlet>
      <Drawer
        id="modalRole"
        title={
          <DrawerHead
            onClose={() => setShowModalCreate(false)}
            title={"Thêm mới chức danh"}
          />
        }
        width="720px"
        placement="right"
        closable={false}
        destroyOnClose
        visible={isShowModalCreate}
        onClose={() => setShowModalCreate(false)}
      >
        <AddRole
          onSave={(values) => {
            onSave(values);
          }}
          onClose={() => setShowModalCreate(false)}
        />
      </Drawer>
    </>
  );
});

export default withStyles({})(RoleManagement);
