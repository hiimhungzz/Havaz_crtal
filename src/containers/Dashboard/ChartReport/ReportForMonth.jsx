import React, { Component } from 'react'
import moment from "moment";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Line } from 'react-chartjs-2';
import { DatePicker, Row, Col } from 'antd';

//actions
import { actions as dashboardActions } from "../../../redux/dashboard/acions";
import { id } from 'postcss-selector-parser';

const { MonthPicker } = DatePicker;
const d = new Date();
class ReportForDay extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            month: moment(new Date()),
        }
    }

    componentDidMount() {
        const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
        const lastDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const params = {
            startDate: moment(firstDay).format('YYYY-MM-DD'),
            endDate: moment(lastDay).format('YYYY-MM-DD'),
        };
        this.props.getReportForMonth(params);
    }

    nFormatter = (num) => {
		if (num >= 1000000) {
		   return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
		}
		if (num >= 1000) {
		   return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
		}
		return num;
   }


    onChangeMonth = (date) => {
        this.setState({
            month: moment(date)
        });
        const year = parseInt(moment(date).format('YYYY'));
        const month = parseInt(moment(date).format('MM'));
        if (year === d.getFullYear() && month - 1 === d.getMonth()) {
            const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
            const lastDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            const params = {
                startDate: moment(firstDay).format('YYYY-MM-DD'),
                endDate: moment(lastDay).format('YYYY-MM-DD'),
            };
            this.props.getReportForMonth(params);
        } else {
            const firstDay = new Date(year, month - 1, 1);
            const lastDay = new Date(year, month, 0);
            const params = {
                startDate: moment(firstDay).format('YYYY-MM-DD'),
                endDate: moment(lastDay).format('YYYY-MM-DD'),
            };
            this.props.getReportForMonth(params);
        }
    };

    onFocus = () => {
        const {item} = this.props;
        this.props.onFocus(item)
    };

    render() {
        const { dataReportDay } = this.props.Dashboard;
        const { month } = this.state;
        return (
            <div className="p-2">
                <Row className="pt-2">
                    <Col span={16}>
                        <div className="titleChart"> Doanh thu theo ngày</div>
                    </Col>
                    <Col span={8}>
                        <MonthPicker
                            format='MM-YYYY'
                            value={month}
                            onChange={this.onChangeMonth}
                            placeholder="Chọn tháng"
                        />
                    </Col>
                </Row>
                {
                    dataReportDay && (
                        <Line
                            data={dataReportDay}
                            options={{
                                onClick: (e, item) => {
                                    if(e.layerY > 80) {
                                       this.onFocus()
                                    }
                                },
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            callback: this.nFormatter
                                        }
                                    }]
                                },
                                tooltips: {
                                    callbacks: {
                                        label: function (tooltipItem, data) {
                                            return tooltipItem.yLabel.toLocaleString('vi', { style: 'currency', currency: 'VND' });
                                        }
                                    }
                                }
                            }}
                        />
                    )
                }
            </div>
        );
    }
}



const {
    getReportForMonth,
} = dashboardActions;
const mapStateToProps = store => {
    return {
        Dashboard: store.Dashboard.toJS(),
    };
};
const mapDispatchToProps = dispatch => bindActionCreators(
    {
        getReportForMonth,
    },
    dispatch
);
export default connect(mapStateToProps, mapDispatchToProps)(ReportForDay);
