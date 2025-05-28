export interface LocationInfo {
  latitude: number;
  longitude: number;
}

export interface DeviceInfo {
  deviceType: string;
  userAgent: string;
  screenResolution: string;
  platform: string;
  browser: string;
  timestamp: string;
  location?: LocationInfo | { error: string };
}