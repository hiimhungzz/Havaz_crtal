import React, { useCallback, useEffect } from "react";
import { memo, useState } from "react";
import { TreeSelect, Spin } from "antd";
import _ from "lodash";
import ServiceBase from "@Services/ServiceBase";
import { Ui } from "@Helpers/Ui";
import { withStyles } from "@material-ui/core/es/styles";

let timer = null;
const Owner = ({
  onSelect,
  multiple = false,
  url = "/users/filter/list",
  value,
  parentSelectable = false,
  className,
  classes
}) => {
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const fetch = useCallback(
    async searchInput => {
      let param = {
        pageLimit: 20,
        currentPage: 0,
        orderBy: { createdAt: 1 },
        searchInput: searchInput
      };
      setIsFetching(true);
      let result = await ServiceBase.requestJson({
        method: "POST",
        url: url,
        data: param
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        setData(
          _.map(result.value.data, (value, name) => ({
            value: name,
            title: name,
            children: _.map(value, (_item, _index) => {
              return {
                value: `${name}__${_index}`,
                title: `${_index}`,
                children: _.map(_item, (__item, __index) => {
                  return {
                    value: `${_.get(__item, "uuid")}__${_.get(
                      __item,
                      "usersCode",
                      ""
                    )}__${_.get(__item, "roleName")}`,
                    title: `(${__item.roleName}) ${__item.fullName}`
                  };
                })
              };
            })
          }))
        );
      }
      setIsFetching(false);
    },
    [url]
  );
  const _handleSelect = useCallback(
    treeSelected => {
      if (multiple) {
        onSelect(
          _.map(treeSelected, x => ({
            value: x.value,
            label: _.get(x, "label.props.children", _.get(x, "label"))
          }))
        );
      } else {
        onSelect({
          key: _.get(_.split(_.get(treeSelected, "value"), "__", 2), 0),
          usersCode: _.get(_.split(_.get(treeSelected, "value"), "__", 2), 1),
          label: _.get(
            treeSelected,
            "label.props.children",
            _.get(treeSelected, "label")
          )
        });
      }
    },
    [multiple, onSelect]
  );
  useEffect(() => {
    fetch("");
  }, [fetch]);
  return (
    <TreeSelect
      showArrow
      showSearch
      allowClear
      labelInValue
      className={className}
      dropdownClassName={classes.treeSelect}
      multiple={multiple}
      value={value}
      style={{ width: "100%" }}
      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
      defaultActiveFirstOption={false}
      filterTreeNode={false}
      placeholder="Chọn nhân viên phụ trách"
      notFoundContent={isFetching ? <Spin size="small" /> : "Không có dữ liệu"}
      onChange={_handleSelect}
      onSearch={input => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          fetch(input);
        }, 800);
      }}
    >
      {_.map(data, (item, index) => {
        return (
          <TreeSelect.TreeNode
            selectable={parentSelectable}
            title={<span className="kt-font-bold">{item.title}</span>}
            key={`${item.value}__${index}`}
            value={item.value}
          >
            {_.map(item.children, (_item, _index) => {
              return (
                <TreeSelect.TreeNode
                  selectable={parentSelectable}
                  value={_item.value}
                  title={_item.title}
                  key={`${_item.value}__${_index}`}
                >
                  {_.map(_item.children, (__item, __index) => {
                    return (
                      <TreeSelect.TreeNode
                        value={__item.value}
                        title={
                          <b style={{ color: "rgb(108, 114, 147)" }}>
                            {__item.title}
                          </b>
                        }
                        key={`${__item.value}__${__index}`}
                      />
                    );
                  })}
                </TreeSelect.TreeNode>
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
      // }
      "& .anticon": {
        fontSize: "15px !important",
        verticalAlign: 0
      }
    }
  })(Owner)
);
