import React from "react";
import { Upload, Button, Icon } from 'antd';
// import reqwest from 'reqwest';
import { connect } from "react-redux";
import { API_URI } from "@Constants";
import { requestJsonUpload } from "../../../services/base";
let uid = 1

class UploadFile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            arrayImgURL: props.arrayImgURL
        }
        this.arrayImgURL = props.arrayImgURL;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.arrayImgURL !== this.props.arrayImgURL) {
            this.arrayImgURL = []
            this.setState({
                arrayImgURL: nextProps.arrayImgURL
            })
        }
    }
    onDownload = e => {
        const url = e.response ? e.response.url : "";
        const name = e.name ? e.name : "";
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${name}`); //or any other extension
        document.body.appendChild(link);
        link.click();
    };
    normFile = e => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };
    URL() {
        return API_URI.UPLOAD_FILE
    }
    customRequest = (option) => {
        const data = new FormData()
        data.set('files', option.file)
        requestJsonUpload({ url: API_URI.UPLOAD_FILE, data: data }).then(response => {
            let name = response.data ? response.data[0].replace('https://media.cr.havaz.vn/files/', '') : ''
            const file = {
                uid: uid++,
                name: name,
                status: 'done',
                url: response.data,
            }

            this.setState(oldState => {
                let newState = { ...oldState };
                newState.arrayImgURL.push(file);
                this.props.setFieldsValue({
                    files: newState.arrayImgURL
                })
                return newState;
            });


        }).catch((err) => {
            // notification.warning({
            //     message: 'Có lỗi trong quá trình upload',
            //     // description:
            //     //     'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
            // });
        })
    };
    onRemove(val) {
        this.setState(oldState => {
            let newState = { ...oldState };
            newState.arrayImgURL.splice(this.state.arrayImgURL.findIndex(item => item.uid === val.uid), 1);
            this.props.setFieldsValue({
                files: newState.arrayImgURL
            })
            return newState;
        });

    };

    render() {
        const { arrayImgURL } = this.state;
        return (
            <Upload
                {...this.props}
                onDownload={this.onDownload}
                fileList={arrayImgURL}
                onRemove={(e) => this.onRemove(e)}
                // disabled={this.props.form.getFieldValue("upload") ? true : false}       
                name="file"
                action={this.URL}
                // file={this.props.form.upload}
                customRequest={this.customRequest}
            >
                <Button>
                    <Icon type="upload" /> Click to Upload
                              </Button>
            </Upload>
        );
    }
}
UploadFile.defaultProps = {
    arrayImgURL: []
};
export default connect()(UploadFile);