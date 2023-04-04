import PropTypes, { shape } from 'prop-types';
import { ImageGalleryItem } from 'components/imageGalleryItem/ImageGalleryItem';
import { ImageGalleryList, ImageGalleryItems } from './ImageGallery.styled';

export const ImageGallery = ({ images, setIndex, toggleModal }) => {
  return (
    <ImageGalleryList>
      {images.map(({ id, ...otherProps }) => {
        return (
          <ImageGalleryItems
            key={id}
            onClick={() => {
              setIndex(id);
              toggleModal();
            }}
          >
            <ImageGalleryItem {...otherProps} />
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
    }).isRequired
  ).isRequired,
  setIndex: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
};
