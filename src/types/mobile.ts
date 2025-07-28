export interface FaceEmbedding {
  id: string;
  bartenderId: string;
  embedding: number[];
  createdAt: string;
  confidence: number;
}

export interface FaceRecognitionResult {
  recognized: boolean;
  bartenderId?: string;
  confidence: number;
  name?: string;
}

export interface ClockEvent {
  id: string;
  bartenderId: string;
  type: 'clock_in' | 'clock_out';
  timestamp: string;
  method: 'face_recognition' | 'manual';
  confidence?: number;
  deviceId?: string;
  location?: string;
}

export interface MobileBartenderSession {
  bartenderId: string;
  name: string;
  clockedInAt: string;
  currentShift: {
    start: string;
    pours: number;
    accuracy: number;
    revenue: number;
  };
}