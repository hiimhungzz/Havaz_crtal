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
const totalLength = 10;
const quanlityTotalList = memo(({ currentPage, pageSize, setParams }) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState([
    {
      id: "1",
      date: "30-03-2020",
      plate: "HĐ-52654",
      fixedRouteName: "Hưng yên - Bắc giang",
      driverName: "Bắc giang",
      typeEvalute: "Đánh giá xuất bến",
      numberErrorObligatory: "2",
      numberErrorDk: "10",
      numberErrorNoObligatory: "99",
      timeEvalute: "01/02/2020 07:50",
      nameEvalute: "Đào Sơn",
    },
    {
      id: "2",
      date: "30-03-2020",
      plate: "HĐ-52654",
      fixedRouteName: "Hưng yên - Bắc giang",
      driverName: "Hưng yên",
      typeEvalute: "Đánh giá xuất bến",
      numberErrorObligatory: "2",
      numberErrorDk: "10",
      numberErrorNoObligatory: "99",
      timeEvalute: "01/02/2020 07:50",
      nameEvalute: "Vũ Minh",
    },
    {
      id: "3",
      date: "31-03-2020",
      plate: "HĐ-52654",
      fixedRouteName: "Hưng yên - Bắc giang",
      driverName: "Hưng yên",
      typeEvalute: "Đánh giá xuất bến",
      numberErrorObligatory: "2",
      numberErrorDk: "10",
      numberErrorNoObligatory: "99",
      timeEvalute: "01/02/2020 07:50",
      nameEvalute: "Vũ Minh",
    },
    {
      id: "4",
      date: "31-03-2020",
      plate: "HĐ-52654",
      fixedRouteName: "Hưng yên - Bắc giang",
      driverName: "Hưng yên",
      typeEvalute: "Đánh giá xuất bến",
      numberErrorObligatory: "2",
      numberErrorDk: "10",
      numberErrorNoObligatory: "99",
      timeEvalute: "01/02/2020 07:50",
      nameEvalute: "Vũ Minh",
    },
  ]);

  useEffect(() => {});
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
        <ModalChilder></ModalChilder>
      </Modal>
      {/* <Spin> */}
      <Paper variant="outlined" square>
        <Grid
          rows={data}
          columns={[
            {
              name: "id",
              title: "#",
            },
            {
              name: "date",
              title: "NGÀY",
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
              name: "driverName",
              title: "",
            },
            {
              name: "typeEvalute",
              title: "LOẠI ĐÁNH GIÁ",
            },
            {
              name: "numberErrorObligatory",
              title: "SỐ LỖI BẮT BUỘC",
            },
            {
              name: "numberErrorDk",
              title: "SỐ LỖI ĐIỀU KIỆN",
            },
            {
              name: "numberErrorNoObligatory",
              title: "SỐ LỖI KHÔNG BẮT BUỘC",
            },

            {
              name: "timeEvalute",
              title: "THỜI GIAN ĐÁNH GIÁ",
            },

            {
              name: "nameEvalute",
              title: "NGƯỜI ĐÁNH GIÁ",
            },
          ]}
        >
          <PagingState defaultCurrentPage={0} pageSize={5} />
          <Table
            columnExtensions={[
              { columnName: "id", wordWrapEnabled: true, width: 50 },
              { columnName: "date", wordWrapEnabled: true, width: 80 },
              { columnName: "fixedRouteName", wordWrapEnabled: true },
              { columnName: "plate", wordWrapEnabled: true, width: 100 },
              { columnName: "driverName", wordWrapEnabled: true },
              { columnName: "typeEvalute", wordWrapEnabled: true },
              {
                columnName: "numberErrorDk",
                wordWrapEnabled: true,
                width: 100,
              },
              {
                columnName: "numberErrorNoObligatory",
                wordWrapEnabled: true,
                width: 100,
              },
              {
                columnName: "numberErrorObligatory",
                wordWrapEnabled: true,
                width: 100,
              },
              { columnName: "timeEvalute", wordWrapEnabled: true, width: 200 },
              { columnName: "nameEvalute", wordWrapEnabled: true, width: 150 },
            ]}
            cellComponent={(props,index) => Cell({ props, setShow,index })}
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

          <PagingState currentPage={currentPage} pageSize={pageSize} />
          <IntegratedPaging />
          <PagingPanel
            messages={{
              info: `1-${pageSize} của ${parseInt(totalLength)}`,
              rowsPerPage: "Số bản ghi trên mỗi trang",
            }}
            containerComponent={(props) => (
              <PagingContainer
                {...props}
                pageSizes={[5, 10, 15]}
                pageSize={pageSize}
                totalCount={totalLength}
                currentPage={currentPage}
                totalPages={
                  totalLength % pageSize > 0
                    ? parseInt(totalLength / pageSize) + 1
                    : totalLength / pageSize
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
      {/* </Spin> */}
    </>
  );
});
export default quanlityTotalList;
