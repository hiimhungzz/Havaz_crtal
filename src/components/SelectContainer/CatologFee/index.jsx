import React from "react";
import { memo, useState } from "react";
import { Select, Spin } from "antd";
import _ from "lodash";
import { API_URI } from "@Constants";
import ServiceBase from "@Services/ServiceBase";
import { Ui } from "@Helpers/Ui";

const CatologFee = ({
  onSelect,
  mode = "single",
  labelInValue = true,
  value
}) => {
  const [self, setState] = useState({
    data: [],
    fetching: false
  });
  const fetch = async ({ searchInput }) => {
    let data = [];
    setState({ ...self, fetching: true });
    let result = await ServiceBase.requestJson({
      method: "GET",
      url: `${API_URI.BROWSE_CATOLOG_FEE}${searchInput}`,
      data: {}
    });
    if (!result.hasErrors) {
      data = _.map(result.value, fee => {
        return {
          key: fee.id,
          label: fee.name
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
      placeholder="Tên loại chi phí"
      notFoundContent={
        self.fetching ? <Spin size="small" /> : "Không có dữ liệu"
      }
      onChange={fee => {
        onSelect(fee);
      }}
      onFocus={() => {
        if (self.data.length === 0) {
          fetch({ searchInput: "" });
        }
      }}
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
      {self.data.map((fee, feeId) => {
        return (
          <Select.Option value={fee.key} key={feeId}>
            {fee.label}
          </Select.Option>
        );
      })}
    </Select>
  );
};
export default memo(CatologFee);
