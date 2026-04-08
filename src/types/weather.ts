export interface WeatherstackError {
  code: number;
  type: string;
  info: string;
}

export interface RawWeatherData {
  observation_time?: string;
  temperature?: number;
  weather_code?: number;
  weather_icons?: string[];
  weather_descriptions?: string[];
  wind_speed?: number;
  wind_degree?: number;
  wind_dir?: string;
  pressure?: number;
  precip?: number;
  humidity?: number;
  cloudcover?: number;
  feelslike?: number;
  uv_index?: number;
  visibility?: number;
  is_day?: string;
  astro?: {
    sunrise?: string;
    sunset?: string;
    moonrise?: string;
    moonset?: string;
    moon_phase?: string;
    moon_illumination?: number;
  };
  air_quality?: {
    co?: string | number;
    no2?: string | number;
    o3?: string | number;
    so2?: string | number;
    pm2_5?: string | number;
    pm10?: string | number;
    'us-epa-index'?: string | number;
    'gb-defra-index'?: string | number;
  };
}

export interface WeatherstackResponse {
  success?: boolean;
  error?: WeatherstackError;
  location?: {
    name: string;
    country: string;
    region: string;
    lat: string;
    lon: string;
    timezone_id: string;
    localtime: string;
    localtime_epoch: number;
    utc_offset: string;
  };
  weather?: RawWeatherData;
}

export interface CacheEntry {
  data: WeatherstackResponse;
  expiry: number;
}

export interface WeatherstackConfig {
  WEATHER_API_KEY: string;
  WEATHER_API_URL: string;
}
