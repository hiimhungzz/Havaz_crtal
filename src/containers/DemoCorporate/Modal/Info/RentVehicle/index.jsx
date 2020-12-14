import React, { memo, useCallback, useState, useEffect } from "react";
import { Input, Divider, Select, Spin } from "antd";
import { withStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import ServiceBase from "@Services/ServiceBase";
import { Ui } from "@Helpers/Ui";
import { Map } from "immutable";
import _ from "lodash";
import RentVehicleList from "./List";
import { calculateTotalPage } from "helpers/utility";
let timer = null;
const RentVehicle = memo(
  ({ corporateId, corporateName, classes }) => {
    const [
      readCorporateRentVehicleListFetching,
      setReadCorporateRentVehicleListFetching,
    ] = useState(false);

    const [param, setParam] = useState(
      Map({
        searchInput: "",
        pageLimit: 10,
        currentPage: 0,
        query: Map(),
        orderBy: { createdAt: 1 },
      })
    );
    const [rentVehicles, setRentVehicles] = useState(
      Map({
        data: [],
        totalLength: 1,
        totalPages: 1,
        currentPage: 0,
        pageLimit: 5,
      })
    );
    const _handleChangeInput = useCallback(
      (e) => {
        let name = _.get(e, "target.name");
        let value = _.get(e, "target.value");
        setParam((prevState) => prevState.setIn(["query", name], value));
      },
      [setParam]
    );
    const _handleSelect = useCallback(
      (status) =>
        setParam((prevState) => prevState.setIn(["query", "status"], status)),
      [setParam]
    );

    useEffect(() => {
      if (corporateId) {
        clearTimeout(timer);
        timer = setTimeout(async () => {
          let jsParam = param.toJS();
          _.set(jsParam, "query.organizationId", corporateId);
          setReadCorporateRentVehicleListFetching(true);
          let result = await ServiceBase.requestJson({
            url: "/customer/vehicle/list",
            method: "GET",
            data: jsParam,
          });
          if (result.hasErrors) {
            Ui.showErrors(result.errors);
          } else {
            setRentVehicles((prevState) => {
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
              nextState = nextState.set(
                "pageLimit",
                _.get(jsParam, "pageLimit")
              );
              nextState = nextState.set("totalPages", totalPages);
              let groupedData = _.groupBy(data, (x) => x.contractNumber);
              let totalRows = _.keysIn(groupedData).length;
              _.forEach(groupedData, (x) => {
                totalRows += x.length;
              });
              let data = _.map(_.get(result, "value.data", []), (x, xId) => {
                x.id = ++xId;
                return x;
              });
              nextState = nextState.set("data", data);
              nextState = nextState.set("totalRows", totalRows);
              return nextState;
            });
          }
          setReadCorporateRentVehicleListFetching(false);
        }, 400);
      } else {
      }
    }, [corporateId, param]);
    let query = param.get("query");
    return (
      <Container maxWidth={false} className={classes.container}>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <label>Doanh nghiệp</label>
              </Grid>
              <Grid item xs={12}>
                <Input disabled value={corporateName} name="corporateName" />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <label>BKS</label>
              </Grid>
              <Grid item xs={12}>
                <Input
                  value={query.get("plate")}
                  name="plate"
                  onChange={_handleChangeInput}
                  placeholder="Nhập biển số xe"
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
          <Grid className="pt-2" item xs={12}>
            <h5>Danh sách xe đã thuê</h5>
            <Divider className="mt-0" type="horizontal" />
            <Spin
              spinning={readCorporateRentVehicleListFetching}
              tip="Đang lấy dữ liệu..."
            >
              <RentVehicleList grid={rentVehicles} setParam={setParam} />
            </Spin>
            <Divider type="horizontal" />
          </Grid>
        </Grid>
      </Container>
    );
  }
);
export default withStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
  },
}))(RentVehicle);
