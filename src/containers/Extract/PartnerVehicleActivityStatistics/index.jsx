import React, { Component } from "react";
import { DatePicker, Select } from "antd";
import { Formik } from "formik";
import moment from "moment";
import { actions as ExtractActions } from "../../../redux/extract/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  BookingSelect,
  CustomerCodeSelect,
  DriverSelect,
  UserCodeSelect,
  VehicleSelect
} from "../../../components/Utility/common";
const { RangePicker } = DatePicker;
const { reportDownload, reportView } = ExtractActions;
class PartnerVehicleActivityStatistics extends Component {
  render() {
    const { reportDownload, reportView } = this.props;
    return (
      <div className="row">
        <div className="col-lg-12">
          <div className="kt-portlet">
            <Formik
              enableReinitialize={true}
              initialValues={{
                dateType: "all",
                resultType: "download",
                startDate: null,
                endDate: null,
                bookingCodes: undefined,
                salesCodes: undefined,
                customerCodes: undefined
              }}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  let query = {
                    startDate: moment(),
                    endDate: moment(),
                    resultType: "download",
                    dateType: "all",
                    customerCode: "",
                    bookingsCode: "",
                    salesCode: ""
                  };
                  query["customerCode"] = values.customerCodes
                    ? values.customerCodes.key
                    : "";
                  query["bookingsCode"] = values.bookingsCodes
                    ? values.bookingsCodes.label
                    : "";
                  query["salesCode"] = values.salesCodes
                    ? values.salesCodes.key
                    : "";
                  query["resultType"] = values.resultType
                    ? values.resultType
                    : "download";
                  query["dateType"] = values.dateType ? values.dateType : "all";
                  query["startDate"] = values.startDate
                    ? values.startDate
                    : null;
                  query["endDate"] = values.endDate ? values.endDate : null;
                  // bookingSearch({searchInput: '', query});
                  if (query.resultType === "view") {
                    reportView(query, "Báo cáo hoạt động xe của CTV", 5);
                  } else {
                    reportDownload(query, "Báo cáo hoạt động xe của CTV", 5);
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
                          {/* <button
                            type="button"
                            onClick={() => {
                              setSubmitting(true);
                              values.resultType = "view";
                              handleSubmit();
                            }}
                            className="btn btn-brand"
                          >
                            Xem báo cáo
                          </button> */}
                          &nbsp;
                          <button
                            type="button"
                            onClick={() => {
                              setSubmitting(true);
                              values.resultType = "download";
                              handleSubmit();
                            }}
                            className="btn btn-google"
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
                          <div className="col-md-3">
                            <label htmlFor="">Nhóm theo</label>
                            <div className="input-group">
                              <Select
                                showArrow
                                value={values.dateType || undefined}
                                onSelect={e => {
                                  setFieldValue("dateType", e);
                                }}
                                placeholder="Loại booking"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                  option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                              >
                                <Select.Option value="all">
                                  Tất cả
                                </Select.Option>
                                <Select.Option value="dateDeparture">
                                  Cập nhật Booking ngày thực hiện
                                </Select.Option>
                                <Select.Option value="dateIn">
                                  Cập nhật Booking Ngày IN
                                </Select.Option>
                                <Select.Option value="dateOut">
                                  Cập nhạt Booking Ngày Out
                                </Select.Option>
                              </Select>
                            </div>
                          </div>
                          <div className="col-md-3">
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
                          <div className="col-md-3">
                            <label htmlFor="">Mã booking</label>
                            <div className="input-group">
                              <BookingSelect
                                value={values.bookingsCodes}
                                onSelect={booking => {
                                  setFieldValue("bookingsCodes", booking);
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <label htmlFor="">Mã nhân viên</label>
                            <div className="input-group">
                              <UserCodeSelect
                                value={values.salesCodes}
                                onSelect={(user, data) => {
                                  setFieldValue("salesCodes", user);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-md-3">
                            <label htmlFor="">Mã khách hàng</label>
                            <div className="input-group">
                              <CustomerCodeSelect
                                value={values.customerCodes}
                                onSelect={(customer, data) => {
                                  setFieldValue("customerCodes", customer);
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <label htmlFor="">Lái xe</label>
                            <div className="input-group">
                              <DriverSelect
                                value={values.driverNames}
                                onSelect={(driver, data) => {
                                  setFieldValue("driverNames", driver);
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <label htmlFor="">Biển số</label>
                            <div className="input-group">
                              <VehicleSelect
                                value={values.queryVehiclesPlates}
                                onSelect={vehicle => {
                                  setFieldValue("queryVehiclesPlates", vehicle);
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
            {/* <div className="kt-portlet__body pt-1">
              <PartnerVehicleActivityStatisticsList
                dataSource={listPartnerVehicle}
                loading={false}
              />
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}

PartnerVehicleActivityStatistics.propTypes = {};
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
)(PartnerVehicleActivityStatistics);
