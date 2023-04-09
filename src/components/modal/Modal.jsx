import React, { useEffect, forwardRef, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import './Modal.css';

import {
  Overlay,
  ModalContainer,
  CurrentPageText,
  Button,
  ArrowBack,
  ArrowForward,
  Image,
} from './Modal.styled';

export const Modal = forwardRef(
  (
    {
      totalImages,
      currentPosition,
      toggleModal,
      changeCurrentIndex,
      showModal,
      image: { largeImageURL, tags },
    },
    ref
  ) => {
    const [showImage, setShowImage] = useState(false);
    const imageRef = useRef(null);

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

    useEffect(() => {
      if (showModal) {
        setShowImage(true);
      } else {
        setShowImage(false);
      }
    }, [showModal]);

    const onMouseClick = e => {
      if (e.target === e.currentTarget) {
        toggleModal();
      }
    };

    return (
      <Overlay onClick={onMouseClick} ref={ref}>
        <ModalContainer>
          <CurrentPageText>{`${currentPosition}/${totalImages}`}</CurrentPageText>
          <Button type="button" onClick={() => changeCurrentIndex(-1)}>
            <ArrowBack />
          </Button>
          <CSSTransition
            in={showImage}
            nodeRef={imageRef}
            timeout={500}
            classNames="show"
          >
            <Image src={largeImageURL} alt={tags} width="1280" ref={imageRef} />
          </CSSTransition>
          <Button type="button" onClick={() => changeCurrentIndex(1)}>
            <ArrowForward />
          </Button>
        </ModalContainer>
      </Overlay>
    );
  }
);

Modal.propTypes = {
  totalImages: PropTypes.number.isRequired,
  currentPosition: PropTypes.number.isRequired,
  image: PropTypes.shape({
    largeImageURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
  }),
  toggleModal: PropTypes.func.isRequired,
  changeCurrentIndex: PropTypes.func.isRequired,
};
