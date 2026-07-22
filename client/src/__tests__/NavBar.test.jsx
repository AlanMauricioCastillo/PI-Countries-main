import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { MemoryRouter } from 'react-router-dom';
import rootReducer from '../reducers/index';
import NavBar from '../components/NavBar/NavBar';

function renderWithProviders(ui, initialState) {
  const store = createStore(rootReducer, initialState || undefined, applyMiddleware(thunk));
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
}

test('NavBar renders all navigation links (Home, Create, Favorites)', () => {
  renderWithProviders(<NavBar />);
  expect(screen.getByText('Home')).toBeInTheDocument();
  expect(screen.getByText('Create')).toBeInTheDocument();
  expect(screen.getByText('Favorites')).toBeInTheDocument();
});

test('NavBar shows Login/Register links when not authenticated', () => {
  renderWithProviders(<NavBar />);
  expect(screen.getByText('Login')).toBeInTheDocument();
  expect(screen.getByText('Register')).toBeInTheDocument();
});

test('NavBar shows Logout button when authenticated', () => {
  renderWithProviders(<NavBar />, {
    auth: { token: 'test-token', user: null },
  });
  expect(screen.getByText('Logout')).toBeInTheDocument();
  expect(screen.queryByText('Login')).not.toBeInTheDocument();
  expect(screen.queryByText('Register')).not.toBeInTheDocument();
});

test('NavBar Logout button dispatches logout action on click', () => {
  const store = createStore(
    rootReducer,
    { auth: { token: 'test-token', user: null } },
    applyMiddleware(thunk)
  );
  const dispatchSpy = jest.spyOn(store, 'dispatch');
  render(
    <Provider store={store}>
      <MemoryRouter><NavBar /></MemoryRouter>
    </Provider>
  );
  fireEvent.click(screen.getByText('Logout'));
  expect(dispatchSpy).toHaveBeenCalledWith({ type: 'LOGOUT', payload: null });
});
