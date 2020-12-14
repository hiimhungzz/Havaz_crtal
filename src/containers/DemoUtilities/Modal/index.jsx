import React, { memo, useCallback } from "react";
import { Drawer } from "antd";
import DrawerHead from "@Components/Modals/DemoBooking/DrawerHead";
import { withStyles } from "@material-ui/core/styles";
import UtilitiesInfo from "./Info";

const UtilitiesModal = ({ classes, modal, onShowModal }) => {
  const _onClose = useCallback(
    e => {
      if (e) {
        e.preventDefault();
      }
      onShowModal({ isShow: false, actionName: null, utilitiesId: null });
    },
    [onShowModal]
  );
  let title = "";
  if (modal.get("actionName") === "read") {
    title = "Chỉnh sửa thông tin tiện ích";
  } else {
    title = "Thêm tiện ích";
  }
  /**State */

  /** */

  return (
    <Drawer
      id="utilitiesModal"
      title={<DrawerHead onClose={_onClose} title={title} />}
      className={classes.utilitiesModal}
      width="55%"
      placement="right"
      closable={false}
      destroyOnClose
      visible={modal.get("isShow")}
      onClose={_onClose}
    >
      {modal.get("isShow") && (
        <UtilitiesInfo
          actionName={modal.get("actionName")}
          utilitiesId={modal.get("utilitiesId")}
          onShowModal={onShowModal}
        />
      )}
    </Drawer>
  );
};
const StyledUtilitiesModal = withStyles({
  utilitiesModal: {}
})(UtilitiesModal);

export default memo(StyledUtilitiesModal);
