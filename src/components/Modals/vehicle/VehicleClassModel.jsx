import React from "react";
import { Drawer, Form, Col, Row, Input, DatePicker } from "antd";
import SelectVehicel from "./../../../containers/Vehicle/VehicleSelect";
import { connect } from "react-redux";
import _ from "lodash";
import moment from "moment";
import { API_URI } from "@Constants";
import Globals from "globals.js";
import { CustomerSelect } from "../../Utility/common";

class VehicleClassModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { getFieldDecorator,setFieldsValue } = this.props.form;

    // const dataSource = {};
    // if (actionName == 'edit') {
    const { onCreate, actionName, onSave, dataSource } = this.props;
    // }
    // debugger;
    const format = "YYYY-MM-DD";
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
                submitData["parentId"] = values.parentId.key;

                if (actionName === "create") {
                  onCreate(submitData);
                  // this.props.form.resetFields()
                } else {
                  onSave({
                    id: dataSource.id,
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
                      ? "Chỉnh sửa thông tin hạng xe"
                      : actionName === "create"
                      ? "Thêm thông tin hạng xe"
                      : "Chỉnh sửa thông tin hạng xe"}
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
                  <Form.Item label="Hạng xe" className="ant-center">
                    {getFieldDecorator("name", {
                      initialValue: dataSource.name
                        ? dataSource.name
                        : undefined,
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập dữ liệu!"
                        }
                      ]
                    })(<Input placeholder="Hạng xe" />)}
                  </Form.Item>
                </Col>
                
                <Col span={24}>
                  <Form.Item label="Ghi chú" className="ant-center">
                    {getFieldDecorator("description", {
                      initialValue: dataSource.description
                        ? dataSource.description
                        : "",
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập dữ liệu!"
                        }
                      ]
                    })(<Input placeholder="Ghi chú" />)}
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
          </div>
        </Form>
    );
  }
}
const App = Form.create({

})(VehicleClassModel);

export default connect()(App);