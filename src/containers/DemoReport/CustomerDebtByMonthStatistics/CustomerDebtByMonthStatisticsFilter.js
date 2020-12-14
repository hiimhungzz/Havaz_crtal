import React, { memo } from "react";
import { DatePicker, Select } from "antd";
import { API_URI } from "@Constants";
import { CustomerSelect, SelectBaseSon } from "@Components/Utility/common";
import moment from "moment";
import classNames from "classnames";

const { RangePicker } = DatePicker;

const CustomerDebtByMonthStatisticsFilter = memo(
  ({values, browseCommand, setParams, exportExcel}) => {
    return (
      <div>
        <div className="kt-portlet__head">
          <div className="kt-portlet__head-label"></div>
          <div className="kt-portlet__head-toolbar">
            <div className="kt-portlet__head-actions">
              <button
                type="button"
                onClick={e => {
                  browseCommand();
                }}
                className={classNames({
                  "btn btn-success btn-icon-sm": true,
                })}
              >
                Xem báo cáo
              </button>
              &nbsp;
              <button
                type="button"
                onClick={e => {
                  exportExcel()
                }}
                className={classNames({
                  "btn btn-danger btn-icon-sm": true,
                })}
              >
                Xuất báo cáo
              </button>
            </div>
          </div>
        </div>

        <div className="kt-portlet__body">
          <div className="form-group row">
            <div className="col-md-3">
              <label htmlFor="">Nhóm theo</label>
              <div className="input-group">
                <Select
                  style={{flex: 1}}
                  showArrow
                  value={values.VATType}
                  onSelect={e => {
                    setParams(prevState=>{
                      let nextState= {...prevState};
                        nextState.VATType = e;
                        return nextState;
                      })
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
                    setParams(prevState=>{
                      let nextState= {...prevState};
                      nextState.startDate = dates.length > 0 ? moment(dates[0].startOf("day")).format('YYYY-MM-DD') : undefined;
                      nextState.endDate = dates.length > 0 ? moment(dates[1].endOf("day")).format('YYYY-MM-DD') : undefined;
                        return nextState;
                      })
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
                  format={'DD-MM-YYYY'}
                />
              </div>
            </div>
            <div className="col-md-3">
              <label htmlFor="">Mã khách hàng</label>
              <div className="input-group">
                <SelectBaseSon
                  value={values.customerCode}
                  onSelect={(item) => {
                    setParams(prevState=>{
                      let nextState= {...prevState};
                        nextState.customerCode = item;
                        return nextState;
                      })
                  }}
                  apiUrl={API_URI.GET_CODE_CUSTOMER}
                  pageLimit={20}
                  placeholder="Mã khách hàng"
                />
              </div>
            </div>
            <div className="col-md-3">
              <label htmlFor="">Code đoàn</label>
              <div className="input-group">
                <SelectBaseSon
                  value={values.bookingsCode}
                  onSelect={(item) => {
                    setParams(prevState=>{
                      let nextState= {...prevState};
                        nextState.bookingsCode = item;
                        return nextState;
                      })
                  }}
                  apiUrl={API_URI.GET_CODE_DOAN}
                  pageLimit={20}
                  placeholder="Code đoàn"
                />
              </div>
            </div>
          </div>
          <div className="form-group row">
            {/* <div className="col-md-3">
              <label htmlFor="">Mã nhân viên</label>
              <div className="input-group">
                <SelectBaseSon
                  value={values.salesCode}
                  onSelect={(user) => {
                    setParams(prevState=>{
                      let nextState= {...prevState};
                        nextState.salesCode = user;
                        return nextState;
                      })
                  }}
                  apiUrl={API_URI.GET_CODE_STAFF}
                  pageLimit={20}
                  placeholder="Mã nhân viên"
                />
              </div>
            </div> */}
            {/* <div className="col-md-3">
              <label htmlFor="">Biển kiểm soát</label>
              <div className="input-group">
                <SelectBaseSon
                  value={values.licensePlate}
                  onSelect={(item) => {
                    setParams(prevState=>{
                      let nextState= {...prevState};
                        nextState.licensePlate = item;
                        return nextState;
                      })
                  }}
                  apiUrl={API_URI.GET_BKS}
                  pageLimit={20}
                  placeholder="Biển kiểm soát"
                />
              </div>
            </div> */}
            <div className="col-md-6">
              <label htmlFor="">Đơn vị quản lý</label>
              <div className="input-group">
                <CustomerSelect
                  value={values.organizations}
                  url={API_URI.GET_LIST_COMPANY_FOR_ENTERPRISE}
                  placeholder="Đơn vị quản lý"
                  onSelect={(customer, data) => {
                    setParams(prevState=>{
                      let nextState= {...prevState};
                        nextState.organizations = customer;
                        return nextState;
                      })
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

export default CustomerDebtByMonthStatisticsFilter;
