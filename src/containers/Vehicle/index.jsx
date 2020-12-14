import React from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Tabs,
  Upload,
  DatePicker,
  Drawer,
} from "antd";
import Globals from "globals.js";
import moment from "moment";
import { VehicleList } from "./VehicleList";
import VehicleModal from "../../components/Modals/vehicle/VehicleModal";
import VehicleTemModel from "../../components/Modals/vehicle/VehicleTemModel";
import VehicleTypeModel from "../../components/Modals/vehicle/VehicleTypeModel";
import VehicleClassModel from "../../components/Modals/vehicle/VehicleClassModel";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { actions as driverAction } from "../../redux/driver/actions";
import { actions as vehicleAction } from "../../redux/vehicle/actions";
import VehicleTypeList from "./VehicleTypeList";
import VehicleTemList from "./VehicleTemList";
import VehicleClassList from "./VehicleClassList";
// import { VehicleUploadWrapped } from "./VehicleUpload";
import { actions as parterAction } from "../../redux/partner/actions";
import _ from "lodash";
import classNames from "classnames";
import { Formik } from "formik";
import VehicleSelect from "./VehicleSelect";
const { driverSearch } = driverAction;
const {
  vehicleSearch,
  vehicleTypeSearch,
  showModal,
  onPageChange,
  changeTab,
  vehicleShowModal,
  vehicleCreate,
  vehicleSave,
  vehicleDelte,
  vehicleTypeShowModal,
  vehicleCreateType,
  vehicleTypeSave,
  vehicleTypeDelete,
  onPageChangeType,
  vehicleTemSearch,
  vehicleTemShowModal,
  vehicleCreateTem,
  vehicleSaveTem,
  vehicleTemDelete,
  onPageChangeTem,
  vehicleFillTem,
  vehicleClassSearch,
  vehicleClassShowModal,
  vehicleCreateClass,
  vehicleSaveClass,
  vehicleClassDelete,
  onPageChangeClass,
} = vehicleAction;
const { organizationPartnerSearch } = parterAction;
const Option = Select.Option;
const { RangePicker } = DatePicker;
class VehicleManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selection: [],
      listVehicle: [],
      listVehicleType: [],
      paging: {
        pageLimit: 5,
        pages: 0,
        orderBy: {
          name: 1,
        },
        searchInput: "",
      },
      rowData: {},
      isopen: false,
    };
    this.onSelectChange = this.onSelectChange.bind(this);
    this.changeSelection = this.changeSelection.bind(this);
    this.handleShowAddNewVehicleModal = this.handleShowAddNewVehicleModal.bind(
      this
    );
    this.handleHideAddNewVehicleModal = this.handleHideAddNewVehicleModal.bind(
      this
    );
    this.handleViewVehicleType = this.handleViewVehicleType.bind(this);
    this.handleEditVehicleType = this.handleEditVehicleType.bind(this);
    this.handleViewVehicle = this.handleViewVehicle.bind(this);
    this.handleSaveVehicle = this.handleSaveVehicle.bind(this);
    this.showDrawer = this.showDrawer.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onCloseType = this.onCloseType.bind(this);
    this.handleEditVehicle = this.handleEditVehicle.bind(this);
    this.handleDeleteVehicle = this.handleDeleteVehicle.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleCloseUpload = this.handleCloseUpload.bind(this);
    this.handleCreateVehicle = this.handleCreateVehicle.bind(this);
    this.handleCreateVehicleType = this.handleCreateVehicleType.bind(this);
    this.handleSaveVehicleType = this.handleSaveVehicleType.bind(this);
    this.handleDeleteVehicleType = this.handleDeleteVehicleType.bind(this);
    this.changeCurrentPageType = this.changeCurrentPageType.bind(this);
    this.changePageSizeType = this.changePageSizeType.bind(this);
    this.changePageSizeTem = this.changePageSizeTem.bind(this);
    this.changeCurrentPageTem = this.changeCurrentPageTem.bind(this);
    this.handleViewVehicleClass = this.handleViewVehicleClass.bind(this);
    this.changeCurrentPageClass = this.changeCurrentPageClass.bind(this);
    this.changePageSizeClass = this.changePageSizeClass.bind(this);
  }

  componentDidMount() {
    const { tabId } = this.props.Vehicle;
    if (tabId === "1") {
      let initParam = {};
      if (localStorage.getItem("AppParam")) {
        let appParam = JSON.parse(localStorage.getItem("AppParam"));
        if (appParam["Vehicle"]) {
          initParam = appParam["Vehicle"];
        }
      }
      this.props.vehicleSearch(initParam);
    } else {
      let initParamType = {};
      if (localStorage.getItem("AppParam")) {
        let appParamType = JSON.parse(localStorage.getItem("AppParam"));
        if (appParamType["Vehicle"]) {
          initParamType = appParamType["Vehicle"];
        }
      }
      this.props.vehicleTypeSearch(initParamType);
    }

    this.loadData();
  }
  queryString() {
    const {
      pageSize,
      pages,
      tabId,
      pageSizeType,
      pagesType,
      pagesTem,
      pageSizeTem,
      pagesClass,
      pageSizeClass,
    } = this.props.Vehicle;
    if (tabId === "1") {
      return `lastQuery:?take=${pageSize}&skip=${pageSize * pages}`;
    } else if (tabId === "2") {
      return `lastQuery:?take=${pageSizeType}&skip=${pageSizeType * pagesType}`;
    } else if (tabId === "3") {
      return `lastQuery:?take=${pageSizeTem}&skip=${pageSizeTem * pagesTem}`;
    } else if (tabId === "4") {
      return `lastQuery:?take=${pageSizeClass}&skip=${
        pageSizeClass * pagesClass
      }`;
    }
  }

  loadData() {
    let { tabId } = this.props.Vehicle;
    const queryString = this.queryString();
    if (queryString === this.lastQuery) {
      return;
    }
    if (tabId === "1") {
      this.props.vehicleSearch("", "", 5, 0, "1", true);
    } else if (tabId === "2") {
      this.props.vehicleTypeSearch("", "", 5, 0, "2", true);
    } else if (tabId === "3") {
      this.props.vehicleTemSearch("", 5, 0, "3", true);
    } else if (tabId === "4") {
      this.props.vehicleClassSearch("", 5, 0, "4", true);
    }
    this.lastQuery = queryString;
  }

  render() {
    const {
      loading,
      isShowVehicle,
      isShowVehicleType,
      isShowVehicleTem,
      actionName,
      rowData,
      totalType,
      total,
      pagesType,
      pages,
      pageSizeType,
      pageSize,
      tabId,
      listVehicle,
      listVehicleType,
      query,
      queryType,
      length,
      dataCheckName,
      rowDataCheck,
      listVehicleTem,
      queryTem,
      pageSizeTem,
      pagesTem,
      totalTem,
      listVehicleFillTem,
      listVehicleClass,
      queryClass,
      pageSizeClass,
      pagesClass,
      totalClass,
      listVehicleClassSuccess,
      isShowVehicleClass,
    } = this.props.Vehicle;
    const profile = Globals.currentUser;
    const parentId = profile
      ? {
          key: profile.organizationUuid,
          label: profile.organizationName,
        }
      : undefined;
    const { isopen } = this.state;
    return (
      <div className="row">
        <div className="col">
          <div className="kt-portlet">
            <div className="kt-portlet__body kt-portlet__body--fit">
              <ul
                style={{
                  paddingLeft: 25,
                }}
                className="nav nav-tabs  nav-tabs-line nav-tabs-line-primary mb-0"
              >
                <li className="nav-item">
                  <button
                    className={classNames({
                      "nav-link": true,
                      active: tabId === "1",
                    })}
                    data-toggle="tab"
                    onClick={() => this.handleChangeTab("1")}
                    role="tab"
                    aria-selected="true"
                  >
                    DANH SÁCH PHƯƠNG TIỆN
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={classNames({
                      "nav-link": true,
                      active: tabId === "2",
                    })}
                    data-toggle="tab"
                    onClick={() => this.handleChangeTab("2")}
                    role="tab"
                    aria-selected="true"
                  >
                    LOẠI XE
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={classNames({
                      "nav-link": true,
                      active: tabId === "3",
                    })}
                    data-toggle="tab"
                    onClick={() => this.handleChangeTab("3")}
                    role="tab"
                    aria-selected="true"
                  >
                    TEM XE
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={classNames({
                      "nav-link": true,
                      active: tabId === "4",
                    })}
                    data-toggle="tab"
                    onClick={() => this.handleChangeTab("4")}
                    role="tab"
                    aria-selected="true"
                  >
                    HẠNG XE
                  </button>
                </li>
              </ul>
              <div className="tab-content">
                <div
                  className={classNames({
                    "tab-pane": true,
                    active: tabId === "1",
                  })}
                >
                  <Formik
                    enableReinitialize={true}
                    initialValues={query}
                    onSubmit={(values, { setSubmitting }) => {
                      setTimeout(() => {
                        let query = { ...values };
                        this.props.vehicleSearch({ query: query });
                        setSubmitting(false);
                      }, 400);
                    }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      setFieldValue,
                      // handleBlur,
                      handleSubmit,
                      setSubmitting,
                      // isSubmitting,
                      /* and other goodies */
                    }) => (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSubmit();
                        }}
                        ref={(form) => (this.form = form)}
                        style={{ maxHeight: "95%", minHeight: "95%" }}
                        className="kt-form"
                        id="add-route"
                      >
                        <div className="kt-portlet__head kt-portlet__head--lg border-bottom-0">
                          <div className="kt-portlet__head-label"></div>
                          <div className="kt-portlet__head-toolbar">
                            <div className="kt-portlet__head-wrapper">
                              <button
                                onClick={(e) => {
                                  values.code = "";
                                  values.vehicleType = "";
                                  values.seats = "";
                                  values.chassisNo = "";
                                  values.manufactureYear = "";
                                  values.plate = "";
                                  values.engineNo = "";
                                  setSubmitting(true);
                                  handleSubmit();
                                }}
                                className="btn btn-clean btn-icon-sm"
                              >
                                Xóa bộ lọc
                              </button>
                              &nbsp;
                              <button
                                onClick={this.handleViewVehicle}
                                type="button"
                                className="btn btn-brand btn-icon-sm"
                              >
                                <i className="flaticon2-plus" />
                                Thêm xe
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="kt-portlet__body pb-0 pt-0">
                          <div className="row">
                            <div className="col-md-2">
                              <Input
                                value={values.code || ""}
                                onChange={(e) => {
                                  values.code = e.target.value
                                    ? e.target.value
                                    : "";
                                  let query = { ...values };
                                  setFieldValue("code", values.code);
                                  if (this.routeCodeTimer) {
                                    clearTimeout(this.routeCodeTimer);
                                  }
                                  this.routeCodeTimer = setTimeout((e) => {
                                    this.props.vehicleSearch({ query: query });
                                  }, 800);
                                }}
                                placeholder="Mã xe"
                              />
                            </div>
                            <div className="col-md-2">
                              <VehicleSelect
                                value={
                                  values.vehicleType
                                    ? {
                                        key: values.vehicleType
                                          ? values.vehicleType
                                          : "",
                                        label: values.name
                                          ? values.name
                                          : undefined,
                                      }
                                    : undefined
                                }
                                onChange={(owner) => {
                                  values.vehicleType = owner ? owner.key : "";
                                  values.name = owner ? owner.label : "";
                                  let ownerKey = owner ? owner.key : "";
                                  let query = { ...values };
                                  setFieldValue("vehicleType", ownerKey);
                                  this.props.vehicleSearch({ query: query });
                                }}
                                url="vehicle-type/all"
                                placeholder="Loại xe"
                              />
                            </div>
                            <div className="col-md-2">
                              <Input
                                value={values.chassisNo || ""}
                                onChange={(e) => {
                                  values.chassisNo = e.target.value
                                    ? e.target.value
                                    : "";
                                  let query = { ...values };
                                  setFieldValue("chassisNo", values.chassisNo);
                                  if (this.routeCodeTimer) {
                                    clearTimeout(this.routeCodeTimer);
                                  }
                                  this.routeCodeTimer = setTimeout((e) => {
                                    this.props.vehicleSearch({ query: query });
                                  }, 800);
                                }}
                                placeholder="Số khung"
                              />
                            </div>
                            <div className="col-md-2">
                              <Input
                                value={values.engineNo || ""}
                                onChange={(e) => {
                                  values.engineNo = e.target.value
                                    ? e.target.value
                                    : "";
                                  let query = { ...values };
                                  setFieldValue("engineNo", values.engineNo);
                                  if (this.routeCodeTimer) {
                                    clearTimeout(this.routeCodeTimer);
                                  }
                                  this.routeCodeTimer = setTimeout((e) => {
                                    this.props.vehicleSearch({ query: query });
                                  }, 800);
                                }}
                                placeholder="Số máy"
                              />
                            </div>
                            <div className="col-md-2">
                              <DatePicker
                                value={
                                  values.manufactureYear
                                    ? moment(values.manufactureYear)
                                    : null
                                }
                                onChange={(e) => {
                                  values.manufactureYear = moment(e).format(
                                    "YYYY"
                                  )
                                    ? moment(e).format("YYYY")
                                    : "";
                                  let query = { ...values };
                                  setFieldValue(
                                    "manufactureYear",
                                    moment(e).format("YYYY")
                                  );
                                  this.props.vehicleSearch({ query: query });
                                }}
                                format="YYYY"
                                mode="year"
                                open={isopen}
                                onPanelChange={(e) => {
                                  this.setState({
                                    isopen: false,
                                  });
                                  values.manufactureYear = moment(e).format(
                                    "YYYY"
                                  )
                                    ? moment(e).format("YYYY")
                                    : "";
                                  let query = { ...values };
                                  setFieldValue(
                                    "manufactureYear",
                                    moment(e).format("YYYY")
                                  );
                                  this.props.vehicleSearch({ query: query });
                                }}
                                onOpenChange={(status) => {
                                  this.setState({ isopen: !!status });
                                }}
                                placeholder="Năm sản xuất"
                              />
                            </div>
                            <div className="col-md-2">
                              <Input
                                value={values.plate || ""}
                                onChange={(e) => {
                                  values.plate = e.target.value
                                    ? e.target.value
                                    : "";
                                  let query = { ...values };
                                  setFieldValue("plate", values.plate);
                                  if (this.routeCodeTimer) {
                                    clearTimeout(this.routeCodeTimer);
                                  }
                                  this.routeCodeTimer = setTimeout((e) => {
                                    this.props.vehicleSearch({ query: query });
                                  }, 800);
                                }}
                                placeholder="Biển số xe"
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
                  </Formik>
                  <div className="kt-portlet__body">
                    <VehicleList
                      dataSource={listVehicle}
                      totalLength={total}
                      pageLimit={pageSize}
                      currentPage={pages}
                      loading={loading}
                      handleViewVehicle={this.handleViewVehicle}
                      handleEditVehicle={this.handleEditVehicle}
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
                    active: tabId === "2",
                  })}
                >
                  <Formik
                    enableReinitialize={true}
                    initialValues={queryType}
                    onSubmit={(values, { setSubmitting }) => {
                      setTimeout(() => {
                        let queryType = { ...values };
                        this.props.vehicleTypeSearch({ queryType: queryType });
                        setSubmitting(false);
                      }, 400);
                    }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      setFieldValue,
                      // handleBlur,
                      handleSubmit,
                      setSubmitting,
                      // isSubmitting,
                      /* and other goodies */
                    }) => (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSubmit();
                        }}
                        ref={(form) => (this.form = form)}
                        style={{ maxHeight: "95%", minHeight: "95%" }}
                        className="kt-form"
                        id="add-route"
                      >
                        <div className="kt-portlet__head kt-portlet__head--lg border-bottom-0">
                          <div className="kt-portlet__head-label"></div>
                          <div className="kt-portlet__head-toolbar">
                            <div className="kt-portlet__head-wrapper">
                              <button
                                onClick={(e) => {
                                  values.type = "";
                                  values.seats = "";
                                  values.name = "";
                                  setSubmitting(true);
                                  handleSubmit();
                                }}
                                className="btn btn-clean btn-icon-sm"
                              >
                                Xóa bộ lọc
                              </button>
                              &nbsp;
                              <button
                                onClick={this.handleViewVehicleType}
                                type="button"
                                className="btn btn-brand btn-icon-sm"
                              >
                                <i className="flaticon2-plus" />
                                Thêm loại xe
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="kt-portlet__body pb-0 pt-0">
                          <div className="row">
                            <div className="col-md-4">
                              <Input
                                value={values.name || ""}
                                onChange={(e) => {
                                  values.name = e.target.value;
                                  let queryType = { ...values };
                                  setFieldValue("name", values.name);
                                  if (this.routeCodeTimer) {
                                    clearTimeout(this.routeCodeTimer);
                                  }
                                  this.routeCodeTimer = setTimeout((e) => {
                                    this.props.vehicleTypeSearch({
                                      queryType: queryType,
                                    });
                                  }, 800);
                                }}
                                placeholder="Tên loại xe"
                              />
                            </div>
                            <div className="col-md-4">
                              <VehicleSelect
                                value={
                                  values.type
                                    ? {
                                        key: values.type ? values.type : "",
                                        label: values.name ? values.name : "",
                                      }
                                    : undefined
                                }
                                onChange={(owner) => {
                                  values.type =
                                    owner && owner.key ? owner.key : "";
                                  values.nameType = owner.label
                                    ? owner.label
                                    : "";
                                  let queryType = { ...values };
                                  setFieldValue("type", owner.key);
                                  this.props.vehicleTypeSearch({
                                    queryType: queryType,
                                  });
                                }}
                                url="entry"
                                type="vehicleType"
                                placeholder="Loại xe"
                              />
                            </div>
                            <div className="col-md-4">
                              <VehicleSelect
                                value={
                                  values.seats
                                    ? {
                                        key: values.seats ? values.seats : "",
                                        lable: values.name ? values.name : "",
                                      }
                                    : undefined
                                }
                                onChange={(e) => {
                                  values.seats = e.key ? e.key : "";
                                  values.nameSeats = e.lable ? e.lable : "";
                                  let queryType = { ...values };
                                  setFieldValue("seats", e.key);
                                  this.props.vehicleTypeSearch({
                                    queryType: queryType,
                                  });
                                }}
                                url="entry"
                                type="numberSeat"
                                placeholder="Số chỗ ngồi"
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
                  </Formik>
                  <div className="kt-portlet__body">
                    <VehicleTypeList
                      dataSource={listVehicleType}
                      handleViewVehicle={this.handleViewVehicle}
                      handleEditVehicleType={this.handleEditVehicleType}
                      deleteVehicleType={this.handleDeleteVehicleType}
                      onChangeCurrentPage={this.changeCurrentPageType}
                      onChangePageSize={this.changePageSizeType}
                      currentPage={pagesType}
                      pageLimit={pageSizeType}
                      totalLength={totalType}
                      loading={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="tab-content">
                <div
                  className={classNames({
                    "tab-pane": true,
                    active: tabId === "3",
                  })}
                >
                  <Formik
                    enableReinitialize={true}
                    initialValues={queryTem}
                    onSubmit={(values, { setSubmitting }) => {
                      setTimeout(() => {
                        let queryTem = { ...values };
                        this.props.vehicleTemSearch({ queryTem: queryTem });
                        setSubmitting(false);
                      }, 400);
                    }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      setFieldValue,
                      // handleBlur,
                      handleSubmit,
                      setSubmitting,
                      // isSubmitting,
                      /* and other goodies */
                    }) => (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSubmit();
                        }}
                        ref={(form) => (this.form = form)}
                        style={{ maxHeight: "95%", minHeight: "95%" }}
                        className="kt-form"
                        id="add-route"
                      >
                        <div className="kt-portlet__head kt-portlet__head--lg border-bottom-0">
                          <div className="kt-portlet__head-label"></div>
                          <div className="kt-portlet__head-toolbar">
                            <div className="kt-portlet__head-wrapper">
                              <button
                                onClick={(e) => {
                                  values.vehicleId = "";
                                  values.startReg = "";
                                  values.endReg = "";
                                  values.startEx = "";
                                  values.endEx = "";
                                  setSubmitting(true);
                                  handleSubmit();
                                }}
                                className="btn btn-clean btn-icon-sm"
                              >
                                Xóa bộ lọc
                              </button>
                              &nbsp;
                              <button
                                onClick={this.handleViewVehicleTem}
                                type="button"
                                className="btn btn-brand btn-icon-sm"
                              >
                                <i className="flaticon2-plus" />
                                Thêm tem xe
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="kt-portlet__body pb-0 pt-0">
                          <div className="row">
                            <div className="col-md-3">
                              <VehicleSelect
                                value={
                                  values.vehicleId
                                    ? {
                                        key: values.vehicleId
                                          ? values.vehicleId
                                          : "",
                                        label: values.plate
                                          ? values.plate
                                          : undefined,
                                      }
                                    : undefined
                                }
                                onChange={(owner) => {
                                  values.vehicleId = owner.key ? owner.key : "";
                                  values.plate = owner.label ? owner.label : "";
                                  let queryTem = { ...values };
                                  setFieldValue("vehicleId", owner.key);
                                  this.props.vehicleTemSearch({
                                    queryTem: queryTem,
                                  });
                                }}
                                url="autocomplete/vehicle"
                                placeholder="Xe"
                              />
                            </div>

                            <div className="col-md-3">
                              <RangePicker
                                value={[
                                  values.startReg
                                    ? moment(values.startReg)
                                    : null,
                                  values.endReg ? moment(values.endReg) : null,
                                ]}
                                onChange={(date, dateString) => {
                                  values.date = moment(date).format(
                                    "YYYY-MM-DD"
                                  )
                                    ? moment(date).format("YYYY-MM-DD")
                                    : "";

                                  setFieldValue("date", values.date);
                                  values.startReg = moment(date[0]).format(
                                    "YYYY-MM-DD"
                                  )
                                    ? moment(date[0]).format("YYYY-MM-DD")
                                    : "";
                                  values.endReg = moment(date[1]).format(
                                    "YYYY-MM-DD"
                                  )
                                    ? moment(date[1]).format("YYYY-MM-DD")
                                    : "";
                                  let queryTem = { ...values };
                                  if (this.routeCodeTimer) {
                                    clearTimeout(this.routeCodeTimer);
                                  }
                                  this.routeCodeTimer = setTimeout(() => {
                                    this.props.vehicleTemSearch({
                                      queryTem: queryTem,
                                    });
                                  }, 800);
                                }}
                                placeholder={["Ngày cấp", "Ngày kết thúc"]}
                                format="DD-MM-YYYY"
                              />
                            </div>
                            <div className="col-md-3">
                              <RangePicker
                                value={[
                                  values.startEx
                                    ? moment(values.startEx)
                                    : null,
                                  values.endEx ? moment(values.endEx) : null,
                                ]}
                                onChange={(date, dateString) => {
                                  values.date = moment(date).format(
                                    "YYYY-MM-DD"
                                  )
                                    ? moment(date).format("YYYY-MM-DD")
                                    : "";

                                  setFieldValue("date", values.date);
                                  values.startEx = moment(date[0]).format(
                                    "YYYY-MM-DD"
                                  )
                                    ? moment(date[0]).format("YYYY-MM-DD")
                                    : "";
                                  values.endEx = moment(date[1]).format(
                                    "YYYY-MM-DD"
                                  )
                                    ? moment(date[1]).format("YYYY-MM-DD")
                                    : "";
                                  let queryTem = { ...values };
                                  if (this.routeCodeTimer) {
                                    clearTimeout(this.routeCodeTimer);
                                  }
                                  this.routeCodeTimer = setTimeout(() => {
                                    this.props.vehicleTemSearch({
                                      queryTem: queryTem,
                                    });
                                  }, 800);
                                }}
                                placeholder={["Ngày hết hạn", "Ngày kết thúc"]}
                                format="DD-MM-YYYY"
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
                  </Formik>
                  <div className="kt-portlet__body">
                    <VehicleTemList
                      dataSource={listVehicleTem}
                      handleViewVehicleTem={this.handleViewVehicleTem}
                      handleEditVehicleTem={this.handleEditVehicleTem}
                      deleteVehicleTem={this.handleDeleteVehicleTem}
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
              {/* Vehicle Hạng xe */}
              <div className="tab-content">
                <div
                  className={classNames({
                    "tab-pane": true,
                    active: tabId === "4",
                  })}
                >
                  <Formik
                    enableReinitialize={true}
                    initialValues={queryClass}
                    onSubmit={(values, { setSubmitting }) => {
                      setTimeout(() => {
                        let queryClass = { ...values };
                        this.props.vehicleClassSearch({
                          queryClass: queryClass,
                        });
                        setSubmitting(false);
                      }, 400);
                    }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      setFieldValue,
                      // handleBlur,
                      handleSubmit,
                      setSubmitting,
                      // isSubmitting,
                      /* and other goodies */
                    }) => (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSubmit();
                        }}
                        ref={(form) => (this.form = form)}
                        style={{ maxHeight: "95%", minHeight: "95%" }}
                        className="kt-form"
                        id="add-route"
                      >
                        <div className="kt-portlet__head kt-portlet__head--lg border-bottom-0">
                          <div className="kt-portlet__head-label"></div>
                          <div className="kt-portlet__head-toolbar">
                            <div className="kt-portlet__head-wrapper">
                              <button
                                onClick={(e) => {
                                  values.name = "";

                                  setSubmitting(true);
                                  handleSubmit();
                                }}
                                className="btn btn-clean btn-icon-sm"
                              >
                                Xóa bộ lọc
                              </button>
                              &nbsp;
                              <button
                                onClick={this.handleViewVehicleClass}
                                type="button"
                                className="btn btn-brand btn-icon-sm"
                              >
                                <i className="flaticon2-plus" />
                                Thêm hạng xe
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="kt-portlet__body pb-0 pt-0">
                          <div className="row">
                            <div className="col-md-3">
                              <Input
                                value={values.name ? values.name : ""}
                                onChange={(owner) => {
                                  values.name = owner.target.value
                                    ? owner.target.value
                                    : "";
                                  let queryClass = { ...values };
                                  setFieldValue("name", owner.target.value);
                                  if (this.routeCodeTimer) {
                                    clearTimeout(this.routeCodeTimer);
                                  }
                                  this.routeCodeTimer = setTimeout((e) => {
                                    this.props.vehicleClassSearch({
                                      queryClass: queryClass,
                                    });
                                  }, 800);
                                }}
                                placeholder="Hạng xe"
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
                  </Formik>
                  <div className="kt-portlet__body">
                    <VehicleClassList
                      dataSource={listVehicleClass}
                      handleViewVehicleClass={this.handleViewVehicleClass}
                      handleEditVehicleClass={this.handleEditVehicleClass}
                      deleteVehicleClass={this.handleDeleteVehicleClass}
                      onChangeCurrentPage={this.changeCurrentPageClass}
                      onChangePageSize={this.changePageSizeClass}
                      currentPage={pagesClass}
                      pageLimit={pageSizeClass}
                      totalLength={totalClass}
                      loading={loading}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Drawer
            id="vehicleDrawer"
            visible={isShowVehicle}
            placement="right"
            closable={false}
            onClose={this.onClose}
            destroyOnClose={this.onClose}
            width={720}
          >
            <VehicleModal
              dataSource={rowData}
              rowDataCheck={rowDataCheck}
              actionName={actionName}
              onCreate={this.handleCreateVehicle}
              onSave={this.handleSaveVehicle}
              onClose={this.onClose}
            />
          </Drawer>
          <Drawer
            id="vehicleTypeDrawer"
            visible={isShowVehicleType}
            placement="right"
            closable={false}
            onClose={this.onCloseType}
            width={720}
          >
            <VehicleTypeModel
              dataSource={rowData}
              actionName={actionName}
              onCreate={this.handleCreateVehicleType}
              onSave={this.handleSaveVehicleType}
            />
          </Drawer>
          <Drawer
            id="vehicleTypeDrawer"
            visible={isShowVehicleTem}
            placement="right"
            closable={false}
            onClose={this.onCloseTem}
            destroyOnClose={this.onCloseTem}
            width={720}
          >
            <VehicleTemModel
              dataSource={rowData}
              listVehicleFillTem={listVehicleFillTem}
              actionName={actionName}
              onCreate={this.handleCreateVehicleTem}
              onSave={this.handleSaveVehicleTem}
              vehicleFillTem={this.props.vehicleFillTem}
            />
          </Drawer>
          <Drawer
            id="vehicleTypeDrawer"
            visible={isShowVehicleClass}
            placement="right"
            closable={false}
            onClose={this.onCloseClass}
            width={720}
          >
            <VehicleClassModel
              dataSource={rowData}
              actionName={actionName}
              onCreate={this.handleCreateVehicleClass}
              onSave={this.handleSaveVehicleClass}
              vehicleDataSuccess={this.props.listVehicleClassSuccess}
            />
          </Drawer>
        </div>
      </div>
    );
  }

  onShowSizeChange(current, pageSize) {
    console.log(current, pageSize);
  }

  handleUpload() {
    this.setState({
      isShowImport: true,
    });
  }

  handleCloseUpload() {
    this.setState({
      isShowImport: false,
    });
  }

  handleShowAddNewVehicleModal() {
    // this.props.showModal(true, 'create');
  }

  handleCreateVehicleType(data) {
    this.props.vehicleCreateType(data);
  }
  handleSaveVehicleType(data) {
    this.props.vehicleTypeSave(data);
  }
  handleDeleteVehicleType(data) {
    this.props.vehicleTypeDelete(data);
  }
  handleCreateVehicle(data, func) {
    this.props.vehicleCreate(data, func);
  }
  handleSaveVehicle(data, func) {
    this.props.vehicleSave(data, func);
  }
  handleDeleteVehicle(data) {
    this.props.vehicleDelte(data);
  }
  //vehicle tem
  handleCreateVehicleTem = (data) => {
    this.props.vehicleCreateTem(data);
  };
  handleSaveVehicleTem = (data) => {
    this.props.vehicleSaveTem(data);
  };
  handleDeleteVehicleTem = (data) => {
    this.props.vehicleTemDelete(data);
  };
  //vehicle class
  handleCreateVehicleClass = (data) => {
    this.props.vehicleCreateClass(data);
  };
  handleSaveVehicleClass = (data) => {
    this.props.vehicleSaveClass(data);
  };
  handleDeleteVehicleClass = (data) => {
    this.props.vehicleClassDelete(data);
  };

  handleViewVehicleType(rowData) {
    let currentRow = this.props.Vehicle.listVehicleTypeSuccess.find(
      (x) => x.uuid === rowData.key
    );
    this.props.vehicleTypeShowModal(
      true,
      "create",
      currentRow ? currentRow : {}
    );
  }
  handleEditVehicleType(rowData) {
    let currentRow = this.props.Vehicle.listVehicleTypeSuccess.find(
      (x) => x.uuid === rowData.key
    );
    this.props.vehicleTypeShowModal(true, "edit", currentRow ? currentRow : {});
  }
  handleViewVehicle(rowData) {
    let currentRow = this.props.Vehicle.listVehicleSuccess.find(
      (x) => x.uuid === rowData.key
    );
    this.props.vehicleShowModal(
      true,
      "create",
      currentRow ? currentRow : {},
      ""
    );
  }
  //Vehicle tem
  handleViewVehicleTem = (rowData) => {
    let currentRow = this.props.Vehicle.listVehicleTemSuccess.find(
      (x) => x.id === rowData.id
    );
    this.props.vehicleTemShowModal(
      true,
      "create",
      currentRow ? currentRow : {}
    );
  };
  handleEditVehicleTem = (rowData) => {
    let currentRow = this.props.Vehicle.listVehicleTemSuccess.find(
      (x) => x.id === rowData.id
    );
    this.props.vehicleTemShowModal(true, "edit", currentRow ? currentRow : {});
  };
  //Vehicle Class
  handleViewVehicleClass(rowData) {
    let currentRow = this.props.Vehicle.listVehicleClassSuccess.find(
      (x) => x.id === rowData.key
    );
    this.props.vehicleClassShowModal(
      true,
      "create",
      currentRow ? currentRow : {},
      ""
    );
  }
  handleEditVehicleClass = (rowData) => {
    let currentRow = this.props.Vehicle.listVehicleClassSuccess.find(
      (x) => x.id === rowData.key
    );
    this.props.vehicleClassShowModal(
      true,
      "edit",
      currentRow ? currentRow : {}
    );
  };
  //*** */
  handleEditVehicle(rowData) {
    let currentRow = this.props.Vehicle.listVehicleSuccess.find(
      (x) => x.uuid === rowData.key
    );
    this.props.vehicleShowModal(true, "edit", currentRow ? currentRow : {}, "");
  }
  showDrawer() {
    this.props.vehicleShowModal(true);
  }
  onClose() {
    this.props.vehicleShowModal(false, "", "", "");
  }
  onCloseTem = () => {
    this.props.vehicleTemShowModal(false, "", "", "");
  };
  onCloseClass = () => {
    this.props.vehicleClassShowModal(false, "", "", "");
  };
  showDrawerType() {
    this.props.vehicleTypeShowModal(true);
  }
  onCloseType() {
    this.props.vehicleTypeShowModal(false);
  }
  handleVehicleCreate(data) {
    this.props.VehicleModal(data);
  }
  // handleDeleteVehicle(rowData) {
  //   this.props.deleteRouteByUUId(
  //     { uuid: rowData.key },
  //     this.props.getListRoute(this.state.paging, () => {})
  //   );
  // }
  handleHideAddNewVehicleModal() {
    this.props.showModal(false, "");
  }

  onSelectChange(selectedRowKeys) {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  changeSelection(selection) {
    this.setState({ selection });
  }

  changeCurrentPage(pages, tabId) {
    this.props.onPageChange(
      "",
      this.props.Vehicle.pageSize,
      pages,
      tabId,
      this.props.Vehicle.query
    );
  }

  changePageSize(pageSize, tabId) {
    this.props.onPageChange(
      "",
      pageSize,
      this.props.Vehicle.pages,
      tabId,
      this.props.Vehicle.query
    );
  }
  changeCurrentPageType(pages, tabId) {
    this.props.onPageChangeType(
      "",
      this.props.Vehicle.pageSize,
      pages,
      tabId,
      this.props.Vehicle.queryType
    );
  }

  changePageSizeType(pageSize, tabId) {
    this.props.onPageChangeType(
      "",
      pageSize,
      this.props.Vehicle.pages,
      tabId,
      this.props.Vehicle.queryType
    );
  }
  //vehicle tem
  changeCurrentPageTem(pages, tabId) {
    this.props.onPageChangeTem(
      "",
      this.props.Vehicle.pageSizeTem,
      pages,
      tabId,
      this.props.Vehicle.queryTem
    );
  }
  changePageSizeTem(pageSize, tabId) {
    this.props.onPageChangeTem(
      "",
      pageSize,
      this.props.Vehicle.pagesTem,
      tabId,
      this.props.Vehicle.queryTem
    );
  }
  //vehicle class
  changeCurrentPageClass(pages, tabId) {
    this.props.onPageChangeClass(
      "",
      this.props.Vehicle.pageSizeClass,
      pages,
      tabId,
      this.props.Vehicle.queryClass
    );
  }
  changePageSizeClass(pageSize, tabId) {
    this.props.onPageChangeClass(
      "",
      pageSize,
      this.props.Vehicle.pagesClass,
      tabId,
      this.props.Vehicle.queryClass
    );
  }

  handleChangeTab(tabId) {
    this.props.changeTab(tabId);
  }
}

const mapStateToProps = (store) => {
  return {
    Vehicle: store.Vehicle.toJS(),
    Driver: store.Driver.toJS().listDriver,
    Partner: store.Partner.toJS(),
  };
};
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      driverSearch,
      vehicleSearch,
      vehicleTypeSearch,
      showModal,
      onPageChange,
      changeTab,
      organizationPartnerSearch,
      vehicleShowModal,
      vehicleCreate,
      vehicleSave,
      vehicleDelte,
      vehicleTypeShowModal,
      vehicleCreateType,
      vehicleTypeSave,
      vehicleTypeDelete,
      onPageChangeType,
      vehicleTemSearch,
      vehicleTemShowModal,
      vehicleCreateTem,
      vehicleSaveTem,
      vehicleTemDelete,
      onPageChangeTem,
      vehicleFillTem,
      vehicleClassSearch,
      vehicleClassShowModal,
      vehicleCreateClass,
      vehicleSaveClass,
      vehicleClassDelete,
      onPageChangeClass,
      // importVehicleType,
      // importVehicle,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(VehicleManagement);
