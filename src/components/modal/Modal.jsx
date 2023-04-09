import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  Overlay,
  ModalContainer,
  CurrentPageText,
  Button,
  ArrowBack,
  ArrowForward,
  Image,
} from './Modal.styled';

export const Modal = props => {
  const {
    totalImages,
    currentPosition,
    toggleModal,
    changeCurrentIndex,
    image: { largeImageURL, tags },
  } = props;

  // const timeRef = useRef(null);

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

    // if (timeRef.current) {
    //   clearTimeout(timeRef.current);
    // }
    document.addEventListener('keydown', onKeyClick);
    // setImageIsChanged(false);
    // timeRef.current = setTimeout(() => {
    //   changeCurrentIndex(1);
    // }, 1000);

    return () => {
      document.removeEventListener('keydown', onKeyClick);
      // clearTimeout(timeRef.current);
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
        <Image src={largeImageURL} alt={tags} width="1280" />
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
