import React, { useCallback } from "react";
import { memo, useState } from "react";
import { Select, Spin } from "antd";
import _ from "lodash";
import ServiceBase from "@Services/ServiceBase";
import { Ui } from "@Helpers/Ui";
let timer = null;

const RouteTour = ({
  onSelect,
  mode = "single",
  labelInValue = true,
  value,
  className
}) => {
  const [self, setState] = useState({
    data: [],
    fetching: false
  });
  const fetch = useCallback(
    async ({ searchInput }) => {
      let data = [];
      setState({ ...self, fetching: true });
      let result = await ServiceBase.requestJson({
        method: "POST",
        url: `/routes/fixed-routes/tour/list`,
        data: {
          searchInput: searchInput,
          pageLimit: 100,
          currentPage: 0,
          orderBy: { name: 1 },
          query: {}
        }
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        data = _.map(result.value.data, x => ({
          key: x.uuid,
          label: x.name,
          distance: _.get(x, "path.distance"),
          preDistance: _.get(x, "path.preDistance")
        }));
      }
      setState({
        ...self,
        fetching: false,
        data: data
      });
    },
    [self]
  );
  return (
    <Select
      showArrow
      allowClear
      showSearch
      className={className}
      mode={mode}
      value={value}
      labelInValue={labelInValue}
      defaultActiveFirstOption={false}
      filterOption={false}
      placeholder="Chọn tuyến/điểm"
      notFoundContent={
        self.fetching ? <Spin size="small" /> : "Không có dữ liệu"
      }
      onFocus={() => {
        fetch({ searchInput: "" });
      }}
      onChange={route =>
        onSelect(
          route,
          _.find(self.data, x => x.key === (route ? route.key : ""))
        )
      }
      onSearch={input => {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          fetch({ searchInput: input });
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
export default memo(RouteTour);
