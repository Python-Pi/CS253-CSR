import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import TravelCell from './TravelCell';
import '@testing-library/jest-dom';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('TravelCell', () => {
  const info = {
    index: 1,
    trip_name: 'Test Trip',
    destination: 'Test Destination',
    start_date: new Date(),
    end_date: new Date(),
    amount: 100,
    user_name: 'Test User',
  };

  beforeEach(() => {
    render(<TravelCell {...info} />);
  });

  test('renders without crashing', () => {
    expect(screen.getByText(info.trip_name)).toBeInTheDocument();
  });

  test('displays trip information', () => {
    expect(screen.getByText(`Destination: ${info.destination}`)).toBeInTheDocument();
    expect(screen.getByText(`Amount: ${info.amount}`)).toBeInTheDocument();
    expect(screen.getByText(`Journey Initiator: ${info.user_name}`)).toBeInTheDocument();
  });

  test('displays "Join Trip" button when user_name is truthy', () => {
    expect(screen.getByText('Join Trip')).toBeInTheDocument();
  });

  test('calls handleJoinTrip on "Join Trip" button click', () => {
    const joinTripButton = screen.getByText('Join Trip');
    fireEvent.click(joinTripButton);
    expect(mockNavigate).toHaveBeenCalledWith('/travelInfo', {
      state: {
        trip_name: info.trip_name,
        destination: info.destination,
      },
    });
  });
});