import { useState } from 'react';
import { SearchBar, ImageGallery, Header } from './index';
import { GlobalStyle } from 'globalStyle/GlobalStyle';
import { Layout } from './Layout.styled';

export const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

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
      <ImageGallery querySearch={query} nextPage={page} loadMore={loadMore} />
      <GlobalStyle />
    </Layout>
  );
};
