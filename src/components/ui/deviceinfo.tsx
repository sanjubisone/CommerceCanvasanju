'use client';

import React, { useEffect, useState } from 'react';

const DeviceInfo: React.FC = () => {
  const [deviceInfo, setDeviceInfo] = useState<string>('');

  useEffect(() => {
    const userAgent = navigator.userAgent;
    let info = 'Unknown Device';

    if (/Android/i.test(userAgent)) {
      info = 'Android Device';
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      info = 'iOS Device';
    } else if (/Windows/i.test(userAgent)) {
      info = 'Windows Device';
    } else if (/Macintosh|Mac OS X/i.test(userAgent)) {
      info = 'macOS Device';
    } else if (/Linux/i.test(userAgent)) {
      info = 'Linux Device';
    }

    console.log('Detected Device:', info);
    setDeviceInfo(info);
  }, []);

  return (
    <div className="text-sm bg-gray-100 p-2 rounded-md m-2">
      <h2 className="font-semibold">Device Information</h2>
      <p>Detected Device: {deviceInfo}</p>
    </div>
  );
};

export default DeviceInfo;
