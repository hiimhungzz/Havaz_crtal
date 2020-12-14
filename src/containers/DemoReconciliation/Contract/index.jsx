import React, {
  memo,
  useState,
  useEffect,
  useCallback,
  useReducer,
} from "react";
import { Spin, Collapse, Icon } from "antd";
import _ from "lodash";
import { withStyles } from "@material-ui/core/styles";
import { Ui } from "@Helpers/Ui";
import Portlet from "@Components/Portlet";
import PortletBody from "@Components/Portlet/PortletBody";
import { Map } from "immutable";
import downloadFile from "@Components/Utility/downloadFile";
import { APP_MODULE } from "@Constants/common";
import ServiceBase from "@Services/ServiceBase";
import { APP_PARAM } from "@Constants";
import { URI, ACTION } from "./constants";
import { $LocalStorage } from "@Helpers/localStorage";
import { Grid } from "@material-ui/core";
import Helmet from "react-helmet";
import Filter from "./Filter";
import List from "./List";
import CorporateReconciliationList from "./CorporateList";
import { compose } from "recompose";
import { isEmpty } from "helpers/utility";
let loadDataTimer = null;

const customPanelStyle = {
  background: "whitesmoke",
  borderRadius: 4,
  marginBottom: 10,
  border: 0,
  overflow: "hidden",
};
const ContractReconciliation = ({ appParam }) => {
  const [isFetching, setIsFetching] = useState(false);
  /**
   * Reducer của ContractReconciliation
   * @param {*} state Trạng thái hiện tại
   * @param {*} action Action được dispatch
   */
  const reducer = (state, action) => {
    let nextState = state;
    let payload = action.payload;
    switch (action.type) {
      case ACTION.SET_PARAM:
        return nextState.setIn(["query", payload.name], payload.value);
      case ACTION.CLEAR_PARAM:
        nextState = nextState.setIn(["currentPage"], 0);
        nextState = nextState.setIn(["query", "contract"], undefined);
        nextState = nextState.setIn(["query", "routes"], undefined);
        nextState = nextState.setIn(["query", "date"], undefined);
        nextState = nextState.setIn(["query", "vehicleTypes"], undefined);
        nextState = nextState.setIn(["query", "vehicles"], undefined);
        nextState = nextState.setIn(["query", "drivers"], undefined);
        return nextState;
      default:
        throw new Error();
    }
  };
  const [param, dispatch] = useReducer(
    reducer,
    Map({
      pageLimit: 5,
      currentPage: 0,
      searchInput: "",
      orderBy: { createdAt: 1 },
      ...appParam,
      query: Map(
        _.get(appParam, "query", {
          contract: undefined,
          routes: undefined,
          date: undefined,
          vehicleTypes: undefined,
          vehicles: undefined,
          drivers: undefined,
        })
      ),
    })
  );

  const _handleSetParam = useCallback(
    (payload) => {
      dispatch({ type: ACTION.SET_PARAM, payload });
    },
    [dispatch]
  );
  const _handleClearParam = useCallback(
    (payload) => {
      dispatch({ type: ACTION.CLEAR_PARAM, payload });
    },
    [dispatch]
  );
  const [grid, setGrid] = useState(
    Map({
      data: [],
      totalLength: 0,
      currentPage: 0,
      pageLimit: 5,
    })
  );

  /**
   * Lấy dữ liệu Contract Reconcilication
   */
  const browseContractReconcilication = useCallback(async () => {
    if (param.getIn(["query", "contract", "key"])) {
      setIsFetching(true);
      let jsParam = param.toJS();
      let data = {
        contractId: _.get(jsParam, "query.contract.key", ""),
        query: {
          routes: _.map(_.get(jsParam, "query.routes"), (x) => _.get(x, "key")),
          startDate: _.get(jsParam, "query.date", null)
            ? _.get(jsParam, "query.date").clone().startOf("month")
            : null,
          endDate: _.get(jsParam, "query.date", null)
            ? _.get(jsParam, "query.date").clone().endOf("month")
            : null,
          vehicleTypes: _.map(_.get(jsParam, "query.vehicleTypes"), (x) =>
            _.get(x, "key")
          ),
          vehicles: _.map(_.get(jsParam, "query.vehicles"), (x) =>
            _.get(x, "key")
          ),
          drivers: _.map(_.get(jsParam, "query.drivers"), (x) =>
            _.get(x, "key")
          ),
        },
      };
      _.set(jsParam, "query", data);
      let result = await ServiceBase.requestJson({
        method: "GET",
        url: URI.BROWSE_CONTRACT_RECONCILIATION,
        data: data,
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        let tempAppParam = isEmpty($LocalStorage.sls.getObject(APP_PARAM), {});
        _.set(tempAppParam, APP_MODULE.CONTRACT_RECONCILIATION, param.toJS());
        $LocalStorage.sls.setObject(APP_PARAM, tempAppParam);
        setGrid((prevState) => {
          let nextState = prevState;
          nextState = nextState.set(
            "data",
            _.map(_.get(result, "value.data", []), (item, itemId) => {
              item.id = itemId + 1;
              item.unit = "LƯỢT";
              item.extraTurnPrice = _.replace(
                item.extraTurnPrice,
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              );
              item.extraOTPrice = _.replace(
                item.extraOTPrice,
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              );
              item.extraHolidayPrice = _.replace(
                item.extraHolidayPrice,
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              );
              item.totalPrice = _.replace(
                item.totalPrice,
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              );
              item.monthlyPrice = _.replace(
                item.monthlyPrice,
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              );
              return item;
            })
          );
          return nextState;
        });
      }
      setIsFetching(false);
    } else {
      setGrid((prevState) => prevState.set("data", []));
    }
  }, [param]);

  const onExportExcel = useCallback(async () => {
    if (param.getIn(["query", "contract", "key"])) {
      let jsParam = param.toJS();
      let data = {
        contractId: _.get(jsParam, "query.contract.key", ""),
        query: {
          routes: _.map(_.get(jsParam, "query.routes"), (x) => _.get(x, "key")),
          startDate: _.get(jsParam, "query.date", null)
            ? _.get(jsParam, "query.date").clone().startOf("month")
            : null,
          endDate: _.get(jsParam, "query.date", null)
            ? _.get(jsParam, "query.date").clone().endOf("month")
            : null,
          vehicleTypes: _.map(_.get(jsParam, "query.vehicleTypes"), (x) =>
            _.get(x, "key")
          ),
          vehicles: _.map(_.get(jsParam, "query.vehicles"), (x) =>
            _.get(x, "key")
          ),
          drivers: _.map(_.get(jsParam, "query.drivers"), (x) =>
            _.get(x, "key")
          ),
        },
      };
      _.set(jsParam, "query", data);
      let result = await ServiceBase.requestJson({
        method: "GET",
        url: URI.BROWSE_CONTRACT_RECONCILIATION,
        data: {
          ...data,
          result: "excel",
        },
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        downloadFile(result.value, "Đối soát theo hợp đồng");
        Ui.showSuccess({ message: "Xuất Excel thành công" });
      }
    } else {
      // setGrid((prevState) => prevState.set("data", []));
    }
  }, [param]);

  // Load data
  useEffect(() => {
    clearTimeout(loadDataTimer);
    loadDataTimer = setTimeout(browseContractReconcilication, 500);
  }, [browseContractReconcilication]);
  return (
    <Grid container spacing={3}>
      <Helmet title="ĐỐI SOÁT HỢP ĐỒNG">
        <meta name="description" content="Đối soát hợp đồng - Car Rental" />
      </Helmet>
      <Grid item xs={12}>
        <Portlet className="mb-0">
          <Filter
            onExportExcel={onExportExcel}
            onSetParam={_handleSetParam}
            onClearParam={_handleClearParam}
            query={param.get("query")}
          />
          <PortletBody className="pt-0">
            <Collapse
              bordered={false}
              defaultActiveKey={["1"]}
              expandIcon={({ isActive }) => (
                <Icon type="caret-right" rotate={isActive ? 90 : 0} />
              )}
            >
              <Collapse.Panel
                header={<span>Tổng hợp</span>}
                key="1"
                style={customPanelStyle}
              >
                <Spin spinning={isFetching} tip="Đang lấy dữ liệu...">
                  <List grid={grid} onSetParam={_handleSetParam} contract={param.getIn(["query", "contract"])}/>
                </Spin>
              </Collapse.Panel>
              {grid.get("data").length > 0 && (
                <Collapse.Panel
                  header="Chi tiết"
                  key="2"
                  style={customPanelStyle}
                >
                  <CorporateReconciliationList
                    contractParam={param}
                    contractId={param.getIn(["query", "contract", "key"])}
                  />
                </Collapse.Panel>
              )}
            </Collapse>
          </PortletBody>
        </Portlet>
      </Grid>
    </Grid>
  );
};
export default compose(withStyles({}), memo)(ContractReconciliation);
