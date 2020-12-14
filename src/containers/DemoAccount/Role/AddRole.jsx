import { Button, Form, Icon, Input, Select } from "antd";
import "antd/dist/antd.css";
import _ from "lodash";
import ServiceBase from "@Services/ServiceBase";
import Globals from "globals.js";
import { Ui } from "@Helpers/Ui";
import { API_URI } from "@Constants";
import { CustomerSelect, RoleSelect } from "../../../components/Utility/common";
import ManageUnit from "components/SelectContainer/ManageUnit";
import React from "react";
const { Option } = Select;
class AddRole extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: {},
    };
  }

  onClick = (values) => {
    this.props.onSave(values);
  };

  render() {
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const { dataSource, onClose } = this.props;
    const data = dataSource;
    const profile = Globals.currentUser;
    const parentId = profile
      ? {
          key: profile.organizationUuid,
          label: profile.organizationName,
        }
      : undefined;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 18 },
        xs: { span: 24 },
      },
    };
    return (
      <Form
        className="kt-form"
        {...formItemLayout}
        onSubmit={(e) => {
          e.preventDefault();
          this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              this.onClick(values);
            }
          });
        }}
        layout="vertical"
      >
        <div className="kt-portlet">
          <div id="cr-drawer__body" className="kt-portlet__body">
            <Form.Item label="Tên chức danh:">
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: "Trường này không được phép để trống!",
                  },
                ],
              })(<Input placeholder="Nhập tên chức danh" />)}
            </Form.Item>
            <br />
            <Form.Item label="Mã chức danh:">
              {getFieldDecorator("code", {
                rules: [
                  {
                    required: true,
                    message: "Trường này không được phép để trống!",
                  },
                ],
              })(<Input placeholder="Nhập mã chức danh" />)}
            </Form.Item>
            <br />
            <Form.Item colon={false} label="Tên chức danh quản lý">
              {getFieldDecorator("parentId", {
                // initialValue: parentId,
                rules: [
                  {
                    required: true,
                    message: "Vui lòng nhập dữ liệu",
                  },
                ],
              })(
                <RoleSelect
                  onSelect={(unit, data) => {
                    const level = _.get(
                      _.find(
                        data,
                        (x) => _.get(x, "key") === _.get(unit, "key")
                      ),
                      "level"
                    );
                    setFieldsValue({ parentId: unit, level: level + 1 });
                  }}
                />
              )}
            </Form.Item>
            <br />
            <Form.Item colon={false} label="Doanh nghiệp">
              {getFieldDecorator("organizationId", {
                initialValue: parentId,
                rules: [
                  {
                    required: true,
                    message: "Vui lòng nhập dữ liệu",
                  },
                ],
              })(
                <ManageUnit
                  onSelect={(unit) => setFieldsValue({ organizationId: unit })}
                />
              )}
            </Form.Item>
            <br />
            <Form.Item label="Level:">
              {getFieldDecorator("level", {
                rules: [
                  {
                    required: true,
                    message: "Trường này không được phép để trống!",
                  },
                ],
              })(<Input disabled placeholder="Level" />)}
            </Form.Item>
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "100%",
              borderTop: "1px solid #e9e9e9",
              padding: "10px 38px",
              background: "#fff",
              textAlign: "left",
            }}
          >
            <Button htmlType="submit" type="primary" style={{ height: 40 }}>
              <Icon type="save" />
              Lưu
            </Button>
          </div>
        </div>
      </Form>
    );
  }
}

const Add = Form.create({
  mapPropsToFields() {
    return {};
  },
})(AddRole);
export default Add;
