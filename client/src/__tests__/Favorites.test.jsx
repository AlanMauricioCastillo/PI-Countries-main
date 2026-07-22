import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import rootReducer from '../reducers/index';
import FavoritesPage from '../components/FavoritesPage/FavoritesPage';

jest.mock('axios');

function renderWithProviders(ui, initialState) {
  const store = createStore(rootReducer, initialState || undefined, applyMiddleware(thunk));
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
}

test('FavoritesPage shows login prompt when not authenticated', () => {
  renderWithProviders(<FavoritesPage />);
  expect(screen.getByText(/please/i)).toBeInTheDocument();
  expect(screen.getByText(/login/i)).toBeInTheDocument();
});

test('FavoritesPage fetches and displays favorites when authenticated', async () => {
  axios.get.mockResolvedValueOnce({
    data: [
      { id: 'ARG', name: 'Argentina', continent: 'South America', flag_url: 'flag.png' },
      { id: 'BRA', name: 'Brazil', continent: 'South America', flag_url: 'flag2.png' },
    ],
  });

  const store = createStore(
    rootReducer,
    { auth: { token: 'test-token', user: null } },
    applyMiddleware(thunk)
  );

  render(
    <Provider store={store}>
      <MemoryRouter><FavoritesPage /></MemoryRouter>
    </Provider>
  );

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith('/favorites');
  });

  await waitFor(() => {
    expect(screen.getByText('Argentina')).toBeInTheDocument();
    expect(screen.getByText('Brazil')).toBeInTheDocument();
  });
});

test('FavoritesPage calls removeFavorite on button click', async () => {
  axios.get.mockResolvedValueOnce({
    data: [
      { id: 'ARG', name: 'Argentina', continent: 'South America', flag_url: 'flag.png' },
    ],
  });
  axios.delete.mockResolvedValueOnce({});

  const store = createStore(
    rootReducer,
    { auth: { token: 'test-token', user: null } },
    applyMiddleware(thunk)
  );

  render(
    <Provider store={store}>
      <MemoryRouter><FavoritesPage /></MemoryRouter>
    </Provider>
  );

  await waitFor(() => {
    expect(screen.getByText('Argentina')).toBeInTheDocument();
  });

  const removeBtn = screen.getByText(/remove/i);
  fireEvent.click(removeBtn);

  await waitFor(() => {
    expect(axios.delete).toHaveBeenCalledWith('/favorites/ARG');
  });
});
