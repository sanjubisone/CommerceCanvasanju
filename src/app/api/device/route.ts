import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const deviceInfo = await request.json();
    console.log('Received device info:', deviceInfo);
    
    // Here you can add logic to store the data in a database
    
    return NextResponse.json({ 
      message: 'Device info received successfully' 
    });
  } catch (error) {
    console.error('Error processing device info:', error);
    return NextResponse.json(
      { error: 'Failed to process device info' }, 
      { status: 500 }
    );
  }
}
