import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Paginado from '../components/Paginado/Paginado';

test('Paginado renders correct number of page buttons', () => {
  const paginate = jest.fn();
  render(<Paginado countriesPerPage={10} countries={25} paginate={paginate} />);
  expect(screen.getByText('1')).toBeInTheDocument();
  expect(screen.getByText('2')).toBeInTheDocument();
  expect(screen.getByText('3')).toBeInTheDocument();
});

test('Paginado calls paginate on click', () => {
  const paginate = jest.fn();
  render(<Paginado countriesPerPage={10} countries={25} paginate={paginate} />);
  fireEvent.click(screen.getByText('2'));
  expect(paginate).toHaveBeenCalledWith(2);
});

test('Paginado does not render when countries < 9', () => {
  const paginate = jest.fn();
  const { container } = render(<Paginado countriesPerPage={10} countries={5} paginate={paginate} />);
  expect(screen.queryByText('1')).not.toBeInTheDocument();
  expect(container.querySelector('.foot')).toBeInTheDocument();
});
