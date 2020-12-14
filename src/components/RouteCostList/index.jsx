import React from 'react';
import { Form, Select, Spin, Table, DatePicker } from 'antd';
import _ from "lodash";
import classnames from "classnames";
import { API_URI } from "@Constants";
import { NumberFormatCustom, TourSelect } from "../Utility/common";
import { FormattedNumber } from "react-intl";
import { requestJson } from "@Services/base";
import { checkMoment } from '@Helpers/utility';
import { DATE_TIME_FORMAT } from '@Constants/common';
import { TextField } from '@material-ui/core';

const { Column, ColumnGroup } = Table;
class RouteSelect extends React.PureComponent {
  _cache = {};
  fetchRoute = (searchInput) => {
    let param = {
      "pageLimit": 20,
      "currentPage": 0,
      "searchInput": searchInput
    };
    this.setState({ data: [], fetching: true });
    requestJson({ url: API_URI.BROWSE_TOUR_ROUTE, data: param })
      .then(response => {
        const data = response.data.data.map((route, routeId) => {
          return {
            key: route.uuid,
            label: route.name,
            days: route.days,
            code: route.code
          };
        });
        this.setState({ data, fetching: false });
      });
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: []
    }
  }

  render() {
    const { data, fetching } = this.state;
    const { value, onSelectRoute, currentRoute } = this.props;
    return (
      <Select
        showArrow
        showSearch
        value={value || { key: null, label: null }}
        labelInValue
        filterOption={false}
        placeholder={'Tên tuyến đường'}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onChange={(route) => onSelectRoute(route, data)}
        onFocus={() => {
          if (data.length === 0) {
            this.fetchRoute('');
          }
        }}
        onSearch={(searchInput) => {
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(e => {
            this.fetchRoute(searchInput);
          }, 800);
        }}
        style={{ width: '100%' }}
      >
        {data.map((user, userId) => {
          if (currentRoute.find(r => r === user.key)) {
            return (
              <Select.Option title={user.label} disabled value={user.key} key={userId}>{user.label}</Select.Option>
            )
          }
          return (
            <Select.Option title={user.label} value={user.key} key={userId}>{user.label}</Select.Option>
          )
        })}
      </Select>
    )
  }
}

