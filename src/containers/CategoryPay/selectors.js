import {
  createSelector
} from 'reselect';
import _ from 'lodash';

export const selectDemoBooking = state => state.DemoBooking;
export const makeSelectBooking = () =>
  createSelector(
    selectDemoBooking,
    DemoBooking => DemoBooking
  );
export const makeSelectBookingStatus = () =>
  createSelector(
    selectDemoBooking,
    DemoBooking => _.get(DemoBooking, 'bookingStatus.dataSource')
  );
export const makeSelectBookingListFilter = () =>
  createSelector(
    selectDemoBooking,
    DemoBooking => _.get(DemoBooking, 'bookingList.filter')
  );
export const makeSelectBookingListQuery = () =>
  createSelector(
    selectDemoBooking,
    DemoBooking => _.get(DemoBooking, 'bookingList.filter.query')
  );
export const makeSelectBookingListGrid = () =>
  createSelector(
    selectDemoBooking,
    DemoBooking => _.get(DemoBooking, 'bookingList.grid')
  );
export const makeSelectBookingModal = () =>
  createSelector(
    selectDemoBooking,
    DemoBooking => _.get(DemoBooking, 'bookingModal')
  );
export const makeSelectBookingModalIsShow = () =>
  createSelector(
    selectDemoBooking,
    DemoBooking => _.get(DemoBooking, 'bookingModal.isShow')
  );
export const makeSelectBookingModalActionName = () =>
  createSelector(
    selectDemoBooking,
    DemoBooking => _.get(DemoBooking, 'bookingModal.actionName')
  );
export const makeSelectBookingModalBookingId = () =>
  createSelector(
    selectDemoBooking,
    DemoBooking => _.get(DemoBooking, 'bookingModal.bookingId')
  );
export const makeSelectBookingModalTabId = () =>
  createSelector(
    selectDemoBooking,
    DemoBooking => _.get(DemoBooking, 'bookingModal.tabId')
  );
export const makeSelectBookingInfoActiveStep = () =>
  createSelector(
    selectDemoBooking,
    DemoBooking => _.get(DemoBooking, 'bookingModal.bookingInfo.top.dataSource.activeStep')
  );
export const makeSelectBookingInfoLoading = () =>
  createSelector(
    selectDemoBooking,
    DemoBooking => _.get(DemoBooking, 'bookingModal.bookingInfo.loading')
  );
export const makeSelectBookingInfoTopDataSource = () =>
  createSelector(
    selectDemoBooking,
    DemoBooking => _.get(DemoBooking, 'bookingModal.bookingInfo.top.dataSource')
  );
export const makeSelectBookingInfoBottomDataSource = () =>
  createSelector(
    selectDemoBooking,
    DemoBooking => _.get(DemoBooking, 'bookingModal.bookingInfo.bottom.dataSource')
  );
export const makeSelectBookingInfoBottomTabId = () =>
  createSelector(
    selectDemoBooking,
    DemoBooking => _.get(DemoBooking, 'bookingModal.bookingInfo.bottom.tabId')
  );
export const makeSelectBookingInfoBottomIsSubmitInitial= () =>
  createSelector(
    selectDemoBooking,
    DemoBooking => _.get(DemoBooking, 'bookingModal.bookingInfo.bottom.dataSource.isSubmitInitial')
  );
export const makeSelectBookingInfoTopOrganizationId = () =>
  createSelector(
    selectDemoBooking,
    DemoBooking => _.get(DemoBooking, 'bookingModal.bookingInfo.top.dataSource.organizationId')
  );