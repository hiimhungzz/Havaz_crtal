import {
    all,
    takeEvery,
    put,
    call,
} from 'redux-saga/effects';
import {actions} from './acions';
import {
    API_URI
} from "@Constants";
import {
    requestJson,
} from "../../services/base";
import {
    HTTP_STATUS,
} from "@Constants/common";
import { Ui } from '@Helpers/Ui';


const getListBookingHistoryRequest = async (param) => {
    return requestJson({
        url: API_URI.GET_BOOKING_HISTORY,
        method: 'POST',
        data: param
    });
};

const getDetailContentRequest = async (param) => {
    return requestJson({
        url: API_URI.GET_DETAIL_CONTENT,
        method: 'POST',
        data: param
    });
};

function* getListBookingHistory({
    payload
}) {
    const {
        data
    } = payload;
    try {
        const searchResult = yield call(getListBookingHistoryRequest, data);
        if (searchResult.status === HTTP_STATUS.OK) {
            yield put(actions.getListBookingHistorySuccess(searchResult));
            yield put(actions.onLoading(false))
        } else {
            Ui.showError({ message: "Lỗi, xin vui lòng thử lại." });
        }
    } catch (error) {
        console.log("error", error);
    }
}

function* getDetailContent({
    payload
}) {
    const {
        data
    } = payload;
    try {
        const searchResult = yield call(getDetailContentRequest, data);
        if (searchResult.status === HTTP_STATUS.OK) {
            const json = {
                bookingOld: searchResult.data.datas.JSON_1,
                bookingCurrent: searchResult.data.datas.JSON_2,
            }
            yield put(actions.getDetailContentSuccess(json))
            yield put(actions.onLoading(false))
        } else {
            Ui.showError({ message: "Lỗi, xin vui lòng thử lại." });
        }
    } catch (error) {
        console.log("error", error);
    }
}

export default function* rootSaga() {
    yield all([
        takeEvery(actions.GETLIST_BOOKING_HISTORY, getListBookingHistory),
        takeEvery(actions.GET_DETAIL_CONTENT, getDetailContent),
    ]);
}