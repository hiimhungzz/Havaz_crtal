import React from "react";
import { Select } from "antd";
import "./style.css";
import ReadyCommandList from "./ReadyCommandList";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as readyCommandActions } from "../../redux/readyCommand/actions";
import _ from "lodash";
import classNames from "classnames";
import { Formik } from "formik";
import { isEmpty, appParam } from "@Helpers/utility";
import { APP_MODULE } from "@Constants/common";
import { PlacesLocationSelect } from "../../components/Utility/common";

class ReadyCommandManagement extends React.Component {
  loadData = () => {
    let initParam = isEmpty(appParam[APP_MODULE.READYCOMMAND], {});
    this.props.browseReadyCommand({
      ...initParam
    });
  };
  changePageSize = pageSize => {
    let { orderBy, query, currentPage } = this.props.ReadyCommand;
    this.props.onPageChange({
      searchInput: "",
      pageLimit: pageSize,
      orderBy,
      query,
      currentPage
    });
  };

  changeCurrentPage = currentPage => {
    let { orderBy, pageLimit, query } = this.props.ReadyCommand;
    this.props.onPageChange({
      searchInput: "",
      pageLimit,
      orderBy,
      query,
      currentPage
    });
  };

  handleFilter = (values, setSubmitting) => {
    let query = _.pick(values, [
      "location",
      "status"
    ]);
    let initParam = isEmpty(appParam[APP_MODULE.READYCOMMAND], {});
    this.props.browseReadyCommand({ ...initParam, currentPage: 0, query: query });
    setSubmitting(false);
  };

  componentDidMount() {
    setTimeout(e => {
      this.loadData();
    }, 200);
  }

  render() {
    const { browseReadyCommand } = this.props;
    const { gridReadyCommand, loading, param } = this.props.ReadyCommand;
    const { pageLimit, currentPage, totalLength, query, orderBy } = param;
    return (
      <div className="row">
        <div className="col-lg-12">
          <div className="kt-portlet kt-portlet--mobile">
            <Formik
              enableReinitialize={true}
              initialValues={query}
              onSubmit={(values, { setSubmitting }) => {}}
            >
              {({
                values,
                errors,
                setFieldValue,
                setSubmitting
              }) => (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                  }}
                  ref={form => (this.form = form)}
                  className="kt-form"
                >
                  <div className="kt-portlet__head kt-portlet__head--lg">
                    <div className="kt-portlet__head-label"></div>
                    <div className="kt-portlet__head-toolbar">
                      <div className="kt-portlet__head-wrapper">
                        <a
                          onClick={e => {
                            values.location = "";
                            values.status = "";
                            let query = _.pick(values, [
                              "location",
                              "status"
                            ]);
                            browseReadyCommand({ searchInput: "", query });
                          }}
                          className="btn btn-clean btn-icon-sm"
                        >
                          Xóa bộ lọc
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="kt-portlet__body kt-portlet__body--fit">
                    <div
                      style={{
                        paddingBottom: 0
                      }}
                      className="kt-portlet__body"
                    >
                      <div className="form-group form-group-last row">
                        <div
                          className={classNames({
                            "col-lg-3 form-group-sub validate": true,
                            "is-invalid": errors["location"]
                          })}
                        >
                          <PlacesLocationSelect onSelect={location => {
                            values.location = location;
                            setFieldValue("location", location);
                            this.handleFilter(values, setSubmitting);
                          }} />
                        </div>
                        <div
                          className={classNames({
                            "col-lg-3 form-group-sub validate": true,
                            "is-invalid": errors["status"]
                          })}
                        >
                          <Select
                            name="status"
                            value={values.status}
                            placeholder="Trạng thái"
                            onSelect={e => {
                              values.status = e;
                              setFieldValue("status", values.status);
                              this.handleFilter(values, setSubmitting);
                            }}
                            aria-describedby="status"
                          >
                            <Select.Option value={true}>
                              Sẵn sàng nhận lệnh
                            </Select.Option>
                            <Select.Option value={false}>
                              Không sẵn sàng nhận lệnh
                            </Select.Option>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="kt-portlet__body">
                      <ReadyCommandList
                        dataSource={gridReadyCommand}
                        onChangeCurrentPage={this.changeCurrentPage}
                        onChangePageSize={this.changePageSize}
                        currentPage={currentPage}
                        pageLimit={pageLimit}
                        orderBy={orderBy}
                        query={query}
                        loading={loading}
                        totalLength={totalLength}
                      />
                    </div>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
  }
}

const { browseReadyCommand, onPageChange } = readyCommandActions;
const mapStateToProps = store => {
  return {
    ReadyCommand: store.ReadyCommand.toJS()
  };
};
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      browseReadyCommand,
      onPageChange
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReadyCommandManagement);