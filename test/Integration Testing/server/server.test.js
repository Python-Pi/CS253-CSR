import request from 'supertest';
// Mock the pg module
jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    query: jest.fn(),
  };
  return {
    Client: jest.fn(() => mClient),
  };
});

jest.mock('indian-rail-api', () => {
  return {
    getTrainStatus: jest.fn().mockImplementation((trainNumber) => {
      return new Promise((resolve, reject) => {
        resolve({ status: 'Running on time' });
      });
    }),
  };
});

jest.mock('multer', () => {
  return () => ({
    single: jest.fn().mockImplementation(() => (req, res, next) => {
      req.file = { filename: 'test.jpg' };
      next();
    }),
  });
});


import app from "./server";
import multer from "multer";
import { Client } from 'pg';

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------
describe('/api/login', () => {
  test('responds with json', async () => {
    const mockIsAuthenticated = jest.fn().mockReturnValue(true);
    const mockUser = { name: 'test name' };
    app.request.isAuthenticated = mockIsAuthenticated;
    app.request.user = mockUser;

    const response = await request(app).get('/api/login');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: true, loggedIn: true, name: mockUser.name });
  });
  test('handles not logged users', async () => {
    const mockIsAuthenticated = jest.fn().mockReturnValue(false);
    app.request.isAuthenticated = mockIsAuthenticated;

    const response = await request(app).get('/api/login');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: true, loggedIn: false });
  }
);
});

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

describe('GET /api/user/name', () => {
  it('should respond with json and status true when the user is authenticated', async () => {
    // Arrange
    const mockIsAuthenticated = jest.fn().mockReturnValue(true);
    const mockUser = { name: 'test name' };

    app.request.isAuthenticated = mockIsAuthenticated;
    app.request.user = mockUser;

    // Act
    const response = await request(app).get('/api/user/name');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: true, loggedIn: true, name: mockUser.name });
  });

  it('should respond with json and status true when the user is not authenticated', async () => {
    // Arrange
    const mockIsAuthenticated = jest.fn().mockReturnValue(false);

    app.request.isAuthenticated = mockIsAuthenticated;

    // Act
    const response = await request(app).get('/api/user/name');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: true, loggedIn: false });
  });
});

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

describe('POST /api/travel/addTrip', () => {
  let client;
  it('should respond with json and status true when the trip is successfully added', async () => {
    // Arrange
    client = new Client();
    client.query.mockResolvedValueOnce({}); // Insert successful

    // Act
    const response = await request(app)
      .post('/api/travel/addTrip')
      .send({ tripName: 'test trip', destination: 'test destination', startDate: '2022-01-01', endDate: '2022-01-10', amount: 100, details: 'test details' })
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: true, loggedIn: false });
  });

  it('should respond with json and status false when there is a database error', async () => {
    // Arrange
    client = new Client();
    client.query.mockImplementationOnce(() => Promise.reject(new Error('Database error'))); // Database error

    // Act
    const response = await request(app)
      .post('/api/travel/addTrip')
      .send({ tripName: 'test trip', destination: 'test destination', startDate: '2022-01-01', endDate: '2022-01-10', amount: 100, details: 'test details' })
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: false, error: 'There was an error while adding the trip to the database' });
  });
  afterEach(() => {
    client.query.mockReset();
  });
});

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

describe('GET /api/travel/trips', () => {
  let client;
  it('should respond with json and status true when the trips are successfully retrieved', async () => {
    // Arrange
    const mockTrips = [{ id: 1, name: 'test trip' }, { id: 2, name: 'another test trip' }];
    client = new Client();
    client.query.mockResolvedValueOnce({ rows: mockTrips }); // Mock the database query

    // Act
    const response = await request(app).get('/api/travel/trips');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: true, loggedIn: true, trips: mockTrips });
  });

  it('should respond with json and status false when there is a database error', async () => {
    // Arrange
    client = new Client();
    client.query.mockRejectedValueOnce(new Error('Database error')); // Mock a database error

    // Act
    const response = await request(app).get('/api/travel/trips');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: false, error: 'There was an error while retrieving trips from the database' });
  });
  afterEach(() => {
    client.query.mockReset();
  });
});

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

describe('GET /api/travel/joinedTrips', () => {
  let client;

  beforeEach(() => {
    client = new Client();
    jest.spyOn(client, 'query');
    app.set('db', client); // Make sure your app uses this client
  });

  it('should respond with json and status true when the trips are successfully retrieved', async () => {
    // Arrange
    const mockTrips = [{ id: 1, name: 'test trip' }, { id: 2, name: 'another test trip' }];
    const mockIsAuthenticated = jest.fn().mockReturnValue(true);
    app.request.isAuthenticated = mockIsAuthenticated;
    client.query.mockResolvedValueOnce({ rows: mockTrips }); // Mock the database query

    // Act
    const response = await request(app)
      .get('/api/travel/joinedTrips')
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: true, loggedIn: true, trips: mockTrips });
  });

  it('should respond with json and status false when there is a database error', async () => {
    // Arrange
    client.query.mockImplementationOnce(() => Promise.reject(new Error('Database error'))); // Mock a database error

    // Act
    const response = await request(app)
      .get('/api/travel/joinedTrips')
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: false, error: 'There was an error while retrieving trips from the database' });
  });

  afterEach(() => {
    client.query.mockReset();
  });
});

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

describe('GET /api/travel/hostedTrips', () => {
  let client;

  beforeEach(() => {
    client = new Client();
    jest.spyOn(client, 'query');
    app.set('db', client); // Make sure your app uses this client
  });

  it('should respond with json and status true when the trips are successfully retrieved', async () => {
    // Arrange
    const mockTrips = [{ id: 1, name: 'test trip' }, { id: 2, name: 'another test trip' }];
    const mockIsAuthenticated = jest.fn().mockReturnValue(true);
    client.query.mockResolvedValueOnce({ rows: mockTrips }); // Mock the database query
    app.request.isAuthenticated = mockIsAuthenticated;

    // Act
    const response = await request(app)
      .get('/api/travel/hostedTrips')
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: true, loggedIn: true, trips: mockTrips });
  });

  it('should respond with json and status false when there is a database error', async () => {
    // Arrange
    client.query.mockImplementationOnce(() => Promise.reject(new Error('Database error'))); // Mock a database error

    // Act
    const response = await request(app)
      .get('/api/travel/hostedTrips')
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: false, error: 'There was an error while retrieving trips from the database' });
  });

  afterEach(() => {
    client.query.mockReset();
  });
});

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

describe('GET /api/travel/specificTrip', () => {
  let client;

  beforeEach(() => {
    client = new Client();
    jest.spyOn(client, 'query');
    app.set('db', client); // Make sure your app uses this client
  });

  it('should respond with json and status true when the trip is successfully retrieved', async () => {
    // Arrange
    const mockTrip = [{ id: 1, name: 'test trip', destination: 'test destination' }];
    client.query.mockResolvedValueOnce({ rows: mockTrip }); // Mock the database query

    // Act
    const response = await request(app)
      .get('/api/travel/specificTrip')
      .query({ trip_name: 'test trip', destination: 'test destination' })
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: true, loggedIn: true, trips: mockTrip });
  });

  it('should respond with json and status false when there is a database error', async () => {
    // Arrange
    client.query.mockImplementationOnce(() => Promise.reject(new Error('Database error'))); // Mock a database error

    // Act
    const response = await request(app)
      .get('/api/travel/specificTrip')
      .query({ trip_name: 'test trip', destination: 'test destination' })
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: false, error: 'There was an error while retrieving trips from the database' });
  });

  afterEach(() => {
    client.query.mockReset();
  });
});

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

describe('GET /api/travel/searchTrip', () => {
  let client;

  beforeEach(() => {
    client = new Client();
    jest.spyOn(client, 'query');
    app.set('db', client); // Make sure your app uses this client
  });

  it('should respond with json and status true when the trips are successfully retrieved', async () => {
    // Arrange
    const mockTrips = [{ id: 1, name: 'test trip', destination: 'test destination' }];
    client.query.mockResolvedValueOnce({ rows: mockTrips }); // Mock the database query

    // Act
    const response = await request(app)
      .get('/api/travel/searchTrip')
      .query({ search: 'test' })
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: true, loggedIn: true, trips: mockTrips });
  });

  it('should respond with json and status false when there is a database error', async () => {
    // Arrange
    client.query.mockImplementationOnce(() => Promise.reject(new Error('Database error'))); // Mock a database error

    // Act
    const response = await request(app)
      .get('/api/travel/searchTrip')
      .query({ search: 'test' })
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: false, error: 'There was an error while retrieving trips from the database' });
  });

  afterEach(() => {
    client.query.mockReset();
  });
});

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

