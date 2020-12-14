import React from "react";
import { Select, TreeSelect, AutoComplete, Radio } from "antd";
import withStyles from "@material-ui/core/es/styles/withStyles";
import { PagingPanel } from "@devexpress/dx-react-grid-material-ui";
import NumberFormat from "react-number-format";
import { API_URI } from "@Constants";
import { Spin } from "antd";
import _ from "lodash";
import format from "string-format";
import styled from "styled-components";
import {
  requestJson,
  requestJsonGet,
  requestPlaces,
} from "../../services/base";
import {
  TableHeaderRow,
  TableBandHeader,
  Table,
} from "@devexpress/dx-react-grid-material-ui";
import { Ui } from "@Helpers/Ui";
import classNames from "classnames";
import { CircularProgress } from "@material-ui/core";
import { calculateTotalPage } from "helpers/utility";
const { Option } = Select;
export const _$ = window.$;

export const TableHeaderContent = withStyles({
  container: {
    display: "grid",
    gridAutoFlow: "row",
    color: "rgb(108, 114, 147)",
    fontSize: 13,
  },
})(({ classes, column, ...restProps }) => {
  return (
    <TableHeaderRow.Content column={column} {...restProps}>
      <div className={classes.container}>
        {_.isArray(column.title)
          ? column.title.map((e, index) => (
              <span key={index}>
                {e}
                {index === column.title.length - 1 ? "" : " /"}
              </span>
            ))
          : column.title}
      </div>
    </TableHeaderRow.Content>
  );
});
export const CustomizeTableHeaderRow = withStyles({
  container: {
    display: "grid",
    gridAutoFlow: "row",
    color: "rgb(108, 114, 147)",
    fontSize: 13,
  },
})(({ classes, column, contentComponent, ...restProps }) => {
  return (
    <TableHeaderRow
      contentComponent={
        contentComponent ? contentComponent : TableHeaderContent
      }
      cellComponent={({ style, ...props }) => {
        return (
          <TableHeaderRow.Cell
            {...props}
            style={{
              ...style,
              paddingTop: 4,
              paddingBottom: 4,
              background: "rgb(242, 243, 248)",
            }}
          />
        );
      }}
    />
  );
});
export const CustomizeTableBandHeader = withStyles({
  container: {
    display: "grid",
    gridAutoFlow: "row",
    color: "rgb(108, 114, 147)",
    fontSize: 13,
  },
})(({ classes, ...restProps }) => {
  return (
    <TableBandHeader
      {...restProps}
      cellComponent={({ style, ...props }) => (
        <TableBandHeader.Cell
          {...props}
          style={{
            ...style,
            paddingTop: 2,
            paddingBottom: 2,
            textAlign: "center",
            background: "#f2f3f8",
          }}
        />
      )}
    />
  );
});

export const TableCell = withStyles({
  container: {
    fontSize: 12,
  },
})(
  ({
    classes,
    className,
    style,
    customStyle = { paddingTop: 4, paddingBottom: 4 },
    ...restProps
  }) => {
    let cellValue = _.get(restProps, "value");
    if (_.isNumber(cellValue)) {
      cellValue = _.replace(cellValue, /\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return (
      <Table.Cell
        {...restProps}
        title={_.isString(cellValue) ? cellValue : ""}
        value={cellValue}
        style={{ ...style, ...customStyle }}
        className={classNames({
          [className]: true,
          [classes.container]: true,
        })}
      />
    );
  }
);
export const Loading = () => (
  <div className="loading-shading-mui">
    <CircularProgress className="loading-icon-mui" />
  </div>
);

export const NumberFormatCustom = (props) => {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      style={{ textAlign: "right" }}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            value: values.value || null,
          },
        });
      }}
      thousandSeparator
    />
  );
};

const _paging = (props) => {
  // eslint-disable-next-line react/prop-types
  const totalPages = calculateTotalPage(props.totalCount, props.pageSize) || 0;
  return (
    <PagingPanel.Container
      {...props}
      totalPages={totalPages}
      pageSizes={[5, 10, 15, 30, 50, 100]}
    />
  );
};
export const PagingContainer = styled(_paging)`
  padding: 0 !important;
  span {
    display: inline-flex;
    font-size: 12px;
    color: #6c7293;
  }
  div:first-child {
    display: inline-flex;
  }
  div {
    font-size: 12px;
  }
`;

