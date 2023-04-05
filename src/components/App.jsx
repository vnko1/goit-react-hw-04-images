import { useRef, useEffect } from 'react';
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
import { STATUS, fetchImage, useApp, normalizedData } from 'services';
import { GlobalStyle } from 'globalStyle/GlobalStyle';
import { Layout } from './Layout.styled';

export const App = () => {
  const {
    query,
    getQuery,
    page,
    loadMore,
    images,
    setImages,
    currentIndex,
    setIndex,
    changeCurrentIndex,
    status,
    setStatus,
    showModal,
    toggleModal,
    error,
    setError,
  } = useApp();

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
        }, 1000);
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
  }, [query, page, setStatus, setError, setImages]);

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
