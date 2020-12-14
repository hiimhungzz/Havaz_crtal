import React from "react";
import { Modal } from "antd";

const ChangeStatusModal = React.memo(({ open, isMou, onConfirm, onClose }) => {
  return (
    <Modal
      closable={false}
      visible={open}
      onOk={e => onConfirm(302)}
      onCancel={onClose}
      okText="Xác nhận"
      cancelText="Từ chối"
    >
      <p>{`KH này ${
        isMou ? "đã có" : "chưa có bất kỳ"
      } Hợp đồng nguyên tắc (Biên bản ghi nhớ - MOU) hoặc Dữ liệu thanh toán nào. Bạn
                có xác nhận chuyển điều phối thủ công không?`}</p>
    </Modal>
  );
});
export default ChangeStatusModal;
