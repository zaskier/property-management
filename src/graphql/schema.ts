export const schema = `
  "Astronomical data including sunrise, sunset, and moon cycles."
  type Astro {
    "The time of sunrise at the location."
    sunrise: String
    "The time of sunset at the location."
    sunset: String
    "The time of moonrise at the location."
    moonrise: String
    "The time of moonset at the location."
    moonset: String
    "The current phase of the moon."
    moonPhase: String
    "The percentage of the moon's surface illuminated by the sun."
    moonIllumination: Int
  }

  "Environmental metrics related to air quality."
  type AirQuality {
    "Carbon Monoxide levels."
    co: Float
    "Nitrogen Dioxide levels."
    no2: Float
    "Ozone levels."
    o3: Float
    "Sulfur Dioxide levels."
    so2: Float
    "Particulate Matter 2.5 levels."
    pm2_5: Float
    "Particulate Matter 10 levels."
    pm10: Float
    "US EPA index for air quality."
    usEpaIndex: Int
    "UK Defra index for air quality."
    gbDefraIndex: Int
  }

  "Detailed weather metrics at a specific observation time."
  type Weather {
    "The timestamp of the weather observation."
    observationTime: String
    "The current temperature in degrees Celsius."
    temperature: Int
    "Internal code for current weather condition."
    weatherCode: Int
    "List of URLs pointing to weather condition icons."
    weatherIcons: [String!]
    "List of textual descriptions for the current weather."
    weatherDescriptions: [String!]
    "The current wind speed."
    windSpeed: Int
    "The current wind direction degree."
    windDegree: Int
    "The current wind direction (e.g., 'SW')."
    windDir: String
    "Atmospheric pressure in millibars."
    pressure: Int
    "Precipitation amount in millimeters."
    precip: Float
    "Humidity percentage."
    humidity: Int
    "Cloud coverage percentage."
    cloudcover: Int
    "The 'feels like' temperature in degrees Celsius."
    feelslike: Int
    "Current UV index."
    uvIndex: Int
    "Visibility in kilometers."
    visibility: Int
    "Indicates if it is currently daytime at the location ('yes' or 'no')."
    isDay: String
    "Associated astronomical data."
    astro: Astro
    "Associated air quality metrics."
    airQuality: AirQuality
  }

  "Represents a real estate property and its associated data."
  type Property {
    "The unique identifier for the property."
    id: ID!
    "The city where the property is located."
    city: String!
    "The street address of the property."
    street: String!
    "The state or region where the property is located."
    state: String!
    "The postal code for the property."
    zipCode: String!
    "Current weather conditions at the property location, fetched from Weatherstack."
    weather: Weather
    "The latitude coordinate of the property city from weatherstack api."
    lat: Float
    "The longitude coordinate of the property city from weatherstack api."
    long: Float
    "The timestamp when the property record was created using ISO 8601 format."
    createdAt: String!
  }

  type Query {
    "Retrieve a list of properties, optionally filtered and sorted."
    properties(
      "Field to sort the properties by (e.g., 'createdAt')."
      sortBy: String
      "Sort order, either 'ASC' or 'DESC'."
      order: String
      "Filter properties by city."
      city: String
      "Filter properties by postal code."
      zipCode: String
      "Filter properties by state."
      state: String
    ): [Property!]!
    
    "Retrieve a specific property by its unique identifier."
    property(
      "The unique identifier of the property to retrieve."
      id: ID!
    ): Property
  }

  type Mutation {
    "Create a new property record."
    createProperty(
      "The city where the property is located."
      city: String!
      "The street address of the property."
      street: String!
      "The state or region where the property is located."
      state: String!
      "The postal code for the property."
      zipCode: String!
    ): Property!
    
    "Delete an existing property record by its unique identifier."
    deleteProperty(
      "The unique identifier of the property to delete."
      id: ID!
    ): Boolean!
  }

  scalar JSON
`;