describe('GET /api/travel/userStatus', () => {
  let client;

  beforeEach(() => {
    client = new Client();
    jest.spyOn(client, 'query');
    app.set('db', client); // Make sure your app uses this client
  });

  it('should respond with json and status true when the user status is successfully retrieved', async () => {
    // Arrange
    const mockUserStatus = [{ status: 1 }];
    client.query.mockResolvedValueOnce({ rows: mockUserStatus }); // Mock the database query

    // Act
    const response = await request(app)
      .get('/api/travel/userStatus')
      .query({ trip_name: 'test trip', destination: 'test destination' })
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: true, loggedIn: true, userStatus: 'admin' });
  });

  it('should respond with json and status false when there is a database error', async () => {
    // Arrange
    client.query.mockImplementationOnce(() => Promise.reject(new Error('Database error'))); // Mock a database error

    // Act
    const response = await request(app)
      .get('/api/travel/userStatus')
      .query({ trip_name: 'test trip', destination: 'test destination' })
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: false, error: 'There was an error while retrieving user statuses from the database' });
  });

  afterEach(() => {
    client.query.mockReset();
  });
});

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

describe('POST /api/travel/applyToJoin', () => {
  let client;

  beforeEach(() => {
    client = new Client();
    jest.spyOn(client, 'query');
    app.set('db', client); // Make sure your app uses this client
  });

  it('should respond with json and status true when the user successfully applies to join the trip', async () => {
    // Arrange
    client.query.mockResolvedValueOnce({ rows: [] }); // Mock the database query to return no existing applications
    client.query.mockResolvedValueOnce({}); // Mock the database query to insert the application

    // Act
    const response = await request(app)
      .post('/api/travel/applyToJoin')
      .send({ trip_name: 'test trip', destination: 'test destination' })
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: true, loggedIn: true });
  });

  it('should respond with json and status false when the user has already applied to join the trip', async () => {
    // Arrange
    client.query.mockResolvedValueOnce({ rows: [{}] }); // Mock the database query to return an existing application

    // Act
    const response = await request(app)
      .post('/api/travel/applyToJoin')
      .send({ trip_name: 'test trip', destination: 'test destination' })
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: false, error: 'You have already applied to join this trip.' });
  });

  it('should respond with json and status false when there is a database error', async () => {
    // Arrange
    client.query.mockImplementationOnce(() => Promise.reject(new Error('Database error'))); // Mock a database error

    // Act
    const response = await request(app)
      .post('/api/travel/applyToJoin')
      .send({ trip_name: 'test trip', destination: 'test destination' })
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: false, error: 'There was an error while applying to join the trip' });
  });

  afterEach(() => {
    client.query.mockReset();
  });
});

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

describe('GET /api/travel/appliedUsers', () => {
  let client;

  beforeEach(() => {
    client = new Client();
    jest.spyOn(client, 'query');
    app.set('db', client); // Make sure your app uses this client
  });

  it('should respond with json and status true when the applied users are successfully retrieved', async () => {
    // Arrange
    const mockUsers = [{ user_id: 1, trip_name: 'test trip', destination: 'test destination', status: 3 }];
    client.query.mockResolvedValueOnce({ rows: mockUsers }); // Mock the database query

    // Act
    const response = await request(app)
      .get('/api/travel/appliedUsers')
      .query({ trip_name: 'test trip', destination: 'test destination' })
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: true, loggedIn: true, users: mockUsers });
  });

  it('should respond with json and status false when there is a database error', async () => {
    // Arrange
    client.query.mockImplementationOnce(() => Promise.reject(new Error('Database error'))); // Mock a database error

    // Act
    const response = await request(app)
      .get('/api/travel/appliedUsers')
      .query({ trip_name: 'test trip', destination: 'test destination' })
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: false, error: 'There was an error while retrieving applied users from the database' });
  });

  afterEach(() => {
    client.query.mockReset();
  });
});

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

describe('POST /api/travel/addUserToTrip', () => {
  let client;

  beforeEach(() => {
    client = new Client();
    jest.spyOn(client, 'query');
    app.set('db', client); // Make sure your app uses this client
  });

  it('should respond with json and status true when the user is successfully added to the trip', async () => {
    // Arrange
    client.query.mockResolvedValueOnce({}); // Mock the database query

    // Act
    const response = await request(app)
      .post('/api/travel/addUserToTrip')
      .send({ trip_name: 'test trip', destination: 'test destination', user_id: 1 })
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: true, loggedIn: true });
  });

  it('should respond with json and status false when there is a database error', async () => {
    // Arrange
    client.query.mockImplementationOnce(() => Promise.reject(new Error('Database error'))); // Mock a database error

    // Act
    const response = await request(app)
      .post('/api/travel/addUserToTrip')
      .send({ trip_name: 'test trip', destination: 'test destination', user_id: 1 })
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: false, error: 'There was an error while adding the user to the trip' });
  });

  afterEach(() => {
    client.query.mockReset();
  });
});

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

