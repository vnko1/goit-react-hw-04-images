export const STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  ERROR: 'error',
};

export const INITIAL_STATE = {
  query: '',
  page: 1,
  images: [],
  currentIndex: null,
  status: STATUS.IDLE,
  showModal: false,
  error: null,
};
