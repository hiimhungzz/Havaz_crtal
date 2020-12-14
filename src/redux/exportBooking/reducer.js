import { Map } from 'immutable';
import { actions } from './actions'

const initState = new Map({
    isShow: false,
    actionName: '',
    rowData: {},
    rowDataType: {},
    totalLength: 0,
    loading: false,
    error: false
});

export default function reducer(state = initState, action) {
    switch (action.type) {

        case actions.EXPORT_SEARCH:
            return state
                .set('loading', true);


        default:
            return state;
    }
}