import PropTypes from 'prop-types';
import { ImageGalleryItemImage } from './ImageGalleryItem.styled';

export const ImageGalleryItem = ({ tags, largeImageURL, onComplete }) => {
  return <ImageGalleryItemImage src={largeImageURL} alt={tags} />;
};

ImageGalleryItem.propTypes = {
  largeImageURL: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
};
