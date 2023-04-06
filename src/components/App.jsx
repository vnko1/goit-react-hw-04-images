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
    currentImage,
    status,
    setStatus,
    showModal,
    toggleModal,
    error,
    setError,
  } = useApp();

  const totalImageHits = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    const loadImages = async () => {
      setStatus(STATUS.PENDING);
      setError(null);

      try {
        const { totalHits, hits } = await fetchImage(query, page, controller);
        totalImageHits.current = totalHits;
        setImages(prev => [...prev, ...normalizedData(hits)]);
        setStatus(STATUS.RESOLVED);

       if (page>1) { 
         setTimeout(() => {
          scroll.scrollToBottom();
        }, 1000);
       }
      } catch (error) {
        setError(error);
        setStatus(STATUS.ERROR);
      }
    };
    if (query) loadImages();

    return () => {
      controller.abort();
    };
  }, [page, query, setError, setImages, setStatus]);

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
