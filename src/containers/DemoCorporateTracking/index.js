import React, { memo, useState, useEffect, useCallback } from "react";
import moment from "moment";
import { Grid } from "@material-ui/core";
import { Ui } from "@Helpers/Ui";
import { URI } from "./constants";
import ServiceBase from "@Services/ServiceBase";
import Portlet from "@Components/Portlet";
import PortletBody from "@Components/Portlet/PortletBody";
import downloadFile from "@Components/Utility/downloadFile";
import Helmet from "react-helmet";
import { Spin, Drawer, Modal as Modaled, Button } from "antd";

// components
import CorporateTrackingList from "./CorporateTrackingList";
import CorporateTrackingFilter from "./CorporateTrackingFilter";
import Modal from "./Modal";
import CheckInList from "./CheckIn/index";
import { requestJsonGet } from "@Services/base";

let time = null;
const PerformanceMonitor = memo(() => {
  const [total, setTotal] = useState(10);
  const [itemSelected, setItemSelected] = useState(null);
  const [isVisible, setShowModal] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [data, setData] = useState([]);
  const [dataCheckIn, setDataCheckIn] = useState([]);
  const [loaddingCheckIn, setLoadingCheckIn] = useState(false);
  const [loadding, setLoading] = useState(false);
  const [infoHeader, setInfoHeader] = useState({});
  const [params, setParams] = useState({
    startDate: moment().subtract(2, "days").format("YYYY-MM-DD"),
    endDate: moment(new Date()).format("YYYY-MM-DD"),
    contractTypes: undefined,
    corporates: undefined,
    vehicleTypes: undefined,
    selected: undefined,
    contracted: undefined,
    pages: 0,
    pageSize: 5,
  });

  const onShowModal = useCallback(async (item) => {
    await setShowModal(true);
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: `${URI.GET_DETAIL_ORPORATE_TRACKING}/${item.uuidTrip}?contractId=${item.uuidContract}`,
      data: {},
    });

    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      await setItemSelected(result.value);
    }
  }, []);
  const onShowCheckIn = useCallback(async (item) => {
    setShowCheckIn(true);
    setLoadingCheckIn(true);
    let result = await requestJsonGet({
      url: `/trip-points/${item}`,
      method: "GET",
    });
    if (result.hasErrors) {
      setLoadingCheckIn(false);
    } else {
      setLoadingCheckIn(false);
      setDataCheckIn(result.data);
    }
  }, []);
  const onCloseCheckIn = useCallback(() => {
    setShowCheckIn(false);
  }, []);
  const onClose = useCallback(() => {
    setShowModal(false);
    setItemSelected(null);
  }, []);

  const clearFilter = useCallback(async () => {
    const paramsNew = {
      startDate: undefined,
      endDate: undefined,
      contractTypes: undefined,
      corporates: undefined,
      vehicleTypes: undefined,
      selected: undefined,
      contracted: undefined,
      pages: 0,
      pageSize: 5,
    };
    setParams(paramsNew);
    setLoading(true);
    let result = await ServiceBase.requestJson({
      method: "POST",
      url: URI.GET_CORPORATE_TRACKING,
      data: paramsNew,
    });
    if (result.hasErrors) {
      setLoading(false);
      Ui.showErrors(result.errors);
    } else {
      setLoading(false);
      setTotal(result.value.total);
      setData(result.value.docs || []);
    }
  }, []);

  const browseCommand = useCallback(async () => {
    const corporatesNew = params.corporates
      ? params.corporates.map((item) => item.key)
      : [];
    const routesNew = params.routes
      ? params.routes.map((item) => item.key)
      : [];
    const vehicleTypesNew = params.vehicleTypes
      ? params.vehicleTypes.map((item) => item.key)
      : [];

    const paramsNew = {
      contractID: params.contracted ? params.contracted.key : "",
      startDate: params.startDate,
      endDate: params.endDate,
      corporates: corporatesNew,
      contractTypes: params.contractTypes || [],
      routes: routesNew,
      vehicleTypes: vehicleTypesNew,
      pages: params.pages,
      pageSize: params.pageSize,
    };
    setLoading(true);
    let result = await ServiceBase.requestJson({
      method: "POST",
      url: URI.GET_CORPORATE_TRACKING,
      data: paramsNew,
    });
    if (result.hasErrors) {
      setLoading(false);
      Ui.showErrors(result.errors);
    } else {
      setLoading(false);
      setTotal(result.value.total);
      setData(result.value.docs || []);
    }
  }, [params]);

  const exportExcel = useCallback(async () => {
    const corporatesNew = params.corporates
      ? params.corporates.map((item) => item.key)
      : [];
    const routesNew = params.routes
      ? params.routes.map((item) => item.key)
      : [];
    const vehicleTypesNew = params.vehicleTypes
      ? params.vehicleTypes.map((item) => item.key)
      : [];

    const paramsNew = {
      contractID: params.contracted ? params.contracted.key : "",
      startDate: params.startDate,
      endDate: params.endDate,
      corporates: corporatesNew,
      contractTypes: params.contractTypes || [],
      routes: routesNew,
      vehicleTypes: vehicleTypesNew,
      pages: params.pages,
      pageSize: params.pageSize,
      result: "excel",
    };
    let result = await ServiceBase.requestJson({
      method: "POST",
      url: URI.GET_CORPORATE_TRACKING,
      data: paramsNew,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      downloadFile(result.value, "Bảng theo dõi thực hiện");
      Ui.showSuccess({ message: "Xuất Excel thành công" });
    }
  }, [params]);

  // Load data
  useEffect(() => {
    browseCommand();
  }, [params.pages, params.pageSize]);

  return (
    <>
      <Grid container spacing={3}>
        <Helmet title="Bảng theo dõi thực hiện">
          <meta
            name="description"
            content="Bảng theo dõi thực hiện - Car Rental"
          />
        </Helmet>
        <Grid item xs={12}>
          <Portlet>
            <div className="kt-portlet__body pb-0 pt-10">
              <CorporateTrackingFilter
                exportExcel={exportExcel}
                clearFilter={clearFilter}
                values={params}
                setParams={setParams}
                browseCommand={browseCommand}
              />
            </div>
            <PortletBody className="pt-0">
              <Spin spinning={loadding} tip="Đang lấy dữ liệu...">
                <CorporateTrackingList
                  totalLength={total}
                  currentPage={params.pages}
                  pageSize={params.pageSize}
                  data={data}
                  onShowModal={onShowModal}
                  setParams={setParams}
                  onShowCheckIn={onShowCheckIn}
                  setShowCheckIn={setShowCheckIn}
                  setInfoHeader={setInfoHeader}
                />
              </Spin>
            </PortletBody>
          </Portlet>
        </Grid>
      </Grid>
      <Modaled
        width={"80%"}
        title="Chi tiết check-in"
        visible={showCheckIn}
        onOk={onCloseCheckIn}
        onCancel={onCloseCheckIn}
        footer={[
          <Button key="submit" type="primary" onClick={onCloseCheckIn}>
            Xác nhận
          </Button>,
        ]}
        destroyOnClose
      >
        <Spin spinning={loaddingCheckIn} tip="Đang tải dữ liệu">
          <CheckInList infoHeader={infoHeader} dataCheckIn={dataCheckIn}></CheckInList>
        </Spin>
      </Modaled>
      <Drawer
        width={"80%"}
        title={
          <span>
            <i onClick={onClose} className="fa fa-chevron-left"></i> &nbsp; Yêu
            cầu phát sinh chuyến
          </span>
        }
        placement="right"
        closable={false}
        onClose={onClose}
        visible={isVisible}
        destroyOnClose
      >
        <Modal
          itemSelected={itemSelected}
          onRefresh={browseCommand}
          onClose={onClose}
          setItemSelected={setItemSelected}
        />
      </Drawer>
    </>
  );
});

export default PerformanceMonitor;
