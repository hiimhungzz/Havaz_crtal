import {
    all,
    takeEvery,
    put,
    call,
    select,
} from 'redux-saga/effects';
import { actions } from './actions';
import {
    API_URI
} from "@Constants";
import {
    requestJsonGet,
    requestJsonPut,
} from "@Services/base";
import {
    HTTP_STATUS,
} from "@Constants/common";
// selectors
import * as reportIncidentSelectors from './selectors';
import { Ui } from '@Helpers/Ui';

const query1 = new URLSearchParams(window.location.search);

const getListReportIncidentRequest = async(pages, pageSize) => {
    return requestJsonGet({
        url: `${API_URI.GET_LIST_REPORT_INCIDENT}?pages=${pages}&pageSize=${pageSize}`,
        method: 'GET',
    });
};

const getDetailReportIncidentRequest = async(params) => {
    return requestJsonGet({
        url: `${API_URI.GET_DETAIL_REPORT_INCIDENT}/${params}`,
        method: 'GET',
    });
};


const updateStatusReportIncidentRequest = async(uuid) => {
    return requestJsonPut({
        url: `${API_URI.GET_LIST_REPORT_INCIDENT}/${uuid}`,
        method: 'PUT',
    });
};


function* getListReportIncident({
    payload
}) {
    const {
        pages,
        pageSize
    } = payload;
    console.log("payload", payload)
    try {
        const searchResult = yield call(getListReportIncidentRequest, pages, pageSize);
        if (searchResult.status === HTTP_STATUS.OK) {
            yield put(actions.onLoading(false))
            yield put(actions.getListReportIncidentSucess(searchResult.data));
        } else {
            Ui.showError({ message: 'Lỗi, xin vui lòng thử lại' });
        }
    } catch (error) {
        console.log("error", error);
    }
}

function* updateStatusReportIncident({
    payload
}) {
    try {
        const searchResult = yield call(updateStatusReportIncidentRequest, payload);
        if (searchResult.status === HTTP_STATUS.OK) {
            const pageSize = yield select(reportIncidentSelectors.pageSize);
            const pages = yield select(reportIncidentSelectors.pages);
            const data = {
                pageSize: pageSize,
                pages: pages,
            }
            if(query1.get("uuid")) {
                yield put(actions.getDetailReportIncident(query1.get("uuid")))
            } else {
                yield put(actions.getListReportIncident(data));
            }
        } else {
            Ui.showError({ message: 'Lỗi, xin vui lòng thử lại' });
        }
    } catch (error) {
        console.log("error", error);
    }
}

function* getDetailReportIncident({
    payload
}) {
    try {
        const searchResult = yield call(getDetailReportIncidentRequest, payload);
        if (searchResult.status === HTTP_STATUS.OK) {
            yield put(actions.getDetailReportIncidentSuccess(searchResult.data));
        } else {
            Ui.showError({ message: 'Lỗi, xin vui lòng thử lại' });
        }
    } catch (error) {
        console.log("error", error);
    }
}


export default function* rootSaga() {
    yield all([
        takeEvery(actions.GET_LIST_REPORT_INCIDENT, getListReportIncident),
        takeEvery(actions.UPDATE_STATUS_REPORT_INCIDENT, updateStatusReportIncident),
        takeEvery(actions.GET_DETAIL_REPORT_INCIDENT, getDetailReportIncident),
    ]);
}