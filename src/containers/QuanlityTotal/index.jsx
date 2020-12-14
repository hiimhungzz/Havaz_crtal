import React, { memo, useState, useEffect, useCallback } from "react";
import { Spin, Row, Col } from "antd";
import _ from "lodash";
import QuanlityTotalList from "./List/index";
import Fillter from "./Fillter/index";
import Portlet from "@Components/Portlet";
import PortletBody from "@Components/Portlet/PortletBody";
import PortletHead from "@Components/Portlet/PortletHead";
import { Map } from "immutable";
import { Grid } from "@material-ui/core";
import moment from "moment";
import { requestJsonGet } from "@Services/base";
import { Ui } from "@Helpers/Ui";
import downloadFile from "@Components/Utility/downloadFile";
let time = null;
const quanlityTotal = memo(({}) => {
  let format = "YYYY-MM-DD"
  let startOf  = moment().startOf("month")
  let endOf = moment().endOf("month")
  let startAt = moment(startOf).format(format)
  let endAt = moment(endOf).format(format)
  const [params, setParams] = useState({
    pages: 0,
    pageSize: 5,
    contractIds: undefined,
    organizationIds: undefined,
    contractTypes: undefined,
    routes: undefined,
    startDate: startAt,
    endDate: endAt,
    vehicleTypes: undefined,
  });
  const [gird, setGird] = useState(
    Map({
      data: [],
      pages: 0,
      pageSize: 5,
      totalLength: 0,
      totalPages: 0,
    })
  );
  const [loading, setLoading] = useState(false);
  const exportExcel = useCallback(async()=>{
    let organizationIds = _.isArray(params.organizationIds)
    ? params.organizationIds.map((item, key) => {
        return item.key;
      })
    : "";
  let contractIds = _.isArray(params.contractIds)
    ? params.contractIds.map((item, key) => {
        return item.key;
      })
    : "";
 
  let routes = _.isArray(params.routes)
    ? params.routes.map((item, key) => {
        return item.key;
      })
    : "";
  let vehicleTypes = _.isArray(params.vehicleTypes)
    ? params.vehicleTypes.map((item, key) => {
        return item.key;
      })
    : "";
    let newParam = {
      query: {
        contractIds: contractIds,
        organizationIds: organizationIds,
        contractTypes: params.contractTypes,
        routes: routes,
        vehicleTypes: vehicleTypes,
        startDate: params.startDate,
        endDate: params.endDate,
      },
      orderBy: { createdAt: 1 },
      pageLimit: params.pageSize,
      currentPage: params.pages,
      result:'excel'
    };
    let result = await requestJsonGet({
      url: "/report/general/quality",
      method: "GET",
      data: newParam,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      downloadFile(result.data, "Báo cáo quản lý chất lượng tổng hợp");
      Ui.showSuccess({ message: "Xuất Excel thành công" });
    }
  },[params])
  const boweload = useCallback(async () => {
    let organizationIds = _.isArray(params.organizationIds)
    ? params.organizationIds.map((item, key) => {
        return item.key;
      })
    : "";
  let contractIds = _.isArray(params.contractIds)
    ? params.contractIds.map((item, key) => {
        return item.key;
      })
    : "";
 
  let routes = _.isArray(params.routes)
    ? params.routes.map((item, key) => {
        return item.key;
      })
    : "";
  let vehicleTypes = _.isArray(params.vehicleTypes)
    ? params.vehicleTypes.map((item, key) => {
        return item.key;
      })
    : "";
    setLoading(true);
    let newParam = {
      query: {
        contractIds: contractIds,
        organizationIds: organizationIds,
        contractTypes: params.contractTypes,
        routes: routes,
        vehicleTypes: vehicleTypes,
        startDate: params.startDate,
        endDate: params.endDate,
      },
      orderBy: { createdAt: 1 },
      pageLimit: params.pageSize,
      currentPage: params.pages,
    };
    let result = await requestJsonGet({
      url: "/report/general/quality",
      method: "GET",
      data: newParam,
    });
    if (result.hasErrors) {
      setLoading(false);
    } else {
      setLoading(false);
      let arrData = _.map(_.get(result, "data.data"), (item, index) => {
        item.date = [
          {
            dropOffAt:item.pickUpAt, 
          },
          {
            dropOffAt: item.dropOffAt,
          },
        ];
        return item;
      });
      setGird((preState) => {
        let nextState = preState;
        nextState = nextState.set("data", arrData);
        nextState = nextState.set("totalLength", result.data.totalLength);
        nextState = nextState.set("pages", params.pages);
        nextState = nextState.set("pageSize", params.pageSize);
        return nextState;
      });
    }
  }, [params]);
  useEffect(() => {
    clearTimeout(time);
    time = setTimeout(boweload, 800);
  }, [boweload]);
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Portlet>
          <Fillter params={params} setParams={setParams} exportExcel={exportExcel}/>
          <PortletBody className="pt-0">
            <QuanlityTotalList
              setParams={setParams}
              currentPage={params.pages}
              pageSize={params.pageSize}
              gird={gird}
              loading={loading}
            />
          </PortletBody>
        </Portlet>
      </Grid>
    </Grid>
  );
});
export default quanlityTotal;