export class CitySelect extends React.PureComponent {
  _cache = {};
  fetch = (searchInput) => {
    let param = {
      pageLimit: 20,
      currentPage: 0,
      orderBy: { name: 1 },
      searchInput: searchInput,
    };
    this.setState({ data: [], fetching: true });
    requestJson({ url: API_URI.GET_LIST_CITY, data: param }).then(
      (response) => {
        const data = response.data.data.map((user) => {
          return {
            key: user.uuid,
            label: user.cityname,
          };
        });
        this._cache[searchInput] = data;
        this.setState({ data, fetching: false });
      }
    );
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
    };
  }

  render() {
    const { data, fetching } = this.state;
    const { value, onSelect, mode = "single" } = this.props;
    return (
      <Select
        allowClear
        showArrow
        mode={mode}
        showSearch
        value={value}
        labelInValue
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        placeholder={"Tên Tỉnh/Thành phố"}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onChange={(city) => onSelect(city, data)}
        onFocus={() => {
          if (data.length === 0) {
            this.fetch("");
          }
        }}
        // onSearch={searchInput => {
        //     if (this.timer) {
        //         clearTimeout(this.timer);
        //     }
        //     this.timer = setTimeout(e => {
        //         this.fetch(searchInput);
        //     }, 800);
        // }}
        style={{ width: "100%" }}
      >
        {data.map((city, cityId) => {
          return (
            <Select.Option title={city.label} value={city.key} key={cityId}>
              {city.label}
            </Select.Option>
          );
        })}
      </Select>
    );
  }
}
export class PlacesLocationSelect extends React.PureComponent {
  fetch = (searchInput) => {
    if (!searchInput) {
      return;
    }
    let param = {
      input: searchInput || "",
      api_token: "hmtvxAd5AQLAaUpjDGEqTZIj2DnR1dGBW7uugUG1gJyvsWVFzIh6n5It6RMk",
    };
    this.setState({ data: [], fetching: true });
    requestPlaces({ url: "/v1/places", param: param }).then((response) => {
      if (response && response.data && response.data.data) {
        const data = response.data.data.map((place) => {
          return {
            key: place.id,
            label: place.description,
          };
        });
        this.setState({ data, fetching: false });
      } else {
        this.setState({ data: [], fetching: false });
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
    const { data, value, fetching } = this.state;
    const { onSelect } = this.props;
    return (
      <Select
        showArrow
        showSearch
        value={value}
        labelInValue
        filterOption={false}
        placeholder={"Tìm kiếm địa chỉ"}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onSelect={(place) => {
          this.setState({
            value: place,
          });
          requestPlaces({
            url: `/v1/places/${place.key}`,
            param: {
              api_token:
                "hmtvxAd5AQLAaUpjDGEqTZIj2DnR1dGBW7uugUG1gJyvsWVFzIh6n5It6RMk",
            },
          }).then((response) => {
            const data = response.data;
            let location = `${data.location.lat},${data.location.lng}`;
            onSelect(location);
          });
        }}
        onFocus={() => {
          if (data.length === 0) {
            this.fetch("");
          }
        }}
        onSearch={(searchInput) => {
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(() => {
            this.fetch(searchInput);
          }, 800);
        }}
        style={{ width: "100%" }}
      >
        {data.map((place, placeId) => {
          return (
            <Select.Option title={place.label} value={place.key} key={placeId}>
              {place.label}
            </Select.Option>
          );
        })}
      </Select>
    );
  }
}

export class CustomerSelect extends React.PureComponent {
  _cache = {};
  fetch = (searchInput) => {
    let param = {
      searchInput: searchInput,
      pageLimit: 20,
      currentPage: 0,
      isSelect: true,
      orderBy: { createdAt: 1 },
      query: {
        codes: "",
        nameOrAdress: "",
        phone: "",
        email: "",
        citys: [],
        status: [],
        startDate: "",
        endDate: "",
        taxCode: "",
      },
    };
    this.setState({ data: [], fetching: true });
    requestJson({
      url: this.props.url ? this.props.url : API_URI.GET_LIST_COMPANY,
      data: param,
    }).then((response) => {
      const data = response.data.data.map((user) => {
        return {
          key: user.uuid,
          label: user.name,
          MOU: user.MOU,
          organizationCode: user.code,
          organizationName: user.organizationName,
          contactAddress: user.unit,
          contactPhone: user.phone,
          contactTel: user.contactTel,
          contactFax: user.contactFax,
          contactEmail: user.contactEmail,
        };
      });
      this._cache[searchInput] = data;
      this.setState({ data, fetching: false });
    });
  };
  static defaultProps = {
    placeHolder: "Tên KH",
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
    };
  }

  render() {
    const { data, fetching } = this.state;
    const {
      value,
      mode = "single",
      onSelect,
      placeholder,
      className,
      disabled,
    } = this.props;
    return (
      <Select
        className={className}
        showArrow
        allowClear
        showSearch
        disabled={disabled ? disabled : false}
        value={value}
        labelInValue
        mode={mode}
        filterOption={false}
        placeholder={placeholder}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onChange={(customer) => onSelect(customer, data)}
        onFocus={() => {
          if (data.length === 0) {
            this.fetch("");
          }
        }}
        onSearch={(searchInput) => {
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(() => {
            this.fetch(searchInput);
          }, 800);
        }}
        style={{ width: "100%" }}
      >
        {data.map((d, dId) => {
          return (
            <Select.Option title={d.label} value={d.key} key={dId}>
              {d.label}
            </Select.Option>
          );
        })}
      </Select>
    );
  }
}

export class NoTypeCustomerSelect extends React.PureComponent {
  _cache = {};
  fetch = (searchInput) => {
    let param = {
      searchInput: searchInput,
      pageLimit: 20,
      currentPage: 0,
      isSelect: true,
      orderBy: { createdAt: 1 },
      query: {
        codes: "",
        nameOrAdress: "",
        phone: "",
        email: "",
        citys: [],
        status: [],
        startDate: "",
        endDate: "",
        taxCode: "",
      },
    };
    this.setState({ data: [], fetching: true });
    requestJson({ url: API_URI.BROWSE_NO_TYPE_CUSTOMER, data: param }).then(
      (response) => {
        const data = response.data.data.map((user) => {
          return {
            key: user.uuid,
            label: `user.name (${
              user.type === "bC" ? "CÁ NHÂN" : "DOANH NGHIỆP"
            })`,
            MOU: user.MOU,
            organizationCode: user.code,
            organizationName: user.organizationName,
            contactAddress: user.unit,
            contactPhone: user.phone,
            contactTel: user.contactTel,
            contactFax: user.contactFax,
            contactEmail: user.contactEmail,
          };
        });
        this._cache[searchInput] = data;
        this.setState({ data, fetching: false });
      }
    );
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
    };
  }

  render() {
    const { data, fetching } = this.state;
    const { value, mode, onSelect, className } = this.props;
    return (
      <Select
        className={className}
        showArrow
        showSearch
        value={value}
        labelInValue
        mode={mode}
        filterOption={false}
        placeholder={"Tên khách hàng"}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onChange={(customer) => onSelect(customer, data)}
        onFocus={() => {
          if (data.length === 0) {
            this.fetch("");
          }
        }}
        onSearch={(searchInput) => {
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(() => {
            this.fetch(searchInput);
          }, 800);
        }}
        style={{ width: "100%" }}
      >
        {data.map((d, dId) => {
          return (
            <Select.Option title={d.label} value={d.key} key={dId}>
              {d.label}
            </Select.Option>
          );
        })}
      </Select>
    );
  }
}

export class BookingSelect extends React.PureComponent {
  _cache = {};
  fetch = (searchInput) => {
    let param = {
      searchInput: searchInput,
      pageLimit: 20,
      currentPage: 0,
      orderBy: {
        createdAt: 1,
        code: 1,
      },
      query: {
        isOwner: [],
        code: [],
        nameOrAdress: "",
        namePhoneEmai: "",
        guideNamePhone: "",
        typeCustomer: "",
        typeBooking: "",
        TypeDate: "",
        startDate: "",
        EndDate: "",
      },
    };
    this.setState({ data: [], fetching: true });
    requestJson({ url: API_URI.GET_LIST_BOOKING, data: param }).then(
      (response) => {
        const data = response.data.data.map((user) => {
          return {
            key: user.uuid,
            label: user.code,
          };
        });
        this.setState({ data, fetching: false });
      }
    );
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
    };
  }

