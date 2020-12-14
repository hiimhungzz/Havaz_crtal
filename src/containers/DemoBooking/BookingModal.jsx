import React, { memo, useState, useCallback, useEffect } from "react";
import { Tabs, Drawer } from "antd";
import _ from "lodash";
import DrawerHead from "@Components/Modals/DemoBooking/DrawerHead";
import DrawerTabs from "@Components/Modals/DemoBooking/DrawerTabs";
import DrawerTabPane from "@Components/Modals/DemoBooking/DrawerTabPane";
import BookingInfo from "./BookingInfo";
import BookingExpenses from "./BookingExpenses";
import BookingTempo from "./BookingTempo";
import StatisticalCostForTrip from "./StatisticalCostForTrip";
import PrintedVotes from "./PrintedVotes";
import { withStyles } from "@material-ui/core/styles";
const { TabPane } = Tabs;

const BookingModal = ({ classes, modal, onSetModal, onShowModal }) => {
  let actionName = modal.get("actionName");
  let isShow = modal.get("isShow");
  let bookingId = modal.get("bookingId");
  let tripId = modal.get("tripId");
  const status = modal.get("bookingStatus");
  const [bookingStatus, setBookingStatus] = useState(0);
  const [tabId, setTabId] = useState("1");
  const onClose = useCallback(
    e => {
      if (e) {
        e.preventDefault();
      }
      onShowModal({ isShow: false, actionName: null, bookingId: null });
    },
    [onShowModal]
  );
  let title = "";
  if (actionName === "read") {
    title = "Chỉnh sửa phiếu yêu cầu khách hàng";
  } else {
    title = "Phiếu yêu cầu khách hàng";
  }
  useEffect(() => {
    let currentTab = status ? (status.toString() === "300" ? "6" : "1") : "1";
    setTabId(currentTab);
  }, [status]);

  return (
    <Drawer
      id="bookingModal"
      title={
        <DrawerHead id="drawer-portlet__head" onClose={onClose} title={title} />
      }
      className={classes.bookingModal}
      width="97%"
      placement="right"
      closable={false}
      visible={isShow}
      onClose={onClose}
      destroyOnClose={onClose}
    >
      <DrawerTabs
        activeKey={tabId}
        onChange={setTabId}
        defaultActiveKey="1"
        className={classes.positionInherit}
      >
        {status && _.toString(status) === "300" && (
          <TabPane
            tab={
              <DrawerTabPane
                tabName="Chuyển đơn vị báo giá"
                icon="fa fa-money-check"
              />
            }
            key="6"
          >
            <BookingTempo onClose={onClose} bookingId={bookingId} />
          </TabPane>
        )}
        <TabPane
          tab={
            <DrawerTabPane
              tabName="Thông tin booking"
              icon="fa fa-address-card"
            />
          }
          key="1"
        >
          {tabId === "1" && isShow && (
            <BookingInfo
              onClose={onClose}
              bookingId={bookingId}
              tripId={tripId}
              actionName={actionName}
              onSetBookingStatus={setBookingStatus}
              onChangeActionName={name =>
                onSetModal(prevState => prevState.set("actionName", name))
              }
            />
          )}
        </TabPane>
        <TabPane
          tab={<DrawerTabPane tabName="Chi phí" icon="fa fa-money-check" />}
          key="2"
        >
          {tabId === "2" && (
            <BookingExpenses onClose={onClose} bookingId={bookingId} />
          )}
        </TabPane>
        <TabPane
          tab={
            <DrawerTabPane
              tabName="Bảng kê doanh thu chi phí"
              icon="fa fa-chart-line"
            />
          }
          key="4"
        >
          <StatisticalCostForTrip
            bookingId={bookingId}
            bookingStatus={bookingStatus}
            onSetBookingStatus={setBookingStatus}
          />
        </TabPane>
        <TabPane
          tab={
            <DrawerTabPane
              tabName="Phiếu in"
              icon="fa fa-print"
              destroyOnClose={onClose}
            />
          }
          key="5"
        >
          <PrintedVotes bookingId={bookingId} bookingStatus={bookingStatus} />
        </TabPane>
      </DrawerTabs>
    </Drawer>
  );
};
const StyledBookingModal = withStyles({
  bookingModal: {
    "& .ant-drawer-content": {
      overflow: "hidden",
      "& .ant-drawer-header": {
        position: "sticky",
        top: 0,
        height: 60,
        background: "#f5f8fa",
        borderTop: "1px solid #cbd6e2",
        opacity: 1,
        zIndex: 301,
        "& .ant-drawer-title": {
          width: "fit-content"
        }
      },
      "& .ant-drawer-body": {
        padding: "70px 15px 90px 15px",
        "& .bookingInfo__action": {
          position: "absolute",
          bottom: 0,
          left: 0,
          background: "#f5f8fa",
          zIndex: "301",
          width: "calc(100% - 15px)",
          height: 60,
          border: "1px solid #e8e8e8"
        }
      }
    }
  },
  positionInherit: {
    position: "inherit"
  }
})(BookingModal);

export default memo(StyledBookingModal);
