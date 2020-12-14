import React from "react";
import { DatePicker, Form, Input, Select, Tabs, Spin, Drawer } from "antd";

import DriverList from "./DriverList";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import DriverModal from "../../components/Modals/driver/DriverModal";
import DriverCreate from "../../components/Modals/driver/DriverCreate";
import { Formik } from "formik";
import moment from "moment";
import { SelectDriver } from "./../../components/Utility/common";
import { actions as driverAction } from "../../redux/driver/actions";
import { actions as vehicleAction } from "../../redux/vehicle/actions";
import { actions as parterAction } from "../../redux/partner/actions";
import classNames from "classnames";
import DriverCtv from "./DriverCtv";
import { requestJsonGet } from "../../services/base";
const {
  driverSearch,
  driverParnerSearch,
  showModal,
  onPageChange,
  driveShowModal,
  driverCreate,
  driverSaveDriver,
  driverDelete,
  changeTab,
  driverParnerShowModal,
  driverParnerCreate,
  driverParnerSaveDriver,
  onPageChangeParner,
  driverParnerDelete
} = driverAction;
const { organizationPartnerSearch } = parterAction;
const { vehicleSearch } = vehicleAction;

function disabledDate(current) {
  return current && current > moment().endOf("day");
}
class OwnerSelect extends React.PureComponent {
  _cache = {};
  fetchUser = searchInput => {
    if (this._cache[searchInput]) {
      this.setState({ data: this._cache[searchInput] });
      return;
    }
    let param = {};
    if (this.props.url === "organization/all") {
      param = {
        where: "types eq bP"
      };
    }
    this.setState({ data: [], fetching: true });
    requestJsonGet({ url: this.props.url, data: param }).then(response => {
      if (this.props.url == "entry" && this.props.type == "statusUser") {
        const data = response.data.statusUser.map(user => {
          return {
            key: user.id,
            label: user.name
          };
        });
        this._cache[searchInput] = data;
        this.setState({ data, fetching: false });
      } else if (this.props.url == "entry" && this.props.type == "rateDriver") {
        const data = response.data.rateDriver.map(user => {
          return {
            key: user.id,
            label: user.name
          };
        });
        this._cache[searchInput] = data;
        this.setState({ data, fetching: false });
      } else if (
        this.props.url == "organization/all" &&
        this.props.type == "organization"
      ) {
        const data = response.data.map(user => {
          return {
            key: user.uuid,
            label: user.name
          };
        });
        this._cache[searchInput] = data;
        this.setState({ data, fetching: false });
      } else {
        const data = response.data.rateDriver.map(user => {
          return {
            key: user.id,
            label: user.name
          };
        });
        this._cache[searchInput] = data;
        this.setState({ data, fetching: false });
      }
    });
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      data: []
    };
  }
  render() {
    const { data, fetching } = this.state;
    const { value, onChange, placeholder } = this.props;
    return (
      <Select
        value={value}
        onChange={onChange}
        showSearch
        labelInValue
        filterOption={(input, option) =>
          option.props.children
            .toLocaleLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        }
        placeholder={placeholder}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        // onChange={onSelectOwner}
        onFocus={() => {
          if (data.length === 0) {
            this.fetchUser("");
          }
        }}
        onSearch={searchInput => {
          if (this.timer) {
            clearTimeout(this.timer);
          }

          this.timer = setTimeout(() => {
            this.fetchUser(searchInput);
          }, 800);
        }}
        style={{ width: "100%" }}
      >
        {data.map((user, userId) => {
          return (
            <Select.Option value={user.key} key={userId}>
              {user.label}
            </Select.Option>
          );
        })}
      </Select>
    );
  }
}
class DriverManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selection: [],
      isShowAddNewDriverModal: false,
      listDriver: [],
      listDriverParner: [],
      rowData: [],
      paging: {
        pageSize: 10,
        pages: 1,
        orderBy: {
          name: 1
        },
        searchInput: ""
      },
      loading: false,
      isShowImport: false
    };
    this.onSelectChange = this.onSelectChange.bind(this);
    this.changeSelection = this.changeSelection.bind(this);
    this.handleShowAddNewDriverModal = this.handleShowAddNewDriverModal.bind(
      this
    );
    this.handleHideAddNewDriverModal = this.handleHideAddNewDriverModal.bind(
      this
    );
    this.handleViewDriver = this.handleViewDriver.bind(this);
    this.handleEditDriver = this.handleEditDriver.bind(this);
    this.handleDeleteDriver = this.handleDeleteDriver.bind(this);
    this.showDrawer = this.showDrawer.bind(this);
    this.onClose = this.onClose.bind(this);

    this.handledriverCreate = this.handledriverCreate.bind(this);
    this.handledriverSave = this.handledriverSave.bind(this);
    this.handleCreateDriver = this.handleCreateDriver.bind(this);
    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
    this.queryString = this.queryString.bind(this);
    this.loadData = this.loadData.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleCloseUpload = this.handleCloseUpload.bind(this);
    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.showDrawerType = this.showDrawerType.bind(this);
    this.onCloseType = this.onCloseType.bind(this);
    this.handleEditDriverParner = this.handleEditDriverParner.bind(this);
    this.handledriverParnerCreate = this.handledriverParnerCreate.bind(this);
    this.handledriverParnerSave = this.handledriverParnerSave.bind(this);
    this.handleDeleteParnerDriver = this.handleDeleteParnerDriver.bind(this);
    this.changePageSizeParner = this.changePageSizeParner.bind(this);
    this.changeCurrentPageParner = this.changeCurrentPageParner.bind(this);
  }

  componentDidMount() {
    const { tabId } = this.props.Driver;
    if (tabId === "1") {
      let initParam = {};
      if (localStorage.getItem("AppParam")) {
        let appParam = JSON.parse(localStorage.getItem("AppParam"));
        if (appParam["Driver"]) {
          initParam = appParam["Driver"];
        }
      }
      this.props.driverSearch(initParam);
    } else {
      let initParamParner = {};
      if (localStorage.getItem("AppParam")) {
        let appParamParner = JSON.parse(localStorage.getItem("AppParam"));
        if (appParamParner["Driver"]) {
          initParamParner = appParamParner["Driver"];
        }
      }
      this.props.driverParnerSearch(initParamParner);
    }

    this.loadData();
  }
  showDrawer() {
    this.props.driveShowModal(true);
  }
  onClose() {
    this.props.driveShowModal(false);
  }
  showDrawerType() {
    this.props.driverParnerShowModal(true);
  }
  onCloseType() {
    this.props.driverParnerShowModal(false);
  }

  queryString() {
    const {
      pageSize,
      pages,
      tabId,
      pageSizeType,
      pagesType
    } = this.props.Driver;
    if (tabId === "1") {
      return `lastQuery:?take=${pageSize}&skip=${pageSize * pages}`;
    } else {
      return `lastQuery:?take=${pageSizeType}&skip=${pageSizeType * pagesType}`;
    }
  }

  loadData() {
    const { tabId } = this.props.Driver;
    const queryString = this.queryString();
    if (tabId == "1") {
      this.props.driverSearch("", 5, 0, true, "1", []);
    } else {
      this.props.driverParnerSearch("", 5, 0, true, "2", []);
    }
    this.lastQuery = queryString;
  }

  render() {
    const { listVehicleType, listVehicle, typeDriver } = this.props;
    const { listDriver, listDriverParner } = this.props.Driver;
    const {
      loading,
      isShow,
      actionName,
      rowData,
      rowDataType,
      total,
      pages,
      query,
      pageSize,
      selectStatus,
      tabId,
      isShowType
    } = this.props.Driver;

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
                    CÔNG TY
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
                    CTV
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
                        this.props.driverSearch({ query: query });
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
                                  values.code = "";
                                  values.fullName = "";
                                  values.birthday = "";
                                  values.CMND = "";
                                  values.driversLicenseClass = "";
                                  values.licenseExpireAt = "";
                                  values.driversLicenseCode = "";
                                  values.status = "";
                                  values.rating = "";
                                  values.refOrganization = "";
                                  values.type = "";
                                  setSubmitting(true);
                                  handleSubmit();
                                }}
                                className="btn btn-clean btn-icon-sm"
                              >
                                Xóa bộ lọc
                              </button>
                              &nbsp;
                              <button
                                onClick={this.handleViewDriver}
                                type="button"
                                className="btn btn-brand btn-icon-sm"
                              >
                                <i className="flaticon2-plus" />
                                Thêm lái xe
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="kt-portlet__body pb-0 pt-0">
                          <div className="row">
                            <div className="col-md-2">
                              <Input
                                value={values.code || ""}
                                onChange={e => {
                                  values.code = e.target.value
                                    ? e.target.value
                                    : "";
                                  let query = { ...values };
                                  setFieldValue("code", values.code);
                                  if (this.routeCodeTimer) {
                                    clearTimeout(this.routeCodeTimer);
                                  }
                                  this.routeCodeTimer = setTimeout(() => {
                                    this.props.driverSearch({ query: query });
                                  }, 800);
                                }}
                                placeholder="Mã lái/Phụ xe"
                              />
                            </div>
                            <div className="col-md-2">
                              <Input
                                value={values.fullName || ""}
                                onChange={e => {
                                  values.fullName = e.target.value
                                    ? e.target.value
                                    : "";
                                  setFieldValue("fullName", values.fullName);
                                  let query = { ...values };
                                  if (this.routeCodeTimer) {
                                    clearTimeout(this.routeCodeTimer);
                                  }
                                  this.routeCodeTimer = setTimeout(() => {
                                    this.props.driverSearch({ query: query });
                                  }, 800);
                                }}
                                placeholder="Họ và tên"
                              />
                            </div>
                            <div className="col-md-2">
                              <SelectDriver
                                value={
                                  values.type ? { key: values.type } : undefined
                                }
                                url="entry"
                                type="typeDriver"
                                placeholder="Tùy chọn"
                                onChange={e => {
                                  values.type = e.key ? e.key : "";
                                  setFieldValue("type", values.type);
                                  let query = { ...values };
                                  if (this.routeCodeTimer) {
                                    clearTimeout(this.routeCodeTimer);
                                  }
                                  this.routeCodeTimer = setTimeout(() => {
                                    this.props.driverSearch({ query: query });
                                  }, 800);
                                }}
                                placeholder="Tùy chọn"
                              />
                            </div>
                            <div className="col-md-2">
                              <DatePicker
                                disabledDate={disabledDate}
                                value={
                                  values.birthday
                                    ? moment(values.birthday)
                                    : null
                                }
                                format="DD-MM-YYYY"
                                onChange={e => {
                                  values.birthday = e
                                    ? moment(e).format("YYYY-MM-DD")
                                    : "";
                                  setFieldValue("birthday", values.birthday);
                                  let query = { ...values };
                                  if (this.routeCodeTimer) {
                                    clearTimeout(this.routeCodeTimer);
                                  }
                                  this.routeCodeTimer = setTimeout(() => {
                                    this.props.driverSearch({ query: query });
                                  }, 800);
                                }}
                                placeholder="Ngày tháng năm sinh"
                              />
                            </div>
                            <div className="col-md-2">
                              <Input
                                value={values.CMND || ""}
                                onChange={e => {
                                  values.CMND = e.target.value
                                    ? e.target.value
                                    : "";
                                  setFieldValue("CMND", values.CMND);
                                  let query = { ...values };
                                  if (this.routeCodeTimer) {
                                    clearTimeout(this.routeCodeTimer);
                                  }
                                  this.routeCodeTimer = setTimeout(() => {
                                    this.props.driverSearch({ query: query });
                                  }, 800);
                                }}
                                placeholder="Số CMND"
                              />
                            </div>
                            <div className="col-md-2">
                              <DatePicker
                                value={
                                  values.licenseExpireAt
                                    ? moment(values.licenseExpireAt)
                                    : null
                                }
                                format="DD-MM-YYYY"
                                onChange={e => {
                                  values.licenseExpireAt = e
                                    ? moment(e).format("YYYY-MM-DD")
                                    : "";
                                  setFieldValue(
                                    "licenseExpireAt",
                                    values.licenseExpireAt
                                  );
                                  let query = { ...values };
                                  if (this.routeCodeTimer) {
                                    clearTimeout(this.routeCodeTimer);
                                  }
                                  this.routeCodeTimer = setTimeout(() => {
                                    this.props.driverSearch({ query: query });
                                  }, 800);
                                }}
                                placeholder="Thời hạn bằng lái"
                              />
                            </div>
                          </div>
                          <div className="row mt-2">
                            <div className="col-md-2">
                              <Input
                                value={values.driversLicenseCode || ""}
                                onChange={e => {
                                  values.driversLicenseCode = e.target.value
                                    ? e.target.value
                                    : "";
                                  setFieldValue(
                                    "driversLicenseCode",
                                    values.driversLicenseCode
                                  );
                                  let query = { ...values };
                                  if (this.routeCodeTimer) {
                                    clearTimeout(this.routeCodeTimer);
                                  }
                                  this.routeCodeTimer = setTimeout(() => {
                                    this.props.driverSearch({ query: query });
                                  }, 800);
                                }}
                                placeholder="Số bằng lái"
                              />
                            </div>
                            <div className="col-md-2">
                              <OwnerSelect
                                value={
                                  values.status === 0 || values.status
                                    ? {
                                        key: values.status ? values.status : "",
                                        label: values.name
                                          ? values.name
                                          : undefined
                                      }
                                    : undefined
                                }
                                onChange={e => {
                                  values.status = e.key ? e.key : 0;
                                  values.name = e.label
                                    ? e.label
                                    : "Không hoạt động";
                                  let query = { ...values };
                                  setFieldValue("status", values.status);
                                  this.props.driverSearch({ query: query });
                                }}
                                url="entry"
                                type="statusUser"
                                placeholder="Trạng thái"
                              />
                            </div>
                            <div className="col-md-2">
                              <OwnerSelect
                                value={
                                  values.rating === 0 || values.rating
                                    ? {
                                        key: values.rating ? values.rating : "",
                                        label: values.name
                                          ? values.name
                                          : undefined
                                      }
                                    : undefined
                                }
                                onChange={e => {
                                  values.rating = e.key ? e.key : 0;
                                  values.name = e.label
                                    ? e.label
                                    : "Không hoạt động";
                                  let query = { ...values };
                                  setFieldValue("rating", values.rating);
                                  this.props.driverSearch({ query: query });
                                }}
                                url="entry"
                                type="rateDriver"
                                placeholder="Đánh giá"
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
                  </Formik>
                  <div className="kt-portlet__body">
                    <DriverList
                      dataSource={listDriver}
                      listVehicle={listVehicle}
                      currentPage={pages}
                      pageLimit={pageSize}
                      loading={loading}
                      totalLength={total}
                      handleViewDriver={this.handleViewDriver}
                      handleEditDriver={this.handleEditDriver}
                      deleteDriver={this.handleDeleteDriver}
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
                    initialValues={query}
                    onSubmit={(values, { setSubmitting }) => {
                      setTimeout(() => {
                        let queryType = { ...values };
                        this.props.driverParnerSearch({ queryType: queryType });
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
                                  values.code = "";
                                  values.fullName = "";
                                  values.birthday = "";
                                  values.CMND = "";
                                  values.driversLicenseClass = "";
                                  values.licenseExpireAt = "";
                                  values.driversLicenseCode = "";
                                  values.status = "";
                                  values.rating = "";
                                  values.organizationId = "";
                                  values.typePartner = "";
                                  setSubmitting(true);
                                  handleSubmit();
                                }}
                                className="btn btn-clean btn-icon-sm"
                              >
                                Xóa bộ lọc
                              </button>
                              &nbsp;
                              <button
                                onClick={this.handleShowAddNewDriverModal}
                                type="button"
                                className="btn btn-brand btn-icon-sm"
                              >
                                <i className="flaticon2-plus" />
                                Thêm lái xe CTV
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="kt-portlet__body pb-0 pt-0">
                          <div className="row">
                            <div className="col-md-2">
                              <Input
                                value={values.code || ""}
                                onChange={e => {
                                  values.code = e.target.value
                                    ? e.target.value
                                    : "";
                                  let queryType = { ...values };
                                  setFieldValue("code", values.code);
                                  if (this.routeCodeTimer) {
                                    clearTimeout(this.routeCodeTimer);
                                  }
                                  this.routeCodeTimer = setTimeout(() => {
                                    this.props.driverParnerSearch({
                                      queryType: queryType
                                    });
                                  }, 800);
                                }}
                                placeholder="Mã lái xe"
                              />
                            </div>
                            <div className="col-md-2">
                              <Input
                                value={values.fullName || ""}
                                onChange={e => {
                                  values.fullName = e.target.value
                                    ? e.target.value
                                    : "";
                                  setFieldValue("fullName", values.fullName);
                                  let queryType = { ...values };
                                  if (this.routeCodeTimer) {
                                    clearTimeout(this.routeCodeTimer);
                                  }
                                  this.routeCodeTimer = setTimeout(() => {
                                    this.props.driverParnerSearch({
                                      queryType: queryType
                                    });
                                  }, 800);
                                }}
                                placeholder="Họ và tên"
                              />
                            </div>
                            <div className="col-md-2">
                              <SelectDriver
                                value={
                                  values.typePartner
                                    ? { key: values.typePartner }
                                    : undefined
                                }
                                url="entry"
                                type="typeDriver"
                                placeholder="Tùy chọn"
                                onChange={e => {
                                  values.typePartner = e.key ? e.key : "";
                                  setFieldValue(
                                    "typePartner",
                                    values.typePartner
                                  );
                                  let queryType = { ...values };
                                  if (this.routeCodeTimer) {
                                    clearTimeout(this.routeCodeTimer);
                                  }
                                  this.routeCodeTimer = setTimeout(() => {
                                    this.props.driverParnerSearch({
                                      queryType: queryType
                                    });
                                  }, 800);
                                }}
                                placeholder="Tùy chọn"
                              />
                            </div>
                            <div className="col-md-2">
                              <DatePicker
                                disabledDate={disabledDate}
                                value={
                                  values.birthday
                                    ? moment(values.birthday)
                                    : null
                                }
                                onChange={e => {
                                  values.birthday = moment(e).format(
                                    "YYYY-MM-DD"
                                  )
                                    ? moment(e).format("YYYY-MM-DD")
                                    : "";
                                  setFieldValue("birthday", values.birthday);
                                  let queryType = { ...values };
                                  if (this.routeCodeTimer) {
                                    clearTimeout(this.routeCodeTimer);
                                  }
                                  this.routeCodeTimer = setTimeout(() => {
                                    this.props.driverParnerSearch({
                                      queryType: queryType
                                    });
                                  }, 800);
                                }}
                                placeholder="Ngày tháng năm sinh"
                              />
                            </div>
                            <div className="col-md-2">
                              <Input
                                value={values.CMND || ""}
                                onChange={e => {
                                  values.CMND = e.target.value
                                    ? e.target.value
                                    : "";
                                  setFieldValue("CMND", values.CMND);
                                  let queryType = { ...values };
                                  if (this.routeCodeTimer) {
                                    clearTimeout(this.routeCodeTimer);
                                  }
                                  this.routeCodeTimer = setTimeout(() => {
                                    this.props.driverParnerSearch({
                                      queryType: queryType
                                    });
                                  }, 800);
                                }}
                                placeholder="Số CMND"
                              />
                            </div>
                            <div className="col-md-2">
                              <DatePicker
                                value={
                                  values.licenseExpireAt
                                    ? moment(values.licenseExpireAt)
                                    : null
                                }
                                onChange={e => {
                                  values.licenseExpireAt = moment(e).format(
                                    "YYYY-MM-DD"
                                  )
                                    ? moment(e).format("YYYY-MM-DD")
                                    : "";
                                  setFieldValue(
                                    "licenseExpireAt",
                                    values.licenseExpireAt
                                  );
                                  let queryType = { ...values };
                                  if (this.routeCodeTimer) {
                                    clearTimeout(this.routeCodeTimer);
                                  }
                                  this.routeCodeTimer = setTimeout(() => {
                                    this.props.driverParnerSearch({
                                      queryType: queryType
                                    });
                                  }, 800);
                                }}
                                placeholder="Thời hạn bằng lái"
                              />
                            </div>
                          </div>
                          <div className="row mt-2">
                            <div className="col-md-2">
                              <OwnerSelect
                                value={
                                  values.organizationId
                                    ? {
                                        key: values.organizationId,
                                        label: values.organizationId
                                      }
                                    : undefined
                                }
                                url="organization/all"
                                type="organization"
                                placeholder="Doanh nghiệp"
                                onChange={owner => {
                                  values.organizationId = owner.key;
                                  let queryType = { ...values };
                                  setFieldValue(
                                    "organizationId",
                                    values.organizationId
                                  );
                                  // setFieldValue("lblLabel", owner.label);
                                  this.props.driverParnerSearch({
                                    queryType: queryType
                                  });
                                }}
                              />
                            </div>
                            <div className="col-md-2">
                              <Input
                                value={values.driversLicenseCode || ""}
                                onChange={e => {
                                  values.driversLicenseCode = e.target.value
                                    ? e.target.value
                                    : "";
                                  setFieldValue(
                                    "driversLicenseCode",
                                    values.driversLicenseCode
                                  );
                                  let queryType = { ...values };
                                  if (this.routeCodeTimer) {
                                    clearTimeout(this.routeCodeTimer);
                                  }
                                  this.routeCodeTimer = setTimeout(() => {
                                    this.props.driverParnerSearch({
                                      queryType: queryType
                                    });
                                  }, 800);
                                }}
                                placeholder="Số bằng lái"
                              />
                            </div>
                            <div className="col-md-2">
                              <OwnerSelect
                                value={
                                  values.status === 0 || values.status
                                    ? {
                                        key: values.status ? values.status : "",
                                        label: values.name
                                          ? values.name
                                          : undefined
                                      }
                                    : undefined
                                }
                                onChange={e => {
                                  values.status = e.key ? e.key : 0;
                                  values.name = e.label
                                    ? e.label
                                    : "Không hoạt động";
                                  let queryType = { ...values };
                                  setFieldValue("status", values.status);
                                  this.props.driverParnerSearch({
                                    queryType: queryType
                                  });
                                }}
                                url="entry"
                                type="statusUser"
                                placeholder="Trạng thái"
                              />
                            </div>
                            <div className="col-md-2">
                              <OwnerSelect
                                value={
                                  values.rating === 0 || values.rating
                                    ? {
                                        key: values.rating ? values.rating : "",
                                        label: values.name
                                          ? values.name
                                          : undefined
                                      }
                                    : undefined
                                }
                                onChange={e => {
                                  values.rating = e.key ? e.key : 0;
                                  values.name = e.label
                                    ? e.label
                                    : "Không hoạt động";
                                  let queryType = { ...values };
                                  setFieldValue("rating", values.rating);
                                  this.props.driverParnerSearch({
                                    queryType: queryType
                                  });
                                }}
                                url="entry"
                                type="rateDriver"
                                placeholder="Đánh giá"
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
                  </Formik>
                  <div className="kt-portlet__body">
                    <DriverCtv
                      dataSource={listDriverParner}
                      listVehicle={listVehicle}
                      currentPage={pages}
                      pageLimit={pageSize}
                      loading={loading}
                      totalLength={total}
                      handleViewDriver={this.handleViewDriver}
                      handleEditDriverParner={this.handleEditDriverParner}
                      driverParnerDelete={this.handleDeleteParnerDriver}
                      onChangeCurrentPage={this.changeCurrentPageParner}
                      onChangePageSize={this.changePageSizeParner}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Drawer
            id="driverDrawer"
            visible={isShow}
            placement="right"
            closable={false}
            onClose={this.onClose}
            width={720}
            destroyOnClose={this.onClose}
          >
            <DriverCreate
              typeDriver={typeDriver}
              dataSource={rowData}
              dataStatus={selectStatus}
              listVehicleType={listVehicleType}
              actionName={actionName}
              onCreate={this.handledriverCreate}
              onSave={this.handledriverSave}
              // onDelete={this.handleDeleteDriver}
              onClose={this.onClose}
              onClick={this.showDrawer}
            />
          </Drawer>
          <Drawer
            id="driverDrawer"
            visible={isShowType}
            placement="right"
            closable={false}
            onClose={this.onCloseType}
            destroyOnClose={this.onCloseType}
            width={720}
          >
            <DriverModal
              typeDriver={typeDriver}
              dataSource={rowDataType}
              dataStatus={selectStatus}
              listVehicleType={listVehicleType}
              actionName={actionName}
              onCreate={this.handledriverParnerCreate}
              onSave={this.handledriverParnerSave}
              // onDelete={this.handleDeleteDriver}
              onClose={this.onCloseType}
              onClick={this.showDrawerType}
            />
          </Drawer>
        </div>
      </div>
    );
  }

  onShowSizeChange() {}

  handleShowAddNewDriverModal() {
    this.props.driverParnerShowModal(true, "create");
  }
  handleUpload() {
    this.setState({
      isShowImport: true
    });
  }

  handleCloseUpload() {
    this.setState({
      isShowImport: false
    });
  }

  handleCreateDriver(data) {
    this.setState({ loading: false });
    this.props.createRoute(
      data,
      this.props.getListRoute(this.state.paging, () => {
        this.setState({
          isShowAddNewDriverModal: false
        });
      })
    );
  }
  handleChangeTab(tabId) {
    this.props.changeTab(tabId);
  }
  handleViewDriver(rowData) {
    let currentRow = this.props.Driver.listDriverSuccess.find(
      x => x.uuid === rowData.key
    );
    this.props.driveShowModal(true, "create", currentRow ? currentRow : {});
    // this.setState({
    //   visible: true
    // });
  }

  handleEditDriver(rowData) {
    let currentRow = this.props.Driver.listDriverSuccess.find(
      x => x.uuid === rowData.key
    );
    this.props.driveShowModal(true, "edit", currentRow ? currentRow : {});
    // this.setState({
    //   visible: true
    // });
  }
  handleEditDriverParner(rowDataType) {
    let currentRow = this.props.Driver.listDriverParnerSuccess.find(
      e => e.uuid === rowDataType.key
    );
    this.props.driverParnerShowModal(
      true,
      "edit",
      currentRow ? currentRow : {}
    );
  }
  handledriverCreate(data) {
    this.props.driverCreate(data);
  }
  handledriverSave(data) {
    this.props.driverSaveDriver(data);
  }
  handleDeleteDriver(data) {
    this.props.driverDelete(data);
  }
  handledriverParnerCreate(data) {
    this.props.driverParnerCreate(data);
  }
  handledriverParnerSave(data) {
    this.props.driverParnerSaveDriver(data);
  }
  handleDeleteParnerDriver(data) {
    this.props.driverParnerDelete(data);
  }

  handleHideAddNewDriverModal() {
    this.props.showModal(false, "");
  }

  onSelectChange(selectedRowKeys) {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  changeSelection(selection) {
    this.setState({ selection });
  }

  changeCurrentPage(pages) {
    this.props.onPageChange(
      "",
      this.props.Driver.pageSize,
      pages,
      this.props.Driver.query,
      this.props.Driver.tabId
    );
  }

  changePageSize(pageSize) {
    this.props.onPageChange(
      "",
      pageSize,
      this.props.Driver.pages,
      this.props.Driver.query,
      this.props.Driver.tabId
    );
  }
  changeCurrentPageParner(pages) {
    this.props.onPageChangeParner(
      "",
      this.props.Driver.pageSize,
      pages,
      this.props.Driver.queryType,
      this.props.Driver.tabId
    );
  }

  changePageSizeParner(pageSize) {
    this.props.onPageChangeParner(
      "",
      pageSize,
      this.props.Driver.pages,
      this.props.Driver.queryType,
      this.props.Driver.tabId
    );
  }

  handleImportDriver(file, orgId) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("orgId", orgId);
    // You can use any AJAX library you like
    // reqwest({
    //   url: `${API_IMPORT_BASE_URL}/import_driver`,
    //   method: "post",
    //   processData: false,
    //   data: formData,
    //   success: response => {
    //     debugger;
    //     console.log(response);
    //     this.setState({
    //       fileList: [],
    //       uploading: false
    //     });
    //     notification.success({
    //       message: "HAVAZ",
    //       description: `${file.name} file uploaded successfully`,
    //       className: "toast toast-success"
    //     });
    //   },
    //   error: reason => {
    //     debugger;
    //     this.setState({
    //       uploading: false
    //     });
    //     notification.error({
    //       message: `${file.name} file upload failed.`,
    //       description: <div />,
    //       className: "toast toast-error"
    //     });
    //   }
    // });
  }
}

const mapStateToProps = store => {
  return {
    typeDriver: store.App.appConfig.typeDriver,
    listVehicleType: store.Vehicle.toJS().listVehicleType,
    Driver: store.Driver.toJS(),
    listVehicle: store.Vehicle.toJS().listVehicle,
    Partner: store.Partner.toJS()
  };
};
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      driverSearch,
      driverParnerSearch,
      vehicleSearch,
      showModal,
      driveShowModal,
      organizationPartnerSearch,
      onPageChange,
      driverCreate,
      driverSaveDriver,
      driverDelete,
      changeTab,
      driverParnerShowModal,
      driverParnerCreate,
      driverParnerSaveDriver,
      onPageChangeParner,
      driverParnerDelete
    },
    dispatch
  );
const App = Form.create()(DriverManagement);
export default connect(mapStateToProps, mapDispatchToProps)(App);
