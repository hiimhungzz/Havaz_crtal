import React, { memo, useState, useEffect, useCallback } from "react";
import { Spin, Modal, Button } from "antd";
import _ from "lodash";
import { Paper, Grid as CoreGrid } from "@material-ui/core";
import {
  Grid,
  Table,
  TableGroupRow,
  TableColumnReordering,
  PagingPanel,
  TableBandHeader,
  TableHeaderRow,
} from "@devexpress/dx-react-grid-material-ui";
import {
  PagingState,
  IntegratedPaging,
  GroupingState,
  IntegratedGrouping,
} from "@devexpress/dx-react-grid";
import {
  CustomizeTableHeaderRow,
  PagingContainer,
  TableCell,
} from "components/Utility/common";
import { Ui } from "@Helpers/Ui";
import ServiceBase from "@Services/ServiceBase";
import Cell from "./../Cell/index";
import ModalChilder from "./../Modal/index";
const quanlityTotalList = memo(({ currentPage, pageSize, setParams, gird,loading }) => {
  const [show, setShow] = useState(false);
  const [uuidTrip, setUuidTrip] = useState("");
  const [typeStation, setTypeStation] = useState("");
  const handleCancel = () => {
    setShow(false);
  };
  return (
    <>
      <Modal
        width="80%"
        visible={show}
        title="Kết quả chi tiết"
        onCancel={handleCancel}
        destroyOnClose
        footer={[
          <Button type="primary" key="back" onClick={handleCancel}>
            Xác nhận
          </Button>,
        ]}
      >
        <ModalChilder uuidTrip= {uuidTrip} typeStation={typeStation}></ModalChilder>
      </Modal>
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
      <Paper variant="outlined" square>
        <Grid
          rows={gird.get("data")}
          columns={[
            {
              name: "id",
              title: "#",
            },
            {
              name: "pickUpAt",
              title: "NGÀY",
            },
            {
              name: "nameFixedRoute",
              title: "TUYẾN ĐƯỜNG",
            },
            {
              name: "plateVehicle",
              title: "BKS",
            },
            {
              name: "nameDriver",
              title: "LÁI XE",
            },
            {
              name: "typeStationText",
              title: "LOẠI ĐÁNH GIÁ",
            },
            {
              name: "totalRequire",
              title: "SỐ LỖI BẮT BUỘC",
            },
            {
              name: "totalCondition",
              title: "SỐ LỖI ĐIỀU KIỆN",
            },
            {
              name: "totalNotRequire",
              title: "SỐ LỖI KHÔNG BẮT BUỘC",
            },

            {
              name: "surveyDate",
              title: "THỜI GIAN ĐÁNH GIÁ",
            },

            {
              name: "nameSurvey",
              title: "NGƯỜI ĐÁNH GIÁ",
            },
          ]}
        >
          <PagingState defaultCurrentPage={0} pageSize={5} />
          <Table
            columnExtensions={[
              { columnName: "id", wordWrapEnabled: true, width: 50 },
              { columnName: "pickUpAt", wordWrapEnabled: true, width: 80 },
              { columnName: "nameFixedRoute", wordWrapEnabled: true },
              { columnName: "plateVehicle", wordWrapEnabled: true, width: 100 },
              { columnName: "nameDriver", wordWrapEnabled: true },
              { columnName: "typeStationText ", wordWrapEnabled: true },
              {
                columnName: "totalRequire",
                wordWrapEnabled: true,
                width: 100,
                align:'right'
              },
              {
                columnName: "totalNotRequire",
                wordWrapEnabled: true,
                width: 100,
                align:'right'
              },
              {
                columnName: "totalCondition",
                wordWrapEnabled: true,
                width: 100,
                align:'right'
              },
              { columnName: "surveyDate", wordWrapEnabled: true, width: 200 },
              { columnName: "nameSurvey", wordWrapEnabled: true, width: 150 },
            ]}
            cellComponent={(props) => Cell({ props, setShow ,setUuidTrip,setTypeStation})}
          />
          <TableColumnReordering />
          <TableHeaderRow
            cellComponent={(props) => (
              <TableHeaderRow.Cell
                {...props}
                style={{
                  ...props.style,
                  background: "#f2f3f8",
                  textAlign: "center",
                }}
              />
            )}
            //   contentComponent={TableHeaderContent}
          />

          <PagingState
            currentPage={gird.get("pages")}
            pageSize={gird.get("pageSize")}
          />
          <IntegratedPaging />
          <PagingPanel
            messages={{
              info: `1-${gird.get("pageSize")} của ${parseInt(gird.get("totalLength"))}`,
              rowsPerPage: "Số bản ghi trên mỗi trang",
            }}
            containerComponent={(props) => (
              <PagingContainer
                {...props}
                pageSizes={[5, 10, 15]}
                pageSize={gird.get("pageSize")}
                totalCount={gird.get("totalLength")}
                currentPage={currentPage}
                totalPages={
                  gird.get("totalLength") % gird.get("pageSize") > 0
                    ? parseInt(gird.get("totalLength") / gird.get("pageSize")) +
                      1
                    : gird.get("totalLength") / gird.get("pageSize")
                }
                onCurrentPageChange={(page) => {
                  setParams((prevState) => {
                    const nextState = { ...prevState };
                    nextState.pages = page;
                    return nextState;
                  });
                }}
                onPageSizeChange={(size) => {
                  setParams((prevState) => {
                    const nextState = { ...prevState };
                    nextState.pageSize = size;
                    return nextState;
                  });
                }}
              />
            )}
          />
        </Grid>
      </Paper>
      </Spin>
    </>
  );
});
export default quanlityTotalList;
