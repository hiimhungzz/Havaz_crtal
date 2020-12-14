/* eslint-disable jsx-a11y/anchor-is-valid */
import { Drawer, Input, Select } from "antd";
import classNames from "classnames";
import { Formik } from "formik";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { STATUS, APP_MODULE } from "@Constants/common";
import { actions as customerActions } from "../../redux/customer/actions";
import CustomersModal from "../../components/Modals/customer/CustomersModal";
import CompanyList from "./CompanyList";
import PersonalList from "./PersonalList";
import { appParam, isEmpty } from "@Helpers/utility";
import moment from "moment";
const {
  browseOrganization,
  browsePartner,
  citySearch,
  costCustomerSearch,
  readOrganization,
  readPartner,

  addOrganization,
  editOrganization,

  addPartner,
  editPartner,
  showModal,
  deleteOrganization,
  deletePartner,

  saveCustomerRouteCost,
  saveCustomerRouteCostPer,
  onPageChange,
  changeTab
} = customerActions;

const Option = Select.Option;

class CustomersManagement extends React.Component {
  state = {
    filterDatetime: moment()
  };

  handleFilter = query => {
    let { tabId } = this.props.Customer;
    if (tabId === 1) {
      let initParam = appParam[APP_MODULE.CUSTOMERS]
        ? isEmpty(appParam[APP_MODULE.CUSTOMERS]["ORGANIZATION"], {})
        : {};
      this.props.browseOrganization({
        ...initParam,
        currentPage: 0,
        query: query
      });
    } else {
      let initParam = appParam[APP_MODULE.CUSTOMERS]
        ? isEmpty(appParam[APP_MODULE.CUSTOMERS]["PARTNER"], {})
        : {};
      this.props.browsePartner({ ...initParam, currentPage: 0, query: query });
    }
  };
  handleReadCustomer = param => {
    let { tabId } = this.props.Customer;
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
  handleDeleteCustomer = param => {
    let { tabId } = this.props.Customer;
    if (tabId === 1) {
      this.props.deleteOrganization({ uuid: param.uuid });
    } else {
      this.props.deletePartner({ uuid: param.uuid });
    }
  };
  handleCreateCustomer = data => {
    let { tabId } = this.props.Customer;
    if (tabId === 1) {
      this.props.addOrganization(data);
    } else {
      this.props.addPartner(data);
    }
  };

  handleSaveCustomer = data => {
    let { tabId } = this.props.Customer;
    if (tabId === 1) {
      this.props.editOrganization(data);
    } else {
      this.props.editPartner(data);
    }
  };
  handleSaveCostPer = data => {
    this.props.saveCustomerRouteCostPer(data);
  };

  handleSaveCost = data => {
    this.props.saveCustomerRouteCost(data);
  };
  loadData = () => {
    let { tabId } = this.props.Customer;
    this.props.citySearch("");

    if (tabId === 1) {
      let initParam = appParam[APP_MODULE.CUSTOMERS]
        ? isEmpty(appParam[APP_MODULE.CUSTOMERS]["ORGANIZATION"], {})
        : {};
      this.props.browseOrganization(initParam);
    } else {
      let initParam = appParam[APP_MODULE.CUSTOMERS]
        ? isEmpty(appParam[APP_MODULE.CUSTOMERS]["PARTNER"], {})
        : {};
      this.props.browsePartner(initParam);
    }
  };

  componentDidMount() {
    setTimeout(() => {
      this.loadData();
    }, 200);
  }

  render() {
    const {
      browseOrganization,
      browsePartner,
      Customer,
      costCustomerSearch
    } = this.props;
    const {
      listCity,
      isShow,
      actionName,
      tabId,
      organization,
      partner,
      customerData,
      listCustomerCost,
      costCustomerLoading
    } = Customer;
    const { filterDatetime } = this.state;
    return (
      <div className="row">
        <div className="col">
          <div className="kt-portlet">
            <div className="kt-portlet__body kt-portlet__body--fit">
              <ul
                style={{
                  paddingLeft: 25
                }}
                className="nav nav-tabs nav-tabs-line nav-tabs-line-primary mb-0"
              >
                <li className="nav-item">
                  <a
                    className={classNames({
                      "nav-link": true,
                      active: tabId === 1
                    })}
                    data-toggle="tab"
                    onClick={() => this.handleChangeTab(1)}
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
                      active: tabId === 2
                    })}
                    data-toggle="tab"
                    onClick={() => this.handleChangeTab(2)}
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
                    active: tabId === 1
                  })}
                >
                  {tabId === 1 && (
                    <>
                      <Formik
                        enableReinitialize={true}
                        initialValues={organization.query}
                        onSubmit={values => {
                          let query = { ...values };
                          browseOrganization({ query });
                        }}
                      >
                        {({
                          values,
                          setSubmitting,
                          setFieldValue,
                          handleSubmit
                        }) => {
                          return (
                            <form className="kt-form">
                              <div className="kt-portlet__head kt-portlet__head--lg border-bottom-0">
                                <div className="kt-portlet__head-label"></div>
                                <div className="kt-portlet__head-toolbar">
                                  <div className="kt-portlet__head-wrapper">
                                    <a
                                      onClick={() => {
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
                                      onClick={this.handleShowCustomerModal}
                                      type="button"
                                      className="btn btn-brand btn-icon-sm"
                                    >
                                      <i className="flaticon2-plus" />
                                      Thêm mới
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="kt-portlet__body pb-0 pt-0">
                                <div className="row">
                                  <div className="col-md-3">
                                    <Input
                                      value={values.codes}
                                      onChange={e => {
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
                                      placeholder="Mã khách hàng"
                                    />
                                  </div>
                                  <div className="col-md-3">
                                    <Input
                                      value={values.nameOrAdress}
                                      onChange={e => {
                                        let query = { ...values };
                                        query.nameOrAdress = e.target.value;
                                        setFieldValue(
                                          "nameOrAdress",
                                          query.nameOrAdress
                                        );

                                        if (this.nameOrAdressTimer) {
                                          clearTimeout(this.nameOrAdressTimer);
                                        }
                                        this.nameOrAdressTimer = setTimeout(
                                          () => {
                                            this.handleFilter(query);
                                          },
                                          800
                                        );
                                      }}
                                      placeholder="Tên DN/Địa chỉ"
                                    />
                                  </div>
                                  <div className="col-md-3">
                                    <Input
                                      value={values.phone}
                                      onChange={e => {
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
                                      onChange={e => {
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
                                      onChange={e => {
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
                                    <Select
                                      showArrow
                                      showSearch
                                      mode={"multiple"}
                                      value={values.citys}
                                      style={{ width: "100%" }}
                                      placeholder="Thành phố"
                                      filterOption={(input, option) =>
                                        option.props.children
                                          .toLowerCase()
                                          .indexOf(input.toLowerCase()) >= 0
                                      }
                                      onChange={citys => {
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
                                    >
                                      {listCity.map((city, cityIndex) => {
                                        return (
                                          <Select.Option
                                            key={cityIndex}
                                            value={city.uuid}
                                          >
                                            {city.cityname}
                                          </Select.Option>
                                        );
                                      })}
                                    </Select>
                                  </div>
                                  <div className="col-md-3">
                                    <Select
                                      showArrow
                                      mode={"multiple"}
                                      value={values.status}
                                      placeholder="Trạng thái"
                                      onChange={status => {
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
                        <CompanyList
                          dataSource={organization.grid}
                          onReadOrganization={this.handleReadCustomer}
                          onDeleteOrganization={this.handleDeleteCustomer}
                          onChangeCurrentPage={this.changeCurrentPage}
                          onChangePageSize={this.changePageSize}
                          currentPage={organization.currentPage}
                          pageLimit={organization.pageLimit}
                          totalLength={organization.totalLength}
                          loading={organization.loading}
                        />
                      </div>
                    </>
                  )}
                </div>
                <div
                  className={classNames({
                    "tab-pane": true,
                    active: tabId === 2
                  })}
                >
                  {tabId === 2 && (
                    <>
                      <Formik
                        enableReinitialize={true}
                        initialValues={partner.query}
                        onSubmit={values => {
                          let query = { ...values };
                          browsePartner({ currentPage: 0, query: query });
                        }}
                      >
                        {({
                          values,
                          handleSubmit,
                          setSubmitting,
                          setFieldValue
                        }) => {
                          return (
                            <form className="kt-form">
                              <div className="kt-portlet__head kt-portlet__head--lg border-bottom-0">
                                <div className="kt-portlet__head-label"></div>
                                <div className="kt-portlet__head-toolbar">
                                  <div className="kt-portlet__head-wrapper">
                                    <a
                                      onClick={() => {
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
                                        let query = { ...values };
                                        handleSubmit();
                                      }}
                                      className="btn btn-clean btn-icon-sm"
                                    >
                                      Xóa bộ lọc
                                    </a>
                                    &nbsp;
                                    <button
                                      onClick={this.handleShowCustomerModal}
                                      type="button"
                                      className="btn btn-brand btn-icon-sm"
                                    >
                                      <i className="flaticon2-plus" />
                                      Thêm mới
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="kt-portlet__body pb-0 pt-0">
                                <div className="row">
                                  <div className="col-md-4">
                                    <Input
                                      value={values.codes}
                                      onChange={e => {
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
                                      placeholder="Mã khách hàng"
                                    />
                                  </div>
                                  <div className="col-md-4">
                                    <Input
                                      value={values.nameOrAdress}
                                      onChange={e => {
                                        let query = { ...values };
                                        query.nameOrAdress = e.target.value;
                                        setFieldValue(
                                          "nameOrAdress",
                                          query.nameOrAdress
                                        );

                                        if (this.nameOrAdressTimer) {
                                          clearTimeout(this.nameOrAdressTimer);
                                        }
                                        this.nameOrAdressTimer = setTimeout(
                                          () => {
                                            this.handleFilter(query);
                                          },
                                          800
                                        );
                                      }}
                                      placeholder="Tên khách hàng hoặc địa chỉ"
                                    />
                                  </div>
                                  <div className="col-md-4">
                                    <Input
                                      value={values.phone}
                                      onChange={e => {
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
                                </div>
                                <div className="row mt-3">
                                  <div className="col-md-4">
                                    <Input
                                      value={values.email}
                                      onChange={e => {
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
                                  <div className="col-md-4">
                                    <Select
                                      showArrow
                                      showSearch
                                      mode={"multiple"}
                                      value={values.citys}
                                      style={{ width: "100%" }}
                                      placeholder="Thành phố"
                                      filterOption={(input, option) =>
                                        option.props.children
                                          .toLowerCase()
                                          .indexOf(input.toLowerCase()) >= 0
                                      }
                                      onChange={citys => {
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
                                    >
                                      {listCity.map((city, cityIndex) => {
                                        return (
                                          <Select.Option
                                            key={cityIndex}
                                            value={city.uuid}
                                          >
                                            {city.cityname}
                                          </Select.Option>
                                        );
                                      })}
                                    </Select>
                                  </div>
                                  <div className="col-md-4">
                                    <Select
                                      mode={"multiple"}
                                      value={values.status}
                                      placeholder="Trạng thái"
                                      onChange={status => {
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
                        <PersonalList
                          dataSource={partner.grid}
                          onReadPartner={this.handleReadCustomer}
                          onDeletePartner={this.handleDeleteCustomer}
                          onChangeCurrentPage={this.changeCurrentPage}
                          onChangePageSize={this.changePageSize}
                          currentPage={partner.currentPage}
                          pageLimit={partner.pageLimit}
                          totalLength={partner.totalLength}
                          loading={partner.loading}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Drawer
          id="customerDrawer"
          placement="right"
          destroyOnClose
          closable={false}
          visible={isShow}
          width={
            actionName === "create"
              ? "720px"
              : actionName === "edit"
              ? "100%"
              : "0px"
          }
          onClose={this.handleHideCustomerModal}
        >
          <CustomersModal
            spinning={tabId === 1 ? organization.spinning : partner.spinning}
            dataSource={customerData}
            listCustomerCost={listCustomerCost}
            filterDatetime={filterDatetime}
            onChangeFilterDateTime={(uuid, filterDatetime) => {
              this.setState({
                filterDatetime: filterDatetime
              });
              setTimeout(e => {
                costCustomerSearch(uuid, filterDatetime);
              }, 800);
            }}
            costCustomerLoading={costCustomerLoading}
            actionName={actionName}
            isShow={isShow}
            tabId={tabId}
            onClose={this.handleHideCustomerModal}
            onCreate={this.handleCreateCustomer}
            onSave={this.handleSaveCustomer}
            onSaveCostPer={this.handleSaveCostPer}
            onSaveCost={this.handleSaveCost}
          />
        </Drawer>
      </div>
    );
  }

  handleShowCustomerModal = () => {
    this.props.showModal({ isShow: true, actionName: "create" });
  };

  handleHideCustomerModal = () => {
    this.props.showModal({ isShow: false, actionName: "" });
  };

  changeCurrentPage = currentPage => {
    let { tabId } = this.props.Customer;
    let paramName = tabId === 1 ? "ORGANIZATION" : "PARTNER";
    let initParam = {};
    if (appParam[APP_MODULE.CUSTOMERS]) {
      initParam = appParam[APP_MODULE.CUSTOMERS][paramName] || {};
    }
    initParam["currentPage"] = currentPage;
    this.props.onPageChange(initParam, tabId);
  };

  changePageSize = pageSize => {
    let { tabId } = this.props.Customer;
    let paramName = tabId === 1 ? "ORGANIZATION" : "PARTNER";
    let initParam = {};
    if (appParam[APP_MODULE.CUSTOMERS]) {
      initParam = appParam[APP_MODULE.CUSTOMERS][paramName] || {};
    }
    initParam["pageLimit"] = pageSize;
    initParam["currentPage"] = 0;
    this.props.onPageChange(initParam, tabId);
  };

  handleChangeTab = tabId => {
    this.props.changeTab(tabId);
  };
}

const mapStateToProps = store => {
  return {
    Customer: store.Customer.toJS()
  };
};
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      saveCustomerRouteCostPer,
      saveCustomerRouteCost,
      readOrganization,
      readPartner,
      deleteOrganization,
      deletePartner,
      showModal,
      browseOrganization,
      browsePartner,
      costCustomerSearch,
      citySearch,
      addOrganization,
      editOrganization,
      addPartner,
      editPartner,
      onPageChange,
      changeTab
    },
    dispatch
  );
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomersManagement);
