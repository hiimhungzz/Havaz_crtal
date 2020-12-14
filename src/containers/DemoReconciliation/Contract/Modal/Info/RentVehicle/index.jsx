import React, { memo, useCallback, useState, useEffect } from "react";
import { Input, Table, Divider, Select } from "antd";
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
import RentVehicleList from "./List";
const RentVehicle = memo(({ corporateId, actionName, classes }) => {
  const [
    readCorporateRentVehicleListFetching,
    setReadCorporateRentVehicleListFetching
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
  const [accounts, setRentVehicles] = useState(
    Map({
      data: [
        {
          id: "1",
          contractNumber: "HĐ/SS-2020-01",
          corporateName: "",
          plate: "",
          driverName: "",
          vehicleType: "",
          time: "",
          status: "",
          items: [
            {
              corporateName: "Samsung Việt Nam",
              plate: "97b1-05099",
              driverName: "Tiến Đức",
              vehicleType: "35C",
              time: "Từ 01/01/2020  Đến 31/12/2022",
              status: "Hoạt động"
            }
          ]
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
  const _handleSelect = useCallback(
    status =>
      setParam(prevState => prevState.setIn(["query", "status"], status)),
    [setParam]
  );

  useEffect(() => {
    if (corporateId) {
      let jsParam = param.toJS();
      _.set(jsParam, "query.corporateId", corporateId);
      _.delay(async () => {
        setReadCorporateRentVehicleListFetching(true);
        let result = await ServiceBase.requestJson({
          url: URI.READ_CORPORATE,
          method: "POST",
          data: jsParam
        });
        if (result.hasErrors) {
          Ui.showErrors(result.errors);
        } else {
          let rs = result.value.data;
          setRentVehicles(fromJS(rs));
        }
        setReadCorporateRentVehicleListFetching(false);
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
              <label>BKS</label>
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
              <label>Lái xe</label>
            </Grid>
            <Grid item xs={12}>
              <Input
                value={query.get("driverName")}
                name="driverName"
                onChange={_handleChangeInput}
                placeholder="Nhập tên lái xe"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <label>Hợp đồng</label>
            </Grid>
            <Grid item xs={12}>
              <Input
                value={query.get("contractNumber")}
                name="contractNumber"
                onChange={_handleChangeInput}
                placeholder="Nhập số hợp đồng"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <label>Trạng thái</label>
            </Grid>
            <Grid item xs={12}>
              <Select
                value={query.get("status")}
                onChange={_handleSelect}
                allowClear
                placeholder="Chọn trạng thái"
                style={{ width: "100%" }}
              >
                <Select.Option value="1">Hoạt động</Select.Option>
                <Select.Option value="2">Hết hạn</Select.Option>
              </Select>
            </Grid>
          </Grid>
        </Grid>
        <Grid className="pt-5" item xs={12}>
          <h5>Danh sách tài khoản đã cấp</h5>
          <Divider className="mt-0" type="horizontal" />
          <RentVehicleList grid={accounts} setParam={setParam} />
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
}))(RentVehicle);
