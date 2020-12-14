import React from "react";
import { Input, Drawer, Select } from "antd";

import PartnerList from "./PartnerList";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { actions as partnerActions } from "../../redux/partner/actions";
import { withStyles } from "@material-ui/core/styles";
import { Formik } from "formik";
import { CitySelect } from "../../components/Utility/common";
import { STATUS, APP_MODULE } from "@Constants/common";
import PartnerModal from "../../components/Modals/partner/PartnerModal";
import PartnerCTVModal from "../../components/Modals/partner/PartnerCTVModal";
import classNames from "classnames";
import { appParam, isEmpty } from "@Helpers/utility";
import moment from "moment";

const {
  browseOrganization,
  browsePartner,
  showModal,
  readOrganization,
  readPartner,
  deletePartner,
  deleteOrganization,
  costPartnerSearch,
  savePartnerRouteCostPer,
  savePartnerRouteCost,
  addOrganization,
  editOrganization,
  addPartner,
  editPartner,
  onPageChange,
  changeTab,
} = partnerActions;

const Option = Select.Option;

class PartnerManagement extends React.Component {
  state = {
    filterDatetime: moment(),
  };

  handleFilter = (query) => {
    let { tabId } = this.props.Partner;
    if (tabId === 1) {
      let initParam = appParam[APP_MODULE.PARTNER]
        ? isEmpty(appParam[APP_MODULE.PARTNER]["ORGANIZATION"], {})
        : {};
      this.props.browseOrganization({
        ...initParam,
        currentPage: 0,
        query: query,
      });
    } else {
      let initParam = appParam[APP_MODULE.PARTNER]
        ? isEmpty(appParam[APP_MODULE.PARTNER]["PARTNER"], {})
        : {};
      this.props.browsePartner({ ...initParam, currentPage: 0, query: query });
    }
  };
  loadData = () => {
    let { tabId } = this.props.Partner;
    if (tabId === 1) {
      let initParam = appParam[APP_MODULE.PARTNER]
        ? isEmpty(appParam[APP_MODULE.PARTNER]["ORGANIZATION"], {})
        : {};
      this.props.browseOrganization(initParam);
    } else {
      let initParam = appParam[APP_MODULE.PARTNER]
        ? isEmpty(appParam[APP_MODULE.PARTNER]["PARTNER"], {})
        : {};
      this.props.browsePartner(initParam);
    }
  };

  componentDidMount() {
    setTimeout(() => {
      this.loadData();
    }, 300);
  }

