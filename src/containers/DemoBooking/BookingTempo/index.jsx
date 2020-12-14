import React, { memo, useEffect, useState, useCallback } from "react";
import { Grid, withStyles } from "@material-ui/core";
import { Input, Spin } from "antd";
import _ from "lodash";
import classNames from "classnames";
import { Ui } from "@Helpers/Ui";
import ServiceBase from "@Services/ServiceBase";
import { URI } from "./../constants";
import * as Yup from "yup";
import { createStructuredSelector } from "reselect";
import { makeSelectAppConfig } from "redux/app/selectors";
import { compose } from "recompose";
import { connect } from "react-redux";
import { Formik, Form } from "formik";
import A from "@Components/A";
import Owner from "@Components/SelectContainer/Owner";
import NoTypeBranchCustomer from "@Components/SelectContainer/NoTypeBranchCustomer";
const bookingSchema = Yup.object().shape({
  outOwnerId: Yup.string().required("*Trường bắt buộc"),
  customerOrderId: Yup.string().required("*Trường bắt buộc")
});
const BookingTempo = ({ bookingId, onShowModal, actionName, classes }) => {
  const [isSaveBookingFetching, setIsSaveBookingFetching] = useState(false);
  const [readBookingFetching, setReadBookingFetching] = useState(false);
  const [booking, setBooking] = useState({});

  /**
   * Callback
   */

  const _handleSaveBooking = useCallback(async () => {
    let data = {
      uuid: _.get(booking, "uuid"),
      ownerId: _.get(booking, "outOwnerId"),
      organizationId: _.get(booking, "customerOrderId")
    };
    setIsSaveBookingFetching(true);
    let result = await ServiceBase.requestJson({
      method: "POST",
      url: "/v1/booking/update",
      data: data
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      Ui.showSuccess({ message: "Chuyển Booking thành công." });
    }
    setIsSaveBookingFetching(false);
  }, [booking]);
  //----------------------

  /**
   * Effect
   */
  useEffect(() => {
    if (bookingId) {
      _.delay(async () => {
        setReadBookingFetching(true);
        let result = await ServiceBase.requestJson({
          url: URI.READ_BOOKING,
          method: "POST",
          data: { uuid: bookingId }
        });
        if (result.hasErrors) {
          Ui.showErrors(result.errors);
        } else {
          let rs = result.value.data;
          setBooking(rs);
        }
        setReadBookingFetching(false);
      }, 600);
    } else {
    }
  }, [bookingId]);
  //-------------------------

  return (
    <div className={classes.info}>
      <Formik
        enableReinitialize={true}
        initialValues={booking}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            _handleSaveBooking();
            actions.setSubmitting(false);
          }, 300);
        }}
        validationSchema={bookingSchema}
      >
        {({ values, errors }) => (
          <Form>
            <Spin spinning={readBookingFetching} tip="...Đang lấy dữ liệu">
              <div className="content">
                <Grid container spacing={4}>
                  <Grid item xs={6}>
                    <Grid container spacing={2}>
                      <Grid className="d-flex align-self-center" item xs={2}>
                        <label>
                          Sale xử lý <span className="kt-font-danger">*</span>
                        </label>
                      </Grid>
                      <Grid item xs={10}>
                        <Owner
                          className={classNames({
                            "border-invalid": _.get(errors, "outOwnerId")
                          })}
                          value={
                            _.get(values, "outOwnerId")
                              ? {
                                  key: _.get(values, "outOwnerId"),
                                  label: _.get(values, "outOwnerName")
                                }
                              : undefined
                          }
                          onSelect={owner =>
                            setBooking(prevState => {
                              let nextState = { ...prevState };
                              nextState.outOwnerId = _.get(owner, "key");
                              nextState.outOwnerName = _.get(owner, "label");
                              return nextState;
                            })
                          }
                        />
                      </Grid>
                      <Grid className="d-flex align-self-center" item xs={2}>
                        <label>Code</label>
                      </Grid>
                      <Grid item xs={10}>
                        <Input
                          disabled
                          placeholder="Mã"
                          name="enterpriseCode"
                          value={_.get(values, "enterpriseCode")}
                        />
                      </Grid>
                      <Grid className="d-flex align-self-center" item xs={2}>
                        <label>Tên KH</label>
                      </Grid>
                      <Grid item xs={10}>
                        <Input
                          disabled
                          placeholder="Tên khách hàng"
                          name="enterprise"
                          value={_.get(values, "enterprise")}
                        />
                      </Grid>
                      <Grid className="d-flex align-self-center" item xs={2}>
                        <label>SĐT liên hệ</label>
                      </Grid>
                      <Grid item xs={4}>
                        <Input
                          disabled
                          placeholder="Số điện thoại liên hệ"
                          name="contactPhone"
                          value={_.get(values, "contactPhone")}
                        />
                      </Grid>
                      <Grid className="d-flex align-self-center" item xs={2}>
                        <label>Email liên hệ</label>
                      </Grid>
                      <Grid item xs={4}>
                        <Input
                          disabled
                          placeholder="Email liên hệ"
                          name="contactEmail"
                          value={_.get(values, "contactEmail")}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <Grid container spacing={2}>
                      <Grid className="d-flex align-self-center" item xs={3}>
                        <label>
                          Khách hàng đặt
                          <span className="kt-font-danger">*</span>
                        </label>
                      </Grid>
                      <Grid item xs={9}>
                        <NoTypeBranchCustomer
                          className={classNames({
                            "border-invalid": _.get(errors, "customerOrderId")
                          })}
                          value={
                            _.get(values, "customerOrderId")
                              ? {
                                  key: _.get(values, "customerOrderId"),
                                  label: _.get(values, "customerOrderName")
                                }
                              : undefined
                          }
                          onSelect={selectOrg => {
                            setBooking(prevState => {
                              let nextState = { ...prevState };
                              nextState.customerOrderId = _.get(
                                selectOrg,
                                "key"
                              );
                              nextState.customerOrderName = _.get(
                                selectOrg,
                                "label"
                              );
                              return nextState;
                            });
                          }}
                          mode="single"
                        />
                      </Grid>
                      <Grid className="d-flex align-self-center" item xs={3}>
                        <label>Nguồn đặt</label>
                      </Grid>
                      <Grid item xs={9}>
                        <A
                          target="_blank"
                          href={_.get(values, "sourceUrl")}
                          title={`Đến ${_.get(values, "sourceUrl")}`}
                        >
                          {_.get(values, "source")}
                        </A>
                      </Grid>
                      <Grid className="d-flex align-self-center" item xs={3}>
                        <label>Thông tin Y/C</label>
                      </Grid>
                      <Grid item xs={9}>
                        <Input.TextArea
                          disabled
                          rows={10}
                          placeholder="Yêu cầu đặc biệt"
                          name="note"
                          value={_.get(values, "note")}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </Spin>
            <div className="action">
              <button
                type="submit"
                className={classNames({
                  "btn btn-info btn-icon-sm": true,
                  "kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--danger": isSaveBookingFetching
                })}
              >
                <i className="fa fa-fast-forward" />
                Chuyển
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
const mapStateToProps = createStructuredSelector({
  appConfig: makeSelectAppConfig()
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
        textAlign: "left"
      },
      "& .content": {}
    }
  })
)(BookingTempo);
