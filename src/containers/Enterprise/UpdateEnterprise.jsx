import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tabs, Spin } from 'antd';

// actions
import { actions as enterpriseActions } from "../../redux/enterprise/acions";
// component
import FormDefault from './FormEnterprise/FormDefault'
import FormMenu from './FormEnterprise/FormMenu';

//styles
const { TabPane } = Tabs;
class UpdateEnterprise extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataMenu: {
        fastAccess: [],
        dataManagement: [],
        menuMobile: [],
      }
    };
  }

  onUpdateItemEnterpirse = (values) => {
    const {uuid} = this.props;
    const params = {
      uuid: uuid,
      refCode: values.refCode,
      taxCode: values.taxCode,
      allias: values.allias,
      // category: values.itemGroupCustomer.key,
      name: values.nameEnterprise,
      represent: values.nameFator,
      phone: values.sdtEnterprise,
      email: values.email,
      unit: values.address,
      status: values.status,
      cityIds: values.cityName,
      MOU: false,
      quickPayment: false,
      files: [],
      cityId: values.cityName.key,
      parentId: values.parentId.key,
    };
    this.props.onClose();
    this.props.onUpdateEnterpirse(params);
  };

  onUpdteAttribute = (data) => {
    const {uuid} = this.props;
    const params = {
      organizationsId: uuid,
      ...data,
    }
    this.props.onClose();
    this.props.onCreateOrganizationAttribute(params);
  }

  render() {
    const {onClose} = this.props;
    const {itemRead, organizationsAttributeRead, loaddingFormUpdate} = this.props.Enterprise;
    const data = itemRead ? {
      refCode: itemRead.refCode,
      parentId: itemRead.objParentId,
      taxCode: itemRead.taxCode,
      nameEnterprise: itemRead.name,
      nameFator: itemRead.represent,
      allias: itemRead.allias,
      sdtEnterprise: itemRead.phone,
      email: itemRead.email,
      address: itemRead.unit,
      status: itemRead.status,
      cityName: itemRead.cityIds,
    } : undefined;
    
    const dataAttribute = organizationsAttributeRead ? 
      organizationsAttributeRead.data
     : null;
    //  Menu
    const dataMenu = organizationsAttributeRead ? organizationsAttributeRead.data.webObject.menu : null;
    const menuMobile = organizationsAttributeRead ? organizationsAttributeRead.data.mobileObject.menu : null;
    return (
      <div>
        <div id="cr-drawer__head" className="kt-portlet__head">
            <div className="kt-portlet__head-label">
              <h3 className="kt-portlet__head-title">
                <i
                  onClick={onClose}
                  className="fa fa-chevron-left cursor-pointer"
                />{" "}
                &nbsp;
                {"Chỉnh sửa thông tin doanh nghiệp"}
              </h3>
            </div>
          </div>
          {
            data && !loaddingFormUpdate ? (
              <Tabs defaultActiveKey={"1"}>
                <TabPane tab="Thông tin" key="1">
                  <FormDefault data={data} onSubmit={this.onUpdateItemEnterpirse}/>
                </TabPane>
                <TabPane tab="Cấu hình" key="2">
                  <FormMenu dataMenu={dataMenu} menuMobile={menuMobile} data={dataAttribute} onSave={this.onUpdteAttribute}/>
                </TabPane>
              </Tabs>
            ) : (
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1}}>
                <Spin spinning={true}/>
              </div>
            )
          }
      </div>
    );
  }
}

const {
  onCreateOrganizationAttribute,
  onUpdateEnterpirse,
} = enterpriseActions;
const mapStateToProps = store => {
  return {
    Enterprise: store.Enterprise.toJS(),
  };
};
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    onCreateOrganizationAttribute,
    onUpdateEnterpirse,
  },
  dispatch
);
export default connect(mapStateToProps, mapDispatchToProps)(UpdateEnterprise);