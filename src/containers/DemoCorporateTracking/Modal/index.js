import React, { memo, useState, useCallback } from "react";
import moment from "moment";
import _ from "lodash";
import { Ui } from "@Helpers/Ui";
import { DatePicker, Row, Col, TimePicker, Input, Form } from "antd";
import ServiceBase from "@Services/ServiceBase";
import classNames from "classnames";
import { Spin } from "antd";
import { URI } from "./constants";
import { hoursInDay, minutesInHour } from "constants/common";
// components
import SelectSon from "@Components/SelectSon";
import ContractList from "@Components/SelectContainer/ContractList";

const { TextArea } = Input;

const ModalCorporateTracking = memo((props) => {
  const { itemSelected } = props;
  if (!itemSelected) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin spinning={true} tip="Đang lấy dữ liệu..."></Spin>
      </div>
    );
  }
  // const [params, setParams] = useState({
  //   vehicleTypeUuid: props.itemSelected.vehicleTypeUuid,
  // });

  const { getFieldDecorator, setFieldsValue, getFieldValue } = props.form;

  const _handleDisabledHour = useCallback((name, fromAt, toAt) => {
    if (name === "fromAt") {
      if (toAt) {
        let toAtHour = toAt.hour();
        let toAtMinute = toAt.minute();
        if (toAtMinute > 0) {
          // Lấy <= giờ được so sánh
          return _.slice(hoursInDay, toAtHour + 1, hoursInDay.length);
        } else {
          // Lấy < giờ được so sánh
          return _.slice(hoursInDay, toAtHour, hoursInDay.length);
        }
      }
      return [];
    } else if (name === "toAt") {
      if (fromAt) {
        let fromAtHour = fromAt.hour();
        let fromAtMinute = fromAt.minute();
        if (fromAtMinute < 59) {
          // Lấy >= giờ được so sánh
          return _.slice(hoursInDay, 0, fromAtHour);
        } else {
          // Lấy > giờ được so sánh
          return _.slice(hoursInDay, 0, fromAtHour + 1);
        }
      }
      return [];
    }
    return [];
  }, []);

  // /**
  //  * _handleDisabledMinute: Validate fromAt && toAt
  //  */
  const _handleDisabledMinute = useCallback(
    (selectedHour, name, fromAt, toAt) => {
      if (name === "fromAt") {
        if (toAt) {
          let toAtHour = toAt.hour();
          let toAtMinute = toAt.minute();
          if (toAtHour === selectedHour) {
            // Lấy <= phút được so sánh
            return _.slice(minutesInHour, toAtMinute, minutesInHour.length);
          }
        }
        return [];
      } else if (name === "toAt") {
        if (fromAt) {
          let fromAtHour = fromAt.hour();
          let fromAtMinute = fromAt.minute();
          if (fromAtHour === selectedHour) {
            // Lấy >= giờ được so sánh
            return _.slice(minutesInHour, 0, fromAtMinute + 1);
          }
        }
        return [];
      }
      return [];
    },
    []
  );

  const onSubmit = (e) => {
    e.preventDefault();
    props.form.validateFields(async (err, values) => {
      if (!err) {
        const params = {
          bookingId: values.codeBooking ? values.codeBooking.key : "",
          contractId: values.contractNumber ? values.contractNumber.key : "",
          routeId: values.routes ? values.routes.key : "",
          vehicleTypeId: values.vehicleType ? values.vehicleType.key : "",
          vehicleId: values.plate ? values.plate.key : "",
          driverId: values.driver ? values.driver.key : "",
          pickUpDate: moment(values.pickUpDate).format("YYYY-MM-DD"),
          pickUpTime: moment(values.pickUpTime).format("HH:mm"),
          dropOffTime: moment(values.dropOffTime).format("HH:mm"),
          required: values.requirer ? values.requirer.key : "",
          note: values.note || "",
        };
        console.log("params", params);
        let result = await ServiceBase.requestJson({
          method: "POST",
          url: URI.ON_ADD_CORPORATE_TRACKING,
          data: params,
        });
        if (result.hasErrors) {
          Ui.showErrors(result.errors);
        } else {
          await props.onClose();
          Ui.showSuccess({ message: "Gửi yêu cầu thành công" });
        }

        await props.onRefresh();
      }
    });
  };
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <Row gutter={16}>
        <Col className="gutter-row pb-3" span={12}>
          <div>Số hợp đồng</div>
          <Form.Item>
            {getFieldDecorator("contractNumber", {
              initialValue: {
                key: itemSelected.contractUuid,
                label: itemSelected.contractNumber,
              },
            })(
              <ContractList
                disabled={true}
                onSelect={(item) => {
               
                }}
              />
            )}
          </Form.Item>
        </Col>

        <Col className="gutter-row pb-3" span={12}>
          <div>Code booking</div>
          <Form.Item>
            {getFieldDecorator("codeBooking", {
              initialValue: {
                key: itemSelected.bookingUuid,
                label: itemSelected.bookingCode,
              },
            })(
              <SelectSon
                disabled
                url={`/auto/route-by-contract?contractId=${props.itemSelected.contractUuid}`}
                placeholder={"Chọn code booking"}
                onSelect={(item) => {
                  setFieldsValue({ routes: item });
                }}
              />
            )}
          </Form.Item>
        </Col>

        <Col className="gutter-row pb-3" span={12}>
          <div>
            Tuyến đường<span className="mark-required-color">*</span>
          </div>
          <Form.Item>
            {getFieldDecorator("routes", {
              initialValue: {
                key: itemSelected.routeUuid,
                label: itemSelected.routeName,
              },
              rules: [{ required: true, message: "Vui lòng nhập dữ liệu" }],
            })(
              <SelectSon
                url={`/auto/contract/routes?contractId=${props.itemSelected.contractUuid}`}
                placeholder={"Chọn tuyến đường"}
                onSelect={(item) => {
                  setFieldsValue({ routes: item });
                }}
              />
            )}
          </Form.Item>
        </Col>
        <Col className="gutter-row pb-3" span={12}>
          <div>
            {" "}
            Loại xe<span className="mark-required-color">*</span>
          </div>
          <Form.Item>
            {getFieldDecorator("vehicleType", {
              initialValue: {
                key: itemSelected.vehicleTypeUuid,
                label: itemSelected.vehicleTypeName,
              },
              rules: [{ required: true, message: "Vui lòng nhập dữ liệu" }],
            })(
              <SelectSon
                url={`/auto/contract/vehicle-type?contractId=${props.itemSelected.contractUuid}`}
                placeholder={"Chọn loại xe"}
                onSelect={(item) => {
                  props.setItemSelected((prevState) => {
                    let nextState = { ...prevState };
                    nextState.vehicleTypeUuid = item.key;
                    return nextState;
                  });
                  setFieldsValue({ vehicleType: item });
                }}
              />
            )}
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col className="gutter-row pb-3" span={12}>
          <div>
            Lái xe<span className="mark-required-color">*</span>
          </div>
          <Form.Item>
            {getFieldDecorator("driver", {
              initialValue: itemSelected.driverUuid
                ? {
                    key: itemSelected.driverUuid,
                    label: itemSelected.driverName,
                  }
                : undefined,
              rules: [{ required: true, message: "Vui lòng nhập dữ liệu" }],
            })(
              <SelectSon
                url={"autocomplete/driver/all"}
                placeholder={"Chọn lái xe"}
                onSelect={(item) => {
                  setFieldsValue({ driver: item });
                }}
              />
            )}
          </Form.Item>
        </Col>
        <Col className="gutter-row pb-3" span={12}>
          <div>
            Biển kiểm soát<span className="mark-required-color">*</span>
          </div>
          <Form.Item>
            {getFieldDecorator("plate", {
              initialValue: {
                key: itemSelected.vehicleUuid,
                label: itemSelected.vehiclePlate,
              },
              rules: [{ required: true, message: "Vui lòng nhập dữ liệu" }],
            })(
              <SelectSon
                url={`/auto/contract/vehicle-by-type?vehicleTypeId=${itemSelected.vehicleTypeUuid}`}
                placeholder={"Chọn biển kiểm soát"}
                onSelect={(item) => {
                  setFieldsValue({ plate: item });
                }}
              />
            )}
          </Form.Item>
        </Col>
        <Col className="gutter-row pb-3" span={12}>
          <div>
            Người yêu cầu<span className="mark-required-color">*</span>
          </div>
          <Form.Item>
            {getFieldDecorator("requirer", {
              initialValue: itemSelected.cusAccountUuid
                ? {
                    key: itemSelected.cusAccountUuid,
                    label: itemSelected.cusAccountName,
                  }
                : undefined,
              rules: [{ required: true, message: "Vui lòng nhập dữ liệu" }],
            })(
              <SelectSon
                url={`/auto/customer-by-contract?contractId=${props.itemSelected.contractUuid}`}
                placeholder={"Người yêu cầu"}
                onSelect={(item) => {
                  setFieldsValue({ requirer: item });
                }}
              />
            )}
          </Form.Item>
        </Col>
        <Col className="gutter-row pb-3" span={12}>
          <div>
            Ngày thực hiện <span className="mark-required-color">*</span>
          </div>
          <Form.Item>
            {getFieldDecorator("pickUpDate", {
              initialValue: moment(new Date()),
              rules: [{ required: true, message: "Vui lòng nhập dữ liệu" }],
            })(<DatePicker format={"DD-MM-YYYY"} />)}
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Row gutter={16}>
            <Col span={12}>
              <div>
                Giờ thực hiện <span className="mark-required-color">*</span>
              </div>
              <Form.Item>
                {getFieldDecorator("pickUpTime", {
                  initialValue: moment(new Date()),
                  rules: [{ required: true, message: "Vui lòng nhập dữ liệu" }],
                })(
                  <TimePicker
                    disabledHours={() =>
                      _handleDisabledHour(
                        "fromAt",
                        getFieldValue("pickUpTime"),
                        getFieldValue("dropOffTime")
                      )
                    }
                    disabledMinutes={(selectedHour) =>
                      _handleDisabledMinute(
                        selectedHour,
                        "fromAt",
                        getFieldValue("pickUpTime"),
                        getFieldValue("dropOffTime")
                      )
                    }
                    format={"HH:mm"}
                    style={{ width: "100%" }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <div>
                Giờ thực kết thúc dự kiến{" "}
                <span className="mark-required-color">*</span>
              </div>
              <Form.Item>
                {getFieldDecorator("dropOffTime", {
                  initialValue: moment(new Date()).add(30, "minutes"),
                  rules: [{ required: true, message: "Vui lòng nhập dữ liệu" }],
                })(
                  <TimePicker
                    disabledHours={() =>
                      _handleDisabledHour(
                        "toAt",
                        getFieldValue("pickUpTime"),
                        getFieldValue("dropOffTime")
                      )
                    }
                    disabledMinutes={(selectedHour) =>
                      _handleDisabledMinute(
                        selectedHour,
                        "toAt",
                        getFieldValue("pickUpTime"),
                        getFieldValue("dropOffTime")
                      )
                    }
                    format={"HH:mm"}
                    style={{ width: "100%" }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Col>

        <Col className="gutter-row pb-3" span={12}>
          <div>
            Lý do <span className="mark-required-color">*</span>
          </div>
          <Form.Item>
            {getFieldDecorator("note", {
              rules: [{ required: true, message: "Vui lòng nhập dữ liệu" }],
            })(<TextArea rows={2} placeholder="Lý do" />)}
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
          }}
          className="gutter-row pb-3"
          span={12}
        ></Col>
        <Col
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
          }}
          className="gutter-row pb-3"
          span={12}
        >
          <button
            type="button"
            onClick={onSubmit}
            className={classNames({
              "btn btn-primary btn-icon-sm pl-5 pr-5 mr-4": true,
            })}
          >
            Gửi
          </button>
          <button
            type="button"
            onClick={props.onClose}
            className={classNames({
              "btn btn-danger btn-icon-sm pr-5 pl-5": true,
            })}
          >
            Hủy
          </button>
        </Col>
      </Row>
    </Form>
  );
});

const ModalCorporateTrackingForm = Form.create({
  routes: undefined,
  driver: undefined,
  vehicleType: undefined,
  plate: undefined,
  note: undefined,
  requirer: undefined,
  pickUpDate: undefined,
  pickUpTime: undefined,
  contractNumber: undefined,
})(ModalCorporateTracking);
export default ModalCorporateTrackingForm;
