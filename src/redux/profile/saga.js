/* eslint-disable no-unused-vars */
import {
    all,
    takeEvery,
    put,
    call,
    delay,
    takeLatest
  } from "redux-saga/effects";
  import { actions } from "./actions";
  import { API_URI } from "@Constants";
  import { requestJsonPut } from "@Services/base";
  import { HTTP_STATUS, APP_MODULE } from "@Constants/common";
  import { appParam, isEmpty } from "@Helpers/utility";
  import { Ui } from "@Helpers/Ui";


  function* editProfileRequest({ payload }) {
    const { params } = payload;

    console.log("paramSaga: ", params)
    try {
      const searchResult = yield call(params => {
        console.log("SagaApi", params)
        return requestJsonPut({
          url: 'auth/change-password',
          method: "PUT",
          data: params
        });
      }, params);
      if (searchResult.status === HTTP_STATUS.OK) {


        Ui.showSuccess({
          message: "Cập nhật mật khẩu thành công."
      });

      //  console.log("searchResult: ", searchResult)
      //  yield put(actions.editProfileSuccess(searchResult.data));
      } else {
      //   Ui.showError({
      //     message: searchResult.data.message
      // });
        console.log("searchResult: ", searchResult)
      }
    } catch (error) {
    }
  }






  //   const onEditProfile = (aaaa) => {
  //     return requestJson({
  //       url: 'customer/change-password',
  //       method: "PUT",
  //       data: {
  //         passwordOld:'aaaa',
  //         password:'abcd'
  //       }
  //     });
  //   }
  // function* editProfileRequest({ payload }) {
  //   const { aaaa } = payload;

  //   console.log("sagaeditprofile: ", aaaa)
  //   try {
  //     const searchResult = yield call(onEditProfile, aaaa);

  //     if (searchResult.status === HTTP_STATUS.OK) {
  //      console.log("searchResult: ", searchResult)
  //      yield put(actions.editProfileSuccess(searchResult.data));
  //     } else {
  //         alert("Có lỗi xảy ra")
  //     }
  //   } catch (error) {
  //   }
  // }



  export default function* rootSaga() {
    yield all([

        takeEvery(actions.EDIT_PROFILE, editProfileRequest),
    ]);
  }