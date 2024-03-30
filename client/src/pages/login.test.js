import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './login';
import '@testing-library/jest-dom';

jest.mock('../components/NavBarOff', () => () => <div>NavBarOff</div>);
jest.mock('../components/Footer', () => () => <div>Footer</div>);

describe('Login', () => {
  test('renders without crashing', () => {
    render(
      <Router>
        <Login />
      </Router>
    );
  });

  test('renders Sign in button', () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    const button = screen.getByText(/Sign in/i);
    expect(button).toBeInTheDocument();
  });

  test('renders Register here link', () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    const link = screen.getByText(/Register here/i);
    expect(link).toBeInTheDocument();
  });
});