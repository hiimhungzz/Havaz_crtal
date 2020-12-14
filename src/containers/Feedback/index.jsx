import React from "react";
import { Button, Card, Col, Form, Input, Row, Select, Tabs, Spin } from "antd";

import FeedBackShowList from "./FeedBackList";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import CategoryModal from "../../components/Modals/category/CategoryModal";
import { Formik } from "formik";
import moment from "moment";
import { actions as FeedBackList } from "../../redux/feedBack/actions";
import { SelectDriver } from "../../components/Utility/common";
import classNames from "classnames";

const {
  showModel,
  feedBackSearch,
  onPageChange,
  updateFeedBack,
} = FeedBackList;
class FeedBackManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selection: [],
      isShowAddNewDriverModal: false,
      listFeedBack: [],
      listDriverParner: [],
      rowData: [],
      paging: {
        pageSize: 10,
        pages: 1,
        orderBy: {
          name: 1,
        },
        searchInput: "",
      },
      loading: false,
      isShowImport: false,
    };
    this.onSelectChange = this.onSelectChange.bind(this);
    this.changeSelection = this.changeSelection.bind(this);

    this.showDrawer = this.showDrawer.bind(this);
    this.onClose = this.onClose.bind(this);
    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
    this.queryString = this.queryString.bind(this);
    this.loadData = this.loadData.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleCloseUpload = this.handleCloseUpload.bind(this);
    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.handleEditFeedBack = this.handleEditFeedBack.bind(this);
  }

  componentDidMount() {
    let initParam = {};
    if (localStorage.getItem("AppParam")) {
      let appParam = JSON.parse(localStorage.getItem("AppParam"));
      if (appParam["FeedBack"]) {
        initParam = appParam["FeedBack"];
      }
    }
    this.props.feedBackSearch(initParam);
    this.loadData();
  }
  showDrawer() {
    this.props.showModel(true);
  }
  onClose() {
    this.props.showModel(false);
  }
  queryString() {
    const { pageSize, pages } = this.props.FeedBack;
    return `lastQuery:?take=${pageSize}&skip=${pageSize * pages}`;
  }

  loadData() {
    const queryString = this.queryString();
    this.props.feedBackSearch("", 5, 0);
    this.lastQuery = queryString;
  }

  render() {
    const { listFeedBack } = this.props.FeedBack;
    const {
      loading,
      isShow,
      actionName,
      rowData,
      total,
      pages,
      query,
      pageSize,
      tabId,
    } = this.props.FeedBack;
    const formLayout = "inline";
    const formItemLayout =
      formLayout === "horizontal"
        ? {
            labelCol: { span: 1 },
            wrapperCol: { span: 17 },
          }
        : null;
    const buttonItemLayout =
      formLayout === "horizontal"
        ? {
            wrapperCol: { span: 14, offset: 4 },
          }
        : null;

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
                    PHẢN HỒi
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
                        this.props.feedBackSearch({ query: query });
                        setSubmitting(false);
                      }, 400);
                    }}
                  >
                    {({
                      values,
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
                                onClick={() => {
                                  values.userType = "";

                                  setSubmitting(true);
                                  handleSubmit();
                                }}
                                className="btn btn-clean btn-icon-sm"
                              >
                                Xóa bộ lọc
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="kt-portlet__body pb-0 pt-0">
                          <div className="row">
                            <div className="col-md-3">
                              <SelectDriver
                                value={
                                  values.userType
                                    ? {
                                        key: values.userType
                                          ? values.userType
                                          : "",
                                        label: values.name
                                          ? values.names
                                          : undefined,
                                      }
                                    : undefined
                                }
                                onChange={(e) => {
                                  values.userType = e.key ? e.key : "";
                                  values.name = e.label ? e.label : "";
                                  let query = { ...values };
                                  setFieldValue("userType", values.userType);
                                  this.props.feedBackSearch({ query: query });
                                }}
                                url="entry"
                                type="roleFeedBack"
                                placeholder="Nguồn đánh giá"
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
                  </Formik>
                  <div className="kt-portlet__body">
                    <FeedBackShowList
                      dataSource={listFeedBack}
                      currentPage={pages}
                      pageLimit={pageSize}
                      loading={loading}
                      totalLength={total}
                      handleEditFeedBack={this.handleEditFeedBack}
                      onChangeCurrentPage={this.changeCurrentPage}
                      onChangePageSize={this.changePageSize}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <CategoryModal
            dataSource={rowData}
            //   dataStatus={selectStatus}
            isShow={isShow}
            actionName={actionName}
            onCreate={this.handleCreateCreate}
            onSave={this.handleSaveCategory}
            onClose={this.onClose}
            onClick={this.showDrawer}
          />
        </div>
      </div>
    );
  }

  onShowSizeChange(current, pageSize) {}

  handleShowAddNewDriverModal() {
    this.props.driverParnerShowModal(true, "create");
  }
  handleEditFeedBack(rowData) {
    let currentRow = this.props.FeedBack.listFeedBackSuccess.find(
      (x) => x.uuid === rowData.key
    );
    this.props.updateFeedBack(currentRow);
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

  handleChangeTab(tabId) {
    this.props.changeTab(tabId);
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
      this.props.FeedBack.pageSize,
      pages,
      this.props.FeedBack.query
    );
  }

  changePageSize(pageSize) {
    this.props.onPageChange(
      pageSize,
      this.props.FeedBack.pages,
      this.props.FeedBack.query
    );
  }
}
const mapStateToProps = (store) => {
  return {
    FeedBack: store.FeedBack.toJS(),
  };
};
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showModel,
      feedBackSearch,
      onPageChange,
      updateFeedBack,
    },
    dispatch
  );
const App = Form.create()(FeedBackManagement);
export default connect(mapStateToProps, mapDispatchToProps)(App);
