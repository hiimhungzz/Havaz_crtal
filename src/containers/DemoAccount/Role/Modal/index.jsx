import React, { memo, useCallback } from "react";
import { Drawer } from "antd";
import DrawerHead from "@Components/Modals/DemoBooking/DrawerHead";
import { withStyles } from "@material-ui/core/styles";
import RoleInfo from "./Info";

const RoleModal = ({ classes, modal, onShowModal }) => {
  const _onClose = useCallback(
    (e) => {
      if (e) {
        e.preventDefault();
      }
      onShowModal({ isShow: false, actionName: null, roleId: null });
    },
    [onShowModal]
  );
  let title = "";
  if (modal.get("actionName") === "read") {
    title = "Chỉnh sửa thông tin chức danh";
  } else {
    title = "Thêm chức danh";
  }
  /**State */

  /** */

  return (
    <Drawer
      id="roleModal"
      title={<DrawerHead onClose={_onClose} title={title} />}
      className={classes.roleModal}
      width="60%"
      placement="right"
      closable={false}
      destroyOnClose
      visible={modal.get("isShow")}
      onClose={_onClose}
    >
      {modal.get("isShow") && (
        <RoleInfo
          actionName={modal.get("actionName")}
          roleId={modal.get("roleId")}
          onShowModal={onShowModal}
        />
      )}
    </Drawer>
  );
};
const StyledRoleModal = withStyles({
  roleModal: {},
})(RoleModal);

export default memo(StyledRoleModal);
