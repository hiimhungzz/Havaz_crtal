import React from "react";
import {
  Drawer,
  Form,
  Col,
  Row,
  Input,
  DatePicker,
  Modal,
  InputNumber
} from "antd";
import moment from "moment";
import { bindActionCreators } from "redux";
import SelectVehicel from "./../../../containers/Vehicle/VehicleSelect";
import { TreeSelectVehicle } from "../../Utility/commonTreeSelect";
import { SelectBase, CustomerSelect } from "@Components/Utility/common";
import { actions as vehicleAction } from "../../../redux/vehicle/actions";
import { API_URI } from "@Constants";
import { connect } from "react-redux";
import _ from "lodash";
import UpdateImg from "./Image";
import { Ui } from "@Helpers/Ui";
import ServiceBase from "@Services/ServiceBase";
import Globals from "globals.js";

const { confirm } = Modal;
let timer = undefined;
const { TextArea } = Input;

class VehicleModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: {},
      isopen: false,
      time: null,
      checkDriver: "",
      organizationId: ""
    };
  }
  onChangeDriver = async item => {
    if (item) {
      let result = await ServiceBase.requestJson({
        url: `driver-vehicle/${item.key}`,
        method: "GET"
      });
      if (!result.hasErrors) {
        if (result.value.length > 0) {
          this.setState({
            checkDriver: result.value[0].plate
          });
        } else {
          this.setState({
            checkDriver: ""
          });
        }
      } else {
        Ui.showErrors(result.errors);
      }
    }
  };

  render() {
    const profile = Globals.currentUser;
    const parentId = profile
      ? {
          key: profile.organizationUuid,
          label: profile.organizationName
        }
      : undefined;
    const {
      getFieldDecorator,
      getFieldValue,
      setFieldsValue
    } = this.props.form;
    const { isopen, checkDriver, organizationId } = this.state;
    const formLayout = "inline";
    const {
      dataSource,
      onCreate,
      actionName,
      onSave,
      setFieldValue
    } = this.props;
    const formItemLayout =
      formLayout === "horizontal"
        ? {
            labelCol: { span: 1 },
            wrapperCol: { span: 17 }
          }
        : null;
    return (
      <Form
        className="kt-form"
        onSubmit={e => {
          e.preventDefault();
          this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              let submitData = { ...values };

              // _.pick(values,['organizationId']);
              submitData["organizationId"] = values.organizationId.value
                ? values.organizationId.value
                : values.organizationId.key;
              submitData["vehicleType"] = values.vehicleType
                ? values.vehicleType.key
                : null;
              submitData["driverId"] = values.driverId
                ? values.driverId.key
                : null;
              submitData["manufactureYear"] = values.manufactureYear
                ? moment(values.manufactureYear).format("YYYY")
                : "";
              submitData["circulatedAt"] = values.circulatedAt
                ? moment(values.circulatedAt).format("YYYY-MM-DD")
                : null;
              submitData["civilInsuranceaAt"] = values.civilInsuranceaAt
                ? moment(values.civilInsuranceaAt).format("YYYY-MM-DD")
                : null;
              submitData["hullInsuranceAt"] = values.hullInsuranceAt
                ? moment(values.hullInsuranceAt).format("YYYY-MM-DD")
                : null;
              submitData["registeredAt"] = values.registeredAt
                ? moment(values.registeredAt).format("YYYY-MM-DD")
                : null;
              submitData["roadFeeAt"] = values.roadFeeAt
                ? moment(values.roadFeeAt).format("YYYY-MM-DD")
                : null;
              submitData["groupVehicleId"] = values.groupVehicleId
                ? values.groupVehicleId.key
                : null;
              submitData["parentId"] = values.parentId.key;
              if (actionName === "create") {
                if (checkDriver) {
                  confirm({
                    title: "Thông báo",
                    content: `Lái xe đã được cấu hình cho lái xe ${checkDriver} bạn có muốn thay thế ?`,
                    okText: "Có",
                    cancelText: "Không",
                    onOk() {
                      onCreate(submitData);
                    },
                    onCancel() {}
                  });
                } else {
                  onCreate(submitData);
                }
              } else {
                if (values.driverId) {
                  if (checkDriver) {
                    confirm({
                      title: "Thông báo",
                      content: `Lái xe đã được cấu hình cho lái xe ${checkDriver} bạn có muốn thay thế ?`,
                      okText: "Có",
                      cancelText: "Không",
                      onOk() {
                        onSave({
                          uuid: dataSource.uuid,
                          params: submitData
                        });
                      },
                      onCancel() {}
                    });
                  } else {
                    onSave({
                      uuid: dataSource.uuid,
                      params: submitData
                    });
                  }
                } else {
                  onSave({
                    uuid: dataSource.uuid,
                    params: submitData
                  });
                }
              }
            }
          });
        }}
        layout="vertical"
        {...formItemLayout}
      >
        <div className="kt-portlet">
          <div id="cr-drawer__head" className="kt-portlet__head">
            <div className="kt-portlet__head-label">
              <h3 className="kt-portlet__head-title">
                <a onClick={this.props.onClose}>
                  <i
                    onClick={this.props.onClose}
                    className="fa fa-chevron-left"
                  />{" "}
                  &nbsp;
                  {actionName === "edit"
                    ? `Chỉnh sửa thông tin xe (Mã ${dataSource.code})`
                    : actionName === "create"
                    ? "Thêm thông tin xe"
                    : `Chỉnh sửa thông tin xe (Mã ${dataSource.code})`}
                </a>
              </h3>
            </div>
            <div className="kt-portlet__head-toolbar"></div>
          </div>
          <div id="cr-drawer__body" className="kt-portlet__body">
            <Row gutter={10}>
              <Col span={6}>
                <Form.Item label="Loại xe" className="ant-center1">
                  {getFieldDecorator("vehicleType", {
                    initialValue: dataSource.refVehicleType
                      ? {
                          key: dataSource.refVehicleType.uuid,
                          label: dataSource.refVehicleType.name
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
                      url="vehicle-type/all"
                      placeholder="Loại xe"
                      organizationId={organizationId}
                      parentId={parentId}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Nhóm xe" className="ant-center1">
                  {getFieldDecorator("groupVehicleId", {
                    initialValue: dataSource.groupVehicle
                      ? {
                          key: dataSource.groupVehicle.key,
                          label: dataSource.groupVehicle.label
                        }
                      : undefined,
                    rules: [
                      // {
                      //   required: true,
                      //   message: "Vui lòng nhập dữ liệu!"
                      // }
                    ]
                  })(
                    <SelectBase
                      onSelect={item => {
                        setFieldsValue({ groupVehicleId: item });
                      }}
                      apiUrl={API_URI.GET_GROUP_XE}
                      pageLimit={20}
                      placeholder="Nhóm xe"
                      organizationId={organizationId}
                      parentId={parentId}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Tỷ lệ góp vốn" className="ant-center1">
                  {getFieldDecorator("ratio", {
                    initialValue: dataSource.ratio
                      ? String(dataSource.ratio)
                      : "",
                    rules: [
                      {
                        required: true,
                        message: "Vui lòng nhập dữ liệu!"
                      }
                      // {
                      //   pattern: "^([0-9]{1}|[0-9]{2}|10[0])$",
                      //   message: "Tỷ lệ không quá 100%"
                      // }
                    ]
                  })(
                    <InputNumber
                      min={0}
                      max={100}
                      step={1}
                      formatter={value => `${value}%`}
                      placeholder="Tỷ lệ góp vốn"
                      suffix="$"
                    />
                  )}
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="Biển số xe" className="ant-center1">
                  {getFieldDecorator("plate", {
                    initialValue: dataSource.plate || "",
                    rules: [
                      {
                        required: true,
                        message: "Vui lòng nhập dữ liệu!"
                      }
                    ]
                  })(<Input placeholder="29A-12345" />)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Số khung" className="ant-center1">
                  {getFieldDecorator("chassisNo", {
                    initialValue: dataSource.chassisNo || "",
                    rules: [
                      {
                        pattern: "^[^<>%^&#@!:;,?/]+$",
                        message: "Chỉ được nhập ký tự (* -)"
                      }
                    ]
                  })(<Input placeholder="Số khung" />)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Số máy" className="ant-center1">
                  {getFieldDecorator("engineNo", {
                    initialValue: dataSource.engineNo || "",
                    rules: [
                      {
                        pattern: "^[^<>%^&*#@!:;,?/]+$",
                        message: "Không nhập ký tự"
                      }
                    ]
                  })(<Input placeholder="Số máy" />)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Năm sản xuất" className="ant-center1">
                  {getFieldDecorator("manufactureYear", {
                    initialValue: dataSource.manufactureYear
                      ? moment(dataSource.manufactureYear, "YYYY")
                      : moment(moment().format("YYYY"), "YYYY")
                  })(
                    <DatePicker
                      mode="year"
                      format="YYYY"
                      placeholder="Năm sản xuất"
                      open={isopen}
                      onPanelChange={val => {
                        setFieldsValue({ manufactureYear: val });
                        this.setState({
                          isopen: false,
                          time: val
                        });
                      }}
                      onOpenChange={status => {
                        this.setState({ isopen: !!status });
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Hạn phí đường bộ" className="ant-center1">
                  {getFieldDecorator("roadFeeAt", {
                    initialValue: dataSource.roadFeeAt
                      ? moment(dataSource.roadFeeAt, "DD-MM-YYYY")
                      : ""
                  })(
                    <DatePicker
                      format="DD-MM-YYYY"
                      placeholder="Hạn phí đường bộ"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Hạn lưu hành" className="ant-center1">
                  {getFieldDecorator("circulatedAt", {
                    initialValue: dataSource.circulatedAt
                      ? moment(dataSource.circulatedAt, "YYYY-MM-DD")
                      : ""
                  })(
                    <DatePicker
                      format="DD-MM-YYYY"
                      placeholder="Hạn lưu hành"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Hạn bảo hiểm dân sự" className="ant-center1">
                  {getFieldDecorator("civilInsuranceaAt", {
                    initialValue: dataSource.civilInsuranceaAt
                      ? moment(dataSource.civilInsuranceaAt, "DD-MM-YYYY")
                      : ""
                  })(
                    <DatePicker
                      format="DD-MM-YYYY"
                      placeholder="Hạn bh dân sự"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Hạn đăng ký" className="ant-center1">
                  {getFieldDecorator("registeredAt", {
                    initialValue: dataSource.registeredAt
                      ? moment(dataSource.registeredAt, "DD-MM-YYYY")
                      : ""
                  })(
                    <DatePicker format="DD-MM-YYYY" placeholder="Hạn đăng ký" />
                  )}
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="Hạn bảo hiểm thân vỏ" className="ant-center1">
                  {getFieldDecorator("hullInsuranceAt", {
                    initialValue: dataSource.hullInsuranceAt
                      ? moment(dataSource.hullInsuranceAt, "DD-MM-YYYY")
                      : ""
                  })(
                    <DatePicker
                      format="DD-MM-YYYY"
                      placeholder="Hạn bh thân vỏ"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Chủ xe" className="ant-center1">
                  {getFieldDecorator("organizationId", {
                    initialValue:
                      dataSource.refOrganization && dataSource.organizationId
                        ? {
                            key: dataSource.refOrganization.uuid,
                            label: dataSource.refOrganization.name
                          }
                        : undefined,
                    rules: [
                      {
                        required: true,
                        message: "Vui lòng nhập dữ liệu!"
                      }
                    ]
                  })(
                    <TreeSelectVehicle
                      url="auto/enterprise"
                      placeholder="Chủ xe"
                      organizationId={organizationId}
                      parentId={parentId}
                      onSelect={(item, data) => {
                        setFieldsValue({
                          organizationId: item.value ? item : undefined
                        });
                        this.setState({
                          organizationId: item ? item.key : null
                        });
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
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
                          organizationId: undefined,
                          vehicleType: undefined,
                          driverId: undefined
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
                <Form.Item
                  label="Đơn vị bảo hiểm thân vỏ"
                  className="ant-center1"
                >
                  {getFieldDecorator("hullInsuranceSupllier", {
                    initialValue: dataSource.hullInsuranceSupllier || ""
                    // rules: [
                    //   {
                    //     required: true,
                    //     message: "Vui lòng nhập dữ liệu!"
                    //   }
                    // ]
                  })(<Input placeholder="Đơn vị bảo hiểm thân vỏ" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Đơn vị bảo hiểm dân sự"
                  className="ant-center1"
                >
                  {getFieldDecorator("civilInsuranceSupplier", {
                    initialValue: dataSource.civilInsuranceSupplier || ""
                    // rules: [
                    //   {
                    //     required: true,
                    //     message: "Vui lòng nhập dữ liệu!"
                    //   }
                    // ]
                  })(<Input placeholder="Đơn vị bảo hiểm dân sự" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Ngân hàng" className="ant-center1">
                  {getFieldDecorator("bank", {
                    initialValue: dataSource.bank || ""
                    // rules: [
                    //   {
                    //     required: true,
                    //     message: "Vui lòng nhập dữ liệu!"
                    //   }
                    // ]
                  })(<Input placeholder="Ngân hàng" />)}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Lái xe"
                  help={
                    checkDriver
                      ? `Lái xe đang được gán cho BKS ${checkDriver}`
                      : ""
                  }
                  className="ant-center1 customer_help"
                >
                  {getFieldDecorator("driverId", {
                    initialValue:
                      dataSource.refDriver && dataSource.refDriver.length > 0
                        ? {
                            key: dataSource.refDriver[0].uuid,
                            label: dataSource.refDriver[0].fullName
                          }
                        : undefined
                    // rules: [
                    //   {
                    //     required: true,
                    //     message: "Vui lòng nhập dữ liệu!"
                    //   }
                    // ]
                  })(
                    <SelectVehicel
                      onChange={this.onChangeDriver}
                      url="autocomplete/driver"
                      placeholder="Lái xe"
                      organizationId={organizationId}
                      parentId={parentId}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Mô tả" className="ant-center1">
                  {getFieldDecorator("note", {
                    initialValue: dataSource.note || ""
                  })(<TextArea placeholder="Mô tả" autoSize />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Ảnh xe"
                  className="ant-center1 viewUploadImage"
                  style={{ top: 10 }}
                >
                  {getFieldDecorator("images", {
                    initialValue: dataSource.images || []
                  })(
                    <UpdateImg
                      dataImage={
                        dataSource.images
                          ? dataSource.images
                          : getFieldValue("images")
                      }
                      chooseImage={val => {
                        setFieldsValue({ images: val });
                      }}
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

const App = Form.create({})(VehicleModal);

export default connect()(App);
