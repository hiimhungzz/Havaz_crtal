import React, { Component } from 'react'

class ItemTrip extends Component {
    arrayTripNew(arrayTrip) {
        let array = [];
        arrayTrip.map((item) => {
            if (item !== "stewardessName" && item !== "stewardessUuid" && item !== "index" && item !== "comfirmedByDriver" &&
                item !== "guideInfo" && item !== "uuid" && item !== "vehicleTypeId" && item !== "vehicleId" &&
                item !== "key" && item !== "driverId" && item !== "fixedRoutesId" && item !== "actualVehiclesTypeId"
            ) {
                array.push(item);
            }
        })
        return array;
    }
    render() {
        const { index, arrayTrip, itemDate1, detailRouteOld, detailRouteCurrent, isCurrent } = this.props;
        const arrayTripNew = this.arrayTripNew(arrayTrip);
        return (
            arrayTripNew.map((item) => {
                if (!detailRouteCurrent || !detailRouteCurrent[index] ) {
                    if (itemDate1[item] === null) {
                        return <p>{"null"}</p>
                    }
                    if (itemDate1[item] === "") {
                        return <p>&nbsp;</p>
                    }
                    return <p>{itemDate1[item]}</p>
                }
                // if(!detailRouteOld[index][item] && !detailRouteCurrent[index][item]) {
                //     return;
                // }
                if ( !detailRouteOld || !detailRouteOld[index][item] ) {
                    return <p>Không có</p>
                } else if (detailRouteOld[index][item] === detailRouteCurrent[index][item]) {
                    if (itemDate1[item] === null) {
                        return <p>{"null"}</p>
                    }
                    if (itemDate1[item] === "") {
                        return <p>&nbsp;</p>
                    }
                    return <p>{itemDate1[item]}</p>
                } else {
                    return <p className={isCurrent ? "colorGreen" : "colorRed"}>{itemDate1[item]}</p>
                }
            })
        );
    }
}
class DetailRouteBooking extends Component {
    getArrayKey(detailRouteOld, detailRouteCurrent) {
        let arrayTrip;
        if (!detailRouteCurrent) {
            // Trường hợp detailRouteCurrent không có
            arrayTrip = Object.keys(detailRouteOld[0]);
        } else if (!detailRouteOld) {
            // Trường hợp detailRouteOld không có
            arrayTrip = Object.keys(detailRouteCurrent[0]);
        } else if (Object.keys(detailRouteCurrent[0]).length >=
            Object.keys(detailRouteOld[0]).length
        ) {
            arrayTrip = Object.keys(detailRouteCurrent[0]);
        } else {
            arrayTrip = Object.keys(detailRouteOld[0]);
        }
        return arrayTrip;
    }

    render() {
        const { detailRouteOld, detailRouteCurrent, isCurrent } = this.props;
        if (!detailRouteOld && !detailRouteCurrent) {
            return null;
        }
        const arrayTrip = this.getArrayKey(detailRouteOld, detailRouteCurrent);
        return (
            <div>
                {
                    detailRouteOld && detailRouteOld.map((itemDate1, index) => {
                        return (
                            <>
                                <h5>{`Trip ${index + 1}`}</h5>
                                <ItemTrip
                                    key={index}
                                    isCurrent={isCurrent}
                                    detailRouteCurrent={detailRouteCurrent}
                                    detailRouteOld={detailRouteOld}
                                    arrayTrip={arrayTrip}
                                    itemDate1={itemDate1}
                                    index={index}
                                />
                            </>
                        )
                    })
                }
            </div>
        );
    }
}

export default DetailRouteBooking;