import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashBoard from './DashBoard';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('react-bootstrap', () => ({
  Container: ({ children }) => <div>{children}</div>,
  Row: ({ children }) => <div>{children}</div>,
  Col: ({ children }) => <div>{children}</div>,
}));

jest.mock('../components/NavBarOn', () => () => <div>NavBarOn</div>);
jest.mock('../components/TravelCell', () => () => <div>TravelCell</div>);
jest.mock('../components/trainCell', () => () => <div>TrainCell</div>);
jest.mock('../components/Footer', () => () => <div>Footer</div>);

describe('DashBoard', () => {
  it('renders without crashing', () => {
    render(<Router><DashBoard /></Router>);
  });
});