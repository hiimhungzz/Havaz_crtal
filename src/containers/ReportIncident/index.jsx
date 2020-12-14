import React, { Component } from "react";
import { Row, Modal, Col } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core/styles";
// actions
import { actions as reportIncidentActions } from "../../redux/reportIncident/actions";
// components
import IncidentList from "./IncidentList";
//styles
import "./styles.scss";

const styles = theme => ({
  root_paper: {
    overflow: "auto"
  },
  button: {
    margin: theme.spacing()
  }
});

const query1 = new URLSearchParams(window.location.search);

class IncidentManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  componentDidMount() {
    if (query1.get("uuid")) {
      this.props.getDetailReportIncident(query1.get("uuid"));
    } else {
      const { pageSize, pages } = this.props.ReportIncident;
      const params = {
        pageSize: pageSize,
        pages: pages
      };
      this.props.getListReportIncident(params);
    }
  }

  onChangeSwitch = (status, uuid) => {
    if (status) {
      if (query1.get("uuid")) {
        this.props.updateStatusReportIncident(uuid);
      } else {
        this.props.updateStatusReportIncident(uuid);
      }
    }
  };

  changePageSize = size => {
    const { pages } = this.props.ReportIncident;
    const params = {
      pageSize: size,
      pages: pages
    };
    this.props.onLoading(true);
    this.props.onSetPageSize(size);
    this.props.getListReportIncident(params);
  };

  changeCurrentPage = pages => {
    const { pageSize } = this.props.ReportIncident;
    const params = {
      pageSize: pageSize,
      pages: pages
    };
    this.props.onLoading(true);
    this.props.onChangeCurrentPage(pages);
    this.props.getListReportIncident(params);
  };

  render() {
    const {
      gridIncidentItem,
      gridIncident,
      loading,
      pageSize,
      pages,
      totalLength
    } = this.props.ReportIncident;
    return (
      <div className="row">
        <div className="col">
          <IncidentList
            gridIncident={query1.get("uuid") ? gridIncidentItem : gridIncident}
            loading={loading}
            pageSize={pageSize}
            pages={pages}
            totalLength={totalLength}
            onChangeSwitch={this.onChangeSwitch}
            changeCurrentPage={this.changeCurrentPage}
            changePageSize={this.changePageSize}
          />
        </div>
      </div>
    );
  }
}

const {
  getDetailReportIncident,
  getListReportIncident,
  onSetPageSize,
  onChangeCurrentPage,
  updateStatusReportIncident,
  onLoading
} = reportIncidentActions;
const mapStateToProps = store => {
  return {
    ReportIncident: store.ReportIncident.toJS()
  };
};
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onSetPageSize,
      onLoading,
      getDetailReportIncident,
      onChangeCurrentPage,
      getListReportIncident,
      updateStatusReportIncident
    },
    dispatch
  );
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(IncidentManagement));
