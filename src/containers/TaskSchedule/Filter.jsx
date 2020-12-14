import React from "react";
import { actions as taskScheduleAction } from "../../redux/taskSchedule/actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Globals from "globals.js";
import { DatePicker, Input } from "antd";
import { SelectBaseSon } from "@Components/Utility/common";
import moment from "moment";
import FilterSelect from "../Vehicle/VehicleSelect";
const { taskSchedule_Search, onPageChange } = taskScheduleAction;
const { MonthPicker } = DatePicker;
class TaskScheduleFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: moment(),
      nameDriver: undefined,
      codeDriver: "",
      categorySurvey: undefined,
      organization: undefined,
    }
  }

  onDeleteField = () => {
    const profile = Globals.currentUser;
    const parentId = profile
    ? {
        key: profile.organizationUuid,
        label: profile.organizationName
      }
    : undefined;
    this.setState({
      date: moment(),
      nameDriver: undefined,
      codeDriver: "",
      categorySurvey: undefined,
      organization: parentId,
    })
    const query = {
      month: this.state.date.format('MM'),
      year: this.state.date.format('YYYY'),
      nameDriver: "",
      codeDriver: "",
      phoneDriver: "",
      categorySurvey: '',
      organizationId: parentId.key,
    };
    const {pageSize, pages} = this.props;
    this.props.taskSchedule_Search({
      query: query,
      pageSize: pageSize,
      pages: pages,
    });
  };

  onSearch = () => {
    const profile = Globals.currentUser;
    const parentId = profile
    ? {
        key: profile.organizationUuid,
        label: profile.organizationName
      }
    : undefined;
    const {organization, categorySurvey, codeDriver, date, nameDriver} = this.state;
    const query = {
      month: date.format('MM'),
      year: date.format('YYYY'),
      nameDriver: nameDriver && nameDriver.key || '',
      codeDriver: codeDriver,
      phoneDriver: "",
      categorySurvey: categorySurvey && categorySurvey.key || '',
      organizationId: organization ? organization.key : parentId.key,
    };
    const {pageSize, pages} = this.props;
    this.props.taskSchedule_Search({
      query: query,
      pageSize: pageSize,
      pages: pages,
    });
  }

  render() {
    const profile = Globals.currentUser;
    const parentId = profile
      ? {
          key: profile.organizationUuid,
          label: profile.organizationName
        }
      : undefined;
    return (
      <>
        <div className="row pb-3">
          <div className="col-md-6" style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
            <SelectBaseSon
              value={this.state.organization ? this.state.organization : parentId}
              apiUrl={'autocomplete/org'}
              onSelect={item => {
              this.setState({organization: item})
              }}
              pageLimit={20}
              placeholder="Đơn vị quản lý"
            />
          </div>
          <div className="col-md-6" style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
            <div className="kt-portlet__head-wrapper">
              <button
                onClick={this.onDeleteField}
                className="btn btn-clean btn-icon-sm"
              >
                Xóa bộ lọc
              </button>
              &nbsp;
              <button
                  onClick={this.onSearch}
                  type="button"
                  className="btn btn-brand btn-icon-sm"
              >
                  <i className="flaticon-search" />
                  Tìm kiếm
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <Input
              value={this.state.codeDriver}
              onChange={e => {
                this.setState({codeDriver: e.target.value})
              }}
              placeholder="Mã lái xe"
            />
          </div>
          <div className="col-md-3">
            <FilterSelect
              value={this.state.nameDriver}
              url="autocomplete/driver"
              placeholder="Lái xe"
              name="nameDriver"
              onChange={e => {
                this.setState({
                  nameDriver: e
                })
              }}
            />
          </div>
          <div className="col-md-3">
            <MonthPicker
              format="MM-YYYY"
              value={this.state.date}
              onChange={(date) => {
                this.setState({date: date})
              }}
              placeholder="Tháng"
            />
          </div>
          <div className="col-md-3">
            <SelectBaseSon
              value={this.state.categorySurvey}
              apiUrl={'autocomplete/category-survey'}
              onSelect={item => {
                this.setState({
                  categorySurvey: item,
                })
              }}
              pageLimit={20}
              placeholder="Nhóm lái xe/tiếp viên"
            />
          </div>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      taskSchedule_Search,
    },
    dispatch
  );
export default connect(
  null,
  mapDispatchToProps
)(TaskScheduleFilter);
