import React, { Component } from 'react';
import { connect } from "react-redux";
import { Row, Col, Form } from 'antd';
import { bindActionCreators } from "redux";
import { actions as ExtractActions } from "../../../redux/extract/actions";
import moment from 'moment';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

const { extractDownloadCommandManagent } = ExtractActions;

class ReportCommandManagament extends Component {
    constructor(props) {
        super(props)
        this.state = {
            startDate: '',
            endDate: '',
        };
    };

    onClick = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { startDate, endDate } = this.state;
                const params = {
                    startDate: moment(startDate).format('YYYY-MM-DD'),
                    endDate: moment(endDate).format('YYYY-MM-DD'),
                };
                this.props.extractDownloadCommandManagent(params);
            }
        });
        
    };

    onChangeRage = (dates) => {
        if(dates.length > 0) {
            this.setState({
                startDate: dates[0].startOf("day"),
                endDate: dates[1].endOf("day"),
            });
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div style={{ padding: 25, backgroundColor: '#fff' }}>
                <Row>
                    <Col span={6}>
                        <Form
                            ref={form => (this.form = form)}
                            enctype="multipart/form-data"
                        >
                            <Form.Item>
                                {getFieldDecorator('title', {
                                    rules: [{ required: true, message: 'Vui lòng chọn thời gian' }],
                                    onChange: this.onChangeRage,
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
                        </Form>
                    </Col>
                    <Col span={12} />
                    <Col span={6} style={{justifyContent: 'flex-end', display: 'flex'}}>
                        <div class="kt-portlet__head-actions">
                            &nbsp;
                            <button
                                type="button"
                                onClick={this.onClick}
                                className="btn btn-google"
                            >
                                Xuất báo cáo
                            </button>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}


const mapDispatchToProps = dispatch => bindActionCreators(
    {
        extractDownloadCommandManagent
    },
    dispatch,
);
const WrappedNotifiCompanyForm = Form.create()(ReportCommandManagament);
export default connect(null, mapDispatchToProps)(WrappedNotifiCompanyForm);

