import React, { memo, useState } from "react";
import _ from "lodash";
import { withStyles } from "@material-ui/core/styles";
import { Tabs } from "antd";
import { APP_MODULE } from "@Constants/common";
import { Grid, Paper } from "@material-ui/core";
import Helmet from "react-helmet";
import { compose } from "recompose";
import Corporate from "./Corporate";
import Contract from "./Contract";
const Reconcilication = ({ appParam, profile, classes }) => {
  const [tabId, setTabId] = useState("1");

  return (
    <Grid container spacing={3}>
      <Helmet title="ĐỐI SOÁT DOANH NGHIỆP">
        <meta name="description" content="Đối soát doanh nghiệp - Car Rental" />
      </Helmet>
      <Grid item xs={12}>
        <Paper>
          <Tabs
            className={classes.tabRoot}
            onChange={setTabId}
            activeKey={tabId}
            tabBarGutter={1}
          >
            <Tabs.TabPane tab="DOANH THU - KHDN THUÊ XE" key="1">
              <Corporate
                appParam={_.get(
                  appParam,
                  APP_MODULE.CORPORATE_RECONCILIATION,
                  null
                )}
                profile={profile}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="DOANH THU THEO HỢP ĐỒNG" key="2">
              <Contract
                appParam={_.get(
                  appParam,
                  APP_MODULE.CONTRACT_RECONCILIATION,
                  null
                )}
                profile={profile}
              />
            </Tabs.TabPane>
          </Tabs>
        </Paper>
      </Grid>
    </Grid>
  );
};
export default compose(
  withStyles({
    tabRoot: {
      "& .ant-tabs-bar": {
        marginBottom: 0,
      },
    },
  }),
  memo
)(Reconcilication);
