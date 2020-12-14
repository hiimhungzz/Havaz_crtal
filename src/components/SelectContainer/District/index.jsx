import React, { useCallback, useEffect } from "react";
import { memo, useState } from "react";
import { Select, Spin } from "antd";
import _ from "lodash";
import ServiceBase from "@Services/ServiceBase";
import { Ui } from "@Helpers/Ui";
let timer = null;

const District = ({
  onSelect,
  mode = "single",
  labelInValue = true,
  value,
  provinceIds
}) => {
  const [self, setState] = useState({
    data: [],
    fetching: false
  });
  const fetch = useCallback(
    async ({ searchInput }) => {
      if (provinceIds && !provinceIds.key) {
        Ui.showWarning({ message: "Chưa chọn thành phố." });
        return;
      }
      let data = [];
      setState({ ...self, fetching: true });
      let result = await ServiceBase.requestJson({
        method: "GET",
        url: `/districts/all?provinceId=${provinceIds.key}`,
        data: {}
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        data = _.map(result.value, x => ({
          key: x.id,
          label: x.name
        }));
      }
      setState({
        ...self,
        fetching: false,
        data: data
      });
    },
    [provinceIds, self]
  );
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
      placeholder="Tên quận/huyện"
      notFoundContent={
        self.fetching ? <Spin size="small" /> : "Không có dữ liệu"
      }
      onFocus={() => {
        fetch({ searchInput: "" });
      }}
      onChange={onSelect}
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
      {self.data.map((district, districtId) => {
        return (
          <Select.Option value={district.key} key={districtId}>
            {district.label}
          </Select.Option>
        );
      })}
    </Select>
  );
};
export default memo(District);
