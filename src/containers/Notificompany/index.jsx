import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Drawer, Input, Row, Col } from 'antd';
import classNames from "classnames";

// actions
import { actions as notifiCompanyActions } from "../../redux/notificompany/acions";

// component
import NotifiCompanyList from "./NotifiCompanyList";
import CreateNotifiCompany from "./CreateNotifiCompany";
import UpdateNotifiCompany from "./UpdateNotifiCompany";
//styles

class NotifiCompanyManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowCreate: false,
            isShowUpdate: false,
        }
    }

    componentDidMount() {
        const { pageSize, pages } = this.props.NotifiCompany;
        this.getListNoti(pageSize, pages);
    }

    getListNoti(pageSize, pages) {
        const data = {
            pageSize: pageSize,
            pages: pages
        }
        this.props.getListNotiCompany(data);
    };

    handleShowModal = () => {
        this.setState({ isShowCreate: true });
    };

    handleHideModal = () => {
        this.setState({
            isShowCreate: false,
            isShowUpdate: false,
        });
    };

    onDeleteNoti = (uuid) => {
        this.props.deleteNotifiItem(uuid);
    };

    handleViewNoti = (rowData) => {
        this.setState({ isShowUpdate: true });
        this.props.onLoadding(true);
        setTimeout(() => {
            this.props.readItemNoti(rowData.uuid);
        }, 950);
    };

    changePageSize = (pageSize) => {
        const { pages } = this.props.NotifiCompany;
        this.props.onLoadding(true);
        this.props.onSetPageSize(pageSize)
        this.getListNoti(pageSize, pages);
    };

    onSendNotiNow = (rowData) => {
        const params = {
            id: rowData.uuid
        };
        this.props.onSendItem(params);
    };

    changeCurrentPage = (currentPage) => {
        const { pageSize } = this.props.NotifiCompany;
        this.props.onLoadding(true);
        this.props.onChangeCurrentPage(currentPage)
        this.getListNoti(pageSize, currentPage);
    };

    onFilterTitle = (e) => {
        const title = e.target.value;
        if (this.codeTimer) {
            clearTimeout(this.codeTimer);
        }
        this.codeTimer = setTimeout(() => {
            this.props.onLoadding(true);
            this.props.filterNotifi(title)
        }, 300);
    };

    render() {
        const { isShowCreate, isShowUpdate } = this.state;
        const { gridNoti, totalLength, pageSize, loading, pages } = this.props.NotifiCompany;
        return (
            <div className="col-lg-12 kt-portlet kt-portlet--mobile">
                <div className="kt-portlet__head-toolbar">
                    <div className="kt-portlet__head-actions">
                        <button
                            type="button"
                            onClick={this.handleShowModal}
                            className={classNames({
                                "btn btn-primary btn-icon-sm": true,
                            })}
                        >
                            <i className="flaticon2-plus"></i>
                            Thêm thông báo
                        </button>
                    </div>
                </div>
                <div className="viewFilter">
                    <Row>
                        <Col span={8}>
                            <Input
                                onChange={this.onFilterTitle}
                                placeholder="Tiêu đề"
                            />
                        </Col>
                    </Row>
                </div>
                <NotifiCompanyList
                    dataSource={gridNoti}
                    loading={loading}
                    totalLength={totalLength}
                    currentPage={pages}
                    pageSize={pageSize}
                    sendNoti={this.onSendNotiNow}
                    onDelete={this.onDeleteNoti}
                    viewNoti={this.handleViewNoti}

                    onChangePageSize={this.changePageSize}
                    onChangeCurrentPage={this.changeCurrentPage}
                />

                <Drawer
                    id="notiListDrawer"
                    placement="right"
                    visible={isShowCreate}
                    destroyOnClose
                    width="95%"
                    onClose={this.handleHideModal}
                >
                    <CreateNotifiCompany
                        onClose={this.handleHideModal}
                    />
                </Drawer>
                <Drawer
                    id="notiListDrawer"
                    placement="right"
                    visible={isShowUpdate}
                    destroyOnClose
                    width="95%"
                    onClose={this.handleHideModal}
                >
                    <UpdateNotifiCompany
                        onClose={this.handleHideModal}
                    />
                </Drawer>
            </div>
        );
    }
}
const {
    getListNotiCompany,
    deleteNotifiItem,
    readItemNoti,
    onSetPageSize,
    filterNotifi,
    onSendItem,
    onLoadding,
    onChangeCurrentPage,
} = notifiCompanyActions;
const mapStateToProps = store => {
    return {
        NotifiCompany: store.NotifiCompany.toJS(),
    };
};
const mapDispatchToProps = dispatch => bindActionCreators(
    {
        onLoadding,
        onChangeCurrentPage,
        filterNotifi,
        onSendItem,
        onSetPageSize,
        getListNotiCompany,
        deleteNotifiItem,
        readItemNoti,
    },
    dispatch
);
export default connect(mapStateToProps, mapDispatchToProps)(NotifiCompanyManagement);