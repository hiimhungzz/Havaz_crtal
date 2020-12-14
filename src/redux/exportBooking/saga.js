import { all, takeEvery, put, call } from 'redux-saga/effects';
import { actions } from './actions';
import { API_URI } from "@Constants";
import { requestJsonPost } from "@Services/base";
import { HTTP_STATUS } from "@Constants/common";

const onSearchExportRequest = async(param) => {
    return requestJsonPost({
        url: API_URI.EXPORTS_BOOKING,
        method: 'POST',
        param: param
    });
};

function* searchExportRequest() {
    // const { param, tabId } = payload;
    try {
        const searchResult = yield call(onSearchExportRequest, '');
        if (searchResult.status === HTTP_STATUS.OK) {
            const url = searchResult.data.data;
            console.log('url', url)
            const link = document.createElement('a');
            link.href = 'https://crapi.havazdev.net' + url;
            link.setAttribute('download', `${url}`); //or any other extension
            document.body.appendChild(link);
            link.click();
            yield put(actions.exportSearchSuccess(searchResult.data.docs));
        } else {
            yield put(actions.exportSearchSuccess());
        }
    } catch (error) {
        yield put(actions.exportSearchSuccess());
    }
}


export default function* rootSaga() {
    yield all([takeEvery(actions.EXPORT_SEARCH, searchExportRequest)]);

}