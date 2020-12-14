import { all } from "redux-saga/effects";
import appSagas from "./app/saga";
import customerSagas from "./customer/saga";
import partnerSagas from "./partner/saga";
import vehicleSagas from "./vehicle/saga";
import driverSagas from "./driver/saga";
import reportSagas from "./report/saga";
import categorySagas from "./category/saga";
import feedBackSagas from "./feedBack/saga";
import dashboardSagas from "./dashboard/saga";
import notifiCompanySagas from "./notificompany/saga";
import extractSagas from "./extract/saga";
import bookingHistorySagas from "./bookingHistory/saga";
import taskscheduleSagas from "./taskSchedule/saga";
import readyCommandSagas from "./readyCommand/saga";
import reportIncidentSagas from "./reportIncident/saga";
import exportBookings from "./exportBooking/saga";
import warning from "./warning/saga";
import profile from "./profile/saga";
import CategoryUser from "./categoryUser/saga";
import define from "./define/saga";
import enterprise from "./enterprise/saga";

export default function* rootSaga(getState) {
  yield all([
    appSagas(),
    profile(),
    customerSagas(),
    partnerSagas(),
    vehicleSagas(),
    driverSagas(),
    reportSagas(),
    categorySagas(),
    feedBackSagas(),
    dashboardSagas(),
    notifiCompanySagas(),
    extractSagas(),
    bookingHistorySagas(),
    taskscheduleSagas(),
    readyCommandSagas(),
    reportIncidentSagas(),
    exportBookings(),
    warning(),
    CategoryUser(),
    define(),
    enterprise(),
  ]);
}
