import React, { memo, useCallback } from "react";
import { Drawer } from "antd";
import DrawerHead from "@Components/Modals/DemoBooking/DrawerHead";
import { withStyles } from "@material-ui/core/styles";
import HighwayInfo from "./Info";

const HighwayModal = ({ classes, modal, onShowModal }) => {
  const _onClose = useCallback(
    e => {
      if (e) {
        e.preventDefault();
      }
      onShowModal({ isShow: false, actionName: null, highwayId: null });
    },
    [onShowModal]
  );
  let title = "";
  if (modal.get("actionName") === "read") {
    title = "Chỉnh sửa thông tin cao tốc";
  } else {
    title = "Thêm cao tốc";
  }
  /**State */

  /** */

  return (
    <Drawer
      id="highwayModal"
      title={<DrawerHead onClose={_onClose} title={title} />}
      className={classes.highwayModal}
      width="50%"
      placement="right"
      closable={false}
      destroyOnClose
      visible={modal.get("isShow")}
      onClose={_onClose}
    >
      {modal.get("isShow") && (
        <HighwayInfo
          actionName={modal.get("actionName")}
          highwayId={modal.get("highwayId")}
          onShowModal={onShowModal}
        />
      )}
    </Drawer>
  );
};
const StyledHighwayModal = withStyles({
  highwayModal: {}
})(HighwayModal);

export default memo(StyledHighwayModal);
