import React, { memo, useState, useCallback } from "react";
import { withStyles } from "@material-ui/core";
import { Tabs } from "antd";
import { createStructuredSelector } from "reselect";
import { makeSelectAppConfig } from "redux/app/selectors";
import { compose } from "recompose";
import { connect } from "react-redux";
import Detail from "./Detail";
import Add from "./Add";
import Account from "./Account";
import RentVehicle from "./RentVehicle";
const CorporateInfo = ({ corporateId, onShowModal, actionName, classes }) => {
  const [tabId, setTabId] = useState("1");
  /**
   * _handleChangeTabId: Thay đổi tabId
   * @param {string} tabId tabId
   */
  const _handleChangeTabId = useCallback((tabId) => {
    setTabId(tabId);
  }, []);
  //----------------------

  return (
    <div className={classes.info}>
      <div className="content">
        {actionName === "read" ? (
          <Tabs type="card" onChange={_handleChangeTabId} activeKey={tabId}>
            <Tabs.TabPane tab="Chi tiết" key="1">
              <Detail corporateId={corporateId} onShowModal={onShowModal} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Danh sách tài khoản" key="2">
              <Account corporateId={corporateId} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Danh sách xe thuê" key="3">
              <RentVehicle corporateId={corporateId} />
            </Tabs.TabPane>
          </Tabs>
        ) : (
          <Add corporateId={corporateId} onShowModal={onShowModal} />
        )}
      </div>
    </div>
  );
};
const mapStateToProps = createStructuredSelector({
  appConfig: makeSelectAppConfig(),
});

export default compose(
  memo,
  connect(mapStateToProps, null),
  withStyles({
    info: {
      "& .ant-tabs": {
        position: "inherit",
      },
      paddingBottom: 55,
      "& .action": {
        position: "absolute",
        left: 0,
        bottom: 0,
        width: "100%",
        borderTop: "1px solid #e9e9e9",
        padding: "5px 16px",
        background: "#fff",
        textAlign: "left",
      },
      "& .content": {},
    },
  })
)(CorporateInfo);
