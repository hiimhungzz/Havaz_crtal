import React, { memo, useCallback } from "react";
import { Drawer } from "antd";
import DrawerHead from "@Components/Modals/DemoBooking/DrawerHead";
import { withStyles } from "@material-ui/core/styles";
import CorporateInfo from "./Info";

let drawerWidth = null;
const CorporateModal = ({ classes, modal, onShowModal }) => {
  const _onClose = useCallback(
    e => {
      if (e) {
        e.preventDefault();
      }
      onShowModal({ isShow: false, actionName: null, corporateId: null });
    },
    [onShowModal]
  );
  let title = "";
  if (modal.get("actionName") === "read") {
    title = "Chỉnh sửa thông tin doanh nghiệp";
  } else if (modal.get("actionName") === "add") {
    title = "Thêm doanh nghiệp";
  }
  /**State */

  /** */
  let width = null;
  if (modal.get("actionName") === "add") {
    drawerWidth = width = "45%";
  } else if (modal.get("actionName") === "read") {
    drawerWidth = width = "85%";
  } else {
    width = drawerWidth;
  }
  return (
    <Drawer
      id="corporateModal"
      title={<DrawerHead onClose={_onClose} title={title} />}
      className={classes.corporateModal}
      width={width}
      placement="right"
      closable={false}
      bodyStyle={{ padding: 0 }}
      destroyOnClose
      visible={modal.get("isShow")}
      onClose={_onClose}
    >
      {modal.get("isShow") && (
        <CorporateInfo
          actionName={modal.get("actionName")}
          corporateId={modal.get("corporateId")}
          corporateName={modal.get("corporateName")}
          onShowModal={onShowModal}
        />
      )}
    </Drawer>
  );
};
const StyledCorporateModal = withStyles({
  corporateModal: {}
})(CorporateModal);

export default memo(StyledCorporateModal);
