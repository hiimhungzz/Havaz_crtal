import React, { PureComponent } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Globals from "globals.js";
import { API_URI } from "@Constants";
import { Ui } from "@Helpers/Ui";
import { Tabs, Spin } from 'antd';
import { requestJson} from "@Services/base";

// actions
import { actions as enterpriseActions } from "../../redux/enterprise/acions";

// component
import FormDefault from './FormEnterprise/FormDefault';
import FormMenu from './FormEnterprise/FormMenu';
//styles
const { TabPane } = Tabs;
class CreateEnterprise extends PureComponent {
  constructor(props) {
    super(props);
    const profile = Globals.currentUser;
    this.state = {
      isShowTab: false,
      organizationsId: null,
      data: {
        refCode: undefined,
        parentId: profile ?  {
          key: profile.organizationUuid,
          label: profile.organizationName,
        } : null,
        taxCode: undefined,
        // itemGroupCustomer: undefined,
        nameEnterprise: undefined,
        nameFator: undefined,
        sdtEnterprise: undefined,
        email: undefined,
        address: undefined,
        allias: undefined,
        status: "1",
        cityName: undefined,
      }
    }
  }

  onCreateEnterpirse = (values) => {
    // this.props.onCreateEnterpirse(params);
    // this.props.onClose();
    const params = {
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
    this.setState({data: values})
    
    requestJson({ url: API_URI.CREATE_ENTERPRISE, data: params }).then(response => {
      this.props.onLoaddingFormUpdate(true)
      if(response.status === 200) {
        this.props.getDetailItemAttribute({uuid: response.data.uuid});
        this.setState({isShowTab: true, organizationsId: response.data.uuid})
      }
    });
  };

  onUpdteAttribute = (data) => {
    const params = {
      organizationsId: this.state.organizationsId,
      ...data,
    }
    this.props.onClose();
    this.props.onCreateOrganizationAttribute(params);
  }

  onClose = () => {
    if(this.state.isShowTab) {
      Ui.showWarning({
        message: "Vui lòng nhập cấu hình"
      });
    } else {
      this.props.onClose();
    }
  }

  render() {
    const {isShowTab} = this.state;
    const {organizationsAttributeRead, loaddingFormUpdate} = this.props.Enterprise;
    const dataAttribute = organizationsAttributeRead ? 
      organizationsAttributeRead.data
     : null;
    const dataMenu = organizationsAttributeRead ? {
      ...organizationsAttributeRead.data.webObject.menu,
      menuMobile: organizationsAttributeRead.data.mobileObject.menu,
    } : null;
    return (
      <div>
        <div id="cr-drawer__head" className="kt-portlet__head">
            <div className="kt-portlet__head-label">
              <h3 className="kt-portlet__head-title">
                <i
                  onClick={this.onClose}
                  className="fa fa-chevron-left cursor-pointer"
                />{" "}
                &nbsp;
                {"Thêm doanh nghiệp"}
              </h3>
            </div>
          </div>
          {
            !isShowTab ? (
              <FormDefault data={this.state.data} onSubmit={this.onCreateEnterpirse}/>
            ) : (
            <Tabs activeKey={!isShowTab ? "1" : "2"}>
              <TabPane tab="Thông tin" key="1">
                <FormDefault data={this.state.data} onSubmit={this.onCreateEnterpirse}/>
              </TabPane>
              {
              <TabPane tab="Cấu hình" key="2">
                <Spin spinning={loaddingFormUpdate}>
                  {
                    organizationsAttributeRead && 
                    <FormMenu 
                      dataMenu={dataMenu} 
                      data={dataAttribute} 
                      onSave={this.onUpdteAttribute}/>
                  }
                </Spin>
              </TabPane>
              }
            </Tabs>
            )
          }
      </div>
    );
  }
}

const {
  onLoaddingFormUpdate,
  getDetailItemAttribute,
  onCreateOrganizationAttribute,
  getMenuPrise,
  onCreateEnterpirse,
} = enterpriseActions;

const mapStateToProps = store => {
  return {
    Enterprise: store.Enterprise.toJS(),
  };
};
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getDetailItemAttribute,
    onLoaddingFormUpdate,
    onCreateOrganizationAttribute,
    getMenuPrise,
    onCreateEnterpirse,
  },
  dispatch
);
export default connect(mapStateToProps, mapDispatchToProps)(CreateEnterprise);