import React, { memo, useCallback, useState, useEffect } from "react";
import { Input, Select, Divider, Spin } from "antd";
import { withStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import * as Yup from "yup";
import classNames from "classnames";
import ServiceBase from "@Services/ServiceBase";
import { URI } from "../../../constants";
import { Ui } from "@Helpers/Ui";
import { Map } from "immutable";
import _ from "lodash";
import City from "components/SelectContainer/City";
import Owner from "components/SelectContainer/Owner";
import BranchCustomer from "components/SelectContainer/BranchCustomer";
import ContractList from "./List";
import {
  phoneNumberRegex,
  calculateTotalPage,
  checkMoment,
} from "helpers/utility";
import { STATUS } from "@Constants/common";
import { DATE_TIME_FORMAT, CONTRACT_TYPE } from "constants/common";

let validateTimer = null;

const corporateSchema = Yup.object().shape({
  name: Yup.string().required("*Trường bắt buộc"),
  unit: Yup.string().required("*Trường bắt buộc"),
  email: Yup.string().required("*Trường bắt buộc").email("*Sai định dạng"),
  representName: Yup.string().required("*Trường bắt buộc"),
  representEmail: Yup.string().nullable().email("*Sai định dạng"),
  representPhone: Yup.string()
    .required("*Trường bắt buộc")
    .matches(phoneNumberRegex, "*Sai định dạng"),
  phone: Yup.string()
    .required("*Trường bắt buộc")
    .matches(phoneNumberRegex, "*Sai định dạng"),
  cityIds: Yup.object()
    .required("*Trường bắt buộc")
    .shape({
      key: Yup.string().required("*Trường bắt buộc"),
    }),
  parent: Yup.object()
    .required("*Trường bắt buộc")
    .shape({
      key: Yup.string().required("*Trường bắt buộc"),
    }),
  owner: Yup.object()
    .required("*Trường bắt buộc")
    .shape({
      key: Yup.string().required("*Trường bắt buộc"),
    }),
});

const Detail = memo(({ corporateId, onShowModal, classes }) => {
  const [corporate, setCorporate] = useState(() => {
    return Map({
      name: "",
      email: "",
      unit: "",
      status: undefined,
      phone: "",
      allias: "",
      taxCode: "",
      cityIds: undefined,
      representName: "",
      representPhone: null,
      representEmail: null,
      owner: undefined,
      refCode: "",
      parent: undefined,
    });
  });
  const [readCorporateFetching, setReadCorporateFetching] = useState(false);
  const [isEditCorporateFetching, setIsEditCorporateFetching] = useState(false);
  const [canValidate, setCanValidate] = useState(false);
  const [corporateErrors, setCorporateErrors] = useState(Map());

  // Function-------------------------

  const _validate = useCallback(() => {
    corporateSchema
      .validate(corporate.toJS(), {
        abortEarly: false,
      })
      .then(() => {
        setCorporateErrors((prevState) => {
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
        setCorporateErrors((prevState) => {
          let nextState = prevState;
          nextState = nextState.clear();
          _.forEach(tempErrors, (tempValue, tempKey) => {
            nextState = nextState.set(tempKey, tempValue);
          });
          return nextState;
        });
      });
  }, [corporate]);

  /**
   * _handleChangeInput: Bắt sự kiện thay đổi input
   * @param {*} event Event thay đổi input
   */
  const _handleChangeInput = useCallback(
    (event) => {
      let name = _.get(event, "target.name");
      let value = _.get(event, "target.value");
      setCorporate((prevState) => prevState.set(name, value));
    },
    [setCorporate]
  );

  /**
   * _setFieldValue: Set field value by name input
   * @param {string} name Name của input
   * @param {*} value Giá trị của input
   */
  const _setFieldValue = useCallback(
    (name, value) => setCorporate((prevState) => prevState.set(name, value)),
    [setCorporate]
  );

  /**
   * _handleEditCorporate: Thêm mới doanh nghiệp
   */
  const _handleEditCorporate = useCallback(async () => {
    let jsData = corporate.toJS();
    let data = {
      uuid: _.get(jsData, "uuid"),
      status: _.get(jsData, "status"),
      refCode: _.get(jsData, "refCode"),
      name: _.get(jsData, "name"),
      email: _.get(jsData, "email"),
      unit: _.get(jsData, "unit"),
      phone: _.get(jsData, "phone"),
      allias: _.get(jsData, "allias"),
      taxCode: _.get(jsData, "taxCode"),
      cityIds: _.get(jsData, "cityIds"),
      cityId: _.get(jsData, "cityIds.key"),
      representName: _.get(jsData, "representName"),
      representPhone: _.get(jsData, "representPhone"),
      representEmail: _.get(jsData, "representEmail"),
      ownerId: _.get(jsData, "owner.key"),
      parentId: _.get(jsData, "parent.key"),
    };
    setIsEditCorporateFetching(true);
    let result = await ServiceBase.requestJson({
      method: "POST",
      url: URI.EDIT_CORPORATE,
      data: data,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      Ui.showSuccess({ message: "Sửa doanh nghiệp thành công." });
      onShowModal({ isShow: false, actionName: "", corporateId: "" });
    }
    setIsEditCorporateFetching(false);
  }, [corporate, onShowModal]);

  //----------------------

  // Effect

  useEffect(() => {
    if (corporateId) {
      _.delay(async () => {
        setReadCorporateFetching(true);
        let result = await ServiceBase.requestJson({
          url: URI.READ_CORPORATE,
          method: "POST",
          data: { uuid: corporateId },
        });
        if (result.hasErrors) {
          Ui.showErrors(result.errors);
        } else {
          let rs = result.value.data;

          setCorporate(
            Map({
              ...rs,
              parent: _.get(result, "value.data.objParentId"),
              owner: {
                key: _.get(result, "value.data.ownerId"),
                label: _.get(result, "value.data.ownerName"),
              },
            })
          );
        }
        setReadCorporateFetching(false);
        setCanValidate(true);
      }, 600);
    } else {
      setCanValidate(true);
    }
  }, [corporateId]);
  useEffect(() => {
    if (canValidate) {
      clearTimeout(validateTimer);
      validateTimer = setTimeout(_validate, 500);
    }
  }, [_validate, canValidate]);
  //-------------

  return (
    <Container maxWidth={false} className={classes.container}>
      <Spin spinning={readCorporateFetching} tip="Đang lấy dữ liệu...">
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <label>
                  Đơn vị quản lý<span className="mark-required-color">*</span>
                </label>
              </Grid>
              <Grid item xs={12}>
                <BranchCustomer
                  className={classNames({
                    "border-invalid": corporateErrors.get("parent"),
                  })}
                  value={corporate.get("parent")}
                  onSelect={(parent) => _setFieldValue("parent", parent)}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <label>
                  NV phụ trách<span className="mark-required-color">*</span>
                </label>
              </Grid>
              <Grid item xs={12}>
                <Owner
                  className={classNames({
                    "border-invalid": corporateErrors.get("owner"),
                  })}
                  value={corporate.get("owner")}
                  onSelect={(owner) => _setFieldValue("owner", owner)}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <label>Trạng thái</label>
              </Grid>
              <Grid item xs={12}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Trạng thái"
                  onChange={(status) => _setFieldValue("status", status)}
                  value={corporate.get("status") || undefined}
                >
                  {STATUS.map((status, statusId) => {
                    return (
                      <Select.Option key={statusId} value={status.value}>
                        {status.label}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <label>
                  Tên doanh nghiệp
                  <span className="mark-required-color">*</span>
                </label>
              </Grid>
              <Grid item xs={12}>
                <Input
                  className={classNames({
                    "border-invalid": corporateErrors.get("name"),
                  })}
                  value={corporate.get("name")}
                  name="name"
                  onChange={_handleChangeInput}
                  placeholder="Nhập tên doanh nghiệp"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <label>Tên rút gọn</label>
              </Grid>
              <Grid item xs={12}>
                <Input
                  value={corporate.get("allias")}
                  name="allias"
                  onChange={_handleChangeInput}
                  placeholder="Nhập tên rút gọn"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <label>Mã số thuế</label>
              </Grid>
              <Grid item xs={12}>
                <Input
                  value={corporate.get("taxCode")}
                  name="taxCode"
                  onChange={_handleChangeInput}
                  placeholder="Nhập mã số thuế"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <label>
                  SĐT doanh nghiệp
                  <span className="mark-required-color">*</span>
                </label>
              </Grid>
              <Grid item xs={12}>
                <Input
                  className={classNames({
                    "border-invalid": corporateErrors.get("phone"),
                  })}
                  value={corporate.get("phone")}
                  name="phone"
                  onChange={_handleChangeInput}
                  placeholder="Nhập SĐT doanh nghiệp"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <label>
                  Email doanh nghiệp
                  <span className="mark-required-color">*</span>
                </label>
              </Grid>
              <Grid item xs={12}>
                <Input
                  className={classNames({
                    "border-invalid": corporateErrors.get("email"),
                  })}
                  value={corporate.get("email")}
                  name="email"
                  onChange={_handleChangeInput}
                  placeholder="Nhập email doanh nghiệp"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <label>
                  Địa chỉ<span className="mark-required-color">*</span>
                </label>
              </Grid>
              <Grid item xs={12}>
                <Input
                  className={classNames({
                    "border-invalid": corporateErrors.get("unit"),
                  })}
                  value={corporate.get("unit")}
                  name="unit"
                  onChange={_handleChangeInput}
                  placeholder="Nhập địa chỉ doanh nghiệp"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <label>
                  Tỉnh/Thành<span className="mark-required-color">*</span>
                </label>
              </Grid>
              <Grid item xs={12}>
                <City
                  className={classNames({
                    "border-invalid": corporateErrors.get("cityIds"),
                  })}
                  value={corporate.get("cityIds")}
                  onSelect={(cityIds) => _setFieldValue("cityIds", cityIds)}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <label>
                  Đại diện <span className="mark-required-color">*</span>
                </label>
              </Grid>
              <Grid item xs={12}>
                <Input
                  className={classNames({
                    "border-invalid": corporateErrors.get("representName"),
                  })}
                  value={corporate.get("representName")}
                  name="representName"
                  onChange={_handleChangeInput}
                  placeholder="Nhập tên đại diện"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <label>
                  SĐT đại diện<span className="mark-required-color">*</span>
                </label>
              </Grid>
              <Grid item xs={12}>
                <Input
                  className={classNames({
                    "border-invalid": corporateErrors.get("representPhone"),
                  })}
                  value={corporate.get("representPhone")}
                  name="representPhone"
                  onChange={_handleChangeInput}
                  placeholder="Nhập SĐT đại diện"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <label>Email đại diện</label>
              </Grid>
              <Grid item xs={12}>
                <Input
                  className={classNames({
                    "border-invalid": corporateErrors.get("representEmail"),
                  })}
                  value={corporate.get("representEmail")}
                  name="representEmail"
                  onChange={_handleChangeInput}
                  placeholder="Nhập email đại diện"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid className="pt-3" item xs={12}>
            <h5>Danh sách hợp đồng kí kết</h5>
            <Divider className="mt-0" type="horizontal" />
            <ContractList corporateId={corporateId} />
          </Grid>
        </Grid>
      </Spin>
      <div className="action">
        <button
          disabled={corporateErrors.size}
          onClick={_handleEditCorporate}
          type="button"
          className={classNames({
            "btn btn-info btn-icon-sm": true,
            disabled: corporateErrors.size,
            "kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--danger": isEditCorporateFetching,
          })}
        >
          <i className="fa fa-save" />
          Lưu
        </button>
      </div>
    </Container>
  );
});
export default withStyles((theme) => ({
  container: {
    padding: theme.spacing(0, 2, 2, 2),
    "& .action": {
      position: "absolute",
      left: 0,
      bottom: 0,
      width: "100%",
      borderTop: "1px solid #e9e9e9",
      padding: "5px 16px",
      background: "#fff",
      textAlign: "left",
      zIndex: 100000,
    },
  },
}))(Detail);
