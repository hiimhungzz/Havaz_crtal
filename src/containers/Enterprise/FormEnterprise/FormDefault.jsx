import React, { PureComponent } from "react";
import { Input, Form, Select, Upload, Icon, Row, Col } from 'antd';
import { STATUS } from "../../../constants/common";
import { API_URI } from "@Constants";
import _ from 'lodash';
// actions

// component
import { OwnerSelect, CitySelect, CustomerSelect } from '../../../components/Utility/common';

import SelectCategory from "../../../containers/Vehicle/VehicleSelect";
//styles
import "../styles.scss";
const Option = Select.Option;

class FormDefault extends PureComponent {
  constructor(props) {
    super(props);
  }

  onSubmit = (e) => {
    const { onSubmit } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onSubmit(values);
        // this.props.form.resetFields();
      }
    });
  }

  render() {
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const { data } = this.props;
    let styleViewItem = {
      display: 'flex',
      flexDirection: 'row'
    };
    console.log("RNFE FORM")
    return (
      <div>
        <Form
          onSubmit={e => { e.preventDefault() }}
          ref={form => (this.form = form)}
          // enctype="multipart/form-data"
          layout="inline"
        >
          <Row gutter={[10]}>
            <Col span={12}>
              <div style={styleViewItem}>
                <div className="label">
                  Ref code
              </div>
                <Form.Item>
                  {getFieldDecorator('refCode', {
                    initialValue: data.refCode,
                    rules: [{ required: false, message: 'Vui lòng nhập nhân viên phụ trách' }],
                  })(
                    <Input
                      onChange={(e) => { setFieldsValue({ refCode: e.target.value }) }}
                      placeholder="Mã từ hệ thống khác(Cyber,HR...)"
                    />,
                  )}
                </Form.Item>
              </div>
              {/* <div style={styleViewItem}>
                <div className="label">
                  Nv sale phụ trách <span className="mark-required-color">*</span>
                </div>
                <Form.Item colon={false}>
                  {getFieldDecorator('ownerName', {
                    initialValue: data.ownerName,
                    rules: [{ required: true, message: 'Vui lòng nhập nhân viên phụ trách' }],
                  })(
                    <OwnerSelect
                      placeholder="Nhân viên sale phụ trách"
                      onSelect={(owner, data) => {
                        const finded = data.find(x => x.key === owner.key);
                        setFieldsValue({
                          ownerName: owner,
                          ownerPhone: finded.phoneNumber
                        });
                      }}
                    />
                  )}
                </Form.Item>
              </div> */}
              {/* <div style={styleViewItem}>
                <div className="label">
                  Số điện thoại :
              </div>
                <Form.Item>
                  {getFieldDecorator('ownerPhone', {
                    initialValue: data.ownerPhone,
                    rules: [{ required: false, message: 'Vui lòng nhập nhân viên phụ trách' }],
                  })(
                    <Input
                      disabled
                      placeholder="SĐT"
                    />
                  )}
                </Form.Item>
              </div> */}
              <div style={styleViewItem}>
                <div className="label">
                  Đơn vị quản lý: <span className="mark-required-color">*</span>
                </div>
                <Form.Item>
                  {getFieldDecorator('parentId', {
                    initialValue: data.parentId,
                    rules: [{ required: true, message: 'Vui lòng nhập Đơn vị quản lý' }],
                  })(
                    <CustomerSelect
                      url={API_URI.GET_LIST_COMPANY_FOR_ENTERPRISE}
                      onSelect={(organizationIds) => {
                        setFieldsValue({ parentId: organizationIds })
                      }}
                    />
                  )}
                </Form.Item>
              </div>
              <div style={styleViewItem}>
                <div className="label">
                 Tên rút gọn:
                </div>
                <Form.Item>
                  {getFieldDecorator('allias', {
                    initialValue: data.allias,
                    rules: [{ required: false, message: 'Vui lòng nhập Tên rút gọn' }],
                  })(
                    <Input
                      onChange={(e) => { setFieldsValue({ allias: e.target.value }) }}
                      placeholder="Tên rút gọn"
                    />,
                  )}
                </Form.Item>
              </div>
              <div style={styleViewItem}>
                <div className="label">
                  Tên doanh nghiệp <span className="mark-required-color">*</span>
                </div>
                <Form.Item>
                  {getFieldDecorator('nameEnterprise', {
                    initialValue: data.nameEnterprise,
                    rules: [{ required: true, message: 'Vui lòng nhập Tên doanh nghiệp' }],
                  })(
                    <Input
                      onChange={(e) => { setFieldsValue({ nameEnterprise: e.target.value }) }}
                      placeholder="Tên doanh nghiệp"
                    />,
                  )}
                </Form.Item>
              </div>
              <div style={styleViewItem}>
                <div className="label">
                  Đại diện doanh nghiệp
              </div>
                <Form.Item>
                  {getFieldDecorator('nameFator', {
                    initialValue: data.nameFator,
                    rules: [{ required: false, message: 'Vui lòng nhập Tên doanh nghiệp' }],
                  })(
                    <Input
                      onChange={(e) => { setFieldsValue({ nameFator: e.target.value }) }}
                      placeholder="Đại diện doanh nghiệp"
                    />,
                  )}
                </Form.Item>
              </div>
              <div style={styleViewItem}>
                <div className="label">
                  Số điện thoại doanh nghiệp<span className="mark-required-color">*</span>
                </div>
                <Form.Item>
                  {getFieldDecorator('sdtEnterprise', {
                    initialValue: data.sdtEnterprise,
                    rules: [
                      {
                        required: true,
                        message: "Vui lòng nhập SĐT"
                      },
                      {
                        pattern: "^(([+]{1}[0-9]{2}|0)[0-9]{9,15})$",
                        message: "Vui lòng nhập đúng số"
                      }
                    ]
                  })(
                    <Input
                      onChange={(e) => { setFieldsValue({ sdtEnterprise: e.target.value }) }}
                      placeholder="SĐT doanh nghiệp"
                    />,
                  )}
                </Form.Item>
              </div>
              
              {/* <div style={styleViewItem}>
                <div className="label">
                  Nhóm doanh nghiệp <span className="mark-required-color">*</span>
                </div>
                <Form.Item>
                  {getFieldDecorator('itemGroupCustomer', {
                    initialValue: data.itemGroupCustomer,
                    rules: [{ required: true, message: 'Vui lòng nhập Nhóm doanh nghiệp' }],
                  })(
                    <SelectCategory
                      onChange={(itemCategory) => { setFieldsValue({ itemGroupCustomer: itemCategory }) }}
                      url="category-user-all"
                      placeholder="Nhóm doanh nghiệp"
                    />,
                  )}
                </Form.Item>
              </div> */}
              
            </Col>
            <Col span={12}>
            <div style={styleViewItem}>
                <div className="label">
                  Mã số thuế :
                </div>
                <Form.Item>
                  {getFieldDecorator('taxCode', {
                    initialValue: data.taxCode,
                    rules: [{ required: false, message: 'Vui lòng nhập Mã số thuế' }],
                  })(
                    <Input
                      onChange={(e) => { setFieldsValue({ taxCode: e.target.value }) }}
                      placeholder="Mã số thuế"
                    />,
                  )}
                </Form.Item>
              </div>
              <div style={styleViewItem}>
                <div className="label">
                  Email:
              </div>
                <Form.Item>
                  {getFieldDecorator('email', {
                    initialValue: data.email,
                    rules: [
                      {
                        type: "email",
                        message: "Vui lòng nhập đúng định dạng"
                      }
                    ],
                  })(
                    <Input
                      onChange={(e) => { setFieldsValue({ email: e.target.value }) }}
                      placeholder="Email"
                    />,
                  )}
                </Form.Item>

              </div>
              <div style={styleViewItem}>
                <div className="label">
                  Địa chỉ:
            </div>
                <Form.Item>
                  {getFieldDecorator('address', {
                    initialValue: data.address,
                    rules: [{ required: false, message: 'Vui lòng nhập nhân viên phụ trách' }],

                  })(
                    <Input
                      onChange={(e) => { setFieldsValue({ address: e.target.value }) }}
                      placeholder="Địa chỉ"
                    />,
                  )}
                </Form.Item>
              </div>

              <div style={styleViewItem}>
                <div className="label">
                  Thành phố <span className="mark-required-color">*</span>
                </div>
                <Form.Item>
                  {getFieldDecorator('cityName', {
                    initialValue: data.cityName,
                    rules: [{ required: true, message: 'Vui lòng nhập Thành phố' }],
                  })(
                    <CitySelect
                      onSelect={(cityName) => { setFieldsValue({ cityName: cityName }) }}
                    />,
                  )}
                </Form.Item>
              </div>
              <div style={styleViewItem}>
                <div className="label">
                  Trạng thái
                </div>
                <Form.Item>
                  {getFieldDecorator('status', {
                    initialValue: data.status,
                    rules: [{ required: false, message: 'Vui lòng nhập Thành phố' }],
                  })(
                    <Select
                      placeholder="Trạng thái"
                      onChange={(status) => { setFieldsValue({ status: status }) }}
                      style={{ width: "100%" }}
                      optionFilterProp="children"
                    >
                      {STATUS.map((status, statusId) => {
                        return (
                          <Option
                            key={statusId}
                            value={status.value}
                          >
                            {status.label}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </div>
            </Col>
          </Row>

        </Form>
        <div id="cr-drawer__foot" className="kt-portlet__foot viewBtnHeader">
          <button onClick={this.onSubmit} className="btn btn-brand btn-icon-sm">
            <i className="fa fa-save" />
            Lưu
            </button>
        </div>
      </div>
    );
  }
}
const WrappedEnterpriseForm = Form.create(
  {
    mapPropsToFields: props => {
      let result ={};
      _.forEach(props.data,(value,key)=>{
        result[key] = Form.createFormField({value:value});
      })
      return result;
    }
  }
)(FormDefault);
export default WrappedEnterpriseForm;