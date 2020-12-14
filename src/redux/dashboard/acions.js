export const actions = {
    FILTER_CHART: 'FILTER_CHART',
    filterChart: (data) => ({
        type: actions.FILTER_CHART,
        payload: {
            data
        }
    }),
    FILTER_CHART_SUCCESS: 'FILTER_CHART_SUCCESS',
    filterChartSuccess: (message) => ({
        type: actions.FILTER_CHART_SUCCESS,
        payload: {
            message
        }
    }),

    FILTER_CHART_DRIVER: 'FILTER_CHART_DRIVER',
    filterChartDriver: (data) => ({
        type: actions.FILTER_CHART_DRIVER,
        payload: {
            data
        }
    }),
    FILTER_CHART_DRIVER_SUCCESS: 'FILTER_CHART_DRIVER_SUCCESS',
    filterChartDriverSuccess: (message) => ({
        type: actions.FILTER_CHART_DRIVER_SUCCESS,
        payload: {
            message
        }
    }),

    GET_REPORT_FOR_MONTH: 'GET_REPORT_FOR_MONTH',
    getReportForMonth: (data) => ({
        type: actions.GET_REPORT_FOR_MONTH,
        payload: {
            data
        }
    }),
    GET_REPORT_FOR_MONTH_SUCCESS: 'GET_REPORT_FOR_MONTH_SUCCESS',
    getReportForMonthSuccess: (data) => ({
        type: actions.GET_REPORT_FOR_MONTH_SUCCESS,
        payload: {
            data
        }
    }),


    // GET_REPORT_FOR_MONTH: 'GET_REPORT_FOR_MONTH',
    // getReportForMonth: (data) => ({
    //     type: actions.GET_REPORT_FOR_MONTH,
    //     payload: {
    //         data
    //     }
    // }),
    // GET_REPORT_FOR_MONTH_SUCCESS: 'GET_REPORT_FOR_MONTH_SUCCESS',
    // getReportForMonthSuccess: (data) => ({
    //     type: actions.GET_REPORT_FOR_MONTH_SUCCESS,
    //     payload: {
    //         data
    //     }
    // }),


    GET_REPORT_FOR_YEAR: 'GET_REPORT_FOR_YEAR',
    getReportForYear: (data) => ({
        type: actions.GET_REPORT_FOR_YEAR,
        payload: {
            data
        }
    }),
    GET_REPORT_FOR_YEAR_SUCCESS: 'GET_REPORT_FOR_YEAR_SUCCESS',
    getReportForYearSuccess: (data) => ({
        type: actions.GET_REPORT_FOR_YEAR_SUCCESS,
        payload: {
            data
        }
    }),
};