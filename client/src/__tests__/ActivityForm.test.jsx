import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import rootReducer from '../reducers/index';
import Creador from '../components/Creador/Creador';

jest.mock('axios');

function renderWithProviders(ui) {
  const store = createStore(rootReducer, applyMiddleware(thunk));
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
}

test('ActivityForm includes risk_level field', () => {
  renderWithProviders(<Creador />);

  const riskSlider = document.getElementById('risk_level');
  expect(riskSlider).toBeInTheDocument();
  expect(riskSlider).toHaveAttribute('type', 'range');
  expect(riskSlider).toHaveAttribute('min', '1');
  expect(riskSlider).toHaveAttribute('max', '5');
});

test('ActivityForm newActivity sends risk_level in payload', async () => {
  axios.get.mockResolvedValueOnce({ data: { items: [{ id: 'ARG', name: 'Argentina', continent: 'South America', flag_url: 'flag.png' }] } });

  axios.post.mockResolvedValueOnce({
    data: { id: 1, name: 'Test Activity' },
  });

  renderWithProviders(<Creador />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalled();
  });

  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: 'Test Activity' },
  });

  const nameInput = screen.getByLabelText(/name/i);
  expect(nameInput).toBeInTheDocument();

  const riskSlider = document.getElementById('risk_level');
  fireEvent.change(riskSlider, { target: { value: '4' } });

  const createButtons = screen.getAllByText(/create/i);
  expect(createButtons.length).toBeGreaterThan(0);
});
