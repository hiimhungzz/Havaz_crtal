export const actions = {
    GET_LIST_REPORT_INCIDENT: 'GET_LIST_REPORT_INCIDENT',
    getListReportIncident: (params) => ({
        type: actions.GET_LIST_REPORT_INCIDENT,
        payload: params,
    }),
    GET_LIST_REPORT_INCIDENT_SUCCESS: 'GET_LIST_REPORT_INCIDENT_SUCCESS',
    getListReportIncidentSucess: (params) => ({
        type: actions.GET_LIST_REPORT_INCIDENT_SUCCESS,
        payload: params,
    }),
    

    ON_LOADING: 'ON_LOADING',
    onLoading: (data) => ({
        type: actions.ON_LOADING,
        payload: {
            data
        }
    }),

    ONSET_PAGESIZE: 'ONSET_PAGESIZE',
    onSetPageSize: (data) => ({
        type: actions.ONSET_PAGESIZE,
        payload: {
            data
        }
    }),

    ONCHANGE_CURRENTPAGE: 'ONCHANGE_CURRENTPAGE',
    onChangeCurrentPage:(data) => ({
        type: actions.ONCHANGE_CURRENTPAGE,
        payload: {
            data
        }
    }),
    
    
    UPDATE_STATUS_REPORT_INCIDENT: 'UPDATE_STATUS_REPORT_INCIDENT',
    updateStatusReportIncident: (params) => ({
        type: actions.UPDATE_STATUS_REPORT_INCIDENT,
        payload: params,
    }),


    GET_DETAIL_REPORT_INCIDENT: 'GET_DETAIL_REPORT_INCIDENT',
    getDetailReportIncident: (params) => ({
        type: actions.GET_DETAIL_REPORT_INCIDENT,
        payload: params,
    }),
    GET_DETAIL_REPORT_INCIDENT_SUCCESS: 'GET_DETAIL_REPORT_INCIDENT_SUCCESS',
    getDetailReportIncidentSuccess: (params) => ({
        type: actions.GET_DETAIL_REPORT_INCIDENT_SUCCESS,
        payload: params,
    }),
};