  render() {
    const { data, fetching } = this.state;
    const { value, mode, onSelect, placeholder } = this.props;
    return (
      <Select
        showArrow
        showSearch
        allowClear
        value={value}
        labelInValue
        mode={mode}
        filterOption={false}
        placeholder={placeholder || "Mã booking"}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onChange={(customer) => onSelect(customer, data)}
        onFocus={() => {
          if (data.length === 0) {
            this.fetch("");
          }
        }}
        onSearch={(searchInput) => {
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(() => {
            this.fetch(searchInput);
          }, 800);
        }}
        style={{ width: "100%" }}
      >
        {data.map((d, dId) => {
          return (
            <Select.Option title={d.label} value={d.key} key={dId}>
              {d.label}
            </Select.Option>
          );
        })}
      </Select>
    );
  }
}

export class UserCodeSelect extends React.PureComponent {
  _cache = {};
  fetch = (searchInput) => {
    let param = {
      searchInput: searchInput,
      pageLimit: 20,
      currentPage: 0,
      orderBy: { createdAt: 1 },
      query: {
        userCode: "",
        fullnamePhoneEmail: "",
        organizationIds: [],
        rolesIds: [],
        status: [],
      },
    };
    this.setState({ data: [], fetching: true });
    requestJson({ url: API_URI.GET_LIST_USER, data: param }).then(
      (response) => {
        const data = response.data.data.map((user) => {
          return {
            key: user.usersCode,
            label: (
              <div>
                {user.usersCode} - <code>{user.fullName}</code>
              </div>
            ),
            name: user.fullName,
          };
        });
        this.setState({ data, fetching: false });
      }
    );
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
    };
  }

  render() {
    const { data, fetching } = this.state;
    const { value, mode, onSelect } = this.props;
    return (
      <Select
        showArrow
        showSearch
        allowClear
        value={value}
        labelInValue
        mode={mode}
        filterOption={false}
        placeholder={"Mã nhân viên"}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onChange={(customer) => onSelect(customer, data)}
        onFocus={() => {
          if (data.length === 0) {
            this.fetch("");
          }
        }}
        onSearch={(searchInput) => {
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(() => {
            this.fetch(searchInput);
          }, 800);
        }}
        style={{ width: "100%" }}
      >
        {data.map((d, dId) => {
          return (
            <Select.Option title={d.name} value={d.key} key={dId}>
              {d.label}
            </Select.Option>
          );
        })}
      </Select>
    );
  }
}
export class RoleSelect extends React.PureComponent {
  fetch = (searchInput) => {
    let param = {
      searchInput: searchInput,
      pageLimit: 20,
      currentPage: 0,
      orderBy: { createdAt: 1 },
      query: {},
    };
    this.setState({ data: [], fetching: true });
    requestJson({ url: API_URI.GET_LIST_ROLE, data: param }).then(
      (response) => {
        const data = response.data.data.map((role) => {
          return {
            key: role.uuid,
            label: role.name,
            level: role.level,
          };
        });
        this.setState({ data, fetching: false });
      }
    );
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
    };
  }

  render() {
    const { data, fetching } = this.state;
    const { value, mode, onSelect } = this.props;
    return (
      <Select
        showArrow
        showSearch
        allowClear
        value={value}
        labelInValue
        mode={mode}
        filterOption={false}
        placeholder={"Tên chức danh"}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onChange={(role) => onSelect(role, data)}
        onFocus={() => {
          if (data.length === 0) {
            this.fetch("");
          }
        }}
        onSearch={(searchInput) => {
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(() => {
            this.fetch(searchInput);
          }, 800);
        }}
        style={{ width: "100%" }}
      >
        {data.map((d, dId) => {
          return (
            <Select.Option title={d.name} value={d.key} key={dId}>
              {d.label}
            </Select.Option>
          );
        })}
      </Select>
    );
  }
}
export class PartnerCodeSelect extends React.PureComponent {
  _cache = {};
  fetch = (searchInput) => {
    let param = {
      searchInput: searchInput,
      pageLimit: 20,
      currentPage: 0,
      orderBy: { createdAt: 1 },
      query: {
        userCode: "",
        fullnamePhoneEmail: "",
        organizationIds: [],
        rolesIds: [],
        status: [],
      },
    };
    this.setState({ data: [], fetching: true });
    requestJson({
      url: API_URI.GET_LIST_ORGANIZATION_PARTNER,
      data: param,
    }).then((response) => {
      const data = response.data.data.map((user) => {
        return {
          key: user.code,
          label: (
            <div>
              {user.code} - <code>{user.name}</code>
            </div>
          ),
        };
      });
      this.setState({ data, fetching: false });
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
    const { value, mode, onSelect } = this.props;
    return (
      <Select
        showArrow
        showSearch
        allowClear
        value={value}
        labelInValue
        mode={mode}
        filterOption={false}
        placeholder={"Mã CTV"}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onChange={(customer) => onSelect(customer, data)}
        onFocus={() => {
          if (data.length === 0) {
            this.fetch("");
          }
        }}
        onSearch={(searchInput) => {
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(() => {
            this.fetch(searchInput);
          }, 800);
        }}
        style={{ width: "100%" }}
      >
        {data.map((d, dId) => {
          return (
            <Select.Option title={d.name} value={d.key} key={dId}>
              {d.label}
            </Select.Option>
          );
        })}
      </Select>
    );
  }
}

export class CustomerCodeSelect extends React.PureComponent {
  _cache = {};
  fetch = (searchInput) => {
    let param = {
      searchInput: searchInput,
      pageLimit: 20,
      currentPage: 0,
      isSelect: true,
      orderBy: { createdAt: 1 },
      query: {
        codes: "",
        nameOrAdress: "",
        phone: "",
        email: "",
        citys: [],
        status: [],
        startDate: "",
        endDate: "",
        taxCode: "",
      },
    };
    this.setState({ data: [], fetching: true });
    requestJson({ url: API_URI.GET_LIST_COMPANY, data: param }).then(
      (response) => {
        const data = response.data.data.map((user) => {
          return {
            key: user.code,
            label: (
              <div>
                {user.code} - <code>{user.name}</code>
              </div>
            ),
            name: user.name,
          };
        });
        this.setState({ data, fetching: false });
      }
    );
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
    };
  }

  render() {
    const { data, fetching } = this.state;
    const { value, mode, onSelect } = this.props;
    return (
      <Select
        showArrow
        allowClear
        showSearch
        value={value}
        labelInValue
        mode={mode}
        filterOption={false}
        placeholder={"Mã khách hàng"}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onChange={(customer) => onSelect(customer, data)}
        onFocus={() => {
          if (data.length === 0) {
            this.fetch("");
          }
        }}
        onSearch={(searchInput) => {
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(() => {
            this.fetch(searchInput);
          }, 800);
        }}
        style={{ width: "100%" }}
      >
        {data.map((d, dId) => {
          return (
            <Select.Option title={d.name} value={d.key} key={dId}>
              {d.label}
            </Select.Option>
          );
        })}
      </Select>
    );
  }
}

export class OwnerSelect extends React.PureComponent {
  _cache = {};
  fetchUser = (searchInput) => {
    const { url } = this.props;
    if (this._cache[searchInput]) {
      this.setState({ data: this._cache[searchInput] });
      return;
    }
    let param = {
      pageLimit: 20,
      currentPage: 0,
      orderBy: { createdAt: 1 },
      query: {
        userCode: "",
        fullnamePhoneEmail: "",
        organizationIds: [],
        rolesIds: [],
        status: [],
      },
      searchInput: searchInput,
    };
    this.setState({ data: [], fetching: true });
    requestJson({ url: url ? url : API_URI.GET_LIST_USER, data: param }).then(
      (response) => {
        const data = response.data.data.map((user) => {
          return {
            key: user.uuid,
            label: user.fullName,
            usersCode: user.usersCode,
          };
        });
        this._cache[searchInput] = data;
        this.setState({ data, fetching: false });
      }
    );
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
    };
  }

