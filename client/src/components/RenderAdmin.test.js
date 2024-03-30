import React from 'react';
import { render, screen, act } from '@testing-library/react';
import RenderAdmin from './RenderAdmin';
import '@testing-library/jest-dom';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status:true, loggedIn:true, users: [] }),
      })
    );
  });

describe('RenderAdmin', () => {
  const info = {
    userStatus: 'admin',
    trip_name: 'Test Trip',
    destination: 'Test Destination',
  };

  beforeEach(async () => {
    fetch.mockClear();
    await act(async () => {
      render(<RenderAdmin info={info} />);
    });
  });


  afterEach(() => {
    fetch.mockRestore();
  });

  test('renders without crashing', () => {
    expect(screen.getByText('Applied Users')).toBeInTheDocument();
    expect(screen.getByText('Joined Users')).toBeInTheDocument();
    expect(screen.getByText('Declined Users')).toBeInTheDocument();
  });

  test('makes fetch requests when userStatus is "admin"', () => {
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(fetch).toHaveBeenCalledWith(`http://${process.env.REACT_APP_IP}:8000/api/travel/appliedUsers?trip_name=${encodeURIComponent(info.trip_name)}&destination=${encodeURIComponent(info.destination)}`, {
      credentials: 'include',
    });
    expect(fetch).toHaveBeenCalledWith(`http://${process.env.REACT_APP_IP}:8000/api/travel/joinedUsers?trip_name=${encodeURIComponent(info.trip_name)}&destination=${encodeURIComponent(info.destination)}`, {
      credentials: 'include',
    });
    expect(fetch).toHaveBeenCalledWith(`http://${process.env.REACT_APP_IP}:8000/api/travel/declinedUsers?trip_name=${encodeURIComponent(info.trip_name)}&destination=${encodeURIComponent(info.destination)}`, {
      credentials: 'include',
    });
  });

});