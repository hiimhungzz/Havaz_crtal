import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import { Redirect, Switch } from "react-router";
import AuthorizedLayout from "../components/Layout/AuthorizedLayout";
import GuestLayout from "../components/Layout/GuestLayout";

import DemoAccount from "../containers/DemoAccount/Loadable";
import Partner from "../containers/Partner/Loadable";

import Holiday from "../containers/Holiday/Loadable";

import Customer from "../containers/Customer/Loadable";
import Vehicle from "../containers/Vehicle/Loadable";
import Driver from "../containers/Driver/Loadable";
import TaskSchedule from "../containers/TaskSchedule/Loadable";
import BookingHistory from "../containers/BookingHistory/Loadable";
import Category from "../containers/Category/Loadable";
import Dashboard from "../containers/Dashboard/Loadable";
import ReadyCommand from "../containers/ReadyCommand/Loadable";
import Feedback from "../containers/Feedback/Loadable";
import Incident from "../containers/ReportIncident/Loadable";
import NotifyCompany from "../containers/Notificompany/Loadable";
import DemoConfiguration from "../containers/DemoConfiguration/Loadable";
import DemoUtilities from "../containers/DemoUtilities/Loadable";
import DemoScheduler from "./../containers/DemoScheduler/Loadable";
import Warning from "./../containers/Warning/Loadable";
import DemoBooking from "./../containers/DemoBooking/Loadable";
import DemoRoute from "./../containers/DemoRoute/Loadable";
import DemoHighway from "./../containers/DemoHighway/Loadable";
import DemoTour from "./../containers/DemoTour/Loadable";
import DemoCommand from "./../containers/DemoCommand/Loadable";
import DemoCorporate from "./../containers/DemoCorporate/Loadable";
import DemoContract from "./../containers/DemoContract/Loadable";
import DemoCorporateTracking from "./../containers/DemoCorporateTracking/Loadable";
import DemoReconciliation from "./../containers/DemoReconciliation/Loadable";
import CategoryUser from "./../containers/CategoryUser/Loadable";
import CategoryServal from "./../containers/CategoryServal/Loadable";
import Define from "./../containers/Define/Loadable";
import CategoryPay from "./../containers/CategoryPay/Loadable";
import DataForAccount from "./../containers/DataForAccount/Loadable";
import Profile from "./../containers/Profile/Loadable";
import Quanlity from "./../containers/Quanlity/Loadable";
import QuanlityTotal from "./../containers/QuanlityTotal/Loadable";
import QuanlityResult from "./../containers/QuanlityResult/Loadable";
import Test from "./../containers/Test/Loadable";
import NotFound from "./../containers/NotFound/Loadable";

import ExtractBookingStatistics from "./../containers/Extract/BookingStatistics/Loadable";
import ExtractCustomerDebtByDayStatistics from "./../containers/Extract/CustomerDebtByDayStatistics/Loadable";
import ExtractCustomerDebtByMonthStatistics from "./../containers/Extract/CustomerDebtByMonthStatistics/Loadable";
import ExtractRevenueBySaleStatistics from "./../containers/Extract/RevenueBySaleStatistics/Loadable";
import ExtractPartnerVehicleActivityStatistics from "./../containers/Extract/PartnerVehicleActivityStatistics/Loadable";
import ExtractReportCommandManagement from "./../containers/Extract/ReportCommandManagement/Loadable";

// import ReportBookingStatistics from "./../containers/Report/BookingStatistics/Loadable";
// import ReportCustomerDebtByDayStatistics from "./../containers/Report/CustomerDebtByDayStatistics/Loadable";
// import ReportCustomerDebtByMonthStatistics from "./../containers/Report/CustomerDebtByMonthStatistics/Loadable";
// import ReportPartnerDebtByMonthStatistics from "./../containers/Report/PartnerDebtByMonthStatistics/Loadable";
// import ReportRevenueBySaleStatistics from "./../containers/Report/RevenueBySaleStatistics/Loadable";
// import ReportRevenueByVehicleStatistics from "./../containers/Report/RevenueByVehicleStatistics/Loadable";

import Enterprise from "./../containers/Enterprise";
// Report New
import ReportBookingStatistics from "./../containers/DemoReport/BookingStatistics/Loadable";
import ReportRevenueByVehicleStatistics from "./../containers/DemoReport/RevenueByVehicleStatistics/Loadable";
import ReportRevenueBySaleStatistics from "./../containers/DemoReport/RevenueBySaleStatistics/Loadable";
import ReportCustomerDebtByDayStatistics from "./../containers/DemoReport/CustomerDebtByDayStatistics/Loadable";
import ReportCustomerDebtByMonthStatistics from "./../containers/DemoReport/CustomerDebtByMonthStatistics/Loadable";
import ReportPartnerDebtByMonthStatistics from "./../containers/DemoReport/PartnerDebtByMonthStatistics/Loadable";
import MenuConfig from './../containers/MenuConfig/Loadable';

// import ReportBookingStatistics from "./../containers/DemoReport/DebtByCTVStatistics/Loadable";

import DemoLoginPage from "../containers/DemoLoginPage";
import Helmet from "react-helmet";
import Globals from "globals.js";
import { isEmpty } from "@Helpers/utility";
import { $LocalStorage } from "@Helpers/localStorage";
import { APP_PARAM } from "@Constants";
import { createStructuredSelector } from "reselect";
import { makeSelectAppConfig, makeSelectProfile } from "redux/app/selectors";
import { connect } from "react-redux";

