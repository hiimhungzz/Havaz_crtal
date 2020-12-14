import React, { memo, useState, useCallback, useEffect } from "react";
import { Modal, Checkbox, Tag, Spin } from "antd";
import _ from "lodash";
import { Map } from "immutable";
import { Paper } from "@material-ui/core";
import A from "@Components/A";
import {
  PagingContainer,
  TableCell,
  CustomizeTableHeaderRow,
} from "@Components/Utility/common";
import {
  Grid,
  PagingPanel,
  Table,
  TableColumnReordering,
  TableGroupRow,
} from "@devexpress/dx-react-grid-material-ui";
import {
  IntegratedPaging,
  IntegratedGrouping,
  PagingState,
  GroupingState,
} from "@devexpress/dx-react-grid";
import {
  calculatePageInfo,
  calculateTotalPage,
  checkMoment,
} from "helpers/utility";
import { DATE_TIME_FORMAT, CONTRACT_TYPE } from "constants/common";
import { Ui } from "@Helpers/Ui";
import ServiceBase from "@Services/ServiceBase";
const Cell = ({ ...restProps }) => {
  const { column, value, row } = restProps;
  if (column.name === "contractNumber") {
    return (
      <TableCell
        {...restProps}
        value={
          <A
            title="Xem chi tiết hợp đồng"
            onClick={(e) => {
              e.preventDefault();
              window.open(
                `/contractManagement?contractId=${row["uuid"]}&contractNumber=${value}`,
                "_blank"
              );
            }}
          >
            {value}
          </A>
        }
      />
    );
  }
  return <TableCell {...restProps} />;
};
let timer = null;
const ContractList = memo(({ corporateId, onShowContractModal }) => {
  const [gridConfig] = useState({
    columns: [
      {
        name: "id",
        title: "#",
      },
      {
        name: "contractNumber",
        title: "SỐ HỢP ĐỒNG",
      },
      {
        name: "fixedRouteName",
        title: "TUYẾN ĐƯỜNG",
      },
      {
        name: "duration",
        title: "THỜI HẠN",
      },
      {
        name: "signatureDate",
        title: "NGÀY KÍ",
      },
      {
        name: "vehicleTypeName",
        title: "LOẠI XE - SỐ XE",
      },
      {
        name: "contractType",
        title: "LOẠI HỢP ĐỒNG",
      },
    ],
    order: [
      "id",
      "contractNumber",
      "fixedRouteName",
      "duration",
      "signatureDate",
      "vehicleTypeName",
      "contractType",
    ],
    tableMessages: { noData: "Không có hợp đồng" },
    rowsPerPage: "Số bản ghi trên mỗi trang",
    columnExtensions: [
      { columnName: "id", wordWrapEnabled: true, width: 50 },
      { columnName: "contractNumber", wordWrapEnabled: true, width: 150 },
      { columnName: "signatureDate", wordWrapEnabled: true, width: 90 },
      { columnName: "fixedRouteName", wordWrapEnabled: true },
      { columnName: "duration", width: 80, wordWrapEnabled: true },
      { columnName: "vehicleTypeName", wordWrapEnabled: true, width: 200 },
      { columnName: "contractType", width: 130 },
    ],
  });
  const [contracts, setContracts] = useState(
    Map({
      data: [],
      totalLength: 0,
      totalPages: 0,
      currentPage: 0,
      pageLimit: 5,
    })
  );
  const [browseContractFetching, setBrowseContractFetching] = useState(false);
  const [grouping, setGrouping] = useState([{ columnName: "contractNumber" }]);
  const [param, setParam] = useState(
    Map({
      pageLimit: 100,
      currentPage: 0,
      searchInput: "",
      orderBy: { createdAt: 1 },
      query: Map({
        organizationId: "",
      }),
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
  useEffect(() => {
    if (corporateId) {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        setBrowseContractFetching(true);
        let jsParam = param.toJS();
        _.set(jsParam, "query.organizationId", corporateId);
        let result = await ServiceBase.requestJson({
          method: "GET",
          url: "/contract/list",
          data: jsParam,
        });
        if (result.hasErrors) {
          Ui.showErrors(result.errors);
        } else {
          setContracts((prevState) => {
            let nextState = prevState;
            let totalPages = calculateTotalPage(
              result.value.totalLength,
              _.get(jsParam, "pageLimit")
            );
            nextState = nextState.set(
              "totalLength",
              _.parseInt(_.get(result, "value.totalLength"))
            );
            nextState = nextState.set(
              "currentPage",
              _.get(jsParam, "currentPage")
            );
            nextState = nextState.set("pageLimit", _.get(jsParam, "pageLimit"));
            nextState = nextState.set("totalPages", totalPages);
            let data = [];
            _.forEach(_.get(result, "value.data"), (x, xId) => {
              _.forEach(_.get(x, "cost", []), (y, yId) => {
                data.push({
                  ...x,
                  ...y,
                  id: yId + 1,
                  signatureDate: checkMoment(x.signatureDate).format(
                    DATE_TIME_FORMAT.DD_MM_YYYY
                  ),
                  contractType: CONTRACT_TYPE[x.contractType],
                  duration: `${_.get(x, "duration", 0)} tháng`,
                  vehicleTypeName: `${_.get(y, "vehicleTypeName", "")} - ${
                    _.get(y, "numberVehicle")
                      ? `${_.get(y, "numberVehicle")} xe`
                      : ""
                  }`,
                });
              });
            });
            let groupedData = _.groupBy(data, (x) => x.contractNumber);
            let totalRows = _.keysIn(groupedData).length;
            _.forEach(groupedData, (x) => {
              totalRows += x.length;
            });
            nextState = nextState.set("data", data);
            nextState = nextState.set("totalRows", totalRows);
            return nextState;
          });
        }
        setBrowseContractFetching(false);
      }, 500);
    }
  }, [corporateId, param]);
  return (
    <Spin spinning={browseContractFetching} tip="Đang lấy dữ liệu">
      <Paper variant="outlined" square>
        <Grid rows={contracts.get("data")} columns={gridConfig.columns}>
          <GroupingState grouping={grouping} onGroupingChange={setGrouping} />
          <IntegratedGrouping />
          <PagingState
            currentPage={contracts.get("currentPage")}
            pageSize={contracts.get("totalRows")}
          />
          <IntegratedPaging />
          <Table
            messages={gridConfig.tableMessages}
            columnExtensions={gridConfig.columnExtensions}
            cellComponent={(props) => Cell(props)}
            stubHeaderCellComponent={(props) => (
              <Table.StubHeaderCell
                {...props}
                style={{ ...props.style, background: "#f2f3f8" }}
              />
            )}
          />
          <TableColumnReordering order={gridConfig.order} />
          <CustomizeTableHeaderRow />
          <TableGroupRow />
          <PagingPanel
            messages={{
              info: calculatePageInfo(
                contracts.get("currentPage"),
                contracts.get("pageLimit"),
                contracts.get("totalLength")
              ),
              rowsPerPage: gridConfig.rowsPerPage,
            }}
            containerComponent={props => (
              <PagingContainer
                {...props}
                onCurrentPageChange={_onChangeCurrentPage}
                onPageSizeChange={_onChangePageSize}
                pageSize={contracts.get('pageLimit')}
                totalCount={contracts.get('totalLength')}
                currentPage={contracts.get('currentPage')}
              />
            )}
          />
        </Grid>
      </Paper>
    </Spin>
  );
});
export default ContractList;
