import React from "react";
import { DatePicker, Form, Input, Select, Tabs, Spin } from "antd";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import DefineModel from "../../components/Modals/define/DefineModel";
import DefineList from "./DefineList";
import { Formik } from "formik";
import moment from "moment";

import { actions as DefineAction } from "../../redux/define/actions";
import classNames from "classnames";
import Category from "../Category";
const {
  defineSearch,
  changeTab,
  showModalDefine,
  createDefine,
  saveDefine,
  deleteDefine,
  onPageChange,
  showDefine
} = DefineAction;

class Define extends React.Component {
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

    this.handleViewDefine = this.handleViewDefine.bind(this);
    this.handleEditDefine = this.handleEditDefine.bind(this);
    this.handleDeleteDefine = this.handleDeleteDefine.bind(this);
    this.showDrawer = this.showDrawer.bind(this);
    this.onClose = this.onClose.bind(this);

    this.handlecreateDefine = this.handlecreateDefine.bind(this);
    this.handlesaveDefine = this.handlesaveDefine.bind(this);
    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
    this.queryString = this.queryString.bind(this);
    this.loadData = this.loadData.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleCloseUpload = this.handleCloseUpload.bind(this);
    this.handleChangeTab = this.handleChangeTab.bind(this);
  }

  componentDidMount() {
    const { tabId } = this.props.Define;
    if (tabId === "1") {
      let initParam = {};
      if (localStorage.getItem("AppParam")) {
        let appParam = JSON.parse(localStorage.getItem("AppParam"));
        if (appParam["Driver"]) {
          initParam = appParam["Driver"];
        }
      }
      this.props.defineSearch(initParam);
    }

    this.loadData();
  }
  showDrawer() {
    this.props.showModalDefine(true);
  }
  onClose() {
    this.props.showModalDefine(false);
  }

  queryString() {
    const {
      pageSize,
      pages,
      tabId,
      pageSizeType,
      pagesType
    } = this.props.Define;
    if (tabId === "1") {
      return `lastQuery:?take=${pageSize}&skip=${pageSize * pages}`;
    } else {
      return `lastQuery:?take=${pageSizeType}&skip=${pageSizeType * pagesType}`;
    }
  }

  loadData() {
    const { tabId } = this.props.Define;
    const queryString = this.queryString();
    if (tabId == "1") {
      this.props.defineSearch("", 5, 0, true, "1", []);
    }
    this.lastQuery = queryString;
  }

  render() {
    const {
      loading,
      isShow,
      actionName,
      rowData,
      total,
      pages,
      query,
      pageSize,
      selectStatus,
      tabId,
      listDefine,
      listDefineSuccess,
      typeDefine
    } = this.props.Define;
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
                    DANH MỤC TIÊU CHÍ
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
                        this.props.defineSearch({ query: query });
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
                                onClick={this.handleViewDefine}
                                type="button"
                                className="btn btn-brand btn-icon-sm"
                              >
                                <i className="flaticon2-plus" />
                                Thêm tiêu chí
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
                                    this.props.defineSearch({ query: query });
                                  }, 800);
                                }}
                                placeholder="Danh mục tiêu chí"
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
                  </Formik>
                  <div className="kt-portlet__body">
                    <DefineList
                      dataSource={listDefine}
                      typeDefine={typeDefine}
                      dataGroup={listDefineSuccess}
                      currentPage={pages}
                      pageLimit={pageSize}
                      loading={loading}
                      totalLength={total}
                      handleViewDefine={this.handleViewDefine}
                      handleEditDefine={this.handleEditDefine}
                      handleDeleteDefine={this.handleDeleteDefine}
                      onChangeCurrentPage={this.changeCurrentPage}
                      onChangePageSize={this.changePageSize}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DefineModel
            typeDefine={typeDefine}
            dataSource={rowData}
            dataStatus={selectStatus}
            isShow={isShow}
            actionName={actionName}
            onCreate={this.handlecreateDefine}
            onSave={this.handlesaveDefine}
            onDelete={this.handleDeleteDefine}
            onClose={this.onClose}
            onClick={this.showDrawer}
          />
        </div>
      </div>
    );
  }

  onShowSizeChange() {}

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

  handleChangeTab(tabId) {
    this.props.changeTab(tabId);
  }
  handleViewDefine(rowData) {
    let currentRow = this.props.Define.listDefineSuccess.find(
      x => x.id === rowData.key
    );
    this.props.showModalDefine(true, "create", currentRow ? currentRow : {});

    // this.setState({
    //   visible: true
    // });
  }
  handleEditDefine(rowData) {
    let currentRow = this.props.Define.listDefineSuccess.find(
      x => x.id === rowData.key
    );
    this.props.showModalDefine(true, "edit");
    this.props.showDefine(rowData.id);

    // this.setState({
    //   visible: true
    // });
  }

  handlecreateDefine(data) {
    this.props.createDefine(data);
  }
  handlesaveDefine(data) {
    this.props.saveDefine(data);
  }
  handleDeleteDefine(data) {
    this.props.deleteDefine(data);
  }

  changeCurrentPage(pages) {
    this.props.onPageChange(
      "",
      this.props.Define.pageSize,
      pages,
      this.props.Define.tabId,
      this.props.Define.query
    );
  }

  changePageSize(pageSize) {
    this.props.onPageChange(
      "",
      pageSize,
      this.props.Define.pages,
      this.props.Define.tabId,
      this.props.Define.query
    );
  }
}

const mapStateToProps = store => {
  return {
    Define: store.Define.toJS()
  };
};
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      defineSearch,
      changeTab,
      showModalDefine,
      createDefine,
      saveDefine,
      deleteDefine,
      onPageChange,
      showDefine
    },
    dispatch
  );
const App = Form.create()(Define);
export default connect(mapStateToProps, mapDispatchToProps)(App);
