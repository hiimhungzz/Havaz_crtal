import React, { memo, useState, useEffect, useCallback } from "react";
import { Row, Col, Select, Input, DatePicker } from "antd";
import _ from "lodash";
import PortletHead from "@Components/Portlet/PortletHead";
import PortletBody from "@Components/Portlet/PortletBody";
import A from "@Components/A";

const { Option } = Select;
const fillter = memo(({ params, setParams }) => {
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
      contractNumber: "",
      typeContractNumber: undefined,
      fixedRouteName: undefined,
      fromAt: undefined,
      toAt: undefined,
      typeVehicle: undefined,
    });
  }, [setParams]);
  return (
    <>
      <PortletHead>
        <div className="kt-portlet__head-label"></div>
        <div className="kt-portlet__head-toolbar">
          <div className="kt-portlet__head-wrapper">
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
            <Select
              value={params.typeContractNumber}
              placeholder="Tuyến đường"
              style={{ width: "100%" }}
              onChange={(e) => {
                let value = e;
                queryFillter(value, "typeContractNumber");
              }}
            >
              <Option value="jack">Hà nội - Hưng yên</Option>
              <Option value="lucy">Hưng yên - Bắc giang</Option>
            </Select>
          </Col>
          <Col md={8}>
            <Select
              value={params.typeContractNumber}
              placeholder="Lái xe"
              style={{ width: "100%" }}
              onChange={(e) => {
                let value = e;
                queryFillter(value, "typeContractNumber");
              }}
            >
              <Option value="jack">Đào SƠn</Option>
              <Option value="lucy">Hoàng Anh</Option>
            </Select>
          </Col>
          <Col md={8}>
            <Select
              value={params.typeContractNumber}
              placeholder="BKS"
              style={{ width: "100%" }}
              onChange={(e) => {
                let value = e;
                queryFillter(value, "typeContractNumber");
              }}
            >
              <Option value="jack">29A-56565</Option>
              <Option value="lucy">29A-53214</Option>
            </Select>
          </Col>
        </Row>
        <Row gutter={15} className="mb_10">
          <Col md={4}>
            <DatePicker
              value={params.fromAt}
              placeholder="Từ ngày"
              onChange={(e, date) => {
                let value = e;
                queryFillter(value, "fromAt");
              }}
            />
          </Col>
          <Col md={4}>
            <DatePicker
              value={params.toAt}
              placeholder="Đến ngày"
              onChange={(e, date) => {
                let value = e;
                queryFillter(value, "toAt");
              }}
            />
          </Col>
          <Col md={8}>
            <Select
              value={params.typeVehicle}
              placeholder="Loại đánh giá"
              style={{ width: "100%" }}
              onChange={(e) => {
                let value = e;
                queryFillter(value, "typeVehicle");
              }}
            >
              <Option value="jack">Đánh giá xuất bến</Option>
              <Option value="jack">Đánh giá rời bến</Option>
            </Select>
          </Col>
          <Col md={8}>
            <Select
              value={params.fixedRouteName}
              placeholder="Trạng thái"
              style={{ width: "100%" }}
              onChange={(e) => {
                let value = e;
                queryFillter(value, "fixedRouteName");
              }}
            >
              <Option value="jack">Đạt</Option>
              <Option value="lucy">Không đạt</Option>
            </Select>
          </Col>
        </Row>
      </PortletBody>
    </>
  );
});
export default fillter;