  render() {
    const { data, fetching } = this.state;
    const { value, onSelect, mode, className } = this.props;
    return (
      <Select
        showArrow
        showSearch
        mode={mode}
        className={className}
        value={value}
        labelInValue
        filterOption={false}
        placeholder={"Tên phụ trách"}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onChange={(owner) => onSelect(owner, data)}
        onFocus={() => {
          if (data.length === 0) {
            this.fetchUser("");
          }
        }}
        onSearch={(searchInput) => {
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(() => {
            this.fetchUser(searchInput);
          }, 800);
        }}
        style={{ width: "100%" }}
      >
        {data.map((user, userId) => {
          return (
            <Select.Option value={user.key} key={userId}>
              {user.label}
            </Select.Option>
          );
        })}
      </Select>
    );
  }
}

export class RouteSelect extends React.PureComponent {
  fetch = ({ searchInput }) => {
    let { organizationId, record } = this.props;
    if (!organizationId) {
      Ui.showWarning({ message: "Chưa chọn khách hàng." });
      return;
    }
    let param = {
      searchInput: searchInput,
      pageLimit: 100,
      currentPage: 0,
      customerId: organizationId,
      filterDatetime: record["pickUpAt"],
      vehiclesId: record["actualVehiclesTypeId"]
        ? record["actualVehiclesTypeId"]
        : record["vehicleTypeId"] || "",
    };
    this.setState({
      searchInput: searchInput,
      fetching: true,
    });
    requestJson({
      url: API_URI.GET_LIST_ROUTE_BY_CUSTOMER_ID,
      data: param,
    }).then((response) => {
      const data = response.data.data.map((route) => {
        let distanceRender = " - 0 Km";
        if (route.distance) {
          distanceRender = format(" - {0} Km", route.distance);
        }
        return {
          key: route.uuid,
          label: format("{0}{1}", route.name, distanceRender),
          distance: route.distance,
          name: route.name,
          fixedRoutesCode: route.code,
          costPerKm: route.costPerKm,
          perDay: route.perDay,
          overNightCost: route.overNightCost,
        };
      });

      this.setState((prevState) => {
        let newState = { ...prevState };
        newState.fetching = false;
        newState.data = data;
        return newState;
      });
    });
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
      searchInput: "",
    };
  }
  render() {
    const { data, fetching } = this.state;
    const { value, onSelect, mode, className } = this.props;
    return (
      <Select
        showArrow
        allowClear
        showSearch
        className={className}
        mode={mode}
        value={value}
        labelInValue
        filterOption={false}
        placeholder="Tên tuyến đường"
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onChange={(route) => onSelect(route, data)}
        onFocus={() => {
          if (data.length === 0) {
            this.fetch({ searchInput: "" });
          }
        }}
        onSearch={(searchInput) => {
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(() => {
            this.fetch({ searchInput });
          }, 500);
        }}
        style={{ width: "100%", minWidth: 350 }}
      >
        {data.map((route, routeId) => {
          return (
            <Select.Option value={route.key} key={routeId}>
              {route.label}
            </Select.Option>
          );
        })}
      </Select>
    );
  }
}

