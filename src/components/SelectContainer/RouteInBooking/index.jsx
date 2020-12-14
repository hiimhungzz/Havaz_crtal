import React from "react";
import { memo, useState } from "react";
import { Select, Spin } from "antd";
import _ from "lodash";
import { API_URI } from "@Constants";
import ServiceBase from "@Services/ServiceBase";
import { Ui } from "@Helpers/Ui";

const RouteInBooking = ({
  onSelect,
  bookingId,
  mode = "single",
  labelInValue = true,
  value
}) => {
  const [self, setState] = useState({
    data: [],
    fetching: false
  });
  const fetch = async () => {
    let data = [];
    setState({ ...self, fetching: true });
    let result = await ServiceBase.requestJson({
      method: "GET",
      url: `${API_URI.BROWSE_ROUTE_IN_BOOKING}?bookingId=${bookingId}`,
      data: {}
    });
    if (!result.hasErrors) {
      data = _.map(result.value, route => {
        return {
          key: route.key,
          label: route.label
        };
      });
    } else {
      Ui.showErrors(result.errors);
    }
    setState({
      ...self,
      fetching: false,
      data: data
    });
  };
  let timer = null;
  return (
    <Select
      showArrow
      allowClear
      showSearch
      mode={mode}
      value={value}
      labelInValue={labelInValue}
      defaultActiveFirstOption={false}
      filterOption={false}
      placeholder="Tên tuyến đường"
      notFoundContent={
        self.fetching ? <Spin size="small" /> : "Không có dữ liệu"
      }
      onChange={route => {
        onSelect(route);
      }}
      onFocus={() => {
        if (self.data.length === 0) {
          fetch({ searchInput: "" });
        }
      }}
      onSearch={searchInput => {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          fetch();
        }, 500);
      }}
      style={{ width: "100%" }}
    >
      {self.data.map((route, routeId) => {
        return (
          <Select.Option value={route.key} key={routeId}>
            {route.label}
          </Select.Option>
        );
      })}
    </Select>
  );
};
export default memo(RouteInBooking);
