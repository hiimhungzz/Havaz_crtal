import React from "react";
import { Drawer, Form, Col, Row, DatePicker } from "antd";
import SelectVehicel from "./../../../containers/Vehicle/VehicleSelect";
import { connect } from "react-redux";
import moment from "moment";
import { API_URI } from "@Constants";
import Globals from "globals.js";
import { CustomerSelect } from "../../Utility/common";

class VehicleTemModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: props.dataSource ? props.dataSource : {},
      organizationId:'',
      // parentId:props.parentId
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.dataSource) {
      this.setState({
        dataSource: nextProps.dataSource
      });
    }
    if (Object.keys(nextProps.dataSource).length === 0) {
      this.setState({
        dataSource: nextProps.listVehicleFillTem
      });
    }
  }

  render() {
    const { getFieldDecorator,setFieldsValue } = this.props.form;
    const { onCreate, actionName, onSave, listVehicleFillTem } = this.props;
    const { dataSource,organizationId } = this.state;
    console.log("dataSource",dataSource)
    const format = "YYYY-MM-DD";
    //Todo: TÚ: fix khi dang nhap
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
                submitData["vehicleId"] = values.vehicleId
                  ? values.vehicleId.key
                  : "";
                submitData["type"] = values.type ? values.type.key : "";
                submitData["startDate"] = values.startDate
                  ? moment.utc(values.startDate).format(format)
                  : null;
                submitData["endDate"] = values.endDate
                  ? moment.utc(values.endDate).format(format)
                  : null;
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
                      ? "Chỉnh sửa thông tin tem xe"
                      : actionName === "create"
                      ? "Thêm thông tin tem xe"
                      : "Chỉnh sửa thông tin tem xe"}
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
                            parentId: customer,
                            vehicleId:undefined,
                          });
                          this.setState({
                            parentId:customer,
                            organizationId:customer.key
                          })
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Xe" className="ant-center">
                    {getFieldDecorator("vehicleId", {
                      initialValue: dataSource.refVehicle
                        ? {
                            key: dataSource.refVehicle.uuid,
                            label: dataSource.refVehicle.plate
                          }
                        : undefined,
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập dữ liệu!"
                        }
                      ]
                    })(
                      <SelectVehicel
                        onChange={e => {
                          this.props.vehicleFillTem(e);
                        }}
                        url="autocomplete/vehicle"
                        organizationId={organizationId}
                        parentId={parentId}
                        placeholder="Xe"
                      />
                    )}
                  </Form.Item>
                </Col>
                
                <Col span={24}>
                  <Form.Item label="Tem xe" className="ant-center">
                    {getFieldDecorator("type", {
                      initialValue: dataSource.type
                        ? { key: dataSource.type, label: dataSource.typeText }
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
                        type="businessVehicleLicense"
                        placeholder="Tem xe"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Ngày cấp" className="ant-center">
                    {getFieldDecorator("startDate", {
                      initialValue: dataSource.startDate
                        ? moment.utc(
                            moment.utc(dataSource.startDate, format).format(format),
                            format
                          )
                        : null,
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập dữ liệu!"
                        }
                      ]
                    })(
                      <DatePicker format="DD-MM-YYYY" placeholder="Ngày cấp" />
                    )}
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="Ngày hết hạn" className="ant-center">
                    {getFieldDecorator("endDate", {
                      initialValue: dataSource.endDate
                        ? moment.utc(
                            moment.utc(dataSource.endDate, format).format(format),
                            format
                          )
                        : "",
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập dữ liệu!"
                        }
                      ]
                    })(
                      <DatePicker
                        format="DD-MM-YYYY"
                        placeholder="Ngày hết hạn"
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
    );
  }
}
const App = Form.create({

})(VehicleTemModel);

export default connect()(App);
