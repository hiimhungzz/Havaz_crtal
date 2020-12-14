import { all, put, call, takeLatest } from "redux-saga/effects";
import { browseGlobalConfig } from "./actions";
import { API_URI } from "@Constants";
import { requestJsonGet } from "@Services/base";
import { HTTP_STATUS } from "@Constants/common";

function* browseGlobalConfigRequest() {
  try {
    let searchResult = yield call(async () => {
      return requestJsonGet({
        url: API_URI.GET_GLOBAL_CONFIG,
        method: "GET"
      });
    });
    if (searchResult.status === HTTP_STATUS.OK) {
      yield put(browseGlobalConfig.success(searchResult.data));
    } else {
      yield put(browseGlobalConfig.failure(searchResult.toString()));
    }
  } catch (error) {
    yield put(browseGlobalConfig.failure(error));
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(browseGlobalConfig.TRIGGER, browseGlobalConfigRequest)
  ]);
}
