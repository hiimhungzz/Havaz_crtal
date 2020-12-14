import React, { useEffect } from "react";
import { memo, useState } from "react";
import { Select } from "antd";
import _ from "lodash";
import { createStructuredSelector } from "reselect";
import { makeSelectAppConfig } from "redux/app/selectors";
import { connect } from "react-redux";
import { compose } from "redux";
const mapStateToProps = createStructuredSelector({
  appConfig: makeSelectAppConfig(),
});
const withConnect = connect(mapStateToProps, null);

const TypePlace = ({
  onSelect,
  mode = "single",
  placeholder = "Chọn loại địa danh",
  appConfig,
  value,
  disabled,
}) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(
      _.map(_.get(appConfig, "typePlace", []), (x) => ({
        key: _.toString(x.id),
        label: x.name,
      }))
    );
  }, [appConfig]);
  console.log("tao render", appConfig);
  return (
    <Select
      disabled={disabled}
      showArrow
      allowClear
      showSearch
      mode={mode}
      value={value}
      defaultActiveFirstOption={false}
      filterOption={(input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      placeholder={placeholder}
      notFoundContent="Không có dữ liệu"
      onChange={onSelect}
      style={{ width: "100%" }}
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
};
export default compose(memo, withConnect)(TypePlace);
