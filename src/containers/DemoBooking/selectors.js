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
export const makeSelectBookingModalTripId = () =>
  createSelector(
    selectDemoBooking,
    DemoBooking => _.get(DemoBooking, 'bookingModal.tripId')
  );