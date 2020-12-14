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

class ChartApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paramsDriver: {},
            isRenderDriver: true,
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.Dashboard.dataChartDriver !== this.props.Dashboard.dataChartDriver) {
            this.setState({ isRenderDriver: false }, () => {
                setTimeout(() => {
                    this.setState({
                        isRenderDriver: true,
                    })
                }, 200)
            })
        }
    }

    componentDidMount() {
        const paramsDriver = {
            startDate: moment().subtract(1, 'days'),
            endDate: moment().subtract(1, 'days')
        };
        this.props.filterChartDriver(paramsDriver);

    }

    handleFilterChartDriver = () => {
        this.props.filterChartDriver(this.state.paramsDriver);
    };

    heightChart(listDriver) {
        const {isModal} = this.props;
        if (listDriver.length > 4) {
            return isModal ? listDriver.length * 10 : listDriver.length * 25;
        } else if (listDriver.length === 1) {
            return 80
        } else if (listDriver.length === 2) {
            return 100
        } else if (listDriver.length === 3) {
            return 150
        }
    }


    onFocus = () => {
        const { item, isModal } = this.props;
        if(!isModal) {
            this.props.onFocus(item)
        }
    };

    render() {
        const {isModal} = this.props;
        const { dataChartDriver } = this.props.Dashboard;
        if (!dataChartDriver.datasets) {
            return null;
        }
        const arrayMaxData = dataChartDriver.datasets && dataChartDriver.datasets.map((item) => Math.max(...item.data));
        const numberMaxData = Math.max(...arrayMaxData);
        const listDriver = dataChartDriver.labels;
        return (
            <div className="p-2">
                <Row className="headerChart">
                    <Col span={16}>
                        <div className="titleChart">Báo cáo sử dụng app </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ marginRight: 10 }}>
                            <DatePicker
                                defaultValue={moment().subtract(1, 'days')}
                                style={{ marginRight: 5 }}
                                format="DD-MM-YYYY"
                                onChange={date => {
                                    this.setState({
                                        paramsDriver: {
                                            startDate: date,
                                            endDate: date,
                                        }
                                    }, () => this.handleFilterChartDriver());
                                }}

                            />
                        </div>
                    </Col>
                </Row>
                {
                    dataChartDriver.labels.length > 0 && this.state.isRenderDriver ? (
                        <div className={isModal ? "driverModal" : "driver"}>
                            <HorizontalBar
                                data={dataChartDriver}
                                height={this.heightChart(listDriver)}
                                options={{
                                    onClick: (e, item) => {
                                        if(e.layerY > 80) {
                                           this.onFocus()
                                        }
                                    },
                                    legend: {
                                        display: true
                                    },
                                    scales: {
                                        xAxes: [{
                                            ticks: {
                                                beginAtZero: true,
                                                stepSize: 1,
                                                min: 0,
                                                max: Math.ceil(numberMaxData * 0.2 + numberMaxData),
                                            },
                                        }],
                                        yAxes: [{
                                            minBarLength: 150,
                                            stacked: true,
                                            gridLines: {
                                                offsetGridLines: true
                                            },
                                        }]
                                    }
                                }}
                            />
                        </div>
                    ) : (
                            <div align="center"> Không có dữ liệu</div>
                        )
                }
            </div>
        );
    }
}


const {
    filterChartDriver
} = dashboardActions;
const mapStateToProps = store => {
    return {
        Dashboard: store.Dashboard.toJS(),
    };
};
const mapDispatchToProps = dispatch => bindActionCreators(
    {
        filterChartDriver
    },
    dispatch
);
export default connect(mapStateToProps, mapDispatchToProps)(ChartApp);
