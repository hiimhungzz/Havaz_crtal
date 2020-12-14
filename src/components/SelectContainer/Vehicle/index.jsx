import React, { useCallback } from "react";
import { memo, useState } from "react";
import { Select, Spin } from "antd";
import _ from "lodash";
import ServiceBase from "@Services/ServiceBase";
import { Ui } from "@Helpers/Ui";
import { useEffect } from "react";
let timer = null;

const Vehicle = ({
  onSelect,
  mode = "single",
  labelInValue = true,
  value,
  className,
  disabled,
  vehicleTypeId,
}) => {
  const [data, setData] = useState([]);
  const [fetching, setFetching] = useState([]);
  const fetch = useCallback(
    async ({ searchInput }) => {
      let data = [];
      let param = {
        pageLimit: 20,
        currentPage: 0,
        orderBy: { lastUpdatedAt: 1 },
        searchInput: searchInput,
        query: {
          partnerUuid: "",
          vehicleTypeUuid: vehicleTypeId ? [vehicleTypeId] : [],
        },
      };
      setFetching(true);
      let result = await ServiceBase.requestJson({
        method: "POST",
        url: `/vehicles/list`,
        data: param,
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        data = _.map(_.get(result, "value.data", []), (x) => ({
          key: x.uuid,
          label: x.plate,
        }));
      }
      setFetching(false);
      setData(data);
    },
    [vehicleTypeId]
  );
  useEffect(() => {
    fetch({ searchInput: "" });
  }, [fetch]);
  return (
    <Select
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
      placeholder="Chọn Xe"
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
export default memo(Vehicle);
