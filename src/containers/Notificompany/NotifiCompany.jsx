import React, { Component } from 'react'
import { Input, Form } from 'antd';
import classNames from "classnames";
import { DatePicker } from 'antd';
import { API_URI } from "@Constants";
import { DriverSelect, CustomerSelect } from "../../components/Utility/common";
import moment from "moment";
// component
import { Loading } from "../../components/Utility/common";
import InputEditor from "./InputEditor";
import UploadImage from "./UploadImage";
//styles

class NotifiCompany extends Component {
    constructor(props) {
        super(props);
        this.state = {
            driverUuid: props.listDriver,
            title: props.itemRead.title,
            html: props.itemRead.editorHtml,
            date: props.itemRead.date,
            dataImage: props.itemRead.dataImage,
            status: props.itemRead.status,
            quote: props.itemRead.quote,
            refParent: props.itemRead.refParent,
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.itemRead !== this.props.itemRead) {
            this.setState({
                driverUuid: nextProps.listDriver,
                title: nextProps.itemRead.title,
                html: nextProps.itemRead.editorHtml,
                date: nextProps.itemRead.date,
                dataImage: nextProps.itemRead.dataImage,
                status: nextProps.itemRead.status,
                quote: nextProps.itemRead.quote,
                refParent: nextProps.itemRead.refParent,
            })
        }
    }

    onSelectDriver = (values) => {
        this.setState({
            driverUuid: values,
        });
    };

    onChangeTitle = (e) => {
        this.setState({
            title: e.target.value,
        });
    };

    onChangeQuote  = (e) => {
        this.setState({
            quote: e.target.value,
        });
    };

    handleChange = (html) => {
        this.setState({ html: html });
    };

