import {
    all,
    takeEvery,
    put,
    call,
    select
} from 'redux-saga/effects';
import {
    actions
} from './actions';
import {
    requestDownload,
    requestJsonGet
} from "@Services/base";
import {
    HTTP_STATUS,
    DATE_TIME_FORMAT
} from "@Constants/common";
import moment from "moment";
import { Ui } from '@Helpers/Ui';

const onDownloadReportRequest = (params) => {
    return requestDownload({
        url: params.url,
        method: 'GET',
        data: params.param
    });
};
const onViewReportRequest = async (params) => {
    return requestJsonGet({
        url: params.url,
        method: 'GET',
        data: params.param
    });
};

function* downloadReportRequest({
    payload
}) {
    const {
        param,
        reportName,
        reportNumber
    } = payload;
    let url = '';
    let query = null;
    switch (reportNumber) {
        case 1:
            url = `/report/financial/booking/trips`;
            query = {
                pages: param.pages,
                pageSize: param.pageSize,
                dateType: param.dateType || 'all',
                result: param.result,
                startDate: !moment.isMoment(param.startDate) ? (param.startDate ? moment(param.startDate).clone().format(DATE_TIME_FORMAT.YYYY_MM_DD) : '') : param.startDate.format(DATE_TIME_FORMAT.YYYY_MM_DD),
                endDate: !moment.isMoment(param.endDate) ? (param.endDate ? moment(param.endDate).clone().format(DATE_TIME_FORMAT.YYYY_MM_DD) : '') : param.endDate.format(DATE_TIME_FORMAT.YYYY_MM_DD),
                customerCode: param.customerCodes ? param.customerCodes.key : '',
                bookingsCode: param.bookingsCodes ? param.bookingsCodes.key : '',
                salesCode: param.salesCodes ? param.salesCodes.key : '',
            };
            break;
        case 2:
            query = {
                pages: param.pages,
                pageSize: param.pageSize,
                dateType: param.dateType || 'all',
                result: param.result,
                startDate: !moment.isMoment(param.startDate) ? (param.startDate ? moment(param.startDate).clone().format(DATE_TIME_FORMAT.YYYY_MM_DD) : '') : param.startDate.format(DATE_TIME_FORMAT.YYYY_MM_DD),
                endDate: !moment.isMoment(param.endDate) ? (param.endDate ? moment(param.endDate).clone().format(DATE_TIME_FORMAT.YYYY_MM_DD) : '') : param.endDate.format(DATE_TIME_FORMAT.YYYY_MM_DD),
                customerCode: param.customerCodes ? param.customerCodes.key : '',
                bookingsCode: param.bookingsCodes ? param.bookingsCodes.label : '',
                salesCode: param.salesCodes ? param.salesCodes.key : '',
                driverName: param.driverNames ? param.driverNames.label : '',
                queryVehiclesPlate: param.licensePlates ? param.licensePlates.label : '',
            };
            url = '/report/financial/customer/everyday';
            break;
        case 3:
            query = {
                pages: param.pages,
                pageSize: param.pageSize,
                dateType: param.dateType || 0,
                result: param.result,
                startDate: !moment.isMoment(param.startDate) ? (param.startDate ? moment(param.startDate).clone().format(DATE_TIME_FORMAT.YYYY_MM_DD) : '') : param.startDate.format(DATE_TIME_FORMAT.YYYY_MM_DD),
                endDate: !moment.isMoment(param.endDate) ? (param.endDate ? moment(param.endDate).clone().format(DATE_TIME_FORMAT.YYYY_MM_DD) : '') : param.endDate.format(DATE_TIME_FORMAT.YYYY_MM_DD),
                customerCode: param.customerCodes ? param.customerCodes.key : '',
                bookingsCode: param.bookingsCodes ? param.bookingsCodes.label : '',
                salesCode: param.salesCodes ? param.salesCodes.key : '',
                licensePlate: param.licensePlates ? param.licensePlates.label : '',
            };
            url = '/report/financial/customer/everymonth';
            break;
        case 4:
            query = {
                pages: param.pages,
                pageSize: param.pageSize,
                dateType: param.dateType || 0,
                result: param.result,
                startDate: !moment.isMoment(param.startDate) ? (param.startDate ? moment(param.startDate).clone().format(DATE_TIME_FORMAT.YYYY_MM_DD) : '') : param.startDate.format(DATE_TIME_FORMAT.YYYY_MM_DD),
                endDate: !moment.isMoment(param.endDate) ? (param.endDate ? moment(param.endDate).clone().format(DATE_TIME_FORMAT.YYYY_MM_DD) : '') : param.endDate.format(DATE_TIME_FORMAT.YYYY_MM_DD),
                customerCode: param.customerCodes ? param.customerCodes.key : '',
                bookingsCode: param.bookingsCodes ? param.bookingsCodes.label : '',
                salesCode: param.salesCodes ? param.salesCodes.key : '',
                licensePlate: param.licensePlates ? param.licensePlates.label : '',
            };
            url = '/report/revenue/sales';
            break;
        case 5:
            query = {
                pages: param.pages,
                pageSize: param.pageSize,
                dateType: param.dateType || 0,
                result: param.result,
                startDate: !moment.isMoment(param.startDate) ? (param.startDate ? moment(param.startDate).clone().format(DATE_TIME_FORMAT.YYYY_MM_DD) : '') : param.startDate.format(DATE_TIME_FORMAT.YYYY_MM_DD),
                endDate: !moment.isMoment(param.endDate) ? (param.endDate ? moment(param.endDate).clone().format(DATE_TIME_FORMAT.YYYY_MM_DD) : '') : param.endDate.format(DATE_TIME_FORMAT.YYYY_MM_DD),
                customerCode: param.customerCodes ? param.customerCodes.key : '',
                bookingsCode: param.bookingsCodes ? param.bookingsCodes.label : '',
                salesCode: param.salesCodes ? param.salesCodes.key : '',
                organCode: param.organCodes ? param.organCodes.key : '',
            };
            url = '/report/revenue/supplier';
            break;
        case 6:
            query = {
                pages: param.pages,
                pageSize: param.pageSize,
                dateType: param.dateType || 0,
                result: param.result,
                startDate: !moment.isMoment(param.startDate) ? (param.startDate ? moment(param.startDate).clone().format(DATE_TIME_FORMAT.YYYY_MM_DD) : '') : param.startDate.format(DATE_TIME_FORMAT.YYYY_MM_DD),
                endDate: !moment.isMoment(param.endDate) ? (param.endDate ? moment(param.endDate).clone().format(DATE_TIME_FORMAT.YYYY_MM_DD) : '') : param.endDate.format(DATE_TIME_FORMAT.YYYY_MM_DD),
                customerCode: param.customerCodes ? param.customerCodes.key : '',
                bookingsCode: param.bookingsCodes ? param.bookingsCodes.label : '',
                salesCode: param.salesCodes ? param.salesCodes.key : '',
                licensePlate: param.licensePlates ? param.licensePlates.label : '',
            };
            url = '/report/debt/vehicle';
            break;
        default:
            break;
    }
    try {
        const searchResult = yield call(onDownloadReportRequest, {
            param: query,
            url: url,
            reportName: reportName
        });
        if (searchResult.status === HTTP_STATUS.OK) {
            console.log(searchResult);
            const url = searchResult.data;
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${reportName}-${moment().format("DD_MM_YYYY")}.xlsx`); //or any other extension
            document.body.appendChild(link);
            link.click();
            yield put(actions.reportDownloadSuccess({
                reportNumber
            }));
        } else {
            Ui.showError({ message: 'Xuất báo cáo không thành công.' });
            yield put(actions.reportDownloadError({
                reportNumber
            }));
        }
    } catch (error) {
        yield put(actions.reportDownloadError({
            reportNumber
        }));
    }
}

function* viewDownloadRequest({
    payload
}) {
    const {
        param,
        reportName,
        reportNumber
    } = payload;
    let url = '';
    let moduleName = '';
    let query = {};
    switch (reportNumber) {
        case 1:
            query = {
                pages: param.pages,
                pageSize: param.pageSize,
                dateType: param.dateType || 'all',
                resultType: param.resultType,
                startDate: !moment.isMoment(param.startDate) ? (param.startDate ? moment(param.startDate).clone().format(DATE_TIME_FORMAT.YYYY_MM_DD) : '') : param.startDate.format(DATE_TIME_FORMAT.YYYY_MM_DD),
                endDate: !moment.isMoment(param.endDate) ? (param.endDate ? moment(param.endDate).clone().format(DATE_TIME_FORMAT.YYYY_MM_DD) : '') : param.endDate.format(DATE_TIME_FORMAT.YYYY_MM_DD),
                customerCode: param.customerCodes ? param.customerCodes.key : '',
                bookingsCode: param.bookingsCodes ? param.bookingsCodes.label : '',
                salesCode: param.salesCodes ? param.salesCodes.key : '',
            };
            url = `/report/financial/booking/trips`;
            moduleName = 'bookingStatistics';
            break;
        case 2:
            query = {
                pages: param.pages,
                pageSize: param.pageSize,
                dateType: param.dateType || 'all',
                resultType: param.resultType,
                startDate: !moment.isMoment(param.startDate) ? (param.startDate ? moment(param.startDate).clone().format(DATE_TIME_FORMAT.YYYY_MM_DD) : '') : param.startDate.format(DATE_TIME_FORMAT.YYYY_MM_DD),
                endDate: !moment.isMoment(param.endDate) ? (param.endDate ? moment(param.endDate).clone().format(DATE_TIME_FORMAT.YYYY_MM_DD) : '') : param.endDate.format(DATE_TIME_FORMAT.YYYY_MM_DD),
                customerCode: param.customerCodes ? param.customerCodes.key : '',
                bookingsCode: param.bookingsCodes ? param.bookingsCodes.label : '',
                salesCode: param.salesCodes ? param.salesCodes.key : '',
                driverName: param.driverNames ? param.driverNames.label : '',
                licensePlate: param.licensePlates ? param.licensePlates.label : '',
            };
            url = '/report/financial/customer/everyday';
            moduleName = 'customerDebtByDayStatistics';
            break;
        case 3:
            query = {
                pages: param.pages,
                pageSize: param.pageSize,
                dateType: param.dateType || 0,
                resultType: param.resultType,
                startDate: !moment.isMoment(param.startDate) ? (param.startDate ? moment(param.startDate).clone().format(DATE_TIME_FORMAT.YYYY_MM_DD) : '') : param.startDate.format(DATE_TIME_FORMAT.YYYY_MM_DD),
                endDate: !moment.isMoment(param.endDate) ? (param.endDate ? moment(param.endDate).clone().format(DATE_TIME_FORMAT.YYYY_MM_DD) : '') : param.endDate.format(DATE_TIME_FORMAT.YYYY_MM_DD),
                customerCode: param.customerCodes ? param.customerCodes.key : '',
                bookingsCode: param.bookingsCodes ? param.bookingsCodes.label : '',
                salesCode: param.salesCodes ? param.salesCodes.key : '',
                licensePlate: param.licensePlates ? param.licensePlates.label : '',
            };
            url = '/report/financial/customer/everymonth';
            moduleName = 'customerDebtByMonthStatistics';
            break;
        case 4:
            query = {
                pages: param.pages,
                pageSize: param.pageSize,
                dateType: param.dateType || 0,
                resultType: param.resultType,
                startDate: !moment.isMoment(param.startDate) ? (param.startDate ? moment(param.startDate).clone().format(DATE_TIME_FORMAT.YYYY_MM_DD) : '') : param.startDate.format(DATE_TIME_FORMAT.YYYY_MM_DD),
                endDate: !moment.isMoment(param.endDate) ? (param.endDate ? moment(param.endDate).clone().format(DATE_TIME_FORMAT.YYYY_MM_DD) : '') : param.endDate.format(DATE_TIME_FORMAT.YYYY_MM_DD),
                customerCode: param.customerCodes ? param.customerCodes.key : '',
                bookingsCode: param.bookingsCodes ? param.bookingsCodes.label : '',
                salesCode: param.salesCodes ? param.salesCodes.key : '',
                licensePlate: param.licensePlates ? param.licensePlates.label : '',
            };
            url = '/report/revenue/sales';
            break;
        case 5:
            query = {
                pages: param.pages,
                pageSize: param.pageSize,
                dateType: param.dateType || 0,
                result: param.resultType,
                startDate: !moment.isMoment(param.startDate) ? (param.startDate ? moment(param.startDate).clone().format(DATE_TIME_FORMAT.YYYY_MM_DD) : '') : param.startDate.format(DATE_TIME_FORMAT.YYYY_MM_DD),
                endDate: !moment.isMoment(param.endDate) ? (param.endDate ? moment(param.endDate).clone().format(DATE_TIME_FORMAT.YYYY_MM_DD) : '') : param.endDate.format(DATE_TIME_FORMAT.YYYY_MM_DD),
                customerCode: param.customerCodes ? param.customerCodes.key : '',
                bookingsCode: param.bookingsCodes ? param.bookingsCodes.label : '',
                salesCode: param.salesCodes ? param.salesCodes.key : '',
                organCode: param.organCodes ? param.organCodes.key : '',
            };
            url = '/report/revenue/supplier';
            break;
        case 6:
            query = {
                pages: param.pages,
                pageSize: param.pageSize,
                dateType: param.dateType || 0,
                result: param.resultType,
                startDate: !moment.isMoment(param.startDate) ? (param.startDate ? moment(param.startDate).clone().format(DATE_TIME_FORMAT.YYYY_MM_DD) : '') : param.startDate.format(DATE_TIME_FORMAT.YYYY_MM_DD),
                endDate: !moment.isMoment(param.endDate) ? (param.endDate ? moment(param.endDate).clone().format(DATE_TIME_FORMAT.YYYY_MM_DD) : '') : param.endDate.format(DATE_TIME_FORMAT.YYYY_MM_DD),
                customerCode: param.customerCodes ? param.customerCodes.key : '',
                bookingsCode: param.bookingsCodes ? param.bookingsCodes.label : '',
                salesCode: param.salesCodes ? param.salesCodes.key : '',
                licensePlate: param.licensePlates ? param.licensePlates.label : '',
            };
            url = '/report/debt/vehicle';
            break;
        default:
            break;
    }
    try {
        const searchResult = yield call(onViewReportRequest, {
            param: query,
            url: url,
            reportName: reportName
        });
        if (searchResult.status === HTTP_STATUS.OK) {
            let appState = yield select(state => state.App);
            yield put(actions.reportViewSuccess({
                rows: searchResult.data.rows,
                totalLength: searchResult.data.count,
                pageSize: searchResult.data.pageSize,
                pages: searchResult.data.pages,
                moduleName,
                reportNumber,
                param,
                bookingStatus: appState.appConfig['bookingStatus']
            }));
            // } else {
            //     yield put(actions.bookingViewSuccess());
        }
    } catch (error) {
        yield put(actions.reportViewError());
    }
}

function* viewCustomerRequest({
    payload
}) {
    const {
        param
    } = payload;
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

function* viewCustomerMonthRequest({
    payload
}) {
    const {
        param
    } = payload;
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

function* viewRevenueSaleRequest({
    payload
}) {
    const {
        param
    } = payload;
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

function* viewPartnerVehicleRequest({
    payload
}) {
    const {
        param
    } = payload;
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

export default function* rootSaga() {
    yield all([takeEvery(actions.REPORT_DOWNLOAD, downloadReportRequest)]);
    yield all([takeEvery(actions.REPORT_VIEW, viewDownloadRequest)]);
    yield all([takeEvery(actions.CUSTOMER_VIEW, viewCustomerRequest)]);
    yield all([takeEvery(actions.CUSTOMER_MONTH_VIEW, viewCustomerMonthRequest)]);
    yield all([takeEvery(actions.REVENUBY_SALE_VIEW, viewRevenueSaleRequest)]);
    yield all([takeEvery(actions.PARTNER_VEHICLE_VIEW, viewPartnerVehicleRequest)]);
}