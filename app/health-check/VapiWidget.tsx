import React, { useState, useEffect } from 'react';
import Vapi from '@vapi-ai/web';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

interface VapiWidgetProps {
  apiKey: string;
  assistantId: string;
  onTranscript?: (transcript: string) => void;
  onResponse?: (response: string) => void;
}

const VapiWidget: React.FC<VapiWidgetProps> = ({ 
  apiKey, 
  assistantId, 
  onTranscript, 
  onResponse 
}) => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const vapiInstance = new Vapi(apiKey);
    setVapi(vapiInstance);

    vapiInstance.on('call-start', () => {
      setIsCallActive(true);
      setIsListening(true);
    });
    
    vapiInstance.on('call-end', () => {
      setIsCallActive(false);
      setIsSpeaking(false);
      setIsListening(false);
    });
    
    vapiInstance.on('speech-start', () => setIsSpeaking(true));
    vapiInstance.on('speech-end', () => setIsSpeaking(false));
    
    // Handle transcripts (user speech)
    vapiInstance.on('transcript', (transcript: any) => {
      if (transcript?.user && onTranscript) {
        onTranscript(transcript.user);
      }
    });

    // Handle AI responses
    vapiInstance.on('message', (message: any) => {
      if (message?.type === 'assistant-response' && onResponse) {
        onResponse(message.content);
      }
    });
    
    vapiInstance.on('error', (error: any) => {
      console.error('Vapi error:', error);
      setIsCallActive(false);
      setIsSpeaking(false);
      setIsListening(false);
    });

    return () => vapiInstance?.stop();
  }, [apiKey, onTranscript, onResponse]);

  const toggleCall = () => {
    if (!vapi) return;
    
    if (isCallActive) {
      vapi.stop();
    } else {
      vapi.start(assistantId);
    }
  };

  return (
    <div style={{
      marginBottom: '7px',
      height: '100%',
      width: '100%'
    }}>
      <button
        onClick={toggleCall}
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          border: '2px solid rgb(164, 93, 186)',
          background: isCallActive 
            ? 'rgba(255, 80, 80, 0.1)' 
            : 'rgba(59, 130, 246, 0.1)',
          color: isCallActive ? '#ff4646' : '#3b82f6',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          position: 'relative',
        }}
        title={isCallActive ? 'Stop voice chat' : 'Start voice chat'}
      >
        {isCallActive ? (
          <FaMicrophoneSlash size={20} />
        ) : (
          <FaMicrophone size={20} style={{ color: 'white' }} />
        )}

        {(isSpeaking || isListening) && (
          <div style={{
            position: 'absolute',
            inset: '-6px',
            borderRadius: '50%',
            border: `2px solid ${isCallActive ? 'rgba(255, 70, 70, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`,
            animation: 'pulse 1.5s infinite',
            pointerEvents: 'none',
          }} />
        )}
      </button>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          70% { transform: scale(1.3); opacity: 0.5; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default VapiWidget;