export class TourSelect extends React.PureComponent {
  _cache = {};
  fetch = ({ searchInput }) => {
    let param = {
      searchInput: searchInput,
      query: {},
      orderBy: { createdAt: 1 },
      pageLimit: 20,
      currentPage: 0,
    };
    this.setState({
      searchInput: searchInput,
      fetching: true,
    });
    requestJson({ url: API_URI.BROWSE_TOUR, data: param }).then((response) => {
      const data = response.data.data.map((route) => {
        return {
          key: route.id,
          label: route.name,
          numberOfNights: route.numberOfNights,
          id: route.id,
          code: route.code,
          numberOfDays: route.numberOfDays,
        };
      });
      this.setState({
        data,
        fetching: false,
      });
    });
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
      fetching: false,
    };
  }

  render() {
    const { data, fetching } = this.state;
    const {
      value,
      className,
      onSelect,
      mode,
      currentRoute,
      placeHolder,
    } = this.props;
    return (
      <Select
        className={className}
        showArrow
        showSearch
        mode={mode}
        value={value}
        labelInValue
        filterOption={false}
        defaultActiveFirstOption={false}
        placeholder={placeHolder}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onChange={(route) => onSelect(route, data)}
        onFocus={() => {
          if (data.length === 0) {
            this.fetch({ searchInput: "" });
          }
        }}
        onSearch={(searchInput) => {
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(() => {
            this.fetch({ searchInput: searchInput });
          }, 800);
        }}
        style={{ width: "100%" }}
      >
        {data.map((route, routeId) => {
          if (currentRoute.find((r) => r === route.key)) {
            return (
              <Select.Option disabled value={route.key} key={routeId}>
                {route.label}
              </Select.Option>
            );
          }
          return (
            <Select.Option value={route.key} key={routeId}>
              {route.label}
            </Select.Option>
          );
        })}
      </Select>
    );
  }
}

