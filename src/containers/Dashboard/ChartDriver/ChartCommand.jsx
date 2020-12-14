import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Bar, HorizontalBar } from 'react-chartjs-2';
import {
    DatePicker,
    Row,
    Col,
} from "antd";
import moment from "moment";

// actions
import { actions as dashboardActions } from "../../../redux/dashboard/acions";

//styles
import "../styles.scss";

const RangePicker = DatePicker.RangePicker;
class ChartCommand extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            paramsCommand: {
                startDate: moment().subtract(10, 'days'),
                endDate: moment(new Date()),
            },
        }
    }

    componentDidMount() {
        const { paramsCommand } = this.state;
        this.props.filterChart({
            startDate: paramsCommand.startDate.format("MM/DD/YYYY"),
            endDate: paramsCommand.endDate.format("MM/DD/YYYY"),
        });
    }

    handleFilterChart = () => {
        const { paramsCommand } = this.state;
        this.props.filterChart({
            startDate: paramsCommand.startDate.format("MM/DD/YYYY"),
            endDate: paramsCommand.endDate.format("MM/DD/YYYY"),
        });
    };

    onFocus = () => {
        const { item, isModal } = this.props;
        if(!isModal) {
            this.props.onFocus(item)
        }
    };

    render() {
        const { dataChart } = this.props.Dashboard;
        if (dataChart.message) {
            return <div align="center"> Bạn không có quyền thực hiện</div>;
        }
        const { paramsCommand } = this.state;
        if (!dataChart.datasets) {
            return null;
        }
        return (
            <div className="p-2">
                <Row className="headerChart">
                    <Col span={12}>
                        <div className="titleChart">Báo cáo điều hành</div>
                    </Col>
                    <Col span={12}>
                        <RangePicker
                            onChange={dates => {
                                this.setState({
                                    paramsCommand: {
                                        startDate: dates[0].startOf("day"),
                                        endDate: dates[1].endOf("day"),
                                    }
                                }, () => this.handleFilterChart());
                            }}
                            value={[paramsCommand.startDate,
                            paramsCommand.endDate]}
                            ranges={{
                                "Hôm nay": [moment(), moment()],
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
                                "Tuần sau": [
                                    moment()
                                        .add(1, "weeks")
                                        .startOf("week"),
                                    moment()
                                        .add(1, "weeks")
                                        .endOf("week")
                                ],
                                "Tháng sau": [
                                    moment()
                                        .add(1, "months")
                                        .startOf("month"),
                                    moment()
                                        .add(1, "months")
                                        .endOf("month")
                                ]
                            }}
                            format="DD-MM-YYYY"
                        />
                    </Col>
                </Row>
                {
                    dataChart.labels.length > 0 ? (
                        <Bar
                            data={dataChart}
                            options={{
                                onClick: (e, item) => {
                                    if(e.layerY > 80) {
                                    this.onFocus()
                                    }
                                },
                                legend: {
                                    display: true
                                },
                            }}
                        />
                    ) :
                        (
                            <div align="center"> Không có dữ liệu</div>
                        )
                }
            </div>
        );
    }
}


const {
    filterChart,
} = dashboardActions;
const mapStateToProps = store => {
    return {
        Dashboard: store.Dashboard.toJS(),
    };
};
const mapDispatchToProps = dispatch => bindActionCreators(
    {
        filterChart,
    },
    dispatch
);
export default connect(mapStateToProps, mapDispatchToProps)(ChartCommand);
