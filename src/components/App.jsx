import { useState, useRef, useEffect } from 'react';
import {
  SearchBar,
  ImageGallery,
  Header,
  Button,
  Loader,
  Modal,
  Message,
} from './index';
import { animateScroll as scroll } from 'react-scroll';
import { STATUS, fetchImage } from 'services';
import { GlobalStyle } from 'globalStyle/GlobalStyle';
import { Layout } from './Layout.styled';

export const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const totalImageHits = useRef(null);
  const currentImage = images[currentIndex];

  useEffect(() => {
    const controller = new AbortController();
    const fetchImages = async () => {
      setStatus(STATUS.PENDING);
      setError(null);

      try {
        const { totalHits, hits } = await fetchImage(query, page, controller);
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
        const { hits } = await fetchImage(query, page, controller);
        setImages(prev => [...prev, ...normalizedData(hits)]);
        setStatus(STATUS.RESOLVED);
        setTimeout(() => {
          scroll.scrollToBottom();
        }, 500);
      } catch (error) {
        setError(error);
        setStatus(STATUS.ERROR);
      }
    };

    if (query !== '' && page === 1) {
      fetchImages();
    } else if (page > 1) {
      loadMoreImages();
    }
    return () => {
      controller.abort();
    };
  }, [query, page]);

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

  const getQuery = value => {
    setQuery(value);
    setPage(1);
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <Layout>
      <Header>
        <SearchBar getQuery={getQuery} />
      </Header>
      <ImageGallery
        images={images}
        setIndex={setIndex}
        toggleModal={toggleModal}
      />
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
      <GlobalStyle />
    </Layout>
  );
};
