import React from "react";
import { Input, Select, Spin, Form, Col, Row } from "antd";
import { STATUS } from "@Constants/common";
import { API_URI } from "@Constants";
import Globals from "globals.js";
import RouteCostList from "../../RouteCostList";
import { CitySelect, CustomerSelect } from "../../Utility/common";
import { requestJson } from "../../../services/base";
import "./styles.scss";
import { connect } from "react-redux";
import { SelectDriver } from "../../Utility/common";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 18 },
    xs: { span: 24 }
  }
};

class OwnerSelect extends React.PureComponent {
  _cache = {};
  fetchUser = searchInput => {
    const {url} = this.props;
    if (this._cache[searchInput]) {
      this.setState({ data: this._cache[searchInput] });
      return;
    }
    let param = {
      pageLimit: 10,
      currentPage: 0,
      orderBy: { createdAt: 1 },
      query: {
        userCode: "",
        fullnamePhoneEmail: "",
        organizationIds: [],
        rolesIds: [],
        status: []
      },
      searchInput: searchInput
    };
    this.setState({ data: [], fetching: true });
    requestJson({ url: url ? url : API_URI.GET_LIST_USER, data: param }).then(response => {
      const data = response.data.data.map(user => {
        return {
          key: user.uuid,
          label: user.fullName
        };
      });
      this._cache[searchInput] = data;
      this.setState({ data, fetching: false });
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
    const { value, onSelectOwner } = this.props;
    return (
      <Select
        showArrow
        showSearch
        value={value}
        labelInValue
        filterOption={(input, option) =>
          option.props.children
            .toLocaleLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        }
        placeholder={"Tên phụ trách"}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onChange={onSelectOwner}
        onFocus={() => {
          if (data.length === 0) {
            this.fetchUser("");
          }
        }}
        onSearch={searchInput => {
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

class ManagerSelect extends React.PureComponent {
  _cache = {};
  fetchUser = searchInput => {
    const {url} = this.props;
    if (this._cache[searchInput]) {
      this.setState({ data: this._cache[searchInput] });
      return;
    }
    let param = {
      pageLimit: 10,
      currentPage: 0,
      orderBy: { createdAt: 1 },
      query: {
        userCode: "",
        fullnamePhoneEmail: "",
        organizationIds: [],
        rolesIds: [],
        status: []
      },
      searchInput: searchInput
    };
    this.setState({ data: [], fetching: true });
    requestJson({ url: url ? url : API_URI.GET_LIST_USER, data: param }).then(response => {
      const data = response.data.data.map(user => {
        return {
          key: user.uuid,
          label: user.fullName
        };
      });
      this._cache[searchInput] = data;
      this.setState({ data, fetching: false });
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
    const { value, onSelectOwner } = this.props;
    return (
      <Select
        showArrow
        showSearch
        value={value}
        labelInValue
        filterOption={false}
        placeholder={"Tên quản lý"}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onChange={onSelectOwner}
        onFocus={() => {
          if (data.length === 0) {
            this.fetchUser("");
          }
        }}
        onSearch={searchInput => {
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

class PartnerModal extends React.Component {
  costPer = {};
  cost = [];
  listPartnerCost = [];
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return nextProps.isShow;
  }
  constructor(props) {
    super(props);
    this.state = {
      organizationUuid: ""
    };
  }
  render() {
    const {
      actionName,
      dataSource,
      onClose,
      listPartnerCost,
      costLoading,
      handleSaveRouteCost,
      onSave,
      onCreate,
      onSaveCostPer,
      onSaveCost,
      spinning,
      onChangeFilterDateTime,
      filterDatetime
    } = this.props;
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const { organizationUuid } = this.state;
    const data = dataSource;
    // Todo: Anhnhf: fix khi dang nhap
    const profile = Globals.currentUser;
    const parentId = profile
      ? {
          key: profile.organizationUuid,
          label: profile.organizationName
        }
      : null;
    return (
      <Form
        onSubmit={e => {
          e.preventDefault();
          this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              let submitData = { ...values };
              submitData.managerId = values.managerId.key;
              submitData.ownerId = values.ownerId.key;
              submitData.cityId = values.cityIds.key;
              submitData.category = values.category ? values.category.key : "";
              submitData.parentId = values.parentId.key;
              if (actionName === "create") {
                onCreate(submitData);
              } else {
                submitData["uuid"] = data.uuid;
                onSave(submitData);
                if (this.costPer.per) {
                  let costPer = {
                    uuid: this.costPer.per.uuid,
                    startDate: this.costPer.per["startDate"] || null,
                    endDate: this.costPer.per["endDate"] || null,
                    data: []
                  };
                  Object.keys(this.costPer.per.tempData).forEach(key => {
                    costPer.data.push(this.costPer.per.tempData[key]);
                  });
                  onSaveCostPer(costPer, this.listPartnerCost);
                }
                if (this.cost.length > 0) {
                  this.cost.forEach(co => {
                    if (co.data.length > 0) {
                      onSaveCost(co, this.listPartnerCost);
                    }
                  });
                }
              }
            }
          });
        }}
        {...formItemLayout}
        className="kt-form"
      >
        <div className="kt-portlet">
          <div id="cr-drawer__head" className="kt-portlet__head">
            <div className="kt-portlet__head-label">
              <h3 className="kt-portlet__head-title">
                <i
                  onClick={onClose}
                  className="fa fa-chevron-left cursor-pointer"
                />{" "}
                &nbsp;
                {actionName === "edit"
                  ? "Chỉnh sửa thông tin CTV"
                  : "Thêm mới CTV doanh nghiệp"}
              </h3>
            </div>
          </div>
          <div id="cr-drawer__body" className="kt-portlet__body">
            <Spin spinning={spinning}>
              {actionName === "edit" ? (
                <>
                  <div className="kt-portlet__body p-0">
                    <Row gutter={16}>
                      <Col xs={12}>
                        <Form.Item label="Ref code">
                          {getFieldDecorator("refCode", {
                            initialValue: data.refCode
                          })(
                            <Input
                              placeholder={"Mã từ hệ thống khác(Cyber,HR...)"}
                            />
                          )}
                        </Form.Item>
                        <Form.Item label="Tên rút gọn">
                          {getFieldDecorator("allias", {
                            initialValue: data.allias
                          })(<Input placeholder={"Tên rút gọn"} />)}
                        </Form.Item>
                        <Form.Item label="Tên CTV doanh nghiệp">
                          {getFieldDecorator("name", {
                            initialValue: data.name,
                            rules: [
                              {
                                required: true,
                                message: "Vui lòng nhập dữ liệu"
                              }
                            ]
                          })(<Input placeholder={"Tên CTV doanh nghiệp"} />)}
                        </Form.Item>
                        <Form.Item label="Nhóm CTV">
                          {getFieldDecorator("category", {
                            initialValue: data.objCategory
                              ? {
                                  key: data.objCategory.key,
                                  label: data.objCategory.lable
                                }
                              : undefined,
                            // rules: [
                            //   {
                            //     required: true,
                            //     message: "Vui lòng nhập dữ liệu!"
                            //   }
                            // ]
                          })(
                            <SelectDriver
                              url="category-ctv-all"
                              placeholder="Nhóm CTV"
                              organizationId={organizationUuid}
                              parentId={parentId}
                            />
                          )}
                        </Form.Item>

                        <Form.Item label="Số Điện Thoại">
                          {getFieldDecorator("phone", {
                            initialValue: data.phone,
                            rules: [
                              {
                                required: true,
                                message: "Vui lòng nhập dữ liệu"
                              }
                              // {
                              //   pattern: "^(([+]{1}[0-9]{2}|0)[0-9]{9})$",
                              //   message: "Vui lòng nhập 10 số"
                              // }
                            ]
                          })(<Input placeholder={"Số Điện Thoại Doanh Nghiệp"} />)}
                        </Form.Item>
                        <Form.Item label="E-mail">
                          {getFieldDecorator("email", {
                            initialValue: data.email,
                            rules: [
                              {
                                type: "email",
                                message: "Vui lòng nhập đúng định dạng"
                              }
                            ]
                          })(<Input placeholder={"E-mail"} />)}
                        </Form.Item>
                        <Form.Item label="Địa chỉ" colon={false}>
                          {getFieldDecorator("unit", {
                            initialValue: data.unit
                          })(<Input placeholder={"Địa chỉ"} />)}
                        </Form.Item>
                      </Col>
                      <Col xs={12}>
                        <Form.Item label="Mã số thuế" colon={false}>
                          {getFieldDecorator("taxCode", {
                            initialValue: data.taxCode
                            // rules: [
                            //   {
                            //     pattern: "^[0-9]{13}$",
                            //     message: "Mã số thuế gồm 13 ký tự số"
                            //   }
                            // ]
                          })(<Input placeholder={"Mã số thuế"} />)}
                        </Form.Item>
                        <Form.Item colon={false} label="Đơn vị quản lý">
                          {getFieldDecorator("parentId", {
                            initialValue: data.objParentId,
                            rules: [
                              {
                                required: true,
                                message: "Vui lòng nhập dữ liệu"
                              }
                            ]
                          })(
                            <CustomerSelect
                              url={API_URI.GET_LIST_COMPANY_FOR_ENTERPRISE}
                              onSelect={(customer, data) => {
                                setFieldsValue({
                                  parentId: customer,
                                  category: undefined
                                });
                                this.setState({
                                  organizationUuid: customer.key
                                });
                              }}
                            />
                          )}
                        </Form.Item>
                        <Form.Item label="Thành phố" colon={false}>
                          {getFieldDecorator("cityIds", {
                            initialValue: data.cityIds
                          })(
                            <CitySelect
                              onSelect={cityIds => {
                                setFieldsValue({ cityIds: cityIds });
                              }}
                            />
                          )}
                        </Form.Item>
                        <Form.Item colon={false} label="Phụ trách">
                          {getFieldDecorator("ownerId", {
                            initialValue: {
                              key: data.ownerId,
                              label: data.ownerName
                            },
                            rules: [
                              {
                                required: true,
                                message: "Please input owner"
                              }
                            ]
                          })(
                            <OwnerSelect
                              url={'users/select/iP/list'}
                              onSelectOwner={owner => {
                                setFieldsValue({
                                  ownerId: {
                                    key: owner.key,
                                    label: owner.label
                                  }
                                });
                              }}
                            />
                          )}
                        </Form.Item>
                        <Form.Item colon={false} label="Quản lý">
                          {getFieldDecorator("managerId", {
                            initialValue: {
                              key: data.managerId,
                              label: data.managerName
                            },
                            rules: [
                              {
                                required: true,
                                message: "Vui lòng nhập dữ liệu"
                              }
                            ]

                          })(
                            <OwnerSelect
                              url={"users/select/iP/list"}
                              onSelectOwner={manager => {
                                setFieldsValue({
                                  managerId: {
                                    key: manager.key,
                                    label: manager.label
                                  }
                                });
                              }}
                            />
                          )}
                        </Form.Item>
                        <Form.Item colon={false} label="Trạng thái">
                          {getFieldDecorator("status", {
                            initialValue: data.status || "1"
                          })(
                            <Select
                              style={{ width: "100%" }}
                              placeholder="Trạng thái"
                            >
                              {STATUS.map((status, statusId) => {
                                return (
                                  <Select.Option
                                    key={statusId}
                                    value={status.value}
                                  >
                                    {status.label}
                                  </Select.Option>
                                );
                              })}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                  <div className="kt-portlet__body p-0">
                    <RouteCostList
                      listCost={listPartnerCost}
                      costLoading={costLoading}
                      handleSaveRouteCost={handleSaveRouteCost}
                      listName={"listPartnerCost"}
                      filterDatetime={filterDatetime}
                      onChangeFilterDateTime={e =>
                        onChangeFilterDateTime(data.uuid, e)
                      }
                      getFieldDecorator={getFieldDecorator}
                      setFieldsValue={setFieldsValue}
                      // errors={errors}
                      setCostPerToParent={(costPer, listPartnerCost) => {
                        this.costPer = costPer;
                      }}
                      setCostToParent={(cost, listPartnerCost) => {
                        this.cost = cost;
                      }}
                      // values={values}
                      orgId={data.uuid}
                    />
                  </div>
                </>
              ) : (
                <Row>
                  <Form.Item label="Ref code">
                    {getFieldDecorator("refCode", {
                      initialValue: data.refCode
                    })(
                      <Input placeholder={"Mã từ hệ thống khác(Cyber,HR...)"} />
                    )}
                  </Form.Item>
                  <Form.Item label="Tên rút gọn">
                    {getFieldDecorator("allias", {
                      initialValue: data.allias
                    })(<Input placeholder={"Tên rút gọn"} />)}
                  </Form.Item>
                  <Form.Item colon={false} label="Đơn vị quản lý">
                    {getFieldDecorator("parentId", {
                      initialValue: data.parentId || parentId,
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập dữ liệu"
                        }
                      ]
                    })(
                      <CustomerSelect
                        url={API_URI.GET_LIST_COMPANY_FOR_ENTERPRISE}
                        onSelect={(customer, data) => {
                          setFieldsValue({
                            parentId: customer,
                            category: undefined
                          });
                          this.setState({
                            organizationUuid: customer.key
                          });
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="Tên CTV doanh nghiệp">
                    {getFieldDecorator("name", {
                      initialValue: data.name,
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập dữ liệu"
                        }
                      ]
                    })(<Input placeholder={"Tên CTV doanh nghiệp"} />)}
                  </Form.Item>
                  <Form.Item label="Nhóm CTV">
                    {getFieldDecorator("category", {
                      initialValue: data.objCategory
                        ? {
                            key: data.objCategory.key,
                            label: data.objCategory.lable
                          }
                        : undefined,
                      // rules: [
                      //   {
                      //     required: true,
                      //     message: "Vui lòng nhập dữ liệu"
                      //   }
                      // ]
                    })(
                      <SelectDriver
                        url="category-ctv-all"
                        placeholder="Nhóm CTV"
                        organizationId={organizationUuid}
                        parentId={parentId}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="Số Điện Thoại">
                    {getFieldDecorator("phone", {
                      initialValue: data.phone,
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập dữ liệu"
                        }
                        // {
                        //   pattern: "^(([+]{1}[0-9]{2}|0)[0-9]{9})$",
                        //   message: "Vui lòng nhập 10 số"
                        // }
                      ]
                    })(<Input placeholder={"Số Điện Thoại Doanh Nghiệp"} />)}
                  </Form.Item>
                  <Form.Item label="E-mail">
                    {getFieldDecorator("email", {
                      initialValue: data.email,
                      rules: [
                        {
                          type: "email",
                          message: "Vui lòng nhập đúng định dạng"
                        }
                      ]
                    })(<Input placeholder={"E-mail"} />)}
                  </Form.Item>
                  <Form.Item label="Địa chỉ" colon={false}>
                    {getFieldDecorator("unit", {
                      initialValue: data.unit
                    })(<Input placeholder={"Địa chỉ"} />)}
                  </Form.Item>
                  <Form.Item label="Mã số thuế" colon={false}>
                    {getFieldDecorator("taxCode", {
                      initialValue: data.taxCode
                      // rules: [
                      //   {
                      //     pattern: "^[0-9]{13}$",
                      //     message: "Mã số thuế gồm 13 ký tự số"
                      //   }
                      // ]
                    })(<Input placeholder={"Mã số thuế"} />)}
                  </Form.Item>
                  <Form.Item colon={false} label="Phụ trách">
                    {getFieldDecorator("ownerId", {
                      initialValue: data.ownerId
                        ? {
                            key: data.ownerId,
                            label: data.ownerName
                          }
                        : undefined,
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập dữ liệu"
                        }
                      ]
                    })(
                      <OwnerSelect
                        url={'users/select/iP/list'}
                        onSelectOwner={owner => {
                          setFieldsValue({
                            ownerId: { key: owner.key, label: owner.label }
                          });
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item colon={false} label="Quản lý">
                    {getFieldDecorator("managerId", {
                      initialValue: data.managerId
                        ? {
                            key: data.managerId,
                            label: data.managerName
                          }
                        : undefined,
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập dữ liệu"
                        }
                      ]
                    })(
                      <ManagerSelect
                        url={"users/select/iP/list"}
                        onSelectOwner={manager => {
                          setFieldsValue({
                            managerId: {
                              key: manager.key,
                              label: manager.label
                            }
                          });
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="Thành phố" colon={false}>
                    {getFieldDecorator("cityIds", {
                      initialValue: data.cityIds,
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập dữ liệu"
                        }
                      ]
                    })(
                      <CitySelect
                        onSelect={cityIds => {
                          setFieldsValue({ cityIds: cityIds });
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item colon={false} label="Trạng thái">
                    {getFieldDecorator("status", {
                      initialValue: data.status || "1"
                    })(
                      <Select
                        style={{ width: "100%" }}
                        placeholder="Trạng thái"
                      >
                        {STATUS.map((status, statusId) => {
                          return (
                            <Select.Option key={statusId} value={status.value}>
                              {status.label}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Row>
              )}
            </Spin>
          </div>
          <div id="cr-drawer__foot" className="kt-portlet__foot">
            <button type="submit" className="btn btn-brand btn-icon-sm">
              <i className="fa fa-save" />
              Lưu
            </button>
          </div>
        </div>
      </Form>
    );
  }
}
const App = Form.create({
  mapPropsToFields() {
    return {};
  }
})(PartnerModal);
export default connect()(App);
