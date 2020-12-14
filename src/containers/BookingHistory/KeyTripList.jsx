import React, { Component } from 'react'
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import { Drawer, Input, Row, Col } from 'antd';

class KeyTripList extends Component {
    getArrayKey(detailRouteOld, detailRouteCurrent) {
        let arrayTrip;
        let detailRouteKey;
        if (!detailRouteCurrent) {
            // Trường hợp detailRouteCurrent không có
            arrayTrip = Object.keys(detailRouteOld[0]);
            detailRouteKey = detailRouteOld;
        } else if (!detailRouteOld) {
            // Trường hợp detailRouteOld không có
            arrayTrip = Object.keys(detailRouteCurrent[0]);
            detailRouteKey = detailRouteCurrent;
        } else if (Object.keys(detailRouteCurrent[0]).length >=
            Object.keys(detailRouteOld[0]).length
        ) {
            // Trường hợp current lớn hơn old
            arrayTrip = Object.keys(detailRouteCurrent[0]);
            detailRouteKey = detailRouteCurrent;
        } else {
            // Trường hợp old lớn hơn current
            detailRouteKey = detailRouteOld;
            arrayTrip = Object.keys(detailRouteOld[0]);
        }
        let array = [];
        arrayTrip.map((item) => {
            if (item !== "stewardessName" && item !== "stewardessUuid" && item !== "index" && item !== "comfirmedByDriver" &&
                item !== "guideInfo" && item !== "uuid" && item !== "vehicleTypeId" && item !== "vehicleId" &&
                item !== "key" && item !== "driverId" && item !== "fixedRoutesId" && item !== "actualVehiclesTypeId"
            ) {
                array.push(item);
            }
        })
        const res = {
            arrayTripNew: array,
            detailRouteKey: detailRouteKey,
        }
        return res;
    }
    render() {
        const { detailRouteOld, detailRouteCurrent } = this.props;
        if (!detailRouteOld && !detailRouteCurrent) {
            return null;
        }
        const { arrayTripNew, detailRouteKey } = this.getArrayKey(detailRouteOld, detailRouteCurrent);
        console.log("arrayTripNewkey", arrayTripNew)
        return (
            <div>
                {
                    detailRouteKey.map((item, index) => {
                        return (
                            <>
                                <h5>{`Trip ${index + 1}`}</h5>
                                {
                                    arrayTripNew.map((key) => {
                                        return <p>{key}</p>
                                    })
                                }
                            </>
                        )
                    })
                }
            </div>
        );
    }
}

export default KeyTripList;