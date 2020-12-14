import React from "react";
import { memo, useState } from "react";
import { Select, Spin } from "antd";
import _ from "lodash";
import ServiceBase from "@Services/ServiceBase";
import { Ui } from "@Helpers/Ui";

const Partner = ({ onSelect, mode = "single", labelInValue = true, value }) => {
  const [self, setState] = useState({
    data: [],
    fetching: false
  });
  const fetch = async ({ searchInput }) => {
    let data = [];
    setState({ ...self, fetching: true });
    let result = await ServiceBase.requestJson({
      method: "GET",
      url: `/autocomplete/supplier?q=${searchInput}`,
      data: {}
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      data = result.value;
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
      placeholder="Tên CTV"
      notFoundContent={
        self.fetching ? <Spin size="small" /> : "Không có dữ liệu"
      }
      onChange={fee => {
        onSelect(fee);
      }}
      onFocus={() => {
        fetch({ searchInput: "" });
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
      {self.data.map((partner, partnerId) => {
        return (
          <Select.Option value={partner.key} key={partnerId}>
            {partner.label}
          </Select.Option>
        );
      })}
    </Select>
  );
};
export default memo(Partner);
