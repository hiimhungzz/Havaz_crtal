import { Map } from 'immutable';
import { actions } from './actions'
import _ from "lodash";

const initState = new Map({
    pageSize: 5,
    externalPageLimit: 5,
    pages: 0,
    orderBy: {
        name: 1
    },
    isShow: false,
    actionName: '',
    rowData: {},
    listFeedBack: [],
    totalLength: 0,
    loading: false,
    error: false,
    tabId: '1'
});
export default function reducer(state = initState, action) {
    switch (action.type) {
        case actions.FEEDBACK_SHOW_MODEL:
            return state
                .set('isShow', action.payload.isShow)
                .set('actionName', action.payload.actionName)
                .set('rowData', action.payload.rowData ? action.payload.rowData : {});
        case actions.FEEDBACK_SEARCH:
            return state
                .set('loading', true);
        case actions.FEEDBACK_SEARCH_SUCCESS:
            if (window.location.pathname === '/feedBackManagement') {
                let appParam = {};
                appParam['FeedBack'] = action.param;
                localStorage.setItem('AppParam', JSON.stringify(appParam));
            }
            let listFeedBack = [];
            action.docs.forEach((value, index) => {
                let temp = {
                    key: null,
                    col_1: {
                        refUser: "-",
                        userType: "-",
                    },
                    col_2: {
                        reason: "-",
                    },
                    col_3: {
                        description: "-"
                    },
                    col_4: {
                        parentName: "-"
                    },
                    col_5: {
                        action: [{
                            status: value.status || false,
                            handle: "handleEditFeedBack"
                        }]
                    },
                    point: []
                };
                temp.key = value.uuid;
                temp.col_1 = {
                    refUser: value.refUser ? value.refUser.fullName : "-",
                    userType: value.userType == 'driver' ? 'Lái xe đánh giá' : "-",
                };
                temp.col_2 = {
                    reason: _.join(value.reason, ", "),
                };
                temp.col_3 = {
                    description: value.description || value.description != 'undefined' ? value.description  : '' ,
                };
                temp.col_4 = {
                    parentName: value.parentName || '',
                };

                listFeedBack.push(temp);
            })
            return state
                .set('listFeedBack', listFeedBack)
                .set('listFeedBackSuccess', action.docs)
                .set('total', action.total)
                .set('pageSize', action.pageSize)
                .set('selectStatus', action.status)
                .set('pages', action.pages)
                .set('param', action.param)
                .set('query', action.param.query)
                .set('loading', false)
                .set('error', false);
        default:
            return state;
    }
}