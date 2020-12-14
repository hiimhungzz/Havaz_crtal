import React, { useCallback, useEffect } from "react";
import { memo, useState } from "react";
import { TreeSelect, Spin } from "antd";
import _ from "lodash";
import ServiceBase from "@Services/ServiceBase";
import { Ui } from "@Helpers/Ui";
import { withStyles } from "@material-ui/core/es/styles";

const ManageUnit = ({
  onSelect,
  mode = "single",
  url = "/auto/enterprise",
  value,
  className,
  classes,
}) => {
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const fetch = useCallback(
    async (searchInput) => {
      setIsFetching(true);
      let result = await ServiceBase.requestJson({
        method: "GET",
        url: url,
        data: {},
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        setData(
          _.map(result.value, (unit) => ({
            value: unit.uuid,
            title: unit.name,
            types: unit.types,
            children: _.map(unit.childs, (_item, _index) => {
              return {
                value: _item.uuid,
                title: _item.name,
              };
            }),
          }))
        );
      }
      setIsFetching(false);
    },
    [url]
  );
  useEffect(() => {
    fetch("");
  }, [fetch]);
  return (
    <TreeSelect
      showArrow
      showSearch
      labelInValue
      className={className}
      dropdownClassName={classes.treeSelect}
      mode={mode}
      value={value}
      style={{ width: "100%" }}
      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
      defaultActiveFirstOption={false}
      filterTreeNode={(input, option) => {
        return (
          _.toLower(_.get(option, "props.title.props.children", "")).indexOf(
            input.toLowerCase()
          ) >= 0 ||
          _.toLower(_.get(option, "props.title", "")).indexOf(
            input.toLowerCase()
          ) >= 0
        );
      }}
      treeNodeFilterProp="title"
      placeholder="Chọn đơn vị quản lý"
      notFoundContent={isFetching ? <Spin size="small" /> : "Không có dữ liệu"}
      onChange={(unit) =>
        onSelect({
          key: _.get(unit, "value"),
          label: _.get(unit, "label.props.children", _.get(unit, "label")),
        })
      }
    >
      {_.map(data, (item, index) => {
        return (
          <TreeSelect.TreeNode
            title={<span className="kt-font-bold">{item.title}</span>}
            key={index}
            value={item.value}
          >
            {_.map(item.children, (_item, _index) => {
              return (
                <TreeSelect.TreeNode
                  value={_item.value}
                  title={_item.title}
                  key={_index}
                />
              );
            })}
          </TreeSelect.TreeNode>
        );
      })}
    </TreeSelect>
  );
};
export default memo(
  withStyles({
    treeSelect: {
      // "& .ant-select-tree li:only-child": {
      //   display: "grid",
      //   gridTemplateColumns: "20px auto",
      //   "& ul": {
      //     gridColumn: "1 / 2"
      //   }
      // },
      "& .anticon": {
        fontSize: "15px !important",
        verticalAlign: 0,
      },
    },
  })(ManageUnit)
);
