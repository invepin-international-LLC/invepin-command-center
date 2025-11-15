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
    const setupWalkieTalkie = async () => {
      console.log('[Walkie-Talkie] Setting up...');
      
      // Get user first
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('[Walkie-Talkie] Error getting user:', userError);
        toast({
          title: 'Authentication Error',
          description: 'Please log in to use walkie-talkie',
          variant: 'destructive',
        });
        return;
      }
      
      const presenceKey = currentUser?.id || `guest-${crypto.randomUUID()}`;
      if (!currentUser) {
        console.log('[Walkie-Talkie] No user logged in, proceeding as guest');
      } else {
        console.log('[Walkie-Talkie] User authenticated:', currentUser.id);
        setUser(currentUser);
      }
      
      // Set up Realtime channel for audio with unique name
      const channelName = 'walkie-talkie';
      const channel = supabase.channel(channelName, {
        config: {
          broadcast: { self: true },
          presence: { key: currentUser.id }
        }
      });
      
      console.log('[Walkie-Talkie] Setting up channel:', channelName);
      
      channel
        .on('broadcast', { event: 'audio-message' }, ({ payload }: { payload: AudioMessage }) => {
          console.log('[Walkie-Talkie] Received audio message from:', payload.user_id);
          if (payload.user_id !== currentUser.id) {
            playAudioMessage(payload);
          }
        })
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const userCount = Object.keys(state).length;
          console.log('[Walkie-Talkie] Online users:', userCount, state);
          setOnlineUsers(userCount);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('[Walkie-Talkie] User joined:', key, newPresences);
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('[Walkie-Talkie] User left:', key, leftPresences);
        })
        .subscribe(async (status) => {
          console.log('[Walkie-Talkie] Channel status:', status);
          
          if (status === 'SUBSCRIBED') {
            console.log('[Walkie-Talkie] Channel subscribed, tracking presence...');
            const trackStatus = await channel.track({
              user_id: currentUser.id,
              user_name: currentUser.email?.split('@')[0] || 'Unknown',
              online_at: new Date().toISOString(),
            });
            console.log('[Walkie-Talkie] Presence track status:', trackStatus);
            
            toast({
              title: '📻 Walkie-Talkie Active',
              description: 'Connected to team channel',
            });
          } else if (status === 'CHANNEL_ERROR') {
            console.error('[Walkie-Talkie] Channel error');
            toast({
              title: 'Connection Error',
              description: 'Could not connect to walkie-talkie channel',
              variant: 'destructive',
            });
          } else if (status === 'TIMED_OUT') {
            console.error('[Walkie-Talkie] Channel timed out');
            toast({
              title: 'Connection Timeout',
              description: 'Failed to connect - please try again',
              variant: 'destructive',
            });
          }
        });

      channelRef.current = channel;
    };
    
    setupWalkieTalkie();

    return () => {
      console.log('[Walkie-Talkie] Cleaning up channel');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      // Clean up audio context
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []); // Run once on mount

  const playAudioMessage = async (message: AudioMessage) => {
    try {
      console.log('[Walkie-Talkie] Playing audio message, type:', message.type);
      setIsPlaying(true);
      
      if (message.type === 'alarm') {
        console.log('[Walkie-Talkie] Playing alarm sound');
        // Play alarm sound
        const audio = new Audio();
        audio.src = 'data:audio/wav;base64,' + message.audio_data;
        
        audio.onended = () => {
          console.log('[Walkie-Talkie] Alarm finished playing');
          setIsPlaying(false);
        };
        
        audio.onerror = (e) => {
          console.error('[Walkie-Talkie] Alarm playback error:', e);
          setIsPlaying(false);
        };
        
        await audio.play();
      } else {
        console.log('[Walkie-Talkie] Playing voice message');
        // Play voice message
        try {
          const audioData = atob(message.audio_data);
          const arrayBuffer = new ArrayBuffer(audioData.length);
          const view = new Uint8Array(arrayBuffer);
          for (let i = 0; i < audioData.length; i++) {
            view[i] = audioData.charCodeAt(i);
          }

          if (!audioContextRef.current) {
            console.log('[Walkie-Talkie] Creating new AudioContext');
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          }

          console.log('[Walkie-Talkie] Decoding audio data, size:', arrayBuffer.byteLength);
          const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
          
          console.log('[Walkie-Talkie] Audio decoded successfully, duration:', audioBuffer.duration);
          const source = audioContextRef.current.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContextRef.current.destination);
          
          source.onended = () => {
            console.log('[Walkie-Talkie] Voice message finished playing');
            setIsPlaying(false);
          };
          
          source.start(0);
        } catch (decodeError) {
          console.error('[Walkie-Talkie] Error decoding audio:', decodeError);
          setIsPlaying(false);
          throw decodeError;
        }
      }

      toast({
        title: message.type === 'alarm' ? '🚨 Alarm Triggered' : '📻 Voice Message',
        description: `From ${message.user_name}`,
      });
    } catch (error) {
      console.error('[Walkie-Talkie] Error playing audio:', error);
      setIsPlaying(false);
      toast({
        title: 'Playback Error',
        description: 'Could not play audio message',
        variant: 'destructive',
      });
    }
  };

  const startRecording = async () => {
    try {
      console.log('[Walkie-Talkie] Starting recording...');
      
      // Check if microphone is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone access not supported on this device');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        } 
      });
      
      console.log('[Walkie-Talkie] Microphone stream obtained');

      // Check for supported MIME types
      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/wav')) {
          mimeType = 'audio/wav';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg';
        }
      }
      
      console.log('[Walkie-Talkie] Using MIME type:', mimeType);

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000
      });

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log('[Walkie-Talkie] Audio chunk received, size:', event.data.size);
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log('[Walkie-Talkie] Recording stopped, chunks:', audioChunksRef.current.length);
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        console.log('[Walkie-Talkie] Created audio blob, size:', audioBlob.size);
        await sendAudioMessage(audioBlob, 'voice');
        stream.getTracks().forEach(track => {
          track.stop();
          console.log('[Walkie-Talkie] Track stopped:', track.kind);
        });
      };

      mediaRecorder.onerror = (event: any) => {
        console.error('[Walkie-Talkie] MediaRecorder error:', event.error);
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
      };

      mediaRecorder.start(1000); // Collect data every second
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      
      console.log('[Walkie-Talkie] Recording started');

      toast({
        title: '🎙️ Recording',
        description: 'Release to send voice message',
      });
    } catch (error: any) {
      console.error('[Walkie-Talkie] Error starting recording:', error);
      
      let errorMessage = 'Could not access microphone';
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Microphone permission denied. Please enable in device settings.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No microphone found on this device';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Audio recording not supported on this device';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Microphone is being used by another application';
      }
      
      toast({
        title: 'Microphone Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    console.log('[Walkie-Talkie] Stopping recording, isRecording:', isRecording);
    if (mediaRecorderRef.current && isRecording) {
      if (mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        console.log('[Walkie-Talkie] MediaRecorder stopped');
      }
      setIsRecording(false);
    }
  };

  const sendAudioMessage = async (audioBlob: Blob, type: 'voice' | 'alarm') => {
    try {
      console.log('[Walkie-Talkie] Sending audio message, type:', type, 'size:', audioBlob.size);
      
      if (!channelRef.current) {
        console.error('[Walkie-Talkie] Channel not initialized');
        throw new Error('Channel not initialized');
      }
      
      const reader = new FileReader();
      
      reader.onerror = () => {
        console.error('[Walkie-Talkie] FileReader error');
        toast({
          title: 'Error',
          description: 'Failed to read audio data',
          variant: 'destructive',
        });
      };
      
      reader.onloadend = async () => {
        try {
          const base64Audio = (reader.result as string).split(',')[1];
          console.log('[Walkie-Talkie] Audio converted to base64, length:', base64Audio.length);

          const message: AudioMessage = {
            id: crypto.randomUUID(),
            user_id: user?.id || 'unknown',
            user_name: user?.email?.split('@')[0] || 'Unknown User',
            audio_data: base64Audio,
            timestamp: new Date().toISOString(),
            type,
          };

          console.log('[Walkie-Talkie] Broadcasting message...');
          const sendResult = await channelRef.current?.send({
            type: 'broadcast',
            event: 'audio-message',
            payload: message,
          });
          
          console.log('[Walkie-Talkie] Broadcast result:', sendResult);

          toast({
            title: type === 'alarm' ? '🚨 Alarm Sent' : '📻 Message Sent',
            description: `Broadcast to ${onlineUsers} users`,
          });
        } catch (broadcastError) {
          console.error('[Walkie-Talkie] Error broadcasting:', broadcastError);
          throw broadcastError;
        }
      };
      
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('[Walkie-Talkie] Error sending audio:', error);
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
