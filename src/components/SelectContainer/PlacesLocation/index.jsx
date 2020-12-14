import React from "react";
import { memo, useState } from "react";
import { Select, Spin } from "antd";
import _ from "lodash";
import ServiceBase from "@Services/ServiceBase";
import { Ui } from "@Helpers/Ui";

const PlacesLocation = ({ onSelect, mode, value, className, disabled }) => {
  const [self, setState] = useState({
    searchInput: "",
    data: [],
    fetching: false,
  });
  const fetch = async ({ searchInput }) => {
    if (!searchInput) {
      return;
    }
    let param = {
      input: _.trim(searchInput),
      api_token: "hmtvxAd5AQLAaUpjDGEqTZIj2DnR1dGBW7uugUG1gJyvsWVFzIh6n5It6RMk",
    };
    let data = [];
    setState({ ...self, fetching: true, searchInput: searchInput });
    let result = await ServiceBase.requestJson({
      baseUrl: "https://place.havaz.vn/api",
      method: "GET",
      url: "/v1/places",
      data: param,
    });
    if (!result.hasErrors) {
      data = _.map(result.value.data, (place) => {
        return {
          key: place.id,
          label: place.description,
        };
      });
      data.push({ key: "", label: searchInput });
    } else {
      Ui.showErrors(result.errors);
    }
    setState({
      ...self,
      fetching: false,
      data: data,
    });
  };
  let timer = null;
  return (
    <Select
      disabled={disabled}
      showArrow
      allowClear
      showSearch
      className={className}
      mode={mode}
      value={value}
      labelInValue
      defaultActiveFirstOption={false}
      filterOption={false}
      placeholder="Địa điểm"
      notFoundContent={
        self.fetching ? <Spin size="small" /> : "Không có dữ liệu"
      }
      onChange={(place) => onSelect(place)}
      onFocus={() => {
        fetch({ searchInput: "" });
      }}
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
      {self.data.map((place, placeId) => {
        return (
          <Select.Option value={place.key} key={placeId}>
            {place.label}
          </Select.Option>
        );
      })}
    </Select>
  );
};
export default memo(PlacesLocation);
