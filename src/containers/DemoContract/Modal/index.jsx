import React, { memo, useCallback } from "react";
import { Drawer } from "antd";
import DrawerHead from "@Components/Modals/DemoBooking/DrawerHead";
import { withStyles } from "@material-ui/core/styles";
import ContractInfo from "./Info";

const ContractModal = ({ classes, modal, onShowModal }) => {
  const _onClose = useCallback(
    e => {
      if (e) {
        e.preventDefault();
      }
      onShowModal({ isShow: false, actionName: null, contractId: null });
    },
    [onShowModal]
  );
  let title = "";
  if (modal.get("actionName") === "read") {
    title = "Thông tin hợp đồng";
  } else {
    title = "Thêm hợp đồng";
  }
  /**State */

  /** */
  
  return (
    <Drawer
      id="contractModal"
      title={<DrawerHead onClose={_onClose} title={title} />}
      className={classes.contractModal}
      width="90%"
      placement="right"
      closable={false}
      destroyOnClose
      visible={modal.get("isShow")}
      onClose={_onClose}
    >
      {modal.get("isShow") && (
        <ContractInfo
          actionName={modal.get("actionName")}
          contractId={modal.get("contractId")}
          onShowModal={onShowModal}
        />
      )}
    </Drawer>
  );
};
const StyledContractModal = withStyles({
  contractModal: {}
})(ContractModal);

export default memo(StyledContractModal);
