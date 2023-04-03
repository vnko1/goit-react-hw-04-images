import { useState } from 'react';
import PropTypes from 'prop-types';
import { GoSearch } from 'react-icons/go';
import { SearchForm, Button, Input } from './SearchBar.styled';

export const SearchBar = ({ getQuery }) => {
  const [querySearch, setQuerySearch] = useState('');

  const onHandleChange = e => {
    const { value } = e.currentTarget;
    setQuerySearch(value);
  };

  const onHandleSubmit = e => {
    e.preventDefault();
    if (!querySearch.trim()) return;
    getQuery(querySearch.trim().toLowerCase());
  };

  return (
    <SearchForm onSubmit={onHandleSubmit}>
      <Button type="submit">
        <GoSearch />
      </Button>
      <Input
        type="text"
        name="query"
        value={querySearch}
        placeholder="Search images and photos"
        autoComplete="off"
        autoFocus
        onChange={onHandleChange}
      />
    </SearchForm>
  );
};

SearchBar.propTypes = { getQuery: PropTypes.func.isRequired };