export class DriverSelect extends React.PureComponent {
  _cache = {};
  fetch = (searchInput) => {
    let param = {
      pageLimit: 20,
      currentPage: 0,
      orderBy: { lastUpdatedAt: 1 },
      searchInput: searchInput,
      query: {
        partnerUuid: this.props.partnerUuid ? this.props.partnerUuid : "",
      },
    };
    this.setState({ data: [], fetching: true });
    requestJson({ url: API_URI.GET_LIST_DRIVER, data: param }).then(
      (response) => {
        const data = response.data.data.map((driver) => {
          return {
            key: driver.uuid,
            label: driver.fullName,
          };
        });
        console.log("ADASDSADASDAS", data);
        this.setState({ data, fetching: false });
      }
    );
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
    };
  }

  render() {
    const { data, fetching } = this.state;
    const { value, onSelect, mode, isAll, disabled } = this.props;
    const dataNew = [{ key: "1", label: "Tất cả" }, ...data];
    const listDriver = isAll ? dataNew : data;
    return (
      <Select
        showArrow
        showSearch
        mode={mode}
        disabled={disabled}
        value={value}
        labelInValue
        filterOption={false}
        placeholder={"Tên lái xe"}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onChange={(route) => onSelect(route, listDriver)}
        onFocus={() => {
          this.fetch("");
        }}
        onSearch={(searchInput) => {
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(() => {
            this.fetch(searchInput);
          }, 800);
        }}
        style={{ width: "100%" }}
      >
        {listDriver.map((route, routeId) => {
          return (
            <Select.Option value={route.key} key={routeId}>
              {route.label}
            </Select.Option>
          );
        })}
      </Select>
    );
  }
}

export class VehicleSelect extends React.PureComponent {
  _cache = {};
  fetch = (searchInput) => {
    let { record } = this.props;
    let param = {
      pageLimit: 20,
      currentPage: 0,
      orderBy: { lastUpdatedAt: 1 },
      searchInput: searchInput,
      query: {
        partnerUuid: this.props.partnerUuid ? this.props.partnerUuid : "",
        vehicleTypeUuid:
          record && record.actualVehiclesTypeId
            ? [record.actualVehiclesTypeId]
            : [],
      },
    };
    this.setState({ data: [], fetching: true });
    requestJson({ url: API_URI.GET_LIST_VEHICLE, data: param }).then(
      (response) => {
        const data = response.data.data.map((vehicle) => {
          return {
            key: vehicle.uuid,
            label: vehicle.plate,
          };
        });
        this._cache[searchInput] = data;
        this.setState({ data, fetching: false });
      }
    );
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
    };
  }

  render() {
    const { data, fetching } = this.state;
    const { value, onSelect, mode, disabled = false, placeholder } = this.props;
    return (
      <Select
        showArrow
        showSearch
        mode={mode}
        disabled={disabled}
        value={value}
        labelInValue
        filterOption={false}
        placeholder={placeholder || "Biển số xe"}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onChange={(route) => onSelect(route, data)}
        onFocus={() => {
          this.fetch("");
        }}
        onSearch={(searchInput) => {
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(() => {
            this.fetch(searchInput);
          }, 800);
        }}
        style={{ width: "100%" }}
      >
        {data.map((route, routeId) => {
          return (
            <Select.Option value={route.key} key={routeId}>
              {route.label}
            </Select.Option>
          );
        })}
      </Select>
    );
  }
}
export class HighwaySelect extends React.PureComponent {
  fetch = (searchInput) => {
    let param = {
      pageLimit: 100,
      currentPage: 0,
      orderBy: { name: 1 },
      searchInput: searchInput,
      query: {},
    };
    this.setState({ data: [], fetching: true });
    requestJson({ url: API_URI.BROWSE_HIGH_WAY, data: param }).then(
      (response) => {
        const data = response.data.data.map((highway) => {
          return {
            key: highway.id,
            label: highway.name,
          };
        });
        this.setState({ data, fetching: false });
      }
    );
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
    };
  }
  componentDidMount() {
    this.fetch("");
  }

  render() {
    const { data } = this.state;
    const { value, onSelect, mode } = this.props;
    return (
      <Select
        showArrow
        showSearch
        mode={mode}
        value={value}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        placeholder={"Tên cao tốc"}
        onChange={(highway) => onSelect(highway, data)}
        style={{ width: "100%" }}
      >
        {data.map((highway, highwayId) => {
          return (
            <Select.Option value={highway.key} key={highwayId}>
              {highway.label}
            </Select.Option>
          );
        })}
      </Select>
    );
  }
}

