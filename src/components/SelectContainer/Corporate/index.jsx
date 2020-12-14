import React, { useCallback, useEffect } from "react";
import { memo, useState } from "react";
import { Select, Spin, Tooltip } from "antd";
import _ from "lodash";
import ServiceBase from "@Services/ServiceBase";
import { Ui } from "@Helpers/Ui";
let timer = null;

const Corporate = ({
  onSelect,
  mode = "single",
  labelInValue = true,
  value,
  className,
  isBigSize,
  disabled,
}) => {
  const [data, setData] = useState([]);
  const [fetching, setFetching] = useState([]);
  const fetch = useCallback(async ({ searchInput }) => {
    let data = [];
    let param = {
      pageLimit: 10,
      currentPage: 0,
      searchInput: searchInput,
      orderBy: { createdAt: 1 },
      query: { codeAndName: "", phoneAndAddress: "" },
    };
    setFetching(true);
    let result = await ServiceBase.requestJson({
      method: "POST",
      url: `/partners/select/brC/list`,
      data: param,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      data = _.map(_.get(result, "value.data", []), (x) => ({
        key: x.uuid,
        label: x.name,
      }));
    }
    setFetching(false);
    setData(data);
  }, []);
  return (
    <Select
      dropdownMatchSelectWidth={isBigSize ? false : true}
      dropdownMenuStyle={isBigSize ? {width: '130%'} :  null}
      showArrow
      allowClear
      showSearch
      mode={mode}
      disabled={disabled}
      value={value}
      className={className}
      labelInValue={labelInValue}
      defaultActiveFirstOption={false}
      filterOption={false}
      placeholder="Chọn Doanh nghiệp"
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
          <Select.Option
            value={item.key} key={itemId}>
             {item.label}
          </Select.Option>
        );
      })}
    </Select>
  );
};
export default memo(Corporate);
