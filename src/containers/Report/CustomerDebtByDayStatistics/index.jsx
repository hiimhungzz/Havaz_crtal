import React, { Component } from "react";
import { DatePicker, notification, Select } from "antd";
import { Formik } from "formik";
import moment from "moment";
import classNames from "classnames";
import { actions as ReportActions } from "../../../redux/report/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  BookingSelect,
  CustomerCodeSelect,
  DriverSelect,
  UserCodeSelect,
  VehicleSelect
} from "../../../components/Utility/common";
import CustomerDebtByDayStatisticsList from "./CustomerDebtByDayStatisticsList";
import { Ui } from "@Helpers/Ui";
const { RangePicker } = DatePicker;
const { reportDownload, reportView } = ReportActions;
class CustomerDebtByDayStatistics extends Component {
  render() {
    const { reportDownload, reportView, Report } = this.props;
    const { customerDebtByDayStatistics } = Report;
    const {
      pages,
      pageSize,
      totalLength,
      viewLoading,
      downloadLoading,
      param
    } = customerDebtByDayStatistics;
    return (
      <div className="row">
        <div className="col-lg-12">
          <div className="kt-portlet kt-portlet--mobile">
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
                  if (
                    values.dateType &&
                    values.dateType !== "all" &&
                    !values.startDate
                  ) {
                    Ui.showWarning({ message: "Chưa chọn khoảng ngày." });
                    return;
                  }
                  if (param.result === "view") {
                    reportView(param, "Công nợ theo ngày", 2);
                  } else {
                    reportDownload(param, "Công nợ theo ngày", 2);
                    setSubmitting(false);
                  }
                  setSubmitting(false);
                }, 400);
              }}
            >
              {({
                values,
                setFieldValue,
                // handleBlur,
                handleSubmit,
                setSubmitting // isSubmitting,
                /* and other goodies */
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
                              "kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--warning disabled": viewLoading
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
                              "kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--warning disabled": downloadLoading
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
                      
                    </form>
                  </>
                );
              }}
            </Formik>
            <div className="kt-portlet__body pt-1">
              <CustomerDebtByDayStatisticsList
                dataSource={customerDebtByDayStatistics.rows}
                pageLimit={pageSize}
                onChangeCurrentPage={currentPage => {
                  reportView(
                    { ...param, pages: currentPage },
                    "Công nợ theo ngày",
                    2
                  );
                }}
                onChangePageSize={pageSize => {
                  reportView(
                    { ...param, pageSize: pageSize },
                    "Công nợ theo ngày",
                    2
                  );
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

CustomerDebtByDayStatistics.propTypes = {};
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
)(CustomerDebtByDayStatistics);