class RouteCostList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      change: {
        per: {
          uuid: '',
          tempData: {},
          data: []
        },
        cost: []
      }
    };
    this.commitChangesPerCost = this.commitChangesPerCost.bind(this);
    this.commitChangesCost = this.commitChangesCost.bind(this);
    this.commitChangesKmCost = this.commitChangesKmCost.bind(this);
    this.block = true;
  }

  commitChangesPerCost(record, rowIndex, columnIndex, perData, costData) {
    let { setCostPerToParent, setCostToParent, orgId } = this.props;
    let { dataSource, change } = this.state;
    let rows = [...dataSource];
    let changeData = { ...change };
    if (rowIndex === 0) {
      rows = rows.map((row, rowId) => {
        if (row['key'] === record['key']) {
          return {
            ...row, ...record
          };
        } else if (rowId > 2) {
          let temp = {};
          temp[columnIndex] = (row['Km'] ? row['Km'].toString().replace("Km", '') : 0) * record[columnIndex];
          return {
            ...row, ...temp
          };
        }
        return row;
      });
    } else {
      rows = rows.map(row => {
        if (row['key'] === record['key']) {
          return { ...row, ...record };
        }
        return row;
      });
    }
    changeData.per.tempData[columnIndex] = perData;
    changeData.per.uuid = orgId;
    changeData.per.startDate = costData.startDate;
    changeData.per.endDate = costData.endDate;
    rows.forEach((dt, dtId) => {
      if (dtId < 3) {
        Object.keys(dt).forEach((rowKey, rowKeyIndex) => {
          if (!(rowKey === 'Km' || rowKey === 'numberOfDays' || rowKey === 'numberOfNights' || rowKey === 'type' || rowKey === 'id' || rowKey === 'code' || rowKey === 'Tuyến đường' || rowKey === "startDate" || rowKey === "endDate" || rowKey === 'key' || rowKey === 'Thời Gian' || rowKey.includes('-name'))) {
            changeData.per.tempData[rowKey] = {
              "vehicleTypeId": rowKey,
              "costPerKm": dt['Tuyến đường'] === 'Đơn giá theo KM' ? (isNaN(rows[0][rowKey]) ? 0 : parseFloat(rows[0][rowKey])) : (isNaN(rows[0][rowKey]) ? 0 : parseFloat(rows[0][rowKey])),
              "overNightCost": dt['Tuyến đường'] === 'Đơn giá qua đêm' ? (isNaN(rows[1][rowKey]) ? 0 : parseFloat(rows[1][rowKey])) : (isNaN(rows[1][rowKey]) ? 0 : parseFloat(rows[1][rowKey])),
              "perDay": dt['Tuyến đường'] === 'Đơn giá theo ngày' ? (isNaN(rows[2][rowKey]) ? 0 : parseFloat(rows[2][rowKey])) : (isNaN(rows[2][rowKey]) ? 0 : parseFloat(rows[2][rowKey]))
            };
          }
        });
      }
    });

    costData.rows.forEach((cost) => {
      if (changeData.cost.length === 0) {
        changeData.cost.push({
          "customerOrgId": orgId,
          "fixedRouteId": cost.fixedRouteId,
          "type": cost.type,
          "code": cost.code,
          "startDate": cost.startDate,
          "endDate": cost.endDate,
          "id": cost.id,
          "distance": cost.km,
          "data": [
            {
              "vehicleTypeId": costData.colIndex,
              "price": cost.price
            }
          ]
        })
      } else {
        changeData.cost = changeData.cost.map((ch, chId) => {
          if (ch.fixedRouteId === cost.fixedRouteId) {
            if (ch.data.length === 0) {
              ch.data.push({
                "vehicleTypeId": costData.colIndex,
                "price": cost.price
              });
              return ch;
            } else {
              ch.data = ch.data.map((d, dId) => {
                if (d.vehicleTypeId === costData.colIndex) {
                  d.price = cost.price;
                }
                return d;
              });
              if (!ch.data.find(d => d.vehicleTypeId === costData.colIndex)) {
                ch.data.push({
                  "vehicleTypeId": costData.colIndex,
                  "price": cost.price
                })
              }
              return ch
            }
          } else {
            return ch;
          }
        });
        if (!changeData.cost.find(ch => ch.fixedRouteId === cost.fixedRouteId)) {
          changeData.cost.push({
            "customerOrgId": orgId,
            "fixedRouteId": cost.fixedRouteId,
            "distance": cost.km,
            "type": cost.type,
            "startDate": cost.startDate,
            "endDate": cost.endDate,
            "code": cost.code,
            "id": cost.id,
            "data": [
              {
                "vehicleTypeId": costData.colIndex,
                "price": cost.price
              }
            ]
          })
        }
      }
    });
    this.setState((prevState) => {
      let newState = { ...prevState };
      setCostPerToParent(changeData, rows);
      newState.change = changeData;
      setCostToParent(newState.change.cost, rows);
      newState.dataSource = rows;
      return newState;
    });
  }

  commitChangesCost(record, rowIndex, columnIndex, costData, oldCost) {
    let { dataSource } = this.state;

    let temp = dataSource.map(row => {
      if (row['key'] === record['key']) {
        return { ...row, ...record };
      }
      return row;
    });
    // change.per.tempData[`${rowIndex}-${columnIndex}`] =
    this.setState((prevState) => {
      let newState = { ...prevState };
      let { setCostToParent } = this.props;
      let newCost = [];
      if (newState.change.cost.length > 0) {
        newCost = newState.change.cost.map(function (c) {
          return c.fixedRouteId === costData.fixedRouteId ? costData : c;
        });
        let find = newCost.find(x => x.fixedRouteId === costData.fixedRouteId);
        if (!find) {
          newCost.push(costData);
        }
      } else {
        newCost.push(costData);
      }

      newCost.push(oldCost);
      newState.dataSource = temp;
      newState.change.cost = newCost;
      setCostToParent(newState.change.cost, temp);
      return newState;
    });
  }

  commitChangesKmCost(record, columnIndex, costData) {
    let { dataSource } = this.state;
    let { setCostToParent } = this.props;
    let rows = [...dataSource];

    let temp = rows.map(row => {
      if (row['key'] === record['key']) {
        return { ...row, ...record };
      }
      return row;
    });

    // change.per.tempData[`${rowIndex}-${columnIndex}`] =
    this.setState((prevState) => {
      let newState = { ...prevState };
      let newCost = [];
      if (newState.change.cost.length > 0) {
        newCost = newState.change.cost.map(function (c) {
          return c.fixedRouteId === costData.fixedRouteId ? costData : c;
        });
        let find = newCost.find(x => x.fixedRouteId === costData.fixedRouteId);
        if (!find) {
          newCost.push(costData);
        }
      } else {
        newCost.push(costData);
      }

      newState.dataSource = temp;
      newState.change.cost = newCost;
      debugger;
      setCostToParent(newState.change.cost, temp);
      return newState;
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.costLoading) {
      this.block = false;
    }
    if (!nextProps.costLoading && !this.block) {
      this.setState({
        dataSource: nextProps.listCost
      });
      this.block = true;
    }
  }

  render() {
    const _this = this;
    const { getFieldDecorator, setFieldsValue, filterDatetime, onChangeFilterDateTime } = this.props;
    const { dataSource } = this.state;
    return (
      <div className="kt-portlet kt-portlet--mobile">
        <div className="kt-portlet__head kt-portlet__head--lg kt-portlet__head--fit">
          <div className="kt-portlet__head-label">
            <button
              onClick={(e) => {
                let newPersonalRouteCost = [...dataSource];
                newPersonalRouteCost.push({ key: newPersonalRouteCost.length, type: 1 });
                this.setState({
                  dataSource: newPersonalRouteCost
                })
              }}
              type="button"
              className="btn btn-brand btn-icon-sm"
            >
              <i className="fa fa-plus" />
              Thêm tuyến
                </button>
            &nbsp;
                <button
              onClick={(e) => {
                let newPersonalRouteCost = [...dataSource];
                newPersonalRouteCost.push({ key: newPersonalRouteCost.length, type: 2 });
                this.setState({
                  dataSource: newPersonalRouteCost
                })
              }}
              type="button"
              className="btn btn-warning btn-icon-sm"
            >
              <i className="fa fa-plus" />
              Thêm tour
                </button>

          </div>
          <div className="kt-portlet__head-toolbar">
            <div className="kt-portlet__head-wrapper">
              <DatePicker format={DATE_TIME_FORMAT.DD_MM_YYYY__HH_MM} showTime showToday value={checkMoment(filterDatetime)} placeholder="Chọn ngày" onChange={e => {
                onChangeFilterDateTime(e);
              }} />
            </div>
          </div>
        </div>
        <div className="kt-portlet__body kt-portlet__body--fit">
          <Table
            id="routeCostList"
            bordered
            dataSource={dataSource}
            pagination={false}
            scroll={{ x: true }}
          >
            <Column
              className="cr-table__header column-large"
              align="center"
              title="Tuyến đường/Tour"
              dataIndex="Tuyến đường"
              key="Tuyến đường"
              fixed={dataSource.length > 0}
              render={(value, record, index) => {
                let currentRoute = dataSource.map(x => {
                  if (!(x['Tuyến đường'] === 'Đơn giá theo KM' || x['Tuyến đường'] === 'Đơn giá theo ngày' || x['Tuyến đường'] === 'Đơn giá qua đêm' || x['Tuyến đường'] === 'key') && x.type != 2) {
                    return x['Tuyến đường'];
                  }
                });
                let currentTour = dataSource.map(x => {
                  if (!(x['Tuyến đường'] === 'Đơn giá theo KM' || x['Tuyến đường'] === 'Đơn giá theo ngày' || x['Tuyến đường'] === 'Đơn giá qua đêm' || x['Tuyến đường'] === 'key') && x.type == 2) {
                    return x['Tuyến đường'];
                  }
                });
                let render = null;
                if (index < 3) {
                  render = value;
                } else {
                  let initValue = record['Tuyến đường'] ? {
                    key: record['Tuyến đường'],
                    label: record['Tuyến đường-name']
                  } : undefined;
                  render =
                    <Form.Item
                      className={'routeCostSelect'}
                    >
                      {getFieldDecorator(`routeId-${index}`, {
                        initialValue: initValue,
                        rules: [
                          {
                            required: true,
                            message: 'Please input route',
                          },
                        ],
                      })(
                        record.type != 2 ?
                          <RouteSelect
                            currentRoute={currentRoute}
                            onSelectRoute={(route, listRoute) => {
                              let findRoute = listRoute.find(x => x.key === route.key);
                              let tempRecord = { ...record };

                              let oldRoute = {
                                customerOrgId: _this.props.orgId,
                                fixedRouteId: route.key,
                                code: findRoute.code,
                                type: 1,
                                distance: 0,
                                data: []
                              };
                              tempRecord['Tuyến đường'] = route.key;
                              tempRecord['Tuyến đường-name'] = route.label;
                              tempRecord['code'] = findRoute.code;
                              tempRecord['Thời Gian'] = findRoute.days;
                              let data = {
                                customerOrgId: _this.props.orgId,
                                fixedRouteId: tempRecord['Tuyến đường'],
                                distance: tempRecord['Km'],
                                code: tempRecord.code,
                                startDate: tempRecord.startDate,
                                endDate: tempRecord.endDate,
                                type: 1,
                                data: []
                              };
                              if (tempRecord['Tuyến đường']) {
                                Object.keys(dataSource[0]).forEach((rowKey, rowKeyIndex) => {
                                  if (!(rowKey === 'Km' || rowKey === 'Tuyến đường' || rowKey === "startDate" || rowKey === "endDate" || rowKey === 'key' || rowKey === 'id' || rowKey === 'type' || rowKey === 'code' || rowKey === 'Thời Gian' || rowKey.includes('-name')) && dataSource[0][rowKey]) {
                                    let costPerKm;
                                    let km;
                                    if (dataSource[0][rowKey] && tempRecord['Km']) {
                                      costPerKm = dataSource[0][rowKey];
                                      km = tempRecord['Km'];
                                      data.data.push({
                                        vehicleTypeId: rowKey,
                                        price: parseFloat(costPerKm) * parseFloat(km)
                                      });
                                      oldRoute.data.push({
                                        vehicleTypeId: rowKey,
                                        price: parseFloat(costPerKm) * parseFloat(km)
                                      })
                                    }
                                    tempRecord[rowKey] = (dataSource[0][rowKey] && tempRecord['Km']) ? parseFloat(costPerKm) * parseFloat(km) : undefined;
                                  }
                                })
                              }
                              let set = {};
                              set[`routeId-${index}`] = {
                                key: route.key,
                                label: route.label
                              };
                              setFieldsValue(set);
                              this.commitChangesCost(tempRecord, index, 0, data, oldRoute);
                            }}
                          /> :
                          <TourSelect
                            currentRoute={currentTour}
                            onSelect={(route, listRoute) => {
                              let findRoute = listRoute.find(x => x.key === route.key);
                              let tempRecord = { ...record };

                              let oldRoute = {
                                customerOrgId: _this.props.orgId,
                                fixedRouteId: route.key,
                                id: findRoute.id,
                                distance: 0,
                                code: findRoute.code,
                                numberOfDays: findRoute.numberOfDays,
                                numberOfNights: findRoute.numberOfNights,
                                type: 2,
                                data: []
                              };
                              tempRecord['Tuyến đường'] = route.key;
                              tempRecord['id'] = findRoute.id;
                              tempRecord['numberOfDays'] = findRoute.numberOfDays;
                              tempRecord['code'] = findRoute.code;
                              tempRecord['numberOfNights'] = findRoute.numberOfNights;
                              tempRecord['Tuyến đường-name'] = route.label;
                              tempRecord['Thời Gian'] = `${findRoute.numberOfDays ? `${findRoute.numberOfDays} ngày` : '0 ngày'} ${findRoute.numberOfNights ? `${findRoute.numberOfNights} đêm` : '0 đêm'}`;
                              let data = {
                                customerOrgId: _this.props.orgId,
                                fixedRouteId: tempRecord['Tuyến đường'],
                                id: findRoute.id,
                                numberOfDays: tempRecord.numberOfDays,
                                numberOfNights: tempRecord.numberOfNights,
                                distance: tempRecord['Km'],
                                code: tempRecord.code,
                                startDate: tempRecord.startDate,
                                endDate: tempRecord.endDate,
                                type: 2,
                                data: []
                              };
                              if (tempRecord['Tuyến đường']) {
                                Object.keys(dataSource[0]).forEach((rowKey, rowKeyIndex) => {
                                  if (!(rowKey === 'Km' || rowKey === 'Tuyến đường' || rowKey === "startDate" || rowKey === "endDate" || rowKey === 'id' || rowKey === 'key' || rowKey === 'type' || rowKey === 'code' || rowKey === 'Thời Gian' || rowKey.includes('-name')) && dataSource[0][rowKey]) {
                                    let costPerKm;
                                    let km;
                                    if (dataSource[0][rowKey] && tempRecord['Km']) {
                                      costPerKm = dataSource[0][rowKey];
                                      km = tempRecord['Km'];
                                      data.data.push({
                                        vehicleTypeId: rowKey,
                                        price: parseFloat(costPerKm) * parseFloat(km)
                                      });
                                      oldRoute.data.push({
                                        vehicleTypeId: rowKey,
                                        price: parseFloat(costPerKm) * parseFloat(km)
                                      })
                                    }
                                    tempRecord[rowKey] = (dataSource[0][rowKey] && tempRecord['Km']) ? parseFloat(costPerKm) * parseFloat(km) : undefined;
                                  }
                                })
                              }
                              let set = {};
                              set[`routeId-${index}`] = {
                                key: route.key,
                                label: route.label
                              };
                              setFieldsValue(set);
                              this.commitChangesCost(tempRecord, index, 0, data, oldRoute);
                            }}
                          />
                      )}
                    </Form.Item>
                }
                return render;
              }}
            />
            <Column
              className="cr-table__header column-extra-small"
              align="center"
              title="Mã"
              dataIndex="code"
              key="code"
              fixed={dataSource.length > 0}
              render={(value, record, index) => {
                let render = null;
                if (index > 2 && record['type'] == 2) {
                  render =
                    <TextField
                      label=""
                      value={value}
                      onChange={(event) => {
                        let key = 'code';
                        let inputValue = event.target.value;
                        let tempRecord = { ...record };
                        tempRecord[key] = inputValue ? inputValue : tempRecord['code'];
                        let oldRoute = {};
                        let data = {};
                        if (tempRecord["type"] == 1) {
                          oldRoute = {
                            customerOrgId: _this.props.orgId,
                            fixedRouteId: tempRecord['Tuyến đường'],
                            distance: tempRecord['Km'],
                            numberOfDays: tempRecord['numberOfDays'],
                            numberOfNights: tempRecord['numberOfNights'],
                            code: tempRecord.code,
                            startDate: tempRecord.startDate,
                            endDate: tempRecord.endDate,
                            type: 1,
                            data: []
                          };
                          data = {
                            customerOrgId: _this.props.orgId,
                            fixedRouteId: tempRecord['Tuyến đường'],
                            numberOfDays: tempRecord.numberOfDays,
                            numberOfNights: tempRecord.numberOfNights,
                            distance: tempRecord['Km'],
                            code: tempRecord.code,
                            startDate: tempRecord.startDate,
                            endDate: tempRecord.endDate,
                            type: 1,
                            data: []
                          };
                        } else {
                          oldRoute = {
                            customerOrgId: _this.props.orgId,
                            fixedRouteId: tempRecord['Tuyến đường'],
                            distance: tempRecord['Km'],
                            numberOfDays: tempRecord['numberOfDays'],
                            numberOfNights: tempRecord['numberOfNights'],
                            id: tempRecord['Tuyến đường'],
                            code: tempRecord.code,
                            startDate: tempRecord.startDate,
                            endDate: tempRecord.endDate,
                            type: 2,
                            data: []
                          };
                          data = {
                            customerOrgId: _this.props.orgId,
                            fixedRouteId: tempRecord['Tuyến đường'],
                            id: tempRecord['Tuyến đường'],
                            numberOfDays: tempRecord.numberOfDays,
                            numberOfNights: tempRecord.numberOfNights,
                            distance: tempRecord['Km'],
                            code: tempRecord.code,
                            startDate: tempRecord.startDate,
                            endDate: tempRecord.endDate,
                            type: 2,
                            data: []
                          };
                        }

                        if (tempRecord['Tuyến đường']) {
                          Object.keys(dataSource[0]).forEach((rowKey, rowKeyIndex) => {
                            if (!(rowKey === 'Km' || rowKey === 'Tuyến đường' || rowKey === "startDate" || rowKey === "endDate" || rowKey === 'key' || rowKey === 'type' || rowKey === 'code' || rowKey === 'id' || rowKey === 'Thời Gian' || rowKey.includes('-name')) && dataSource[0][rowKey]) {
                              let costPerKm;
                              let km;
                              if (dataSource[0][rowKey] && tempRecord['Km']) {
                                costPerKm = dataSource[0][rowKey];
                                km = tempRecord['Km'];
                                data.data.push({
                                  vehicleTypeId: rowKey,
                                  price: parseFloat(costPerKm) * parseFloat(km)
                                });
                                oldRoute.data.push({
                                  vehicleTypeId: rowKey,
                                  price: parseFloat(costPerKm) * parseFloat(km)
                                })
                              }
                              tempRecord[rowKey] = (dataSource[0][rowKey] && tempRecord['Km']) ? parseFloat(costPerKm) * parseFloat(km) : undefined;
                            }
                          })
                        }
                        let set = {};
                        set[`code-${index}`] = inputValue;
                        setFieldsValue(set);
                        this.commitChangesCost(tempRecord, index, 0, data, oldRoute);
                      }}
                    />
                }
                return (
                  <div>
                    {render}
                  </div>
                )
              }}
            />
            <Column
              className="cr-table__header"
              align="center"
              title="Loại"
              dataIndex="type"
              key="type"
              fixed={dataSource.length > 0}
              render={(value, record, index) => {
                if (index < 3) {
                  return '';
                } else {
                  if (value == 2) {
                    return "Tour"
                  } else {
                    return "Tuyến"
                  }
                }
              }}
            />
            <Column
              className="cr-table__header"
              align="center"
              title="Thời gian"
              dataIndex="Thời Gian"
              key="Thời Gian"
              fixed={dataSource.length > 0}
              render={(value, record, index) => {
                if (index < 3) {
                  return '';
                } else {
                  if (record['type'] == 2) {
                    return `${record.numberOfDays ? `${record.numberOfDays} ngày` : '0 ngày'} ${record.numberOfNights ? `${record.numberOfNights} đêm` : '0 đêm'}`;
                  } else {
                    return "1"
                  }
                }
              }}
            />
            <ColumnGroup className="cr-table__header" fixed={dataSource.length > 0} title="Khoảng giá">
              <Column className="cr-table__header column-small" align="center" fixed={dataSource.length > 0} title="Từ" dataIndex="startDate" key="startDate"
                render={(value, record, index) => {
                  if (index < 3) {
                    return <DatePicker
                      style={{ minWidth: 150 }}
                      showToday
                      allowClear={false}
                      showTime
                      format={DATE_TIME_FORMAT.DD_MM_YYYY__HH_MM}
                      placeholder="Bắt đầu"
                      value={checkMoment(value)}
                      onChange={e => {
                        let key = 'startDate';
                        let inputValue = e.startOf('day');
                        let tempRecord = { ...record };
                        tempRecord[key] = inputValue ? inputValue : tempRecord['startDate'];
                        let tempPer = {
                          per: {
                            uuid: _this.props.orgId,
                            startDate: tempRecord[key],
                            endDate: tempRecord['endDate'] || null,
                            tempData: {}
                          }
                        };
                        let tempDataSource = dataSource.map((dt, dtId) => {
                          if (dtId < 3) {
                            Object.keys(dt).forEach((rowKey, rowKeyIndex) => {
                              if (!(rowKey === 'Km' || rowKey === 'numberOfDays' || rowKey === 'numberOfNights' || rowKey === 'type' || rowKey === 'id' || rowKey === 'code' || rowKey === 'Tuyến đường' || rowKey === "startDate" || rowKey === "endDate" || rowKey === 'key' || rowKey === 'Thời Gian' || rowKey.includes('-name')) && dataSource[index][rowKey]) {
                                tempPer.per.tempData[rowKey] = {
                                  "vehicleTypeId": rowKey,
                                  "costPerKm": dt['Tuyến đường'] === 'Đơn giá theo KM' ? (isNaN(dataSource[0][rowKey]) ? 0 : parseFloat(dataSource[0][rowKey])) : (isNaN(dataSource[0][rowKey]) ? 0 : parseFloat(dataSource[0][rowKey])),
                                  "overNightCost": dt['Tuyến đường'] === 'Đơn giá qua đêm' ? (isNaN(dataSource[1][rowKey]) ? 0 : parseFloat(dataSource[1][rowKey])) : (isNaN(dataSource[1][rowKey]) ? 0 : parseFloat(dataSource[1][rowKey])),
                                  "perDay": dt['Tuyến đường'] === 'Đơn giá theo ngày' ? (isNaN(dataSource[2][rowKey]) ? 0 : parseFloat(dataSource[2][rowKey])) : (isNaN(dataSource[2][rowKey]) ? 0 : parseFloat(dataSource[2][rowKey]))
                                };
                              }
                            });
                            dt.startDate = tempRecord[key];
                            return dt;
                          }
                          return dt;
                        });
                        _this.setState({
                          dataSource: tempDataSource,
                        });
                        debugger;
                        _this.props.setCostPerToParent(tempPer);
                      }}
                    />;
                  } else {
                    return (
                      <DatePicker
                        style={{ minWidth: 150 }}
                        showToday
                        showTime
                        allowClear={false}
                        format={DATE_TIME_FORMAT.DD_MM_YYYY__HH_MM}
                        placeholder="Bắt đầu"
                        value={checkMoment(value)}
                        onChange={e => {
                          let key = 'startDate';
                          let inputValue = e.startOf('day');
                          let tempRecord = { ...record };
                          tempRecord[key] = inputValue ? inputValue : tempRecord['startDate'];
                          let oldRoute = {};
                          let data = {};
                          let tempData = [];
                          Object.keys(dataSource[index]).forEach((rowKey, rowKeyIndex) => {
                            if (!(rowKey === 'Km' || rowKey === 'numberOfDays' || rowKey === 'numberOfNights' || rowKey === 'type' || rowKey === 'id' || rowKey === 'code' || rowKey === 'Tuyến đường' || rowKey === "startDate" || rowKey === "endDate" || rowKey === 'key' || rowKey === 'Thời Gian' || rowKey.includes('-name')) && dataSource[index][rowKey]) {
                              tempData.push({
                                vehicleTypeId: rowKey,
                                price: dataSource[index][rowKey]
                              });
                            }
                          });
                          if (tempRecord["type"] == 1) {
                            oldRoute = {
                              customerOrgId: _this.props.orgId,
                              fixedRouteId: tempRecord['Tuyến đường'],
                              distance: tempRecord['Km'],
                              numberOfDays: tempRecord['numberOfDays'],
                              numberOfNights: tempRecord['numberOfNights'],
                              code: tempRecord.code,
                              startDate: tempRecord.startDate || null,
                              endDate: tempRecord.endDate || null,
                              type: 1,
                              data: tempData
                            };
                            data = {
                              customerOrgId: _this.props.orgId,
                              fixedRouteId: tempRecord['Tuyến đường'],
                              numberOfDays: tempRecord.numberOfDays,
                              numberOfNights: tempRecord.numberOfNights,
                              distance: tempRecord['Km'],
                              code: tempRecord.code,
                              startDate: tempRecord.startDate || null,
                              endDate: tempRecord.endDate || null,
                              type: 1,
                              data: tempData
                            };
                          } else {
                            oldRoute = {
                              customerOrgId: _this.props.orgId,
                              fixedRouteId: tempRecord['Tuyến đường'],
                              distance: tempRecord['Km'],
                              numberOfDays: tempRecord['numberOfDays'],
                              numberOfNights: tempRecord['numberOfNights'],
                              id: tempRecord['Tuyến đường'],
                              code: tempRecord.code,
                              startDate: tempRecord.startDate || null,
                              endDate: tempRecord.endDate || null,
                              type: 2,
                              data: tempData
                            };
                            data = {
                              customerOrgId: _this.props.orgId,
                              fixedRouteId: tempRecord['Tuyến đường'],
                              id: tempRecord['Tuyến đường'],
                              numberOfDays: tempRecord.numberOfDays,
                              numberOfNights: tempRecord.numberOfNights,
                              distance: tempRecord['Km'],
                              code: tempRecord.code,
                              startDate: tempRecord.startDate || null,
                              endDate: tempRecord.endDate || null,
                              type: 2,
                              data: tempData
                            };
                          }
                          this.commitChangesCost(tempRecord, index, 0, data, oldRoute);
                        }}
                      />)
                  }
                }}
              />
              <Column className="cr-table__header column-small" align="center" fixed={dataSource.length > 0} title="Đến" dataIndex="endDate" key="endDate"
                render={(value, record, index) => {
                  if (index < 3) {
                    return <DatePicker
                      style={{ minWidth: 150 }}
                      showToday
                      allowClear={false}
                      showTime
                      format={DATE_TIME_FORMAT.DD_MM_YYYY__HH_MM}
                      placeholder="Kết thúc"
                      value={checkMoment(value)}
                      onChange={e => {
                        let key = 'endDate';
                        let inputValue = e.endOf('day');
                        let tempRecord = { ...record };
                        tempRecord[key] = inputValue ? inputValue : tempRecord['endDate'];
                        let tempPer = {
                          per: {
                            uuid: _this.props.orgId,
                            endDate: tempRecord[key],
                            startDate: tempRecord['startDate'] || null,
                            tempData: {}
                          }
                        };
                        let tempDataSource = dataSource.map((dt, dtId) => {
                          if (dtId < 3) {
                            Object.keys(dt).forEach((rowKey, rowKeyIndex) => {
                              if (!(rowKey === 'Km' || rowKey === 'numberOfDays' || rowKey === 'numberOfNights' || rowKey === 'type' || rowKey === 'id' || rowKey === 'code' || rowKey === 'Tuyến đường' || rowKey === "startDate" || rowKey === "endDate" || rowKey === 'key' || rowKey === 'Thời Gian' || rowKey.includes('-name')) && dataSource[index][rowKey]) {
                                tempPer.per.tempData[rowKey] = {
                                  "vehicleTypeId": rowKey,
                                  "costPerKm": dt['Tuyến đường'] === 'Đơn giá theo KM' ? (isNaN(dataSource[0][rowKey]) ? 0 : parseFloat(dataSource[0][rowKey])) : (isNaN(dataSource[0][rowKey]) ? 0 : parseFloat(dataSource[0][rowKey])),
                                  "overNightCost": dt['Tuyến đường'] === 'Đơn giá qua đêm' ? (isNaN(dataSource[1][rowKey]) ? 0 : parseFloat(dataSource[1][rowKey])) : (isNaN(dataSource[1][rowKey]) ? 0 : parseFloat(dataSource[1][rowKey])),
                                  "perDay": dt['Tuyến đường'] === 'Đơn giá theo ngày' ? (isNaN(dataSource[2][rowKey]) ? 0 : parseFloat(dataSource[2][rowKey])) : (isNaN(dataSource[2][rowKey]) ? 0 : parseFloat(dataSource[2][rowKey]))
                                };
                              }
                            });
                            dt.endDate = tempRecord[key];
                            return dt;
                          }
                          return dt;
                        });
                        _this.setState({
                          dataSource: tempDataSource,
                        });
                        debugger;
                        _this.props.setCostPerToParent(tempPer);
                      }}
                    />;
                  } else {
                    return (
                      <DatePicker
                        style={{ minWidth: 150 }}
                        showToday
                        allowClear={false}
                        format={DATE_TIME_FORMAT.DD_MM_YYYY__HH_MM}
                        showTime
                        placeholder="Kết thúc"
                        value={checkMoment(value)}
                        onChange={e => {
                          let key = 'endDate';
                          let inputValue = e.endOf('day');
                          let tempRecord = { ...record };
                          tempRecord[key] = inputValue ? inputValue : tempRecord['endDate'];
                          let oldRoute = {};
                          let data = {};
                          let tempData = [];
                          Object.keys(dataSource[index]).forEach((rowKey, rowKeyIndex) => {
                            if (!(rowKey === 'Km' || rowKey === 'numberOfDays' || rowKey === 'numberOfNights' || rowKey === 'type' || rowKey === 'id' || rowKey === 'code' || rowKey === 'Tuyến đường' || rowKey === "startDate" || rowKey === "endDate" || rowKey === 'key' || rowKey === 'Thời Gian' || rowKey.includes('-name')) && dataSource[index][rowKey]) {
                              tempData.push({
                                vehicleTypeId: rowKey,
                                price: dataSource[index][rowKey]
                              });
                            }
                          });
                          if (tempRecord["type"] == 1) {
                            oldRoute = {
                              customerOrgId: _this.props.orgId,
                              fixedRouteId: tempRecord['Tuyến đường'],
                              distance: tempRecord['Km'],
                              numberOfDays: tempRecord['numberOfDays'],
                              numberOfNights: tempRecord['numberOfNights'],
                              code: tempRecord.code,
                              startDate: tempRecord.startDate,
                              endDate: tempRecord.endDate,
                              type: 1,
                              data: tempData
                            };
                            data = {
                              customerOrgId: _this.props.orgId,
                              fixedRouteId: tempRecord['Tuyến đường'],
                              numberOfDays: tempRecord.numberOfDays,
                              numberOfNights: tempRecord.numberOfNights,
                              distance: tempRecord['Km'],
                              code: tempRecord.code,
                              startDate: tempRecord.startDate,
                              endDate: tempRecord.endDate,
                              type: 1,
                              data: tempData
                            };
                          } else {
                            oldRoute = {
                              customerOrgId: _this.props.orgId,
                              fixedRouteId: tempRecord['Tuyến đường'],
                              distance: tempRecord['Km'],
                              numberOfDays: tempRecord['numberOfDays'],
                              numberOfNights: tempRecord['numberOfNights'],
                              id: tempRecord['Tuyến đường'],
                              code: tempRecord.code,
                              startDate: tempRecord.startDate,
                              endDate: tempRecord.endDate,
                              type: 2,
                              data: tempData
                            };
                            data = {
                              customerOrgId: _this.props.orgId,
                              fixedRouteId: tempRecord['Tuyến đường'],
                              id: tempRecord['Tuyến đường'],
                              numberOfDays: tempRecord.numberOfDays,
                              numberOfNights: tempRecord.numberOfNights,
                              distance: tempRecord['Km'],
                              code: tempRecord.code,
                              startDate: tempRecord.startDate,
                              endDate: tempRecord.endDate,
                              type: 2,
                              data: tempData
                            };
                          }
                          this.commitChangesCost(tempRecord, index, 0, data, oldRoute);
                        }}
                      />)
                  }
                }}
              />
            </ColumnGroup>
            <Column
              className="cr-table__header column-tiny"
              align="center"
              title="KM"
              dataIndex="Km"
              key="Km"
              fixed={dataSource.length > 0}
              render={(value, record, index) => {
                let render = null;
                if (index > 2) {
                  render =
                    <TextField
                      label=""
                      value={value}
                      onChange={(event) => {
                        let key = 'Km';
                        let inputValue = event.target.value;
                        let tempRecord = { ...record };
                        tempRecord[key] = _.isNull(inputValue) ? 0 : parseFloat(inputValue);
                        let data = {
                          customerOrgId: _this.props.orgId,
                          fixedRouteId: record['Tuyến đường'],
                          code: record['code'] ? record.code : null,
                          id: tempRecord['type'] == 2 ? tempRecord['Tuyến đường'] : null,
                          numberOfDays: tempRecord.numberOfDays,
                          numberOfNights: tempRecord.numberOfNights,
                          startDate: tempRecord.startDate,
                          endDate: tempRecord.endDate,
                          type: tempRecord['type'] ? tempRecord['type'] : 1,
                          distance: _.isNull(inputValue) ? 0 : parseFloat(inputValue),
                          data: []
                        };
                        if (tempRecord['Tuyến đường']) {
                          Object.keys(dataSource[0]).forEach((rowKey, rowKeyIndex) => {
                            if (!(rowKey === 'Km' || rowKey === 'numberOfDays' || rowKey === 'numberOfNights' || rowKey === 'type' || rowKey === 'id' || rowKey === 'code' || rowKey === 'Tuyến đường' || rowKey === "startDate" || rowKey === "endDate" || rowKey === 'key' || rowKey === 'Thời Gian' || rowKey.includes('-name')) && dataSource[0][rowKey]) {
                              let costPerKm = dataSource[0][rowKey] || 0;
                              let km = _.isNull(inputValue) ? 0 : parseFloat(inputValue);
                              // if (km) {
                              data.data.push({
                                vehicleTypeId: rowKey,
                                price: parseFloat(costPerKm) * parseFloat(km)
                              });
                              // }

                              tempRecord[rowKey] = dataSource[0][rowKey] ? parseFloat(costPerKm) * parseFloat(km) : undefined;
                            }
                          })
                        } else {
                          Object.keys(dataSource[0]).forEach((rowKey, rowKeyIndex) => {
                            if (!(rowKey === 'Km' || rowKey === 'Tuyến đường' || rowKey === "startDate" || rowKey === "endDate" || rowKey === 'numberOfDays' || rowKey === 'numberOfNights' || rowKey === 'type' || rowKey === 'id' || rowKey === 'code' || rowKey === 'key' || rowKey === 'Thời Gian' || rowKey.includes('-name')
                            ) &&
                              dataSource[0][rowKey]
                            ) {
                              let costPerKm = dataSource[0][rowKey] || 0;
                              let km = _.isNull(inputValue) ? 0 : parseFloat(inputValue);
                              tempRecord[rowKey] = parseFloat(costPerKm) * parseFloat(km);
                            }
                          })
                        }
                        this.commitChangesKmCost(tempRecord, key, data);
                      }}
                      id="formatted-numberformat-input"
                      InputProps={{
                        inputComponent: NumberFormatCustom
                      }}
                    />
                }
                return (
                  <div>
                    {render}
                  </div>
                )
              }}
            />
            {dataSource.length > 0 ?
              Object.keys(dataSource[0]).map((key, keyId) => {
                if (!(key === 'Tuyến đường' || key === "startDate" || key === "endDate" || key === 'numberOfDays' || key === 'numberOfNights' || key === 'type' || key === 'id' || key === 'code' || key === 'Km' || key === 'Thời Gian' || key === 'numberOfNights' || key === 'numberOfDays' || key === 'key' || key.includes('name')
                )) {
                  let titles = _.split(dataSource[0][`${key}-name`], '||', 2);
                  return (
                    <Column
                      align="center"
                      className="cr-table__header column-extra-small"
                      title={
                        <div>
                          <h4 style={{ color: 'rgb(108, 114, 147)' }}>{titles[0] || ''}</h4>
                          <h6 style={{ color: 'rgb(108, 114, 147)' }}>{titles[1] || ''}</h6>
                        </div>}
                      dataIndex={key}
                      key={key}
                      render={(value, record, index) => {
                        let render = null;
                        if (index > 2) {
                          render = value ? <FormattedNumber value={value} /> : '0';
                        } else {
                          render =
                            <TextField
                              label=""
                              value={value}
                              onChange={(event) => {
                                let inputValue = event.target.value;
                                let tempRecord = { ...record };
                                tempRecord[key] = parseFloat(inputValue);
                                let costdata = {
                                  colIndex: key,
                                  rows: [],
                                  startDate: tempRecord.startDate,
                                  endDate: tempRecord.endDate,
                                };
                                if (tempRecord['Tuyến đường'] === 'Đơn giá theo KM') {
                                  dataSource.forEach((d, dId) => {
                                    if (dId > 2 && d['Km']) {
                                      costdata.rows.push({
                                        fixedRouteId: d['Tuyến đường'],
                                        numberOfDays: tempRecord.numberOfDays,
                                        numberOfNights: tempRecord.numberOfNights,
                                        code: d.code ? d.code : null,
                                        startDate: tempRecord.startDate,
                                        endDate: tempRecord.endDate,
                                        id: d['type'] == 2 ? d['Tuyến đường'] : null,
                                        type: d['type'] ? d['type'] : 1,
                                        price: (isNaN(tempRecord[key]) ? 0 : parseFloat(tempRecord[key])) * parseFloat(d['Km']),
                                        km: parseFloat(d['Km']),
                                      })
                                    }
                                  })
                                }

                                let data = {
                                  "vehicleTypeId": key,
                                  "costPerKm": record['Tuyến đường'] === 'Đơn giá theo KM' ? (isNaN(tempRecord[key]) ? 0 : parseFloat(tempRecord[key])) : (isNaN(dataSource[0][key]) ? 0 : parseFloat(dataSource[0][key])),
                                  "overNightCost": record['Tuyến đường'] === 'Đơn giá qua đêm' ? (isNaN(tempRecord[key]) ? 0 : parseFloat(tempRecord[key])) : (isNaN(dataSource[1][key]) ? 0 : parseFloat(dataSource[1][key])),
                                  "perDay": record['Tuyến đường'] === 'Đơn giá theo ngày' ? (isNaN(tempRecord[key]) ? 0 : parseFloat(tempRecord[key])) : (isNaN(dataSource[2][key]) ? 0 : parseFloat(dataSource[2][key])),
                                };
                                this.commitChangesPerCost(tempRecord, index, key, data, costdata);
                              }}
                              id="formatted-numberformat-input"
                              InputProps={{
                                inputComponent: NumberFormatCustom
                              }}
                            />
                        }
                        return (
                          <div
                            className={classnames({
                              'text-right': index > 2
                            })}
                          >
                            {render}
                          </div>
                        )
                      }}
                    />
                  )
                }
              })
              : null}

          </Table>
        </div>
      </div>
    )
  }
}
export default RouteCostList;