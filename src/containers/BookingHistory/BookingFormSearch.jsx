import React from 'react'
import {
    DatePicker,
    Row,
    Col,
    Input, Form
} from "antd"
//action
// styles
import "./styles.scss";
import moment from "moment";

const RangePicker = DatePicker.RangePicker;
class BookingFormSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            codeBooking: '',
            name: '',
            date: {
                startDate: moment().subtract(10, 'days'),
                endDate: moment(new Date()),
            },
            vehicleRouter: '',
        }
    }

    onChangeCodeBooking = (e) => {
        this.setState({
            codeBooking: e.target.value,
        })
    };

    onChangeVehicleRouter = (e) => {
        this.setState({
            vehicleRouter: e.target.value,
        })
    };

    onChangeName = (e) => {
        this.setState({
            name: e.target.value,
        })
    };

    onChangeRage = (dates) => {
        if(dates.length > 0) {
            this.setState({
                date: {
                    startDate: dates[0].startOf("day"),
                    endDate: dates[1].endOf("day"),
                }
            });
        }
    };

    clearInput = () => {
        this.setState({
            codeBooking: '',
            name: '',
            vehicleRouter: '',
            date: {
                startDate: moment().subtract(10, 'days'),
                endDate: moment(new Date()),
            },
        })
        this.props.form.resetFields();
        this.props.onClearInput();
    };

    onSearch = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { codeBooking, date, name, vehicleRouter } = this.state;
                const params = {
                    bookingCode: codeBooking,
                    startDate: date.startDate,
                    endDate: date.endDate,
                    name: name,
                    routeName: vehicleRouter,
                }
                this.props.onSearch(params);
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { codeBooking, name, vehicleRouter, date } = this.state;
        return (
            <Form
                ref={form => (this.form = form)}
                encType="multipart/form-data"
            >
                <div className="col12 viewBtn">
                    <button
                        onClick={this.clearInput}
                        type="button" className="btn btn-default btnDelete">
                        <span className="glyphicon glyphicon-search"></span> Xóa bộ lọc
                    </button>
                    <button
                        onClick={this.onSearch}
                        type="button" className="btn btn-info btnSearch">
                        <i className="fa fa-search"></i> Tìm kiếm
                    </button>
                </div>
                <Row>
                    <Col xs={12}>
                        <Form.Item className="col12">
                            <Input
                                value={codeBooking}
                                onChange={this.onChangeCodeBooking}
                                placeholder="Code booking"
                            />
                        </Form.Item>
                        <Form.Item className="col12">
                            <Input
                                value={name}
                                onChange={this.onChangeName}
                                placeholder="Họ tên"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={12}>
                        <Form.Item className="col12">
                            <Input
                                value={vehicleRouter}
                                onChange={this.onChangeVehicleRouter}
                                placeholder="Tuyến"
                            />
                        </Form.Item>
                        <Form.Item className="col12">
                            {getFieldDecorator('title', {
                                rules: [{ required: true, message: 'Vui lòng nhập thời gian' }],
                                onChange: this.onChangeRage,
                                initialValue: [date.startDate,
                                    date.endDate]
                            })(
                                <RangePicker
                                    ranges={{
                                        "Tuần hiện tại": [
                                            moment().startOf("week"),
                                            moment().endOf("week")
                                        ],
                                        "Tháng hiện tại": [
                                            moment().startOf("month"),
                                            moment().endOf("month")
                                        ],
                                        "Tuần trước": [
                                            moment()
                                                .add(-1, "weeks")
                                                .startOf("week"),
                                            moment()
                                                .add(-1, "weeks")
                                                .endOf("week")
                                        ],
                                        "Tháng trước": [
                                            moment()
                                                .add(-1, "months")
                                                .startOf("month"),
                                            moment()
                                                .add(-1, "months")
                                                .endOf("month")
                                        ],
                                    }}
                                    format="DD-MM-YYYY"
                                />,
                            )}
                        </Form.Item>

                    </Col>
                </Row>
            </Form>
        )
    }
}

const WrappedNotifiCompanyForm = Form.create()(BookingFormSearch);
export default WrappedNotifiCompanyForm;