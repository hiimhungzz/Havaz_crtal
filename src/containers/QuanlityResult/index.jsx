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
import { array } from "prop-types";
import moment from "moment";
import { requestJsonGet } from "@Services/base";
import { Ui } from "@Helpers/Ui";
import downloadFile from "@Components/Utility/downloadFile";
let time = null;
const quanlityTotal = memo(({}) => {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    pages: 0,
    pageSize: 5,
    driverId: undefined,
    vehicleId: undefined,
    routeId: undefined,
    pickUpStart: undefined,
    pickUpEnd: undefined,
    typeSurvey: undefined,
    status: undefined,
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

  const exportExcel = useCallback(async () => {
    let driverId = _.isArray(params.driverId)
      ? params.driverId.map((item) => item.key)
      : "";
    let vehicleId = _.isArray(params.vehicleId)
      ? params.vehicleId.map((item) => item.key)
      : "";
    let routeId = _.isArray(params.routeId)
      ? params.routeId.map((item) => item.key)
      : "";
    let newParams = {
      driverId: driverId,
      vehicleId: vehicleId,
      routeId: routeId,
      pickUpStart: params.pickUpStart,
      pickUpEnd: params.pickUpEnd,
      typeSurvey: params.typeSurvey,
      status: params.status,
      pages: params.pages,
      pageSize: params.pageSize,
      result: "excel",
    };
    console.log("newParams", newParams);
    let result = await requestJsonGet({
      url: "/report/trip-quality",
      method: "GET",
      data: newParams,
    });
    console.log('result',result)
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      downloadFile(result.data, "Báo cáo quản lý chất lượng tổng hợp");
      Ui.showSuccess({ message: "Xuất Excel thành công" });
    }
  });

  const boweload = useCallback(async () => {
    setLoading(true);
    let driverId = _.isArray(params.driverId)
      ? params.driverId.map((item) => item.key)
      : "";
    let vehicleId = _.isArray(params.vehicleId)
      ? params.vehicleId.map((item) => item.key)
      : "";
    let routeId = _.isArray(params.routeId)
      ? params.routeId.map((item) => item.key)
      : "";
    let newParams = {
      driverId: driverId,
      vehicleId: vehicleId,
      routeId: routeId,
      pickUpStart: params.pickUpStart,
      pickUpEnd: params.pickUpEnd,
      typeSurvey: params.typeSurvey,
      status: params.status,
      result: params.result,
      pages: params.pages,
      pageSize: params.pageSize,
    };
    console.log("newParams", newParams);
    let result = await requestJsonGet({
      url: "/report/trip-quality",
      method: "GET",
      data: newParams,
    });

    if (result.hasErrors) {
      setLoading(false);
    } else {
      setLoading(false);
      let i = 1;
      let arrData = _.map(_.get(result, "data.docs"), (item, index) => {
        item.id = i++;
        item.pickUpAt = item.pickUpAt
          ? moment(item.pickUpAt).format("DD-MM-YYYY")
          : "";
        item.surveyDate = item.surveyDate
          ? moment(item.surveyDate).format("DD-MM-YYYY")
          : "";
        return item;
      });
      setGird((preState) => {
        let nextState = preState;
        nextState = nextState.set("data", arrData);
        nextState = nextState.set("pages", params.pages);
        nextState = nextState.set("pageSize", params.pageSize);
        nextState = nextState.set("totalLength", result.data.total);
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
              gird={gird}
              setParams={setParams}
              currentPage={params.pages}
              pageSize={params.pageSize}
              loading={loading}
            />
          </PortletBody>
        </Portlet>
      </Grid>
    </Grid>
  );
});
export default quanlityTotal;
