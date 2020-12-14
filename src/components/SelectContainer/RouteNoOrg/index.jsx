import React from "react";
import { memo, useState } from "react";
import { Select, Spin } from "antd";
import _ from "lodash";
import { API_URI } from "@Constants";
import ServiceBase from "@Services/ServiceBase";
import { Ui } from "@Helpers/Ui";

let timer = null;
const RouteNoOrg = ({
  onSelect,
  mode,
  value,
  disabled,
  routes = [],
  className,
}) => {
  const [data, setData] = useState([]);
  const [fetching, setFetching] = useState(false);
  const fetch = async ({ searchInput }) => {
    let param = {
      searchInput: searchInput,
      pageLimit: 100,
      currentPage: 0,
    };
    let data = [];
    setFetching(true);
    let result = await ServiceBase.requestJson({
      method: "POST",
      url: API_URI.BROWSE_ROUTE_BOOKING_LIST,
      data: param,
    });
    if (!result.hasErrors) {
      data = _.map(result.value.data, (route) => {
        return {
          key: route.uuid,
          label: route.name,
          code: route.code,
        };
      });
    } else {
      Ui.showErrors(result.errors);
    }
    setData(data);
    setFetching(false);
  };
  return (
    <Select
      showArrow
      allowClear
      showSearch
      disabled={disabled}
      className={className}
      mode={mode}
      value={value}
      labelInValue
      defaultActiveFirstOption={false}
      filterOption={false}
      placeholder="Tên tuyến đường"
      notFoundContent={fetching ? <Spin size="small" /> : "Không có dữ liệu"}
      onChange={(route) => {
        let finded = _.find((x) => x.key === _.get(route, "key"));
        onSelect(route, finded || {});
      }}
      onFocus={() => fetch({ searchInput: "" })}
      onSearch={(searchInput) => {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          fetch({ searchInput });
        }, 500);
      }}
      style={{ width: "100%" }}
    >
      {_.map(data, (route, routeId) => {
        return (
          <Select.Option
            disabled={_.includes(routes, route.key)}
            title={route.label}
            value={route.key}
            key={routeId}
          >
            {route.label}
          </Select.Option>
        );
      })}
    </Select>
  );
};
export default memo(RouteNoOrg);
