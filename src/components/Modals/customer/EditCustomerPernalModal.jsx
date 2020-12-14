import React from "react";
import { Checkbox, Col, Form, Input, Row, Select, Spin } from "antd";
import RouteCostList from "../../RouteCostList";
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
      const data = response.data.data.map((user) => {
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
class EditCustomerPernalModal extends React.Component {
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
      dataSource,
      onClose,
      costCustomerLoading,
      spinning,
      listCustomerCost,
      onSave,
      onSaveCost,
      onSaveCostPer,
      filterDatetime,
      onChangeFilterDateTime
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
                &nbsp; Chỉnh sửa thông tin cá nhân
              </h3>
            </div>
          </div>
          <div id="cr-drawer__body" className="kt-portlet__body">
            <Spin spinning={spinning}>
              <div className="kt-portlet__body p-0">
                <Row gutter={10}>
                  <Col span={12}>
                    <Form.Item label="Tên rút gọn">
                      {getFieldDecorator("allias", {
                        initialValue: data.allias
                      })(<Input placeholder={"Tên rút gọn"} />)}
                    </Form.Item>
                    <Form.Item label="Ref code">
                      {getFieldDecorator("refCode", {
                        initialValue: data.refCode
                      })(
                        <Input
                          placeholder={"Mã từ hệ thống khác(Cyber,HR...)"}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
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
                  </Col>
                  <Col span={12}>
                    <Form.Item colon={false} label="Nv sale phụ trách">
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
                          onSelectOwner={(owner, data) => {
                            setFieldsValue({
                              ownerId: {
                                key: owner.key,
                                label: owner.label
                              },
                              ownerPhone: data.phoneNumber
                            });
                          }}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="SĐT NV sale phụ trách">
                      {getFieldDecorator("ownerPhone", {
                        initialValue: data.ownerPhone
                      })(
                        <Input disabled placeholder={"SĐT NV sale phụ trách"} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="MOU" colon={false}>
                      {getFieldDecorator("MOU", {
                        initialValue: data.MOU,
                        valuePropName: "checked"
                      })(<Checkbox />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Tên khách hàng">
                      {getFieldDecorator("name", {
                        initialValue: data.name,
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng nhập dữ liệu"
                          }
                        ]
                      })(<Input placeholder={"Tên KH doanh nghiệp"} />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Báo giá nhanh" colon={false}>
                      {getFieldDecorator("quickPayment", {
                        initialValue: data.quickPayment,
                        valuePropName: "checked"
                      })(<Checkbox />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item colon={false} label="Nhóm Khách hàng">
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
                          placeholder="Nhóm Khách hàng"
                        />
                      )}
                    </Form.Item>
                  </Col>
                  }
                  <Col span={12}>
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
                          onSelect={(customer) => {
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
                  <Col span={12}>
                    <Form.Item label="SĐT Khách hàng">
                      {getFieldDecorator("phone", {
                        initialValue: data.phone,
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng nhập dữ liệu"
                          },
                          {
                            pattern:
                              "^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$",
                            message: "Vui lòng nhập đúng định dạng"
                          }
                        ]
                      })(<Input placeholder={"SĐT Khách hàng"} />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Địa chỉ" colon={false}>
                      {getFieldDecorator("unit", {
                        initialValue: data.unit
                      })(<Input placeholder={"Địa chỉ"} />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Thành phố" colon={false}>
                      {getFieldDecorator("cityIds", {
                        initialValue: data.cityIds
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
                  <Col span={12}>
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
                  <Col span={12}>
                    <Form.Item
                      label="Upload"
                      // extra="Image for Event banner. Best size: 34x129 px"
                    >
                      {getFieldDecorator("files", {
                        valuePropName: "files",
                        // getValueFromEvent: this.normFile,
                        initialValue: data.files
                      })(
                        <UploadFile
                          setFieldsValue={setFieldsValue}
                          arrayImgURL={this.arrayImgURL}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </div>
              <div className="kt-portlet__body p-0">
                <RouteCostList
                  listCost={listCustomerCost}
                  filterDatetime={filterDatetime}
                  onChangeFilterDateTime={e =>
                    onChangeFilterDateTime(data.uuid, e)
                  }
                  costLoading={costCustomerLoading}
                  getFieldDecorator={getFieldDecorator}
                  setFieldsValue={setFieldsValue}
                  setCostPerToParent={costPer => {
                    this.costPer = costPer;
                  }}
                  setCostToParent={cost => {
                    this.cost = cost;
                  }}
                  orgId={data.uuid}
                />
              </div>
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

EditCustomerPernalModal.defaultProps = {
  dataSource: {
    files: []
  }
};
export default Form.create({
  name: "EditCustomerPernalModal",
  mapPropsToFields: props => {
    return props.data;
  }
})(EditCustomerPernalModal);
