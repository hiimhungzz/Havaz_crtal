import React from "react";
import { Checkbox, Col, Form, Input, Row, Select, Spin } from "antd";
import Globals from "globals.js";
import { STATUS } from "@Constants/common";
import { API_URI } from "@Constants";
import UploadFile from "../upload/UploadFile";
import { requestJson } from "@Services/base";
import SelectCategory from "./../../../containers/Vehicle/VehicleSelect";

import "./styles.scss";
import { CitySelect, CustomerSelect } from "../../Utility/common";
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  }
};

class OwnerSelect extends React.PureComponent {
  _cache = {};
  fetchUser = searchInput => {
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
    requestJson({ url: API_URI.GET_LIST_USER, data: param }).then(response => {
      const data = response.data.data.map(user => {
        return {
          key: user.uuid,
          label: user.fullName,
          phoneNumber: user.phoneNumber
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
    const { value, onSelectOwner, placeholder } = this.props;
    return (
      <Select
        showArrow
        showSearch
        value={value}
        placeholder={placeholder}
        labelInValue
        filterOption={false}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onChange={owner => {
          let finded = data.find(x => x.key === owner.key);
          onSelectOwner(owner, finded);
        }}
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
class CustomerEnterpriseModel extends React.Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.dataSource.files !== this.props.dataSource.files) {
      this.arrayImgURL = nextProps.dataSource.files;
    } else {
      // this.arrayImgURL = []
    }
  }
  costPer = {};
  cost = [];
  listCustomerCost = [];
  arrayImgURL = [];
  // onDownload = e => {
  //   const url = e.response ? e.response.url : "";
  //   const name = e.name ? e.name : "";
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.setAttribute("download", `${name}`); //or any other extension
  //   document.body.appendChild(link);
  //   link.click();
  // };
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.isShow;
  }
  normFile = e => {
    console.log("Upload event:", e);

    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  render() {
    const {
      actionName,
      dataSource,
      onClose,
      spinning,
      onCreate,
      onSave,
      onSaveCost,
      onSaveCostPer
    } = this.props;
    const {
      getFieldDecorator,
      setFieldsValue,
      getFieldValue
    } = this.props.form;
    const data = dataSource;
    const _this = this;
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
              // submitData.managerId = values.managerId.key;
              submitData.ownerId = values.ownerId.key;
              submitData.cityId = values.cityIds.key;
              submitData.MOU = values.MOU || false;
              submitData.quickPayment = values.quickPayment || false;
              submitData.files = values.files ? values.files : [];
              submitData.category = values.category ? values.category.key : "";
              submitData.parentId = values.parentId.key;
              if (actionName === "create") {
                onCreate(submitData);
              } else {
                submitData["uuid"] = data.uuid;
                onSave(submitData);
                if (_this.costPer.per) {
                  let costPer = {
                    uuid: _this.costPer.per.uuid,
                    startDate: _this.costPer.per["startDate"] || null,
                    endDate: _this.costPer.per["endDate"] || null,
                    data: []
                  };
                  Object.keys(_this.costPer.per.tempData).forEach(key => {
                    costPer.data.push(this.costPer.per.tempData[key]);
                  });
                  onSaveCostPer(costPer);
                }
                if (_this.cost.length > 0) {
                  _this.cost.forEach(co => {
                    if (co.data.length > 0) {
                      onSaveCost(co);
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
                  ? "Chỉnh sửa thông tin khách hàng"
                  : actionName === "create"
                  ? "Thêm khách hàng"
                  : "Chỉnh sửa thông tin khách hàng"}
              </h3>
            </div>
          </div>
          <div id="cr-drawer__body" className="kt-portlet__body">
            <Spin spinning={spinning}>
              <Row gutter={10}>
                <Col span={24}>
                  <Form.Item label="Tên rút gọn">
                    {getFieldDecorator("allias", {
                      initialValue: data.allias
                    })(<Input placeholder={"Tên rút gọn"} />)}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Ref code">
                    {getFieldDecorator("refCode", {
                      initialValue: data.refCode
                    })(
                      <Input placeholder={"Mã từ hệ thống khác(Cyber,HR...)"} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item colon={false} label="Nv sale phụ trách">
                    {getFieldDecorator("ownerId", {
                      initialValue: data.ownerId
                        ? { key: data.ownerId, label: data.ownerName }
                        : undefined,
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập dữ liệu"
                        }
                      ]
                    })(
                      <OwnerSelect
                        placeholder="Nhân viên sale phụ trách"
                        onSelectOwner={(owner, data) => {
                          setFieldsValue({
                            ownerId: { key: owner.key, label: owner.label },
                            ownerPhone: data.phoneNumber
                          });
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="SĐT NV sale">
                    {getFieldDecorator("ownerPhone", {
                      initialValue: data.ownerPhone,
                      rules: [
                        {
                          pattern:
                            "^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$",
                          message: "Vui lòng nhập đúng số"
                        }
                      ]
                    })(<Input disabled placeholder={"SĐT NV sale"} />)}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Mã số thuế" colon={false}>
                    {getFieldDecorator("taxCode", {
                      initialValue: data.taxCode
                      // rules: [
                      // {
                      //   min: 0,
                      //   max: 13,
                      //   message: "Vui lòng nhập 13 ký tự"
                      // }
                      // {
                      //     pattern: '^[0-9]{13}$',
                      //     message: 'Vui lòng nhập 13 số'
                      // }
                      // ]
                    })(<Input placeholder={"Mã số thuế"} />)}
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item colon={false} label="Nhóm khách hàng">
                    {getFieldDecorator("category", {
                      initialValue: data.category
                        ? {
                            key: data.category,
                            label: data.objCategory
                              ? data.objCategory.label
                              : ""
                          }
                        : undefined,
                      rules: [
                        //  {
                        //    required: true,
                        //    message: "Vui lòng nhập dữ liệu"
                        //  }
                      ]
                    })(
                      <SelectCategory
                        organizationId={
                          getFieldValue("parentId")
                            ? getFieldValue("parentId").key || parentId
                            : parentId
                        }
                        url="category-user-all"
                        placeholder="Nhóm khách hàng"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={24}>
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
                        onSelect={customer => {
                          setFieldsValue({
                            parentId: customer,
                            category: undefined
                          });
                          this.setState({
                            organizationId: customer.key
                          });
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Tên KH doanh nghiệp" colon={false}>
                    {getFieldDecorator("name", {
                      initialValue: data.name,
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập dữ liệu"
                        }
                      ]
                    })(<Input placeholder="Tên KH doanh nghiệp" />)}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Đại diện doanh nghiệp" colon={false}>
                    {getFieldDecorator("represent", {
                      initialValue: data.represent
                      // rules: [
                      // {
                      //   min: 0,
                      //   max: 13,
                      //   message: "Vui lòng nhập 13 ký tự"
                      // }
                      // {
                      //     pattern: '^[0-9]{13}$',
                      //     message: 'Vui lòng nhập 13 số'
                      // }
                      // ]
                    })(<Input placeholder={"Đại diện doanh nghiệp"} />)}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Số điện thoại">
                    {getFieldDecorator("phone", {
                      initialValue: data.phone,
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập SĐT"
                        },
                        {
                          pattern: "^(([+]{1}[0-9]{2}|0)[0-9]{9,15})$",
                          message: "Vui lòng nhập đúng số"
                        }
                      ]
                    })(<Input placeholder="Số điện thoại doanh nghiệp" />)}
                  </Form.Item>
                  <Form.Item label="E-mail">
                    {getFieldDecorator("email", {
                      initialValue: data.email,
                      rules: [
                        {
                          type: "email",
                          message: "Vui lòng nhập Email"
                        }
                      ]
                    })(<Input placeholder={"E-mail"} />)}
                  </Form.Item>
                  <Form.Item label="Địa chỉ" colon={false}>
                    {getFieldDecorator("unit", {
                      initialValue: data.unit
                    })(<Input placeholder={"Địa chỉ"} />)}
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
                        onSelect={city => {
                          setFieldsValue({
                            cityIds: city
                          });
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col md={8}>
                  <Form.Item label="MOU" style={{ paddingBottom: "20px" }}>
                    {getFieldDecorator("MOU", {
                      initialValue: data.MOU,
                      valuePropName: "checked"
                    })(<Checkbox />)}
                  </Form.Item>
                </Col>
                <Col md={8}>
                  <Form.Item
                    label="Báo giá nhanh"
                    style={{ minWidth: "450px" }}
                  >
                    {getFieldDecorator("quickPayment", {
                      initialValue: data.quickPayment,
                      valuePropName: "checked"
                    })(<Checkbox />)}
                  </Form.Item>
                </Col>
                <Col md={8}>
                  <Form.Item label="Upload">
                    {getFieldDecorator("files", {
                      initialValue: data.files,
                      valuePropName: "files"
                    })(
                      <UploadFile
                        setFieldsValue={setFieldsValue}
                        arrayImgURL={this.arrayImgURL}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
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

CustomerEnterpriseModel.defaultProps = {
  dataSource: {
    files: []
  }
};
export default Form.create({
  name: "CustomerEnterpriseModel",
  mapPropsToFields: props => {
    return props.data;
  }
})(CustomerEnterpriseModel);
