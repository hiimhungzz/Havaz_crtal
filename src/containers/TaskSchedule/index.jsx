import React from "react";
import { actions as taskScheduleAction } from "../../redux/taskSchedule/actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Globals from "globals.js";
import TaskScheduleList from "./TaskScheduleList";
import moment from "moment";

import Filter from './Filter';

const { taskSchedule_Search, onPageChange } = taskScheduleAction;
class TaskScheduleManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: []
    };
  }
  componentDidMount() {
    let initParam = {};
    if (localStorage.getItem("AppParam")) {
      let appParam = JSON.parse(localStorage.getItem("AppParam"));
      if (appParam["taskSchedule"]) {
        initParam = appParam["taskSchedule"];
      }
    }
    // this.props.taskSchedule_Search(initParam);
    this.loadData();
  }
  queryString() {
    const { pageSize, pages, tabId } = this.props.taskSchedule;
    return `lastQuery:?take=${pageSize}&skip=${pageSize * pages}`;
  }

  loadData() {
    const profile = Globals.currentUser;
    const parentId = profile
      ? {
          key: profile.organizationUuid,
          label: profile.organizationName
        }
      : undefined;
      
    const { tabId } = this.props.taskSchedule;
    const queryString = this.queryString();
    let month = moment().format("MM");
    let year = moment().format("YYYY");
    let query = {
      month: month,
      year: year,
      nameDriver: "",
      phoneDriver: "",
      codeDriver: "",
      date: "",
      categorySurvey: '',
      organizationId: parentId.key,
    };
    this.props.taskSchedule_Search({ query: query }, 5, 0, true, "1", []);
    this.lastQuery = queryString;
  }
  changeCurrentPage = pages => {
    this.props.onPageChange(
      "",
      this.props.taskSchedule.pageSize,
      pages,
      this.props.taskSchedule.query
    );
  };

  changePageSize = pageSize => {
    this.props.onPageChange(
      "",
      pageSize,
      this.props.taskSchedule.pages,
      this.props.taskSchedule.query
    );
  };

  render() {
    const {
      listSchedule,
      listScheduleSuccess,
      loading,
      total,
      pages,
      query,
      pageSize
    } = this.props.taskSchedule;
    return (
      <div className="kt-portlet kt-portlet--mobile kt-portlet__body p-3">
        <Filter
          pageSize={this.props.taskSchedule.pageSize}
          pages={this.props.taskSchedule.pages}
          values={query}
        />
        <TaskScheduleList
          dataSource={listSchedule}
          listScheduleSuccess={listScheduleSuccess}
          currentPage={pages}
          pageLimit={pageSize}
          loading={loading}
          totalLength={total}
          onChangeCurrentPage={this.changeCurrentPage}
          onChangePageSize={this.changePageSize}
        />
      </div>
    );
  }
}
const mapStateToProps = store => {
  return {
    taskSchedule: store.taskSchedule.toJS()
  };
};
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      taskSchedule_Search,
      onPageChange
    },
    dispatch
  );
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskScheduleManagement);
