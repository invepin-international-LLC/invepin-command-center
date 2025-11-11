import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mic, MicOff, AlertTriangle, Volume2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioMessage {
  id: string;
  user_id: string;
  user_name: string;
  audio_data: string;
  timestamp: string;
  type: 'voice' | 'alarm';
}

export const WalkieTalkie = ({ className }: { className?: string }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [user, setUser] = useState<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const channelRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    
    // Set up Realtime channel for audio
    const channel = supabase.channel('walkie-talkie');
    
    channel
      .on('broadcast', { event: 'audio-message' }, ({ payload }: { payload: AudioMessage }) => {
        if (payload.user_id !== user?.id) {
          playAudioMessage(payload);
        }
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setOnlineUsers(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: user?.id,
            online_at: new Date().toISOString(),
          });
        }
      });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const playAudioMessage = async (message: AudioMessage) => {
    try {
      setIsPlaying(true);
      
      if (message.type === 'alarm') {
        // Play alarm sound
        const audio = new Audio();
        audio.src = 'data:audio/wav;base64,' + message.audio_data;
        await audio.play();
        audio.onended = () => setIsPlaying(false);
      } else {
        // Play voice message
        const audioData = atob(message.audio_data);
        const arrayBuffer = new ArrayBuffer(audioData.length);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < audioData.length; i++) {
          view[i] = audioData.charCodeAt(i);
        }

        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext();
        }

        const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => setIsPlaying(false);
        source.start(0);
      }

      toast({
        title: message.type === 'alarm' ? '🚨 Alarm Triggered' : '📻 Voice Message',
        description: `From ${message.user_name}`,
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  const startRecording = async () => {
    try {
      // Check if microphone is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone access not supported on this device');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      // Check for supported MIME types
      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/wav')) {
          mimeType = 'audio/wav';
        }
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType
      });

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendAudioMessage(audioBlob, 'voice');
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      toast({
        title: '🎙️ Recording',
        description: 'Release to send voice message',
      });
    } catch (error: any) {
      console.error('Error starting recording:', error);
      
      let errorMessage = 'Could not access microphone';
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Microphone permission denied. Please enable in device settings.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No microphone found on this device';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Audio recording not supported on this device';
      }
      
      toast({
        title: 'Microphone Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioMessage = async (audioBlob: Blob, type: 'voice' | 'alarm') => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];

        const message: AudioMessage = {
          id: crypto.randomUUID(),
          user_id: user?.id || 'unknown',
          user_name: user?.email?.split('@')[0] || 'Unknown User',
          audio_data: base64Audio,
          timestamp: new Date().toISOString(),
          type,
        };

        await channelRef.current?.send({
          type: 'broadcast',
          event: 'audio-message',
          payload: message,
        });

        toast({
          title: type === 'alarm' ? '🚨 Alarm Sent' : '📻 Message Sent',
          description: `Broadcast to ${onlineUsers} users`,
        });
      };
    } catch (error) {
      console.error('Error sending audio:', error);
      toast({
        title: 'Error',
        description: 'Failed to send audio message',
        variant: 'destructive',
      });
    }
  };

  const triggerAlarm = async (alarmType: 'siren' | 'alert' | 'warning') => {
    try {
      // Generate alarm sound using Web Audio API
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const ctx = audioContextRef.current;
      const duration = 2;
      const sampleRate = ctx.sampleRate;
      const buffer = ctx.createBuffer(1, sampleRate * duration, sampleRate);
      const data = buffer.getChannelData(0);

      // Generate different alarm patterns
      for (let i = 0; i < data.length; i++) {
        const t = i / sampleRate;
        switch (alarmType) {
          case 'siren':
            // Alternating high-low siren
            data[i] = Math.sin(2 * Math.PI * (800 + 400 * Math.sin(4 * Math.PI * t)) * t) * 0.3;
            break;
          case 'alert':
            // Rapid beeping
            data[i] = (Math.sin(2 * Math.PI * 1000 * t) * (Math.floor(t * 8) % 2)) * 0.3;
            break;
          case 'warning':
            // Deep warning tone
            data[i] = Math.sin(2 * Math.PI * 400 * t) * 0.3;
            break;
        }
      }

      // Convert buffer to WAV format
      const wavBuffer = audioBufferToWav(buffer);
      const audioBlob = new Blob([wavBuffer], { type: 'audio/wav' });
      
      // Play locally
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.play();

      // Broadcast to others
      await sendAudioMessage(audioBlob, 'alarm');
    } catch (error) {
      console.error('Error triggering alarm:', error);
      toast({
        title: 'Error',
        description: 'Failed to trigger alarm',
        variant: 'destructive',
      });
    }
  };

  const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
    const length = buffer.length * buffer.numberOfChannels * 2 + 44;
    const result = new ArrayBuffer(length);
    const view = new DataView(result);
    const channels = [];
    let offset = 0;
    let pos = 0;

    // Write WAV header
    const setUint16 = (data: number) => {
      view.setUint16(pos, data, true);
      pos += 2;
    };
    const setUint32 = (data: number) => {
      view.setUint32(pos, data, true);
      pos += 4;
    };

    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"
    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(buffer.numberOfChannels);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * buffer.numberOfChannels); // avg. bytes/sec
    setUint16(buffer.numberOfChannels * 2); // block-align
    setUint16(16); // 16-bit
    setUint32(0x61746164); // "data" - chunk
    setUint32(length - pos - 4); // chunk length

    // Write audio data
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    while (pos < length) {
      for (let i = 0; i < buffer.numberOfChannels; i++) {
        const sample = Math.max(-1, Math.min(1, channels[i][offset]));
        view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
        pos += 2;
      }
      offset++;
    }

    return result;
  };

  if (!user) return null;

  return (
    <Card className={cn('p-6', className)}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              📻 Walkie-Talkie
            </h3>
            <p className="text-sm text-muted-foreground">
              Push-to-talk communication & emergency alerts
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{onlineUsers} online</span>
          </div>
        </div>

        {/* Push to Talk */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Voice Communication</label>
          <Button
            size="lg"
            className="w-full"
            variant={isRecording ? 'destructive' : 'default'}
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            disabled={isPlaying}
          >
            {isRecording ? (
              <>
                <Mic className="h-5 w-5 mr-2 animate-pulse" />
                Recording... Release to Send
              </>
            ) : isPlaying ? (
              <>
                <Volume2 className="h-5 w-5 mr-2" />
                Playing Audio...
              </>
            ) : (
              <>
                <MicOff className="h-5 w-5 mr-2" />
                Hold to Talk
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Hold button to record, release to broadcast
          </p>
        </div>

        {/* Emergency Alarms */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Emergency Alarm Sounds
          </label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              onClick={() => triggerAlarm('siren')}
              disabled={isRecording || isPlaying}
              className="flex flex-col h-auto py-3"
            >
              <span className="text-2xl mb-1">🚨</span>
              <span className="text-xs">Siren</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => triggerAlarm('alert')}
              disabled={isRecording || isPlaying}
              className="flex flex-col h-auto py-3"
            >
              <span className="text-2xl mb-1">⚠️</span>
              <span className="text-xs">Alert</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => triggerAlarm('warning')}
              disabled={isRecording || isPlaying}
              className="flex flex-col h-auto py-3"
            >
              <span className="text-2xl mb-1">📢</span>
              <span className="text-xs">Warning</span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Broadcasts alarm sound to all connected users for threat deterrence
          </p>
        </div>
      </div>
    </Card>
  );
};
