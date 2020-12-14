import React, { useCallback, useEffect } from "react";
import { memo, useState } from "react";
import { Select, Spin } from "antd";
import _ from "lodash";
import ServiceBase from "@Services/ServiceBase";
import { Ui } from "@Helpers/Ui";
let timer = null;

const SelectSon = (props, ref) => {
  const {
    onSelect,
    mode = "single",
    labelInValue = true,
    value,
    className,
    query,
    url,
    limit = 20,
    disabled = false,
    placeholder = "Chọn",
  } = props;
  const [data, setData] = useState([]);
  const [fetching, setFetching] = useState([]);
  const fetch = useCallback(async ({ searchInput }) => {
    let data = [];
    let param = {
      limit: limit,
      q: searchInput,
    };
    setFetching(true);
    let result = await ServiceBase.requestJson({
      method: "GET",
      url: url,
      data: param,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      data = _.map(_.get(result, "value", []), (x) => ({
        key: x.key,
        label: x.label,
      }));
    }
    setFetching(false);
    setData(data);
  });

  return (
    <Select
      ref={ref}
      disabled={disabled}
      showArrow
      allowClear
      showSearch
      mode={mode}
      value={value}
      className={className}
      labelInValue={labelInValue}
      defaultActiveFirstOption={false}
      filterOption={false}
      placeholder={placeholder}
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
      {data.map((item, itemId) => {
        return (
          <Select.Option value={item.key} key={itemId}>
            {item.label}
          </Select.Option>
        );
      })}
    </Select>
  );
};
export default memo(React.forwardRef(SelectSon));
