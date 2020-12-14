import React, { Component } from 'react'
import { Line } from 'react-chartjs-2';
import { DatePicker, Row, Col } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from "moment";
//actions
import { actions as dashboardActions } from "../../../redux/dashboard/acions";
const d = new Date();
class ReportForYear extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			year: moment(new Date()),
			isopen: false,
		}
	}

	componentDidMount() {
		const params = {
			year: d.getFullYear(),
		}
		this.props.getReportForYear(params)
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

	onChangeYear = (date) => {
		this.setState({
			isopen: false,
			year: moment(date),
		});
		const params = {
			year: moment(date).format('YYYY'),
		}
		this.props.getReportForYear(params)
	};

	onFocus = () => {
		const { item } = this.props;
		this.props.onFocus(item)
	};

	render() {
		const { year, isopen } = this.state;
		const { dataReportMonth } = this.props.Dashboard;
		return (
			<div className="p-2">
				<Row className="pt-2">
					<Col span={16}>
						<div className="titleChart"> Doanh thu theo tháng</div>
					</Col>
					<Col span={8}>
						<DatePicker
							value={year}
							format='YYYY'
							open={isopen}
							mode="year"
							onPanelChange={this.onChangeYear}
							placeholder="Chọn năm"
							onOpenChange={status => {
								this.setState({ isopen: !!status });
							}}
						/>
					</Col>
				</Row>
				{
					dataReportMonth && (
						<Line
							data={dataReportMonth}
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
	getReportForYear,
} = dashboardActions;
const mapStateToProps = store => {
	return {
		Dashboard: store.Dashboard.toJS(),
	};
};
const mapDispatchToProps = dispatch => bindActionCreators(
	{
		getReportForYear,
	},
	dispatch
);
export default connect(mapStateToProps, mapDispatchToProps)(ReportForYear);

