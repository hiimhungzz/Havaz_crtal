import React from "react";
import { memo, useState } from "react";
import _ from "lodash";
import { Select, Spin } from "antd";
import { Ui } from "@Helpers/Ui";
import { API_URI } from "@Constants";
import ServiceBase from "@Services/ServiceBase";

const VehicleTypeNoOrg = ({
  onSelect,
  mode = "single",
  value,
  className,
  style,
  vehicleTypes,
  disabled,
}) => {
  const [data, setData] = useState([]);
  const [fetching, setFetching] = useState(false);
  const fetch = async ({ searchInput }) => {
    let param = {
      pageLimit: 100,
      currentPage: 0,
      orderBy: { lastUpdatedAt: 1 },
      searchInput: searchInput,
      query: {
        vehicleTypeUuid: [],
      },
    };
    let data = [];
    setFetching(true);
    let result = await ServiceBase.requestJson({
      method: "POST",
      url: API_URI.GET_LIST_VEHICLE_TYPE,
      data: param,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      data = _.map(result.value.data, (vehicleType) => {
        return {
          key: vehicleType.uuid,
          label: `${vehicleType.type} - ${vehicleType.name}`,
          seats: vehicleType.seats,
        };
      });
    }
    setFetching(false);
    setData(data);
  };
  let _onSearch = _.debounce((searchInput) => {
    fetch({ searchInput });
  }, 300);
  return (
    <Select
      showArrow
      allowClear
      showSearch
      className={className}
      mode={mode}
      value={value}
      disabled={disabled}
      labelInValue
      defaultActiveFirstOption={false}
      filterOption={false}
      placeholder="Tên loại xe"
      notFoundContent={fetching ? <Spin size="small" /> : "Không có dữ liệu"}
      onChange={(route) => onSelect(route, data)}
      onFocus={() => {
        fetch({ searchInput: "" });
      }}
      onSearch={_onSearch}
      style={style}
    >
      {_.map(data, (vehicleType, vehicleTypeId) => {
        return (
          <Select.Option
            disabled={_.includes(vehicleTypes, vehicleType.key)}
            value={vehicleType.key}
            key={vehicleTypeId}
          >
            {vehicleType.label}
          </Select.Option>
        );
      })}
    </Select>
  );
};
export default memo(VehicleTypeNoOrg);
