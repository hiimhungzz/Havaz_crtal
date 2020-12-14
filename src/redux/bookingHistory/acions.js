export const actions = {
    GETLIST_BOOKING_HISTORY: 'GETLIST_BOOKING_HISTORY',
    getListBookingHistory: (data) => ({
        type: actions.GETLIST_BOOKING_HISTORY,
        payload: {
            data
        }
    }),
    GETLIST_BOOKING_HISTORY_SUCCESS: 'GETLIST_BOOKING_HISTORY_SUCCESS',
    getListBookingHistorySuccess: (data) => ({
        type: actions.GETLIST_BOOKING_HISTORY_SUCCESS,
        payload: {
            data
        }
    }),

    ONCHANGE_CURRENTPAGE: 'ONCHANGE_CURRENTPAGE',
    onChangeCurrentPage: (data) => ({
        type: actions.ONCHANGE_CURRENTPAGE,
        payload: {
            data
        }
    }),

    ONCHANGE_PAGESIZE: 'ONCHANGE_PAGESIZE',
    onChangePageSize: (data) => ({
        type: actions.ONCHANGE_PAGESIZE,
        payload: {
            data
        }
    }),

    ONSEARCH_BOOKING: 'ONSEARCH_BOOKING',
    onSearchBooking: (data) => ({
        type: actions.ONSEARCH_BOOKING,
        payload: {
            data
        }
    }),

    ON_LOADING_LISTBOOKING: 'ON_LOADING_LISTBOOKING',
    onLoading: (data) => ({
        type: actions.ON_LOADING_LISTBOOKING,
        payload: {
            data
        }
    }),

    GET_DETAIL_CONTENT: 'GET_DETAIL_CONTENT',
    getDetailContent: (data) => ({
        type: actions.GET_DETAIL_CONTENT,
        payload: {
            data
        }
    }),
    GET_DETAIL_CONTENT_SUCCESS: 'GET_DETAIL_CONTENT_SUCCESS',
    getDetailContentSuccess: (data) => ({
        type: actions.GET_DETAIL_CONTENT_SUCCESS,
        payload: data
    }),
};