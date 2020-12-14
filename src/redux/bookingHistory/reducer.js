import {
    Map
} from 'immutable';
import {actions} from './acions';
const initState = new Map({
    gridHistory: [],
    orderBy: {
        createdAt: -1,
        lastUpdatedAt: -1,
        codeBooking: -1,
    },
    totalLength: 0,
    pageSize: 5,
    currentPage: 0,
    loading: false,
    itemBooking: undefined,
    test: undefined
});

export default function reducer(state = initState, action) {
    let gridHistory = [];
    switch (action.type) {
        case actions.GETLIST_BOOKING_HISTORY_SUCCESS:
            const listBooking = action.payload.data.data.datas;
            const totalLength = action.payload.data.data.totalLength;
            listBooking.forEach((value, index) => {
                let temp = {
                    key: null,
                    ownerId: null,
                    col_0: {
                        codeBooking: '',
                    },
                    col_1: {
                        command: "",
                    },
                    col_2: {
                        vehicleRouter: ""
                    },
                    col_3: {
                        action: ""
                    },
                    col_4: {
                        content: "",
                    },
                    col_5: {
                        date: ''
                    },
                    col_6: {
                        time: ''
                    },
                    col_7: {
                        moderator: ''
                    },
                };
                temp.key = value._id;
                temp.ownerId = value.id;
                temp.col_0 = {
                    codeBooking: value.code,
                };
                temp.col_1 = {
                    command: value.detailRoute,
                };
                temp.col_2 = {
                    vehicleRouter: value.detailRoute,
                };
                temp.col_3 = {
                    action: value.action,
                };
                temp.col_4 = {
                    content: value.content,
                };
                temp.col_5 = {
                    date: value.detailRoute,
                };
                temp.col_6 = {
                    time: value.createdAt,
                };
                temp.col_7 = {
                    moderator: value.users,
                };
                gridHistory.push(temp);
            });
            return state
                .set('gridHistory', gridHistory)
                .set('totalLength', totalLength)
        case actions.ONCHANGE_CURRENTPAGE:
            return state
                .set('currentPage', action.payload.data)
        case actions.ONCHANGE_PAGESIZE:
            return state
                .set('pageSize', action.payload.data)

        case actions.ON_LOADING_LISTBOOKING:
            const loading = action.payload.data;
            return state
                .set('loading', loading)
        case actions.GET_DETAIL_CONTENT_SUCCESS:
            return state
                .set('itemBooking', action.payload)
        default:
            return state;
    }
}