import React, { memo } from "react";
import { Row, Col, DatePicker, Select } from 'antd';
import moment from 'moment';
import classNames from "classnames";
import ContractType from "components/SelectContainer/ContractType";
import Corporate from "@Components/SelectContainer/Corporate";
import VehicleTypeNoOrg from "@Components/SelectContainer/VehicleTypeNoOrg";
import RouteList from "components/SelectContainer/RouteList";
import ContractList from "@Components/SelectContainer/ContractList";
import SelectSon from '@Components/SelectSon';

// components
import InputLabel from '@Components/InputLabel';

const { RangePicker } = DatePicker;

const PerformanceMonitorFilter = memo(({values, setParams, browseCommand, clearFilter, exportExcel}) => {
  return (
    <div className="mb-4">
      <div className="mb-2" style={{display: 'flex', justifyContent:' flex-end'}}>
        <button
            type="button"
            onClick={e => {
              exportExcel()
            }}
            className={classNames({
              "btn btn-danger btn-icon-sm mr-3": true,
            })}
          >
            Xuất excel
        </button>
          <button
            type="button"
            onClick={e => {
              clearFilter()
            }}
            className={classNames({
              "btn btn-default btn-icon-sm mr-3": true,
            })}
          >
              Xóa bộ lọc
        </button>
        <button
            type="button"
            onClick={e => {
              browseCommand()
            }}
            className={classNames({
              "btn btn-brand btn-icon-sm": true,
            })}
          >
            <i className="fa fa-search" />  Tìm kiếm
        </button>
      </div>
      <Row gutter={16}>
        <Col className="gutter-row" span={8}>
          {/* Chọn doanh nghiệp */}
          <Corporate
            isBigSize
            mode="multiple"
            value={values.corporates}
            onSelect={(corporates) =>
              setParams(prevState=>{
                let nextState= {...prevState};
                  nextState.corporates = corporates;
                  return nextState;
                })
            }
          />
        </Col>
        <Col className="gutter-row" span={8}>
          {/* Chọn số hợp đồng */}
          <ContractList
            value={values.contracted}
            onSelect={(contracted) => {
              setParams(prevState=>{
                let nextState= {...prevState};
                  nextState.contracted = contracted;
                  return nextState;
                })
            }}
          />
        </Col>
        <Col className="gutter-row" span={8}>
          <ContractType
            multiple={true}
            value={values.contractTypes}
            onSelect={selected => {
              console.log("selected", selected)
              setParams(prevState => {
                const nextState = { ...prevState };
                nextState.contractTypes = selected;
                return nextState;
              });
            }}
          />
        </Col>
      
        
      </Row>
      <Row gutter={16} className="pt-2">
        <Col className="gutter-row" span={8}>
        {/* <SelectSon
          value={values.routes}
          mode="multiple"
          url={`/auto/contract/routes`}
          placeholder={"Chọn tuyến đường"}
          onSelect={(item) => {
            setParams(prevState=>{
              let nextState= {...prevState};
                nextState.routes = item;
                return nextState;
              })
          }}
        /> */}
        <RouteList
          mode="multiple"
          placeholder="Chọn tuyến đường"
          value={values.routes}
          onSelect={(item) => {
            setParams(prevState=>{
              let nextState= {...prevState};
                nextState.routes = item;
                return nextState;
              })
          }}
        />
        </Col>
        <Col className="gutter-row" span={8}>
        <RangePicker
          format={"DD-MM-YYYY"}
          value={(values.startDate && values.endDate) ?  [moment(values.startDate), moment(values.endDate)] : undefined}
          onChange={dates => {
            console.log("date", dates)
            setParams(prevState=>{
              let nextState= {...prevState};
                nextState.startDate = dates.length > 0 ? moment(dates[0].startOf("day")).format('YYYY-MM-DD') : undefined;
                nextState.endDate = dates.length > 0 ? moment(dates[1].endOf("day")).format('YYYY-MM-DD') : undefined;
                return nextState;
              })
          }}
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
        />
        </Col>
        <Col className="gutter-row" span={8}>
          <SelectSon
            value={values.vehicleTypes}
            mode="multiple"
            url={`/auto/vehicle-type`}
            placeholder={"Chọn loại xe"}
            onSelect={(item) => {
              setParams(prevState=>{
                let nextState= {...prevState};
                  nextState.vehicleTypes = item;
                  return nextState;
                })
            }}
          />
        </Col>
      </Row>
    
    </div>
  );
});

export default PerformanceMonitorFilter;