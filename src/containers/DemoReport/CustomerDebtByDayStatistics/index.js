import React, { memo, useState, useEffect, useCallback } from "react";
import { Ui } from "@Helpers/Ui";
import { URI } from "./constants";
import Globals from "globals.js";
import ServiceBase from "@Services/ServiceBase";
import { Spin } from "antd";
import downloadFile from '../downloadFile';
import moment from 'moment';
import CustomerDebtByDayStatisticsFilter from './CustomerDebtByDayStatisticsFilter';
import CustomerDebtByDayStatisticsList from './CustomerDebtByDayStatisticsList';

const CustomerDebtByDayStatistics = () => {
  const profile = Globals.currentUser;
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loadding, setLoading] = useState(false);
  const [params, setParams] = useState({
    // pages: 1,
    // pageSize: 15,
    dateType: 'dateIn',
    startDate: moment(new Date()).format('YYYY-MM-DD'),
    endDate: moment(new Date()).format('YYYY-MM-DD'),
    customerCode: undefined,
    bookingsCode: undefined,
    salesCode: undefined,
    driverName: undefined,
    licensePlate: undefined,
    organizations: profile
    ? {
        key: profile.organizationUuid,
        label: profile.organizationName
      }
    : undefined,
  });
 
  const browseCommand = useCallback(async () => {
    const paramsNew = {
      ...params,
      customerCode: params.customerCode ? params.customerCode.key : '',
      bookingsCode: params.bookingsCode ? params.bookingsCode.key : '',
      salesCode: params.salesCode ? params.salesCode.key : '',
      driverName: params.driverName ? params.driverName.key : '',
      licensePlate: params.licensePlate ? params.licensePlate.key : '',
      organizationId: params.organizations.key,
    }
    setLoading(true)
    let result = await ServiceBase.requestJson({
      method: "GET",
      url: URI.GET_LIST_DEBT_FOR_DAY,
      data: paramsNew
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setLoading(false)
      setData(result.value.rows || [])
      setCount(result.value.count);
    }
  }, [params])

  const exportExcel = useCallback(async () => {
    const paramsNew = {
      ...params,
      customerCode: params.customerCode ? params.customerCode.key : '',
      bookingsCode: params.bookingsCode ? params.bookingsCode.key : '',
      salesCode: params.salesCode ? params.salesCode.key : '',
      licensePlate: params.licensePlate ? params.licensePlate.key : '',
      organizationId: params.organizations.key,
      result: 'excel'
    }
    let result = await ServiceBase.requestJson({
      method: "GET",
      url: URI.EXPORT_EXCEL,
      data: paramsNew
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      downloadFile(result.value, "Công nợ khách hàng theo ngày (nội bộ)")
      Ui.showSuccess("Xuất thành công");
    }
  }, [params]);

  // Load data
  useEffect(() => {
    browseCommand()
  }, [params.pages, params.pageSize]);

  return (
    <div className="kt-portlet kt-portlet--mobile">
      <CustomerDebtByDayStatisticsFilter
        exportExcel={exportExcel}
        values={params}
        browseCommand={browseCommand} 
        setParams={setParams}
      />
      <Spin spinning={loadding} tip="Đang lấy dữ liệu...">
        <CustomerDebtByDayStatisticsList
          count={count}
          data={data}
          setParams={setParams}
          pages={params.pages}
          pageSize={params.pageSize}
        />
      </Spin>
    </div>
  )
}

export default CustomerDebtByDayStatistics;
