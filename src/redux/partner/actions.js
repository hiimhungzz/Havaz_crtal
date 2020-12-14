export const actions = {
    PARTNER_SHOW_MODAL: 'PARTNER_SHOW_MODAL',
    showModal: ({
        isShow,
        actionName
    }) => ({
        type: actions.PARTNER_SHOW_MODAL,
        payload: {
            isShow,
            actionName
        }
    }),
    PARTNER_BROWSE_ORGANIZATION: 'PARTNER_BROWSE_ORGANIZATION',
    PARTNER_BROWSE_ORGANIZATION_SUCCESS: 'PARTNER_BROWSE_ORGANIZATION_SUCCESS',
    PARTNER_BROWSE_ORGANIZATION_ERROR: 'PARTNER_BROWSE_ORGANIZATION_ERROR',
    browseOrganization: ({
        searchInput = '',
        pageLimit = 5,
        currentPage = 0,
        orderBy = {
            createdAt: 1
        },
        query = {
            codes: "",
            nameOrAdress: "",
            phone: '',
            email: '',
            citys: [],
            status: [],
            startDate: '',
            endDate: '',
            taxCode: '',
        }
    }) => ({
        type: actions.PARTNER_BROWSE_ORGANIZATION,
        payload: {
            param: {
                pageLimit,
                currentPage,
                orderBy,
                query,
                searchInput
            }
        }
    }),
    browseOrganizationSuccess: ({
        data,
        totalLength,
        param
    }) => ({
        type: actions.PARTNER_BROWSE_ORGANIZATION_SUCCESS,
        payload: {
            data,
            totalLength,
            param
        }
    }),
    browseOrganizationError: (errorMessage) => ({
        type: actions.PARTNER_BROWSE_ORGANIZATION_ERROR,
        payload: {
            errorMessage
        }
    }),

    PARTNER_READ_ORGANIZATION: 'PARTNER_READ_ORGANIZATION',
    PARTNER_READ_ORGANIZATION_SUCCESS: 'PARTNER_READ_ORGANIZATION_SUCCESS',
    PARTNER_READ_ORGANIZATION_ERROR: 'PARTNER_READ_ORGANIZATION_ERROR',
    readOrganization: ({
        param,
        actionName = '',
        filterDatetime,
    }) => ({
        type: actions.PARTNER_READ_ORGANIZATION,
        payload: {
            actionName,
            param,
            filterDatetime
        }
    }),
    readOrganizationSuccess: (
        data
    ) => ({
        type: actions.PARTNER_READ_ORGANIZATION_SUCCESS,
        payload: {
            data
        }
    }),
    readOrganizationError: (errorMessage) => ({
        type: actions.PARTNER_READ_ORGANIZATION_ERROR,
        payload: {
            errorMessage
        }
    }),
    PARTNER_READ_PARTNER: 'PARTNER_READ_PARTNER',
    PARTNER_READ_PARTNER_SUCCESS: 'PARTNER_READ_PARTNER_SUCCESS',
    PARTNER_READ_PARTNER_ERROR: 'PARTNER_READ_PARTNER_ERROR',
    readPartner: ({
        param,
        filterDatetime,
    }) => ({
        type: actions.PARTNER_READ_PARTNER,
        payload: {
            param,
            filterDatetime,
        }
    }),
    readPartnerSuccess: (
        data
    ) => ({
        type: actions.PARTNER_READ_PARTNER_SUCCESS,
        payload: {
            data
        }
    }),
    readPartnerError: (errorMessage) => ({
        type: actions.PARTNER_READ_PARTNER_ERROR,
        payload: {
            errorMessage
        }
    }),

    PARTNER_BROWSE_PARTNER: 'PARTNER_BROWSE_PARTNER',
    PARTNER_BROWSE_PARTNER_SUCCESS: 'PARTNER_BROWSE_PARTNER_SUCCESS',
    PARTNER_BROWSE_PARTNER_ERROR: 'PARTNER_BROWSE_PARTNER_ERROR',
    browsePartner: ({
        searchInput = '',
        pageLimit = 5,
        currentPage = 0,
        orderBy = {
            createdAt: 1
        },
        query = {
            userCode: "",
            fullnamePhoneEmail: "",
            organizationIds: [],
            rolesIds: [],
            status: []
        }
    }) => ({
        type: actions.PARTNER_BROWSE_PARTNER,
        payload: {
            param: {
                pageLimit,
                currentPage,
                orderBy,
                query,
                searchInput
            }
        }
    }),
    browsePartnerSuccess: ({
        data,
        totalLength,
        param
    }) => ({
        type: actions.PARTNER_BROWSE_PARTNER_SUCCESS,
        payload: {
            data,
            totalLength,
            param
        }
    }),
    browsePartnerError: (errorMessage) => ({
        type: actions.PARTNER_BROWSE_PARTNER_ERROR,
        payload: {
            errorMessage
        }
    }),

    PARTNER_DELETE_ORGANIZATION: 'PARTNER_DELETE_ORGANIZATION',
    deleteOrganization: (param) => ({
        type: actions.PARTNER_DELETE_ORGANIZATION,
        payload: {
            param
        }
    }),
    PARTNER_DELETE_PARTNER: 'PARTNER_DELETE_PARTNER',
    deletePartner: (param) => ({
        type: actions.PARTNER_DELETE_PARTNER,
        payload: {
            param
        }
    }),

    COST_PARTNER_SEARCH: 'COST_PARTNER_SEARCH',
    COST_PARTNER_SUCCESS_RESULT: 'COST_PARTNER_SUCCESS_RESULT',
    COST_PARTNER_ERROR_RESULT: 'COST_PARTNER_ERROR_RESULT',
    costPartnerSearch: (uuid, filterDatetime) => ({
        type: actions.COST_PARTNER_SEARCH,
        payload: {
            param: {
                uuid,
                filterDatetime
            }
        }
    }),
    costPartnerSearchSuccess: (data) => ({
        type: actions.COST_PARTNER_SUCCESS_RESULT,
        payload: {
            data
        }

    }),
    costPartnerSearchError: () => ({
        type: actions.COST_PARTNER_ERROR_RESULT
    }),
    PARTNER_ADD_ORGANIZATION: 'PARTNER_ADD_ORGANIZATION',
    addOrganization: (data) => ({
        type: actions.PARTNER_ADD_ORGANIZATION,
        payload: {
            data
        }
    }),
    PARTNER_ADD_PARTNER: 'PARTNER_ADD_PARTNER',
    addPartner: (data) => ({
        type: actions.PARTNER_ADD_PARTNER,
        payload: {
            data
        }
    }),
    PARTNER_EDIT_ORGANIZATION: 'PARTNER_EDIT_ORGANIZATION',
    editOrganization: (data) => ({
        type: actions.PARTNER_EDIT_ORGANIZATION,
        payload: {
            data
        }
    }),
    PARTNER_EDIT_PARTNER: 'PARTNER_EDIT_PARTNER',
    editPartner: (data) => ({
        type: actions.PARTNER_EDIT_PARTNER,
        payload: {
            data
        }
    }),
    ADD_ORGANIZATION_ROUTE_COST: 'ADD_ORGANIZATION_ROUTE_COST',
    addOrganizationRouteCost: () => ({
        type: actions.ADD_ORGANIZATION_ROUTE_COST,
        payload: {}
    }),

    SAVE_PARTNER_ROUTE_COST_PER: 'SAVE_PARTNER_ROUTE_COST_PER',
    savePartnerRouteCostPer: (param) => ({
        type: actions.SAVE_PARTNER_ROUTE_COST_PER,
        payload: {
            param
        }
    }),
    SAVE_PARTNER_ROUTE_COST: 'SAVE_PARTNER_ROUTE_COST',
    savePartnerRouteCost: (param) => ({
        type: actions.SAVE_PARTNER_ROUTE_COST,
        payload: {
            param
        }
    }),

    onPageChange: (param, tabId) => ({
        type: tabId === 1 ? actions.PARTNER_BROWSE_ORGANIZATION : actions.PARTNER_BROWSE_PARTNER,
        payload: {
            currentPage: param.currentPage,
            pageLimit: param.pageLimit,
            param
        }
    }),
    PARTNER_CHANGE_TAB: 'PARTNER_CHANGE_TAB',
    changeTab: (tabId) => ({
        type: actions.PARTNER_CHANGE_TAB,
        payload: {
            tabId
        }
    }),
};