import React, { Component } from "react";
import {
  DatePicker,
  Select} from "antd";
import { Formik } from "formik";
import moment from "moment";
import classNames from "classnames";
import { actions as ReportActions } from "../../../redux/report/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  BookingSelect,
  CustomerCodeSelect,
  UserCodeSelect,
  VehicleSelect
} from "../../../components/Utility/common";
import CustomerDebtByMonthStatisticsList from "./CustomerDebtByMonthStatisticsList";
const { RangePicker } = DatePicker;
const { reportDownload, reportView} = ReportActions;

class CustomerDebtByMonthStatistics extends Component {
  render() {
    const { reportDownload, reportView, Report} = this.props;
    const { customerDebtByMonthStatistics } = Report;
    const { pages, pageSize,totalLength ,viewLoading,downloadLoading,rows,param} = customerDebtByMonthStatistics;
    return (
      <div className="row">
        <div className="col-lg-12">
          <div className="kt-portlet">
            <Formik
              enableReinitialize={true}
              initialValues={param}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  let param = {
                    pages,
                    pageSize,
                    ...values
                  };
                  if (param.result === "view") {
                    reportView(param, "Công nợ theo tháng", 3);
                  } else {
                    reportDownload(param, "Công nợ theo tháng", 3);
                    setSubmitting(false);
                  }
                  setSubmitting(false);
                }, 400);
              }}
            >
              {({
                values,
                setFieldValue,
                handleSubmit,
                setSubmitting
              }) => {
                return (
                  <>
                    <div class="kt-portlet__head">
                      <div class="kt-portlet__head-label"></div>
                      <div class="kt-portlet__head-toolbar">
                        <div class="kt-portlet__head-actions">
                          <button
                            type="button"
                            onClick={() => {
                              setSubmitting(true);
                              values.result = "view";
                              handleSubmit();
                            }}
                            className={classNames({
                              "btn btn-success btn-icon-sm": true,
                              "kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--warning disable": viewLoading
                            })}
                          >
                            Xem báo cáo
                          </button>
                          &nbsp;
                          <button
                            type="button"
                            onClick={() => {
                              setSubmitting(true);
                              values.result = "excel";
                              handleSubmit();
                            }}
                            className={classNames({
                              "btn btn-danger btn-icon-sm": true,
                              "kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--warning disabled":downloadLoading
                            })}
                          >
                            Xuất báo cáo
                          </button>
                        </div>
                      </div>
                    </div>
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                      }}
                      className="kt-form kt-form--label-right"
                    >
                      <div className="kt-portlet__body">
                        <div className="form-group row">
                          <div className="col-md-4">
                            <label htmlFor="">Nhóm theo</label>
                            <div className="input-group">
                              <Select
                                showArrow
                                value={values.VATType || false}
                                onSelect={e => {
                                  setFieldValue("VATType", e);
                                }}
                                placeholder="Loại"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                  option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                              >
                                <Select.Option value={0}>
                                  Tất cả
                                </Select.Option>
                                <Select.Option value={2}>
                                  CÓ VAT
                                </Select.Option>
                                <Select.Option value={1}>
                                  Không VAT
                                </Select.Option>
                              </Select>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <label htmlFor="">Chọn</label>
                            <div className="input-group">
                              <RangePicker
                                value={[
                                  !moment.isMoment(values.startDate)
                                    ? values.startDate
                                      ? moment(values.startDate).clone()
                                      : null
                                    : values.startDate,
                                  !moment.isMoment(values.endDate)
                                    ? values.endDate
                                      ? moment(values.endDate).clone()
                                      : null
                                    : values.endDate
                                ]}
                                onChange={dates => {
                                  setFieldValue(
                                    "startDate",
                                    dates[0].startOf("day")
                                  );
                                  setFieldValue(
                                    "endDate",
                                    dates[1].endOf("day")
                                  );
                                }}
                                ranges={{
                                  "Hôm nay": [moment(), moment()],
                                  "Tuần hiện tại": [
                                    moment().startOf("week"),
                                    moment().endOf("week")
                                  ],
                                  "Tháng hiện tại": [
                                    moment().startOf("month"),
                                    moment().endOf("month")
                                  ],
                                  "Tuần trước": [
                                    moment()
                                      .add(-1, "weeks")
                                      .startOf("week"),
                                    moment()
                                      .add(-1, "weeks")
                                      .endOf("week")
                                  ],
                                  "Tháng trước": [
                                    moment()
                                      .add(-1, "months")
                                      .startOf("month"),
                                    moment()
                                      .add(-1, "months")
                                      .endOf("month")
                                  ],
                                  "Tuần sau": [
                                    moment()
                                      .add(1, "weeks")
                                      .startOf("week"),
                                    moment()
                                      .add(1, "weeks")
                                      .endOf("week")
                                  ],
                                  "Tháng sau": [
                                    moment()
                                      .add(1, "months")
                                      .startOf("month"),
                                    moment()
                                      .add(1, "months")
                                      .endOf("month")
                                  ]
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <label htmlFor="">Mã khách hàng</label>
                            <div className="input-group">
                              <CustomerCodeSelect
                                value={values.customerCodes}
                                onSelect={(customer) => {
                                  setFieldValue("customerCodes", customer);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-md-4">
                            <label htmlFor="">Mã booking</label>
                            <div className="input-group">
                              <BookingSelect
                                value={values.bookingsCodes}
                                onSelect={(booking) => {
                                  setFieldValue("bookingsCodes", booking);
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <label htmlFor="">Mã nhân viên</label>
                            <div className="input-group">
                              <UserCodeSelect
                                value={values.salesCodes}
                                onSelect={(user) => {
                                  setFieldValue("salesCodes", user);
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <label htmlFor="">Biển số</label>
                            <div className="input-group">
                              <VehicleSelect
                                value={values.licensePlates}
                                onSelect={(vehicle) => {
                                  setFieldValue("licensePlates", vehicle);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </>
                );
              }}
            </Formik>
            <div className="kt-portlet__body pt-1">
              <CustomerDebtByMonthStatisticsList
                dataSource={rows}
                pageLimit={pageSize}
                onChangeCurrentPage={currentPage => {
                  reportView(
                    { ...param, pages: currentPage },
                    "Công nợ theo tháng", 3);
                }}
                onChangePageSize={pageSize => {
                  reportView(
                    { ...param, pageSize: pageSize },
                    "Công nợ theo tháng", 3);
                }}
                totalLength={totalLength}
                currentPage={pages}
                loading={viewLoading}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CustomerDebtByMonthStatistics.propTypes = {};
const mapStateToProps = store => {
  return {
    Report: store.Report.toJS()
  };
};
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      reportDownload,
      reportView
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerDebtByMonthStatistics);