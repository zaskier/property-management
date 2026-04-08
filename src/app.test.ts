import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import { FastifyInstance } from 'fastify';

// Mock Data Source to avoid real DB connection in E2E tests
jest.unstable_mockModule('./database/data-source.js', () => ({
  AppDataSource: {
    initialize: jest.fn().mockResolvedValue(undefined),
    destroy: jest.fn().mockResolvedValue(undefined),
    isInitialized: true,
    getRepository: jest.fn()
  }
}));

// Mock WeatherstackService to avoid real API calls
jest.unstable_mockModule('./services/WeatherstackService.js', () => ({
  WeatherstackService: jest.fn().mockImplementation(() => ({
    fetchCurrentWeather: jest.fn().mockResolvedValue({
      location: { lat: '34.0522', lon: '-118.2437' },
      weather: {
        temperature: 25,
        weather_descriptions: ['Clear'],
        astro: {
          sunrise: '06:00 AM',
          sunset: '08:00 PM',
          moon_phase: 'Full Moon'
        },
        air_quality: {
          co: '1.2',
          'us-epa-index': '1'
        }
      }
    })
  }))
}));

// Dynamic imports required for ESM mocking
const { buildApp } = await import('./index.js');
const { AppDataSource } = await import('./database/data-source.js');

describe('App E2E', () => {
  let app: FastifyInstance;
  let mockTypeormRepo: {
    create: jest.Mock;
    save: jest.Mock;
    findOneBy: jest.Mock;
    delete: jest.Mock;
    createQueryBuilder: jest.Mock;
  };

  beforeAll(async () => {
    mockTypeormRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn()
    };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockTypeormRepo);

    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Mutation createProperty should call service and return property with nested typed weather', async () => {
    const propertyData = {
      id: 'uuid-123',
      city: 'Los Angeles',
      street: 'Sunset Blvd',
      state: 'CA',
      zipCode: '90001',
      weather: {
        temperature: 25,
        weather_descriptions: ['Clear'],
        astro: {
          sunrise: '06:00 AM',
          sunset: '08:00 PM',
          moon_phase: 'Full Moon'
        },
        air_quality: {
          co: '1.2',
          'us-epa-index': '1'
        }
      },
      lat: 34.0522,
      long: -118.2437
    };

    mockTypeormRepo.create.mockReturnValue(propertyData);
    mockTypeormRepo.save.mockResolvedValue(propertyData);

    const query = `
      mutation {
        createProperty(
          city: "Los Angeles",
          street: "Sunset Blvd",
          state: "CA",
          zipCode: "90001"
        ) {
          id
          city
          weather {
            temperature
            weatherDescriptions
            astro {
              sunrise
              moonPhase
            }
            airQuality {
              co
              usEpaIndex
            }
          }
        }
      }
    `;

    const response = await app.inject({
      method: 'POST',
      url: '/graphql',
      payload: { query }
    });

    const result = JSON.parse(response.body);
    expect(response.statusCode).toBe(200);
    expect(result.data.createProperty.weather.temperature).toBe(25);
    expect(result.data.createProperty.weather.astro.sunrise).toBe('06:00 AM');
    expect(result.data.createProperty.weather.astro.moonPhase).toBe('Full Moon');
    expect(result.data.createProperty.weather.airQuality.co).toBe(1.2);
    expect(result.data.createProperty.weather.airQuality.usEpaIndex).toBe(1);
  });

  it('Query properties should return list of properties', async () => {
    const mockProperties = [
      { id: '1', city: 'NY' },
      { id: '2', city: 'LA' }
    ];

    const mockQueryBuilder = {
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockProperties)
    };
    mockTypeormRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);

    const query = `
      query {
        properties {
          id
          city
        }
      }
    `;

    const response = await app.inject({
      method: 'POST',
      url: '/graphql',
      payload: { query }
    });

    const result = JSON.parse(response.body);
    expect(response.statusCode).toBe(200);
    expect(result.data.properties).toHaveLength(2);
  });

  it('Query properties should support filtering by city', async () => {
    const mockQueryBuilder = {
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([])
    };
    mockTypeormRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);

    const query = `
      query {
        properties(city: "New York") {
          id
        }
      }
    `;

    await app.inject({
      method: 'POST',
      url: '/graphql',
      payload: { query }
    });

    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('property.city = :city', {
      city: 'New York'
    });
  });

  it('Query properties should support sorting', async () => {
    const mockQueryBuilder = {
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([])
    };
    mockTypeormRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);

    const query = `
      query {
        properties(sortBy: "createdAt", order: "ASC") {
          id
        }
      }
    `;

    await app.inject({
      method: 'POST',
      url: '/graphql',
      payload: { query }
    });

    expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('property.createdAt', 'ASC');
  });

  it('Mutation deleteProperty should delete a property', async () => {
    mockTypeormRepo.delete.mockResolvedValue({ affected: 1 });

    const query = `
      mutation {
        deleteProperty(id: "uuid-123")
      }
    `;

    const response = await app.inject({
      method: 'POST',
      url: '/graphql',
      payload: { query }
    });

    const result = JSON.parse(response.body);
    expect(response.statusCode).toBe(200);
    expect(result.data.deleteProperty).toBe(true);
    expect(mockTypeormRepo.delete).toHaveBeenCalledWith('uuid-123');
  });
});
