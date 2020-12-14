import React, { Component } from 'react'
import { Row, Col } from 'antd';
// component
import DetailRouteBooking from './DetailRouteBooking';
import KeyTripList from './KeyTripList';
import { Loading } from "../../components/Utility/common";

class InfoBooking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
        }
    }

    deleteId(itemBooking) {
        try {
            delete itemBooking.bookingCurrent['tripsID']
            delete itemBooking.bookingOld['tripsID']
            delete itemBooking.bookingCurrent['_id']
            delete itemBooking.bookingOld['_id']
            delete itemBooking.bookingCurrent['organizationId']
            delete itemBooking.bookingOld['organizationId']
            delete itemBooking.bookingOld['ownerId']
            delete itemBooking.bookingCurrent['ownerId']
            delete itemBooking.bookingOld['prepayment']
            delete itemBooking.bookingCurrent['prepayment']
            delete itemBooking.bookingOld['promotion']
            delete itemBooking.bookingCurrent['promotion']
            delete itemBooking.bookingOld['lastUpdatedBy']
            delete itemBooking.bookingCurrent['lastUpdatedBy']
            delete itemBooking.bookingOld['createdBy']
            delete itemBooking.bookingCurrent['createdBy']
            delete itemBooking.bookingOld['bookingUuid']
            delete itemBooking.bookingCurrent['bookingUuid']
            delete itemBooking.bookingOld['MOU']
            delete itemBooking.bookingCurrent['MOU']
            delete itemBooking.bookingOld['uuid']
            delete itemBooking.bookingCurrent['uuid']

            let arrayKeyBooking;
            let itemRow;
            if (Object.keys(itemBooking.bookingCurrent).length >=
                Object.keys(itemBooking.bookingOld).length
            ) {
                itemRow = itemBooking.bookingCurrent;
                arrayKeyBooking = Object.keys(itemBooking.bookingCurrent);
            } else {
                itemRow = itemBooking.bookingOld;
                arrayKeyBooking = Object.keys(itemBooking.bookingOld);
            }
            const res = {
                itemRow: itemRow,
                arrayKeyBooking: arrayKeyBooking,
                itemBookingNew: itemBooking,
            };
            return res;
        } catch (error) {
            console.log("error", error)
        }
    }

    render() {
        const { onClose, itemBooking, loading } = this.props;
        const { itemBookingNew, arrayKeyBooking, itemRow } = this.deleteId(itemBooking);
        return (
            <div>
                <div className="kt-portlet__head-label header pb-4">
                    <h3 className="kt-portlet__head-title">
                        <i onClick={onClose} className="fa fa-chevron-left"></i>
                        &nbsp; Chi tiết Booking</h3>
                </div>
                <div className="kt-portlet__head-label header ">
                    <Row>
                        <Col span={4}>
                            <h4>Key</h4>
                            {
                                Object.keys(itemRow).map((item, index) => {
                                    if (item === 'detailRoute') {
                                        return (
                                            null

                                        )
                                    }
                                    return <p key={index}>{item}</p>
                                })
                            }
                            <KeyTripList
                                detailRouteOld={itemBookingNew.bookingOld["detailRoute"]}
                                detailRouteCurrent={itemBookingNew.bookingCurrent["detailRoute"]}
                            />
                        </Col>
                        <Col span={10}>
                            <h4>Nội dung ban đầu</h4>
                            <div>
                                {
                                    Object.keys(itemBookingNew.bookingOld).length > 0 && arrayKeyBooking.map((item, index) => {
                                        if (item === 'detailRoute') {
                                            // detailRoute
                                            return (
                                                null
                                            )
                                        } else if (!itemBookingNew.bookingOld[item]) {
                                            // Kiem Tra không có item
                                            return <p key={index} >Không có</p>
                                        } else if (itemBookingNew.bookingCurrent[item] === itemBookingNew.bookingOld[item]) {
                                            // Giống nhau
                                            return <p key={index} >{itemBookingNew.bookingOld[item]}</p>
                                        } else {
                                            // Khác nhau
                                            return <p key={index} className="colorRed">{itemBookingNew.bookingOld[item]}</p>
                                        }
                                    })
                                }
                                <DetailRouteBooking
                                    isCurrent={false}
                                    detailRouteOld={itemBookingNew.bookingOld["detailRoute"]}
                                    detailRouteCurrent={itemBookingNew.bookingCurrent["detailRoute"]}
                                />
                            </div>
                        </Col>
                        <Col span={10}>
                            <h4>Nội dung thay đổi</h4>
                            <div>
                                {
                                    arrayKeyBooking.map((item, index) => {
                                        if (item === 'detailRoute') {
                                            // detailRoute
                                            return (
                                                null
                                            )
                                        } else if (!itemBookingNew.bookingCurrent[item]) {
                                            // Kiem Tra không có item
                                            return <p key={index}>Không có</p>
                                        } else if (itemBookingNew.bookingCurrent[item] === itemBookingNew.bookingOld[item]) {
                                            // Giống nhau
                                            return <p key={index}>{itemBookingNew.bookingCurrent[item]}</p>
                                        } else {
                                            // Khác nhau
                                            return <p key={index} className="colorGreen">{itemBookingNew.bookingCurrent[item]}</p>
                                        }
                                    })
                                }
                                <DetailRouteBooking
                                    isCurrent={true}
                                    detailRouteCurrent={itemBookingNew.bookingOld["detailRoute"]}
                                    detailRouteOld={itemBookingNew.bookingCurrent["detailRoute"]}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>

                {loading && <Loading />}
            </div>
        );
    }
}

export default InfoBooking;