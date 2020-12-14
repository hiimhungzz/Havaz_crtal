import React, { useCallback, useEffect } from "react";
import { memo, useState } from "react";
import { Select, Spin } from "antd";
import _ from "lodash";
import ServiceBase from "@Services/ServiceBase";
import { Ui } from "@Helpers/Ui";

const City = ({
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
      url: `/cities/list`,
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
        label: x.cityname,
      }));
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
      className={className}
      showSearch
      mode={mode}
      value={value}
      labelInValue={labelInValue}
      defaultActiveFirstOption={false}
      optionFilterProp="children"
      placeholder="Tên Tỉnh/Thành phố"
      filterOption={(input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      notFoundContent={fetching ? <Spin size="small" /> : "Không có dữ liệu"}
      onChange={onSelect}
      style={{ width: "100%" }}
    >
      {data.map((city, cityId) => {
        return (
          <Select.Option value={city.key} key={cityId}>
            {city.label}
          </Select.Option>
        );
      })}
    </Select>
  );
};
export default memo(City);
