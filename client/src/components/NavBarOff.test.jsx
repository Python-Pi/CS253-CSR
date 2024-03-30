import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavBarOff from './NavBarOff';
import '@testing-library/jest-dom';

jest.mock('../Assets/logo.png', () => ({
  default: 'logo.png',
}));

describe('NavBarOff', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <NavBarOff />
      </BrowserRouter>
    );
  });

  test('renders without crashing', () => {
    expect(screen.getByText('Routemate')).toBeInTheDocument();
  });

  test('renders logo', () => {
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

  test('renders login button', () => {
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('renders register button', () => {
    expect(screen.getByText('Register')).toBeInTheDocument();
  });
});