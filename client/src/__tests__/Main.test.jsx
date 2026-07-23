import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import rootReducer from '../reducers/index';
import Main from '../components/Main/Main';

jest.mock('axios');

const defaultState = {
  countriesOnscreen: [],
  reserveCountries: [],
  switchPaged: "filtering",
};

function renderWithProviders(ui, initialState) {
  const store = createStore(rootReducer, initialState || undefined, applyMiddleware(thunk));
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
}

test('Main renders without crashing', () => {
  axios.get.mockResolvedValueOnce({ data: { items: [] } });
  renderWithProviders(<Main />);
  expect(screen.getByText(/No countries Associated/i)).toBeInTheDocument();
});

test('Main renders country cards when data is provided', () => {
  const mockCountries = [
    { id: 'ARG', name: 'Argentina', continent: 'South America', flag: 'flag.png', Activities: [] },
  ];
  const fullState = { ...defaultState, countriesOnscreen: mockCountries, reserveCountries: mockCountries };
  renderWithProviders(<Main />, fullState);
  expect(screen.getByText('Argentina')).toBeInTheDocument();
});

test('Main pagination controls appear', () => {
  const mockCountries = Array.from({ length: 15 }, (_, i) => ({
    id: `CT${i}`,
    name: `Country ${i}`,
    continent: 'Asia',
    flag: 'flag.png',
    Activities: [],
  }));
  const fullState = { ...defaultState, countriesOnscreen: mockCountries, reserveCountries: mockCountries };
  renderWithProviders(<Main />, fullState);
  expect(screen.getByText('1')).toBeInTheDocument();
  expect(screen.getByText('2')).toBeInTheDocument();
});
