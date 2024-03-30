import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ChatRoom from './ChatRoom';
import '@testing-library/jest-dom';

global.setImmediate = global.setTimeout;

// Mock the useLocation hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    state: {
      train_number: '123',
      date: '2022-01-01',
      userCount: '1',
      train_name: 'Train Name',
    },
  }),
}));

describe('ChatRoom', () => {
  test('renders without crashing', () => {
    render(
      <Router>
        <ChatRoom />
      </Router>
    );
  });

  test('renders Go Back button', () => {
    render(
      <Router>
        <ChatRoom />
      </Router>
    );
    const button = screen.getByText(/Go Back/i);
    expect(button).toBeInTheDocument();
  });
});