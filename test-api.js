// Test script for WhatTheBeat API
// This creates a simple test audio file and sends it to the API

const fs = require('fs');

// Create a simple WAV file header for testing
function createTestWav() {
  const sampleRate = 44100;
  const duration = 1; // 1 second
  const numSamples = sampleRate * duration;
  const bytesPerSample = 2;
  const numChannels = 1;
  const byteRate = sampleRate * numChannels * bytesPerSample;

  const dataSize = numSamples * numChannels * bytesPerSample;
  const fileSize = 44 + dataSize; // 44 bytes for header + data

  const buffer = Buffer.alloc(fileSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(fileSize - 8, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk size
  buffer.writeUInt16LE(1, 20); // Audio format (PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(numChannels * bytesPerSample, 32);
  buffer.writeUInt16LE(bytesPerSample * 8, 34);

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Generate simple sine wave
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const frequency = 440; // A4 note
    const sample = Math.sin(2 * Math.PI * frequency * t) * 0.3;
    const value = Math.floor(sample * 32767);
    buffer.writeInt16LE(value, 44 + i * bytesPerSample);
  }

  return buffer;
}

async function testAPI() {
  console.log('Creating test audio file...');
  const audioBuffer = createTestWav();

  // Create a File-like object
  const blob = new Blob([audioBuffer], { type: 'audio/wav' });

  const formData = new FormData();
  formData.append('audio', blob, 'test.wav');

  console.log('Sending request to API...');

  try {
    const response = await fetch('https://whatthebeat.vercel.app/api/analyze', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ API Test Successful!');
      console.log('Response:', JSON.stringify(result, null, 2));
    } else {
      console.log('❌ API Test Failed');
      console.log('Error:', result.error);
      console.log('Status:', response.status);
    }
  } catch (error) {
    console.log('❌ Request Failed');
    console.log('Error:', error.message);
  }
}

// Check if running in Node.js environment
if (typeof window === 'undefined') {
  console.log('Note: This test needs to be run in a browser environment or with node-fetch');
  console.log('You can copy and paste this into the browser console on https://whatthebeat.vercel.app');
}

// Export for use in browser
if (typeof module !== 'undefined') {
  module.exports = { testAPI, createTestWav };
}