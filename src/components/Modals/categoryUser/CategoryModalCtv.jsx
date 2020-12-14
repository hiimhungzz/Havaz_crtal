import React from "react";
import { Drawer, Form, Col, Row, Input, Icon, Switch, InputNumber } from "antd";
import { connect } from "react-redux";
import { API_URI } from "@Constants";
import Globals from "globals.js";
import { CustomerSelect } from "../../Utility/common";

const { TextArea } = Input;

class CategoryModalCtv extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: {}
    };
  }

  render() {
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const {
      onClose,
      isShow,
      dataSource,
      onCreate,
      actionName,
      onSave
    } = this.props;
    // Todo: TÚ: fix khi dang nhap
    const profile = Globals.currentUser;
    const parentId = profile
      ? {
          key: profile.organizationUuid,
          label: profile.organizationName
        }
      : undefined;
    
    return (
      <Drawer
        id="categoryDrawer"
        visible={isShow}
        placement="right"
        closable={false}
        onClose={onClose}
        width={720}
      >
        <Form
          className="kt-form"
          onSubmit={e => {
            e.preventDefault();
            this.props.form.validateFieldsAndScroll((err, values) => {
              if (!err) {
                let submitData = { ...values };
                submitData["description"] = values.description;
                submitData["type"] = 2;
                submitData["status"] = values.status ? values.status : false;
                submitData["sort"] = values.sort ? values.sort : 0;
                submitData["parentId"] = values.parentId.key;
                if (actionName === "create") {
                  onCreate(submitData);
                } else {
                  onSave({
                    id: dataSource.id,
                    params: submitData
                  });
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
                  <i
                    onClick={this.props.onClose}
                    className="fa fa-chevron-left"
                  />{" "}
                  &nbsp;
                  {actionName === "edit"
                    ? `Chỉnh sửa danh mục CTV`
                    : actionName === "create"
                    ? "Thêm danh mục CTV"
                    : `Chỉnh sửa danh mục CTV `}
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
                  <Form.Item label="Tên CTV" className="ant-center">
                    {getFieldDecorator("name", {
                      initialValue: dataSource.name || "",
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập dữ liệu"
                        }
                        // {
                        //   pattern: '^[^<>%^&*#@!:;,.?/0-9]+$',
                        //   message:'Vui lòng không nhập ký tự đặc biệt'
                        // }
                      ]
                    })(<Input placeholder="Tên CTV" />)}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Thứ tự" className="ant-center">
                    {getFieldDecorator("sort", {
                      initialValue: dataSource.sort || "",
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập dữ liệu"
                        }
                      ]
                    })(<InputNumber placeholder="Thứ tự" />)}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Mô tả" className="ant-center">
                    {getFieldDecorator("description", {
                      initialValue: dataSource.description || "",
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập dữ liệu!"
                        }
                        // {
                        //   pattern: '^[^<>%^&*#@!:;,.?/0-9]+$',
                        //   message:'Vui lòng không nhập ký tự đặc biệt'
                        // }
                        // {
                        //   pattern: '^(([+]{1}[0-9]{2}|0)[0-9]{9})$',
                        //   message: 'Vui lòng nhập định dạng'
                        // }
                      ]
                    })(<TextArea rows={4} placeholder="Mô tả" />)}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Trạng thái" className="ant-center">
                    {getFieldDecorator("status", {
                      valuePropName: "checked",
                      initialValue: dataSource.status
                    })(
                      <Switch
                        checkedChildren={<Icon type="check" />}
                        unCheckedChildren={<Icon type="close" />}
                      />
                    )}
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
      </Drawer>
    );
  }
}
const App = Form.create({
  mapPropsToFields() {
    return {};
  }
})(CategoryModalCtv);

export default connect()(App);