const AppRoute = ({
  component: Component,
  layout: Layout,
  isLoggedIn,
  path: Path,
  appConfig,
  profile,
  ...rest
}) => {
  let isLoginPath = Path === "/signin";
  if (!Globals.isAuthenticated && !isLoginPath) {
    return (
      <Redirect
        to={{
          pathname: "/signin",
          state: { from: rest.location },
        }}
      />
    );
  }
  if (Globals.isAuthenticated && isLoginPath) {
    return <Redirect to="/" />;
  }
  return (
    <Route
      {...rest}
      render={(props) => {
        let appParam = isEmpty($LocalStorage.sls.getObject(APP_PARAM), {});
        return (
          <Layout {...props}>
            <Helmet titleTemplate="%s - CAR RENTAL" defaultTitle="CAR RENTAL">
              <meta name="description" content="CAR RENTAL" />
            </Helmet>
            <Component
              appParam={appParam}
              appConfig={appConfig}
              profile={profile}
            />
          </Layout>
        );
      }}
    />
  );
};

const AppRouter = ({ history, appConfig, profile }) => {
  return (
    <BrowserRouter>
      <Switch>
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/profile"
          component={Profile}
        />
        <AppRoute
          layout={GuestLayout}
          exact={true}
          history={history}
          path="/signin"
          component={DemoLoginPage}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          appConfig={appConfig}
          profile={profile}
          path="/accountManagement"
          component={DemoAccount}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/quanlityManagement"
          component={Quanlity}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/quanlityTotalManagement"
          component={QuanlityTotal}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/quanlityResultlManagement"
          component={QuanlityResult}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/notFound"
          component={NotFound}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          HEAD
          path="/menuConfig"
          component={MenuConfig}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/partnerManagement"
          component={Partner}
        />

        {/*  */}
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/holiday"
          component={Holiday}
        />

        {/*  */}
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/customersManagement"
          component={Customer}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/testManagement"
          component={Test}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/vehicleManagement"
          component={Vehicle}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/dataForAccount"
          component={DataForAccount}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/driverManagement"
          component={Driver}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/taskScheduleManagement"
          component={TaskSchedule}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/bookingHistory"
          component={BookingHistory}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/categoryManagement"
          component={Category}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/CategoryServalManagement"
          component={CategoryServal}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          appConfig={appConfig}
          profile={profile}
          path="/commandManagement"
          component={DemoCommand}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/feedbackManagement"
          component={Feedback}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          appConfig={appConfig}
          profile={profile}
          path="/highwayManagement"
          component={DemoHighway}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/availableResourcesManagement/readyCommand"
          component={ReadyCommand}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/availableResourcesManagement/incidentReport"
          component={Incident}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          appConfig={appConfig}
          profile={profile}
          path="/tourManagement"
          component={DemoTour}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/configurationManagement"
          component={DemoConfiguration}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/defineManagement/utilities"
          component={DemoUtilities}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/notifiCompany"
          component={NotifyCompany}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          appConfig={appConfig}
          profile={profile}
          path="/routeManagement"
          component={DemoRoute}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          appConfig={appConfig}
          profile={profile}
          path="/scheduler"
          component={DemoScheduler}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/warningManagement"
          component={Warning}
        />

        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/extract/booking"
          component={ExtractBookingStatistics}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/extract/customerDebtByDay"
          component={ExtractCustomerDebtByDayStatistics}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/extract/customerDebtByMonth"
          component={ExtractCustomerDebtByMonthStatistics}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/extract/commandManagement"
          component={ExtractReportCommandManagement}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/extract/revenueBySale"
          component={ExtractRevenueBySaleStatistics}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/extract/partnerVehicleActivity"
          component={ExtractPartnerVehicleActivityStatistics}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/report/booking"
          component={ReportBookingStatistics}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/report/customerDebtByDay"
          component={ReportCustomerDebtByDayStatistics}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/report/customerDebtByMonth"
          component={ReportCustomerDebtByMonthStatistics}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/report/partnerDebtByMonth"
          component={ReportPartnerDebtByMonthStatistics}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/report/revenueBySale"
          component={ReportRevenueBySaleStatistics}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/report/revenueByVehicle"
          component={ReportRevenueByVehicleStatistics}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/dashboard"
          component={Dashboard}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          appConfig={appConfig}
          profile={profile}
          path="/demoBooking"
          component={DemoBooking}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          appConfig={appConfig}
          profile={profile}
          path="/scheduler"
          component={DemoScheduler}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/categoryUserManagement"
          component={CategoryUser}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/defineManagement"
          component={Define}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/report/categoryPay"
          component={CategoryPay}
        />
        {/* <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/bookingManagement"
          component={Booking}
        /> */}
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/enterpriseManagement"
          component={Enterprise}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/corporateManagement"
          component={DemoCorporate}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/contractManagement"
          component={DemoContract}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/corporateTrackingManagement"
          component={DemoCorporateTracking}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          path="/reconciliationManagement"
          component={DemoReconciliation}
        />
        <AppRoute
          layout={AuthorizedLayout}
          exact={true}
          history={history}
          appConfig={appConfig}
          profile={profile}
          path="*"
          component={DemoBooking}
        />
      </Switch>
    </BrowserRouter>
  );
};
const mapStateToProps = createStructuredSelector({
  appConfig: makeSelectAppConfig(),
  profile: makeSelectProfile(),
});
export default connect(mapStateToProps, null)(AppRouter);
