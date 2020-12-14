import React from "react";
import { actions as warningAction } from "../../redux/warning/actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import WaringDriverList from "./WaringDriverList";
import WarningVehicleList from "./WarningVehicleList";
import WarningTemList from "./WarningTemList";
import WarningSelect from "../Vehicle/VehicleSelect";
import { Formik } from "formik";
import classNames from "classnames";

const {
  warning_Vehicle_Search,
  warning_driver_Search,
  warning_Tem_Search,
  changeTab,
  onPageChange,
  onPageChangeVehicle,
  onPageChangeTem
} = warningAction;
class WarningManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: []
    };
    this.handleChangeTab = this.handleChangeTab.bind(this);
  }
  componentDidMount() {
    if (localStorage.getItem("AppParam")) {
      let appParam = JSON.parse(localStorage.getItem("AppParam"));
      if (appParam["warning"]) {
      }
    }
    // this.props.warning_Vehicle_Search(initParam);
    this.loadData();
  }
  queryString() {
    const {
      pageSize,
      pages,
      tabId,
      pageSizeVehicle,
      pagesVehicle
    } = this.props.warning;
    if (tabId === "1") {
      return `lastQuery:?take=${pageSize}&skip=${pageSize * pages}`;
    } else if (tabId === "2") {
      return `lastQuery:?take=${pageSizeVehicle}&skip=${pageSizeVehicle *
        pagesVehicle}`;
    }
  }

  loadData() {
    let { tabId } = this.props.warning;
    const queryString = this.queryString();
    if (queryString === this.lastQuery) {
      return;
    }
    if (tabId === "1") {
      this.props.warning_driver_Search("", 5, 0, "1", true);
    } 
    else if (tabId === "2") {
      this.props.warning_Vehicle_Search("", 5, 0, "2", true);
    }
    else if (tabId === "3") {
      this.props.warning_Tem_Search("", 5, 0, "3", true);
    }
    this.lastQuery = queryString;
  }
  changeCurrentPage = (pages, tabId) => {
    this.props.onPageChange(
      "",
      this.props.warning.pageSize,
      pages,
      tabId,
      this.props.warning.query
    );
  };

  changePageSize = (pageSize, tabId) => {
    console.log("tabId", tabId);
    this.props.onPageChange(
      "",
      pageSize,
      this.props.warning.pages,
      tabId,
      this.props.warning.query
    );
  };
  changeCurrentPageVehicle = (pages, tabId) => {
    this.props.onPageChangeVehicle(
      "",
      this.props.warning.pageSize,
      pages,
      tabId,
      this.props.warning.queryVehicle
    );
  };

  changePageSizeVehicle = (pageSize, tabId) => {
    this.props.onPageChangeVehicle(
      "",
      pageSize,
      this.props.warning.pages,
      tabId,
      this.props.warning.queryVehicle
    );
  };
  
  //warning tem
  changeCurrentPageTem = (pages, tabId) => {
    this.props.onPageChangeTem(
      "",
      this.props.warning.pagesTem,
      pages,
      tabId,
      this.props.warning.queryTem
    );
  };

  changePageSizeTem = (pageSize, tabId) => {
    this.props.onPageChangeTem(
      "",
      pageSize,
      this.props.warning.pagesTem,
      tabId,
      this.props.warning.queryTem
    );
  };

  handleChangeTab(tabId) {
    this.props.changeTab(tabId);
  }
  render() {
    const {
      listWarningVehicle,
      listWarningDriver,
      loading,
      total,
      pages,
      query,
      pageSize,
      totalVehicle,
      pagesVehicle,
      queryVehicle,
      pageSizeVehicle,
      tabId,
      listWarningTem,
       totalTem,
      pagesTem,
      queryTem,
      pageSizeTem,
    } = this.props.warning;
    return (
      <div className="row">
        <div className="col">
          <div className="kt-portlet">
            <div className="kt-portlet__body kt-portlet__body--fit">
              <ul
                style={{
                  paddingLeft: 25
                }}
                className="nav nav-tabs  nav-tabs-line nav-tabs-line-primary mb-0"
              >
                <li className="nav-item">
                  <button
                    className={classNames({
                      "nav-link": true,
                      active: tabId === "1"
                    })}
                    data-toggle="tab"
                    onClick={() => this.handleChangeTab("1")}
                    role="tab"
                    aria-selected="true"
                  >
                    Cảnh báo con người
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={classNames({
                      "nav-link": true,
                      active: tabId === "2"
                    })}
                    data-toggle="tab"
                    onClick={() => this.handleChangeTab("2")}
                    role="tab"
                    aria-selected="true"
                  >
                    Cảnh báo xe
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={classNames({
                      "nav-link": true,
                      active: tabId === "3"
                    })}
                    data-toggle="tab"
                    onClick={() => this.handleChangeTab("3")}
                    role="tab"
                    aria-selected="true"
                  >
                    Cảnh báo tem xe
                  </button>
                </li>
              </ul>
              <div className="tab-content">
                <div
                  className={classNames({
                    "tab-pane": true,
                    active: tabId === "1"
                  })}
                >
                  <Formik
                    enableReinitialize={true}
                    initialValues={query}
                    onSubmit={(values, { setSubmitting }) => {
                      setTimeout(() => {
                        let query = { ...values };
                        this.props.warning_driver_Search({ query: query });
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
                          <div className="kt-portlet__head-label"></div>
                          <div className="kt-portlet__head-toolbar">
                            <div className="kt-portlet__head-wrapper">
                              <button
                                onClick={() => {
                                  values.driverId = "";
                                  setSubmitting(true);
                                  handleSubmit();
                                }}
                                className="btn btn-clean btn-icon-sm"
                              >
                                Xóa bộ lọc
                              </button>
                              {/* &nbsp;
                              <button
                                onClick={this.handleViewVehicle}
                                type="button"
                                className="btn btn-brand btn-icon-sm"
                              >
                                <i className="flaticon2-plus" />
                                Thêm xe
                              </button> */}
                            </div>
                          </div>
                        </div>
                        <div className="kt-portlet__body pb-0 pt-0">
                          <div className="row">
                            <div className="col-md-2">
                              <WarningSelect
                                value={
                                  values.driverId
                                    ? {
                                        key: values.driverId
                                          ? values.driverId
                                          : "",
                                        label: values.name ? values.name : ""
                                      }
                                    : undefined
                                }
                                onChange={owner => {
                                  values.driverId =
                                    owner && owner.key ? owner.key : "";
                                  values.nameType = owner.label
                                    ? owner.label
                                    : "";
                                  let query = { ...values };
                                  setFieldValue("driverId", owner.key);
                                  this.props.warning_driver_Search({
                                    query: query
                                  });
                                }}
                                url="autocomplete/driver"
                                placeholder="Lái xe"
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
                  </Formik>
                  <div className="kt-portlet__body">
                    <WaringDriverList
                      dataSource={listWarningDriver}
                      totalLength={total}
                      pageLimit={pageSize}
                      currentPage={pages}
                      loading={loading}
                      deleteVehicle={this.handleDeleteVehicle}
                      onChangeCurrentPage={this.changeCurrentPage}
                      onChangePageSize={this.changePageSize}
                    />
                  </div>
                </div>
              </div>
              <div className="tab-content">
                <div
                  className={classNames({
                    "tab-pane": true,
                    active: tabId === "2"
                  })}
                >
                  <Formik
                    enableReinitialize={true}
                    initialValues={queryVehicle}
                    onSubmit={(values, { setSubmitting }) => {
                      setTimeout(() => {
                        let queryVehicle = { ...values };
                        this.props.warning_Vehicle_Search({
                          queryVehicle: queryVehicle
                        });
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
                          <div className="kt-portlet__head-label"></div>
                          <div className="kt-portlet__head-toolbar">
                            <div className="kt-portlet__head-wrapper">
                              <button
                                onClick={() => {
                                  values.vehicleId = "";

                                  setSubmitting(true);
                                  handleSubmit();
                                }}
                                className="btn btn-clean btn-icon-sm"
                              >
                                Xóa bộ lọc
                              </button>
                              {/* &nbsp;
                              <button
                                onClick={this.handleViewVehicleType}
                                type="button"
                                className="btn btn-brand btn-icon-sm"
                              >
                                <i className="flaticon2-plus" />
                                Thêm loại xe
                              </button> */}
                            </div>
                          </div>
                        </div>
                        <div className="kt-portlet__body pb-0 pt-0">
                          <div className="row">
                            <div className="col-md-2">
                              <WarningSelect
                                value={
                                  values.vehicleId
                                    ? {
                                        key: values.vehicleId
                                          ? values.vehicleId
                                          : "",
                                        label: values.name ? values.name : ""
                                      }
                                    : undefined
                                }
                                onChange={owner => {
                                  values.vehicleId =
                                    owner && owner.key ? owner.key : "";
                                  values.nameType = owner.label
                                    ? owner.label
                                    : "";
                                  let queryVehicle = { ...values };
                                  setFieldValue("vehicleId", owner.key);
                                  this.props.warning_Vehicle_Search({
                                    queryVehicle: queryVehicle
                                  });
                                }}
                                url="autocomplete/vehicle"
                                placeholder="BKS"
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
                  </Formik>
                  <div className="kt-portlet__body">
                    <WarningVehicleList
                      dataSource={listWarningVehicle}
                      onChangeCurrentPage={this.changeCurrentPageVehicle}
                      onChangePageSize={this.changePageSizeVehicle}
                      currentPage={pagesVehicle}
                      pageLimit={pageSizeVehicle}
                      totalLength={totalVehicle}
                      loading={loading}
                    />
                  </div>
                </div>
              </div>
              {/* cảnh báo tem xe */}
              <div className="tab-content">
                <div
                  className={classNames({
                    "tab-pane": true,
                    active: tabId === "3"
                  })}
                >
                  <Formik
                    enableReinitialize={true}
                    initialValues={queryTem}
                    onSubmit={(values, { setSubmitting }) => {
                      setTimeout(() => {
                        let queryTem = { ...values };
                        this.props.warning_Tem_Search({
                          queryTem: queryTem
                        });
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
                          <div className="kt-portlet__head-label"></div>
                          <div className="kt-portlet__head-toolbar">
                            <div className="kt-portlet__head-wrapper">
                              <button
                                onClick={() => {
                                  values.vehicleId = "";

                                  setSubmitting(true);
                                  handleSubmit();
                                }}
                                className="btn btn-clean btn-icon-sm"
                              >
                                Xóa bộ lọc
                              </button>
                              {/* &nbsp;
                              <button
                                onClick={this.handleViewVehicleType}
                                type="button"
                                className="btn btn-brand btn-icon-sm"
                              >
                                <i className="flaticon2-plus" />
                                Thêm loại xe
                              </button> */}
                            </div>
                          </div>
                        </div>
                        <div className="kt-portlet__body pb-0 pt-0">
                          <div className="row">
                            <div className="col-md-2">
                              <WarningSelect
                                value={
                                  values.vehicleId
                                    ? {
                                        key: values.vehicleId
                                          ? values.vehicleId
                                          : "",
                                        label: values.name ? values.name : ""
                                      }
                                    : undefined
                                }
                                onChange={owner => {
                                  values.vehicleId =
                                    owner && owner.key ? owner.key : "";
                                  values.nameType = owner.label
                                    ? owner.label
                                    : "";
                                  let queryTem = { ...values };
                                  setFieldValue("vehicleId", owner.key);
                                  this.props.warning_Tem_Search({
                                    queryTem: queryTem
                                  });
                                }}
                                url="autocomplete/vehicle"
                                type="vehicleTem"
                                placeholder="Xe"
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
                  </Formik>
                  <div className="kt-portlet__body">
                    <WarningTemList
                      dataSource={listWarningTem}
                      onChangeCurrentPage={this.changeCurrentPageTem}
                      onChangePageSize={this.changePageSizeTem}
                      currentPage={pagesTem}
                      pageLimit={pageSizeTem}
                      totalLength={totalTem}
                      loading={loading}
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
    warning: store.warning.toJS()
  };
};
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      warning_Vehicle_Search,
      warning_driver_Search,
      warning_Tem_Search,
      changeTab,
      onPageChange,
      onPageChangeVehicle,
      onPageChangeTem
    },
    dispatch
  );
export default connect(mapStateToProps, mapDispatchToProps)(WarningManagement);
