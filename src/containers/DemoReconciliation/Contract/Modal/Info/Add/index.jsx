import React, { memo, useCallback, useState } from "react";
import { Input, Select } from "antd";
import { withStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { Form, withFormik } from "formik";
import * as Yup from "yup";
import classNames from "classnames";
import ServiceBase from "@Services/ServiceBase";
import { URI } from "../../../constants";
import { Ui } from "@Helpers/Ui";
import _ from "lodash";
import City from "components/SelectContainer/City";
import Owner from "components/SelectContainer/Owner";
import Globals from "globals.js";
import BranchCustomer from "components/SelectContainer/BranchCustomer";
import { phoneNumberRegex } from "helpers/utility";
import { STATUS } from "@Constants/common";

const corporateSchema = Yup.object().shape({
  name: Yup.string().required("*Trường bắt buộc"),
  unit: Yup.string().required("*Trường bắt buộc"),
  email: Yup.string().required("*Trường bắt buộc").email("*Sai định dạng"),
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
  representName: Yup.string().required("*Trường bắt buộc"),
  representEmail: Yup.string().nullable().email("*Sai định dạng"),
  representPhone: Yup.string()
    .required("*Trường bắt buộc")
    .matches(phoneNumberRegex, "*Sai định dạng"),
});
const CorporateForm = ({
  values,
  errors,
  setFieldValue,
  handleChange,
  isAddCorporateFetching,
}) => {
  return (
    <Form>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <label>
            NV phụ trách <span className="mark-required-color">*</span>
          </label>
        </Grid>
        <Grid item xs={9}>
          <Owner
            className={classNames({
              "border-invalid": _.get(errors, "owner"),
            })}
            value={_.get(values, "owner")}
            onSelect={(owner) => setFieldValue("owner", owner)}
          />
        </Grid>
        <Grid item xs={3}>
          <label>
            Đơn vị quản lý <span className="mark-required-color">*</span>
          </label>
        </Grid>
        <Grid item xs={9}>
          <BranchCustomer
            className={classNames({
              "border-invalid": _.get(errors, "parent"),
            })}
            value={_.get(values, "parent")}
            onSelect={(parent) => setFieldValue("parent", parent)}
          />
        </Grid>
        <Grid item xs={3}>
          <label>Ref Code</label>
        </Grid>
        <Grid item xs={9}>
          <Input
            placeholder="Nhập mã ref code"
            name="refCode"
            value={_.get(values, "refCode")}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={3}>
          <label>
            Tên doanh nghiệp <span className="mark-required-color">*</span>
          </label>
        </Grid>
        <Grid item xs={9}>
          <Input
            className={classNames({
              "border-invalid": _.get(errors, "name"),
            })}
            placeholder="Nhập tên doanh nghiệp"
            name="name"
            value={_.get(values, "name")}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={3}>
          <label>Tên rút gọn</label>
        </Grid>
        <Grid item xs={9}>
          <Input
            placeholder="Nhập tên rút gọn"
            name="allias"
            value={_.get(values, "allias")}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={3}>
          <label>Mã số thuế</label>
        </Grid>
        <Grid item xs={9}>
          <Input
            placeholder="Nhập mã số thuế"
            name="taxCode"
            value={_.get(values, "taxCode")}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={3}>
          <label>
            SĐT doanh nghiệp <span className="mark-required-color">*</span>
          </label>
        </Grid>
        <Grid item xs={9}>
          <Input
            className={classNames({
              "border-invalid": _.get(errors, "phone"),
            })}
            placeholder="Nhập SĐT doanh nghiệp"
            name="phone"
            value={_.get(values, "phone")}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={3}>
          <label>
            Email doanh nghiệp <span className="mark-required-color">*</span>
          </label>
        </Grid>
        <Grid item xs={9}>
          <Input
            className={classNames({
              "border-invalid": _.get(errors, "email"),
            })}
            placeholder="Nhập email doanh nghiệp"
            name="email"
            value={_.get(values, "email")}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={3}>
          <label>
            Địa chỉ <span className="mark-required-color">*</span>
          </label>
        </Grid>
        <Grid item xs={9}>
          <Input
            className={classNames({
              "border-invalid": _.get(errors, "unit"),
            })}
            placeholder="Nhập địa chỉ doanh nghiệp"
            name="unit"
            value={_.get(values, "unit")}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={3}>
          <label>
            Tỉnh/Thành <span className="mark-required-color">*</span>
          </label>
        </Grid>
        <Grid item xs={9}>
          <City
            className={classNames({
              "border-invalid": _.get(errors, "cityIds"),
            })}
            value={_.get(values, "cityIds")}
            onSelect={(cityIds) => setFieldValue("cityIds", cityIds)}
          />
        </Grid>
        <Grid item xs={3}>
          <label>
            Đại diện <span className="mark-required-color">*</span>
          </label>
        </Grid>
        <Grid item xs={9}>
          <Input
            className={classNames({
              "border-invalid": _.get(errors, "representName"),
            })}
            placeholder="Nhập tên đại diện"
            name="representName"
            value={_.get(values, "representName")}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={3}>
          <label>
            SĐT đại diện <span className="mark-required-color">*</span>
          </label>
        </Grid>
        <Grid item xs={9}>
          <Input
            className={classNames({
              "border-invalid": _.get(errors, "representPhone"),
            })}
            placeholder="Nhập số di động đại diện"
            name="representPhone"
            value={_.get(values, "representPhone")}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={3}>
          <label>Email đại diện</label>
        </Grid>
        <Grid item xs={9}>
          <Input
            placeholder="Nhập email đại diện"
            name="representEmail"
            className={classNames({
              "border-invalid": _.get(errors, "representEmail"),
            })}
            value={_.get(values, "representEmail")}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={3}>
          <label>Trạng thái</label>
        </Grid>
        <Grid item xs={9}>
          <Select
            style={{ width: "100%" }}
            placeholder="Trạng thái"
            onChange={(status) => setFieldValue("status", status)}
            value={_.get(values, "status")}
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
      <div className="action">
        <button
          type="submit"
          className={classNames({
            "btn btn-info btn-icon-sm": true,
            "kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--danger": isAddCorporateFetching,
          })}
        >
          <i className="fa fa-save" />
          Lưu
        </button>
      </div>
    </Form>
  );
};
const EnhancedForm = withFormik({
  mapPropsToValues: ({ corporate }) => ({ ...corporate }),
  validationSchema: corporateSchema,
  handleSubmit: (values, { setSubmitting, props }) => {
    setTimeout(() => {
      props.onAddCorporate(values);
      setSubmitting(false);
    }, 200);
  },

  displayName: "CorporateForm",
})(CorporateForm);

const Add = memo(({ onShowModal, classes }) => {
  const [corporate] = useState(() => {
    const profile = Globals.currentUser;
    const parent = profile
      ? {
          key: profile.organizationUuid,
          label: profile.organizationName,
        }
      : undefined;
    return {
      name: "",
      email: "",
      unit: "",
      phone: "",
      allias: "",
      taxCode: "",
      status: "1",
      cityIds: undefined,
      representName: "",
      representPhone: null,
      representEmail: null,
      owner: undefined,
      refCode: "",
      parent: parent,
    };
  });
  const [isAddCorporateFetching, setIsAddCorporateFetching] = useState(false);

  // Function-------------------------

  /**
   * _handleAddCorporate: Thêm mới doanh nghiệp
   */
  const _handleAddCorporate = useCallback(
    async (jsData) => {
      let data = {
        refCode: _.get(jsData, "refCode"),
        name: _.get(jsData, "name"),
        email: _.get(jsData, "email"),
        status: _.get(jsData, "status"),
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
      console.log(data);
      setIsAddCorporateFetching(true);
      let result = await ServiceBase.requestJson({
        method: "POST",
        url: URI.ADD_CORPORATE,
        data: data,
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        Ui.showSuccess({ message: "Tạo doanh nghiệp thành công." });
        onShowModal({ isShow: false, actionName: "", corporateId: "" });
      }
      setIsAddCorporateFetching(false);
    },
    [onShowModal]
  );

  //----------------------

  return (
    <Container maxWidth="xl" className={classes.container}>
      <EnhancedForm
        corporate={corporate}
        isAddCorporateFetching={isAddCorporateFetching}
        onAddCorporate={_handleAddCorporate}
      />
    </Container>
  );
});
export default withStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
  },
}))(Add);
