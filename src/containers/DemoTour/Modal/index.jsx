import React, { memo, useCallback } from "react";
import { Drawer } from "antd";
import DrawerHead from "@Components/Modals/DemoBooking/DrawerHead";
import { withStyles } from "@material-ui/core/styles";
import TourInfo from "./Info";

const TourModal = ({ classes, modal, onShowModal }) => {
  const _onClose = useCallback(
    e => {
      if (e) {
        e.preventDefault();
      }
      onShowModal({ isShow: false, actionName: null, tourId: null });
    },
    [onShowModal]
  );
  let title = "";
  if (modal.get("actionName") === "read") {
    title = "Chỉnh sửa thông tin tour";
  } else {
    title = "Thêm tour";
  }
  /**State */

  /** */

  return (
    <Drawer
      id="tourModal"
      title={<DrawerHead onClose={_onClose} title={title} />}
      className={classes.tourModal}
      width="75%"
      placement="right"
      closable={false}
      destroyOnClose
      visible={modal.get("isShow")}
      onClose={_onClose}
    >
      {modal.get("isShow") && (
        <TourInfo
          actionName={modal.get("actionName")}
          tourId={modal.get("tourId")}
          onShowModal={onShowModal}
        />
      )}
    </Drawer>
  );
};
const StyledTourModal = withStyles({
  tourModal: {}
})(TourModal);

export default memo(StyledTourModal);
