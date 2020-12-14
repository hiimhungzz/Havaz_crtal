import {
	Map
} from 'immutable';
import {
	actions
} from './acions';
import {
	checkStatus,
	appParam,
	formatDateTime
} from "../../helpers/utility";
import {
	STATUS,
	APP_MODULE
} from "../../constants/common";
const initState = new Map({
	listEnterprise: [],
	gridEnterprise: [],
	totalLength: 0,
	pageLimit: 5,
	currentPage: 0,
	loading: false,
	listCity: [],
	itemRead: undefined,
	loaddingFormUpdate: false,
	organizationsAttributeRead: undefined // truong hop update fix tam ne hihihi
});

export default function reducer(state = initState, action) {
	let listEnterprise = [];
	let gridEnterprise = [];
	switch (action.type) {
		case actions.GETLIST_ENTERPRISE_SUCCESS:
			listEnterprise = action.payload.data;
			listEnterprise.forEach((value, index) => {
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
							parentName: value.parentName || 0,
							name: value.name || 0
					},
					col_8: {
							lastOrder: value.lastOrder ? value.lastOrder : ''
					},
					col_9: {
							status: checkStatus(value.status),
							color: STATUS.find(x => x.value === value.status) ? STATUS.find(x => x.value === value.status).color : 'red',
							icon: STATUS.find(x => x.value === value.status) ? STATUS.find(x => x.value === value.status).icon : 'fa-question-circle'
					},
					col_11: {
							refCode: value.refCode
					},
					col_10: {
							action: [{
									name: "Xem chi tiết",
									icon: "fa-eye",
									handle: "onShowDetailItem"
							}, {
									name: "Xóa",
									icon: "fa-trash",
									handle: "onDeleteItem"
							}, ]
					}
			};
				gridEnterprise.push(temp);
			});
			return state
				.set('listEnterprise', listEnterprise)
				.set('gridEnterprise', gridEnterprise)
				.set('totalLength', action.payload.totalLength)
		case actions.GET_DETAIL_ITEM_ENTERPRISE_SUCCESS:
			return state
					.set('itemRead', action.payload.data);
		case actions.ONCHANGE_CURRENTPAGE:
			return state
					.set('currentPage', action.payload.data);
		case actions.ONSET_PAGESIZE:
			return state
					.set('pageLimit', action.payload.data);
		case actions.ON_LOADDING:
			const loadding = action.payload.data;
			return state
					.set('loading', loadding)
		case actions.ON_LOADDING_FORM_UPDATE:
			const loaddingFormUpdate = action.payload.data;
			return state
					.set('loaddingFormUpdate', loaddingFormUpdate)
		case actions.GET_MENU_ENTERPRISE_SUCCESS:
			const organizationsAttribute = action.payload;
			return state
					.set('organizationsAttribute', organizationsAttribute)
		case actions.GET_DETAIL_ITEM_ATTRIBUTE_SUCCESS:
			const organizationsAttributeRead = action.payload;
			return state
					.set('organizationsAttributeRead', organizationsAttributeRead)
		default:
			return state;
	}
}