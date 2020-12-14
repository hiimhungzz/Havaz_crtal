import React, { PureComponent } from "react";
import { Input, Form, Upload, Icon, Row, Col, Switch } from 'antd';
import { API_URI } from "@Constants";
import { ColorPickerComponent } from "@syncfusion/ej2-react-inputs";
import { requestJsonUpload } from "../../../../services/base";
import _ from 'lodash';
// actions
// component
import MenuGrandFather from "./MenuGrandFather";
import MenuMobile from './MenuMobile';

//styles
import "../../styles.scss";



class FormMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataMenu: props.dataMenu,
      menuMobile: props.menuMobile,
      mobileLogo: props.data.mobileLogo,
      webLogo: props.data.webLogo,
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.dataMenu !== this.props.dataMenu) {
      this.setState({
        menuMobile: nextProps.menuMobile,
        dataMenu: nextProps.dataMenu,
      })
    }
  }

  onChangeMenuMobile = (val) => {
    const {menuMobile} = this.state;
    const menuMobileNew = [...menuMobile];
    menuMobileNew[val.index] = val;
    this.setState({
      menuMobile: menuMobileNew,
    });
  }

  onSave = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = {
          ...values,
          webObject: {
            menu: this.state.dataMenu,
          },
          mobileObject: {
            menu: this.state.menuMobile,
            mobileColor: values.mobileColor,
            isXuatRoiBen: values.isXuatRoiBen,
            isKmDauCuoi: values.isKmDauCuoi,
            isCheckInDiemDen: values.isCheckInDiemDen
          }
        }
        this.props.onSave(data)
      }
    });
  };

  onChangeGrandFather = (itemGrand, item) => {
    const {dataMenu} = this.state;
    const dataMenuNew = {...dataMenu};
    dataMenuNew[item] = itemGrand;
    this.setState({
      dataMenu: dataMenuNew
    })
  }

  render() {
    const {dataMenu, menuMobile} = this.state;
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const { data } = this.props;
    let styleViewItem = {
      display: 'flex',
      flexDirection: 'row'
    };
    const styleLabelMenuWeb = {
      paddingLeft: 10,
      fontWeight: 'bold', fontSize: 18,
    }
    const styleLabelParent = {
      fontWeight: 'bold', fontSize: 20, textAlign: 'center', backgroundColor: 'rgb(242, 243, 248)', paddingTop: 7, paddingBottom: 7
    }
    console.log("menu", dataMenu)
    return (
      <div>
        <Form
          onSubmit={e => { e.preventDefault() }}
          ref={form => (this.form = form)}
          // enctype="multipart/form-data"
          layout="inline"
        >
          <Row  gutter={10}>
            <Col span={12}>
            <div style={styleViewItem}>
                <div className="label">
                  Api Web
              </div>
                <Form.Item>
                  {getFieldDecorator('webAPI', {
                    initialValue: data.webAPI,
                    rules: [{ required: false, message: 'Vui lòng nhập Tên doanh nghiệp' }],
                  })(
                    <Input
                      onChange={(e) => { setFieldsValue({ nameFator: e.target.value }) }}
                      placeholder="Api Web Https"
                    />,
                  )}
                </Form.Item>
              </div>
              <div style={styleViewItem}>
                <div className="label">
                  Tên Web
              </div>
                <Form.Item>
                  {getFieldDecorator('webName', {
                    initialValue: data.webName,
                    rules: [{ required: false, message: 'Vui lòng nhập Tên doanh nghiệp' }],
                  })(
                    <Input
                      onChange={(e) => { setFieldsValue({ nameFator: e.target.value }) }}
                      placeholder="Tên Web"
                    />,
                  )}
                </Form.Item>
              </div>
                <div style={styleViewItem}>
                  <div className="label">
                    Màu Web app:
                  </div>
                  <Form.Item className="ant-center">
                    {getFieldDecorator("webColor", {
                      initialValue: data.webColor || "",
                      rules: [
                        {
                          required: false,
                          message: "Vui lòng nhập màu!"
                        }
                      ]
                    })(<ColorPickerComponent
                        cssClass='e-custom-picker'
                        change={(e) => {
                          setFieldsValue({ webColor: e.value })
                        }} 
                        />
                    )}
                  </Form.Item>
                </div>

              <div style={styleViewItem}>
                <div className="label">
                  Logo Web:
                </div>
                <Form.Item className="ant-center">
                  {getFieldDecorator("webLogo", {
                    rules: [
                      {
                        required: false,
                        message: "Vui lòng chọn logo!"
                      }
                    ]
                  })(
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action={API_URI.UPLOAD_FILE}
                      customRequest={(option) => {
                        const data = new FormData()
                        data.set('files', option.file)
                        requestJsonUpload({ url: API_URI.UPLOAD_FILE, data: data }).then(response => {
                          this.setState({
                            webLogo: response.data[0]
                          });
                          setFieldsValue({ webLogo: response.data[0] });
                        });
                      }}
                    >
                      {this.state.webLogo ? <img src={this.state.webLogo} alt="avatar" style={{ width: 100, height: 100 }} /> : (
                        <div>
                          <Icon type={'plus'} />
                          <div className="ant-upload-text">Upload</div>
                        </div>
                      )}
                    </Upload>
                  )}
                </Form.Item>
              </div>
              <div style={styleViewItem}>
                <div className="label">
                  Auth Key
              </div>
                <Form.Item>
                  {getFieldDecorator('authKey', {
                    initialValue: data.authKey,
                    rules: [{ required: false, message: 'Vui lòng nhập Tên doanh nghiệp' }],
                  })(
                    <Input
                      onChange={(e) => { setFieldsValue({ nameFator: e.target.value }) }}
                      placeholder="Auth key"
                    />,
                  )}
                </Form.Item>
              </div>
            </Col>
            <Col span={12}>
            <div style={styleViewItem}>
                <div className="label">
                  Api App <span className="mark-required-color">*</span>
              </div>
                <Form.Item>
                  {getFieldDecorator('mobileAPI', {
                    initialValue: data.mobileAPI,
                    rules: [{ required: true, message: 'Vui lòng nhập Api App' }],
                  })(
                    <Input
                      onChange={(e) => { setFieldsValue({ nameFator: e.target.value }) }}
                      placeholder="https://crapiuat.havazdev.net/api"
                    />,
                  )}
                </Form.Item>
              </div>
              <div style={styleViewItem}>
                <div className="label">
                  Tên App
              </div>
                <Form.Item>
                  {getFieldDecorator('mobileName', {
                    initialValue: data.mobileName,
                    rules: [{ required: false, message: 'Vui lòng nhập Tên doanh nghiệp' }],
                  })(
                    <Input
                      onChange={(e) => { setFieldsValue({ nameFator: e.target.value }) }}
                      placeholder="Tên App"
                    />,
                  )}
                </Form.Item>
              </div>
              <div style={styleViewItem}>
                <div className="label">
                  Màu App lái xe
                </div>
                <Form.Item className="ant-center">
                  {getFieldDecorator("mobileColor", {
                    initialValue: data.mobileObject.mobileColor || "",
                    rules: [
                      {
                        required: false,
                        message: "Vui lòng nhập màu!"
                      }
                    ]
                  })(<ColorPickerComponent
                      cssClass='e-custom-picker'
                      change={(e) => {
                        setFieldsValue({ mobileColor: e.value })
                      }} 
                      />
                  )}
                </Form.Item>
              </div>

              <div style={styleViewItem}>
                <div className="label">
                  Logo App
                </div>
                <Form.Item className="ant-center">
                  {getFieldDecorator("mobileLogo", {
                    initialValue: data.mobileLogo || undefined,
                    rules: [
                      {
                        required: false,
                        message: "Vui lòng chọn logo!"
                      }
                    ]
                  })(
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action={API_URI.UPLOAD_FILE}
                      customRequest={(option) => {
                        const data = new FormData()
                        data.set('files', option.file)
                        requestJsonUpload({ url: API_URI.UPLOAD_FILE, data: data }).then(response => {
                          this.setState({
                            mobileLogo: response.data[0]
                          });
                          setFieldsValue({ mobileLogo: response.data[0] });
                        });
                      }}
                    >
                      {this.state.mobileLogo ? <img src={this.state.mobileLogo} alt="avatar" style={{ width: 100, height: 100 }} /> : (
                        <div>
                          <Icon type={'plus'} />
                          <div className="ant-upload-text">Upload</div>
                        </div>
                      )}
                    </Upload>
                  )}
                </Form.Item>
              </div>
              <div style={styleViewItem}>
                <div className="label">
                  Nhập km đầu cuối
                </div>
                <Form.Item className="ant-center">
                  {getFieldDecorator("isKmDauCuoi", {
                    initialValue: data.mobileObject.isKmDauCuoi || false,
                    valuePropName: "checked"
                  })(
                    <Switch 
                      onChange={(val) => {
                      setFieldsValue({ isKmDauCuoi: val });
                    }} />
                  )}
                </Form.Item>
              </div>
              <div style={styleViewItem}>
                <div className="label">
                  Xuât rời bến
                </div>
                <Form.Item className="ant-center">
                  {getFieldDecorator("isXuatRoiBen", {
                    initialValue: data.mobileObject.isXuatRoiBen || false,
                    valuePropName: "checked"
                  })(
                    <Switch 
                      onChange={(val) => {
                      setFieldsValue({ isXuatRoiBen: val });
                    }} />
                  )}
                </Form.Item>
              </div>
              <div style={styleViewItem}>
                <div className="label">
                  CheckIn điếm đến
                </div>
                <Form.Item className="ant-center">
                  {getFieldDecorator("isCheckInDiemDen", {
                    initialValue: data.mobileObject.isCheckInDiemDen || false,
                    valuePropName: "checked"
                  })(
                    <Switch 
                      onChange={(val) => {
                      setFieldsValue({ isCheckInDiemDen: val });
                    }} />
                  )}
                </Form.Item>
              </div>
            </Col>
          </Row>
        </Form>
        {/* MENU */}
        <Row className="viewMenuRoot" gutter={10}>
          <Col span={16}>
            <div className="thumnail">
              <div style={styleLabelParent}>Menu Web: </div>
              {
                dataMenu && Object.keys(dataMenu).map((item, index) => {
                  return (
                    <MenuGrandFather item={item} dataMenu={dataMenu} onChangeGrandFather={this.onChangeGrandFather}/>
                  )
                })
              }
            </div>
          </Col>
          <Col span={8}>
            <div className="thumnail">
              <div style={styleLabelParent}>Menu App: </div>
                <div>
                  <div style={styleLabelMenuWeb}>&nbsp; </div>
                  {
                    menuMobile.map((item, index) => (
                      <MenuMobile 
                        key={index} 
                        index={index} 
                        itemMobile={item} 
                        onChangeMenuMobile={this.onChangeMenuMobile}
                      />
                    ))
                  }
              </div>
            </div>
          </Col>
        </Row>
        <div id="cr-drawer__foot" className="kt-portlet__foot viewBtnHeader">
          <button onClick={this.onSave} className="btn btn-brand btn-icon-sm">
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
)(FormMenu);

export default WrappedEnterpriseForm;

