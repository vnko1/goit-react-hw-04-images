import PropTypes, { shape } from 'prop-types';
import { ImageGalleryItem } from 'components/imageGalleryItem/ImageGalleryItem';
import { ImageGalleryList, ImageGalleryItems } from './ImageGallery.styled';

<<<<<<< HEAD
export const ImageGallery = ({ images, setIndex, toggleModal }) => {
=======
export const ImageGallery = ({ querySearch, nextPage, loadMore }) => {
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
        const { totalHits, hits } = await fetchImage(
          querySearch,
          nextPage,
          controller
        );
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
        const { hits } = await fetchImage(querySearch, nextPage, controller);
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

    if (querySearch !== '' && nextPage === 1) {
      fetchImages();
    } else if (nextPage > 1) {
      loadMoreImages();
    }
    return () => {
      controller.abort();
    };
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

>>>>>>> d30de8d66e40eb4e97378175b7ebb246c5d7c85c
  return (
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
  );
};

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(
    shape({
      id: PropTypes.number.isRequired,
      tags: PropTypes.string.isRequired,
      largeImageURL: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,

  setIndex: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
};
