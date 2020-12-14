import React from "react";
import {
  Grid,
  PagingPanel,
  Table,
  TableHeaderRow,
  TableFixedColumns,
} from "@devexpress/dx-react-grid-material-ui";
import { Switch, Spin, Modal } from "antd";
import { IntegratedPaging, PagingState } from "@devexpress/dx-react-grid";
import {
  PagingContainer,
  TableHeaderContent,
} from "../../components/Utility/common";
// componenets
import ModalImamges from "../../components/Utility/modalImage";

import { Paper } from "@material-ui/core";
import { calculatePageInfo } from "helpers/utility";

const Cell = ({ value, style, ...restProps }, _this) => {
  const { column } = restProps;
  let cellData = value;
  if (column.name === "col_0") {
    return (
      <Table.Cell
        {...restProps}
        value={cellData.reason.map((item, index) => (
          <div key={index}>{item.label}</div>
        ))}
      />
    );
  }
  if (column.name === "col_4") {
    return (
      <Table.Cell
        {...restProps}
        value={
          <div
            style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
          >
            {cellData.image.map((item, index) => (
              <div
                onClick={(clickItem) =>
                  _this.onOpenModal(clickItem, item, index)
                }
                key={index}
              >
                <img
                  className="img"
                  src={item}
                  width="40"
                  height="40"
                  alt="baocaosuco"
                />
              </div>
            ))}
          </div>
        }
      />
    );
  }
  // if (column.name === "col_6") {
  //   return (
  //     <Table.Cell
  //       {...restProps}
  //       value={
  //         <div
  //           style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
  //         >
  //          parentName
  //         </div>
  //       }
  //     />
  //   );
  // }
  if (column.name === "col_5") {
    return (
      <Table.Cell
        {...restProps}
        style={{
          textAlign: "center",
          paddingRight: 5,
          paddingLeft: 5,
          ...style,
        }}
        value={
          <Switch
            disabled={cellData.status}
            defaultChecked={cellData.status}
            onChange={(status) =>
              _this.onChangeSwitch(status, restProps.row.key)
            }
          />
        }
      />
    );
  }
  return (
    <Table.Cell
      {...restProps}
      className="dev_table_body"
      value={Object.keys(cellData).map((key, index) => (
        <div title={cellData[key]} key={index}>
          {cellData[key]}
        </div>
      ))}
    />
  );
};

class IncidentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      OpenImage: false,
      ShowImage: "",
    };
  }

  onOpenModal = (clickItem, item, intex) => {
    this.setState({
      OpenImage: true,
      ShowImage: item,
    });
  };
  handleCancel = (e) => {
    this.setState({
      OpenImage: false,
    });
  };

  onChangeSwitch(status, uuid) {
    this.props.onChangeSwitch(status, uuid);
  }

  changePageSize = (size) => {
    this.props.changePageSize(size);
  };

  changeCurrentPage = (pages) => {
    this.props.changeCurrentPage(pages);
  };

  handleSort = () => {};

  render() {
    const { gridIncident, loading, pageSize, pages, totalLength } = this.props;
    let _this = this;
    return (
      <>
        <Modal
          title="Hình Ảnh"
          visible={this.state.OpenImage}
          onCancel={this.handleCancel}
          onOk={this.handleCancel}
        >
          <img src={this.state.ShowImage} width="100%" height="100%"></img>
        </Modal>
        <Spin spinning={loading} tip="Đang lấy dữ liệu...">
          <Paper>
            <Grid
              rows={gridIncident}
              columns={[
                {
                  name: "col_0",
                  title: ["LOẠI SỰ CỐ"],
                  sort: ["nameDriver"],
                },
                {
                  name: "col_1",
                  title: ["ĐỊA ĐIỂM"],
                  sort: ["title"],
                },
                {
                  name: "col_2",
                  title: ["MÔ TẢ"],
                  sort: ["html"],
                },
                {
                  name: "col_3",
                  title: ["LÁI XE"],
                  sort: ["fullName"],
                },
                {
                  name: "col_4",
                  title: ["HÌNH ẢNH"],
                  sort: ["dataImage"],
                },
                {
                  name: "col_6",
                  title: ["ĐƠN VỊ QUẢN LÝ"],
                  sort: [],
                },
                {
                  name: "col_5",
                  title: ["TRẠNG THÁI"],
                  sort: ["status"],
                },
              ]}
            >
              <PagingState currentPage={pages} pageSize={pageSize} />
              <IntegratedPaging />
              <Table
                tableComponent={({ style, ...restProps }) => {
                  return (
                    <Table.Table
                      {...restProps}
                      style={{ ...style, minWidth: 1200 }}
                    />
                  );
                }}
                columnExtensions={[
                  { columnName: "col_0", wordWrapEnabled: true, width: 170 },
                  { columnName: "col_1", wordWrapEnabled: true, width: 250 },
                  { columnName: "col_2", wordWrapEnabled: true },
                  { columnName: "col_3", wordWrapEnabled: true, width: 200 },
                  { columnName: "col_4", wordWrapEnabled: true, width: 150 },
                  { columnName: "col_6", wordWrapEnabled: true, width: 200 },
                  {
                    columnName: "col_5",
                    align: "right",
                    textAlign: "right",
                    width: 100,
                  },
                ]}
                cellComponent={(props) => Cell(props, _this)}
              />
              <TableHeaderRow
                cellComponent={(props) => {
                  return (
                    <TableHeaderRow.Cell
                      {...props}
                      style={{ ...props.style, background: "#f2f3f8" }}
                    />
                  );
                }}
                contentComponent={TableHeaderContent}
              />
              <TableFixedColumns rightColumns={["col_5"]} />
              <PagingPanel
                messages={{
                  info: calculatePageInfo(pages, pageSize, totalLength),
                  rowsPerPage: "Số bản ghi trên mỗi trang",
                }}
                containerComponent={(props) => (
                  <PagingContainer
                    {...props}
                    onCurrentPageChange={this.changeCurrentPage}
                    onPageSizeChange={this.changePageSize}
                    pageSize={pageSize}
                    totalCount={totalLength}
                    currentPage={pages}
                  />
                )}
              />
            </Grid>
          </Paper>
        </Spin>
        <ModalImamges />
      </>
    );
  }
}

export default IncidentList;
