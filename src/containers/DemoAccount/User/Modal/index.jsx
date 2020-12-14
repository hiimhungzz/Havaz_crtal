import React, { memo, useCallback } from "react";
import { Drawer } from "antd";
import DrawerHead from "@Components/Modals/DemoBooking/DrawerHead";
import { withStyles } from "@material-ui/core/styles";
import UserInfo from "./Info";

const UserModal = ({ classes, modal, onShowModal }) => {
  const _onClose = useCallback(
    (e) => {
      if (e) {
        e.preventDefault();
      }
      onShowModal({ isShow: false, actionName: null, userId: null });
    },
    [onShowModal]
  );
  let title = "";
  if (modal.get("actionName") === "read") {
    title = "Chỉnh sửa thông tin tài khoản";
  } else {
    title = "Thêm tài khoản";
  }
  /**State */

  /** */

  return (
    <Drawer
      id="userModal"
      title={<DrawerHead onClose={_onClose} title={title} />}
      className={classes.userModal}
      width="60%"
      placement="right"
      closable={false}
      destroyOnClose
      visible={modal.get("isShow")}
      onClose={_onClose}
    >
      {modal.get("isShow") && (
        <UserInfo
          actionName={modal.get("actionName")}
          userId={modal.get("userId")}
          onShowModal={onShowModal}
        />
      )}
    </Drawer>
  );
};
const StyledUserModal = withStyles({
  userModal: {},
})(UserModal);

export default memo(StyledUserModal);
