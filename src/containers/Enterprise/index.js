import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Drawer } from 'antd';
import _ from "lodash";
import moment from 'moment';

// actions
import { actions as enterpriseActions } from "../../redux/enterprise/acions";


// component
import EnterpriseList from "./EnterpriseList";
import CreateEnterprise from './CreateEnterprise';
import UpdateEnterprise from './UpdateEnterprise';
//styles
import './styles.scss'

class EnterpriseManagement extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        isShowCreate: false,
        isShowUpdate: false,
        uuid: null,
      }
    }

    componentDidMount() {
      const {pageLimit, currentPage} = this.props.Enterprise;
      
      this.getListEnterpirse(pageLimit, currentPage);
    }

    getListEnterpirse(pageSize, currentPage){
      const data = {
        pageSize: pageSize,
        currentPage: currentPage
      }
      this.props.getListEnterpirse(data);
    }

    changePageSize = pageSize => {
      const {currentPage} = this.props.Enterprise;
      this.props.onSetPageSize(pageSize);
      this.props.onLoadding(true);
      this.getListEnterpirse(pageSize, currentPage);
    };
  
    changeCurrentPage = currentPage => {
      const {pageLimit} = this.props.Enterprise;
      this.props.onChangeCurrentPage(currentPage);
      this.props.onLoadding(true);
      this.getListEnterpirse(pageLimit, currentPage);
    };

    getDetailItemEnterprise = (rowData) => {
      const data = {
        uuid: rowData.uuid,
        filterDatetime: moment(),
      };
      this.setState({
        isShowUpdate: true,
        uuid: rowData.uuid,
      });
      this.props.onLoaddingFormUpdate(true)

      _.delay(() => {
        this.props.getDetailItemAttribute({uuid: rowData.uuid});
        this.props.getDetailItemEnterpirse(data)
      }, 600);
    };

    onDeleteItem = (rowData) => {
      const data = {
        uuid: rowData.uuid
      };
      this.props.onLoadding(true);
      this.props.onDeleteItemEnterpirse(data);
    };

    render() {
      const {gridEnterprise, totalLength, pageLimit, currentPage, loading} = this.props.Enterprise;
      const {isShowCreate, isShowUpdate} = this.state;
      return (
        <div className="col-lg-12 kt-portlet kt-portlet--mobile">
          <div className="kt-portlet__head-toolbar viewHeader">
            <div className="kt-portlet__head-wrapper">
              &nbsp;
              <button
                onClick={() => {this.setState({isShowCreate: true})}}
                type="button"
                className="btn btn-brand btn-icon-sm"
              >
                <i className="flaticon2-plus" />
                Thêm mới
              </button>
            </div>
          </div>
          <Drawer
            // id="Drawer"
            placement="right"
            visible={isShowCreate}
            width="100%"
            destroyOnClose
            closable={false}
            // onClose={() => {this.setState({isShowCreate: false})}}
          >
            <CreateEnterprise
              onClose={() => {this.setState({isShowCreate: false})}}
            />
          </Drawer>
          <Drawer
            // id="Drawer"
            placement="right"
            visible={isShowUpdate}
            width="100%"
            destroyOnClose
            closable={false}
            // onClose={() => {this.setState({isShowUpdate: false})}}
          >
            <UpdateEnterprise
              uuid={this.state.uuid}
              onClose={() => {this.setState({isShowUpdate: false})}}
            />
          </Drawer>
          <EnterpriseList
            onDeleteItem={this.onDeleteItem}
            onShowDetailItem={this.getDetailItemEnterprise}
            dataSource={gridEnterprise}
            totalLength={totalLength}
            currentPage={currentPage}
            loading={loading}
            pageLimit={pageLimit}
            onChangeCurrentPage={this.changeCurrentPage}
            onChangePageSize={this.changePageSize}
          />
        </div>
      );
    }
}
const {
  getListEnterpirse,
  onSetPageSize,
  onChangeCurrentPage,
  onLoadding,
  onDeleteItemEnterpirse,
  getDetailItemEnterpirse,
  getMenuPrise,
  getDetailItemAttribute,
  onLoaddingFormUpdate,
} = enterpriseActions;
const mapStateToProps = store => {
  return {
    Enterprise: store.Enterprise.toJS(),
  };
};
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    onLoaddingFormUpdate,
    getDetailItemAttribute,
    getListEnterpirse,
    onSetPageSize,
    onChangeCurrentPage,
    onLoadding,
    onDeleteItemEnterpirse,
    getDetailItemEnterpirse,
    getMenuPrise
  },
  dispatch
);
export default connect(mapStateToProps, mapDispatchToProps)(EnterpriseManagement);