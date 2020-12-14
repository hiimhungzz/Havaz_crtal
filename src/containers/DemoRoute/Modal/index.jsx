import React, { memo, useCallback } from "react";
import { Drawer } from "antd";
import DrawerHead from "@Components/Modals/DemoBooking/DrawerHead";
import { withStyles } from "@material-ui/core/styles";
import RouteInfo from "./Info";

const RouteModal = ({ classes, modal, onShowModal }) => {
  const _onClose = useCallback(
    e => {
      if (e) {
        e.preventDefault();
      }
      onShowModal({ isShow: false, actionName: null, routeId: null });
    },
    [onShowModal]
  );
  let title = "";
  if (modal.get("actionName") === "read") {
    title = "Chỉnh sửa thông tin tuyến";
  } else {
    title = "Thêm tuyến";
  }
  /**State */

  /** */

  return (
    <Drawer
      id="routeModal"
      title={<DrawerHead onClose={_onClose} title={title} />}
      className={classes.routeModal}
      width="65%"
      placement="right"
      closable={false}
      destroyOnClose
      visible={modal.get("isShow")}
      onClose={_onClose}
    >
      {modal.get("isShow") && (
        <RouteInfo
          actionName={modal.get("actionName")}
          routeId={modal.get("routeId")}
          onShowModal={onShowModal}
        />
      )}
    </Drawer>
  );
};
const StyledRouteModal = withStyles({
  routeModal: {}
})(RouteModal);

export default memo(StyledRouteModal);
