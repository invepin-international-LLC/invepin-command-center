import { useState, useRef, useCallback } from 'react';
import { faceRecognitionService } from '@/services/faceRecognition';

export const useCamera = () => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user', // Front camera
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsActive(true);
      }
    } catch (err) {
      console.error('Camera access failed:', err);
      setError('Camera access denied. Please allow camera permissions.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsActive(false);
  }, []);

  const capturePhoto = useCallback((): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      if (!videoRef.current || !isActive) {
        reject(new Error('Camera not active'));
        return;
      }

      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = canvas.toDataURL('image/jpeg', 0.8);
    });
  }, [isActive]);

  const detectFaces = useCallback(async (): Promise<any[]> => {
    try {
      const photo = await capturePhoto();
      return await faceRecognitionService.detectFaces(photo);
    } catch (error) {
      console.error('Face detection failed:', error);
      return [];
    }
  }, [capturePhoto]);

  return {
    videoRef,
    isActive,
    error,
    startCamera,
    stopCamera,
    capturePhoto,
    detectFaces
  };
};