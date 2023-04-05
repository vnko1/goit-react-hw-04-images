import { useState } from 'react';
import { STATUS } from './constans';

export const useApp = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  const currentImage = images[currentIndex];

  const toggleModal = () => {
    setShowModal(prev => !prev);
  };

  const getQuery = value => {
    setQuery(value);
    setImages([]);
    setPage(1);
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
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

  const setIndex = id => {
    const index = images.findIndex(image => image.id === id);
    setCurrentIndex(index);
  };

  return {
    query,
    getQuery,
    page,
    loadMore,
    images,
    setImages,
    currentImage,
    currentIndex,
    setIndex,
    changeCurrentIndex,
    status,
    setStatus,
    showModal,
    toggleModal,
    error,
    setError,
  };
};