export class OwnerBookingSelect extends React.PureComponent {
  _cache = {};
  fetch = (searchInput) => {
    let param = {
      pageLimit: 20,
      currentPage: 0,
      orderBy: { createdAt: 1 },
      searchInput: searchInput,
    };
    this.setState({ data: [], fetching: true });
    requestJson({ url: API_URI.GET_LIST_USER_FILTER, data: param }).then(
      (response) => {
        let treeData = [];
        _.map(response.data.data, (fieldValue, fieldName) => {
          treeData.push({
            title: fieldName,
            value: fieldName,
            key: fieldName,
            children: fieldValue.map((f) => {
              return {
                title: f.fullName,
                value: f.uuid,
                key: f.uuid,
              };
            }),
          });
        });
        this.setState({ data: treeData, fetching: false });
      }
    );
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
    };
  }

  render() {
    const { data, fetching } = this.state;
    const { value, onSelect } = this.props;
    return (
      <TreeSelect
        multiple
        showArrow
        allowClear
        showSearch
        labelInValue
        value={value}
        loading={fetching}
        filterTreeNode={false}
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        treeData={data}
        placeholder="NV phụ trách booking"
        treeDefaultExpandAll
        onFocus={() => {
          this.fetch("");
        }}
        onChange={(value) => onSelect(value, data)}
        onSearch={(searchInput) => {
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(() => {
            this.fetch(searchInput);
          }, 800);
        }}
        style={{ width: "100%" }}
      />
    );
  }
}
export class SelectBase extends React.PureComponent {
  _cache = {};
  fetch = (searchInput) => {
    let param = {
      pageLimit: this.props.pageLimit,
      currentPage: this.props.currentPage,
      searchInput: searchInput,
    };
    if (
      (this.props.apiUrl && this.props.parentId) ||
      this.props.organizationId
    ) {
      param = {
        organizationId: this.props.organizationId
          ? this.props.organizationId
          : this.props.parentId.key,
      };
    }
    this.setState({ data: [], fetching: true });
    requestJsonGet({ url: this.props.apiUrl, data: param }).then((response) => {
      const data =
        response &&
        response.data.docs.map((item) => {
          return {
            key: item.key,
            label: item.label,
          };
        });
      this.setState({ data, fetching: false });
    });
  };

  static defaultProps = {
    placeHolder: "Chọn",
    currentPage: 0,
    pageLimit: 20,
    apiUrl: API_URI.GET_LIST_CITY,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
    };
  }

  render() {
    const { data, fetching } = this.state;
    const { value, onSelect, mode = "single", placeholder } = this.props;
    return (
      <Select
        allowClear
        showArrow
        mode={mode}
        showSearch
        value={value}
        labelInValue
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        placeholder={placeholder}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onChange={(item) => onSelect(item, data)}
        onFocus={() => {
          if (data.length === 0) {
            this.fetch("");
          }
        }}
        onSearch={(searchInput) => {
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(() => {
            this.fetch(searchInput);
          }, 800);
        }}
        style={{ width: "100%" }}
      >
        {data.map((item, index) => {
          return (
            <Select.Option title={item.label} value={item.key} key={index}>
              {item.label}
            </Select.Option>
          );
        })}
      </Select>
    );
  }
}

export class SelectBaseSon extends React.PureComponent {
  _cache = {};
  fetch = (searchInput) => {
    let param = {
      limmit: this.props.pageLimit,
      q: searchInput,
    };
    this.setState({ data: [], fetching: true });
    requestJsonGet({ url: this.props.apiUrl, data: param }).then((response) => {
      const data =
        response &&
        response.data.map((item) => {
          return {
            key: item.key,
            label: item.label,
          };
        });
      this.setState({ data, fetching: false });
    });
  };

  static defaultProps = {
    placeHolder: "Chọn",
    currentPage: 0,
    pageLimit: 20,
    apiUrl: API_URI.GET_LIST_CITY,
    style: {},
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
    };
  }

  render() {
    const { data, fetching } = this.state;
    const { value, onSelect, mode = "single", placeholder, style } = this.props;
    return (
      <Select
        style={style}
        allowClear
        showArrow
        mode={mode}
        showSearch
        value={value}
        labelInValue
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        placeholder={placeholder}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onChange={(item) => onSelect(item, data)}
        onFocus={() => {
          if (data.length === 0) {
            this.fetch("");
          }
        }}
        onSearch={(searchInput) => {
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(() => {
            this.fetch(searchInput);
          }, 800);
        }}
        style={{ width: "100%" }}
      >
        {data.map((item, index) => {
          return (
            <Select.Option title={item.label} value={item.key} key={index}>
              {item.label}
            </Select.Option>
          );
        })}
      </Select>
    );
  }
}

