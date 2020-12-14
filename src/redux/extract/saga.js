import { all, takeEvery, put, call } from "redux-saga/effects";
import { actions } from "./actions";
import {
  requestExtractDownload,
  requestDownload,
  requestJsonGet
} from "@Services/base";
import { HTTP_STATUS } from "@Constants/common";
import moment from "moment";
import { API_URI } from "@Constants";
import { Ui } from "@Helpers/Ui";
const onDownloadReportRequest = params => {
  return requestExtractDownload({
    url: params.url,
    method: "POST",
    data: params.param
  });
};
const onViewReportRequest = async params => {
  return requestDownload({
    url: params.url,
    method: "POST",
    data: params.param
  });
};

const extraDownloadCommandManagementRequest = async params => {
  return requestJsonGet({
    url: API_URI.EXTRACT_REPORT_COMMAND,
    method: "GET",
    data: params
  });
};

function* downloadReportRequest({ payload }) {
  const { param, reportName, reportNumber } = payload;
  let url = "";
  switch (reportNumber) {
    case 1:
      url = "/report/booking-hang-ngay";
      break;
    case 2:
      url = "/report/cong-no-khach-hang-theo-ngay";
      break;
    case 3:
      url = "/report/cong-no-khach-hang-theo-thang";
      break;
    case 4:
      url = "/report/bao-cao-doanh-thu-theo-sales";
      break;
    case 5:
      url = "/report/bao-cao-hoat-dong-xe-ctv";
      break;
    default:
      break;
  }

  try {
    const searchResult = yield call(onDownloadReportRequest, {
      param: param,
      url: url,
      reportName: reportName
    });
    if (searchResult.status === HTTP_STATUS.OK) {
      searchResult.json().then(res => {
        const url = res.data;
        const link = document.createElement("a");
        link.href = url;
        debugger;
        link.setAttribute(
          "download",
          `${reportName}-${moment().format("DD_MM_YYYY")}.xlsx`
        ); //or any other extension
        document.body.appendChild(link);
        link.click();
      });
      yield put(
        actions.reportDownloadSuccess({
          reportNumber
        })
      );
    } else {
        Ui.showError({ message: 'Xuất báo cáo không thành công.' });
      yield put(actions.reportDownloadError());
    }
  } catch (error) {
    yield put(actions.reportDownloadError());
  }
}

function* viewDownloadRequest({ payload }) {
  const { param, reportName, reportNumber } = payload;
  let url = "";
  switch (reportNumber) {
    case 1:
      url = "/report/booking-hang-ngay";
      break;
    case 2:
      url = "/report/cong-no-khach-hang-theo-ngay";
      break;
    case 3:
      url = "/report/cong-no-khach-hang-theo-thang";
      break;
    case 4:
      url = "/report/bao-cao-doanh-thu-theo-sales";
      break;
    case 5:
      url = "/report/bao-cao-hoat-dong-xe-ctv";
      break;
    default:
      break;
  }
  try {
    const searchResult = yield call(onViewReportRequest, {
      param: param,
      url: url,
      reportName: reportName
    });
    if (searchResult.status === HTTP_STATUS.OK) {
      yield put(actions.reportViewSuccess());
      // } else {
      //     yield put(actions.bookingViewSuccess());
    }
  } catch (error) {
    yield put(actions.reportViewError());
  }
}

function* viewCustomerRequest({ payload }) {
  try {
    // const searchResult = yield call(onViewBookingRequest, param);
    // if (searchResult.data) {
    yield put(actions.customerViewSuccess());
    // } else {
    //     yield put(actions.customerViewSuccess());
    // }
  } catch (error) {
    yield put(actions.customerViewSuccess());
  }
}

function* viewCustomerMonthRequest({ payload }) {
  try {
    // const searchResult = yield call(onViewBookingRequest, param);
    // if (searchResult.data) {
    yield put(actions.customerMonthViewSuccess());
    // } else {
    //     yield put(actions.customerMonthViewSuccess());
    // }
  } catch (error) {
    yield put(actions.customerMonthViewSuccess());
  }
}

function* viewRevenueSaleRequest({ payload }) {
  try {
    // const searchResult = yield call(onViewBookingRequest, param);
    // if (searchResult.data) {
    yield put(actions.revenueViewSuccess());
    // } else {
    //     yield put(actions.revenueViewSuccess());
    // }
  } catch (error) {
    yield put(actions.revenueViewSuccess());
  }
}

function* viewPartnerVehicleRequest({ payload }) {
  try {
    // const searchResult = yield call(onViewBookingRequest, param);
    // if (searchResult.data) {
    yield put(actions.partnerVehicleViewSuccess());
    // } else {
    //     yield put(actions.partnerVehicleViewSuccess());
    // }
  } catch (error) {
    yield put(actions.partnerVehicleViewSuccess());
  }
}

function* extraDownloadCommandManagement({ payload }) {
  try {
    const searchResult = yield call(
      extraDownloadCommandManagementRequest,
      payload
    );
    if (searchResult.status === HTTP_STATUS.OK) {
      const link = document.createElement("a");
      link.href = searchResult.data;
      link.setAttribute("download", `test.xlsx`);
      document.body.appendChild(link);
      link.click();
      Ui.showSuccess({
        message: "Xuất file thành công."
      });
    } else {
      Ui.showError({
        message: "Lỗi, xin vui lòng thử lại."
      });
    }
  } catch (error) {
    Ui.showError({
      message: "Lỗi, xin vui lòng thử lại."
    });
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.EXTRACT_DOWNLOAD, downloadReportRequest)]);
  yield all([takeEvery(actions.EXTRACT_VIEW, viewDownloadRequest)]);
  yield all([takeEvery(actions.CUSTOMER_VIEW, viewCustomerRequest)]);
  yield all([takeEvery(actions.CUSTOMER_MONTH_VIEW, viewCustomerMonthRequest)]);
  yield all([takeEvery(actions.REVENUBY_SALE_VIEW, viewRevenueSaleRequest)]);
  yield all([
    takeEvery(actions.PARTNER_VEHICLE_VIEW, viewPartnerVehicleRequest)
  ]);
  yield all([
    takeEvery(
      actions.EXTRACT_DOWNLOAD_COMMAND_MANAGEMENT,
      extraDownloadCommandManagement
    )
  ]);
}