describe('POST /api/travel/declineUserToTrip', () => {
  let client;

  beforeEach(() => {
    client = new Client();
    jest.spyOn(client, 'query');
    app.set('db', client); // Make sure your app uses this client
  });

  it('should respond with json and status true when the user is successfully declined from the trip', async () => {
    // Arrange
    client.query.mockResolvedValueOnce({}); // Mock the database query

    // Act
    const response = await request(app)
      .post('/api/travel/declineUserToTrip')
      .send({ trip_name: 'test trip', destination: 'test destination', user_id: 1 })
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: true, loggedIn: true });
  });

  it('should respond with json and status false when there is a database error', async () => {
    // Arrange
    client.query.mockImplementationOnce(() => Promise.reject(new Error('Database error'))); // Mock a database error

    // Act
    const response = await request(app)
      .post('/api/travel/declineUserToTrip')
      .send({ trip_name: 'test trip', destination: 'test destination', user_id: 1 })
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: false, error: 'There was an error while declining the user to the trip' });
  });

  afterEach(() => {
    client.query.mockReset();
  });
});

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

describe('GET /api/travel/joinedUsers', () => {
  let client;

  beforeEach(() => {
    client = new Client();
    jest.spyOn(client, 'query');
    app.set('db', client); // Make sure your app uses this client
  });

  it('should respond with json and status true when the joined users are successfully retrieved', async () => {
    // Arrange
    const mockUsers = [{ user_id: 1, trip_name: 'test trip', destination: 'test destination', status: 2 }];
    client.query.mockResolvedValueOnce({ rows: mockUsers }); // Mock the database query

    // Act
    const response = await request(app)
      .get('/api/travel/joinedUsers')
      .query({ trip_name: 'test trip', destination: 'test destination' })
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: true, loggedIn: true, users: mockUsers });
  });

  it('should respond with json and status false when there is a database error', async () => {
    // Arrange
    client.query.mockImplementationOnce(() => Promise.reject(new Error('Database error'))); // Mock a database error

    // Act
    const response = await request(app)
      .get('/api/travel/joinedUsers')
      .query({ trip_name: 'test trip', destination: 'test destination' })
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: false, error: 'There was an error while retrieving joined users from the database' });
  });

  afterEach(() => {
    client.query.mockReset();
  });
});

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

describe('GET /api/travel/declinedUsers', () => {
  let client;

  beforeEach(() => {
    client = new Client();
    jest.spyOn(client, 'query');
    app.set('db', client); // Make sure your app uses this client
  });

  it('should respond with json and status true when the declined users are successfully retrieved', async () => {
    // Arrange
    const mockUsers = [{ user_id: 1, trip_name: 'test trip', destination: 'test destination', status: 4 }];
    client.query.mockResolvedValueOnce({ rows: mockUsers }); // Mock the database query

    // Act
    const response = await request(app)
      .get('/api/travel/declinedUsers')
      .query({ trip_name: 'test trip', destination: 'test destination' })
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: true, loggedIn: true, users: mockUsers });
  });

  it('should respond with json and status false when there is a database error', async () => {
    // Arrange
    client.query.mockImplementationOnce(() => Promise.reject(new Error('Database error'))); // Mock a database error

    // Act
    const response = await request(app)
      .get('/api/travel/declinedUsers')
      .query({ trip_name: 'test trip', destination: 'test destination' })
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: false, error: 'There was an error while retrieving declined users from the database' });
  });

  afterEach(() => {
    client.query.mockReset();
  });
});

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

describe('POST /api/travel/addChat', () => {
  let client;

  beforeEach(() => {
    client = new Client();
    jest.spyOn(client, 'query');
    app.set('db', client); // Make sure your app uses this client
    app.set('user', { name: 'test user' }); // Mock the user
  });

  it('should respond with json and status true when the chat is successfully added', async () => {
    // Arrange
    client.query.mockResolvedValueOnce({}); // Mock the database query

    // Act
    const response = await request(app)
      .post('/api/travel/addChat')
      .send({ trip_name: 'test trip', destination: 'test destination', message: 'test message' })
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: true, loggedIn: true });
  });

  it('should respond with json and status false when there is a database error', async () => {
    // Arrange
    client.query.mockImplementationOnce(() => Promise.reject(new Error('Database error'))); // Mock a database error

    // Act
    const response = await request(app)
      .post('/api/travel/addChat')
      .send({ trip_name: 'test trip', destination: 'test destination', message: 'test message' })
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: false, error: 'There was an error while adding the chat to the database' });
  });

  afterEach(() => {
    client.query.mockReset();
  });
});

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

