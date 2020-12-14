import React, { memo, useState, useEffect, useCallback } from "react";
import { Ui } from "@Helpers/Ui";
import { URI } from "./constants";
import Globals from "globals.js";
import ServiceBase from "@Services/ServiceBase";
import { Spin } from "antd";
import downloadFile from '../downloadFile';

import moment from 'moment';
//components
import PartnerDebtByMonthStatisticsList from'./PartnerDebtByMonthStatisticsList';
import PartnerDebtByMonthStatisticsFilter from'./PartnerDebtByMonthStatisticsFilter';

const PartnerDebtByMonthStatistics = () => {
  const profile = Globals.currentUser;
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loadding, setLoading] = useState(false);
  const [params, setParams] = useState({
    // pages: 1,
    // pageSize: 15,
    dateType: 'all',
    startDate: moment().subtract(2, 'days').format('YYYY-MM-DD'),
    endDate: moment(new Date()).format('YYYY-MM-DD'),
    customerCode: undefined,
    bookingsCode: undefined,
    salesCode: undefined,
    organCode: undefined,
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
      organCode: params.organCode ? params.organCode.key : '',
      organizationId: params.organizations.key,
    }
    setLoading(true)
    let result = await ServiceBase.requestJson({
      method: "GET",
      url: URI.GET_LIST_DEBT_FOR_MONTH,
      data: paramsNew
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setLoading(false)
      setData(result.value.rows);
      setCount(result.value.count);
    }
  }, [params])

  const exportExcel = useCallback(async () => {
    const paramsNew = {
      ...params,
      customerCode: params.customerCode ? params.customerCode.key : '',
      bookingsCode: params.bookingsCode ? params.bookingsCode.key : '',
      salesCode: params.salesCode ? params.salesCode.key : '',
      organCode: params.organCode ? params.organCode.key : '',
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
      downloadFile(result.value, "Công nợ khách hàng theo tháng (nội bộ)")
      Ui.showSuccess("Xuất thành công");
    }
  }, [params]);

  // Load data
  useEffect(() => {
    browseCommand()
  }, [params.pages, params.pageSize]);

  return (
    <div className="kt-portlet kt-portlet--mobile">
      <PartnerDebtByMonthStatisticsFilter
         exportExcel={exportExcel}
         values={params}
         browseCommand={browseCommand} 
         setParams={setParams}
      />
      <Spin spinning={loadding} tip="Đang lấy dữ liệu...">
          <PartnerDebtByMonthStatisticsList
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

export default PartnerDebtByMonthStatistics;
