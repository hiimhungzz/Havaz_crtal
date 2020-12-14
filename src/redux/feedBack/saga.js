import { all, takeEvery, put, call } from 'redux-saga/effects';
import { actions } from './actions';
import { requestJsonGet, requestJsonPut } from "@Services/base";
import { HTTP_STATUS } from "@Constants/common";
import { Ui } from '@Helpers/Ui';

const onSearchFeedBackRequest = async(param) => {
    return requestJsonGet({
        url: 'feedback',
        method: 'GET',
        data: param
    });
};
const onSaveFeedBackRequest = async(param) => {
    return requestJsonPut({
        url: `feedback/${param.uuid}`,
        method: 'PUT',
        data: param
    });
};

function* searchFeedBackRequest({ payload }) {
    const { searchInput, query, pageSize, externalPageLimit, param } = payload;
    try {
        const searchResult = yield call(onSearchFeedBackRequest, param, 0);
        if (searchResult.status === HTTP_STATUS.OK) {
            yield put(actions.feedBackSearchSuccess(searchResult.data.docs, searchResult.data.total, searchResult.data.pages, searchResult.data.pageSize, '', param));
        } else {
            yield put(actions.feedBackSearchSuccess());
        }
    } catch (error) {
        yield put(actions.feedBackSearchSuccess());
    }
}

function* saveFeedBackRequest({ payload }) {
    const { id } = payload;
    try {
        const searchResult = yield call(onSaveFeedBackRequest, id);
        if (searchResult.status === HTTP_STATUS.OK) {
            let initParam = {};
            if (localStorage.getItem('AppParam')) {
                let appParam = JSON.parse(localStorage.getItem('AppParam'));
                if (appParam['FeedBack']) {
                    initParam = appParam['FeedBack'];
                }
            }
            yield put(actions.feedBackSearch(initParam));
        } else {
            Ui.showError({ message: searchResult.message });
        }
    } catch (error) {
        // yield put(actions.costCustomerSearchSuccess());
    }
}

export default function* rootSaga() {
    yield all([
        takeEvery(actions.FEEDBACK_SEARCH, searchFeedBackRequest),
        takeEvery(actions.UPDATE_FEEDBACK, saveFeedBackRequest),
    ]);
}