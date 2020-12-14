import React, { Component } from 'react';
import {
    Row,
    Modal,
    Col,
} from "antd";
// components
import ChartApp from "./ChartApp";
import ChartCommand from "./ChartCommand";
//styles
import "../styles.scss";

class ChartDriver extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            listChartDriver: ['command', 'app'],
        }
    }

    onFocus = (params) => {
        this.setState({
            itemChart: params,
            visible: true,
        })
    };

    renderItemChart = (item) => {
        if (item === 'command') {
            return (
                <ChartCommand
                    item={item}
                    onFocus={this.onFocus}
                />
            )
        } else if (item === 'app') {
            return (
                <ChartApp
                    isModal={false}
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
        const { itemChart } = this.state;
        return (
            <div className="sumcommand">
                <Row>
                    {
                        this.state.listChartDriver.map((item, index) => (
                            <Col key={index} span={12}>
                                {this.renderItemChart(item)}
                            </Col>
                        ))
                    }
                </Row>
                <Modal
                    width={'70%'}
                    style={{ top: 20 }}
                    title="Báo cáo"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    {
                        itemChart === 'command' ? (
                            <ChartCommand isModal/>
                        ) :
                            (
                                <ChartApp isModal />
                            )
                    }
                </Modal>
            </div>
        );
    }
}

export default ChartDriver;

