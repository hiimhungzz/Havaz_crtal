import React from "react";
import { DatePicker, Form, Input, Select, Tabs, Spin } from "antd";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import CategoryModalServal from "../../components/Modals/categoryServal/CategoryModalServal";
import CategoryServalList from "./CategoryServalList";
import { Formik } from "formik";
import moment from "moment";

import { actions as categoryUserAction } from "../../redux/categoryUser/actions";
import classNames from "classnames";
import { requestJsonGet } from "../../services/base";
import Category from "../Category";
const {
  

} = categoryUserAction;


class CategoryServal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selection: [],
      isShowAddNewDriverModal: false,

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
  

    this.handleViewCategoryUser = this.handleViewCategoryUser.bind(this);
    this.handleEditCategoryUser = this.handleEditCategoryUser.bind(this);
    this.handleViewCategoryCtv = this.handleViewCategoryCtv.bind(this);
    this.handleEditCategoryCtv = this.handleEditCategoryCtv.bind(this);
    this.handleDeleteCategoryUser = this.handleDeleteCategoryUser.bind(this);
    this.showDrawer = this.showDrawer.bind(this);
    this.onClose = this.onClose.bind(this);

    this.handleCreateCategoryUser = this.handleCreateCategoryUser.bind(this);
    this.handleSaveCategoryUser = this.handleSaveCategoryUser.bind(this);
    this.handleCreateDriver = this.handleCreateDriver.bind(this);
    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
    this.queryString = this.queryString.bind(this);
    this.loadData = this.loadData.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleCloseUpload = this.handleCloseUpload.bind(this);
    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.showDrawerCtv = this.showDrawerCtv.bind(this);
    this.onCloseCtv = this.onCloseCtv.bind(this);
    this.handleCreateCategoryCtv = this.handleCreateCategoryCtv.bind(this);
    this.handleSaveCategoryCtv = this.handleSaveCategoryCtv.bind(this);
    this.handleDeleteCategoryCtv = this.handleDeleteCategoryCtv.bind(this);
    this.changePageSizeCategoryCtv = this.changePageSizeCategoryCtv.bind(this);
    this.changeCurrentPageCategoryCtv = this.changeCurrentPageCategoryCtv.bind(this);
    this.handleCreateCategoryPartner = this.handleCreateCategoryPartner.bind(this);
    this.handleSaveCategoryPartner = this.handleSaveCategoryPartner.bind(this);
    this.handleDeleteCategoryPartner = this.handleDeleteCategoryPartner.bind(this);
    this.changeCurrentPageCategoryPartner = this.changeCurrentPageCategoryPartner.bind(this);
    this.changePageSizeCategoryPartner = this.changePageSizeCategoryPartner.bind(this);
    this.handleViewCategoryPartner = this.handleViewCategoryPartner.bind(this);
    this.handleEditCategoryPartner = this.handleEditCategoryPartner.bind(this);
  }

  componentDidMount() {
    const { tabId } = this.props.Category;
    if (tabId === "1") {
      let initParam = {};
      if (localStorage.getItem("AppParam")) {
        let appParam = JSON.parse(localStorage.getItem("AppParam"));
        if (appParam["Driver"]) {
          initParam = appParam["Driver"];
        }
      }
      this.props.category_User_Search(initParam);
    }

    this.loadData();
  }
  showDrawer() {
    this.props.showModalCategoryUser(true);
  }
  onClose() {
    this.props.showModalCategoryUser(false);
  }
 

  queryString() {
    const {
      pageSize,
      pages,
      tabId,
      pageSizeType,
      pagesType,
      pageSizePartner,
      pagesPartner,
    } = this.props.Category;
    if (tabId === "1") {
      return `lastQuery:?take=${pageSize}&skip=${pageSize * pages}`;
    } 
  }

  loadData() {
    const { tabId } = this.props.Category;
    const queryString = this.queryString();
    if (tabId == "1") {
      this.props.category_User_Search("", 5, 0, true, "1", []);
    }
    
    this.lastQuery = queryString;
  }

  render() {


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
      totalCtv,
      pagesCtv,
      queryCtv,
      pageSizeCtv,
      selectStatus,
      tabId,
      isShowCtv,
      listCategoryUser,
      listCategoryCtv,
      listCategoryPartner,
      queryPartner,
      pageSizePartner,
      totalPartner,
      pagesPartner,
      isShowPartner
    } = this.props.Category;
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
                    KHÁCH HÀNG
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
                    LÁI XE CTV
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
                        this.props.category_User_Search({ query: query });
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
                                  onClick={this.handleViewCategoryUser}
                                  type="button"
                                  className="btn btn-brand btn-icon-sm"
                                >
                                  <i className="flaticon2-plus" />
                                  Thêm khách hàng
                              </button>
                              </div>
                            </div>
                          </div>
                          <div className="kt-portlet__body pb-0 pt-0">
                            <div className="row">
                              <div className="col-md-3">
                                <Input
                                  value={values.name || ""}
                                  onChange={e => {
                                    values.name = e.target.value
                                      ? e.target.value
                                      : "";
                                    let query = { ...values };
                                    setFieldValue("name", values.name);
                                    if (this.routeCodeTimer) {
                                      clearTimeout(this.routeCodeTimer);
                                    }
                                    this.routeCodeTimer = setTimeout(() => {
                                      this.props.category_User_Search({ query: query });
                                    }, 800);
                                  }}
                                  placeholder="Nhóm khách hàng"
                                />
                              </div>
                             
                             
                            </div>
                          </div>
                        </form>
                      )}
                  </Formik>
                  <div className="kt-portlet__body">
                    <CategoryModalServal
                      dataSource={listCategoryUser}
                      currentPage={pages}
                      pageLimit={pageSize}
                      loading={loading}
                      totalLength={total}
                      handleViewCategoryUser={this.handleViewCategoryUser}
                      handleEditCategoryUser={this.handleEditCategoryUser}
                      handleDeleteCategoryUser={this.handleDeleteCategoryUser}
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
                        let queryCtv = { ...values };
                        this.props.category_Ctv_Search({ queryCtv: queryCtv });
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
                                  onClick={this.handleViewCategoryCtv}
                                  type="button"
                                  className="btn btn-brand btn-icon-sm"
                                >
                                  <i className="flaticon2-plus" />
                                  Thêm nhóm CTV
                              </button>
                              </div>
                            </div>
                          </div>
                          <div className="kt-portlet__body pb-0 pt-0">
                            <div className="row">
                              <div className="col-md-2">
                                <Input
                                  value={values.name || ""}
                                  onChange={e => {
                                    values.name = e.target.value
                                      ? e.target.value
                                      : "";
                                    let queryCtv = { ...values };
                                    setFieldValue("name", values.name);
                                    if (this.routeCodeTimer) {
                                      clearTimeout(this.routeCodeTimer);
                                    }
                                    this.routeCodeTimer = setTimeout(() => {
                                      this.props.category_Ctv_Search({
                                        queryCtv: queryCtv
                                      });
                                    }, 800);
                                  }}
                                  placeholder="Nhóm CTV"
                                />
                              </div>
                             
                              
                            </div>
                          </div>
                        </form>
                      )}
                  </Formik>
                  <div className="kt-portlet__body">
                    <CategoryServalList
                      dataSource={listCategoryCtv}
                      currentPage={pagesCtv}
                      pageLimit={pageSizeCtv}
                      loading={loading}
                      totalLength={totalCtv}
                      handleViewCategoryCtv={this.handleViewCategoryCtv}
                      handleEditCategoryCtv={this.handleEditCategoryCtv}
                      handleDeleteCategoryCtv={this.handleDeleteCategoryCtv}
                      onChangeCurrentPage={this.changeCurrentPageCategoryCtv}
                      onChangePageSize={this.changePageSizeCategoryCtv}
                    />
                  </div>
                </div>
              </div>
              
            </div>
          </div>
           <CategoryServalList
            dataSource={rowData}
            dataStatus={selectStatus}
            isShow={isShow}
            actionName={actionName}
            onCreate={this.handleCreateCategoryUser}
            onSave={this.handleSaveCategoryUser}
            onDelete={this.handleDeleteCategoryUser}
            onClose={this.onClose}
            onClick={this.showDrawer}
          />
          
        </div>
      </div>
    );
  }

  onShowSizeChange() { }

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
  handleViewCategoryUser(rowData) {
    let currentRow = this.props.Category.listCategoryUserSuccess.find(
      x => x.id === rowData.key
    );
    this.props.showModalCategoryUser(true, "create", currentRow ? currentRow : {});
    // this.setState({
    //   visible: true
    // });
  }
  handleEditCategoryUser(rowData) {
    let currentRow = this.props.Category.listCategoryUserSuccess.find(
      x => x.id === rowData.key
    );
    this.props.showModalCategoryUser(true, "edit", currentRow ? currentRow : {});
    // this.setState({
    //   visible: true
    // });
  }
 
  handleCreateCategoryUser(data) {
    this.props.createCategoryUser(data);
  }
  handleSaveCategoryUser(data) {
    this.props.saveCategoryUser(data);
  }
  handleDeleteCategoryUser(data) {
    this.props.deleteCategoryUser(data);
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
      this.props.Category.pageSize,
      pages,
      this.props.Category.tabId,
      this.props.Category.query,
    );
  }

  changePageSize(pageSize) {
    this.props.onPageChange(
      "",
      pageSize,
      this.props.Category.pages,
      this.props.Category.tabId,
      this.props.Category.query,
    );
  }
  

}

const mapStateToProps = store => {
  return {
    Category: store.CategoryUser.toJS(),
  };
};
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      
    },
    dispatch
  );
const App = Form.create()(CategoryServal);
export default connect(mapStateToProps, mapDispatchToProps)(App);
