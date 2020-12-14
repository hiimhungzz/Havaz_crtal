import React, { useCallback, useEffect } from "react";
import { memo, useState } from "react";
import { TreeSelect, Spin } from "antd";
import _ from "lodash";
import ServiceBase from "@Services/ServiceBase";
import { Ui } from "@Helpers/Ui";
import { withStyles } from "@material-ui/core/es/styles";

let timer = null;
const NoTypeBranchCustomer = ({
  onSelect,
  multiple = false,
  labelNoType = false,
  parentSelectable = false,
  url = "/partners/select/iC-bC-brC/list",
  placeholder = "Chọn khách hàng",
  classes,
  value,
  className,
}) => {
  const [data, setData] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const fetch = useCallback(
    async (searchInput) => {
      setIsFetching(true);
      let result = await ServiceBase.requestJson({
        method: "POST",
        url: url,
        data: {
          searchInput: searchInput,
          pageLimit: 20,
          currentPage: 0,
          orderBy: { name: 1 },
          query: {},
        },
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        let grouped = _.groupBy(_.get(result, "value.data", []), "parentUuid");
        let tempData = [];
        _.forEach(grouped, (group, groupId) => {
          tempData.push({
            value: groupId,
            title: _.get(group, "0.parentName"),
            childs: _.map(group, (x) => ({
              value: x.uuid,
              title: labelNoType
                ? x.name
                : `(${
                    x.types === "iC"
                      ? "KH CN"
                      : x.types === "iP"
                      ? "CTV CN"
                      : x.types === "bP"
                      ? "CTV DN"
                      : x.types === "bC"
                      ? "KH DN"
                      : x.types === "brC"
                      ? "COR"
                      : ""
                  }) ${x.name}`,
              MOU: x.MOU,
              organizationCode: x.code,
              organizationName: x.organizationName,
              contactAddress: x.unit,
              contactPhone: x.phone,
              contactTel: x.contactTel,
              contactFax: x.contactFax,
              contactEmail: x.contactEmail,
            })),
          });
        });

        setRawData(_.get(result, "value.data", []));
        setData(tempData);
      }
      setIsFetching(false);
    },
    [labelNoType, url]
  );
  const _handleSelect = useCallback(
    (treeSelected) => {
      if (multiple) {
        onSelect(
          _.map(treeSelected, (x) => ({
            value: x.value,
            label: _.get(x, "label.props.children", _.get(x, "label")),
          }))
        );
      } else {
        let finded = _.find(
          rawData,
          (x) =>
            x.uuid === _.get(_.split(_.get(treeSelected, "value"), "__", 1), 0)
        );
        onSelect({
          key: _.get(finded, "uuid"),
          label: _.get(
            treeSelected,
            "label.props.children",
            _.get(treeSelected, "label")
          ),
          MOU: _.get(finded, "MOU", false),
          organizationCode: _.get(finded, "code", ""),
          organizationName: _.get(finded, "organizationName", ""),
          contactAddress: _.get(finded, "unit", ""),
          contactPhone: _.get(finded, "phone", ""),
          contactTel: _.get(finded, "contactTel", ""),
          contactFax: _.get(finded, "contactFax", ""),
          contactEmail: _.get(finded, "contactEmail_", ""),
        });
      }
    },
    [multiple, onSelect, rawData]
  );
  useEffect(() => {
    fetch("");
  }, [fetch]);
  return (
    <TreeSelect
      showArrow
      showSearch
      autoClearSearchValue={multiple}
      allowClear
      labelInValue
      className={className}
      dropdownClassName={classes.treeSelect}
      multiple={multiple}
      searchValue={searchInput}
      value={value}
      style={{ width: "100%" }}
      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
      defaultActiveFirstOption={false}
      filterTreeNode={(input, option) =>
        option.props.title.props.children
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      }
      placeholder={placeholder}
      notFoundContent={isFetching ? <Spin size="small" /> : "Không có dữ liệu"}
      onChange={_handleSelect}
      onSearch={(input) => {
        setSearchInput(input);
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
            {_.map(item.childs, (_item, _index) => {
              return (
                <TreeSelect.TreeNode
                  value={_item.value}
                  title={
                    <b style={{ color: "rgb(108, 114, 147)" }}>{_item.title}</b>
                  }
                  key={`${_item.value}__${_index}`}
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
      // }
      "& .anticon": {
        fontSize: "15px !important",
        verticalAlign: 0,
      },
    },
  })(NoTypeBranchCustomer)
);
