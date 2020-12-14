import React from "react";
import { Drawer, Form, Col, Row, Input } from "antd";
import SelectVehicel from "./../../../containers/Vehicle/VehicleSelect";
import { connect } from "react-redux";
import _ from "lodash";
import { ColorPickerComponent } from "@syncfusion/ej2-react-inputs";
import "./../../../../node_modules/@syncfusion/ej2-base/styles/material.css";
import "./../../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
import "./../../../../node_modules/@syncfusion/ej2-popups/styles/material.css";
import "./../../../../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css";
import "./../../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
import { API_URI } from "@Constants";
import Globals from "globals.js";
import { CustomerSelect } from "../../Utility/common";

class VehicleTypeModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: {}
    };
    this.onChange = this.onChange.bind(this);
  }
  onChange(args) {
    this.props.dataSource.color = args.currentValue.hex;
    this.props.form.setFieldsValue({ color: args.currentValue.hex });
  }
  render() {
    const { getFieldDecorator,setFieldsValue } = this.props.form;

    // const dataSource = {};
    // if (actionName == 'edit') {
    const { dataSource, onCreate, actionName, onSave } = this.props;
    // }
    // Todo: TÚ: fix khi dang nhap
    const profile = Globals.currentUser;
    const parentId = profile
      ? {
          key: profile.organizationUuid,
          label: profile.organizationName
        }
      : undefined;
    return (
      
        <Form
          onSubmit={e => {
            e.preventDefault();
            this.props.form.validateFieldsAndScroll((err, values) => {
              if (!err) {
                let submitData = { ...values };

                submitData["type"] = values.type.key;
                submitData["avgSpeed"] = parseInt(values.avgSpeed)
                  ? parseInt(values.avgSpeed)
                  : 0;
                submitData["seats"] = parseInt(values.seats);
                submitData["parentId"] = values.parentId.key;

                if (actionName === "create") {
                  onCreate(submitData);
                  // this.props.form.resetFields()
                } else {
                  onSave({
                    uuid: dataSource.uuid,
                    params: submitData
                  });
                  // this.props.form.resetFields()
                }
              }
            });
          }}
          layout="vertical"
        >
          <div className="kt-portlet">
            <div id="cr-drawer__head" className="kt-portlet__head">
              <div className="kt-portlet__head-label">
                <h3 className="kt-portlet__head-title">
                  <a onClick={this.props.onClose}>
                    <i
                      onClick={this.props.onClose}
                      className="fa fa-chevron-left"
                    />
                    &nbsp;
                    {actionName === "edit"
                      ? "Chỉnh sửa thông tin loại xe"
                      : actionName === "create"
                      ? "Thêm thông tin loại xe"
                      : "Chỉnh sửa thông tin loại xe"}
                  </a>
                </h3>
              </div>
              <div className="kt-portlet__head-toolbar"></div>
            </div>
            <div id="cr-drawer__body" className="kt-portlet__body">
              <Row gutter={10}>
              <Col span={24}>
                  <Form.Item className="ant-center1" label="Đơn vị quản lý">
                    {getFieldDecorator("parentId", {
                      initialValue: dataSource.refParent
                      ? {
                          key: dataSource.refParent.uuid,
                          label: dataSource.refParent.name
                        }
                      : parentId,
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập dữ liệu"
                        }
                      ]
                    })(
                      <CustomerSelect
                        url={API_URI.GET_LIST_COMPANY_FOR_ENTERPRISE}
                        placeholder="Đơn vị quản lý"
                        onSelect={(customer, data) => {
                          setFieldsValue({
                            parentId: customer
                          });
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Tên loại xe" className="ant-center">
                    {getFieldDecorator("name", {
                      initialValue: dataSource.name || "",
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập dữ liệu!"
                        }
                      ]
                    })(<Input placeholder="Tên loại xe" />)}
                  </Form.Item>
                </Col>
               
                <Col span={24}>
                  <Form.Item label="Số ghế thực tế" className="ant-center">
                    {getFieldDecorator("seats", {
                      initialValue: dataSource.seats
                        ? String(dataSource.seats)
                        : "",
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập dữ liệu!"
                        },
                        {
                          pattern:
                            "^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$",
                          message: "Vui lòng nhập đúng số"
                        }
                      ]
                    })(<Input placeholder="Số ghế thực tế" name="ma" />)}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Số ghế gợi ý" className="ant-center">
                    {getFieldDecorator("numberSeatEu", {
                      initialValue: dataSource.numberSeatEu
                        ? String(dataSource.numberSeatEu)
                        : "",
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập dữ liệu!"
                        },
                        {
                          pattern:
                            "^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$",
                          message: "Vui lòng nhập đúng số"
                        }
                      ]
                    })(<Input placeholder="Số ghế gợi ý" name="ma" />)}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Loại xe thiết kế" className="ant-center">
                    {getFieldDecorator("type", {
                      initialValue: dataSource.type
                        ? { key: dataSource.type, label: dataSource.type }
                        : undefined,
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập dữ liệu!"
                        }
                      ]
                    })(
                      <SelectVehicel
                        url="entry"
                        type="vehicleType"
                        placeholder="Loại xe thiết kế"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Tốc độ trung bình" className="ant-center">
                    {getFieldDecorator("avgSpeed", {
                      initialValue: dataSource.avgSpeed
                        ? String(dataSource.avgSpeed)
                        : "",
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập dữ liệu!"
                        },
                        {
                          pattern: "^([0-9]{1}|[0-9]{2}|10[0])$",
                          message: "Tốc độ trung bình không quá 100"
                        }
                      ]
                    })(<Input placeholder="Tốc độ trung bình" />)}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Màu sắc" className="ant-center">
                    {getFieldDecorator("color", {
                      initialValue: dataSource.color || "",
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập màu!"
                        }
                      ]
                    })(<ColorPickerComponent change={this.onChange} />)}
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <div id="cr-drawer__foot" className="kt-portlet__foot">
              <button type="submit" className="btn btn-brand btn-icon-sm">
                <i className="fa fa-save" />
                Lưu
              </button>
            </div>
            <Form.Item className="none-display">
              {getFieldDecorator("code", {})(<span />)}
            </Form.Item>
            <Form.Item className="none-display">
              {getFieldDecorator("uuid", {})(<span />)}
            </Form.Item>
            <Form.Item className="none-display">
              {getFieldDecorator("dataCheckName", {})(<span />)}
            </Form.Item>
          </div>
        </Form>
    );
  }
}
const App = Form.create({

})(VehicleTypeModel);

export default connect()(App);