  render() {
    const {
      browseOrganization,
      browsePartner,
      costPartnerSearch,
      Partner,
    } = this.props;
    console.log("partnergrid", Partner);
    const { filterDatetime } = this.state;
    const {
      actionName,
      tabId,
      isShow,
      organization,
      partner,
      partnerData,
      listPartnerCost,
      costLoading,
    } = Partner;
    console.log("partnergrid", partner);
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
                  <a
                    className={classNames({
                      "nav-link": true,
                      active: tabId === 1,
                    })}
                    data-toggle="tab"
                    onClick={(e) => this.handleChangeTab(1)}
                    role="tab"
                    aria-selected="true"
                  >
                    DOANH NGHIỆP
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={classNames({
                      "nav-link": true,
                      active: tabId === 2,
                    })}
                    data-toggle="tab"
                    onClick={(e) => this.handleChangeTab(2)}
                    role="tab"
                    aria-selected="true"
                  >
                    CÁ NHÂN
                  </a>
                </li>
              </ul>
              <div className="tab-content">
                <div
                  className={classNames({
                    "tab-pane": true,
                    active: tabId === 1,
                  })}
                >
                  <Formik
                    enableReinitialize={true}
                    initialValues={organization.query}
                    onSubmit={(values) => {
                      let query = { ...values };
                      browseOrganization({ currentPage: 0, query: query });
                    }}
                  >
                    {({
                      values,
                      setSubmitting,
                      setFieldValue,
                      handleSubmit,
                    }) => {
                      return (
                        <form className="kt-form">
                          <div className="kt-portlet__head kt-portlet__head--lg border-bottom-0">
                            <div className="kt-portlet__head-label"></div>
                            <div className="kt-portlet__head-toolbar">
                              <div className="kt-portlet__head-wrapper">
                                <a
                                  onClick={(e) => {
                                    values.codes = "";
                                    values.nameOrAdress = "";
                                    values.email = "";
                                    values.phone = "";
                                    values.status = [];
                                    values.startDate = "";
                                    values.endDate = "";
                                    values.taxCode = "";
                                    values.citys = [];
                                    setSubmitting(true);
                                    handleSubmit();
                                  }}
                                  className="btn btn-clean btn-icon-sm"
                                >
                                  Xóa bộ lọc
                                </a>
                                &nbsp;
                                <button
                                  onClick={(e) =>
                                    this.handleShowPartnerModal(true, "create")
                                  }
                                  type="button"
                                  className="btn btn-brand btn-icon-sm"
                                >
                                  <i className="flaticon2-plus" />
                                  Thêm CTV
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="kt-portlet__body pb-0 pt-0">
                            <div className="row">
                              <div className="col-md-3">
                                <Input
                                  value={values.codes}
                                  onChange={(e) => {
                                    let query = { ...values };
                                    query.codes = e.target.value;
                                    setFieldValue("codes", query.codes);

                                    if (this.codesTimer) {
                                      clearTimeout(this.codesTimer);
                                    }
                                    this.codesTimer = setTimeout(() => {
                                      this.handleFilter(query);
                                    }, 800);
                                  }}
                                  placeholder="Mã CTV"
                                />
                              </div>
                              <div className="col-md-3">
                                <Input
                                  value={values.nameOrAdress}
                                  onChange={(e) => {
                                    let query = { ...values };
                                    query.nameOrAdress = e.target.value;
                                    setFieldValue(
                                      "nameOrAdress",
                                      query.nameOrAdress
                                    );

                                    if (this.nameOrAdressTimer) {
                                      clearTimeout(this.nameOrAdressTimer);
                                    }
                                    this.nameOrAdressTimer = setTimeout(() => {
                                      this.handleFilter(query);
                                    }, 800);
                                  }}
                                  placeholder="Tên CTV/Địa chỉ"
                                />
                              </div>
                              <div className="col-md-3">
                                <Input
                                  value={values.phone}
                                  onChange={(e) => {
                                    let query = { ...values };
                                    query.phone = e.target.value;
                                    setFieldValue("phone", query.phone);

                                    if (this.phoneTimer) {
                                      clearTimeout(this.phoneTimer);
                                    }
                                    this.phoneTimer = setTimeout(() => {
                                      this.handleFilter(query);
                                    }, 800);
                                  }}
                                  placeholder="Số điện thoại"
                                />
                              </div>
                              <div className="col-md-3">
                                <Input
                                  value={values.email}
                                  onChange={(e) => {
                                    let query = { ...values };
                                    query.email = e.target.value;
                                    setFieldValue("email", query.email);

                                    if (this.emailTimer) {
                                      clearTimeout(this.emailTimer);
                                    }
                                    this.emailTimer = setTimeout(() => {
                                      this.handleFilter(query);
                                    }, 800);
                                  }}
                                  placeholder="Email"
                                />
                              </div>
                            </div>
                            <div className="row mt-2">
                              <div className="col-md-3">
                                <Input
                                  value={values.taxCode}
                                  onChange={(e) => {
                                    let query = { ...values };
                                    query.taxCode = e.target.value;
                                    setFieldValue("taxCode", query.taxCode);

                                    if (this.taxCodeTimer) {
                                      clearTimeout(this.taxCodeTimer);
                                    }
                                    this.taxCodeTimer = setTimeout(() => {
                                      this.handleFilter(query);
                                    }, 800);
                                  }}
                                  placeholder="Mã số thuế"
                                />
                              </div>
                              <div className="col-md-3">
                                <CitySelect
                                  mode="multiple"
                                  value={values.citys}
                                  onSelect={(citys) => {
                                    setFieldValue("citys", citys);
                                    let query = { ...values };
                                    query.citys = citys;

                                    if (this.citysTimer) {
                                      clearTimeout(this.citysTimer);
                                    }
                                    this.citysTimer = setTimeout(() => {
                                      this.handleFilter(query);
                                    }, 800);
                                  }}
                                />
                              </div>
                              <div className="col-md-3">
                                <Select
                                  allowClear
                                  showArrow
                                  mode={"multiple"}
                                  value={values.status}
                                  placeholder="Trạng thái"
                                  onChange={(status) => {
                                    setFieldValue("status", status);
                                    let query = { ...values };
                                    query.status = status;

                                    if (this.statusTimer) {
                                      clearTimeout(this.statusTimer);
                                    }
                                    this.statusTimer = setTimeout(() => {
                                      this.handleFilter(query);
                                    }, 800);
                                  }}
                                  style={{ width: "100%" }}
                                  optionFilterProp="children"
                                  filterOption={(input, option) =>
                                    option.props.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                >
                                  {STATUS.map((status, statusId) => {
                                    return (
                                      <Option
                                        key={statusId}
                                        value={status.value}
                                      >
                                        {status.label}
                                      </Option>
                                    );
                                  })}
                                </Select>
                              </div>
                            </div>
                          </div>
                        </form>
                      );
                    }}
                  </Formik>
                  <div className="kt-portlet__body">
                    <PartnerList
                      dataSource={organization.grid}
                      onReadPartner={this.handleReadPartner}
                      onDeletePartner={this.handleDeletePartner}
                      onChangeCurrentPage={this.changeCurrentPage}
                      onChangePageSize={this.changePageSize}
                      currentPage={organization.currentPage}
                      pageLimit={organization.pageLimit}
                      totalLength={organization.totalLength}
                      loading={organization.loading}
                    />
                  </div>
                </div>
                <div
                  className={classNames({
                    "tab-pane": true,
                    active: tabId === 2,
                  })}
                >
                  <Formik
                    enableReinitialize={true}
                    initialValues={partner.query}
                    onSubmit={(values) => {
                      let query = { ...values };
                      browsePartner({ currentPage: 0, query: query });
                    }}
                  >
                    {({
                      values,
                      setSubmitting,
                      setFieldValue,
                      handleSubmit,
                    }) => {
                      return (
                        <form className="kt-form">
                          <div className="kt-portlet__head kt-portlet__head--lg border-bottom-0">
                            <div className="kt-portlet__head-label"></div>
                            <div className="kt-portlet__head-toolbar">
                              <div className="kt-portlet__head-wrapper">
                                <a
                                  onClick={(e) => {
                                    values.codes = "";
                                    values.nameOrAdress = "";
                                    values.email = "";
                                    values.phone = "";
                                    values.status = [];
                                    values.citys = [];
                                    values.startDate = "";
                                    values.endDate = "";
                                    values.taxCode = "";
                                    setSubmitting(true);
                                    handleSubmit();
                                  }}
                                  className="btn btn-clean btn-icon-sm"
                                >
                                  Xóa bộ lọc
                                </a>
                                &nbsp;
                                <button
                                  onClick={(e) =>
                                    this.handleShowPartnerModal(true, "create")
                                  }
                                  type="button"
                                  className="btn btn-brand btn-icon-sm"
                                >
                                  <i className="flaticon2-plus" />
                                  Thêm CTV
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="kt-portlet__body pb-0 pt-0">
                            <div className="row">
                              <div className="col-md-3">
                                <Input
                                  value={values.codes}
                                  onChange={(e) => {
                                    let query = { ...values };
                                    query.codes = e.target.value;
                                    setFieldValue("codes", query.codes);

                                    if (this.codesTimer) {
                                      clearTimeout(this.codesTimer);
                                    }
                                    this.codesTimer = setTimeout(() => {
                                      this.handleFilter(query);
                                    }, 800);
                                  }}
                                  placeholder="Mã CTV"
                                />
                              </div>
                              <div className="col-md-3">
                                <Input
                                  value={values.nameOrAdress}
                                  onChange={(e) => {
                                    let query = { ...values };
                                    query.nameOrAdress = e.target.value;
                                    setFieldValue(
                                      "nameOrAdress",
                                      query.nameOrAdress
                                    );

                                    if (this.nameOrAdressTimer) {
                                      clearTimeout(this.nameOrAdressTimer);
                                    }
                                    this.nameOrAdressTimer = setTimeout(() => {
                                      this.handleFilter(query);
                                    }, 800);
                                  }}
                                  placeholder="Tên CTV hoặc địa chỉ"
                                />
                              </div>
                              <div className="col-md-3">
                                <Input
                                  value={values.phone}
                                  onChange={(e) => {
                                    let query = { ...values };
                                    query.phone = e.target.value;
                                    setFieldValue("phone", query.phone);

                                    if (this.phoneTimer) {
                                      clearTimeout(this.phoneTimer);
                                    }
                                    this.phoneTimer = setTimeout(() => {
                                      this.handleFilter(query);
                                    }, 800);
                                  }}
                                  placeholder="Số điện thoại"
                                />
                              </div>
                              <div className="col-md-3">
                                <Input
                                  value={values.email}
                                  onChange={(e) => {
                                    let query = { ...values };
                                    query.email = e.target.value;
                                    setFieldValue("email", query.email);

                                    if (this.emailTimer) {
                                      clearTimeout(this.emailTimer);
                                    }
                                    this.emailTimer = setTimeout(() => {
                                      this.handleFilter(query);
                                    }, 800);
                                  }}
                                  placeholder="Email"
                                />
                              </div>
                            </div>
                            <div className="row mt-2">
                              <div className="col-md-3">
                                <Input
                                  value={values.taxCode}
                                  onChange={(e) => {
                                    let query = { ...values };
                                    query.taxCode = e.target.value;
                                    setFieldValue("taxCode", query.taxCode);

                                    if (this.taxCodeTimer) {
                                      clearTimeout(this.taxCodeTimer);
                                    }
                                    this.taxCodeTimer = setTimeout(() => {
                                      this.handleFilter(query);
                                    }, 800);
                                  }}
                                  placeholder="Mã số thuế"
                                />
                              </div>
                              <div className="col-md-3">
                                <CitySelect
                                  mode="multiple"
                                  value={values.citys}
                                  onSelect={(citys) => {
                                    setFieldValue("citys", citys);
                                    let query = { ...values };
                                    query.citys = citys;

                                    if (this.citysTimer) {
                                      clearTimeout(this.citysTimer);
                                    }
                                    this.citysTimer = setTimeout(() => {
                                      this.handleFilter(query);
                                    }, 800);
                                  }}
                                />
                              </div>
                              <div className="col-md-3">
                                <Select
                                  allowClear
                                  showArrow
                                  mode={"multiple"}
                                  value={values.status}
                                  placeholder="Trạng thái"
                                  onChange={(status) => {
                                    setFieldValue("status", status);
                                    let query = { ...values };
                                    query.status = status;

                                    if (this.statusTimer) {
                                      clearTimeout(this.statusTimer);
                                    }
                                    this.statusTimer = setTimeout(() => {
                                      this.handleFilter(query);
                                    }, 800);
                                  }}
                                  style={{ width: "100%" }}
                                  optionFilterProp="children"
                                  filterOption={(input, option) =>
                                    option.props.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                >
                                  {STATUS.map((status, statusId) => {
                                    return (
                                      <Option
                                        key={statusId}
                                        value={status.value}
                                      >
                                        {status.label}
                                      </Option>
                                    );
                                  })}
                                </Select>
                              </div>
                            </div>
                          </div>
                        </form>
                      );
                    }}
                  </Formik>
                  <div className="kt-portlet__body">
                    <PartnerList
                      dataSource={partner.grid}
                      onReadPartner={this.handleReadPartner}
                      onDeletePartner={this.handleDeletePartner}
                      onChangeCurrentPage={this.changeCurrentPage}
                      onChangePageSize={this.changePageSize}
                      currentPage={partner.currentPage}
                      pageLimit={partner.pageLimit}
                      totalLength={partner.totalLength}
                      loading={partner.loading}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Drawer
          id="partnerDrawer"
          placement="right"
          destroyOnClose
          closable={false}
          visible={isShow}
          width={
            actionName === "create"
              ? "680px"
              : actionName === "edit"
              ? "100%"
              : "0px"
          }
          onClose={(e) => this.handleShowPartnerModal(false, "")}
        >
          {tabId === 1 ? (
            <PartnerModal
              spinning={organization.spinning}
              filterDatetime={filterDatetime}
              onClose={(e) => this.handleShowPartnerModal(false, "")}
              dataSource={partnerData}
              listPartnerCost={listPartnerCost}
              costLoading={costLoading}
              actionName={actionName}
              isShow={isShow}
              onChangeFilterDateTime={(uuid, filterDatetime) => {
                this.setState({
                  filterDatetime: filterDatetime,
                });
                setTimeout((e) => {
                  costPartnerSearch(uuid, filterDatetime);
                }, 800);
              }}
              onCreate={this.handleAddPartner}
              onSave={this.handleEditPartner}
              onSaveCostPer={this.handleSaveCostPer}
              onSaveCost={this.handleSaveCost}
            />
          ) : (
            <PartnerCTVModal
              spinning={partner.spinning}
              onClose={(e) => this.handleShowPartnerModal(false, "")}
              dataSource={partnerData}
              listPartnerCost={listPartnerCost}
              costLoading={costLoading}
              filterDatetime={filterDatetime}
              onChangeFilterDateTime={(uuid, filterDatetime) => {
                this.setState({
                  filterDatetime: filterDatetime,
                });
                setTimeout((e) => {
                  costPartnerSearch(uuid, filterDatetime);
                }, 800);
              }}
              actionName={actionName}
              isShow={isShow}
              onCreate={this.handleAddPartner}
              onSave={this.handleEditPartner}
              onSaveCostPer={this.handleSaveCostPer}
              onSaveCost={this.handleSaveCost}
            />
          )}
        </Drawer>
      </div>
    );
  }

  handleAddPartner = (data) => {
    let { tabId } = this.props.Partner;
    if (tabId === 1) {
      this.props.addOrganization(data);
    } else {
      this.props.addPartner(data);
    }
  };

  handleEditPartner = (data) => {
    let { tabId } = this.props.Partner;
    if (tabId === 1) {
      this.props.editOrganization(data);
    } else {
      this.props.editPartner(data);
    }
  };

  handleReadPartner = (param) => {
    let { tabId } = this.props.Partner;
    let { filterDatetime } = this.state;
    if (tabId === 1) {
      this.props.showModal({ isShow: true, actionName: "edit" });
      setTimeout(() => {
        this.props.readOrganization({ param, filterDatetime });
      }, 800);
    } else {
      this.props.showModal({ isShow: true, actionName: "edit" });
      setTimeout(() => {
        this.props.readPartner({ param, filterDatetime });
      }, 800);
    }
  };

  handleSaveRouteCost = (rows) => {
    this.props.savePersonalRouteCost(rows);
  };

  handleSaveCostPer = (data, listPersonalCost) => {
    this.props.savePartnerRouteCostPer(data, listPersonalCost);
  };

  handleSaveCost = (data, listPersonalCost) => {
    this.props.savePartnerRouteCost(data, listPersonalCost);
  };

  handleDeletePartner = (rowData) => {
    let { tabId } = this.props.Partner;
    if (tabId === 1) {
      this.props.deleteOrganization({ uuid: rowData.uuid });
    } else {
      this.props.deletePartner({ uuid: rowData.uuid });
    }
  };

  handleShowPartnerModal = (isShow, actionName) => {
    this.props.showModal({ isShow: isShow, actionName: actionName });
  };

  changeCurrentPage = (currentPage) => {
    let { tabId } = this.props.Partner;
    let paramName = tabId === 1 ? "ORGANIZATION" : "PARTNER";
    let initParam = {};
    if (appParam[APP_MODULE.PARTNER]) {
      initParam = appParam[APP_MODULE.PARTNER][paramName] || {};
    }
    initParam["currentPage"] = currentPage;
    this.props.onPageChange(initParam, tabId);
  };

  changePageSize = (pageSize) => {
    let { tabId } = this.props.Partner;
    let paramName = tabId === 1 ? "ORGANIZATION" : "PARTNER";
    let initParam = {};
    if (appParam[APP_MODULE.PARTNER]) {
      initParam = appParam[APP_MODULE.PARTNER][paramName] || {};
    }
    initParam["pageLimit"] = pageSize;
    initParam["currentPage"] = 0;
    this.props.onPageChange(initParam, tabId);
  };

  handleChangeTab = (tabId) => {
    this.props.changeTab(tabId);
  };
}

const mapStateToProps = (store) => {
  return {
    Partner: store.Partner.toJS(),
  };
};
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showModal,
      browseOrganization,
      browsePartner,
      savePartnerRouteCostPer,
      savePartnerRouteCost,
      onPageChange,
      changeTab,
      readOrganization,
      readPartner,
      deletePartner,
      deleteOrganization,
      costPartnerSearch,
      addOrganization,
      editOrganization,
      addPartner,
      editPartner,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles({})(PartnerManagement));
