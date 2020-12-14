import React from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images';

const images = [{ src: 'https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
    { src: 'https://cdn.pixabay.com/photo/2018/10/30/16/06/water-lily-3784022__340.jpg' }
];

class ModalImamges extends React.Component {
    render() {
        const { modalIsOpen } = this.props;
        return (
            modalIsOpen ? (
                <ModalGateway>
                    <Modal onClose={this.toggleModal}>
                        <Carousel views={images} />
                    </Modal>
                </ModalGateway>
            ) : null
        );
    }
}
export default ModalImamges;