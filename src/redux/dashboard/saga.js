import {
    all,
    takeEvery,
    put,
    call,
} from 'redux-saga/effects';
import { actions } from './acions';
import {
    API_URI
} from "@Constants";
import {
    requestJsonGet,
    requestJson,
} from "@Services/base";
import {
    HTTP_STATUS,
} from "@Constants/common";
import { Ui } from '@Helpers/Ui';

const onFilterChartRequest = async(param) => {
    return requestJson({
        url: API_URI.FILTER_CHART,
        method: 'POST',
        data: param
    });
};

const onFilterChartDriverRequest = async(param) => {
    return requestJson({
        url: API_URI.FILTER_CHART_DRIVER,
        method: 'POST',
        data: param
    });
};

const getReportForMonthRequest = async(param) => {
    return requestJsonGet({
        url: `${API_URI.GET_REPORT_FOR_DAY}?type=date&startDate=${param.startDate}&endDate=${param.endDate}`,
        method: 'GET',
    });
};

const getReportForYearRequest = async(param) => {
    return requestJsonGet({
        url: `${API_URI.GET_REPORT_FOR_MONTH}?type=year&year=${param.year}`,
        method: 'GET',
    });
};

function* filterChartRequest({
    payload
}) {
    const {
        data
    } = payload;
    try {
        const searchResult = yield call(onFilterChartRequest, data);
        if (searchResult.status === HTTP_STATUS.OK) {
            yield put(actions.filterChartSuccess(searchResult.data));
        } else {
            yield put(actions.filterChartSuccess(searchResult.data));
        }
    } catch (error) {
        console.log("error", error);
    }
}

function* filterChartDriverRequest({
    payload
}) {
    const {
        data
    } = payload;
    try {
        const searchResult = yield call(onFilterChartDriverRequest, data);
        if (searchResult.status === HTTP_STATUS.OK) {
            yield put(actions.filterChartDriverSuccess(searchResult.data));
        } else {
            yield put(actions.filterChartDriverSuccess(searchResult.data));
        }
    } catch (error) {
        console.log("error", error);
    }
}

function* getReportForMonth({
    payload
}) {
    const {
        data
    } = payload;
    try {
        const searchResult = yield call(getReportForMonthRequest, data);
        if (searchResult.status === HTTP_STATUS.OK) {
            let labels = [];
            let totalCostList = [];
            searchResult.data.map((item) => {
                labels.push(item.dateOut)
                totalCostList.push(item.totalCost)
            })

            const data = {
                labels: labels,
                datasets: [{
                    label: 'Tổng doanh thu theo ngày',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(255,51,51,0.4)',
                    borderColor: 'rgba(255,51,51,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(255,51,51,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 5,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(255,51,51,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: totalCostList,
                }]
            };
            yield put(actions.getReportForMonthSuccess(data));
        } else {
            Ui.showError({ message: 'Có lỗi, xin vui lòng thử lại.' });
        }
    } catch (error) {
        Ui.showError({ message: 'Có lỗi, xin vui lòng thử lại.' });
    }
}

function* getReportForYear({
    payload
}) {
    const {
        data
    } = payload;
    try {
        const searchResult = yield call(getReportForYearRequest, data);
        if (searchResult.status === HTTP_STATUS.OK) {
            let labels = [];
            let totalCostList = [];
            searchResult.data.map((item) => {
                labels.push(item.dateOut)
                totalCostList.push(item.totalCost)
            })

            const data = {
                labels: labels,
                datasets: [{
                    label: 'Tổng doanh thu theo tháng',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 5,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: totalCostList
                }]
            };
            yield put(actions.getReportForYearSuccess(data));
        } else {
            Ui.showError({ message: 'Có lỗi, xin vui lòng thử lại.' });
        }
    } catch (error) {
        Ui.showError({ message: 'Có lỗi, xin vui lòng thử lại.' });
    }
}

export default function* rootSaga() {
    yield all([
        takeEvery(actions.FILTER_CHART, filterChartRequest),
        takeEvery(actions.FILTER_CHART_DRIVER, filterChartDriverRequest),
        takeEvery(actions.GET_REPORT_FOR_MONTH, getReportForMonth),
        takeEvery(actions.GET_REPORT_FOR_YEAR, getReportForYear),
    ]);
}