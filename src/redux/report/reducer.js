import {
    Map
} from 'immutable';
import _ from 'lodash';
import {
    actions
} from './actions'
import {
    DATE_TIME_FORMAT
} from '@Constants/common';
import moment from 'moment';

const initState = new Map({
    loading: false,
    bookingStatistics: {
        viewLoading: false,
        downloadLoading: false,
        rows: [],
        pages: 0,
        pageSize: 15,
        totalLength: 0,
        param: {}
    },
    customerDebtByDayStatistics: {
        viewLoading: false,
        downloadLoading: false,
        rows: [],
        pages: 0,
        pageSize: 15,
        totalLength: 0,
        param: {}
    },
    customerDebtByMonthStatistics: {
        viewLoading: false,
        downloadLoading: false,
        rows: [],
        pages: 0,
        pageSize: 15,
        totalLength: 0,
        param: {}
    },
    revenueBySaleStatistics: {
        viewLoading: false,
        downloadLoading: false,
        rows: [],
        pages: 0,
        pageSize: 15,
        totalLength: 0,
        param: {}
    },
    revenueByVehicleStatistics: {
        viewLoading: false,
        downloadLoading: false,
        rows: [],
        pages: 0,
        pageSize: 15,
        totalLength: 0,
        param: {}
    },
    partnerDebtByMonthStatistics: {
        viewLoading: false,
        downloadLoading: false,
        rows: [],
        pages: 0,
        pageSize: 15,
        totalLength: 0,
        param: {}
    },
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
    let {
        payload
    } = action;
    let module = {};
    let moduleName = '';
    let reportNumber = payload ? payload.reportNumber : 0;
    switch (reportNumber) {
        case 1:
            moduleName = 'bookingStatistics';
            break;
        case 2:
            moduleName = 'customerDebtByDayStatistics';
            break;
        case 3:
            moduleName = 'customerDebtByMonthStatistics';
            break;
        case 4:
            moduleName = 'revenueBySaleStatistics';
            break;
        case 5:
            moduleName = 'partnerDebtByMonthStatistics';
            break;
        case 6:
            moduleName = 'revenueByVehicleStatistics';
            break;
        default:
            break;
    }

    switch (action.type) {
        case actions.REPORT_DOWNLOAD:
            module = {
                ...state.get(moduleName)
            };
            module['downloadLoading'] = true;
            return state
                .set(moduleName, module);
        case actions.REPORT_DOWNLOAD_SUCCESS_RESULT:
            module = {
                ...state.get(moduleName)
            };
            module['downloadLoading'] = false;
            return state
                .set(moduleName, module);
        case actions.REPORT_DOWNLOAD_ERROR_RESULT:
            module = {
                ...state.get(moduleName)
            };
            module['downloadLoading'] = false;
            return state
                .set(moduleName, module);
        case actions.REPORT_VIEW:
            module = {
                ...state.get(moduleName)
            };
            module['viewLoading'] = true;
            module['param'] = payload.param;
            return state
                .set(moduleName, module);
        case actions.REPORT_VIEW_SUCCESS_RESULT:
            module = {
                ...state.get(moduleName)
            };
            // module = {...module};
            module.rows = [];
            debugger;
            switch (payload.reportNumber) {
                case 1:
                    payload.rows.forEach((value, index) => {
                        let temp = {
                            key: null,
                            col_1: {
                                createdDate: (value.dateAction ? moment(value.dateAction).format(DATE_TIME_FORMAT.DD_MM_YYYY) : null) || "",
                                tripCode: value.tripCode,
                            },
                            col_2: {
                                customerCode: value.customerCode,
                                customerName: value.customerName,
                                bookingCode: value.bookingCode
                            },
                            col_3: {
                                dateIn: (value.dateIn ? moment(value.dateIn).format(DATE_TIME_FORMAT.DD_MM_YYYY) : null) || "",
                                dateOut: (value.dateOut ? moment(value.dateOut).format(DATE_TIME_FORMAT.DD_MM_YYYY) : null) || ""
                            },
                            col_4: {
                                creatorName: value.creatorName
                            },
                            col_5: {
                                countryName: value.countryName,
                                vehicleTypeCode: value.vehicleTypeCode,
                                routeName: value.routeName
                            },
                            col_6: {
                                pickupAt: value.pickupAt
                            },
                            col_7: {
                                status: value.tripStatusText
                            }
                        };
                        module.rows.push(temp);
                    });
                    break;
                case 2:
                    payload.rows.forEach((value, index) => {
                        let temp = {
                            key: null,
                            typeRow: value.typeRow,
                            col_1: {
                                dateIn: (value.dateIn ? moment(value.dateIn).format(DATE_TIME_FORMAT.DD_MM_YYYY) : null) || "",
                                bookingCode: value.bookingCode,
                                customerCode: value.customerCode,
                            },
                            col_2: {
                                dateAction: (value.dateAction ? moment(value.dateAction).format(DATE_TIME_FORMAT.DD_MM_YYYY) : null) || "",
                                vehicleTypeCode: value.vehicleTypeCode,
                                routeName: value.routeName,
                            },
                            col_3: {
                                licensePlates: value.licensePlates,
                                distance: value.distance
                            },
                            col_4: {
                                overNightCost: value.overNightCost,
                                costPerKm: value.costPerKm,
                            },
                            col_5: {
                                tangGiam: value.discount,
                                amount: value.amount
                            },
                            col_6: {
                                paymentPartner: value.paymentPartner,
                                partnerProfit: value.partnerProfit,
                            },
                            col_7: {
                                tripNote: value.tripNote
                            },
                            col_8: {
                                tripStatusText: value.tripStatusText
                            }
                        };
                        module.rows.push(temp);
                    });
                    break;
                case 3:
                    payload.rows.forEach((value, index) => {
                        let temp = {
                            key: null,
                            typeRow: value.typeRow,
                            col_1: {
                                dateIn: (value.dateIn ? moment(value.dateIn).format(DATE_TIME_FORMAT.DD_MM_YYYY) : null) || "",
                                bookingCode: value.bookingCode,
                                customerCode: value.customerCode,
                            },
                            col_2: {
                                dateAction: (value.dateAction ? moment(value.dateAction).format(DATE_TIME_FORMAT.DD_MM_YYYY) : null) || "",
                                vehicleTypeCode: value.vehicleTypeCode,
                                routeName: value.routeName,
                            },
                            col_3: {
                                licensePlates: value.licensePlates,
                                distance: value.distance
                            },
                            col_4: {
                                overNightCost: value.overNightCost,
                                costPerKm: value.costPerKm,
                            },
                            col_5: {
                                tangGiam: value.discount,
                                amount: value.amount
                            },
                            col_6: {
                                paymentPartner: value.paymentPartner,
                                partnerProfit: value.partnerProfit,
                            },
                            col_7: {
                                tripNote: value.tripNote
                            },
                            col_8: {
                                tripStatusText: value.tripStatusText
                            }
                        };
                        module.rows.push(temp);
                    });
                    break;
                case 4:
                    payload.rows.forEach((value, index) => {
                        let temp = {
                            key: null,
                            type: value.type,
                            col_1: {
                                customerCode: value.customerCode,
                                customerName: value.customerName,
                            },
                            col_2: {
                                saleName: value.saleName,
                            },
                            col_3: {
                                totalMoney: value.totalMoney,
                            },
                            col_4: {
                                debtVat: value.debtVat,
                                debtNoVat: value.debtNoVat,
                            },
                            col_5: {
                                debtInbound4c16c: (value.debtInbound4C + value.debtInbound7C + value.debtInbound10C + value.debtInbound16C),
                            },
                            col_6: {
                                debtInbound30c45c: (value.debtInbound30C + value.debtInbound35C + value.debtInbound45C),
                            },
                            col_7: {
                                debtInLand4c16c: (value.debtInLand4C + value.debtInLand7C + value.debtInLand10C + value.debtInLand16C),
                            },
                            col_8: {
                                // debtInLand30c45c: (value.debtInLand30C + value.debtInLand35C + value.debtInLand45C),
                                debtInLand30c45c: '#'
                            },
                            col_9: {
                                // debtInLand30c45c: (value.debtInLand30C + value.debtInLand35C + value.debtInLand45C),
                                debtInLand4c16c: "#"
                            },
                            col_10: {
                                // debtInLand30c45c: (value.debtInLand30C + value.debtInLand35C + value.debtInLand45C),
                                debtInLand30c45c: "#"
                            },
                            col_11: {
                                // debtInLand30c45c: (value.debtInLand30C + value.debtInLand35C + value.debtInLand45C),
                                DT_CTV: value.DT_CTV
                            }
                        };
                        module.rows.push(temp);
                    });
                    break;
                case 5:
                    payload.rows.forEach((value, index) => {
                        let temp = {
                            key: null,
                            type: value.type,
                            col_1: {
                                supplierName: value.supplierName
                            },
                            col_2: {
                                numberIndex: value.numberIndex,
                            },
                            col_3: {
                                customerName: value.customerName,
                                bookingCode: value.bookingCode,
                                tripNote: value.tripNote,
                            },
                            col_4: {
                                dateIn: (value.dateIn ? moment(value.dateIn).format(DATE_TIME_FORMAT.DD_MM_YYYY) : null) || "",
                                dateAction: (value.dateAction ? moment(value.dateAction).format(DATE_TIME_FORMAT.DD_MM_YYYY) : null) || ""
                            },
                            col_5: {
                                routeName: value.routeName,
                                vehicleRequiredType: value.vehicleRequiredType,
                            },
                            col_6: {
                                distance: value.distance
                            },
                            col_7: {
                                priceKm: value.priceKm
                            },
                            col_8: {
                                totalMoney: value.totalMoney
                            },
                            col_9: {
                                partnerKm: "#"
                            },
                            col_10: {
                                priceKmSupplier: value.priceKmSupplier
                            },
                            col_11: {
                                paymentNotVatSupplier: value.paymentNotVatSupplier
                            },
                            col_12: {
                                paymentTotalMoneySuplier: value.paymentTotalMoneySuplier
                            },
                            col_13: {
                                totalMoneyBenefitSupplier: value.totalMoneyBenefitSupplier
                            },
                            col_14: {
                                priceOverNightSuplier: value.priceOverNightSuplier
                            }
                        };
                        module.rows.push(temp);
                    });
                    break;
                case 6:
                    payload.rows.forEach((value, index) => {
                        let temp = {
                            key: null,
                            type: value.type,
                            col_1: {
                                licensePlates: value.licensePlates
                            },
                            col_2: {
                                organCode: value.organCode,
                            },
                            col_3: {
                                bookingCode: value.bookingCode
                            },
                            col_4: {
                                customerRevenue:value.customerRevenue
                            },
                            col_5: {
                                supplierMoney:value.supplierMoney
                            },
                            col_6: {
                                supplierProfit:value.supplierProfit
                            },
                            col_7: {
                                revenueHasVat:value.revenueHasVat
                            },
                            col_8: {
                                revenueHasVat4C16C: (value.revenueHasVat4C + value.revenueHasVat7C + value.revenueHasVat10C + value.revenueHasVat16C)
                            },
                            col_9: {
                                revenueHasVat30C35C: (value.revenueHasVat30C + value.revenueHasVat35C)
                            },
                            col_10: {
                                revenueHasVat45C: value.revenueHasVat45C
                            },
                            col_11: {
                                revenueSupplierHasVat: value.revenueSupplierHasVat
                            },
                            col_12: {
                                revenueNoVat: value.revenueNoVat
                            },
                            col_13: {
                                revenueNoVat4C16C: (value.revenueNoVat4C + value.revenueNoVat7C + value.revenueNoVat10C + value.revenueNoVat16C)
                            },
                            col_14: {
                                revenueNoVat30C35C: (value.revenueNoVat30C + value.revenueNoVat35C)
                            },
                            col_15: {
                                revenueNoVat45C: value.revenueNoVat45C
                            },
                            col_16: {
                                revenueSupplierNoVat: value.revenueSupplierNoVat
                            },
                            col_17: {
                                dateIn: (value.dateIn ? moment(value.dateIn).format(DATE_TIME_FORMAT.DD_MM_YYYY) : null) || "",
                                dateAction: (value.dateAction ? moment(value.dateAction).format(DATE_TIME_FORMAT.DD_MM_YYYY) : null) || ""
                            },
                            col_18: {
                                vehicleType: value.vehicleType
                            },
                            col_19: {
                                driverName:value.driverName,
                                driverName01:value.driverName01,
                            }
                        };
                        module.rows.push(temp);
                    });
                    break;
                default:
                    break;
            }

            module['param'] = payload.param;
            module['viewLoading'] = false;
            module['totalLength'] = payload.totalLength;
            module['pages'] = payload.pages;
            module['pageSize'] = payload.pageSize;
            return state
                .set(moduleName, module)
                .set('error', false);
        default:
            return state;
    }
}