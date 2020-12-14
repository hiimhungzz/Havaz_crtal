import React from "react";
import { actions as taskScheduleAction } from "../../redux/taskSchedule/actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Globals from "globals.js";
import { DatePicker, Form, Input } from "antd";
import { SelectBaseSon } from "@Components/Utility/common";
import TaskScheduleList from "./TaskScheduleList";
import { Formik } from "formik";
import moment from "moment";
import FilterSelect from "../Vehicle/VehicleSelect";
const { taskSchedule_Search, onPageChange } = taskScheduleAction;
const { MonthPicker } = DatePicker;
class TaskScheduleManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: []
    };
  }
  componentDidMount() {
    let initParam = {};
    if (localStorage.getItem("AppParam")) {
      let appParam = JSON.parse(localStorage.getItem("AppParam"));
      if (appParam["taskSchedule"]) {
        initParam = appParam["taskSchedule"];
      }
    }
    // this.props.taskSchedule_Search(initParam);
    this.loadData();
  }
  queryString() {
    const { pageSize, pages, tabId } = this.props.taskSchedule;
    return `lastQuery:?take=${pageSize}&skip=${pageSize * pages}`;
  }

  loadData() {

    const profile = Globals.currentUser;
    const parentId = profile
      ? {
          key: profile.organizationUuid,
          label: profile.organizationName
        }
      : undefined;
      
    const { tabId } = this.props.taskSchedule;
    const queryString = this.queryString();
    let month = moment().format("MM");
    let year = moment().format("YYYY");
    let query = {
      month: month,
      year: year,
      nameDriver: "",
      phoneDriver: "",
      codeDriver: "",
      date: "",
      categorySurvey: '',
      organizationId: parentId.key,
    };
    this.props.taskSchedule_Search({ query: query }, 5, 0, true, "1", []);
    this.lastQuery = queryString;
  }
  changeCurrentPage = pages => {
    this.props.onPageChange(
      "",
      this.props.taskSchedule.pageSize,
      pages,
      this.props.taskSchedule.query
    );
  };

  changePageSize = pageSize => {
    this.props.onPageChange(
      "",
      pageSize,
      this.props.taskSchedule.pages,
      this.props.taskSchedule.query
    );
  };

  onSearch = (values) => {
    console.log("values", values)
    if (this.routeCodeTimer) {
      clearTimeout(this.routeCodeTimer);
    }
    this.routeCodeTimer = setTimeout(() => {
      this.props.taskSchedule_Search({
        query: values
      });
    }, 800);
  };

  render() {
    const {
      listSchedule,
      listScheduleSuccess,
      loading,
      total,
      pages,
      query,
      pageSize
    } = this.props.taskSchedule;
    return (
      <div className="row">
        <div className="col">
          <div className="kt-portlet">
            <div className="kt-portlet__body kt-portlet__body--fit">
              <div className="tab-content">
                <div>
                  <Formik
                    enableReinitialize={true}
                    initialValues={query}
                    onSubmit={(values, { setSubmitting }) => {
                      console.log("values", values)
                      setTimeout(() => {
                        let query = { 
                          ...values,
                          // categorySurvey: '',
                          // organizationId: parentId.key,
                        };
                        this.props.taskSchedule_Search({ query: query });
                        setSubmitting(false);
                      }, 400);
                    }}
                  >
                    {({
                      values,
                      setFieldValue,
                      // handleBlur,
                      handleSubmit,
                      setSubmitting
                      // isSubmitting,
                      /* and other goodies */
                    }) => (
                      <form
                        onSubmit={e => {
                          e.preventDefault();
                          handleSubmit();
                        }}
                        ref={form => (this.form = form)}
                        style={{ maxHeight: "95%", minHeight: "95%" }}
                        className="kt-form"
                        id="add-route"
                      >
                        <div className="kt-portlet__head kt-portlet__head--lg border-bottom-0">
                          <div className="kt-portlet__head-label">
                            
                          </div>
                          <div>
                          
                            <div className="kt-portlet__head-wrapper">
                              <button
                                onClick={() => {
                                  values.codeDriver = "";
                                  values.nameDriver = "";
                                  setSubmitting(true);
                                  handleSubmit();
                                }}
                                className="btn btn-clean btn-icon-sm"
                              >
                                Xóa bộ lọc
                              </button>
                              &nbsp;
                              {/* <button
                                                                    onClick={this.handleViewDriver}
                                                                    type="button"
                                                                    className="btn btn-brand btn-icon-sm"
                                                                >
                                                                    <i className="flaticon2-plus" />
                                                                    Thêm lái xe
                              </button> */}
                            </div>
                          </div>
                        </div>
                        <div className="kt-portlet__body pb-0 pt-0">
                          <div className="row">
                            <div className="col-md-3">
                              <Input
                                value={values.codeDriver || ""}
                                onChange={e => {
                                  values.codeDriver = e.target.value
                                    ? e.target.value
                                    : "";
                                  let query = { ...values };
                                  setFieldValue(
                                    "codeDriver",
                                    values.codeDriver
                                  );
                                  if (this.routeCodeTimer) {
                                    clearTimeout(this.routeCodeTimer);
                                  }
                                  this.routeCodeTimer = setTimeout(() => {
                                    this.props.taskSchedule_Search({
                                      query: query
                                    });
                                  }, 800);
                                }}
                                placeholder="Mã lái xe"
                              />
                            </div>
                            <div className="col-md-3">
                              <FilterSelect
                                value={
                                  values.nameDriver
                                    ? {
                                        key: values.nameDriver,
                                        label: values.nameDriver
                                      }
                                    : undefined
                                }
                                url="autocomplete/driver"
                                placeholder="Lái xe"
                                name="nameDriver"
                                onChange={e => {
                                  values.nameDriver = e.key ? e.key : "";
                                  setFieldValue(
                                    "nameDriver",
                                    values.nameDriver
                                  );
                                  let query = { ...values };
                                  if (this.routeCodeTimer) {
                                    clearTimeout(this.routeCodeTimer);
                                  }
                                  this.routeCodeTimer = setTimeout(() => {
                                    this.props.taskSchedule_Search({
                                      query: query
                                    });
                                  }, 800);
                                }}
                              />
                            </div>
                            <div className="col-md-3">
                              <MonthPicker
                                format="MM-YYYY"
                                value={
                                  values.date ? moment(values.date) : moment()
                                }
                                onChange={(dateMoment, dateString) => {
                                  values.date = moment(dateMoment).format(
                                    "YYYY-MM"
                                  )
                                    ? moment(dateMoment).format("YYYY-MM")
                                    : "";
                                  values.month = moment(dateMoment).format("MM")
                                    ? moment(dateMoment).format("MM")
                                    : "";
                                  values.year = moment(dateMoment).format(
                                    "YYYY"
                                  )
                                    ? moment(dateMoment).format("YYYY")
                                    : "";
                                  setFieldValue("date", values.date);
                                  setFieldValue("month", values.month);
                                  setFieldValue("year", values.year);

                                  let query = { ...values };
                                  if (this.routeCodeTimer) {
                                    clearTimeout(this.routeCodeTimer);
                                  }
                                  this.routeCodeTimer = setTimeout(() => {
                                    this.props.taskSchedule_Search({
                                      query: query
                                    });
                                  }, 800);
                                }}
                                placeholder="Tháng"
                              />
                            </div>
                            <div className="col-md-3">
                              <SelectBaseSon
                                value={undefined}
                                apiUrl={'autocomplete/category-survey'}
                                onSelect={item => {
                                }}
                                pageLimit={20}
                                placeholder="Nhóm lái xe/tiếp viên"
                              />
                            </div>
                         
                          </div>
                          <div className="row">
                              <div className="col-md-3">
                                <SelectBaseSon
                                  style={{flex: 1}}
                                  value={values.organization ? par}
                                  apiUrl={'autocomplete/org'}
                                  onSelect={item => {
                                    setFieldValue(
                                      "organization",
                                      item,
                                    );
                                 
                                    const query = { 
                                      ...values,
                                      organizationId: item.key,
                                     };
                                     console.log("query", query)
                                    this.onSearch(query)
                                  }}
                                  pageLimit={20}
                                  placeholder="Đơn vị quản lý"
                                />
                              </div>
                            </div>
                        </div>
                      </form>
                    )}
                  </Formik>
                  <div className="kt-portlet__body">
                    <TaskScheduleList
                      dataSource={listSchedule}
                      listScheduleSuccess={listScheduleSuccess}
                      currentPage={pages}
                      pageLimit={pageSize}
                      loading={loading}
                      totalLength={total}
                      onChangeCurrentPage={this.changeCurrentPage}
                      onChangePageSize={this.changePageSize}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = store => {
  return {
    taskSchedule: store.taskSchedule.toJS()
  };
};
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      taskSchedule_Search,
      onPageChange
    },
    dispatch
  );
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskScheduleManagement);
