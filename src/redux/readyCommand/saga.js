import {
    all,
    takeEvery,
    put,
    call,
    select
} from 'redux-saga/effects';
import _ from 'lodash';
import {
    actions
} from './actions';
import {
    API_URI
} from "@Constants";
import {
    requestJson
} from "../../services/base";
import {
    HTTP_STATUS
} from "@Constants/common";

const onBrowseReadyCommandRequest = async (param) => {
    return requestJson({
        url: API_URI.BROWSE_READY_COMMAND,
        method: 'POST',
        data: param
    });
};

function* browseReadyCommandRequest({
    payload
}) {
    const {
        param
    } = payload;
    try {
        let searchResult = yield call(onBrowseReadyCommandRequest, param);
        if (searchResult.status === HTTP_STATUS.OK) {
            let temp = {
                ...param,
                totalLength: searchResult.data.totalLength
            };
            let appState = yield select(state => state.App);
            yield put(actions.browseReadyCommandSuccess(searchResult.data.data, temp, appState.appConfig['readyCommandStatus'] || []));
        } else {
            yield put(actions.browseReadyCommandError());
        }
    } catch (error) {
        yield put(actions.browseReadyCommandError());
    }
}

export default function* rootSaga() {
    yield all([
        takeEvery(actions.BROWSE_READY_COMMAND, browseReadyCommandRequest)
    ]);
}