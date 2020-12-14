import React, { memo, useState, useEffect, useCallback } from "react";
import { Ui } from "@Helpers/Ui";
import { URI } from "./constants";
import Globals from "globals.js";
import ServiceBase from "@Services/ServiceBase";
import { Spin } from "antd";
import moment from 'moment';
import downloadFile from '../downloadFile';
// components
import BookingStatisticsList from './BookingStatisticsList';
import BookingStatisticsFilter from './BookingStatisticsFilter';

const BookingStatistics = () => {
  const profile = Globals.currentUser;
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loadding, setLoading] = useState(false);
  const [params, setParams] = useState({
    // pages: 1,
    // pageSize: 15,
    dateType: 'dateDeparture',
    startDate: moment().subtract(2, 'days').format('YYYY-MM-DD'),
    endDate: moment(new Date()).format('YYYY-MM-DD'),
    customerCode: undefined,
    bookingsCode: undefined,
    salesCode: undefined,
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
      organizationId: params.organizations.key,
    }
    setLoading(true)
    let result = await ServiceBase.requestJson({
      method: "GET",
      url: URI.GET_LIST_BOOKING,
      data: paramsNew
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setLoading(false)
      let data = [];
      result.value.rows.forEach((value, index) => {
        let temp = {
            key: null,
            typeRow: value.isBold || false,
            col_1: {
                createdDate: value.dateAction ? value.dateAction : "",
                tripCode: value.tripCode,
            },
            col_2: {
                customerCode: value.customerCode || "",
                customerName: value.customerName || "",
            },
            col_3: {
                bookingCode: value.bookingCode ? value.bookingCode : "",
            },
            col_4: {
                dateIn: value.dateIn || "",
                dateOut: value.dateOut || ""
            },
            col_5: {
                tripStatusText: value.tripStatusText || "",
            },
            col_6: {
                creatorName: value.creatorName || "",
            },
            col_7: {
                contactName: value.contactName || "",
            },
            col_8: {
                vehicleTypeName: value.vehicleTypeName || "",
            },
            col_9: {
              routeName: value.routeName || ""
            },
            col_10: {
              flightTime: value.flightTime || "",
              flightLocation: value.flightLocation || ""
            },
            col_11: {
              flightInfo: value.flightInfo || "",
              flyTime: value.flyTime || ""
            },
            col_12: {
              actualVehicleTypeName: value.actualVehicleTypeName || "", 
              licensePlates: value.licensePlates || "",
            },
            col_13: {
              driverName: value.driverName || "", 
              driverPhone: value.driverPhone || "",
            },
            col_14: {
              amount: value.amount || "", 
            }
        };
        data.push(temp);
      });
      setData(data);
      setCount(result.value.count);
    }
  }, [params])

  const exportExcel = useCallback(async () => {
    const paramsNew = {
      ...params,
      customerCode: params.customerCode ? params.customerCode.key : '',
      bookingsCode: params.bookingsCode ? params.bookingsCode.key : '',
      salesCode: params.salesCode ? params.salesCode.key : '',
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
  }, [params.pageSize, params.pages]);

  return (
    <div className="kt-portlet kt-portlet--mobile">
      <BookingStatisticsFilter
        exportExcel={exportExcel}
        values={params}
        browseCommand={browseCommand} 
        setParams={setParams}
      />
      <Spin spinning={loadding} tip="Đang lấy dữ liệu...">
        <BookingStatisticsList
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

export default BookingStatistics;
