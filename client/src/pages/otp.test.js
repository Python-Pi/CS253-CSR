import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Otp from './otp';
import '@testing-library/jest-dom';

jest.mock('../components/NavBarOff', () => () => <div>NavBarOff</div>);
jest.mock('../components/Footer', () => () => <div>Footer</div>);

// Mock the useNavigate and useLocation hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ state: { name: 'test', password: 'test', email: 'test@test.com' } }),
}));

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true }),
    ok: true,
  })
);

describe('Otp', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders without crashing', () => {
    render(
      <Router>
        <Otp />
      </Router>
    );
  });

  test('renders Submit button', () => {
    render(
      <Router>
        <Otp />
      </Router>
    );
    const button = screen.getByText(/Submit/i);
    expect(button).toBeInTheDocument();
  });
});