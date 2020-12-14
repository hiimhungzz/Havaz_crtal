import React, { memo, useState, useCallback, useEffect } from "react";
import { Paper } from "@material-ui/core";
import {
  PagingContainer,
  CustomizeTableHeaderRow,
  CustomizeTableBandHeader,
  TableCell,
} from "components/Utility/common";
import {
  Grid,
  PagingPanel,
  Table,
  TableColumnReordering,
} from "@devexpress/dx-react-grid-material-ui";
import { IntegratedPaging, PagingState } from "@devexpress/dx-react-grid";
import {
  calculatePageInfo,
  calculateTotalPage,
  checkMoment,
} from "helpers/utility";
import { Ui } from "@Helpers/Ui";
import { Spin } from "antd";
import ServiceBase from "@Services/ServiceBase";
import _ from "lodash";
import { Map } from "immutable";
import { DATE_TIME_FORMAT } from "constants/common";
import moment from "moment";
let loadDataTimer = null;
const Cell = ({ ...restProps }) => {
  if (restProps.column.name === "kmExceed") {
    return (
      <TableCell
        {...restProps}
        value={restProps.value > 0 ? restProps.value : ""}
      />
    );
  }
  return <TableCell {...restProps} />;
};

const CorporateReconciliationList = memo(({ contractId, contractParam }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [gridConfig] = useState({
    columns: [
      {
        name: "date",
        title: "NGÀY",
      },
      {
        name: "contractNumber",
        title: "SỐ HĐ",
      },
      {
        name: "fixedRouteName",
        title: "TUYẾN ĐƯỜNG",
      },
      {
        name: "plate",
        title: "BKS",
      },
      {
        name: "km",
        title: "KM",
      },
      {
        name: "kmExceed",
        title: "VƯỢT",
      },
      {
        name: "kmBegin",
        title: "ĐẦU",
      },
      {
        name: "kmFinish",
        title: "CUỐI",
      },
      {
        name: "timePickUp",
        title: "B.ĐẦU",
      },
      {
        name: "timeDropOff",
        title: "K.THÚC",
      },
      {
        name: "timeExceed",
        title: "OT",
      },
      {
        name: "extraTurnPrice",
        title: "CHI PHÍ LƯỢT",
      },
    ],
    tableMessages: { noData: "Không có dữ liệu đối soát" },
    order: [
      "contractNumber",
      "date",
      "fixedRouteName",
      "plate",
      "driverName",
      "km",
      "kmExceed",
      "kmBegin",
      "kmFinish",
      "timePickUp",
      "timeDropOff",
      "timeExceed",
      "extraTurnPrice",
    ],
    rowsPerPage: "Số bản ghi trên mỗi trang",
    columnExtensions: [
      { columnName: "contractNumber", wordWrapEnabled: true, width: 150 },
      { columnName: "date", wordWrapEnabled: true, width: 100 },
      { columnName: "fixedRouteName", wordWrapEnabled: true },
      {
        columnName: "plate",
        width: 100,
        wordWrapEnabled: true,
        align: "center",
      },
      {
        columnName: "extraTurnPrice",
        width: 100,
        wordWrapEnabled: true,
        align: "right",
      },
      { columnName: "km", width: 60, wordWrapEnabled: true, align: "center" },
      {
        columnName: "kmExceed",
        width: 60,
        wordWrapEnabled: true,
        align: "center",
      },
      {
        columnName: "kmBegin",
        width: 60,
        wordWrapEnabled: true,
        align: "center",
      },
      {
        columnName: "kmFinish",
        width: 60,
        wordWrapEnabled: true,
        align: "center",
      },
      {
        columnName: "timeExceed",
        width: 60,
        wordWrapEnabled: true,
        align: "center",
      },
      {
        columnName: "timePickUp",
        width: 80,
        wordWrapEnabled: true,
        align: "center",
      },
      {
        columnName: "timeDropOff",
        width: 80,
        wordWrapEnabled: true,
        align: "center",
      },
    ],
    columnBands: [
      {
        title: "KM THỰC HIỆN",
        children: [
          { columnName: "km" },
          { columnName: "kmExceed" },
          { columnName: "kmBegin" },
          { columnName: "kmFinish" },
        ],
      },
      {
        title: "THỜI GIAN THỰC HIỆN",
        children: [
          { columnName: "timePickUp" },
          { columnName: "timeDropOff" },
          { columnName: "timeExceed" },
        ],
      },
    ],
  });
  const [param, setParam] = useState(
    Map({
      pageLimit: 5,
      currentPage: 0,
      searchInput: "",
      orderBy: { createdAt: 1 },
      query: {
        contractId: "",
      },
    })
  );
  const [grid, setGrid] = useState(
    Map({
      data: [],
      totalLength: 0,
      currentPage: 0,
      pageLimit: 5,
    })
  );
  const _onChangePageSize = useCallback(
    (pageSize) => {
      setParam((prevState) => {
        let nextState = prevState;
        nextState = nextState.set("pageLimit", pageSize);
        nextState = nextState.set("currentPage", 0);
        return nextState;
      });
    },
    [setParam]
  );
  const _onChangeCurrentPage = useCallback(
    (currentPage) => {
      setParam((prevState) => {
        let nextState = prevState;
        nextState = nextState.set("currentPage", currentPage);
        return nextState;
      });
    },
    [setParam]
  );
  const browseCorporateReconcilication = useCallback(async () => {
    setIsFetching(true);
    let jsParam = param.toJS();
    let jsContractParam = contractParam.toJS();
    let data = {
      contractId: contractId,
      routes: _.map(_.get(jsContractParam, "query.routes"), (x) =>
        _.get(x, "key")
      ),
      startDate: _.get(jsContractParam, "query.date", null)
        ? _.get(jsContractParam, "query.date").clone().startOf("month")
        : null,
      endDate: _.get(jsContractParam, "query.date", null)
        ? _.get(jsContractParam, "query.date").clone().endOf("month")
        : null,
      vehicleTypes: _.map(_.get(jsContractParam, "query.vehicleTypes"), (x) =>
        _.get(x, "key")
      ),
      vehicles: _.map(_.get(jsContractParam, "query.vehicles"), (x) =>
        _.get(x, "key")
      ),
    };
    _.set(jsParam, "query", data);
    let result = await ServiceBase.requestJson({
      method: "GET",
      url: "/customer/reconciliations/list",
      data: jsParam,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setGrid((prevState) => {
        let nextState = prevState;
        let totalPages = calculateTotalPage(
          result.value.totalLength,
          param.get("pageLimit")
        );
        nextState = nextState.set(
          "totalLength",
          _.parseInt(result.value.totalLength)
        );
        nextState = nextState.set("currentPage", param.get("currentPage"));
        nextState = nextState.set("pageLimit", param.get("pageLimit"));
        nextState = nextState.set("totalPages", totalPages);
        let data = _.map(_.get(result, "value.data", []), (item) => {
          item.date = item.date
            ? checkMoment(item.date).format(DATE_TIME_FORMAT.DD_MM_YYYY)
            : null;
          item.timeDropOff = item.timeDropOff
            ? moment(item.timeDropOff, "hh:mm:ss").format(
                DATE_TIME_FORMAT.HH_MM
              )
            : null;
          item.timePickUp = item.timePickUp
            ? moment(item.timePickUp, "hh:mm:ss").format(DATE_TIME_FORMAT.HH_MM)
            : null;
          item.extraTurnPrice = _.replace(
            item.extraTurnPrice,
            /\B(?=(\d{3})+(?!\d))/g,
            ","
          );
          return item;
        });
        nextState = nextState.set(
          "data",
          _.orderBy(data, ["date", "fixedRouteName", "plate"])
        );
        return nextState;
      });
    }
    setIsFetching(false);
  }, [contractId, param, contractParam]);

  // Load data
  useEffect(() => {
    clearTimeout(loadDataTimer);
    loadDataTimer = setTimeout(browseCorporateReconcilication, 300);
  }, [browseCorporateReconcilication]);
  return (
    <Spin spinning={isFetching} tip="Đang lấy dữ liệu...">
      <Paper variant="outlined" square>
        <Grid rows={grid.get("data")} columns={gridConfig.columns}>
          {/* <GroupingState grouping={grouping} onGroupingChange={setGrouping} /> */}
          {/* <IntegratedGrouping /> */}
          <PagingState
            currentPage={grid.get("currentPage")}
            pageSize={grid.get("pageLimit")}
          />
          <IntegratedPaging />
          <Table
            messages={gridConfig.tableMessages}
            columnExtensions={gridConfig.columnExtensions}
            stubHeaderCellComponent={(props) => (
              <Table.StubHeaderCell
                {...props}
                style={{ ...props.style, background: "#f2f3f8" }}
              />
            )}
            cellComponent={(props) => Cell(props)}
          />
          <TableColumnReordering order={gridConfig.order} />
          <CustomizeTableHeaderRow />
          {/* <TableGroupRow /> */}
          <CustomizeTableBandHeader columnBands={gridConfig.columnBands} />
          <PagingPanel
            messages={{
              info: calculatePageInfo(
                grid.get("currentPage"),
                grid.get("pageLimit"),
                grid.get("totalLength")
              ),
              rowsPerPage: gridConfig.rowsPerPage,
            }}
            containerComponent={(props) => (
              <PagingContainer
                {...props}
                onCurrentPageChange={_onChangeCurrentPage}
                onPageSizeChange={_onChangePageSize}
                pageSize={grid.get("pageLimit")}
                totalCount={grid.get("totalLength")}
                currentPage={grid.get("currentPage")}
              />
            )}
          />
        </Grid>
      </Paper>
    </Spin>
  );
});
export default CorporateReconciliationList;
