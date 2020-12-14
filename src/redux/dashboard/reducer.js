import {
    Map
} from 'immutable';
import {actions} from './acions';
const initState = new Map({
    dataChart: {
        labels: [],
        datasets: []
    },
    dataChartDriver: {
        labels: [],
        datasets: []
    },
    dataReportMonth: undefined,
    dataReportDay: undefined,
});

export default function reducer(state = initState, action) {
    switch (action.type) {
        case actions.FILTER_CHART_SUCCESS:
            return state
                .set('dataChart', action.payload.message)
        case actions.FILTER_CHART_DRIVER_SUCCESS:
            return state
                .set('dataChartDriver', action.payload.message)
        case actions.GET_REPORT_FOR_YEAR_SUCCESS:
            return state
                .set('dataReportMonth', action.payload.data)
        case actions.GET_REPORT_FOR_MONTH_SUCCESS:
            return state
                .set('dataReportDay', action.payload.data)
                    
        default:
            return state;
    }
}