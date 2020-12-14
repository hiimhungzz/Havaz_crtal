import { Map } from 'immutable';
import _ from 'lodash';
import { actions } from './actions'

const initState = new Map({
    loading: false,
    listBooking: [],
    listCustomer: [],
    listCustomerMonth: [],
    listRevenueSale: [],
    listPartnerVehicle: [],
    query: [],
    queryCustomer: [],
    queryCustomerMonth: [],
    queryRevenueSale: [],
    queryPartnerVehicle: [],
    error: false,
});

export default function reducer(state = initState, action) {
    switch (action.type) {
        case actions.EXTRACT_DOWNLOAD:
            return state
                .set('loading', true)
                .set('searchInput', action.payload.searchInput);
        case actions.EXTRACT_DOWNLOAD_SUCCESS_RESULT:
            return state
                .set('loading', false)
                .set('error', false);
        case actions.EXTRACT_DOWNLOAD_ERROR_RESULT:
            return state
                .set('loading', false)
                .set('error', false);
        case actions.BOOKING_VIEW:
            return state
                .set('loading', true)
                .set('listBooking', [])
                .set('query', [])
                .set('searchInput', action.payload.searchInput);
        case actions.BOOKING_VIEW_SUCCESS_RESULT:
            let dataBooking = [{
                    uuid: 'abc123',
                    pickUpAt: '2019-10-10',
                    code: 'CODE',
                    orgCode: 'code_123',
                    orgName: 'BUi TU',
                    bookingCode: 'DAY_LA_CODE',
                    dateIn: '2019-11-27',
                    dateOut: '2019-12-23',
                    salesName: 'ANH TU',
                    nameCountry: 'NAME LÀ GÌ',
                    fixedRoute: '12345',
                    driverth: 'BKS 123',
                    pickUp: '10:34',
                    status: 'chuyển điều phối'
                },
                {
                    uuid: 'abc12355',
                    pickUpAt: '2019-10-10',
                    code: 'CODE',
                    orgCode: 'code_123',
                    orgName: 'BUi TU12',
                    bookingCode: 'DAY_LA_CODE',
                    dateIn: '2019-11-27',
                    dateOut: '2019-12-23',
                    salesName: 'ANH TU',
                    nameCountry: 'NAME LÀ GÌ',
                    fixedRoute: '12345',
                    driverth: 'BKS 123',
                    pickUp: '10:34',
                    status: 'chuyển điều phối'
                },
            ]

            let listBooking = [];
            dataBooking.forEach((value, index) => {
                let temp = {
                    key: null,
                    col_1: {
                        pickUpAt: "-",
                        code: "-",
                    },
                    col_2: {
                        orgCode: "-",
                        orgName: "-",
                        bookingCode: "-"
                    },
                    col_3: {
                        dateIn: "-",
                        dateOut: "-"
                    },
                    col_4: {
                        salesName: "-"
                    },
                    col_5: {
                        nameCountry: "-",
                        fixedRoute: "-",
                        driverth: "-"
                    },
                    col_6: {
                        pickUp: "-"
                    },
                    col_7: {
                        status: "-"
                    },
                    point: []
                };

                temp.key = value.uuid;
                temp.col_1 = {
                    pickUpAt: value.pickUpAt || "-",
                    code: value.code || "-"
                };
                temp.col_2 = {
                    orgCode: value.orgCode || "-",
                    orgName: value.orgName || "-",
                    bookingCode: value.bookingCode || "-"
                };
                temp.col_3 = {
                    dateIn: value.dateIn || "-",
                    dateOut: value.dateOut || "-"
                };
                temp.col_4 = {
                    salesName: value.salesName || "-"
                };
                temp.col_5 = {
                    nameCountry: value.nameCountry || "-",
                    fixedRoute: value.fixedRoute || "-",
                    driverth: value.driverth || "-"
                };
                temp.col_6 = {
                    pickUp: value.pickUp || "-"
                };
                temp.col_7 = {
                    status: value.status || "-"
                };
                // temp.col_10 = {
                //     status: checkStatus(value.status.toString()),
                //     color: STATUS.find(x => x.value == value.status) ? STATUS.find(x => x.value == value.status).color : 'red',
                //     icon: STATUS.find(x => x.value == value.status) ? STATUS.find(x => x.value == value.status).icon : 'question-circle'
                // };
                listBooking.push(temp);
            });

            return state
                .set('listBooking', listBooking || [])
                .set('listBookingSuccess', dataBooking || [])
                .set('queryCustomer', [])
                .set('loading', false)
                .set('error', false);
        case actions.CUSTOMER_VIEW_SUCCESS:
            let dataCustomer = [{
                    uuid: 'abc123',
                    pickUpAt: '2019-10-10',
                    code: 'CODE',
                    orgCode: 'code_123',
                    orgName: 'BUi TU',
                    vehicleType: '16C',
                    fixedRouteName: 'Hà Nội - Vũng Tàu',
                    dateIn: '2019-11-27',
                    km: '123.000',
                    costPerKm: '1000 Đ',
                    overNightCost: '5000 Đ',
                    discount: '500.000',
                    amount: '600.000',
                    partnerAmount: '200.000',
                    partnerProfit: '600.000',
                    vehiclePlate: 'BKS - 12345',
                    note: 'Đã chiếm',
                    status: 'Chuyển điều phối'
                },
                {
                    uuid: 'abc101',
                    pickUpAt: '2019-10-10',
                    code: 'CODE',
                    orgCode: 'code_123',
                    orgName: 'BUi TU',
                    vehicleType: '16C',
                    fixedRouteName: 'Hà Nội - Vũng Tàu',
                    dateIn: '2019-11-27',
                    km: '123.000',
                    costPerKm: '1000 Đ',
                    overNightCost: '5000 Đ',
                    discount: '500.000',
                    amount: '600.000',
                    partnerAmount: '200.000',
                    partnerProfit: '600.000',
                    vehiclePlate: 'BKS - 12345',
                    note: 'Xe giật',
                    status: 'Tạo mới'
                },
            ]

            let listCustomer = [];
            dataCustomer.forEach((value, index) => {
                let temp = {
                    key: null,
                    col_1: {
                        pickUpAt: "-",
                        code: "-",
                        orgCode: "-",
                    },
                    col_2: {
                        pickUpAt: "-",
                        vehicleType: "-",
                        fixedRouteName: "-"
                    },
                    col_3: {
                        vehiclePlate: "-",
                        km: "-"
                    },
                    col_4: {
                        costPerKm: "-",
                        overNightCost: "-"
                    },
                    col_5: {
                        discount: "-",
                        amount: "-",
                    },
                    col_6: {
                        partnerAmount: "-",
                        partnerProfit: "-"
                    },
                    col_7: {
                        note: "-",
                    },
                    col_8: {
                        status: "-",
                    },
                    point: []
                };

                temp.key = value.uuid;
                temp.col_1 = {
                    pickUpAt: value.pickUpAt || "-",
                    code: value.code || "-",
                    orgCode: value.orgCode || "-"
                };
                temp.col_2 = {
                    pickUpAt: value.pickUpAt || "-",
                    vehicleType: value.vehicleType || "-",
                    fixedRouteName: value.fixedRouteName || "-"
                };
                temp.col_3 = {
                    vehiclePlate: value.vehiclePlate || "-",
                    km: value.km || "-"
                };
                temp.col_4 = {
                    costPerKm: value.costPerKm || "-",
                    overNightCost: value.overNightCost || "-"
                };
                temp.col_5 = {
                    discount: value.discount || "-",
                    amount: value.amount || "-",
                };
                temp.col_6 = {
                    partnerAmount: value.partnerAmount || "-",
                    partnerProfit: value.partnerProfit || "-"
                };
                temp.col_7 = {
                    note: value.note || "-"
                };
                temp.col_8 = {
                    status: value.status || "-"
                };

                // temp.col_10 = {
                //     status: checkStatus(value.status.toString()),
                //     color: STATUS.find(x => x.value == value.status) ? STATUS.find(x => x.value == value.status).color : 'red',
                //     icon: STATUS.find(x => x.value == value.status) ? STATUS.find(x => x.value == value.status).icon : 'question-circle'
                // };
                listCustomer.push(temp);
            });

            return state
                .set('listCustomer', listCustomer || [])
                .set('listCustomerSuccess', dataCustomer || [])
                .set('queryCustomerMonth', [])
                .set('loading', false)
                .set('error', false);
        case actions.CUSTOMER_MONTH_VIEW_SUCCESS:
            let dataCustomerMonth = [{
                    uuid: 'abc123',
                    pickUpAt: '2019-10-10',
                    code: 'CODE',
                    orgCode: 'code_123',
                    orgName: 'BUi TU',
                    vehicleType: '16C',
                    fixedRouteName: 'Hà Nội - Vũng Tàu',
                    dateIn: '2019-11-27',
                    km: '123.000',
                    costPerKm: '1000 Đ',
                    overNightCost: '5000 Đ',
                    discount: '500.000',
                    amount: '600.000',
                    partnerAmount: '200.000',
                    partnerProfit: '600.000',
                    vehiclePlate: 'BKS - 12345',
                    note: 'Đã chiếm',
                    status: 'Chuyển điều phối'
                },
                {
                    uuid: 'abc101',
                    pickUpAt: '2019-10-10',
                    code: 'CODE',
                    orgCode: 'code_123',
                    orgName: 'BUi TU',
                    vehicleType: '16C',
                    fixedRouteName: 'Hà Nội - Vũng Tàu',
                    dateIn: '2019-11-27',
                    km: '123.000',
                    costPerKm: '1000 Đ',
                    overNightCost: '5000 Đ',
                    discount: '500.000',
                    amount: '600.000',
                    partnerAmount: '200.000',
                    partnerProfit: '600.000',
                    vehiclePlate: 'BKS - 12345',
                    note: 'Xe giật',
                    status: 'Tạo mới'
                },
            ]

            let listCustomerMonth = [];
            dataCustomerMonth.forEach((value, index) => {
                let temp = {
                    key: null,
                    col_1: {
                        pickUpAt: "-",
                        code: "-",
                        orgCode: "-",
                    },
                    col_2: {
                        pickUpAt: "-",
                        vehicleType: "-",
                        fixedRouteName: "-"
                    },
                    col_3: {
                        vehiclePlate: "-",
                        km: "-"
                    },
                    col_4: {
                        costPerKm: "-",
                        overNightCost: "-"
                    },
                    col_5: {
                        discount: "-",
                        amount: "-",
                    },
                    col_6: {
                        partnerAmount: "-",
                        partnerProfit: "-"
                    },
                    col_7: {
                        note: "-",
                    },
                    col_8: {
                        status: "-",
                    },
                    point: []
                };

                temp.key = value.uuid;
                temp.col_1 = {
                    pickUpAt: value.pickUpAt || "-",
                    code: value.code || "-",
                    orgCode: value.orgCode || "-"
                };
                temp.col_2 = {
                    pickUpAt: value.pickUpAt || "-",
                    vehicleType: value.vehicleType || "-",
                    fixedRouteName: value.fixedRouteName || "-"
                };
                temp.col_3 = {
                    vehiclePlate: value.vehiclePlate || "-",
                    km: value.km || "-"
                };
                temp.col_4 = {
                    costPerKm: value.costPerKm || "-",
                    overNightCost: value.overNightCost || "-"
                };
                temp.col_5 = {
                    discount: value.discount || "-",
                    amount: value.amount || "-",
                };
                temp.col_6 = {
                    partnerAmount: value.partnerAmount || "-",
                    partnerProfit: value.partnerProfit || "-"
                };
                temp.col_7 = {
                    note: value.note || "-"
                };
                temp.col_8 = {
                    status: value.status || "-"
                };

                // temp.col_10 = {
                //     status: checkStatus(value.status.toString()),
                //     color: STATUS.find(x => x.value == value.status) ? STATUS.find(x => x.value == value.status).color : 'red',
                //     icon: STATUS.find(x => x.value == value.status) ? STATUS.find(x => x.value == value.status).icon : 'question-circle'
                // };
                listCustomerMonth.push(temp);
            });

            return state
                .set('listCustomerMonth', listCustomerMonth || [])
                .set('listCustomerMonthSuccess', dataCustomerMonth || [])
                .set('queryCustomerMonth', [])
                .set('loading', false)
                .set('error', false);
        case actions.REVENUE_SALE_VIEW_SUCCESS:
            let dataRevenueSale = [{
                    uuid: 'abc123',
                    pickUpAt: '2019-10-10',
                    code: 'CODE',
                    orgCode: 'code_123',
                    orgName: 'BUi TU',
                    vehicleType: '16C',
                    fixedRouteName: 'Hà Nội - Vũng Tàu',
                    dateIn: '2019-11-27',
                    km: '123.000',
                    costPerKm: '1000 Đ',
                    overNightCost: '5000 Đ',
                    discount: '500.000',
                    amount: '600.000',
                    partnerAmount: '200.000',
                    partnerProfit: '600.000',
                    vehiclePlate: 'BKS - 12345',
                    note: 'Đã chiếm',
                    status: 'Chuyển điều phối'
                },
                {
                    uuid: 'abc101',
                    pickUpAt: '2019-10-10',
                    code: 'CODE',
                    orgCode: 'code_123',
                    orgName: 'BUi TU',
                    vehicleType: '16C',
                    fixedRouteName: 'Hà Nội - Vũng Tàu',
                    dateIn: '2019-11-27',
                    km: '123.000',
                    costPerKm: '1000 Đ',
                    overNightCost: '5000 Đ',
                    discount: '500.000',
                    amount: '600.000',
                    partnerAmount: '200.000',
                    partnerProfit: '600.000',
                    vehiclePlate: 'BKS - 12345',
                    note: 'Xe giật',
                    status: 'Tạo mới'
                },
            ]

            let listRevenueSale = [];
            dataRevenueSale.forEach((value, index) => {
                let temp = {
                    key: null,
                    col_1: {
                        pickUpAt: "-",
                        code: "-",
                        orgCode: "-",
                    },
                    col_2: {
                        pickUpAt: "-",
                        vehicleType: "-",
                        fixedRouteName: "-"
                    },
                    col_3: {
                        vehiclePlate: "-",
                        km: "-"
                    },
                    col_4: {
                        costPerKm: "-",
                        overNightCost: "-"
                    },
                    col_5: {
                        discount: "-",
                        amount: "-",
                    },
                    col_6: {
                        partnerAmount: "-",
                        partnerProfit: "-"
                    },
                    col_7: {
                        note: "-",
                    },
                    col_8: {
                        status: "-",
                    },
                    point: []
                };

                temp.key = value.uuid;
                temp.col_1 = {
                    pickUpAt: value.pickUpAt || "-",
                    code: value.code || "-",
                    orgCode: value.orgCode || "-"
                };
                temp.col_2 = {
                    pickUpAt: value.pickUpAt || "-",
                    vehicleType: value.vehicleType || "-",
                    fixedRouteName: value.fixedRouteName || "-"
                };
                temp.col_3 = {
                    vehiclePlate: value.vehiclePlate || "-",
                    km: value.km || "-"
                };
                temp.col_4 = {
                    costPerKm: value.costPerKm || "-",
                    overNightCost: value.overNightCost || "-"
                };
                temp.col_5 = {
                    discount: value.discount || "-",
                    amount: value.amount || "-",
                };
                temp.col_6 = {
                    partnerAmount: value.partnerAmount || "-",
                    partnerProfit: value.partnerProfit || "-"
                };
                temp.col_7 = {
                    note: value.note || "-"
                };
                temp.col_8 = {
                    status: value.status || "-"
                };

                // temp.col_10 = {
                //     status: checkStatus(value.status.toString()),
                //     color: STATUS.find(x => x.value == value.status) ? STATUS.find(x => x.value == value.status).color : 'red',
                //     icon: STATUS.find(x => x.value == value.status) ? STATUS.find(x => x.value == value.status).icon : 'question-circle'
                // };
                listRevenueSale.push(temp);
            });

            return state
                .set('listRevenueSale', listRevenueSale || [])
                .set('listRevenueSaleSuccess', dataRevenueSale || [])
                .set('queryRevenueSale', [])
                .set('loading', false)
                .set('error', false);
        case actions.PARTNER_VEHICLE_VIEW_SUCCESS:
            let dataPartnerVehicle = [{
                    uuid: 'abc123',
                    pickUpAt: '2019-10-10',
                    code: 'CODE',
                    orgCode: 'code_123',
                    orgName: 'BUi TU',
                    vehicleType: '16C',
                    fixedRouteName: 'Hà Nội - Vũng Tàu',
                    dateIn: '2019-11-27',
                    km: '123.000',
                    costPerKm: '1000 Đ',
                    overNightCost: '5000 Đ',
                    discount: '500.000',
                    amount: '600.000',
                    partnerAmount: '200.000',
                    partnerProfit: '600.000',
                    vehiclePlate: 'BKS - 12345',
                    note: 'Đã chiếm',
                    status: 'Chuyển điều phối'
                },
                {
                    uuid: 'abc101',
                    pickUpAt: '2019-10-10',
                    code: 'CODE',
                    orgCode: 'code_123',
                    orgName: 'BUi TU',
                    vehicleType: '16C',
                    fixedRouteName: 'Hà Nội - Vũng Tàu',
                    dateIn: '2019-11-27',
                    km: '123.000',
                    costPerKm: '1000 Đ',
                    overNightCost: '5000 Đ',
                    discount: '500.000',
                    amount: '600.000',
                    partnerAmount: '200.000',
                    partnerProfit: '600.000',
                    vehiclePlate: 'BKS - 12345',
                    note: 'Xe giật',
                    status: 'Tạo mới'
                },
            ]

            let listPartnerVehicle = [];
            dataPartnerVehicle.forEach((value, index) => {
                let temp = {
                    key: null,
                    col_1: {
                        pickUpAt: "-",
                        code: "-",
                        orgCode: "-",
                    },
                    col_2: {
                        pickUpAt: "-",
                        vehicleType: "-",
                        fixedRouteName: "-"
                    },
                    col_3: {
                        vehiclePlate: "-",
                        km: "-"
                    },
                    col_4: {
                        costPerKm: "-",
                        overNightCost: "-"
                    },
                    col_5: {
                        discount: "-",
                        amount: "-",
                    },
                    col_6: {
                        partnerAmount: "-",
                        partnerProfit: "-"
                    },
                    col_7: {
                        note: "-",
                    },
                    col_8: {
                        status: "-",
                    },
                    point: []
                };

                temp.key = value.uuid;
                temp.col_1 = {
                    pickUpAt: value.pickUpAt || "-",
                    code: value.code || "-",
                    orgCode: value.orgCode || "-"
                };
                temp.col_2 = {
                    pickUpAt: value.pickUpAt || "-",
                    vehicleType: value.vehicleType || "-",
                    fixedRouteName: value.fixedRouteName || "-"
                };
                temp.col_3 = {
                    vehiclePlate: value.vehiclePlate || "-",
                    km: value.km || "-"
                };
                temp.col_4 = {
                    costPerKm: value.costPerKm || "-",
                    overNightCost: value.overNightCost || "-"
                };
                temp.col_5 = {
                    discount: value.discount || "-",
                    amount: value.amount || "-",
                };
                temp.col_6 = {
                    partnerAmount: value.partnerAmount || "-",
                    partnerProfit: value.partnerProfit || "-"
                };
                temp.col_7 = {
                    note: value.note || "-"
                };
                temp.col_8 = {
                    status: value.status || "-"
                };

                // temp.col_10 = {
                //     status: checkStatus(value.status.toString()),
                //     color: STATUS.find(x => x.value == value.status) ? STATUS.find(x => x.value == value.status).color : 'red',
                //     icon: STATUS.find(x => x.value == value.status) ? STATUS.find(x => x.value == value.status).icon : 'question-circle'
                // };
                listPartnerVehicle.push(temp);
            });

            return state
                .set('listPartnerVehicle', listPartnerVehicle || [])
                .set('listPartnerVehicleSuccess', dataPartnerVehicle || [])
                .set('queryPartnerVehicle', [])
                .set('loading', false)
                .set('error', false);
        case actions.BOOKING_VIEW_ERROR_RESULT:
            return state
                .set('loading', false)
                .set('error', false);
        default:
            return state;
    }
}