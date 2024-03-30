import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Register from './register';
import '@testing-library/jest-dom';

jest.mock('../components/NavBarOff', () => () => <div>NavBarOff</div>);
jest.mock('../components/Footer', () => () => <div>Footer</div>);

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true }),
    ok: true,
  })
);

describe('Register', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders without crashing', () => {
    render(
      <Router>
        <Register />
      </Router>
    );
  });

  test('renders Sign up button', () => {
    render(
      <Router>
        <Register />
      </Router>
    );
    const button = screen.getByText(/Sign up/i);
    expect(button).toBeInTheDocument();
  });
});