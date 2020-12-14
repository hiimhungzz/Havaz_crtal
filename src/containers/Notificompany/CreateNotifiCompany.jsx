import React from 'react'
import { connect } from 'react-redux';
import Globals from "globals.js";
import { bindActionCreators } from 'redux';
//action
import { actions as notifiCompanyActions } from "../../redux/notificompany/acions";

import NotifiCompany from './NotifiCompany';

class CreateNotifiCompany extends React.Component {
    onSendNoti = (params) => {
       this.props.onSendNoti(params);
       this.props.onClose();
    };

    onSaveNoti = (params) => {
        this.props.onSaveNoti(params);
        this.props.onClose();
    };

    render () {
        // Todo: Anhnhf: fix khi dang nhap
        const profile = Globals.currentUser;
        const parentId=  profile ? {
        key: profile.organizationUuid,
        label: profile.organizationName,
        }: null;
        const {onClose} = this.props;
        const itemRead = {
            driverUuid: [
                {
                    key: "1",
                    label: "Tất cả"
                }
            ],
            title: "",
            editorHtml: "",
            date: new Date(),
            dataImage: [],
            status: false,
            refParent: parentId, 
        }
		return (
            <NotifiCompany
                itemRead={itemRead}
                onSendNoti={this.onSendNoti}
                onSaveNoti={this.onSaveNoti}
                onClose={onClose}
            />
		)
    }
}
const {
    onSaveNoti,
    onSendNoti,
} = notifiCompanyActions;

const mapStateToProps = store => {
    return {
    };
};
const mapDispatchToProps = dispatch => bindActionCreators(
    {
        onSendNoti,
        onSaveNoti,
    },
    dispatch
);
export default connect(mapStateToProps, mapDispatchToProps)(CreateNotifiCompany);