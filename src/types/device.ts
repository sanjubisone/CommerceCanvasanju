export interface DeviceInfo {
  deviceType: string;
  userAgent: string;
  screenResolution: string;
  platform: string;
  browser: string;
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}