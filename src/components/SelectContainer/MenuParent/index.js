import React, { useCallback, useEffect } from "react";
import { memo, useState } from "react";
import { Select, Spin } from "antd";
import _ from "lodash";
import ServiceBase from "@Services/ServiceBase";
import { Ui } from "@Helpers/Ui";
import IntlMessages from "@Components/Utility/intlMessages";
let timer = null;

const MenuParent = (props, ref) => {
  const {
    onSelect,
    mode = "single",
    labelInValue = true,
    disabled = false,
    value,
    className,
  } = props;
  const [data, setData] = useState([]);
  const [fetching, setFetching] = useState(false);
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
      method: "GET",
      url: `menu/select/list`,
      data: {},
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      data = _.map(_.get(result, "value.data", []), (x) => ({
        key: x.key,
        label: x.label,
      }));
    }
    setFetching(false);
    setData(data);
  }, []);
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
      placeholder="Menu cha"
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
            <IntlMessages id={item.label}/>
          </Select.Option>
        );
      })}
    </Select>
  );
};
export default memo(React.forwardRef(MenuParent));
