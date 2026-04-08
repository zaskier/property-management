/**
 * Maps snake_case Weatherstack API response to camelCase GraphQL types.
 * Handles optional fields and nested objects (astro, air_quality).
 */
export const mapWeatherResponse = (data: any) => {
  if (!data) return null;

  return {
    observationTime: data.observation_time,
    temperature: data.temperature,
    weatherCode: data.weather_code,
    weatherIcons: data.weather_icons,
    weatherDescriptions: data.weather_descriptions,
    windSpeed: data.wind_speed,
    windDegree: data.wind_degree,
    windDir: data.wind_dir,
    pressure: data.pressure,
    precip: data.precip,
    humidity: data.humidity,
    cloudcover: data.cloudcover,
    feelslike: data.feelslike,
    uvIndex: data.uv_index,
    visibility: data.visibility,
    isDay: data.is_day,
    astro: data.astro ? {
      sunrise: data.astro.sunrise,
      sunset: data.astro.sunset,
      moonrise: data.astro.moonrise,
      moonset: data.astro.moonset,
      moonPhase: data.astro.moon_phase,
      moonIllumination: data.astro.moon_illumination
    } : null,
    airQuality: data.air_quality ? {
      co: parseFloat(data.air_quality.co),
      no2: parseFloat(data.air_quality.no2),
      o3: parseFloat(data.air_quality.o3),
      so2: parseFloat(data.air_quality.so2),
      pm2_5: parseFloat(data.air_quality.pm2_5),
      pm10: parseFloat(data.air_quality.pm10),
      usEpaIndex: parseInt(data.air_quality['us-epa-index']),
      gbDefraIndex: parseInt(data.air_quality['gb-defra-index'])
    } : null
  };
};
