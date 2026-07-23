import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFound from '../components/No encontrado/NotFound';

test('NotFound renders "Not found" text', () => {
  render(<NotFound />);
  expect(screen.getByText('Not found')).toBeInTheDocument();
});

test('NotFound renders an image', () => {
  render(<NotFound />);
  const img = screen.getByAltText(/pikachu/i);
  expect(img).toBeInTheDocument();
  expect(img.tagName).toBe('IMG');
});
