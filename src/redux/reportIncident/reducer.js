import {
    Map
} from 'immutable';
import { actions } from './actions';
const initState = new Map({
    listIncident: [],
    gridIncident: [],
    totalLength: 0,
    pageSize: 5,
    pages: 0,
    loading: false,
    gridIncidentItem: [],
});

export default function reducer(state = initState, action) {
    let listIncident = [];
    let gridIncident = [];

    // let itemIncident = [];
    let gridIncidentItem = [];

    switch (action.type) {
        case actions.GET_LIST_REPORT_INCIDENT_SUCCESS:
            listIncident = action.payload.docs;
            listIncident.forEach((value, index) => {
                let temp = {
                    key: null,
                    ownerId: null,
                    col_0: {
                        reason: [],
                    },
                    col_1: {
                        address: "",
                    },
                    col_2: {
                        description: ""
                    },
                    col_3: {
                        fullName: [],
                    },
                    col_4: {
                        image: [],
                    },
                    col_5: {
                        status: [],
                    },
                };
                temp.key = value.uuid;
                temp.ownerId = value.uuid;
                temp.col_0 = {
                    reason: value.reason,
                };
                temp.col_1 = {
                    address: value.address,
                };
                temp.col_2 = {
                    description: value.description,
                };
                temp.col_3 = {
                    fullName: value.refUser ? value.refUser.fullName : '',
                };
                temp.col_4 = {
                    image: value.image,
                };
                temp.col_5 = {
                    status: value.status,
                };
                temp.col_6 = {
                    parentName: value.parentName,
                };
                gridIncident.push(temp);
            });
            return state
                .set('listIncident', listIncident)
                .set('gridIncident', gridIncident)
                .set('totalLength', action.payload.total)
        case actions.ONSET_PAGESIZE:
            return state
                .set('pageSize', action.payload.data);
        case actions.ONCHANGE_CURRENTPAGE:
            return state
                .set('pages', action.payload.data);
        case actions.ON_LOADING:
            const loadding = action.payload.data;
            return state
                .set('loading', loadding)
        case actions.GET_DETAIL_REPORT_INCIDENT_SUCCESS:
            const itemIncident = [action.payload];
            itemIncident.forEach((value, index) => {
                let temp = {
                    key: null,
                    ownerId: null,
                    col_0: {
                        reason: [],
                    },
                    col_1: {
                        address: "",
                    },
                    col_2: {
                        description: ""
                    },
                    col_3: {
                        image: [],
                    },
                    col_4: {
                        status: [],
                    },
                };
                temp.key = value.uuid;
                temp.ownerId = value.uuid;
                temp.col_0 = {
                    reason: value.reason,
                };
                temp.col_1 = {
                    address: value.address,
                };
                temp.col_2 = {
                    description: value.description,
                };
                temp.col_3 = {
                    image: value.image,
                };
                temp.col_4 = {
                    status: value.status,
                };
                gridIncidentItem.push(temp);
            });
            return state
                .set('gridIncidentItem', gridIncidentItem)

        default:
            return state;
    }
}