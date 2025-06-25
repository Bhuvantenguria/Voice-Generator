import { VoiceEffects } from '../types/voice';
import { AudioContext, AudioBuffer } from 'web-audio-api';

export async function applyVoiceEffects(
  buffer: Buffer,
  effects: VoiceEffects
): Promise<{ buffer: Buffer }> {
  const audioContext = new AudioContext();
  
  try {
    // Convert Buffer to AudioBuffer
    const audioBuffer = await audioContext.decodeAudioData(buffer);
    
    // Create audio processing graph
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    
    let currentNode: AudioNode = source;
    
    // Apply reverb if enabled
    if (effects.reverb?.enabled) {
      const reverbNode = await createReverb(audioContext, effects.reverb);
      currentNode.connect(reverbNode);
      currentNode = reverbNode;
    }
    
    // Apply echo if enabled
    if (effects.echo?.enabled) {
      const echoNode = createEcho(audioContext, effects.echo);
      currentNode.connect(echoNode);
      currentNode = echoNode;
    }
    
    // Apply chorus if enabled
    if (effects.chorus?.enabled) {
      const chorusNode = createChorus(audioContext, effects.chorus);
      currentNode.connect(chorusNode);
      currentNode = chorusNode;
    }
    
    // Connect to destination
    const destination = audioContext.createMediaStreamDestination();
    currentNode.connect(destination);
    
    // Record the output
    const mediaRecorder = new MediaRecorder(destination.stream);
    const chunks: Blob[] = [];
    
    return new Promise((resolve, reject) => {
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        try {
          const blob = new Blob(chunks, { type: 'audio/wav' });
          const arrayBuffer = await blob.arrayBuffer();
          resolve({ buffer: Buffer.from(arrayBuffer) });
        } catch (error) {
          reject(error);
        }
      };
      
      // Start recording and playback
      mediaRecorder.start();
      source.start(0);
      
      // Stop after the duration of the buffer
      setTimeout(() => {
        mediaRecorder.stop();
        source.stop();
      }, audioBuffer.duration * 1000);
    });
  } finally {
    audioContext.close();
  }
}

async function createReverb(
  context: AudioContext,
  options: NonNullable<VoiceEffects['reverb']>
): Promise<ConvolverNode> {
  const convolver = context.createConvolver();
  
  // Create impulse response
  const duration = options.decay * 0.01 * 3; // Convert to seconds
  const decay = options.amount * 0.01;
  const rate = context.sampleRate;
  const length = rate * duration;
  
  const impulse = context.createBuffer(2, length, rate);
  for (let channel = 0; channel < 2; channel++) {
    const channelData = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  
  convolver.buffer = impulse;
  return convolver;
}

function createEcho(
  context: AudioContext,
  options: NonNullable<VoiceEffects['echo']>
): DelayNode {
  const delay = context.createDelay();
  const feedback = context.createGain();
  const filter = context.createBiquadFilter();
  
  delay.delayTime.value = options.delay / 1000;
  feedback.gain.value = options.feedback * 0.01;
  
  filter.type = 'lowpass';
  filter.frequency.value = 2000;
  
  delay.connect(feedback);
  feedback.connect(filter);
  filter.connect(delay);
  
  return delay;
}

function createChorus(
  context: AudioContext,
  options: NonNullable<VoiceEffects['chorus']>
): GainNode {
  const output = context.createGain();
  const voices = 3;
  
  for (let i = 0; i < voices; i++) {
    const delay = context.createDelay();
    const lfo = context.createOscillator();
    const lfoGain = context.createGain();
    
    delay.delayTime.value = 0.03 * (i + 1);
    lfo.frequency.value = options.rate * 0.01 * (i + 1);
    lfoGain.gain.value = options.depth * 0.0001 * (i + 1);
    
    lfo.connect(lfoGain);
    lfoGain.connect(delay.delayTime);
    delay.connect(output);
    
    lfo.start(0);
  }
  
  return output;
} 