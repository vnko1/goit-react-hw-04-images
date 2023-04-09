import { useRef, useEffect, useReducer } from 'react';
import { CSSTransition } from 'react-transition-group';
import { animateScroll as scroll } from 'react-scroll';
import {
  SearchBar,
  ImageGallery,
  Header,
  Button,
  Loader,
  Modal,
  Message,
} from './index';
import {
  STATUS,
  INITIAL_STATE,
  fetchImage,
  normalizedData,
  reducer,
} from 'services';
import { GlobalStyle } from 'globalStyle/GlobalStyle';
import { Layout } from './Layout.styled';

import './style/styles.css';

export const App = () => {
  const [
    { query, page, images, currentIndex, status, showModal, error },
    dispatch,
  ] = useReducer(reducer, INITIAL_STATE);
  const nodeRef = useRef(null);
  const totalImageHits = useRef(null);
  const currentImage = images[currentIndex];

  useEffect(() => {
    const controller = new AbortController();

    const loadImages = async () => {
      dispatch({
        type: 'fetchStatus',
        payload: { status: STATUS.PENDING, error: null },
      });

      try {
        const { totalHits, hits } = await fetchImage(query, page, controller);
        totalImageHits.current = totalHits;
        dispatch({
          type: 'fetchStatusResolved',
          payload: { images: normalizedData(hits), status: STATUS.RESOLVED },
        });

        if (page > 1) {
          setTimeout(() => {
            scroll.scrollToBottom();
          }, 1000);
        }
      } catch (error) {
        dispatch({
          type: 'fetchStatus',
          payload: { status: STATUS.ERROR, error: error },
        });
      }
    };

    if (query) loadImages();

    return () => {
      controller.abort();
    };
  }, [page, query]);

  const toggleModal = () => dispatch({ type: 'setShowModal' });

  const getQuery = value => dispatch({ type: 'getQuery', payload: value });

  const loadMore = () => dispatch({ type: 'incrementPage' });

  const changeCurrentIndex = value => {
    if (currentIndex + value < 0) {
      dispatch({ type: 'setIndex', payload: images.length - 1 });
      return;
    }
    if (currentIndex + value > images.length - 1) {
      dispatch({ type: 'setIndex', payload: 0 });
      return;
    }

    dispatch({ type: 'incrementIndex', payload: value });
  };

  const setIndex = id => {
    const index = images.findIndex(image => image.id === id);
    dispatch({ type: 'setIndex', payload: index });
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
      <CSSTransition
        in={showModal}
        nodeRef={nodeRef}
        timeout={300}
        classNames="appear"
        unmountOnExit
      >
        <Modal
          image={currentImage}
          toggleModal={toggleModal}
          changeCurrentIndex={changeCurrentIndex}
          totalImages={images.length}
          currentPosition={currentIndex + 1}
          showModal={showModal}
          ref={nodeRef}
        />
      </CSSTransition>
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
