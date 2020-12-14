import React, { memo, useState, useEffect, useCallback } from "react";
import { Row, Col, Select, Input, DatePicker } from "antd";
import _ from "lodash";
import PortletHead from "@Components/Portlet/PortletHead";
import PortletBody from "@Components/Portlet/PortletBody";
import A from "@Components/A";
import Corporate from "@Components/SelectContainer/Corporate";
import ContractList from "@Components/SelectContainer/ContractList";
import RouteList from "components/SelectContainer/RouteList";
import ContractType from "@Components/SelectContainer/ContractType";
import SelectSon from "@Components/SelectSon";
import classNames from "classnames";
import moment from "moment";
const { RangePicker } = DatePicker;
const { Option } = Select;
const format = "DD-MM-YYYY";
const fillter = memo(({ params, setParams, exportExcel }) => {
  const queryFillter = useCallback(
    (value, name) => {
      setParams((props) => {
        let nextState = { ...props };
        nextState[name] = value;
        return nextState;
      });
    },
    [setParams]
  );
  const _clearFilter = useCallback(() => {
    setParams({
      pages: 0,
      pageSize: 5,
      contractIds: undefined,
      organizationIds: undefined,
      contractTypes: undefined,
      routes: undefined,
      startDate: undefined,
      endDate: undefined,
      vehicleTypes: undefined,
    });
  }, [setParams]);

  return (
    <>
      <PortletHead>
        <div className="kt-portlet__head-label"></div>
        <div className="kt-portlet__head-toolbar">
          <div className="kt-portlet__head-wrapper">
            <button
              type="button"
              onClick={(e) => {
                exportExcel();
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
            <ContractList
              isBigSize
              mode="multiple"
              value={params.contractIds}
              onSelect={(contractIds) => {
                let value = contractIds;
                queryFillter(value, "contractIds");
              }}
            />
          </Col>
          <Col md={8}>
            <Corporate
              isBigSize
              mode="multiple"
              value={params.organizationIds}
              onSelect={(organizationIds) => {
                let value = organizationIds;
                console.log("value", value);
                queryFillter(value, "organizationIds");
              }}
            />
          </Col>
          <Col md={8}>
            <ContractType
              multiple={true}
              value={params.contractTypes}
              onSelect={(selected) => {
                let value = selected;
                queryFillter(value, "contractTypes");
              }}
            />
          </Col>
        </Row>
        <Row gutter={15} className="mb_10">
          <Col md={8}>
            <RouteList
              mode="multiple"
              placeholder="Chọn tuyến đường"
              value={params.routes}
              onSelect={(routes) => {
                let value = routes;
                queryFillter(value, "routes");
              }}
            />
          </Col>
          <Col md={8}>
            <RangePicker
              format={"DD-MM-YYYY"}
              value={
                params.startDate && params.endDate
                  ? [moment(params.startDate), moment(params.endDate)]
                  : undefined
              }
              onChange={(dates) => {
                let startDate =
                  dates.length > 0 ? dates[0].startOf("day") : undefined;
                let endDate =
                  dates.length > 0 ? dates[1].endOf("day") : undefined;
                queryFillter(startDate, "startDate");
                queryFillter(endDate, "endDate");
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
          {/* <Col md={8}>
            <SelectSon
              value={params.vehicleTypes}
              mode="multiple"
              url={`/auto/vehicle-type`}
              placeholder={"Chọn loại xe"}
              onSelect={(item) => {
                let value = item;
                queryFillter(value, "vehicleTypes");
              }}
            />
          </Col> */}
        </Row>
      </PortletBody>
    </>
  );
});
export default fillter;
