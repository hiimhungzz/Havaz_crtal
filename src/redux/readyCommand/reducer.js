import {
    Map
} from 'immutable';
import {
    actions
} from './actions'
import {
    READY_COMMAND_STATUS,
    COLOR
} from "@Constants/common";
import { formatDateTime } from '@Helpers/utility';

const initState = new Map({
    param: {
        orderBy: [],
    },
    listReadyCommand: [],
    gridReadyCommand: [],
    loading: false,
    error: {},
});

export default function reducer(state = initState, action) {
    let listReadyCommand = [];
    let gridReadyCommand = [];
    switch (action.type) {
        case actions.BROWSE_READY_COMMAND:
            return state
                .set('loading', true)
                .set('query', action.payload.param);
        case actions.BROWSE_READY_COMMAND_SUCCESS_RESULT:
            if (window.location.pathname === '/tourManagement') {
                let appParam = {};
                appParam['ReadyCommand'] = action.param;
                localStorage.setItem('AppParam', JSON.stringify(appParam));
            }
            listReadyCommand = action.payload.data;
            listReadyCommand.forEach((value, index) => {
                let temp = {};
                temp.key = value.uuid;
                temp.col_1 = {
                    code: value.driverName,
                };
                temp.col_2 = {
                    name: value.vehicleName,
                };
                temp.col_3 = {
                    lastUpdatedAt: formatDateTime(value.lastUpdatedAt),
                };
                temp.col_4 = {
                    x: value.location.x,
                    y: value.location.y,
                };

                temp.col_5 = {
                    label: value.status ? READY_COMMAND_STATUS.READY : READY_COMMAND_STATUS.NOT_READY,
                    key: value.status,
                    color: value.status ? COLOR.STATE.SUCCESS : COLOR.STATE.DANGER,
                };
                gridReadyCommand.push(temp);
            });

            return state
                .set('listReadyCommand', listReadyCommand)
                .set('gridReadyCommand', gridReadyCommand)
                .set('param', action.payload.param)
                .set('loading', false)
                .set('error', false);
        case actions.BROWSE_READY_COMMAND_ERROR_RESULT:
            return state
                .set('listReadyCommand', [])
                .set('loading', false)
                .set('error', false);
        default:
            return state;
    }
}