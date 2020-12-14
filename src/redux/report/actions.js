export const actions = {
    REPORT_DOWNLOAD: 'REPORT_DOWNLOAD',
    REPORT_DOWNLOAD_SUCCESS_RESULT: 'REPORT_DOWNLOAD_SUCCESS_RESULT',
    REPORT_DOWNLOAD_ERROR_RESULT: 'REPORT_DOWNLOAD_ERROR_RESULT',
    reportDownload: (param, reportName, reportNumber) => ({
        type: actions.REPORT_DOWNLOAD,
        payload: {
            param,
            reportName,
            reportNumber
        }
    }),
    reportDownloadSuccess: ({reportNumber}) => ({
        type: actions.REPORT_DOWNLOAD_SUCCESS_RESULT,
        payload:{
            reportNumber
        }
    }),
    reportDownloadError: ({reportNumber}) => ({
        type: actions.REPORT_DOWNLOAD_ERROR_RESULT,
        payload:{
            reportNumber
        }
    }),
    REPORT_VIEW: 'REPORT_VIEW',
    REPORT_VIEW_SUCCESS_RESULT: 'REPORT_VIEW_SUCCESS_RESULT',
    REPORT_VIEW_ERROR_RESULT: 'REPORT_VIEW_ERROR_RESULT',
    reportView: (param, reportName, reportNumber) => ({
        type: actions.REPORT_VIEW,
        payload: {
            param,
            reportName,
            reportNumber
        }
    }),
    reportViewSuccess: (payload) => ({
        type: actions.REPORT_VIEW_SUCCESS_RESULT,
        payload
    }),
    reportViewError: () => ({
        type: actions.REPORT_VIEW_ERROR_RESULT
    }),
    CUSTOMER_VIEW: 'CUSTOMER_VIEW',
    CUSTOMER_VIEW_SUCCESS: 'CUSTOMER_VIEW_SUCCESS',
    customerView: (params) => ({
        type: actions.CUSTOMER_VIEW,
        payload: {
            params
        }
    }),
    customerViewSuccess: (data) => ({
        type: actions.CUSTOMER_VIEW_SUCCESS,
        data
    }),
    CUSTOMER_MONTH_VIEW: 'CUSTOMER_MONTH_VIEW',
    CUSTOMER_MONTH_VIEW_SUCCESS: 'CUSTOMER_MONTH_VIEW_SUCCESS',
    customerMonthView: (params) => ({
        type: actions.CUSTOMER_MONTH_VIEW,
        payload: {
            params
        }
    }),
    customerMonthViewSuccess: (data) => ({
        type: actions.CUSTOMER_MONTH_VIEW_SUCCESS,
        data
    }),
    REVENUBY_SALE_VIEW: 'REVENUBY_SALE_VIEW',
    REVENUE_SALE_VIEW_SUCCESS: 'REVENUE_SALE_VIEW_SUCCESS',
    revenueView: (params) => ({
        type: actions.REVENUBY_SALE_VIEW,
        payload: {
            params
        }
    }),
    revenueViewSuccess: (data) => ({
        type: actions.REVENUE_SALE_VIEW_SUCCESS,
        data
    }),
    PARTNER_VEHICLE_VIEW: 'PARTNER_VEHICLE_VIEW',
    PARTNER_VEHICLE_VIEW_SUCCESS: 'PARTNER_VEHICLE_VIEW_SUCCESS',
    partnerVehicleView: (params) => ({
        type: actions.PARTNER_VEHICLE_VIEW,
        payload: {
            params
        }
    }),
    partnerVehicleViewSuccess: (data) => ({
        type: actions.PARTNER_VEHICLE_VIEW_SUCCESS,
        data
    })
};