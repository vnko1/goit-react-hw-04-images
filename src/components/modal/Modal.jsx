import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Overlay,
  ModalContainer,
  CurrentPageText,
  Button,
  ArrowBack,
  ArrowForward,
} from './Modal.styled';

export const Modal = props => {
  const {
    totalImages,
    currentPosition,
    toggleModal,
    changeCurrentIndex,
    image: { largeImageURL, tags },
  } = props;

  useEffect(() => {
    const onKeyClick = e => {
      if (e.code === 'Escape') {
        toggleModal();
      }
      if (e.code === 'ArrowRight') {
        changeCurrentIndex(1);
      }
      if (e.code === 'ArrowLeft') {
        changeCurrentIndex(-1);
      }
    };
    document.addEventListener('keydown', onKeyClick);

    return () => {
      document.removeEventListener('keydown', onKeyClick);
    };
  }, [changeCurrentIndex, toggleModal]);

  const onMouseClick = e => {
    if (e.target === e.currentTarget) {
      toggleModal();
    }
  };

  return (
    <Overlay onClick={onMouseClick}>
      <ModalContainer>
        <CurrentPageText>{`${currentPosition}/${totalImages}`}</CurrentPageText>
        <Button type="button" onClick={() => changeCurrentIndex(-1)}>
          <ArrowBack />
        </Button>
        <img src={largeImageURL} alt={tags} width="1280" />
        <Button type="button" onClick={() => changeCurrentIndex(1)}>
          <ArrowForward />
        </Button>
      </ModalContainer>
    </Overlay>
  );
};

Modal.propTypes = {
  totalImages: PropTypes.number.isRequired,
  currentPosition: PropTypes.number.isRequired,
  image: PropTypes.shape({
    largeImageURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
  }).isRequired,
  toggleModal: PropTypes.func.isRequired,
  changeCurrentIndex: PropTypes.func.isRequired,
};
