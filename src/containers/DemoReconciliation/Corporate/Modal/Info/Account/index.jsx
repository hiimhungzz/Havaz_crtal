import React, { memo, useCallback, useState, useEffect } from "react";
import { Input, Table, Divider } from "antd";
import { withStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import classNames from "classnames";
import ServiceBase from "@Services/ServiceBase";
import { URI } from "../../../constants";
import { Ui } from "@Helpers/Ui";
import { Map, fromJS } from "immutable";
import _ from "lodash";
import City from "components/SelectContainer/City";
import AccountList from "./List";
const Account = memo(({ corporateId, actionName, classes }) => {
  const [
    readCorporateAccountListFetching,
    setReadCorporateAccountListFetching
  ] = useState(false);

  const [param, setParam] = useState(
    Map({
      searchInput: "",
      pageLimit: 10,
      currentPage: 0,
      query: Map(),
      order: { createdAt: 1 }
    })
  );
  const [accounts, setAccounts] = useState(
    Map({
      data: [
        {
          id: "1",
          accountName: "HĐ/SS-2020-01",
          corporateName: "Samsung Việt Nam",
          corporatePhone: "0988289272",
          roleName: "CEO",
          status: "Hoạt động"
        }
      ],
      totalLength: 1,
      totalPages: 1,
      currentPage: 0,
      pageLimit: 5
    })
  );
  const _handleChangeInput = useCallback(
    e => {
      let name = _.get(e, "target.name");
      let value = _.get(e, "target.value");
      setParam(prevState => prevState.setIn(["query", name], value));
    },
    [setParam]
  );

  useEffect(() => {
    if (corporateId) {
      let jsParam = param.toJS();
      _.set(jsParam, "query.corporateId", corporateId);
      _.delay(async () => {
        setReadCorporateAccountListFetching(true);
        let result = await ServiceBase.requestJson({
          url: URI.READ_CORPORATE,
          method: "POST",
          data: jsParam
        });
        if (result.hasErrors) {
          Ui.showErrors(result.errors);
        } else {
          let rs = result.value.data;
          setAccounts(fromJS(rs));
        }
        setReadCorporateAccountListFetching(false);
      }, 600);
    } else {
    }
  }, [corporateId, param]);
  let query = param.get("query");
  return (
    <Container maxWidth={false} className={classes.container}>
      <Grid container spacing={1}>
        <Grid item xs={2}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <label>Tên người dùng</label>
            </Grid>
            <Grid item xs={12}>
              <Input
                value={query.get("fullName")}
                name="fullName"
                onChange={_handleChangeInput}
                placeholder="Nhập tên người dùng"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <label>Công ty</label>
            </Grid>
            <Grid item xs={12}>
              <Input
                value={query.get("corporateName")}
                name="corporateName"
                onChange={_handleChangeInput}
                placeholder="Nhập tên công ty"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <label>Chức danh</label>
            </Grid>
            <Grid item xs={12}>
              <Input
                value={query.get("roleName")}
                name="roleName"
                onChange={_handleChangeInput}
                placeholder="Nhập tên chức danh"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <label>SĐT liên hệ</label>
            </Grid>
            <Grid item xs={12}>
              <Input
                value={query.get("contactPhone")}
                name="contactPhone"
                onChange={_handleChangeInput}
                placeholder="Nhập SĐT"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <label>Email công ty</label>
            </Grid>
            <Grid item xs={12}>
              <Input
                value={query.get("corporateEmail")}
                name="corporateEmail"
                onChange={_handleChangeInput}
                placeholder="Nhập email công ty"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid className="pt-5" item xs={12}>
          <h5>Danh sách tài khoản đã cấp</h5>
          <Divider className="mt-0" type="horizontal" />
          <AccountList grid={accounts} setParam={setParam} />
          <Divider type="horizontal" />
        </Grid>
      </Grid>
    </Container>
  );
});
export default withStyles(theme => ({
  container: {
    padding: theme.spacing(2)
  }
}))(Account);
