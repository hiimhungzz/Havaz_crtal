import React, { useCallback, useEffect } from "react";
import { memo, useState } from "react";
import { Select, Spin } from "antd";
import _ from "lodash";
import ServiceBase from "@Services/ServiceBase";
import { Ui } from "@Helpers/Ui";

const Role = ({
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
      url: `/users/role/list`,
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
      data = _.map(result.value.data, (x) => ({ key: x.uuid, label: x.name }));
    }
    setFetching(false);
    setData(data);
  }, []);
  useEffect(() => {
    fetch({ searchInput: "" });
  }, [fetch]);
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
      filterOption={(input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      placeholder="Chọn chức danh"
      notFoundContent={fetching ? <Spin size="small" /> : "Không có dữ liệu"}
      onChange={onSelect}
      style={{ width: "100%" }}
    >
      {data.map((role, roleId) => {
        return (
          <Select.Option value={role.key} key={roleId}>
            {role.label}
          </Select.Option>
        );
      })}
    </Select>
  );
};
export default memo(Role);
