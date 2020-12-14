import React from "react";
import { Drawer, Form, Col, Row, Input, DatePicker, Rate } from "antd";
import moment from "moment";
import { connect } from "react-redux";
import { SelectDriver, ButtonRadio } from "../../Utility/common";
import { TreeSelectDriver } from "../../Utility/commonTreeSelect";
import "./styles.scss";
import { Ui } from "@Helpers/Ui";
import Globals from "globals.js";
import ServiceBase from "@Services/ServiceBase";
function disabledDate(current) {
  return current && current > moment().endOf("day");
}
class DriverModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: {},
      type: props.dataSource.type === "SUBDRIVER" ? true : false,
      checkDriver: "",
      organizationId: "",
      category: ""
    };
  }
  onChange = async item => {
    if (item) {
      let result = await ServiceBase.requestJson({
        url: `subdriver-test/${item.key}`,
        method: "GET"
      });
      if (!result.hasErrors) {
        if (result.value.length > 0) {
          this.setState({
            checkDriver: result.value.length
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
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const { dataSource, onCreate, actionName, onSave,typeDriver } = this.props;
    const { type, checkDriver, organizationId } = this.state;
    const profile = Globals.currentUser;
    const parentId = profile
      ? {
          key: profile.organizationUuid,
          label: profile.organizationName
        }
      : undefined;
    return (
      <Form
        className="kt-form"
        onSubmit={e => {
          e.preventDefault();
          this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              let submitData = { ...values };

              submitData["birthday"] = values.birthday
                ? moment(values.birthday).format("YYYY-MM-DD")
                : null;
              submitData["organizationId"] = values.organizationId
                ? values.organizationId.key
                : undefined;
              submitData["licenseExpireAt"] = values.licenseExpireAt
                ? moment(values.licenseExpireAt).format("YYYY-MM-DD")
                : null;
              submitData["driverContractAt"] = values.driverContractAt
                ? moment(values.driverContractAt).format("YYYY-MM-DD")
                : null;
              submitData["fireCardAt"] = values.fireCardAt
                ? moment(values.fireCardAt).format("YYYY-MM-DD")
                : null;
              submitData["trainingAt"] = values.trainingAt
                ? moment(values.trainingAt).format("YYYY-MM-DD")
                : null;
              submitData["driversLicenseClass"] = values.driversLicenseClass
                ? values.driversLicenseClass.key
                : null;
              submitData["type"] = values.type;
              submitData["mainSubDriver"] = values.mainSubDriver
                ? values.mainSubDriver.key
                : null;
              submitData["category"] = values.category
                ? values.category.key
                : null;
              submitData["rating"] = values.rating ? values.rating : 1;
              submitData["status"] = values.status ? values.status.key : 1;
              submitData["refCode"] = values.refCode ? values.refCode : "";
              if (actionName === "create") {
                onCreate(submitData);
              } else {
                onSave({
                  uuid: dataSource.uuid,
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
                <a onClick={this.props.onClose}>
                  <i className="fa fa-chevron-left" /> &nbsp;
                  {actionName === "edit"
                    ? `Chỉnh sửa thông tin lái xe CTV (Mã : ${dataSource.code})`
                    : actionName === "create"
                    ? "Thêm thông tin lái xe CTV"
                    : `Chỉnh sửa thông tin lái xe CTV (Mã : ${dataSource.code})`}
                </a>
              </h3>
            </div>
            <div className="kt-portlet__head-toolbar"></div>
          </div>
          <div id="cr-drawer__body" className="kt-portlet__body">
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item className="ant-center1" label="Cộng tác viên">
                  {getFieldDecorator("organizationId", {
                    initialValue: dataSource.organUuid
                      ? {
                          key: dataSource.organUuid,
                          label: dataSource.organName
                        }
                      : undefined,
                    rules: [
                      {
                        required: true,
                        message: "Vui lòng nhập dữ liệu"
                      }
                    ]
                  })(
                    <TreeSelectDriver
                      url="auto/enterprise"
                      placeholder="Cộng tác viên"
                      onSelect={(item, data, itemChildSelect) => {
                        setFieldsValue({
                          organizationId: itemChildSelect.key
                            ? itemChildSelect
                            : undefined,
                          category: undefined
                        });
                        this.setState({
                          organizationId: data ? data : undefined
                        });
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Ref code" className="ant-center1">
                  {getFieldDecorator("refCode", {
                    initialValue: dataSource.refCode
                  })(
                    <Input placeholder={"Mã từ hệ thống khác(Cyber,HR...)"} />
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Họ tên" className="ant-center1">
                  {getFieldDecorator("fullName", {
                    initialValue: dataSource.fullName || "",
                    rules: [
                      {
                        pattern: "^[^<>%^&*#@!0-9]+$",
                        message: "Vui lòng nhập đúng định dạng"
                      },
                      {
                        required: true,
                        message: "Vui lòng nhập dữ liệu!"
                      }
                    ]
                  })(<Input placeholder="Họ tên" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Loại NV" className="ant-center1">
                  {getFieldDecorator("type", {
                    initialValue: dataSource.type ? dataSource.type : "DRIVER",
                    rules: [
                      {
                        required: true,
                        message: "Vui lòng nhập dữ liệu"
                      }
                    ]
                  })(
                    <ButtonRadio
                      dataDriver={typeDriver}
                      onChange={item => {
                        if (item.target.value === "SUBDRIVER") {
                          this.setState({
                            type: true
                          });
                        } else {
                          this.setState({
                            type: false
                          });
                        }
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Định biên phụ xe"
                  className="ant-center1 customer_help"
                  help={
                    checkDriver
                      ? `Phụ xe này đã được gán cho ${checkDriver} lái xe`
                      : ""
                  }
                >
                  {getFieldDecorator("mainSubDriver", {
                    initialValue: dataSource.subUuid
                      ? {
                          key: dataSource.subUuid,
                          label: dataSource.subFullName
                        }
                      : undefined
                  })(
                    <SelectDriver
                      disabled={type}
                      url="autocomplete/sub-driver/all"
                      placeholder="Định biên phụ xe"
                      onChange={this.onChange}
                      organizationId={organizationId}
                      parentId={parentId}
                    />
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label=" Nhóm lái xe CTV" className="ant-center1">
                  {getFieldDecorator("category", {
                    initialValue: dataSource.categoryId
                      ? {
                          key: dataSource.categoryId,
                          label: dataSource.categoryName
                        }
                      : undefined,
                    rules: [
                      // {
                      //   required: true,
                      //   message: "Vui lòng nhập dữ liệu!"
                      // }
                    ]
                  })(
                    <SelectDriver
                      url="category-survey-parent"
                      placeholder="Lái xe CTV"
                      organizationId={organizationId}
                      parentId={parentId}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="SĐT" className="ant-center1">
                  {getFieldDecorator("phone", {
                    initialValue: dataSource.phone || "",
                    rules: [
                      {
                        required: true,
                        message: "Vui lòng nhập dữ liệu!"
                      },
                      {
                        // pattern: "^(([+]{1}[0-9]{2}|0)[0-9]{9,11})$",
                        min: 9,
                        max: 13,
                        message: "Vui lòng nhập định dạng"
                      }
                    ]
                  })(<Input placeholder="Số Điện Thoại" />)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="CMND/CCCD" className="ant-center1">
                  {getFieldDecorator("CMND", {
                    initialValue: dataSource.CMND || "",
                    rules: [
                      {
                        min: 9,
                        max: 12,
                        message: "Vui lòng nhập đúng 9 -12 số"
                      }
                    ]
                  })(<Input placeholder="CMND/CCCD" />)}
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="Số bằng lái " className="ant-center1">
                  {getFieldDecorator("driversLicenseCode", {
                    initialValue: dataSource.driversLicenseCode,
                    rules: [
                      type === false
                        ? {
                            required: true,
                            message: "Vui lòng nhập dữ liệu!"
                          }
                        : {required: false},
                      {
                        pattern: "^[^<>%^&*#@!:;,.?/]+$",
                        message: "Vui lòng không nhập ký tự đặc biệt"
                      }
                    ]
                  })(<Input placeholder="Số bằng lái" />)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Loại bằng lái" className="ant-center1">
                  {getFieldDecorator("driversLicenseClass", {
                    initialValue: dataSource.driversLicenseClass
                      ? { key: dataSource.driversLicenseClass }
                      : undefined,
                    rules: [
                      type === false
                        ? {
                            required: true,
                            message: "Vui lòng nhập dữ liệu!"
                          }
                        : {required: false}
                    ]
                  })(
                    <SelectDriver
                      url="entry"
                      type="classLicenseDriver"
                      placeholder="Loại bằng lái"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={6} className="ant-center1">
                <Form.Item label="Email" className="ant-center1">
                  {getFieldDecorator("email", {
                    initialValue: dataSource.email || "",

                    rules: [
                      {
                        type: "email",
                        message: "Vui lòng nhập đúng E-mail!"
                      }
                      // {
                      //   required: true,
                      //   message: "Vui lòng nhập dữ liệu!"
                      // }
                    ]
                  })(<Input placeholder="Email" name="email" />)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Thời hạn bằng lái" className="ant-center1">
                  {getFieldDecorator("licenseExpireAt", {
                    initialValue: dataSource.licenseExpireAt
                      ? moment(
                          moment(
                            dataSource.licenseExpireAt,
                            "YYYY-MM-DD"
                          ).format("YYYY-MM-DD"),
                          "YYYY-MM-DD"
                        )
                      : ""
                    // rules: [
                    //   {
                    //     required: true,
                    //     message: "Vui lòng nhập dữ liệu!"
                    //   }
                    // ]
                  })(
                    <DatePicker
                      format="DD-MM-YYYY"
                      placeholder="Thời hạn bằng lái"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Ngày sinh" className="ant-center1">
                  {getFieldDecorator("birthday", {
                    initialValue: dataSource.birthday
                      ? moment(
                          moment(dataSource.birthday, "YYYY-MM-DD").format(
                            "DD-MM-YYYY"
                          ),
                          "DD-MM-YYYY"
                        )
                      : ""
                    // rules: [
                    //   {
                    //     required: true,
                    //     message: "Vui lòng nhập dữ liệu!"
                    //   }
                    // ]
                  })(
                    <DatePicker
                      disabledDate={disabledDate}
                      format="DD-MM-YYYY"
                      placeholder="Ngày sinh"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Trạng thái" className="ant-center1">
                  {getFieldDecorator("status", {
                    initialValue:
                      dataSource.status == 0 || dataSource.status
                        ? { key: dataSource.status }
                        : { key: 1 }
                  })(
                    <SelectDriver
                      url="entry"
                      type="statusUser"
                      placeholder="Trạng thái"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Hạn hợp đồng" className="ant-center1">
                  {getFieldDecorator("driverContractAt", {
                    initialValue: dataSource.driverContractAt
                      ? moment(
                          moment(
                            dataSource.driverContractAt,
                            "YYYY-MM-DD"
                          ).format("YYYY-MM-DD"),
                          "YYYY-MM-DD"
                        )
                      : ""
                  })(
                    <DatePicker
                      format="DD-MM-YYYY"
                      placeholder="Hạn hợp đồng"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Hạn CC tập huấn" className="ant-center1">
                  {getFieldDecorator("trainingAt", {
                    initialValue: dataSource.trainingAt
                      ? moment(
                          moment(dataSource.trainingAt, "YYYY-MM-DD").format(
                            "YYYY-MM-DD"
                          ),
                          "YYYY-MM-DD"
                        )
                      : ""
                  })(
                    <DatePicker
                      format="DD-MM-YYYY"
                      placeholder="Hạn CC tập huấn"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Hạn thẻ PCCC" className="ant-center1">
                  {getFieldDecorator("fireCardAt", {
                    initialValue: dataSource.fireCardAt
                      ? moment(
                          moment(dataSource.fireCardAt, "YYYY-MM-DD").format(
                            "YYYY-MM-DD"
                          ),
                          "YYYY-MM-DD"
                        )
                      : ""
                  })(
                    <DatePicker
                      format="DD-MM-YYYY"
                      placeholder="Hạn thẻ PCCC"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Đánh giá" className="ant-center1">
                  {getFieldDecorator("rating", {
                    initialValue: dataSource.rating || ""
                  })(<Rate />)}
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
const App = Form.create({})(DriverModal);

export default App;
