export const actions = {
	GETLIST_ENTERPRISE: 'GETLIST_ENTERPRISE',
	getListEnterpirse: (data) => ({
		type: actions.GETLIST_ENTERPRISE,
		payload: {
			pageLimit: data.pageSize,
			currentPage: data.currentPage,
			orderBy: {createdAt: 1},
			searchInput: "",
			query: {
				codes: "",
				nameOrAdress: "",
				phone: "",
				email: "",
				citys: [],
				status: [],
				startDate: "",
				endDate: "",
				taxCode: "",
			}
		},
	}),
	GETLIST_ENTERPRISE_SUCCESS: 'GETLIST_ENTERPRISE_SUCCESS',
	getListEnterpirseSuccess: (data) => ({
		type: actions.GETLIST_ENTERPRISE_SUCCESS,
		payload: data
	}),

	GET_DETAIL_ITEM_ENTERPRISE: 'GET_DETAIL_ITEM_ENTERPRISE',
	getDetailItemEnterpirse: (data) => ({
		type: actions.GET_DETAIL_ITEM_ENTERPRISE,
		payload: {
			data
		}
	}),
	GET_DETAIL_ITEM_ENTERPRISE_SUCCESS: 'GET_DETAIL_ITEM_ENTERPRISE_SUCCESS',
	getDetailItemEnterpirseSuccess: (data) => ({
		type: actions.GET_DETAIL_ITEM_ENTERPRISE_SUCCESS,
		payload: data
	}),

	ON_LOADDING: 'ON_LOADDING',
	onLoadding: (data) => ({
			type: actions.ON_LOADDING,
			payload: {
					data
			}
	}),

	ON_LOADDING_FORM_UPDATE: 'ON_LOADDING_FORM_UPDATE',
	onLoaddingFormUpdate: (data) => ({
			type: actions.ON_LOADDING_FORM_UPDATE,
			payload: {
					data
			}
	}),

	ON_CREATE_ENTERPRISE: 'ON_CREATE_ENTERPRISE',
	onCreateEnterpirse: (data) => ({
		type: actions.ON_CREATE_ENTERPRISE,
		payload: {
			data
		}
	}),

	ON_UPDATE_ENTERPRISE: 'ON_UPDATE_ENTERPRISE',
	onUpdateEnterpirse: (data) => ({
		type: actions.ON_UPDATE_ENTERPRISE,
		payload: {
			data
		}
	}),

	ON_DELETE_ITEM_ENTERPRISE: 'ON_DELETE_ITEM_ENTERPRISE',
	onDeleteItemEnterpirse: (data) => ({
		type: actions.ON_DELETE_ITEM_ENTERPRISE,
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

	GET_MENU_ENTERPRISE: 'GET_MENU_ENTERPRISE',
	getMenuPrise:(data) => ({
			type: actions.GET_MENU_ENTERPRISE,
			payload: {
					data
			}
	}),

	GET_MENU_ENTERPRISE_SUCCESS: 'GET_MENU_ENTERPRISE_SUCCESS',
	getMenuPriseSuccess:(data) => ({
			type: actions.GET_MENU_ENTERPRISE_SUCCESS,
			payload: data
	}),

	GET_DETAIL_ITEM_ATTRIBUTE: 'GET_DETAIL_ITEM_ATTRIBUTE',
	getDetailItemAttribute:(data) => ({
			type: actions.GET_DETAIL_ITEM_ATTRIBUTE,
			payload: {
					data
			}
	}),
	GET_DETAIL_ITEM_ATTRIBUTE_SUCCESS: 'GET_DETAIL_ITEM_ATTRIBUTE_SUCCESS',
	getDetailItemAttributeSuccess:(data) => ({
			type: actions.GET_DETAIL_ITEM_ATTRIBUTE_SUCCESS,
			payload: data
	}),

	ON_CREATE_ORGANIZATION_ATTRIBUTE: 'ON_CREATE_ORGANIZATION_ATTRIBUTE',
	onCreateOrganizationAttribute:(data) => ({
			type: actions.ON_CREATE_ORGANIZATION_ATTRIBUTE,
			payload: {
					data
			}
	}),
};