    onChangeTime = (date) => {
        this.setState({ date: date })
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { title, dataImage, html, driverUuid, date, quote, refParent } = this.state;
                const driverId = [];
                let isSendAllDriver = false;
                driverUuid.map((item) => {
                    if (item.key === "1") {
                        isSendAllDriver = true
                    }
                    driverId.push(item.key)
                })
                const params = {
                    title: title,
                    images: dataImage,
                    content: html,
                    driverId: isSendAllDriver ? null : driverId,
                    timer: moment(date).format("YYYY-MM-DD HH:mm:ss"),
                    quote: quote,
                    isSendAllDriver: isSendAllDriver,
                    isSendNow: true,
                    quote: quote,
                    parentId: refParent.key
                };
                this.props.onSendNoti(params);
                this.setState({
                    driverUuid: [],
                    title: "",
                    html: "",
                    date: new Date(),
                    dataImage: [],
                    status: false,
                    quote: '',
                    parentId: {}
                });
                this.props.form.resetFields();
            }
        })
    };

    handleSave = (e) => {
        const { title, dataImage, html, driverUuid, date, quote ,refParent, } = this.state;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const driverId = [];
                let isSendAllDriver = false;
                driverUuid.map((item) => {
                    if (item.key === "1") {
                        isSendAllDriver = true
                    }
                    driverId.push(item.key)
                })
                const params = {
                    title: title,
                    images: dataImage,
                    content: html,
                    driverId: isSendAllDriver ? null : driverId,
                    timer: moment(date).format("YYYY-MM-DD HH:mm:ss"),
                    quote: quote,
                    isSendAllDriver: isSendAllDriver,
                    isSendNow: false,
                    parentId: refParent.key
                };
                this.props.onSaveNoti(params);
                this.setState({
                    driverUuid: [],
                    title: "",
                    html: "",
                    date: new Date(),
                    dataImage: [],
                    status: false,
                    quote: '',
                    parentId: {}
                });
                this.props.form.resetFields();
            }
        });
    }

    render() {
        const { onClose, loading } = this.props;
        const { driverUuid, html, dataImage, date, title, status, quote, refParent } = this.state;
        console.log("refParent", refParent)
        const { getFieldDecorator, setFieldsValue } = this.props.form;
        return (
            <div>
                <div class="kt-portlet__head-label header">
                    <h3 class="kt-portlet__head-title">
                        <i onClick={onClose} class="fa fa-chevron-left"></i>
                        &nbsp; Gửi thông báo cho lái xe</h3>
                </div>
                <div id="idCreateNoti">
                    <>
                        <div class="kt-portlet__head">

                        </div>
                        <Form
                            ref={form => (this.form = form)}
                            enctype="multipart/form-data"
                            layout="inline"
                        >
                            <div className="kt-portlet__body">
                                <div className="form-group row">
                                    <div className="col-md-6">
                                        <label htmlFor="">Chọn lái xe  </label>
                                        <div
                                            className={classNames({
                                                "form-group-sub validate": true,
                                            })}
                                        >
                                            <DriverSelect
                                                isAll
                                                value={driverUuid}
                                                mode="multiple"
                                                onSelect={e => {
                                                    if (this.driverUuidTimer) {
                                                        clearTimeout(this.driverUuidTimer);
                                                    }
                                                    this.onSelectDriver(
                                                        e,
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="">Đơn vị quản lý  </label>
                                        <span className="mark-required-color">*</span>
                                        <Form.Item>
                                            {getFieldDecorator("parentId", {
                                                initialValue: refParent,
                                                rules: [
                                                {
                                                    required: true,
                                                    message: "Vui lòng nhập dữ liệu"
                                                }
                                                ]
                                            })(
                                                <CustomerSelect
                                                    placeHolder={"Đơn vị quản lý"}
                                                    url={API_URI.GET_LIST_COMPANY_FOR_ENTERPRISE}
                                                    onSelect={(customer, data) => {
                                                        this.setState({refParent: customer})
                                                    }}
                                                />
                                            )}
                                        </Form.Item>
                                    </div>
                                    {/* <div className="col-md-6">
                                        <label htmlFor="">Chọn thời gian  </label>
                                        <DatePicker
                                            // value={date}
                                            onChange={this.onChangeTime}
                                        />
                                    </div> */}

                                </div>
                                <div className="form-group row">
                                    <div className="col-md-6">
                                        <label htmlFor="">Tiêu đề  </label>
                                        <span className="mark-required-color">*</span>
                                        <Form.Item>
                                            {getFieldDecorator('title', {
                                                initialValue: title,
                                                rules: [{ required: true, message: 'Vui lòng nhập tiêu đề' }],
                                                onChange: this.onChangeTitle
                                            })(
                                                <Input
                                                    placeholder="Nhập tiêu đề"
                                                />,
                                            )}
                                        </Form.Item>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="">Mô tả  </label>
                                        <span className="mark-required-color">*</span>
                                        <Form.Item>
                                            {getFieldDecorator('quote', {
                                                initialValue: quote,
                                                rules: [{ required: true, message: 'Vui lòng nhập mô tả' }],
                                                onChange: this.onChangeQuote
                                            })(
                                                <Input
                                                    placeholder="Nhập mô tả"
                                                />,
                                            )}
                                        </Form.Item>
                                    </div>
                                    <div className="col-md-12 viewUploadImage">
                                        <UploadImage
                                            dataImage={dataImage}
                                            chooseImage={val => {
                                                this.setState({ dataImage: val });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-md-12">
                                        <InputEditor
                                            handleChange={this.handleChange}
                                            html={html}
                                            placeholder={"Nhập nội dung ... "}
                                        />
                                    </div>
                                </div>
                            </div>
                            {
                                status ? null : (
                                    <div id="cr-drawer__foot" className="kt-portlet__foot">
                                        <button
                                            type="button"
                                            onClick={this.handleSubmit}
                                            className={classNames({
                                                "btn btn btn-warning": true,
                                            })}
                                        >
                                            Gửi
                                </button>
                                        &nbsp;
                                        &nbsp;
                                <button
                                            type="button"
                                            onClick={this.handleSave}
                                            // onClick={this.handleSave}
                                            className={classNames({
                                                "btn btn-brand btn-icon-sm": true,
                                            })}
                                        >
                                            Lưu
                                </button>
                                    </div>
                                )
                            }
                        </Form>
                    </>
                </div>
                {loading && <Loading />}
            </div>
        );
    }
}

NotifiCompany.defaultProps = {
    itemRead: {
        driverUuid: [
            {
                key: "1",
                label: "Tất cả"
            }
        ],
        title: "",
        editorHtml: "",
        date: new Date(),
        dataImage: [],
        status: false,
        quote: '',
    },
    listDriver: [
        {
            key: "1",
            label: "Tất cả"
        }
    ]
};
const WrappedNotifiCompanyForm = Form.create()(NotifiCompany);
export default WrappedNotifiCompanyForm;