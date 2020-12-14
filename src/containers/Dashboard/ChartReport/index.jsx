import React, { Component } from 'react';
import {
    Row,
    Modal,
    Col,
} from "antd";
// components
import ReportForYear from './ReportForYear';
import ReportForMonth from './ReportForMonth';
//styles
import "../styles.scss";

class ChartReport extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            listChart: ['year', 'month'],
            itemChart: 'year',
        }
    }

    onFocus = (params) => {
        this.setState({
            itemChart: params,
            visible: true,
        })
    };

    renderItemChart = (item) => {
        if (item === 'year') {
            return (
                <ReportForYear
                    item={item}
                    onFocus={this.onFocus}
                />
            )
        } else if (item === 'month') {
            return (
                <ReportForMonth
                    item={item}
                    onFocus={this.onFocus}
                />
            )
        }

    }

    handleCancel = () => {
        this.setState({ visible: false })
    };

    render() {
        return (
            <div className="sumcommand">
                <Row>
                    {
                        this.state.listChart.map((item, index) => (
                            <Col key={index} span={12}>
                                {this.renderItemChart(item)}
                            </Col>
                        ))
                    }
                </Row>
                <Modal
                    width={'70%'}
                    style={{ top: 20 }}
                    title="Báo cáo doanh thu"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    {this.renderItemChart(this.state.itemChart)}
                </Modal>
            </div>
        );
    }
}

export default ChartReport;
