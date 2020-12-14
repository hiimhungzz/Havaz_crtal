import React, { memo, useState, useCallback, useEffect } from "react";
import { Grid, withStyles } from "@material-ui/core";
import {
  Input,
  Spin,
  Divider,
  Button,
  Checkbox,
  Select,
  Upload,
  DatePicker,
  TimePicker,
} from "antd";
import _ from "lodash";
import classNames from "classnames";
import { Map, List, fromJS } from "immutable";

import { createStructuredSelector } from "reselect";
import { makeSelectAppConfig } from "redux/app/selectors";
import { compose } from "recompose";
import { connect } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { URI } from "../../constants";
import { DATE_TIME_FORMAT, hoursInDay, minutesInHour } from "constants/common";
import Cost from "./Cost";
import Corporate from "components/SelectContainer/Corporate";
import { Ui } from "@Helpers/Ui";
import ServiceBase from "services/ServiceBase";
import { API_BASE_URL, JWT_TOKEN } from "@Constants";
import { $Token } from "@Helpers/token";
import { hashByTimeStamp, checkMoment } from "helpers/utility";
import ViewCost from "./ViewCost";
import ContractType from "components/SelectContainer/ContractType";

const defaultList = [];
let validateTimer = null;
const contractSchema = Yup.object().shape({
  contractNumber: Yup.string().required("*Trường bắt buộc"),
  signatureDate: Yup.object().required("*Trường bắt buộc"),
  activatedDateFrom: Yup.object().required("*Trường bắt buộc"),
  activatedDateTo: Yup.object().required("*Trường bắt buộc"),
  fromAt: Yup.object().required("*Trường bắt buộc"),
  toAt: Yup.object().required("*Trường bắt buộc"),
  contractType: Yup.number().required("*Trường bắt buộc"),
  signer: Yup.string().required("*Trường bắt buộc"),
  corporate: Yup.object().shape({
    key: Yup.string().required("*Trường bắt buộc"),
  }),
  dayCheck: Yup.array().required("*Chưa chọn ngày.").min(1, "*Chưa chọn ngày."),
  cost: Yup.array()
    .required("*Chưa có giá nào.")
    .of(
      Yup.object().shape({
        vehicleTypeId: Yup.string().required("*Trường bắt buộc"),
        fixedRouteId: Yup.string().required("*Trường bắt buộc"),
        numberVehicle: Yup.string().required("*Trường bắt buộc"),
      })
    ),
});

