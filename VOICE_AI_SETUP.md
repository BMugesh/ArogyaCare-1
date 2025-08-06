# Voice AI Setup for Arogyamitra

## Overview
Arogyamitra now includes voice interaction capabilities using Vapi AI, allowing users to speak their health queries instead of typing them.

## Features
- 🎤 **Voice Input**: Speak your health symptoms and concerns
- 🗣️ **Natural Conversation**: AI responds in a conversational manner
- 🔄 **Auto-submission**: Voice transcripts are automatically submitted
- 🌍 **Multilingual**: Supports multiple Indian languages
- 📱 **Mobile Friendly**: Works on both desktop and mobile devices

## Setup Instructions

### 1. Get Vapi API Credentials
1. Sign up at [Vapi.ai](https://vapi.ai)
2. Create a new assistant for healthcare
3. Get your API key and Assistant ID

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_api_key_here
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_assistant_id_here
```

### 3. Vapi Assistant Configuration
Configure your Vapi assistant with these settings:

```json
{
  "name": "Arogyamitra Health Assistant",
  "model": {
    "provider": "openai",
    "model": "gpt-3.5-turbo",
    "temperature": 0.7,
    "systemMessage": "You are Arogyamitra, a healthcare AI assistant in India. Listen to users' health concerns and provide helpful medical guidance. Keep responses concise and always recommend consulting healthcare professionals for serious issues."
  },
  "voice": {
    "provider": "11labs",
    "voiceId": "pNInz6obpgDQGcFmaJgB"
  },
  "transcriber": {
    "provider": "deepgram",
    "model": "nova-2",
    "language": "en-IN"
  }
}
```

### 4. Usage
1. Click the microphone button in the health check interface
2. Speak your health concern clearly
3. The AI will transcribe your speech and provide health guidance
4. Click the microphone again to stop the conversation

## Features Integration

### Hospital Finding via Voice
- Say: "Find hospitals near me"
- Say: "I need a cardiologist nearby"
- Say: "Emergency clinics in my area"

### Appointment Booking via Voice
- Say: "Book appointment for fever"
- Say: "Schedule doctor visit for headache"
- Say: "I need to see a doctor for stomach pain"

### Health Queries
- Say: "I have fever and cough for 3 days"
- Say: "What should I do for severe headache?"
- Say: "I'm feeling chest pain"

## Technical Details

### Components
- `VapiWidget.tsx`: Main voice interface component
- `health-check/page.tsx`: Updated with voice integration
- Voice transcripts auto-populate the text input
- Seamless integration with existing AI backend

### Dependencies
- `@vapi-ai/web`: Vapi SDK for web applications
- `react-icons`: Icons for microphone UI

### Browser Support
- Chrome: Full support
- Firefox: Full support  
- Safari: Full support
- Edge: Full support
- Mobile browsers: Full support

## Troubleshooting

### Common Issues
1. **Microphone not working**: Check browser permissions
2. **No transcription**: Verify API credentials
3. **Poor recognition**: Speak clearly and closer to microphone
4. **Connection issues**: Check internet connection

### Browser Permissions
Make sure to allow microphone access when prompted by the browser.

## Security & Privacy
- Voice data is processed by Vapi's secure servers
- No voice recordings are stored locally
- All transcriptions are temporary and not logged
- HIPAA-compliant voice processing available with enterprise Vapi plans

## Future Enhancements
- [ ] Voice responses (text-to-speech)
- [ ] Offline voice recognition
- [ ] Voice commands for navigation
- [ ] Multi-language voice support
- [ ] Voice biometric authentication
