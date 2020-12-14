export const actions = {
    EXTRACT_DOWNLOAD: 'EXTRACT_DOWNLOAD',
    EXTRACT_DOWNLOAD_SUCCESS_RESULT: 'EXTRACT_DOWNLOAD_SUCCESS_RESULT',
    EXTRACT_DOWNLOAD_ERROR_RESULT: 'EXTRACT_DOWNLOAD_ERROR_RESULT',
    reportDownload: (param, reportName, reportNumber) => ({
        type: actions.EXTRACT_DOWNLOAD,
        payload: {
            param,
            reportName,
            reportNumber
        }
    }),
    reportDownloadSuccess: (data) => ({
        type: actions.EXTRACT_DOWNLOAD_SUCCESS_RESULT,
        data
    }),
    reportDownloadError: () => ({
        type: actions.EXTRACT_DOWNLOAD_ERROR_RESULT
    }),
    EXTRACT_VIEW: 'EXTRACT_VIEW',
    EXTRACT_VIEW_SUCCESS_RESULT: 'EXTRACT_VIEW_SUCCESS_RESULT',
    EXTRACT_VIEW_ERROR_RESULT: 'EXTRACT_VIEW_ERROR_RESULT',
    reportView: (param, reportName, reportNumber) => ({
        type: actions.EXTRACT_VIEW,
        payload: {
            param,
            reportName,
            reportNumber
        }
    }),
    reportViewSuccess: (data) => ({
        type: actions.EXTRACT_VIEW_SUCCESS_RESULT,
        data
    }),
    reportViewError: () => ({
        type: actions.EXTRACT_VIEW_ERROR_RESULT
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
    }),

    EXTRACT_DOWNLOAD_COMMAND_MANAGEMENT: 'EXTRACT_DOWNLOAD_COMMAND_MANAGEMENT',
    extractDownloadCommandManagent: (params) => ({
        type: actions.EXTRACT_DOWNLOAD_COMMAND_MANAGEMENT,
        payload: params
    }),
};