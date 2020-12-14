import React from "react";
import { Form, Input } from "antd";

import CreateList from "./CreateList";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import CategoryModal from "../../components/Modals/category/CategoryModal";
import { Formik } from "formik";
import { actions as categoryAction } from "../../redux/category/actions";
const {
  showModel,
  categorySearch,
  onPageChange,
  categoryCreate,
  categorySave,
  categoryDelete
} = categoryAction;

class CategoryManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selection: [],
      isShowAddNewDriverModal: false,
      listCategory: [],
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

    this.handleViewCategory = this.handleViewCategory.bind(this);
    this.handleSaveCategory = this.handleSaveCategory.bind(this);
    this.handleDeleteCategory = this.handleDeleteCategory.bind(this);
    this.showDrawer = this.showDrawer.bind(this);
    this.onClose = this.onClose.bind(this);
    this.handleCreateCreate = this.handleCreateCreate.bind(this);
    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
    this.queryString = this.queryString.bind(this);
    this.loadData = this.loadData.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleCloseUpload = this.handleCloseUpload.bind(this);
    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.handleEditCategory = this.handleEditCategory.bind(this);
  }

  componentDidMount() {
    let initParam = {};
    if (localStorage.getItem("AppParam")) {
      let appParam = JSON.parse(localStorage.getItem("AppParam"));
      if (appParam["Category"]) {
        initParam = appParam["Category"];
      }
    }
    this.props.categorySearch(initParam);
    this.loadData();
  }
  showDrawer() {
    this.props.showModel(true);
  }
  onClose() {
    this.props.showModel(false);
  }
  queryString() {
    const { pageSize, pages } = this.props.Category;
    return `lastQuery:?take=${pageSize}&skip=${pageSize * pages}`;
  }

  loadData() {
    const queryString = this.queryString();
    this.props.categorySearch("", 5, 0);
    this.lastQuery = queryString;
  }

  render() {
    const { listCategory } = this.props.Category;
    const {
      loading,
      isShow,
      actionName,
      rowData,
      total,
      pages,
      query,
      pageSize
    } = this.props.Category;
    return (
      <div className="row">
        <div className="col">
          <div className="kt-portlet">
            <div className="kt-portlet__body kt-portlet__body--fit">
              <Formik
                enableReinitialize={true}
                initialValues={query}
                onSubmit={(values, { setSubmitting }) => {
                  setTimeout(() => {
                    let query = { ...values };
                    this.props.categorySearch({ query: query });
                    setSubmitting(false);
                  }, 400);
                }}
              >
                {({ values, setFieldValue, handleSubmit, setSubmitting }) => (
                  <form className="kt-form">
                    <div className="kt-portlet__head kt-portlet__head--lg border-bottom-0">
                      <div className="kt-portlet__head-label"></div>
                      <div className="kt-portlet__head-toolbar">
                        <div className="kt-portlet__head-wrapper">
                          <button
                            onClick={e => {
                              e.preventDefault();
                              values.name = "";
                              values.refCode = "";
                              values.refAcount = "";
                              setSubmitting(true);
                              handleSubmit();
                            }}
                            className="btn btn-clean btn-icon-sm"
                          >
                            Xóa bộ lọc
                          </button>
                          &nbsp;
                          <button
                            onClick={this.handleViewCategory}
                            type="button"
                            className="btn btn-brand btn-icon-sm"
                          >
                            <i className="flaticon2-plus" />
                            Thêm chi phí
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="kt-portlet__body pb-0 pt-0">
                      <div className="row">
                        <div className="col-md-4">
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
                                this.props.categorySearch({ query: query });
                              }, 800);
                            }}
                            placeholder="Tên danh mục"
                          />
                        </div>
                        <div className="col-md-4">
                          <Input
                            value={values.refCode || ""}
                            onChange={e => {
                              values.refCode = e.target.value
                                ? e.target.value
                                : "";
                              setFieldValue("refCode", values.refCode);
                              let query = { ...values };
                              if (this.routeCodeTimer) {
                                clearTimeout(this.routeCodeTimer);
                              }
                              this.routeCodeTimer = setTimeout(() => {
                                this.props.categorySearch({ query: query });
                              }, 800);
                            }}
                            placeholder="Mã chi phí"
                          />
                        </div>
                        <div className="col-md-4">
                          <Input
                            value={values.refAcount || ""}
                            onChange={e => {
                              values.refAcount = e.target.value
                                ? e.target.value
                                : "";
                              setFieldValue("refAcount", values.refAcount);
                              let query = { ...values };
                              if (this.routeCodeTimer) {
                                clearTimeout(this.routeCodeTimer);
                              }
                              this.routeCodeTimer = setTimeout(() => {
                                this.props.categorySearch({ query: query });
                              }, 800);
                            }}
                            placeholder="Tài khoản"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
            <div className="kt-portlet__body">
              <CreateList
                dataSource={listCategory}
                currentPage={pages}
                pageLimit={pageSize}
                loading={loading}
                totalLength={total}
                handleViewCategory={this.handleViewDriver}
                handleEditCategory={this.handleEditCategory}
                deleteCategory={this.handleDeleteCategory}
                onChangeCurrentPage={this.changeCurrentPage}
                onChangePageSize={this.changePageSize}
              />
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
  handleViewCategory() {
    this.props.showModel(true, "create");
  }

  handleEditCategory(rowData) {
    let currentRow = this.props.Category.listCategorySuccess.find(
      x => x.id === rowData.col_1.id
    );
    this.props.showModel(true, "edit", currentRow ? currentRow : {});
  }

  handleCreateCreate(data) {
    this.props.categoryCreate(data);
  }
  handleSaveCategory(data) {
    this.props.categorySave(data);
  }
  handleDeleteCategory(data) {
    this.props.categoryDelete(data);
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
      this.props.Category.pageSize,
      pages,
      this.props.Category.query
    );
  }

  changePageSize(pageSize) {
    this.props.onPageChange(
      pageSize,
      this.props.Category.pages,
      this.props.Category.query
    );
  }
}
const mapStateToProps = store => {
  return {
    Driver: store.Driver.toJS(),
    Category: store.Category.toJS(),
    Partner: store.Partner.toJS()
  };
};
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      showModel,
      categorySearch,
      onPageChange,
      categoryCreate,
      categorySave,
      categoryDelete
    },
    dispatch
  );
const App = Form.create()(CategoryManagement);
export default connect(mapStateToProps, mapDispatchToProps)(App);
