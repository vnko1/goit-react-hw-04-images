import styled, { keyframes } from 'styled-components';
import { zoomIn } from 'react-animations';

import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';

const zoomInAnimation = keyframes`${zoomIn}`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1200;
`;

export const ModalContainer = styled.div`
  display: flex;
  align-items: center;
  max-width: calc(100vw - 48px);
  max-height: calc(100vh - 24px);
`;

export const CurrentPageText = styled.span`
  position: absolute;
  top: 5px;
  right: 5px;
  color: #fff;
`;

export const Button = styled.button`
  height: 20px;
  background-color: transparent;
  cursor: pointer;
  border: none;
  outline: none;
`;

export const ArrowBack = styled(MdArrowBackIos)`
  fill: #fff;
`;

export const ArrowForward = styled(MdArrowForwardIos)`
  fill: #fff;
`;

export const Image = styled.img`
  animation: 1s ${zoomInAnimation};
`;
