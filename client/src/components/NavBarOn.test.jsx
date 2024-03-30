import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavBarOn from './NavBarOn';
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('NavBarOn', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <NavBarOn />
      </BrowserRouter>
    );
  });

  test('renders without crashing', () => {
    expect(screen.getByText('RouteMate')).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Travel')).toBeInTheDocument();
    expect(screen.getByText('Itinerary')).toBeInTheDocument();
    expect(screen.getByText('Blogs')).toBeInTheDocument();
  });

  test('renders logo', () => {
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

  test('renders logout button', () => {
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('calls handleLogout on logout button click', () => {
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
  });
});