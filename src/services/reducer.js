export const reducer = (state, action) => {
  switch (action.type) {
    case 'setQuery':
      return { ...state, query: action.payload };

    case 'setPage':
      return { ...state, page: state.page + action.payload };

    case 'incrementPage':
      return { ...state, page: state.page + 1 };

    case 'pushImage':
      return { ...state, images: [...state.images, ...action.payload] };

    case 'setIndex':
      return { ...state, currentIndex: action.payload };

    case 'incrementIndex':
      return { ...state, currentIndex: state.currentIndex + action.payload };

    case 'setShowModal':
      return { ...state, showModal: !state.showModal };

    case 'getQuery':
      return {
        ...state,
        query: action.payload,
        page: 1,
        images: [],
      };

    case 'setStatus':
      return { ...state, status: action.payload };

    case 'setError':
      return { ...state, error: action.payload };

    case 'fetchStatus':
      return {
        ...state,
        status: action.payload.status,
        error: action.payload.error,
      };

    case 'fetchStatusResolved':
      return {
        ...state,
        images: [...state.images, ...action.payload.images],
        status: action.payload.status,
      };

    case 'reset':
      return { ...state, page: 1, image: [] };

    default:
      throw new Error();
  }
};
