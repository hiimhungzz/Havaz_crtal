import React from "react";
import { Select, Spin } from "antd";
import { connect } from "react-redux";
import { requestJsonGet } from "../../services/base";
import _ from "lodash";
class SelectVehicel extends React.PureComponent {
  _cache = {};
  fetchUser = searchInput => {
    let param = {};
    if (this.props.url === "organization/all") {
      param = {
        where: "[Op.or]: [{types: iP}, {types: bP},{types: USER}]"
      };
    } else if (
      (this.props.url && this.props.parentId) ||
      this.props.organizationId
    ) {
      param = {
        organizationId: this.props.organizationId
          ? this.props.organizationId
          : this.props.parentId.key
      };
    }
    this.setState({ data: [], fetching: true });
    requestJsonGet({ url: this.props.url, data: param }).then(response => {
      if (this.props.url === "autocomplete/driver") {
        const data = response.data.map((user, userId) => {
          return {
            key: user.uuid,
            label: user.fullName
          };
        });

        this.setState({ data, fetching: false });
      } else if (this.props.url === "category-user-all") {
        const data = response.data.map((user, userId) => {
          return {
            key: user.id,
            label: user.name
          };
        });

        this.setState({ data, fetching: false });
      } else if (this.props.url === "category-ctv-all") {
        const data = response.data.map((user, userId) => {
          return {
            key: user.id,
            label: user.name
          };
        });

        this.setState({ data, fetching: false });
      } else if (
        this.props.url === "entry" &&
        this.props.type === "vehicleType"
      ) {
        const data = response.data.vehicleType.map((user, userId) => {
          return {
            key: user.id,
            label: user.name
          };
        });

        this.setState({ data, fetching: false });
      } else if (
        this.props.url === "entry" &&
        this.props.type === "businessVehicleLicense"
      ) {
        const data = response.data.businessVehicleLicense.map(
          (user, userId) => {
            return {
              key: user.id,
              label: user.name
            };
          }
        );

        this.setState({ data, fetching: false });
      } else if (this.props.url === "autocomplete/vehicle") {
        const data = response.data.map((user, userId) => {
          return {
            key: user.uuid,
            label: user.plate
          };
        });

        this.setState({ data, fetching: false });
      } else if (
        this.props.url === "entry" &&
        this.props.type === "numberSeat"
      ) {
        const data = response.data.numberSeat.map((user, userId) => {
          return {
            key: user.id,
            label: user.name
          };
        });

        this.setState({ data, fetching: false });
      } else if (
        this.props.url === "vehicle-type/all" &&
        this.props.type === "vehicle-type/all"
      ) {
        const data = response.data.map((user, userId) => {
          return {
            key: user.uuid,
            label: user.name
          };
        });

        this.setState({ data, fetching: false });
      } else if (this.props.url === "autocomplete/supplier") {
        let userOrderBy = _.orderBy(response.data, ["types"], ["bP"]);
        const data = userOrderBy.map((user, userId) => {
          return {
            key: user.uuid,
            label: user.name,
            types: user.types
          };
        });

        this.setState({ data, fetching: false });
      } else {
        const data = response.data.map((user, userId) => {
          return {
            key: user.uuid,
            label: user.name
          };
        });
        this.setState({ data, fetching: false });
      }
    });
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      data: []
    };
  }

  render() {
    const { data, fetching } = this.state;
    const { value, onChange, url, placeholder } = this.props;
    return (
      <Select
        value={value}
        onChange={onChange}
        allowClear
        url={url}
        showSearch
        labelInValue
        filterOption={(input, option) =>
          url === "autocomplete/supplier"
            ? option.props.children[1]
                .toLocaleLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            : option.props.children[1]
                .toLocaleLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        }
        placeholder={placeholder}
        notFoundContent={fetching ? <Spin size="small" /> : "Không có dữ liệu"}
        // onChange={onSelectOwner}
        onFocus={() => {
          // if (data.length === 0) {
          this.fetchUser("");
          // }
        }}
        style={{ width: "100%" }}
      >
        
        {data.map((user, userId) => {
          return (
            <Select.Option value={user.key} key={userId}>
              {url === "autocomplete/supplier" ? (
                user.types === "iP" ? (
                  <span role="img" aria-label="China">
                    (CTV)&nbsp;
                  </span>
                ) : (
                  <span role="img" aria-label="China">
                    (CTVDN)&nbsp;
                  </span>
                )
              ) : (
                ""
              )}
              {user.label}
            </Select.Option>
          );
        })}
      </Select>
    );
  }
}
export default connect()(SelectVehicel);
