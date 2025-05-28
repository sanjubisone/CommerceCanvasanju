'use client';

import React, { useEffect, useState } from 'react';

const DeviceInfo: React.FC = () => {
  const [deviceInfo, setDeviceInfo] = useState<string>('Loading...');
  const [browserName, setBrowserName] = useState<string>('Unknown');
  const [screenResolution, setScreenResolution] = useState<string>('');
  const [platform, setPlatform] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getBrowserName = (userAgent: string): string => {
      if (userAgent.includes("Firefox/")) return "Mozilla Firefox";
      if (userAgent.includes("Edg/")) return "Microsoft Edge";
      if (userAgent.includes("Chrome/")) return "Google Chrome";
      if (userAgent.includes("Safari/") && !userAgent.includes("Chrome/")) return "Safari";
      return "Unknown Browser";
    };

    const getUserDeviceInfo = async () => {
      const userAgent = navigator.userAgent;
      const resolution = `${window.screen.width}x${window.screen.height}`;
      const platform = navigator.platform;
      const browser = getBrowserName(userAgent);

      setBrowserName(browser);
      setScreenResolution(resolution);
      setPlatform(platform);

      const info: any = {
        deviceType: 'Unknown Device',
        userAgent,
        screenResolution: resolution,
        platform,
        browser,
        timestamp: new Date().toISOString()
      };

      // Detect device type
      if (/Android/i.test(userAgent)) {
        info.deviceType = 'Android Device';
      } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
        info.deviceType = 'iOS Device';
      } else if (/Windows/i.test(userAgent)) {
        info.deviceType = 'Windows Device';
      } else if (/Macintosh|Mac OS X/i.test(userAgent)) {
        info.deviceType = 'macOS Device';
      } else if (/Linux/i.test(userAgent)) {
        info.deviceType = 'Linux Device';
      }

      setDeviceInfo(info.deviceType);

      // Get location and send to server
      const sendToServer = async (data: any) => {
        try {
          const response = await fetch('/api/device', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) throw new Error('Failed to send device info');
        } catch (err) {
          console.error('Error sending device info:', err);
          setError('Device info भेजने में समस्या आई है');
        }
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            info.location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            sendToServer(info);
          },
          (geoError) => {
            console.warn('Location permission denied');
            sendToServer(info);
          }
        );
      } else {
        sendToServer(info);
      }
    };

    getUserDeviceInfo();
  }, []);

  return (
    <div className="text-sm bg-white shadow-md p-4 rounded-xl m-4 border border-gray-200 max-w-md">
      <h2 className="font-bold text-lg mb-2 text-gray-800">🔍 Device Information</h2>
      <p><strong>Device Type:</strong> {deviceInfo}</p>
      <p><strong>Browser:</strong> {browserName}</p>
      <p><strong>Screen Resolution:</strong> {screenResolution}</p>
      <p><strong>Platform:</strong> {platform}</p>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default DeviceInfo;
