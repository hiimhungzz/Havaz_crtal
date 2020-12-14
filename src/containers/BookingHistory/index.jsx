import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Drawer, Input, Row, Col } from 'antd';
import classNames from "classnames";

// actions
import { actions as bookingHistoryActions } from "../../redux/bookingHistory/acions";
// components
import BookingHistoryList from "./BookingHistoryList";
import BookingFormSearch from "./BookingFormSearch";
import InfoBooking from "./InfoBooking";
//styles
import moment from "moment";
class BookingHistoryManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            query: {
                startDate: moment().subtract(10, 'days'),
                endDate: moment(new Date()),
                routeName: "",
                bookingCode: ""
            }
        }
    }

    componentDidMount() {
        const params = {
            pageLimit: 10,
            currentPage: 0,
            filter: this.state.query
        }
        this.getList(params);
    }

    getList(params) {
        this.props.getListBookingHistory(params);
    };

    handleHideModal = () => {
        this.setState({
            isShow: false,
        })
    };

    handleShowModal = (id) => {
        this.props.onLoading(true);
        this.props.getDetailContent({_id: id})
        this.setState({
            isShow: true,
        });
    };

    onChangePage = (page) => {
        this.props.onChangeCurrentPage(page);
        this.props.onLoading(true);
        const { pageSize } = this.props.BookingHistory;
        const params = {
            pageLimit: pageSize,
            currentPage: page,
            filter: this.state.query
        }
        this.getList(params);
    };

    onChangeSize = (size) => {
        this.props.onChangePageSize(size);
        this.props.onLoading(true);
        const { currentPage } = this.props.BookingHistory;
        const params = {
            pageLimit: size,
            currentPage: currentPage,
            filter: this.state.query
        }
        this.getList(params);
    };

    onClearInput = () => {
        this.props.onLoading(true);
        const params = {
            pageLimit: 10,
            currentPage: 0,
            filter: {
                startDate: moment().subtract(10, 'days'),
                endDate: moment(new Date()),
                routeName: "",
                bookingCode: ""
            }
        }
        this.getList(params);
    };

    onSearch = (params) => {
        this.props.onLoading(true);
        this.setState({
            query: params,
        });
        const { pageSize, currentPage } = this.props.BookingHistory;
        const data = {
            pageLimit: pageSize,
            currentPage: currentPage,
            filter: {
               ...params
            },
        }
        this.getList(data);
    };

    render() {
        const { isShow } = this.state;
        const { gridHistory, totalLength, pageSize, currentPage, loading, itemBooking } = this.props.BookingHistory;
        return (
            <div className="col-lg-12 kt-portlet kt-portlet--mobile">
                <BookingFormSearch
                    onSearch={this.onSearch}
                    onClearInput={this.onClearInput}
                />
                <BookingHistoryList
                    pageSize={pageSize}
                    totalLength={totalLength}
                    currentPage={currentPage}
                    handleShowModal={this.handleShowModal}
                    dataSource={gridHistory}
                    onChangeCurrentPage={this.onChangePage}
                    onChangePageSize={this.onChangeSize}
                    loading={loading}
                />
                <Drawer
                    id="notiListDrawer"
                    placement="right"
                    visible={isShow}
                    destroyOnClose
                    width="95%"
                    onClose={this.handleHideModal}
                >
                    {
                        itemBooking && (
                            <InfoBooking
                                loading={loading}
                                itemBooking={itemBooking}
                                onClose={this.handleHideModal}
                            />
                        )
                    }
                </Drawer>
            </div>
        );
    }
}
const {
    onSearchBooking,
    getListBookingHistory,
    onChangeCurrentPage,
    onChangePageSize,
    onLoading,
    getDetailContent,
} = bookingHistoryActions;
const mapStateToProps = store => {
    return {
        BookingHistory: store.BookingHistory.toJS(),
    };
};
const mapDispatchToProps = dispatch => bindActionCreators(
    {
        getDetailContent,
        onSearchBooking,
        onChangeCurrentPage,
        onChangePageSize,
        getListBookingHistory,
        onLoading
    },
    dispatch
);
export default connect(mapStateToProps, mapDispatchToProps)(BookingHistoryManagement);