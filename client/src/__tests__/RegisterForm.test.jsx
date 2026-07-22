import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import rootReducer from '../reducers/index';
import RegisterPage from '../components/RegisterPage/RegisterPage';

jest.mock('axios');

function renderWithProviders(ui) {
  const store = createStore(rootReducer, applyMiddleware(thunk));
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/register']}>{ui}</MemoryRouter>
    </Provider>
  );
}

test('RegisterForm submits user data', async () => {
  axios.post.mockResolvedValueOnce({
    data: {
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      is_active: true,
    },
  });

  renderWithProviders(<RegisterPage />);

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: 'testuser' },
  });
  const passwordInputs = screen.getAllByLabelText(/password/i);
  fireEvent.change(passwordInputs[0], {
    target: { value: 'Password1' },
  });
  fireEvent.change(screen.getByLabelText(/confirm password/i), {
    target: { value: 'Password1' },
  });

  fireEvent.click(screen.getByRole('button', { name: /register/i }));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      '/auth/register',
      {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password1',
      },
      expect.any(Object)
    );
  });
});

test('RegisterForm shows error on password mismatch', async () => {
  renderWithProviders(<RegisterPage />);

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: 'testuser' },
  });
  const passwordInputs = screen.getAllByLabelText(/password/i);
  fireEvent.change(passwordInputs[0], {
    target: { value: 'Password1' },
  });
  fireEvent.change(screen.getByLabelText(/confirm password/i), {
    target: { value: 'DifferentPass1' },
  });

  fireEvent.click(screen.getByRole('button', { name: /register/i }));

  await waitFor(() => {
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });
});
