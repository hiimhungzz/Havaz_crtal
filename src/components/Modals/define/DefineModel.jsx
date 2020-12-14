import React from "react";
import {
  Drawer,
  Form,
  Col,
  Row,
  Input,
  Icon,
  Switch,
  Checkbox,
  InputNumber
} from "antd";
import { connect } from "react-redux";
import { SelectDriver, CustomerSelect } from "../../Utility/common";
import { API_URI } from "@Constants";
import Globals from "globals.js";
const { TextArea } = Input;

class DefineModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: {},
      organizationId: ""
    };
  }
  onChange = checked => {
    console.log("checked  ", checked);
  };

  render() {
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const { organizationId } = this.state;
    const {
      onClose,
      isShow,
      dataSource,
      onCreate,
      actionName,
      onSave,
      typeDefine
    } = this.props;
    const _this = this;
    // Todo: TÚ: fix khi dang nhap
    const profile = Globals.currentUser;
    const supplierId = profile
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
                submitData["type"] = values.type ? values.type.key : "";
                submitData["parentId"] = values.parentId
                  ? values.parentId.key
                  : 0;
                submitData["supplierId"] = values.supplierId
                  ? values.supplierId.key
                  : "";
                submitData["attributes"] = values.attributes
                  ? values.attributes
                  : [];
                submitData["sort"] = values.sort ? values.sort : 0;
                submitData["isActived"] = values.isActived ? true : false;

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
                    ? `Chỉnh sửa xuất rời bến (ID : ${dataSource.id})`
                    : actionName === "create"
                    ? "Thêm xuất rời bến"
                    : `Chỉnh sửa xuất rời bến (ID : ${dataSource.id})`}
                </h3>
              </div>
              <div className="kt-portlet__head-toolbar"></div>
            </div>
            <div id="cr-drawer__body" className="kt-portlet__body">
              <Row gutter={10}>
                <Col span={12}>
                  <Form.Item className="ant-center1" label="Đơn vị quản lý">
                    {getFieldDecorator("supplierId", {
                      initialValue: dataSource.refParent
                        ? {
                            key: dataSource.refParent.uuid,
                            label: dataSource.refParent.name
                          }
                        : supplierId,
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
                            supplierId: customer,
                            parentId: undefined
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
                  <Form.Item label="Danh mục cha" className="ant-center1">
                    {getFieldDecorator("parentId", {
                      initialValue: dataSource.parentId
                        ? {
                            key: dataSource.parentId,
                            label: dataSource.parentId
                          }
                        : undefined
                    })(
                      <SelectDriver
                        url="category-driver-partner-all"
                        placeholder="Danh mục cha"
                        organizationId={organizationId}
                        parentId={supplierId}
                      />
                    )}
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Loại" className="ant-center1">
                    {getFieldDecorator("type", {
                      initialValue: dataSource.type
                        ? {
                            key: dataSource.type,
                            label: dataSource.type
                          }
                        : undefined,
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
                    })(
                      <SelectDriver
                        url="category-survey-type"
                        placeholder="Loại"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Tên survey" className="ant-center1">
                    {getFieldDecorator("name", {
                      initialValue: dataSource.name,
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
                    })(<Input placeholder="Tên survey" />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Thứ tự" className="ant-center1">
                    {getFieldDecorator("sort", {
                      initialValue: dataSource.sort
                    })(<InputNumber placeholder="Thứ tự" />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Trạng thái" className="ant-center1">
                    {getFieldDecorator("isActived", {
                      valuePropName: "checked",
                      initialValue: dataSource.isActived
                    })(
                      <Switch
                        checkedChildren={<Icon type="check" />}
                        unCheckedChildren={<Icon type="close" />}
                      />
                    )}
                  </Form.Item>
                </Col>

                <Col span={12} style={{ marginBottom: "20px" }}>
                  <Form.Item label="Mô tả" className="ant-center1">
                    {getFieldDecorator("description", {
                      initialValue: dataSource.description || ""
                    })(<TextArea rows={2} placeholder="Mô tả" />)}
                  </Form.Item>
                </Col>
                {typeDefine.length > 0 ? (
                  <Col span={12}>
                    <Form.Item
                      label="Tiện ích"
                      className="ant-center1 ant-checkbox-group"
                      style={{ display: "inline-block", marginRight: 0 }}
                    >
                      {getFieldDecorator("attributes", {
                        initialValue: dataSource.attributes || "",
                        rules: [
                          // {
                          //   required: true,
                          //   message: "Vui lòng nhập dữ liệu"
                          // }
                          // {
                          //   pattern: '^[^<>%^&*#@!:;,.?/0-9]+$',
                          //   message:'Vui lòng không nhập ký tự đặc biệt'
                          // }
                        ]
                      })(
                        <Checkbox.Group onChange={_this.onChange}>
                          <Row gutter={10}>
                            {typeDefine.map((item, index) => {
                              return (
                                <Col span={12}>
                                  <Checkbox value={item.value}>
                                    {item.label}
                                  </Checkbox>
                                </Col>
                              );
                            })}
                          </Row>
                        </Checkbox.Group>
                      )}
                    </Form.Item>
                  </Col>
                ) : (
                  ""
                )}
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
})(DefineModel);

export default connect()(App);
