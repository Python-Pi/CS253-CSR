import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import RenderStatus from './RenderStatus';
import '@testing-library/jest-dom';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ users: [] }),
  })
);

describe('RenderStatus', () => {
  const info = {
    userStatus: 'joined',
    trip_name: 'Test Trip',
    destination: 'Test Destination',
  };

  beforeEach(() => {
    fetch.mockClear();
    render(<RenderStatus {...info} />);
  });

  afterEach(() => {
    fetch.mockRestore();
  });

  test('renders without crashing', () => {
    expect(screen.getByText('Joined Users')).toBeInTheDocument();
  });

  test('makes a fetch request when userStatus is "joined"', () => {
    expect(fetch).toHaveBeenCalledWith(`http://${process.env.REACT_APP_IP}:8000/api/travel/joinedUsers?trip_name=${encodeURIComponent(info.trip_name)}&destination=${encodeURIComponent(info.destination)}`, {
      credentials: 'include',
    });
  });

  test('navigates to /travelChatRoom on "Join Chat Server" button click', () => {
    const joinChatServerButton = screen.getByText('Join Chat Server');
    fireEvent.click(joinChatServerButton);
    expect(mockNavigate).toHaveBeenCalledWith('/travelChatRoom', {
      state: {
        trip_name: info.trip_name,
        destination: info.destination,
      },
    });
  });
});