describe('GET /api/travel/chats', () => {
  let client;

  beforeEach(() => {
    client = new Client();
    jest.spyOn(client, 'query');
    app.set('db', client); // Make sure your app uses this client
  });

  it('should respond with json and status true when the chats are successfully retrieved', async () => {
    // Arrange
    const mockChats = [{ username: 'test user', message: 'test trip test destination test message' }];
    client.query.mockResolvedValueOnce({ rows: mockChats }); // Mock the database query

    // Act
    const response = await request(app)
      .get('/api/travel/chats')
      .query({ trip_name: 'test trip', destination: 'test destination' })
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: true, loggedIn: true, chats: mockChats });
  });

  it('should respond with json and status false when there is a database error', async () => {
    // Arrange
    client.query.mockImplementationOnce(() => Promise.reject(new Error('Database error'))); // Mock a database error

    // Act
    const response = await request(app)
      .get('/api/travel/chats')
      .query({ trip_name: 'test trip', destination: 'test destination' })
      .set('Accept', 'application/json');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: false, error: 'There was an error while retrieving chats from the database' });
  });

  afterEach(() => {
    client.query.mockReset();
  });
});

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

describe('POST /verifyOTP', () => {
  let client;

  beforeEach(() => {
    client = new Client();
  });

  afterEach(() => {
    client.query.mockReset();
  });

  test('should verify OTP successfully', async () => {
    const mockRequest = {
      body: {
        email: 'test@example.com',
        OTP: '123456',
      },
    };

    const mockSelectResponse = {
      rows: [{ email: 'test@example.com', OTP: '123456' }],
    };

    client.query.mockResolvedValueOnce(mockSelectResponse); // Mock the SELECT query
    client.query.mockResolvedValueOnce(); // Mock the DELETE query

    const response = await request(app)
      .post('/verifyOTP')
      .send(mockRequest.body);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: true,
      success: true,
      message: 'OTP verified successfully',
    });
  });

  test('should fail to verify OTP', async () => {
    const mockRequest = {
      body: {
        email: 'test@example.com',
        OTP: '123456',
      },
    };

    const mockSelectResponse = {
      rows: [],
    };

    client.query.mockResolvedValueOnce(mockSelectResponse); // Mock the SELECT query
    client.query.mockResolvedValueOnce(); // Mock the DELETE query

    const response = await request(app)
      .post('/verifyOTP')
      .send(mockRequest.body);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: true,
      success: false,
      message: 'OTP verification failed',
    });
  });
});

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

describe('POST /addNotBookedTrainUser', () => {
  let client;

  beforeEach(() => {
    client = new Client();
  });

  afterEach(() => {
    client.query.mockReset();
  });

  it('should add not booked train user successfully', async () => {
    const mockRequest = {
      body: {
        train: {
          train_base: {
            train_no: '123',
          },
        },
        date: '2022-01-01',
        origin: 'originStation',
        destination: 'destinationStation',
      },
      user: {
        id: 'userId',
      },
    };
    const mockIsAuthenticated = jest.fn().mockReturnValue(true);
    app.request.isAuthenticated = mockIsAuthenticated;
    const mockDbResponse = {
      rows: [],
    };

    client.query.mockResolvedValueOnce(mockDbResponse); // For the first query
    client.query.mockResolvedValueOnce(mockDbResponse); // For the second query
    client.query.mockResolvedValueOnce(mockDbResponse); // For the third query
    client.query.mockResolvedValueOnce(mockDbResponse); // For the fourth query
    client.query.mockResolvedValueOnce(mockDbResponse); // For the fifth query
    client.query.mockResolvedValueOnce({ rows: [{ yet_to_book: 0 }] }); // For the sixth query
    client.query.mockResolvedValueOnce({ rows: [{ booked: 0 }] }); // For the seventh query

    const response = await request(app)
      .post('/addNotBookedTrainUser')
      .send(mockRequest.body);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: true,
      success: true,
      loggedIn: true,
      notBooked: 0,
      confirmed: 0,
    });
  });
});