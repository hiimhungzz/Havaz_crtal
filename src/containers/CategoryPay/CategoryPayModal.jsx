import React, { memo } from "react";
import { Drawer } from "antd";
import DrawerHead from "@Components/Modals/DemoBooking/DrawerHead";
import PartnerPayment from "./PartnerPayment";

const CategoryPayModal = ({ showModal, onShowModal, month, year }) => {
  const onClose = e => {
    if (e) {
      e.preventDefault();
    }
    onShowModal({ isShow: false });
  };
  return (
    <Drawer
      id="categoryPayModal"
      title={
        <DrawerHead
          id="drawer-portlet__head"
          onClose={onClose}
          title="Thông tin quyết toán"
        />
      }
      width="95%"
      placement="right"
      closable={false}
      bodyStyle={{ paddingBottom: 80 }}
      visible={showModal.isShow}
      onClose={onClose}
    >
      <PartnerPayment
        vehicleId={showModal.vehicleId}
        month={month}
        year={year}
        onClose={onClose}
      />
    </Drawer>
  );
};
export default memo(CategoryPayModal);
