import React from "react";
import { TreeSelect, Spin, Tooltip } from "antd";
import { connect } from "react-redux";
import { requestJsonGet } from "../../services/base";
import _ from "lodash";
import "./style.scss";
const { TreeNode } = TreeSelect;
export class TreeSelectDriver extends React.PureComponent {
  _cache = {};
  fetch = (searchInput) => {
    let param = {};
    this.setState({ data: [], fetching: true });
    requestJsonGet({ url: this.props.url, data: param }).then((response) => {
      if (this.props.url === "auto/enterprise") {
        const data = response.data.map((user, userId) => {
          return {
            key: user.uuid,
            value: user.uuid,
            title: user.name,
            types: user.types,
            children: user.childs.map((_item, _index) => {
              return {
                key: _item.uuid,
                value: _item.uuid,
                title: _item.name,
              };
            }),
          };
        });
        this.setState({ data, fetching: false });
      }
    });
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
    };
  }

  render() {
    const { data, fetching } = this.state;
    const { value, onChange, url, placeholder, onSelect } = this.props;
    return (
      <TreeSelect
        showArrow
        showSearch
        labelInValue
        value={value}
        loading={fetching}
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        placeholder={placeholder}
        onFocus={() => {
          this.fetch("");
        }}
        filterTreeNode={(input, option) =>
          option.props.title.props.children
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        }
        // onChange={(value) => onSelect(value, data)}
        onChange={(itemChildSelect, label, extra) => {
          data.map((itemParent) => {
            itemParent.children.map((itemChild) => {
              if (itemChildSelect.value === itemChild.value) {
                onSelect(itemChildSelect, itemParent.key, itemChild);
              }
            });
          });
        }}
        onSearch={(searchInput) => {
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout((e) => {
            this.fetch(searchInput);
          }, 800);
        }}
        style={{ width: "100%" }}
      >
        {data.map((item, index) => {
          return (
            <TreeNode
              title={item.title}
              key={item.key}
              value={item.value}
            >
              {item.children.map((_item, _index) => {
                return (
                    <TreeNode
                      value={_item.value}
                      title={<p>{_item.title}</p>}
                      key={_item.key}
                      style={{fontWeight:"normal"}}
                    />
                );
              })}
            </TreeNode>
          );
        })}
      </TreeSelect>
    );
  }
}
///
export class TreeSelectVehicle extends React.PureComponent {
  _cache = {};
  fetch = (searchInput) => {
    let param = {};
    if ((this.props.url && this.props.parentId) || this.props.organizationId) {
      param = {
        organizationId: this.props.organizationId
          ? this.props.organizationId
          : this.props.parentId.key,
      };
    }
    this.setState({ data: [], fetching: true });
    requestJsonGet({ url: this.props.url, data: param }).then((response) => {
      if (this.props.url === "auto/enterprise") {
        const data = response.data.map((user, userId) => {
          return {
            key: user.uuid,
            value: user.uuid,
            title: user.name,
            types: user.types,
            children: user.childs.map((_item, _index) => {
              return {
                key: _item.uuid,
                value: _item.uuid,
                title: _item.name,
              };
            }),
          };
        });
        this.setState({ data, fetching: false });
      }
    });
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
    };
  }

  render() {
    const { data, fetching } = this.state;
    const { value, onChange, url, placeholder, onSelect } = this.props;
    return (
    
      <TreeSelect
        showSearch
        value={value}
        loading={fetching}
        dropdownStyle={{
          maxHeight: 400,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        placeholder={placeholder}
        labelInValue
        style={{ width: "100%" }}
        onFocus={() => {
          this.fetch("");
        }}
        filterTreeNode={(input, option) =>
          option.props.title.props.children
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        }
        onChange={(value) => {
          onSelect(value, data);
        }}
        onSearch={(searchInput) => {
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout((e) => {
            this.fetch(searchInput);
          }, 800);
        }}
      >
        {data.map((item, index) => {
          return (
            <TreeNode
              title={item.title}
              key={item.key}
              value={item.value}
            >
              {item.children.map((_item, _index) => {
                return (
                  <TreeNode
                    value={_item.value}
                    title={_item.title}
                    key={_item.key}
                    style={{fontWeight:"normal"}}
                  />
                );
              })}
            </TreeNode>
          );
        })}
      </TreeSelect>
    );
  }
}
