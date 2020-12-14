import React from 'react';
import { Icon } from 'antd';
import {requestJsonUpload} from  "@Services/base";
import {API_URI} from "@Constants"
import "./styles.scss";
const bodyFormData = new FormData();

class UploadImage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataImage: props.dataImage,
        };
        this.arrayImgURL = props.dataImage;
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.dataImage !== this.props.dataImage) {
            this.arrayImgURL = []
            this.setState({
                dataImage: nextProps.dataImage
            })
        }
    }

    fileSelectedHandler = (event) => {
        event.preventDefault();
        bodyFormData.set('image', event.target.files[0])
        requestJsonUpload({url: API_URI.UPLOAD_IMAGE, data: bodyFormData}).then(response => {
            this.arrayImgURL.push(response.data);
            this.setState(
              {
                dataImage: this.arrayImgURL,
              },
              () => this.props.chooseImage(this.arrayImgURL)
            );
        });
    };

    chooseImage = () => {
        const {dataImage} = this.state;
        this.props.chooseImage(dataImage);
    };

    deleteImage(item, index) {
        this.state.dataImage.splice(index, 1);
        this.setState(
            {
                dataImage: this.state.dataImage
            },
            () => this.chooseImage()
        );
    }
    onClick = (e) => {
        e.preventDefault();
        this.fileInput.click();
    }
    render() {
        const { dataImage } = this.state;

        return (
            <>
                <div className="listImage">
                    {
                        dataImage.map((item, index) => (
                            <div key={index} className="itemImage">
                                <button
                                    onClick={() => this.deleteImage(item, index)}
                                    className="iconDelete"
                                >
                                    <Icon type="close-circle" theme="outlined" style={{ color: "#ccc", fontSize: 21 }} />
                                </button>
                                <img
                                    src={item}
                                    alt="Flowers in Chania" width="50" height="50"
                                />
                            </div>
                        ))
                    }
                </div>
                <form enctype="multipart/form-data" className="btnAddImage">
                    <input
                        style={{ display: "none" }}
                        ref={fileInput => this.fileInput = fileInput}
                        onChange={this.fileSelectedHandler}
                        type="file"
                        name="img"
                        accept="image/*"
                    />
                    <button
                        class="btn btn-success"
                        onClick= {this.onClick}
                    >
                        <i class="fa fa-upload" aria-hidden="true"></i>
                        <span>Ảnh</span>
                    </button>
                </form>
            </>
        )
    }
}
UploadImage.defaultProps = {
    dataImage: []
};
export default UploadImage;