import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons'
import {library} from '@fortawesome/fontawesome-svg-core';
import {Select, Form, Spin, notification, Upload, List} from "antd";
import debounce from 'lodash/debounce';
import _ from "lodash";
import reqwest from "reqwest";

import { DialogTitle, Dialog, Button, Slide, DialogContent, DialogActions } from '@material-ui/core';

library.add(faArrowLeft);

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class DriverUpload extends React.Component {
    constructor(props) {
        super(props);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.fetchPartnerOrganization = debounce(this.fetchPartnerOrganization.bind(this), 100);
        this.state = {
            orgId: null,
            file: null,
        }
    }

    render() {
        const {classes, onClose, listOrganizationPartner, handleImportDriver, loading, ...other} = this.props;
        const {orgId} = this.state;
        return (
            <Dialog classes={{paper: classes.dialog}}
                    onClose={onClose}
                    fullWidth={true}
                    maxWidth={'sm'}
                    aria-labelledby="max-width-dialog-title"
                    aria-describedby="alert-dialog-slide-description"
                    TransitionComponent={Transition}
                    keepMounted
                    {...other}>
                <DialogTitle classes={{root: classes.title}} id="simple-dialog-title">
                    Import danh sách lái xe cho :
                </DialogTitle>
                <DialogContent>

                    <Form>
                        <Form.Item
                            {...{
                                labelCol: {span: 8},
                                wrapperCol: {span: 21},
                            }}
                            label="Chọn khách hàng"
                            labelAlign={"left"}
                        >
                            <Select
                                mode="single"
                                // value={dustbin.vehicleId}
                                showSearch
                                autoClearSearchValue
                                value={orgId}
                                onSelect={(orgId) => {
                                    this.setState({
                                        orgId
                                    })
                                }}
                                showArrow
                                // labelInValue
                                placeholder="Type to search vehicle"
                                notFoundContent={loading ? <Spin size="small"/> : null}
                                filterOption={false}
                                onSearch={this.fetchPartnerOrganization}
                                style={{width: '100%'}}
                            >
                                {listOrganizationPartner.map(d => <Select.Option
                                    key={d.uuid}>{`${d.name}- ${d.code}`}</Select.Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            {...{
                                labelCol: {span: 3},
                                wrapperCol: {span: 21},
                            }}
                        >
                            <Upload
                                name={'file'}
                                showUploadList={true}
                                beforeUpload={(file) => {
                                    this.setState({
                                        file
                                    });
                                    return false;
                                }}
                                // onChange={(file, fileList) => this.handleImportDriver(file)}
                            >
                                <Button variant="contained" color="secondary" type={'button'} htmlType={"button"}
                                        icon={'upload'}>Upload
                                </Button>
                            </Upload>
                        </Form.Item>
                    </Form>

                </DialogContent>
                <DialogActions>
                    <Button classes={{label: classes.button}} onClick={this.handleConfirm} color="primary">
                        Xác nhận
                    </Button>
                    <Button classes={{label: classes.button}} onClick={this.props.onClose} color="secondary">
                        Hủy
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    fetchPartnerOrganization(search) {
        this.props.organizationPartnerSearch(search, 5, 0, '1');
    }

    handleSelect(values) {
        this.setState({
            orgId: values
        })
    }

    handleConfirm() {
        let {file, orgId} = this.state;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('orgId', orgId);
        // You can use any AJAX library you like
        // reqwest({
        //     url: `${API_IMPORT_BASE_URL}/import_driver`,
        //     method: 'post',
        //     processData: false,
        //     data: formData,
        //     success: (response) => {
        //         console.log(response);
        //         this.setState({
        //             fileList: [],
        //             uploading: false,
        //         });
        //         if (response.have_error) {
        //             let data = [];
        //             _.map(response['error_list'], (fieldValue, fieldName) => {
        //                 data.push(fieldValue);
        //             });
        //             notification.error({
        //                 className: 'toast toast-error',
        //                 message: 'Upload danh sách lái xe',
        //                 description: <List
        //                     size="small"
        //                     style={{width: '100%'}}
        //                     dataSource={data}
        //                     renderItem={item => <List.Item style={{color: 'yellow'}}>{item}</List.Item>}
        //                 />
        //             });
        //         } else {
        //             notification.success({
        //                 message: 'HAVAZ',
        //                 description: `${file.name} file uploaded successfully`,
        //                 className: 'toast toast-success'
        //             });
        //         }

        //     },
        //     error: (reason) => {
        //         this.setState({
        //             uploading: false,
        //         });
        //         notification.error({
        //             message: 'HAVAZ',
        //             description: `${file.name} file upload failed.`,
        //             className: 'toast toast-error'
        //         });
        //     },
        // });
        this.props.onClose();
    }
}

DriverUpload.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    selectedValue: PropTypes.string,
};
const styles = {
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
    primary: {
        fontSize: 18,
    },
    button_root: {
        padding: 5
    },
    button: {
        width: '100%',
        fontSize: 15,
    }, dialog: {
        minWidth: '250px',
        // minHeight: '400px',
    }, title: {
        '& h2': {
            textAlign: 'center',
            fontSize: 20
        },
        '& h2 svg': {
            float: 'left',
            cursor: 'pointer'
        }

        // minHeight: '400px',
    }
};
export const DriverUploadWrapped = withStyles(styles)(DriverUpload);