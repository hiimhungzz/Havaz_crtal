import React, { memo, useState } from "react";
import { Tabs } from "antd";
import _ from "lodash";
import { withStyles } from "@material-ui/core/styles";
import { APP_MODULE } from "@Constants/common";
import { Grid, Paper } from "@material-ui/core";
import Helmet from "react-helmet";
import { compose } from "recompose";
import User from "./User";
import Role from "./Role";

const AccountManagement = ({ appParam, profile, classes }) => {
  const [tabId, setTabId] = useState("1");

  return (
    <Grid container spacing={3}>
      <Helmet title="TÀI KHOẢN">
        <meta name="description" content="Tài khoản - Car Rental" />
      </Helmet>
      <Grid item xs={12}>
        <Paper>
          <Tabs
            className={classes.tabRoot}
            onChange={setTabId}
            activeKey={tabId}
            tabBarGutter={1}
          >
            <Tabs.TabPane tab="TÀI KHOẢN" key="1">
              <User
                appParam={_.get(appParam, APP_MODULE.USER, null)}
                profile={profile}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="CHỨC DANH" key="2">
              <Role
                appParam={_.get(appParam, APP_MODULE.USER, null)}
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
)(AccountManagement);
