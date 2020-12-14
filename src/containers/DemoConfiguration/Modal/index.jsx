import React, { memo, useCallback } from "react";
import { Drawer } from "antd";
import DrawerHead from "@Components/Modals/DemoBooking/DrawerHead";
import { withStyles } from "@material-ui/core/styles";
import ConfigurationInfo from "./Info";

const ConfigurationModal = ({ classes, modal, onShowModal }) => {
  const _onClose = useCallback(
    e => {
      if (e) {
        e.preventDefault();
      }
      onShowModal({ isShow: false, actionName: null, configurationId: null });
    },
    [onShowModal]
  );
  let title = "";
  if (modal.get("actionName") === "read") {
    title = "Chỉnh sửa thông tin cấu hình";
  } else {
    title = "Thêm cấu hình";
  }
  /**State */

  /** */

  return (
    <Drawer
      id="configurationModal"
      title={<DrawerHead onClose={_onClose} title={title} />}
      className={classes.configurationModal}
      width="55%"
      placement="right"
      closable={false}
      destroyOnClose
      visible={modal.get("isShow")}
      onClose={_onClose}
    >
      {modal.get("isShow") && (
        <ConfigurationInfo
          actionName={modal.get("actionName")}
          configurationId={modal.get("configurationId")}
          onShowModal={onShowModal}
        />
      )}
    </Drawer>
  );
};
const StyledConfigurationModal = withStyles({
  configurationModal: {}
})(ConfigurationModal);

export default memo(StyledConfigurationModal);
