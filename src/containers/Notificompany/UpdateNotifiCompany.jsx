import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NotifiCompany from './NotifiCompany';

import { actions as notifiCompanyActions } from "../../redux/notificompany/acions";

class UpdateNotifiCompany extends React.Component {
    onSendNoti = (params) => {
        const { itemRead } = this.props.NotifiCompany;
        const id = itemRead.id
        const data = {
            id: id,
            ...params,
        }
        this.props.onUpdateNoti(data);
        this.props.onClose();
    };

    onUpdateNoti = (params) => {
        const { itemRead } = this.props.NotifiCompany;
        const id = itemRead.id
        const data = {
            id: id,
            ...params,
        }
        this.props.onUpdateNoti(data);
        this.props.onClose();
    };
    render() {
        const { itemRead, loading } = this.props.NotifiCompany;
        console.log("itemRead", itemRead)
        const { onClose } = this.props;
        const listDriver = itemRead.driverUuid.length === 0 ? [{ key: "1", label: "Tất cả" }] : itemRead.driverUuid;
        return (
            <NotifiCompany
                loading={loading}
                onSendNoti={this.onSendNoti}
                onSaveNoti={this.onUpdateNoti}
                itemRead={itemRead}
                listDriver={listDriver}
                onClose={onClose}
            />
        )
    }
}
const {
    onUpdateNoti,
    onSendNoti,
} = notifiCompanyActions;

const mapStateToProps = store => {
    return {
        NotifiCompany: store.NotifiCompany.toJS(),
    };
};
const mapDispatchToProps = dispatch => bindActionCreators(
    {
        onUpdateNoti,
        onSendNoti,
    },
    dispatch
);
export default connect(mapStateToProps, mapDispatchToProps)(UpdateNotifiCompany);