const ContractInfo = ({ classes, onShowModal, contractId }) => {
  const [contract, setContract] = useState(
    Map({
      contractNumber: "",
      corporate: undefined,
      signatureDate: undefined,
      duration: 12,
      activatedDateFrom: undefined,
      activatedDateTo: undefined,
      description: "",
      contractType: undefined,
      signer: "",
      fromAt: undefined,
      toAt: undefined,
      dayCheck: [],
      cost: List(),
      check: Map(),
    })
  );
  const [readContractFetching, setReadContractFetching] = useState(false);
  const [isSaveContractFetching, setIsSaveContractFetching] = useState(false);
  const [fileList, setFileList] = useState(List());
  const [canValidate, setCanValidate] = useState(false);
  const [contractErrors, setContractErrors] = useState(Map());
  // Function-------------------------

  /**
   * _handleSaveContract: Lưu hợp đồng
   */
  const _handleSaveContract = useCallback(async () => {
    let jsData = contract.toJS();
    let fromAt = checkMoment(_.get(jsData, "fromAt"));
    let fromAtStr = null;
    if (fromAt && moment.isMoment(fromAt)) {
      fromAtStr = fromAt.format(DATE_TIME_FORMAT.HH_MM);
    }
    let toAt = checkMoment(_.get(jsData, "toAt"));
    let toAtStr = null;
    if (toAt && moment.isMoment(toAt)) {
      toAtStr = toAt.format(DATE_TIME_FORMAT.HH_MM);
    }
    let data = {
      contractNumber: _.get(jsData, "contractNumber"),
      organizationId: _.get(jsData, "corporate.key"),
      contractType: _.get(jsData, "contractType"),
      signatureDate: _.get(jsData, "signatureDate"),
      duration: _.get(jsData, "duration"),
      activatedDateFrom: _.get(jsData, "activatedDateFrom"),
      activatedDateTo: _.get(jsData, "activatedDateTo"),
      description: _.get(jsData, "description"),
      signer: _.get(jsData, "signer"),
      file: fileList.getIn([0, "url"]) || "",
      fromAt: fromAtStr,
      toAt: toAtStr,
      dayCheck: _.get(jsData, "dayCheck"),
      cost: _.get(jsData, "cost"),
    };
    if (contractId) {
      _.set(data, "uuid", _.get(jsData, "uuid"));
    }
    setIsSaveContractFetching(true);
    let result = await ServiceBase.requestJson({
      method: contractId ? "PUT" : "POST",
      url: contractId ? `/contract/${contractId}/update` : URI.ADD_CONTRACT,
      data: data,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      if (contractId) {
        Ui.showSuccess({ message: "Sửa hợp đồng thành công." });
      } else {
        Ui.showSuccess({ message: "Tạo hợp đồng thành công." });
      }
    }
    setIsSaveContractFetching(false);
    onShowModal({ isShow: false, actionName: "", corporateId: "" });
  }, [contract, contractId, fileList, onShowModal]);

  /**
   * _handleDisabledDate: Bắt thay đổi của control
   * @param {*} currentDate Ngày cần so sánh
   * @return {boolean} Ẩn ngày cần so sánh hay không
   */
  const _handleDisabledDate = useCallback(
    (currentDate) => {
      return (
        currentDate &&
        contract.get("signatureDate") &&
        currentDate.valueOf() < contract.get("signatureDate").valueOf()
      );
    },
    [contract]
  );

  /**
   * _handleChangeInput: Bắt thay đổi của input
   * @param {*} event Event của input
   */
  const _handleChangeInput = useCallback(
    (e) => {
      let name = _.get(e, "target.name");
      let value = _.get(e, "target.value");
      setContract((prevState) => prevState.set(name, value));
    },
    [setContract]
  );
  /**
   * _handleChange: Bắt thay đổi của control
   * @param {string} name Tên dữ liệu thay đổi
   * @param {*} value Dữ liệu thay đổi
   */
  const _handleChange = useCallback(
    (name, value) => setContract((prevState) => prevState.set(name, value)),
    []
  );
  /**
   * _handleUpload: Upload file
   * @param {*} options File
   */
  const _handleUpload = useCallback(async (options) => {
    const data = new FormData();
    data.set("files", _.get(options, "file"));
    const result = await ServiceBase.requestJson({
      url: "/upload/multi/files",
      contentType: "multipart/form-data",
      method: "POST",
      data: data,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
      setFileList((prevState) =>
        prevState.push(
          Map({
            uid: hashByTimeStamp(1),
            name: _.get(options, "file.name"),
            status: "error",
            response: "Lỗi khi upload file.",
          })
        )
      );
    } else {
      setFileList((prevState) =>
        prevState.push(
          Map({
            uid: hashByTimeStamp(1),
            name: _.get(options, "file.name"),
            status: "done",
            url: _.get(result, "value.0"),
          })
        )
      );
    }
  }, []);
  /**
   * _handleRemove: Remove file
   * @param {*} options File
   */
  const _handleRemove = useCallback(
    async (file) => {
      let indexOfFile = fileList.findIndex(
        (x) => x.get("uid") === _.get(file, "uid")
      );
      setFileList((prevState) => prevState.remove(indexOfFile));
    },
    [fileList]
  );

  /**
   * _handleAddCost: Thêm 1 dòng giá mới
   */
  const _handleAddCost = useCallback(
    () =>
      setContract((prevState) =>
        prevState.update("cost", (cost) =>
          cost.push(
            Map({
              vehicleTypeId: null,
              vehicleTypeName: null,
              fixedRoutesId: null,
              fixedRoutesName: null,
              packageKM: 0,
              distance: 0,
              turnNumber: 0,
              monthlyPrice: 0,
              extraTurnPrice: 0,
              extraOTPrice: 0,
              extraHolidayPrice: 0,
              costPerKm: 0,
              costPerKmByHoliday: 0,
              costPerKmByOT: 0,
            })
          )
        )
      ),
    []
  );
  /**
   * _handleDisabledHour: Validate fromAt && toAt
   */
  const _handleDisabledHour = useCallback(
    (name) => {
      if (name === "fromAt") {
        if (contract.get("toAt")) {
          let toAtHour = contract.get("toAt").hour();
          let toAtMinute = contract.get("toAt").minute();
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
        if (contract.get("fromAt")) {
          let fromAtHour = contract.get("fromAt").hour();
          let fromAtMinute = contract.get("fromAt").minute();
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
    },
    [contract]
  );
  /**
   * _handleDisabledMinute: Validate fromAt && toAt
   */
  const _handleDisabledMinute = useCallback(
    (selectedHour, name) => {
      if (name === "fromAt") {
        if (contract.get("toAt")) {
          let toAtHour = contract.get("toAt").hour();
          let toAtMinute = contract.get("toAt").minute();
          if (toAtHour === selectedHour) {
            // Lấy <= phút được so sánh
            return _.slice(minutesInHour, toAtMinute, minutesInHour.length);
          }
        }
        return [];
      } else if (name === "toAt") {
        if (contract.get("fromAt")) {
          let fromAtHour = contract.get("fromAt").hour();
          let fromAtMinute = contract.get("fromAt").minute();
          if (fromAtHour === selectedHour) {
            // Lấy >= giờ được so sánh
            return _.slice(minutesInHour, 0, fromAtMinute + 1);
          }
        }
        return [];
      }
      return [];
    },
    [contract]
  );

  const _validate = useCallback(() => {
    contractSchema
      .validate(contract.toJS(), {
        abortEarly: false,
      })
      .then(() => {
        setContractErrors((prevState) => {
          let nextState = prevState;
          nextState = nextState.clear();
          return nextState;
        });
      })
      .catch((err) => {
        let tempErrors = {};
        _.map(err.inner, (ner) => {
          _.set(tempErrors, ner.path, ner.message);
        });
        setContractErrors((prevState) => {
          let nextState = prevState;
          nextState = nextState.clear();
          _.forEach(tempErrors, (tempValue, tempKey) => {
            nextState = nextState.set(tempKey, tempValue);
          });
          return nextState;
        });
      });
  }, [contract]);
  //----------------------

  /**
   * Effect
   */
  useEffect(() => {
    if (contractId) {
      _.delay(async () => {
        setReadContractFetching(true);
        let result = await ServiceBase.requestJson({
          url: `/contract/${contractId}/read`,
          method: "GET",
          data: {},
        });
        if (result.hasErrors) {
          Ui.showErrors(result.errors);
        } else {
          let fromAt = undefined;
          let fromAtStr = _.get(result, "value.data.fromAt");
          if (fromAtStr) {
            fromAt = moment(fromAtStr, DATE_TIME_FORMAT.HH_MM);
          }
          let toAt = undefined;
          let toAtStr = _.get(result, "value.data.toAt");
          if (toAtStr) {
            toAt = moment(toAtStr, DATE_TIME_FORMAT.HH_MM);
          }
          let cost = [];
          _.forEach(_.get(result, "value.data.cost", []), (x, xId) => {
            for (let index = 0; index < _.get(x, "numberVehicle"); index++) {
              let item = {
                ...x,
                id: index + 1,
                vehicleTypeIdName: `${_.get(x, "vehicleTypeName")}##$$%%${_.get(
                  x,
                  "numberVehicle"
                )}##$$%%${_.get(x, "vehicleTypeId")}__${xId}`,
              };
              cost.push(item);
            }
          });
          setContract(
            Map({
              ..._.get(result, "value.data"),
              signatureDate: checkMoment(
                _.get(result, "value.data.signatureDate")
              ),
              activatedDateFrom: checkMoment(
                _.get(result, "value.data.activatedDateFrom")
              ),
              activatedDateTo: checkMoment(
                _.get(result, "value.data.activatedDateTo")
              ),
              fromAt: fromAt,
              toAt: toAt,
              corporate: {
                key: _.get(result, "value.data.organizationId"),
                label: _.get(result, "value.data.organizationsName"),
              },
              cost: cost,
            })
          );
          if (_.get(result, "value.data.file")) {
            setFileList((prevState) =>
              prevState.push(
                Map({
                  uid: hashByTimeStamp(1),
                  name: _.replace(
                    _.get(result, "value.data.file"),
                    "https://media.cr.havaz.vn/files/",
                    ""
                  ),
                  status: "done",
                  url: _.get(result, "value.data.file"),
                })
              )
            );
          }
        }
        setReadContractFetching(false);
        setCanValidate(true);
      }, 600);
    } else {
      setCanValidate(true);
    }
  }, [contractId]);
  useEffect(() => {
    if (canValidate && !contractId) {
      clearTimeout(validateTimer);
      validateTimer = setTimeout(_validate, 400);
    }
  }, [_validate, canValidate, contractId]);
  //-------------------------
  let disabled = contractId && true;
  // console.log(contract.get("check"));
  return (
    <div className={classes.info}>
      <Spin spinning={readContractFetching} tip="...Đang lấy dữ liệu">
        <div className="content">
          <Grid container spacing={2}>
            <Grid item xs={9}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <label htmlFor="contractNumber">
                        Số hợp đồng
                        <span className="mark-required-color">*</span>
                      </label>
                    </Grid>
                    <Grid item xs={12}>
                      <Input
                        disabled={disabled}
                        className={classNames({
                          "border-invalid": contractErrors.get(
                            "contractNumber"
                          ),
                        })}
                        placeholder="Nhập số hợp đồng"
                        name="contractNumber"
                        value={contract.get("contractNumber")}
                        onChange={_handleChangeInput}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <label htmlFor="corporateName">
                        Tên doanh nghiệp
                        <span className="mark-required-color">*</span>
                      </label>
                    </Grid>
                    <Grid item xs={12}>
                      <Corporate
                        disabled={disabled}
                        className={classNames({
                          "border-invalid": contractErrors.get("corporate"),
                        })}
                        value={contract.get("corporate")}
                        onSelect={(corporate) =>
                          _handleChange("corporate", corporate)
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={3}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <label htmlFor="signatureDate">
                        Ngày ký<span className="mark-required-color">*</span>
                      </label>
                    </Grid>
                    <Grid item xs={12}>
                      <DatePicker
                        disabled={disabled}
                        className={classNames({
                          "border-invalid": contractErrors.get("signatureDate"),
                        })}
                        format={DATE_TIME_FORMAT.DD_MM_YYYY}
                        name="signatureDate"
                        value={contract.get("signatureDate")}
                        onChange={(value) => {
                          _handleChange(
                            "signatureDate",
                            value ? value.startOf("day") : value
                          );
                          let activatedDateFrom = undefined;
                          let activatedDateTo = undefined;
                          if (value) {
                            if (
                              contract.get("activatedDateFrom") &&
                              value.valueOf() >
                                contract.get("activatedDateFrom").valueOf()
                            ) {
                              activatedDateFrom = value;
                            } else if (
                              contract.get("activatedDateFrom") &&
                              value.valueOf() <
                                contract.get("activatedDateFrom").valueOf()
                            ) {
                              activatedDateFrom = contract.get(
                                "activatedDateFrom"
                              );
                            } else {
                              activatedDateFrom = value;
                            }
                            let duration = contract.get("duration");
                            activatedDateTo = activatedDateFrom
                              .clone()
                              .add(duration, "month");
                          } else {
                            activatedDateFrom = value;
                          }
                          _handleChange(
                            "activatedDateFrom",
                            activatedDateFrom
                              ? activatedDateFrom.startOf("day")
                              : activatedDateFrom
                          );
                          _handleChange(
                            "activatedDateTo",
                            activatedDateTo
                              ? activatedDateTo.endOf("day")
                              : activatedDateTo
                          );
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={3}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <label htmlFor="duration">Thời hạn</label>
                    </Grid>
                    <Grid item xs={12}>
                      <Select
                        disabled={disabled}
                        placeholder="Chọn thời hạn"
                        name="duration"
                        style={{ width: "100%" }}
                        value={contract.get("duration") || undefined}
                        onChange={(selected) => {
                          _handleChange("duration", selected);
                          let signatureDate = contract.get("signatureDate");
                          if (signatureDate) {
                            let activatedDateTo = signatureDate
                              .clone()
                              .add(selected, "month");
                            _handleChange(
                              "activatedDateTo",
                              activatedDateTo
                                ? activatedDateTo.endOf("day")
                                : activatedDateTo
                            );
                          }
                        }}
                      >
                        <Select.Option value={12}>12 tháng</Select.Option>
                        <Select.Option value={36}>36 tháng</Select.Option>
                      </Select>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={3}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <label htmlFor="activatedDateFrom">
                        Từ ngày<span className="mark-required-color">*</span>
                      </label>
                    </Grid>
                    <Grid item xs={12}>
                      <DatePicker
                        disabled={disabled}
                        allowClear={false}
                        className={classNames({
                          "border-invalid": contractErrors.get(
                            "activatedDateFrom"
                          ),
                        })}
                        format={DATE_TIME_FORMAT.DD_MM_YYYY}
                        disabledDate={_handleDisabledDate}
                        name="activatedDateFrom"
                        value={contract.get("activatedDateFrom")}
                        onChange={(value) => {
                          _handleChange(
                            "activatedDateFrom",
                            value ? value.startOf("day") : value
                          );
                          let activatedDateTo = undefined;
                          if (value) {
                            let duration = contract.get("duration");
                            activatedDateTo = value
                              .clone()
                              .add(duration, "month");
                          }
                          _handleChange(
                            "activatedDateTo",
                            activatedDateTo
                              ? activatedDateTo.endOf("day")
                              : activatedDateTo
                          );
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={3}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <label htmlFor="activatedDateTo">Đến ngày</label>
                    </Grid>
                    <Grid item xs={12}>
                      <DatePicker
                        allowClear={false}
                        disabled={true}
                        format={DATE_TIME_FORMAT.DD_MM_YYYY}
                        name="activatedDateTo"
                        value={contract.get("activatedDateTo")}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <label htmlFor="description">Mô tả hợp đồng</label>
                    </Grid>
                    <Grid item xs={12}>
                      <Input.TextArea
                        disabled={disabled}
                        rows={5}
                        name="description"
                        value={contract.get("description")}
                        onChange={_handleChangeInput}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={3}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <label htmlFor="contractType">
                        Loại hợp đồng
                        <span className="mark-required-color">*</span>
                      </label>
                    </Grid>
                    <Grid item xs={12}>
                      <ContractType
                        value={contract.get("contractType")}
                        onSelect={(selected) =>
                          _handleChange("contractType", selected)
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <label htmlFor="signer">
                        Người ký<span className="mark-required-color">*</span>
                      </label>
                    </Grid>
                    <Grid item xs={12}>
                      <Input
                        disabled={disabled}
                        className={classNames({
                          "border-invalid": contractErrors.get("signer"),
                        })}
                        placeholder="Nhập người ký"
                        name="signer"
                        value={contract.get("signer")}
                        onChange={_handleChangeInput}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <label htmlFor="file">File đính kèm</label>
                    </Grid>
                    <Grid item xs={12}>
                      <Upload
                        disabled={disabled}
                        accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.xlsx"
                        name="file"
                        customRequest={_handleUpload}
                        onRemove={_handleRemove}
                        fileList={fileList.toJS()}
                      >
                        <Button disabled={disabled}>
                          Upload file
                          <span className="ml-1 kt-font-sm kt-font-danger">
                            (.doc, .docx, .xlsx, .pdf)
                          </span>
                        </Button>
                      </Upload>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <h5>Phạm vi hợp đồng</h5>
                </Grid>
                <Grid item xs={5}>
                  <Grid container spacing={1}>
                    <Grid className="d-flex align-items-center" item xs={2}>
                      <label htmlFor="fromAt">
                        Từ<span className="mark-required-color">*</span>
                      </label>
                    </Grid>
                    <Grid item xs={3}>
                      <TimePicker
                        className={classNames({
                          "border-invalid": contractErrors.get("fromAt"),
                        })}
                        disabled={disabled}
                        disabledHours={() => _handleDisabledHour("fromAt")}
                        disabledMinutes={(selectedHour) =>
                          _handleDisabledMinute(selectedHour, "fromAt")
                        }
                        format={DATE_TIME_FORMAT.HH_MM}
                        style={{ width: "100%" }}
                        placeholder="07:00"
                        name="fromAt"
                        value={contract.get("fromAt")}
                        onChange={(value) => _handleChange("fromAt", value)}
                      />
                    </Grid>
                    <Grid className="d-flex align-items-center" item xs={2}>
                      <label htmlFor="toAt">
                        Đến<span className="mark-required-color">*</span>
                      </label>
                    </Grid>
                    <Grid item xs={3}>
                      <TimePicker
                        className={classNames({
                          "border-invalid": contractErrors.get("toAt"),
                        })}
                        disabled={disabled}
                        disabledHours={() => _handleDisabledHour("toAt")}
                        disabledMinutes={(selectedHour) =>
                          _handleDisabledMinute(selectedHour, "toAt")
                        }
                        format={DATE_TIME_FORMAT.HH_MM}
                        style={{ width: "100%" }}
                        placeholder="19:00"
                        name="toAt"
                        value={contract.get("toAt")}
                        onChange={(value) => _handleChange("toAt", value)}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid className="d-flex" item xs={7}>
                  <Grid container spacing={1}>
                    <Grid className="d-flex align-items-center" item xs={1}>
                      <label htmlFor="dayCheck">
                        Ngày<span className="mark-required-color">*</span>
                      </label>
                    </Grid>
                    <Grid className="d-flex align-items-center" item xs={11}>
                      <Checkbox.Group
                        disabled={disabled}
                        value={contract.get("dayCheck")}
                        onChange={(value) => _handleChange("dayCheck", value)}
                        options={[
                          {
                            value: "Mon",
                            label: "T2",
                          },
                          {
                            value: "Tue",
                            label: "T3",
                          },
                          {
                            value: "Wed",
                            label: "T4",
                          },
                          {
                            value: "Thu",
                            label: "T5",
                          },
                          {
                            value: "Fri",
                            label: "T6",
                          },
                          {
                            value: "Sat",
                            label: "T7",
                          },
                          {
                            value: "Sun",
                            label: "CN",
                          },
                        ]}
                      />
                      {_.isString(contractErrors.get("dayCheck")) && (
                        <span className="mark-required-color kt-font-sm">
                          {contractErrors.get("dayCheck")}
                        </span>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid className="mt-2" item xs={12}>
                  <h5>
                    Bảng giá
                    {!contractId && (
                      <>
                        <button
                          type="button"
                          onClick={_handleAddCost}
                          className="ml-3 btn btn-facebook btn-sm btn-icon-sm"
                        >
                          <i className="fa fa-plus" />
                          Thêm giá
                        </button>
                        {_.isString(contractErrors.get("cost")) && (
                          <span className="mark-required-color kt-font-sm">
                            {contractErrors.get("cost")}
                          </span>
                        )}
                      </>
                    )}
                  </h5>
                  <Divider className="mt-0" type="horizontal" />
                  {contractId ? (
                    <ViewCost grid={contract.get("cost")} contract={contract} />
                  ) : (
                    <Cost
                      contractType={contract.get("contractType")}
                      grid={contract.get("cost")}
                      check={contract.get("check")}
                      setContract={setContract}
                      contractErrors={
                        !contractErrors.get("cost") ||
                        _.isString(contractErrors.get("cost"))
                          ? defaultList
                          : contractErrors.get("cost")
                      }
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Spin>
      {!contractId && (
        <div className="action">
          <button
            disabled={contractErrors.size}
            onClick={_handleSaveContract}
            className={classNames({
              "btn btn-info btn-icon-sm": true,
              "kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--danger": isSaveContractFetching,
            })}
          >
            <i className="fa fa-save" />
            Lưu
          </button>
        </div>
      )}
    </div>
  );
};
const mapStateToProps = createStructuredSelector({
  appConfig: makeSelectAppConfig(),
});

export default compose(
  memo,
  connect(mapStateToProps, null),
  withStyles({
    info: {
      paddingBottom: 55,
      "& .action": {
        position: "absolute",
        left: 0,
        bottom: 0,
        width: "100%",
        borderTop: "1px solid #e9e9e9",
        padding: "5px 16px",
        background: "#fff",
        textAlign: "left",
      },
      "& .content": {},
    },
  })
)(ContractInfo);
