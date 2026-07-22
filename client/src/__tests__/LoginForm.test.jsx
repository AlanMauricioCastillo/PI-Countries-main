import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import rootReducer from '../reducers/index';
import LoginPage from '../components/LoginPage/LoginPage';

jest.mock('axios');

function renderWithProviders(ui) {
  const store = createStore(rootReducer, applyMiddleware(thunk));
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/login']}>{ui}</MemoryRouter>
    </Provider>
  );
}

test('LoginForm submit sets Authorization header', async () => {
  axios.post.mockResolvedValueOnce({
    data: {
      access_token: 'test-token-123',
      token_type: 'bearer',
      expires_in: 1800,
    },
  });

  renderWithProviders(<LoginPage />);

  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: 'testuser' },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'password123' },
  });

  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      '/auth/login',
      { identifier: 'testuser', password: 'password123' },
      expect.any(Object)
    );
  });

  expect(window.localStorage.setItem).toHaveBeenCalledWith('auth_token', 'test-token-123');
});
