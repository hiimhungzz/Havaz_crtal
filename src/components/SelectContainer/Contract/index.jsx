import React, { useCallback, useEffect } from "react";
import { memo, useState } from "react";
import { Select, Spin } from "antd";
import _ from "lodash";
import ServiceBase from "@Services/ServiceBase";
import { Ui } from "@Helpers/Ui";
let timer = null;

const Contract = memo(
  ({
    onSelect,
    mode = "single",
    placeholder = "Chọn hợp đồng",
    labelInValue = true,
    fetchDataOnMount = true,
    fetchDataOnFocus = true,
    style = { width: "100%" },
    ...props
  }) => {
    const [data, setData] = useState([]);
    const [fetching, setFetching] = useState(false);
    const fetch = useCallback(async (searchInput) => {
      let data = [];
      let param = {
        pageLimit: 5,
        currentPage: 0,
        searchInput: searchInput,
        orderBy: { createdAt: 1 },
        query: {
          contractNumber: "",
          codeAndName: "",
          phoneAndAddress: "",
          contractType: undefined,
        },
      };
      setFetching(true);
      let result = await ServiceBase.requestJson({
        method: "GET",
        url: `/contract/list`,
        data: param,
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        data = _.map(_.get(result, "value.data", []), (x) => ({
          key: x.uuid,
          label: x.contractNumber,
          contractType: x.contractType
        }));
      }
      setFetching(false);
      setData(data);
    }, []);
    const _handleFocus = useCallback(() => {
      if (fetchDataOnFocus) {
        fetch("");
      }
    }, [fetch, fetchDataOnFocus]);
    const _handleSearch = useCallback(
      (searchInput) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          fetch(searchInput);
        }, 500);
      },
      [fetch]
    );
    useEffect(() => {
      if (fetchDataOnMount) {
        fetch("");
      }
    }, [fetch, fetchDataOnMount]);
    return (
      <Select
        {...props}
        showArrow
        allowClear
        showSearch
        labelInValue={labelInValue}
        placeholder={placeholder}
        style={style}
        defaultActiveFirstOption={false}
        filterOption={false}
        loading={fetching}
        notFoundContent={fetching ? <Spin size="small" /> : "Không có dữ liệu"}
        onFocus={_handleFocus}
        onChange={(item) => {
          if(mode === "single") {
            const itemSelected = _.find(data, x => x.key === item.key);
            onSelect(itemSelected)
          } else {
            onSelect(item)
          }
        }}
        onSearch={_handleSearch}
      >
        {_.map(data, (item, itemId) => {
          return (
            <Select.Option value={item.key} key={itemId}>
              {item.label}
            </Select.Option>
          );
        })}
      </Select>
    );
  }
);
export default Contract;
