import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { animateScroll as scroll } from 'react-scroll';
import { STATUS, fetchImage } from 'services';
import { ImageGalleryItem } from 'components/imageGalleryItem/ImageGalleryItem';
import { Button, Loader, Modal, Message } from 'components';
import { ImageGalleryList, ImageGalleryItems } from './ImageGallery.styled';

export const ImageGallery = ({ querySearch, nextPage, loadMore }) => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const totalImageHits = useRef(null);
  const currentImage = images[currentIndex];

  useEffect(() => {
    const fetchImages = async () => {
      setStatus(STATUS.PENDING);
      setError(null);
      try {
        const { totalHits, hits } = await fetchImage(querySearch, nextPage);
        totalImageHits.current = totalHits;

        setImages(normalizedData(hits));
        setStatus(STATUS.RESOLVED);
      } catch (error) {
        setError(error);
        setStatus(STATUS.ERROR);
      }
    };
    const loadMoreImages = async () => {
      setStatus(STATUS.PENDING);
      setError(null);
      try {
        const { hits } = await fetchImage(querySearch, nextPage);
        setImages(prev => [...prev, ...normalizedData(hits)]);
        setStatus(STATUS.RESOLVED);
        scroll.scrollToBottom();
      } catch (error) {
        setError(error);
        setStatus(STATUS.ERROR);
      }
    };

    if (querySearch !== '' && nextPage === 1) {
      fetchImages();
      return;
    }
    if (nextPage > 1) {
      loadMoreImages();
      return;
    }
  }, [querySearch, nextPage]);

  const normalizedData = data => {
    return data.map(({ id, tags, webformatURL, largeImageURL }) => {
      return { id, tags, webformatURL, largeImageURL };
    });
  };

  const setIndex = id => {
    const index = images.findIndex(image => image.id === id);
    setCurrentIndex(index);
  };

  const toggleModal = () => {
    setShowModal(prev => !prev);
  };

  const changeCurrentIndex = value => {
    if (currentIndex + value < 0) {
      setCurrentIndex(images.length - 1);
      return;
    }
    if (currentIndex + value > images.length - 1) {
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex(prev => prev + value);
  };

  return (
    <>
      <ImageGalleryList>
        {images.map(({ id, tags, largeImageURL }) => {
          return (
            <ImageGalleryItems
              key={id}
              onClick={() => {
                setIndex(id);
                toggleModal();
              }}
            >
              <ImageGalleryItem tags={tags} largeImageURL={largeImageURL} />
            </ImageGalleryItems>
          );
        })}
      </ImageGalleryList>
      {!!images.length && status === STATUS.RESOLVED && (
        <Button
          loadMore={loadMore}
          disabled={images.length >= totalImageHits.current}
        />
      )}
      {status === STATUS.PENDING && <Loader />}
      {showModal && (
        <Modal
          image={currentImage}
          toggleModal={toggleModal}
          changeCurrentIndex={changeCurrentIndex}
          totalImages={images.length}
          currentPosition={currentIndex + 1}
        />
      )}
      {error && <Message>{`${error}. Try to reload your page!`}</Message>}
      {!images.length && status === STATUS.RESOLVED && (
        <Message>
          Nothing found. Try searching with a different parameter!
        </Message>
      )}
    </>
  );
};

ImageGallery.propTypes = {
  querySearch: PropTypes.string.isRequired,
  nextPage: PropTypes.number.isRequired,
  loadMore: PropTypes.func.isRequired,
};
