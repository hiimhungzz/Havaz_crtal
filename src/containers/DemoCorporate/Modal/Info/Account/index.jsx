import React, { memo, useCallback, useState, useEffect } from "react";
import { Input, Table, Divider, Spin, Select } from "antd";
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
import { calculateTotalPage } from "helpers/utility";
import { STATUS } from "constants/common";
import Role from "components/SelectContainer/Role";
let timer = null;
const Account = memo(({ corporateId, corporateName, actionName, classes }) => {
  const [
    readCorporateAccountListFetching,
    setReadCorporateAccountListFetching,
  ] = useState(false);

  const [param, setParam] = useState(
    Map({
      searchInput: "",
      pageLimit: 10,
      currentPage: 0,
      query: Map({
        userCode: "",
        fullnamePhoneEmail: "",
        organizationIds: [],
        status: ["1"],
        rolesIds: [],
      }),
      order: { createdAt: 1 },
    })
  );
  const [accounts, setAccounts] = useState(
    Map({
      data: [],
      totalLength: 0,
      totalPages: 0,
      currentPage: 0,
      pageLimit: 10,
    })
  );
  const _changeQuery = useCallback(
    (payload) => {
      setParam((prevState) => {
        let nextState = prevState;
        nextState = nextState.setIn(["query", payload.name], payload.value);
        return nextState;
      });
    },
    [setParam]
  );

  useEffect(() => {
    if (corporateId) {
      let jsParam = param.toJS();
      let rolesIds = _.map(_.get(jsParam, "query.rolesIds", []), (x) => x.key);
      _.set(jsParam, "query.rolesIds", rolesIds);
      _.set(jsParam, "query.organizationIds", [corporateId]);
      clearTimeout(timer);
      timer = setTimeout(async () => {
        setReadCorporateAccountListFetching(true);
        let result = await ServiceBase.requestJson({
          url: "/users/list",
          method: "POST",
          data: jsParam,
        });
        if (result.hasErrors) {
          Ui.showErrors(result.errors);
        } else {
          setAccounts((prevState) => {
            let nextState = prevState;
            let totalPages = calculateTotalPage(
              _.get(result, "value.totalLength"),
              _.get(jsParam, "pageLimit")
            );
            nextState = nextState.set(
              "totalLength",
              _.parseInt(_.get(result, "value.totalLength"))
            );
            nextState = nextState.set(
              "currentPage",
              _.get(jsParam, "currentPage")
            );
            nextState = nextState.set("pageLimit", _.get(jsParam, "pageLimit"));
            nextState = nextState.set("totalPages", totalPages);
            nextState = nextState.set(
              "data",
              _.map(_.get(result, "value.data", []), (x, xId) => {
                let findedStatus = _.find(
                  STATUS,
                  (st) =>
                    _.get(st, "value", "").toString() ===
                    _.get(x, "status", "").toString()
                );
                x.id = ++xId;
                x.corporateName = _.map(x.organizationIds, (org) =>
                  _.get(org, "label")
                );
                x.roleName = _.map(x.rolesIds, (role) => _.get(role, "label"));
                x.status = {
                  name: _.get(findedStatus, "label", ""),
                  color: _.get(findedStatus, "color", "red"),
                  icon: _.get(findedStatus, "icon", "fa-question-circle"),
                };
                return x;
              })
            );
            return nextState;
          });
        }
        setReadCorporateAccountListFetching(false);
      }, 600);
    } else {
    }
  }, [corporateId, param]);
  let query = param.get("query");
  console.log(accounts);
  return (
    <Container maxWidth={false} className={classes.container}>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Input value={corporateName} disabled />
        </Grid>
        <Grid item xs={3}>
          <Input
            value={query.get("fullnamePhoneEmail")}
            onChange={(e) =>
              _changeQuery({
                name: "fullnamePhoneEmail",
                value: e.target.value,
              })
            }
            placeholder="Họ và tên/SĐT/Email"
          />
        </Grid>
        <Grid item xs={3}>
          <Role
            mode="multiple"
            value={query.get("rolesIds") || []}
            onSelect={(e) =>
              _changeQuery({
                name: "rolesIds",
                value: e,
              })
            }
          />
        </Grid>
        <Grid item xs={3}>
          <Select
            mode="multiple"
            allowClear
            placeholder="Chọn trạng thái"
            name="status"
            style={{ width: "100%" }}
            value={query.get("status") || []}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            onChange={(e) =>
              _changeQuery({
                name: "status",
                value: e,
              })
            }
          >
            {STATUS.map((status, statusId) => {
              return (
                <Select.Option key={statusId} value={status.value}>
                  {status.label}
                </Select.Option>
              );
            })}
          </Select>
        </Grid>
        <Grid className="pt-2" item xs={12}>
          <h5>Danh sách tài khoản đã cấp</h5>
          <Divider className="mt-0" type="horizontal" />
          <Spin
            spinning={readCorporateAccountListFetching}
            tip="Đang lấy dữ liệu"
          >
            <AccountList grid={accounts} setParam={setParam} />
          </Spin>
        </Grid>
      </Grid>
    </Container>
  );
});
export default withStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
  },
}))(Account);