export class ButtonRadio extends React.PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
      defaultData: "DRIVER",
    };
  }
  render() {
    const { value, onChange, dataDriver } = this.props;
    return (
      <Radio.Group value={value} onChange={onChange}>
        {dataDriver.map((item) => {
          return (
            <Radio key={item.id} value={item.id}>
              {item.name}
            </Radio>
          );
        })}
      </Radio.Group>
    );
  }
}
export class SelectDriver extends React.PureComponent {
  _cache = {};
  fetchUser = () => {
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
      if (this.props.url === "driver") {
        const data = response.data.docs.map((user) => {
          return {
            key: user.uuid,
            label: user.fullName,
          };
        });

        this.setState({ data, fetching: false });
      } else if (this.props.url === "category-ctv-all") {
        const data = response.data.map((user) => {
          return {
            key: user.id,
            label: user.name,
          };
        });

        this.setState({ data, fetching: false });
      } else if (this.props.url === "category-survey-type") {
        const data = response.data.map((user) => {
          return {
            key: user.value,
            label: user.name,
          };
        });

        this.setState({ data, fetching: false });
      } else if (this.props.url === "category-driver-partner-all") {
        const data = response.data.map((user) => {
          return {
            key: user.id,
            label: user.name,
          };
        });

        this.setState({ data, fetching: false });
      } else if (this.props.url === "category-survey-parent") {
        const data = response.data.map((user) => {
          return {
            key: user.id,
            label: user.name,
          };
        });

        this.setState({ data, fetching: false });
      } else if (this.props.url === "/autocomplete/supplier") {
        let userOrderBy = _.orderBy(response.data, ["types"], ["bP"]);
        const data = userOrderBy.map((user) => {
          return {
            key: user.uuid,
            label: user.name,
            types: user.types,
          };
        });

        this.setState({ data, fetching: false });
      } else if (this.props.url === "autocomplete/sub-driver/all") {
        const data = response.data.map((user) => {
          return {
            key: user.uuid,
            label: user.fullName,
          };
        });

        this.setState({ data, fetching: false });
      } else if (
        this.props.url === "entry" &&
        this.props.type === "classLicenseDriver"
      ) {
        const data = response.data.classLicenseDriver.map((user) => {
          return {
            key: user.id,
            label: user.name,
          };
        });

        this.setState({ data, fetching: false });
      } else if (
        this.props.url === "entry" &&
        this.props.type === "typeDriver"
      ) {
        const data = response.data.typeDriver.map((user) => {
          return {
            key: user.id,
            label: user.name,
          };
        });

        this.setState({ data, fetching: false });
      } else if (
        this.props.url === "entry" &&
        this.props.type === "statusUser"
      ) {
        const data = response.data.statusUser.map((user) => {
          return {
            key: user.id,
            label: user.name,
          };
        });

        this.setState({ data, fetching: false });
      } else if (
        this.props.url === "entry" &&
        this.props.type === "numberSeat"
      ) {
        const data = response.data.numberSeat.map((user) => {
          return {
            key: user.id,
            label: user.name,
          };
        });

        this.setState({ data, fetching: false });
      } else if (
        this.props.url === "entry" &&
        this.props.type === "roleFeedBack"
      ) {
        const data = response.data.roleFeedBack.map((user) => {
          return {
            key: user.id,
            label: user.name,
          };
        });

        this.setState({ data, fetching: false });
      } else {
        const data = response.data.map((user) => {
          return {
            key: user.uuid,
            label: user.name,
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
    this.fetchUser("");
  }
  render() {
    const { data, fetching } = this.state;
    const { value, onChange, url, placeholder, disabled } = this.props;
    return (
      <Select
        value={value}
        onChange={onChange}
        url={url}
        showSearch
        labelInValue
        disabled={disabled}
        filterOption={(input, option) =>
          url === "category-ctv-all" || url === "autocomplete/supplier"
            ? option.props.children[1]
                .toLocaleLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            : option.props.children[1]
                .toLocaleLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        }
        placeholder={placeholder}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        // onChange={onSelectOwner}
        onFocus={() => {
          this.fetchUser("");
        }}
        onSearch={(searchInput) => {
          if (this.timer) {
            clearTimeout(this.timer);
          }

          this.timer = setTimeout(() => {
            this.fetchUser(searchInput);
          }, 800);
        }}
        style={{ width: "100%" }}
      >
        {data.map((user, userId) => {
          return (
            <Option value={user.key} key={userId} title={user.label}>
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
            </Option>
          );
        })}
      </Select>
    );
  }
}
export class SelectSuggest extends React.PureComponent {
  _cache = {};
  fetch = (searchInput) => {
    if (this._cache[searchInput]) {
      this.setState({ data: this._cache[searchInput] });
      return;
    }
    let param = {
      pageLimit: 10,
      currentPage: 0,
      orderBy: { createdAt: 1 },
      query: {
        endPoint: "",
        routesCode: "",
        startPoint: "",
        status: [],
      },
      searchInput: searchInput,
    };

    if (this.props.url === "autocomplete/supplier") {
    }
    this.setState({ data: [], fetching: true });
    requestJson({ url: API_URI.GET_LIST_ROUTE, data: param }).then((res) => {
      let result = res.data.data;
      const data = result
        ? result.map((item) => {
            return item.code;
          })
        : null;
      this._cache[searchInput] = data;
      this.setState({ data, fetching: false });
    });
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
    };
  }
  componentDidMount() {
    this.fetch("");
  }
  render() {
    const { data, fetching } = this.state;
    const { onChange, placeholder, value } = this.props;
    return (
      <AutoComplete
        value={value}
        filterOption={(input, option) =>
          option.props.children
            .toLowerCase()
            .startsWith(input.toLowerCase()) === true
        }
        placeholder={placeholder}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onChange={onChange}
        onFocus={() => {
          if (data.length === 0) {
            this.fetch("");
          }
        }}
        style={{ width: "100%" }}
      >
        {data.map((user, userId) => {
          return (
            <AutoComplete.Option value={user} key={userId}>
              {user}
            </AutoComplete.Option>
          );
        })}
      </AutoComplete>
    );
  }
}
