import React, { useCallback, useEffect } from "react";
import { memo, useState } from "react";
import { Select, Spin } from "antd";
import _ from "lodash";
import ServiceBase from "@Services/ServiceBase";
import { Ui } from "@Helpers/Ui";
let timer = null;

const Highway = ({ onSelect, mode = "single", labelInValue = true, value }) => {
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
        url: `/routes/highway/list`,
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
        data = _.map(result.value.data, x => ({ key: x.id, label: x.name }));
      }
      setState({
        ...self,
        fetching: false,
        data: data
      });
    },
    [self]
  );
  useEffect(() => {
    fetch("");
  }, []);
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
      placeholder="Tên cao tốc"
      notFoundContent={
        self.fetching ? <Spin size="small" /> : "Không có dữ liệu"
      }
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
      {self.data.map((highway, highwayId) => {
        return (
          <Select.Option value={highway.key} key={highwayId}>
            {highway.label}
          </Select.Option>
        );
      })}
    </Select>
  );
};
export default memo(Highway);
