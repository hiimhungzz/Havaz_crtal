import React, { useCallback, useEffect } from "react";
import { memo, useState } from "react";
import { Select, Spin } from "antd";
import _ from "lodash";
import ServiceBase from "@Services/ServiceBase";
import { Ui } from "@Helpers/Ui";

const Configuration = ({
  onSelect,
  mode = "single",
  labelInValue = true,
  value,
  className
}) => {
  const [data, setData] = useState([]);
  const [fetching, setFetching] = useState(false);
  const fetch = useCallback(async ({ searchInput }) => {
    let data = [];
    setFetching(true);
    let result = await ServiceBase.requestJson({
      method: "GET",
      url: `/showOption`,
      data: {}
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      data = result.value.docs;
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
      placeholder="Chọn cấu hình"
      notFoundContent={fetching ? <Spin size="small" /> : "Không có dữ liệu"}
      onChange={conf =>
        onSelect(_.find(data, x => x.key === _.get(conf, "key")))
      }
      style={{ width: "100%" }}
    >
      {data.map((configuration, configurationId) => {
        return (
          <Select.Option value={configuration.key} key={configurationId}>
            {configuration.label}
          </Select.Option>
        );
      })}
    </Select>
  );
};
export default memo(Configuration);
