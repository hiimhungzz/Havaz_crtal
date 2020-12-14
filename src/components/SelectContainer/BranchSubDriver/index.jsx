import PropTypes from "prop-types";
import React, { useCallback, useEffect } from "react";
import { memo, useState } from "react";
import { Select, Spin } from "antd";
import _ from "lodash";
import ServiceBase from "@Services/ServiceBase";
import { Ui } from "@Helpers/Ui";

const BranchSubDriver = ({
  onSelect,
  mode = "single",
  labelInValue = true,
  value,
  className,
}) => {
  const [data, setData] = useState([]);
  const [fetching, setFetching] = useState(false);
  const fetch = useCallback(async ({ searchInput }) => {
    let list = [];
    setFetching(false);
    let result = await ServiceBase.requestJson({
      method: "GET",
      url: `/autocomplete/sub-driver/all?q=${searchInput}`,
      data: {},
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      list = _.get(result, "value");
      setData(list);
    }
    setFetching(false);
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
      placeholder="Chọn phụ xe"
      notFoundContent={fetching ? <Spin size="small" /> : "Không có dữ liệu"}
      onChange={onSelect}
      style={{ width: "100%" }}
    >
      {_.map(data, (subDriver, subDriverId) => {
        return (
          <Select.Option
            value={subDriver.key}
            key={subDriverId}
            title={subDriver.orName}
          >
            {subDriver.label}
          </Select.Option>
        );
      })}
    </Select>
  );
};

BranchSubDriver.propTypes = {
  className: PropTypes.any,
  labelInValue: PropTypes.bool,
  mode: PropTypes.string,
  onSelect: PropTypes.any,
  value: PropTypes.any
}
export default memo(BranchSubDriver);
