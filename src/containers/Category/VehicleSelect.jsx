import React, {Component} from 'react';
import {Icon, Popconfirm, Tag} from "antd";

import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {actions as driverAction} from "../../redux/driver/actions";

import { Select, MenuItem } from '@material-ui/core';

const {driverSearch, showModal, onPageChange} = driverAction;

class VehicleSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: new Map(),
            rootValue: '',
            inputValue: new Map(),
            visible: false,
            title: '',
            data: {},
            rowId: '',
            value: ''
        };
        this.handleShowVehilceResponse = this.handleShowVehilceResponse.bind(this);
        this.handleHideVehilceResponse = this.handleHideVehilceResponse.bind(this);
        this.handleAssignVehicle = this.handleAssignVehicle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.cancel = this.cancel.bind(this);
        this.confirm = this.confirm.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.value) {
            this.setState({value: nextProps.value, rootValue: nextProps.value})
        }
    }

    handleShowVehilceResponse() {
        let _this = this;
        let {rowId} = this.props;
        let {value, inputValue} = this.state;
        this.setState(prevState => {
            let newState = {...prevState};
            newState.rowId = rowId;
            newState.input.set(rowId,
                <div className="form-group form-md-line-input inline-div">
                    <div className="col-md-8" style={{paddingLeft: 0, paddingRight: 0}}>
                        <Select className="form-control" name="status"
                                onChange={e => _this.handleAssignVehicle(e, rowId)} value={newState.value || ''}>
                            {_this.props.listVehicle.map((vehicle, index) => {
                                return (
                                    <MenuItem key={vehicle.uuid} value={vehicle.uuid}>{vehicle.plate}</MenuItem>
                                )
                            })}
                        </Select>
                        <div className="form-control-focus"></div>
                    </div>
                    <Popconfirm
                        title={_this.state.title}
                        visible={_this.state.visible}
                        onVisibleChange={_this.handleVisibleChange}
                        onConfirm={e => _this.confirm({})}
                        onCancel={e => _this.cancel(rowId)}
                        okText="Replace"
                        cancelText="Cancel"
                    >
                        <a onClick={e => _this.handleSubmit({
                            userUuid: _this.props.userUuid,
                            vehiclesUuid: inputValue.get(rowId),
                            replace: this.state.title ? true : false
                        }, rowId)} className="col-md-4 control-label inline-label"
                           htmlFor="form_control_1"> <Icon type="check"/></a>
                    </Popconfirm>
                </div>);
            return newState;
        });
    }

    handleHideVehilceResponse() {
        let {rowId} = this.props;
        let {rootValue, inputValue} = this.state;
        let selectedVehicle = this.props.listVehicle.find(x => x.uuid === rootValue);
        let value = selectedVehicle ? selectedVehicle.code : '-';
        if (!inputValue.get(rowId)) {
            this.setState(prevState => {
                let newState = {...prevState};
                newState.rowId = rowId;
                newState.input.set(rowId, <Tag color={"#87d068"}>{this.props.value}</Tag>);
                return newState;
            });
        }
    }

    handleAssignVehicle(e, rowId) {
        let _this = this;
        this.setState(prevState => {
            let newState = {...prevState};
            newState.value = e.target.value;
            newState.rowId = rowId;
            newState.input.set(rowId,
                <div className="form-group form-md-line-input inline-div">
                    <div className="col-md-8" style={{paddingLeft: 0, paddingRight: 0}}>
                        <Select className="form-control" name="status"
                                onChange={e => _this.handleAssignVehicle(e, rowId)} value={newState.value || ''}>
                            {_this.props.listVehicle.map((vehicle, index) => {
                                return (
                                    <MenuItem key={vehicle.uuid} value={vehicle.uuid}>{vehicle.code}</MenuItem>
                                )
                            })}
                        </Select>
                        <div className="form-control-focus"></div>
                    </div>
                    <Popconfirm
                        title={_this.state.title}
                        visible={_this.state.visible}
                        onVisibleChange={_this.handleVisibleChange}
                        onConfirm={e => _this.confirm({}, rowId)}
                        onCancel={e => _this.cancel(rowId)}
                        okText="Replace"
                        cancelText="Cancel"
                    >
                        <a onClick={e => _this.handleSubmit({
                            userUuid: _this.props.userUuid,
                            vehiclesUuid: _this.state.inputValue.get(rowId),
                            replace: false
                        }, rowId)} className="col-md-4 control-label inline-label"
                           htmlFor="form_control_1"> <Icon type="check"/></a>
                    </Popconfirm>
                </div>
            );
            newState.inputValue.set(rowId, e.target.value);
            return newState;
        })
    }

    render() {
        const {rowId, value} = this.props;
        return (
            <div
                onMouseEnter={this.handleShowVehilceResponse}
                onMouseLeave={this.handleHideVehilceResponse}
                style={{width: "100%", height: '100%'}}>
                {this.state.input.get(rowId) ? this.state.input.get(rowId) : <Tag color={"#87d068"}>{value}</Tag>}
            </div>
        );
    }

    handleSubmit(data, rowId) {
        let _this = this;
        this.props.assignVehicleToDriver(data, (res) => {
            if (!(res.message === 'success')) {
                _this.setState(prevState => {
                    let newState = {...prevState};
                    newState.data = {...data, replace: true};
                    newState.visible = true;
                    newState.title = res.message;
                    newState.input.set(rowId,
                        <div className="form-group form-md-line-input inline-div">
                            <div className="col-md-8" style={{paddingLeft: 0, paddingRight: 0}}>
                                <Select className="form-control" name="status"
                                        onChange={e => _this.handleAssignVehicle(e, rowId)} value={newState.value}>
                                    {_this.props.listVehicle.map((vehicle, index) => {
                                        return (
                                            <MenuItem key={vehicle.uuid} value={vehicle.uuid}>{vehicle.plate}</MenuItem>
                                        )
                                    })}
                                </Select>
                                <div className="form-control-focus"></div>
                            </div>
                            <Popconfirm
                                title={newState.title}
                                visible={newState.visible}
                                onVisibleChange={_this.handleVisibleChange}
                                onConfirm={e => _this.confirm(data, rowId)}
                                onCancel={e => _this.cancel(rowId)}
                                okText="Replace"
                                cancelText="Cancel"
                            >
                                <a onClick={e => _this.handleSubmit({
                                    userUuid: _this.props.userUuid,
                                    vehiclesUuid: _this.state.inputValue.get(rowId),
                                    replace: false
                                }, rowId)} className="col-md-4 control-label inline-label"
                                   htmlFor="form_control_1"> <Icon type="check"/></a>
                            </Popconfirm>
                        </div>
                    );
                    return newState;
                })
            }
        });
    }

    cancel(rowId) {
        let _this = this;
        this.setState(prevState => {
            let newState = {...prevState};
            newState.visible = false;
            newState.title = '';
            newState.rowId = rowId;
            newState.input.set(rowId,
                <div className="form-group form-md-line-input inline-div">
                    <div className="col-md-8" style={{paddingLeft: 0, paddingRight: 0}}>
                        <Select className="form-control" name="status"
                                onChange={e => _this.handleAssignVehicle(e, rowId)} value={newState.value}>
                            {_this.props.listVehicle.map((vehicle, index) => {
                                return (
                                    <MenuItem key={vehicle.uuid} value={vehicle.uuid}>{vehicle.plate}</MenuItem>
                                )
                            })}
                        </Select>
                        <div className="form-control-focus"></div>
                    </div>
                    <a onClick={e => _this.handleSubmit({
                        userUuid: _this.props.userUuid,
                        vehiclesUuid: _this.state.inputValue.get(rowId),
                        replace: false
                    })} className="col-md-4 control-label inline-label"
                       htmlFor="form_control_1"> <Icon type="check"/></a>

                </div>
            );
            return newState;
        });
    }

    confirm(data, rowId) {
        let _this = this;
        this.props.assignVehicleToDriver(this.state.data, (res) => {
            this.props.driverSearch('', 5, 0, true);
            this.setState(prevState => {
                let newState = {...prevState};
                newState.visible = false;
                newState.title = '';
                newState.input.delete(this.state.rowId);
                return newState;
            });
        });
    }
}

VehicleSelect.propTypes = {};

const mapStateToProps = (store) => {
    return {}
};
const mapDispatchToProps = dispatch => bindActionCreators(
    {
        driverSearch
    },
    dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(VehicleSelect);