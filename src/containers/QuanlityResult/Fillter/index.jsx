import React, { memo, useState, useEffect, useCallback } from "react";
import { Row, Col, Select, Input, DatePicker } from "antd";
import _ from "lodash";
import PortletHead from "@Components/Portlet/PortletHead";
import PortletBody from "@Components/Portlet/PortletBody";
import A from "@Components/A";
import Corporate from "@Components/SelectContainer/Corporate";
import ContractList from "@Components/SelectContainer/ContractList";
import ContractType from "@Components/SelectContainer/ContractType";
import RouteList from "components/SelectContainer/RouteList";
import SelectSon from "@Components/SelectSon";
import { SelectDriver } from "./../../../components/Utility/common";
import { createStructuredSelector } from "reselect";
import { makeSelectAppConfig } from "redux/app/selectors";
import { connect } from "react-redux";
import moment from "moment";
import classNames from "classnames";
const mapStateToProps = createStructuredSelector({
  appConfig: makeSelectAppConfig(),
});
const withConnect = connect(mapStateToProps, null);
const { Option } = Select;
const { RangePicker } = DatePicker;
const fillter = withConnect(
  memo(({ params, setParams, appConfig,exportExcel }) => {
    const queryFillter = useCallback(
      (value, name) => {
        setParams((props) => {
          let nextState = { ...props };
          nextState[name] = value;
          return nextState;
        });
      },
      [params]
    );
    const _clearFilter = useCallback(() => {
      setParams({
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
    }, [params]);
    return (
      <>
        <PortletHead>
          <div className="kt-portlet__head-label"></div>
          <div className="kt-portlet__head-toolbar">
            <div className="kt-portlet__head-wrapper">
            <button
              type="button"
              onClick={e => {
                exportExcel()
              }}
              className={classNames({
                "btn btn-danger btn-icon-sm mr-3": true,
              })}
            >
              Xuất excel
            </button>
              <A onClick={_clearFilter} className="btn btn-clean btn-icon-sm">
                Xóa bộ lọc
              </A>
              {/* <button
              onClick={_onAddUtilities}
              type="button"
              className="ml-1 btn btn-brand btn-icon-sm"
            >
              <i className="flaticon2-plus" />
              Thêm tiện ích
            </button> */}
            </div>
          </div>
        </PortletHead>
        <PortletBody>
          <Row gutter={15} className="mb_10">
            <Col md={8}>
              <RouteList
                mode="multiple"
                placeholder="Chọn tuyến đường"
                value={params.routeId}
                onSelect={(routes) => {
                  let value = routes;
                  queryFillter(value, "routeId");
                }}
              />
            </Col>
            <Col md={8}>
              <SelectSon
                value={params.driverId}
                mode="multiple"
                placeholder="Lái xe"
                url="/autocomplete/driver/all"
                onSelect={(item) => {
                  let value = item;
                  queryFillter(value, "driverId");
                }}
              />
            </Col>
            <Col md={8}>
              <SelectSon
                mode="multiple"
                value={params.vehicleId}
                placeholder="BKS"
                url="/autocomplete/vehicle"
                onSelect={(e) => {
                  let value = e;
                  queryFillter(value, "vehicleId");
                }}
              />
            </Col>
          </Row>
          <Row gutter={15} className="mb_10">
            <Col md={8}>
              <RangePicker
                format={"DD-MM-YYYY"}
                value={
                  params.pickUpStart && params.pickUpEnd
                    ? [moment(params.pickUpStart), moment(params.pickUpEnd)]
                    : undefined
                }
                onChange={(dates) => {
                  let pickUpStart =
                    dates.length > 0
                      ? moment(dates[0].startOf("day")).format("YYYY-MM-DD")
                      : undefined;
                  let pickUpEnd =
                    dates.length > 0
                      ? moment(dates[1].endOf("day")).format("YYYY-MM-DD")
                      : undefined;
                  queryFillter(pickUpStart, "pickUpStart");
                  queryFillter(pickUpEnd, "pickUpEnd");
                }}
                ranges={{
                  "Hôm nay": [moment(), moment()],
                  "Tuần hiện tại": [
                    moment().startOf("week"),
                    moment().endOf("week"),
                  ],
                  "Tháng hiện tại": [
                    moment().startOf("month"),
                    moment().endOf("month"),
                  ],
                  "Tuần trước": [
                    moment().add(-1, "weeks").startOf("week"),
                    moment().add(-1, "weeks").endOf("week"),
                  ],
                  "Tháng trước": [
                    moment().add(-1, "months").startOf("month"),
                    moment().add(-1, "months").endOf("month"),
                  ],
                  "Tuần sau": [
                    moment().add(1, "weeks").startOf("week"),
                    moment().add(1, "weeks").endOf("week"),
                  ],
                  "Tháng sau": [
                    moment().add(1, "months").startOf("month"),
                    moment().add(1, "months").endOf("month"),
                  ],
                }}
              />
            </Col>
            <Col md={8}>
              <Select
                value={params.typeSurvey}
                placeholder="Loại đánh giá"
                style={{ width: "100%" }}
                onChange={(e) => {
                  let value = e;
                  queryFillter(value, "typeSurvey");
                }}
              >
                {_.isArray(appConfig.typeLeaveImportStation)
                  ? appConfig.typeLeaveImportStation.map((item, index) => {
                      return (
                        <Option value={item.id} key={index}>
                          {item.name}
                        </Option>
                      );
                    })
                  : []}
              </Select>
            </Col>
            <Col md={8}>
              <Select
                value={params.status}
                placeholder="Trạng thái"
                style={{ width: "100%" }}
                onChange={(e) => {
                  let value = e;
                  queryFillter(value, "status");
                }}
              >
                {_.isArray(appConfig.statusCheckingCategorySurvey)
                  ? appConfig.statusCheckingCategorySurvey.map(
                      (item, index) => {
                        return (
                          <Option value={item.id} key={index}>
                            {item.name}
                          </Option>
                        );
                      }
                    )
                  : []}
              </Select>
            </Col>
          </Row>
        </PortletBody>
      </>
    );
  })
);
export default fillter;
