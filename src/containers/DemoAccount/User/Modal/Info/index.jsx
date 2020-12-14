import React, { memo, useEffect, useState, useCallback } from "react";
import { Grid, withStyles } from "@material-ui/core";
import { Input, Spin, Select, Button } from "antd";
import _ from "lodash";
import classNames from "classnames";
import { Ui } from "@Helpers/Ui";
import ServiceBase from "@Services/ServiceBase";
import { URI } from "../../constants";
import * as Yup from "yup";
import { createStructuredSelector } from "reselect";
import { makeSelectAppConfig } from "redux/app/selectors";
import { compose } from "recompose";
import { connect } from "react-redux";
import Globals from "globals.js";
import { Formik, Form } from "formik";
import ManageUnit from "components/SelectContainer/ManageUnit";
import Role from "components/SelectContainer/Role";
import City from "components/SelectContainer/City";
import { STATUS } from "@Constants/common";
import I from "components/I";
const userSchema = Yup.object().shape({
  fullName: Yup.string()
    .required("*Trường bắt buộc")
    .matches(/^[^<>%^&*#@!/|::;,.""0-9]+$/, { excludeEmptyString: true }),
  email: Yup.string().required("*Trường bắt buộc").email("*Sai định dạng"),
  password: Yup.string()
    .nullable()
    .min(7, "Độ dài mật khẩu từ 7 đến 20 ký tự")
    .max(20, "Độ dài mật khẩu từ 7 đến 20 ký tự"),
  phone: Yup.string()
    .required("*Trường bắt buộc")
    .matches(/^(([+]{1}[0-9]{2}|0)[0-9]{9})$/, { excludeEmptyString: true }),
  organizationIds: Yup.array()
    .required("*Trường bắt buộc")
    .of(
      Yup.object().shape({
        key: Yup.string().required("*Trường bắt buộc"),
      })
    ),
  rolesIds: Yup.array()
    .required("*Trường bắt buộc")
    .of(
      Yup.object().shape({
        key: Yup.string().required("*Trường bắt buộc"),
      })
    ),
  cityIds: Yup.object()
    .required("*Trường bắt buộc")
    .shape({
      key: Yup.string().required("*Trường bắt buộc"),
    }),
  status: Yup.string().required("*Trường bắt buộc"),
});

const UserInfo = ({ userId, appConfig, onShowModal, actionName, classes }) => {
  const [isSaveUserFetching, setIsSaveUserFetching] = useState(false);
  const [readUserFetching, setReadUserFetching] = useState(false);
  const [user, setUser] = useState(() => {
    const profile = Globals.currentUser;
    const objParentId = profile
      ? {
          key: profile.organizationUuid,
          label: profile.organizationName,
        }
      : undefined;
    return {
      refCode: "",
      fullName: "",
      password: "carrental@123",
      email: "",
      phone: "",
      address: "",
      organizationIds: objParentId ? [objParentId] : [],
      rolesIds: [],
      cityIds: undefined,
      status: "1",
    };
  });

  /**
   * Callback
   */

  const _handleSaveUser = useCallback(
    async (values) => {
      let data = _.pick(values, [
        "uuid",
        "refCode",
        "fullName",
        "password",
        "email",
        "phone",
        "address",
        "status",
        "cityIds",
        "rolesIds",
        "organizationIds",
        "driversLicenseCode",
        "driversLicenseClass",
      ]);
      data.type = "USER";
      data.password =
        actionName === "add"
          ? _.get(values, "password", "carrental@123") || "carrental@123"
          : _.get(values, "password");
      if (actionName === "read" && !_.get(values, "password")) {
        delete data.password;
      }
      data.cityId = _.get(values, "cityIds.key");
      setIsSaveUserFetching(true);
      let result = await ServiceBase.requestJson({
        method: "POST",
        url: actionName === "add" ? URI.ADD_USER : URI.EDIT_USER,
        data: data,
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        if (actionName === "add") {
          Ui.showSuccess({ message: "Tạo tài khoản thành công." });
        } else {
          Ui.showSuccess({ message: "Lưu tài khoản thành công." });
        }
        onShowModal({ isShow: false, actionName: "", userId: "" });
      }
    },
    [actionName, onShowModal]
  );
  //----------------------

  /**
   * Effect
   */
  useEffect(() => {
    if (userId) {
      _.delay(async () => {
        setReadUserFetching(true);
        let result = await ServiceBase.requestJson({
          url: URI.READ_USER,
          method: "POST",
          data: { uuid: userId },
        });
        if (result.hasErrors) {
          Ui.showErrors(result.errors);
        } else {
          let rs = result.value.data;
          rs.status = _.get(rs, "status", "").toString();
          rs.organizationIds = _.isArray(rs.organizationIds)
            ? rs.organizationIds
            : _.get(rs, "organizationIds")
            ? [_.get(rs, "organizationIds")]
            : [];
          setUser(rs);
        }
        setReadUserFetching(false);
      }, 600);
    } else {
    }
  }, [userId]);
  //-------------------------

  return (
    <div className={classes.info}>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        onSubmit={(values, actions) => {
          _handleSaveUser(values);
          actions.setSubmitting(false);
        }}
        validationSchema={userSchema}
      >
        {({ values, handleBlur, handleChange, errors, setFieldValue }) => (
          <Form>
            <Spin spinning={readUserFetching} tip="...Đang lấy dữ liệu">
              <div className="content">
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <label>Ref code</label>
                  </Grid>
                  <Grid item xs={9}>
                    <Input
                      placeholder="Mã từ hệ thống khác(Cyber,HR...)"
                      name="refCode"
                      value={_.get(values, "refCode")}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <label>
                      Họ và tên <span className="kt-font-danger">*</span>
                    </label>
                  </Grid>
                  <Grid item xs={9}>
                    <Input
                      className={classNames({
                        "border-invalid": _.get(errors, "fullName"),
                      })}
                      placeholder="Nhập họ và tên"
                      name="fullName"
                      value={_.get(values, "fullName")}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <label>
                      Email <span className="kt-font-danger">*</span>
                    </label>
                  </Grid>
                  <Grid item xs={9}>
                    <Input
                      className={classNames({
                        "border-invalid": _.get(errors, "email"),
                      })}
                      placeholder="Nhập email"
                      name="email"
                      value={_.get(values, "email")}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <label>Mật khẩu</label>
                  </Grid>
                  <Grid item xs={9}>
                    <Input
                      className={classNames({
                        "border-invalid": _.get(errors, "password"),
                      })}
                      placeholder="Mật khẩu mặc định : carrental@123"
                      name="password"
                      value={_.get(values, "password")}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <label>
                      Số điện thoại <span className="kt-font-danger">*</span>
                    </label>
                  </Grid>
                  <Grid item xs={9}>
                    <Input
                      className={classNames({
                        "border-invalid": _.get(errors, "phone"),
                      })}
                      placeholder="Nhập số điện thoại di động"
                      name="phone"
                      value={_.get(values, "phone")}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <label>
                      Đơn vị quản lý <span className="kt-font-danger">*</span>
                    </label>
                  </Grid>
                  <Grid item xs={9}>
                    <ManageUnit
                      value={_.get(values, "organizationIds.0", undefined)}
                      onSelect={(unit) =>
                        setFieldValue("organizationIds", [unit])
                      }
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <label>Chi nhánh</label>
                  </Grid>
                  <Grid item xs={9}>
                    <Input
                      placeholder="Nhập tên chi nhánh"
                      name="address"
                      value={_.get(values, "address")}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <label>
                      Chức danh <span className="kt-font-danger">*</span>
                    </label>
                  </Grid>
                  <Grid item xs={9}>
                    <Role
                      className={classNames({
                        "border-invalid": _.get(errors, "rolesIds"),
                      })}
                      mode="multiple"
                      value={_.get(values, "rolesIds")}
                      onSelect={(rolesIds) =>
                        setFieldValue("rolesIds", rolesIds)
                      }
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <label>
                      Thành phố <span className="kt-font-danger">*</span>
                    </label>
                  </Grid>
                  <Grid item xs={9}>
                    <City
                      className={classNames({
                        "border-invalid": _.get(errors, "cityIds"),
                      })}
                      mode="single"
                      value={_.get(values, "cityIds")}
                      onSelect={(cityIds) => setFieldValue("cityIds", cityIds)}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <label>
                      Trạng thái <span className="kt-font-danger">*</span>
                    </label>
                  </Grid>
                  <Grid item xs={9}>
                    <Select
                      value={_.get(values, "status")}
                      onChange={(status) => setFieldValue("status", status)}
                      style={{ width: "100%" }}
                      placeholder="Chọn trạng thái"
                    >
                      {_.map(STATUS, (status, statusId) => {
                        return (
                          <Select.Option key={statusId} value={status.value}>
                            {status.label}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Grid>
                </Grid>
              </div>
            </Spin>
            <div className="action">
              <Button
                size="large"
                htmlType="submit"
                disabled={isSaveUserFetching}
                loading={isSaveUserFetching}
              >
                <I className="fa fa-save" />
                Lưu
              </Button>
            </div>
          </Form>
        )}
      </Formik>
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
)(UserInfo);
