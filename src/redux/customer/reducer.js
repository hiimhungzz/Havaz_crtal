import {
    Map
} from 'immutable';
import {
    actions
} from './actions'
import {
    STATUS,
    APP_MODULE
} from "@Constants/common";
import {
    checkStatus,
    appParam,
    formatDateTime
} from "@Helpers/utility";
import {
    APP_PARAM
} from '@Constants';
import {
    $LocalStorage
} from '@Helpers/localStorage';

const initState = new Map({
    organization: {
        pageLimit: 5,
        currentPage: 0,
        totalLength: 0,
        query: {},
        grid: [],
        isShow: false,
        loading: false,
        spinning: false,
        fetching: false,
    },
    partner: {
        pageLimit: 5,
        currentPage: 0,
        totalLength: 0,
        query: {},
        grid: [],
        isShow: false,
        loading: false,
        spinning: false,
        fetching: false,
    },
    costPersonalLoading: false,
    costCustomerLoading: false,
    tabId: 1,
    actionName: '',
    customerData: {},
    listCity: [],
    listCustomerCost: [],
    isShow: false,
    error: false
});

export default function reducer(state = initState, action) {
    let organization = {
        ...state.get('organization')
    };
    let partner = {
        ...state.get('partner')
    };
    let {
        payload
    } = action;
    let listCustomerCost = [];
    let customerData = {};
    switch (action.type) {
        case actions.CUSTOMER_SHOW_MODAL:
            if (payload.actionName === 'create') {
                return state
                    .set('isShow', payload.isShow)
                    .set('customerData', customerData)
                    .set('actionName', payload.actionName);
            }
            return state
                .set('isShow', payload.isShow)
                .set('actionName', payload.actionName);
        case actions.CUSTOMER_BROWSE_ORGANIZATION:
            organization.loading = true;
            return state
                .set('organization', organization);
        case actions.CUSTOMER_BROWSE_ORGANIZATION_SUCCESS:
            if (appParam[APP_MODULE.CUSTOMERS]) {
                appParam[APP_MODULE.CUSTOMERS]['ORGANIZATION'] = payload.param
            } else {
                appParam[APP_MODULE.CUSTOMERS] = {
                    'ORGANIZATION': payload.param
                };
            }
            $LocalStorage.sls.setObject(APP_PARAM, appParam);
            organization.pageLimit = payload.param.pageLimit;
            organization.currentPage = payload.param.currentPage;
            organization.totalLength = payload.totalLength;
            organization.query = payload.param.query;
            organization.loading = false;
            organization.grid = payload.data.map((value, index) => {
                let temp = {
                    key: value.uuid,
                    ownerId: value.MOU,
                    cityId: value.cityId,
                    taxCode: value.taxCode,
                    col_1: {
                        code: value.code,
                        registerDate: formatDateTime(value.registerDate)
                    },
                    col_2: {
                        ownerName: value.ownerName,
                        ownerPhone: value.ownerPhone,
                    },
                    col_3: {
                        name: value.name,
                        phoneNumber: value.phone,
                        email: value.email || ''
                    },
                    col_4: {
                        unit: value.unit || '',
                        cityName: value.cityname || '',
                    },
                    col_5: {
                        taxCode: value.taxCode
                    },
                    col_6: {
                        registerOn: value.registerOn,
                    },
                    col_7: {
                        totalOrders: value.totalOrders || 0,
                        name: value.name || 0
                    },
                    col_8: {
                        lastOrder: value.lastOrder ? value.lastOrder : ''
                    },
                    col_9: {
                        status: checkStatus(value.status),
                        color: STATUS.find(x => x.value == value.status) ? STATUS.find(x => x.value == value.status).color : 'red',
                        icon: STATUS.find(x => x.value == value.status) ? STATUS.find(x => x.value == value.status).icon : 'fa-question-circle'
                    },
                    col_11: {
                        refCode: value.refCode
                    },
                    col_12: {
                        parentName: value.parentName
                    },
                    col_10: {
                        action: [{
                            name: "Xem chi tiết",
                            icon: "fa-eye",
                            handle: "handleReadOrganization"
                        }, {
                            name: "Xóa",
                            icon: "fa-trash",
                            handle: "handleDeleteOrganization"
                        }, ]
                    }
                };
                return temp;
            });
            return state
                .set('organization', organization);
        case actions.CUSTOMER_BROWSE_ORGANIZATION_ERROR:
            organization.grid = [];
            organization.loading = false;
            return state
                .set('organization', organization);
        case actions.CUSTOMER_BROWSE_PARTNER:
            partner.loading = true;
            return state
                .set('partner', partner);
        case actions.CUSTOMER_BROWSE_PARTNER_SUCCESS:
            if (appParam[APP_MODULE.CUSTOMERS]) {
                appParam[APP_MODULE.CUSTOMERS]['PARTNER'] = payload.param
            } else {
                appParam[APP_MODULE.CUSTOMERS] = {
                    'PARTNER': payload.param
                };
            }
            $LocalStorage.sls.setObject(APP_PARAM, appParam);
            partner.pageLimit = payload.param.pageLimit;
            partner.currentPage = payload.param.currentPage;
            partner.totalLength = payload.totalLength;
            partner.query = payload.param.query;
            partner.loading = false;
            partner.grid = payload.data.map((value, index) => {
                let temp = {
                    col_10: {
                        action: [{
                            name: "Xem chi tiết",
                            icon: "fa-eye",
                            handle: "handleReadPartner"
                        }, {
                            name: "Xóa",
                            icon: "fa-trash",
                            handle: "handleDeletePartner"
                        }, ]
                    }
                };
                temp.key = value.uuid;
                temp.ownerId = value.ownerId;
                temp.MOU = value.MOU;
                temp.cityId = value.cityid;
                temp.taxCode = value.taxCode;
                temp.col_1 = {
                    code: value.code,
                    registerDate: formatDateTime(value.registerDate)
                };
                temp.col_2 = {
                    ownerName: value.ownerName,
                    ownerPhone: value.ownerPhone,
                };
                temp.col_3 = {
                    name: value.name,
                    phoneNumber: value.phone,
                    email: value.email || ''
                };
                temp.col_4 = {
                    unit: value.unit || '',
                    cityName: value.cityname || '',
                };
                temp.col_6 = {
                    registerOn: value.registerOn,
                };
                temp.col_7 = {
                    totalOrders: value.totalOrders ? value.totalOrders : 0,
                    name: value.name ? value.name : 0
                };
                temp.col_8 = {
                    lastOrder: value.lastOrder ? value.lastOrder : null
                };
                temp.col_12 = {
                    parentName: value.parentName
                };
                temp.col_9 = {
                    status: checkStatus(value.status),
                    color: STATUS.find(x => x.value == value.status) ? STATUS.find(x => x.value == value.status).color : 'red',
                    icon: STATUS.find(x => x.value == value.status) ? STATUS.find(x => x.value == value.status).icon : 'fa-question-circle'
                };
                temp.col_11 = {
                    refCode: value.refCode
                };
                return temp;
            });
            return state
                .set('partner', partner);
        case actions.CUSTOMER_BROWSE_PARTNER_ERROR:
            partner.grid = [];
            partner.loading = false;
            return state
                .set('partner', partner);
        case actions.CITY_SEARCH:
            return state
                .set('searchInput', action.payload.searchInput);
        case actions.CITY_SUCCESS_RESULT:
            return state
                .set('listCity', action.data || [])
                .set('error', false);
        case actions.CITY_ERROR_RESULT:
            return state
                .set('listCity', [])
                .set('error', false);
        case actions.COST_CUSTOMER_SEARCH:
            return state
                .set('costCustomerLoading', true);
        case actions.COST_CUSTOMER_SUCCESS_RESULT:
            listCustomerCost = payload.data ? payload.data.map((value, index) => {
                return {
                    ...value,
                    key: index
                }
            }) : [];
            return state
                .set('listCustomerCost', listCustomerCost)
                .set('costCustomerLoading', false);
        case actions.COST_CUSTOMER_ERROR_RESULT:
            return state
                .set('listCustomerCost', [])
                .set('costCustomerLoading', false);
        case actions.CUSTOMER_CHANGE_TAB:
            return state
                .set('tabId', action.payload.tabId);

        case actions.CUSTOMER_READ_ORGANIZATION:
            organization.spinning = true;
            return state
                .set('organization', organization);
        case actions.CUSTOMER_READ_ORGANIZATION_SUCCESS:
            organization.spinning = false;
            organization.data = payload.data;
            console.log("organization.spinning SUCEESs", organization.spinning)
            return state
                .set('organization', organization)
                .set('customerData', payload.data);
        case actions.CUSTOMER_READ_ORGANIZATION_ERROR:
            organization.spinning = false;
            return state
                .set('organization', organization)
                .set('customerData ', {});
        case actions.CUSTOMER_READ_PARTNER:
            partner.spinning = true;
            return state
                .set('partner', partner);
        case actions.CUSTOMER_READ_PARTNER_SUCCESS:
            partner.spinning = false;
            partner.data = payload.data;
            return state
                .set('partner', partner)
                .set('customerData', payload.data);
        case actions.CUSTOMER_READ_PARTNER_ERROR:
            partner.spinning = false;
            return state
                .set('partner ', partner)
                .set('customerData ', {});

        default:
            return state;
    }
}