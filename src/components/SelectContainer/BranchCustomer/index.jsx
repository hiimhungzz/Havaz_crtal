import React, { useCallback } from "react";
import { memo, useState } from "react";
import { Select, Spin } from "antd";
import _ from "lodash";
import ServiceBase from "@Services/ServiceBase";
import { Ui } from "@Helpers/Ui";
let timer = null;

const BranchCustomer = ({
  onSelect,
  mode = "single",
  labelInValue = true,
  value,
  className,
}) => {
  const [data, setData] = useState([]);
  const [fetching, setFetching] = useState(false);
  const fetch = useCallback(async ({ searchInput }) => {
    let data = [];
    setFetching(true);
    let result = await ServiceBase.requestJson({
      method: "POST",
      url: `/partners/branch/list`,
      data: {
        searchInput: searchInput,
        pageLimit: 100,
        currentPage: 0,
        orderBy: { name: 1 },
        query: {},
      },
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      data = _.map(result.value.data, (x) => ({
        key: x.uuid,
        label: x.name,
      }));
    }
    setFetching(true);
    setData(data);
  }, []);
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
      placeholder="Chọn đơn vị quản lý"
      notFoundContent={fetching ? <Spin size="small" /> : "Không có dữ liệu"}
      onFocus={() => {
        fetch({ searchInput: "" });
      }}
      onChange={onSelect}
      onSearch={(input) => {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          fetch({ searchInput: input });
        }, 500);
      }}
      style={{ width: "100%" }}
    >
      {data.map((customer, customerId) => {
        return (
          <Select.Option value={customer.key} key={customerId}>
            {customer.label}
          </Select.Option>
        );
      })}
    </Select>
  );
};
export default memo(BranchCustomer);
