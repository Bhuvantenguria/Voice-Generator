import sys
import json
from TTS.api import TTS
import numpy as np
import soundfile as sf
import torch

def process_tts(text, output_path, voice_options):
    try:
        # Initialize TTS with the specified model
        tts = TTS(model_name="tts_models/en/vctk/vits")
        
        # Convert voice options from string to dict
        options = json.loads(voice_options)
        
        # Generate speech with modifications
        wav = tts.tts(
            text=text,
            speaker=options.get('speaker', 'p226'),  # Default speaker
            language=options.get('language', 'en')
        )
        
        # Apply voice modifications
        modified_wav = modify_voice(wav, options)
        
        # Save the audio file
        sf.write(output_path, modified_wav, tts.synthesizer.output_sample_rate)
        
        print(json.dumps({
            "success": True,
            "path": output_path
        }))
        
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": str(e)
        }))

def modify_voice(wav, options):
    # Convert to tensor for processing
    wav_tensor = torch.FloatTensor(wav)
    
    # Apply pitch modification
    if 'pitch' in options:
        wav_tensor = modify_pitch(wav_tensor, options['pitch'])
    
    # Apply speed modification
    if 'speed' in options:
        wav_tensor = modify_speed(wav_tensor, options['speed'])
    
    # Apply emotion-based modifications
    if 'emotions' in options:
        wav_tensor = apply_emotional_effects(wav_tensor, options['emotions'])
    
    return wav_tensor.numpy()

def modify_pitch(wav, pitch_factor):
    # Implementation of pitch shifting using PyTorch
    # This is a simplified version - you might want to use a more sophisticated approach
    stft = torch.stft(wav, n_fft=2048, hop_length=512, return_complex=True)
    freq_bins = torch.arange(stft.shape[1])
    shifted_bins = freq_bins * (2 ** (pitch_factor / 12))
    
    # Interpolate to new frequency bins
    real_part = torch.zeros_like(stft.real)
    imag_part = torch.zeros_like(stft.imag)
    
    for i in range(stft.shape[1]):
        if shifted_bins[i] < stft.shape[1]:
            real_part[:, i] = torch.nn.functional.interpolate(
                stft.real[:, i:i+1].unsqueeze(0),
                size=1,
                mode='linear'
            ).squeeze()
            imag_part[:, i] = torch.nn.functional.interpolate(
                stft.imag[:, i:i+1].unsqueeze(0),
                size=1,
                mode='linear'
            ).squeeze()
    
    shifted_stft = torch.complex(real_part, imag_part)
    return torch.istft(shifted_stft, n_fft=2048, hop_length=512)

def modify_speed(wav, speed_factor):
    # Implementation of speed modification
    indices = torch.arange(0, len(wav), speed_factor)
    indices = indices.long()
    return wav[indices]

def apply_emotional_effects(wav, emotions):
    # Apply emotional effects based on the emotion scores
    # This is a simplified implementation - you might want to use more sophisticated techniques
    
    if emotions.get('happiness', 0) > 50:
        # Make voice more energetic and higher pitched
        wav = modify_pitch(wav, 2)
        wav = apply_energy_boost(wav, 1.2)
    
    if emotions.get('sadness', 0) > 50:
        # Make voice lower and slower
        wav = modify_pitch(wav, -2)
        wav = modify_speed(wav, 1.2)
    
    if emotions.get('anger', 0) > 50:
        # Add intensity and slight distortion
        wav = apply_energy_boost(wav, 1.4)
        wav = add_distortion(wav, 0.1)
    
    return wav

def apply_energy_boost(wav, factor):
    return wav * factor

def add_distortion(wav, amount):
    return torch.tanh(wav * (1 + amount))

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print(json.dumps({
            "success": False,
            "error": "Invalid number of arguments"
        }))
    else:
        text = sys.argv[1]
        output_path = sys.argv[2]
        voice_options = sys.argv[3]
        process_tts(text, output_path, voice_options) 