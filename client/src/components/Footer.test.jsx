import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from './Footer'; // Adjust the path if needed

test('renders copyright text', () => {
  render(<Footer />);

  const copyrightText = screen.getByText(/© 2024 Access Denied, Inc/i);

  expect(copyrightText).toBeInTheDocument();
});

test('renders home link', () => {
  render(<Footer />);

  const homeLink = screen.getByText(/Home/i);

  expect(homeLink).toBeInTheDocument();
  expect(homeLink).toHaveAttribute('href', '/home');
});
