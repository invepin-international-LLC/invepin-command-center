import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

let faceDetector: any = null;
let faceEmbedder: any = null;

export class FaceRecognitionService {
  private static instance: FaceRecognitionService;
  private isInitialized = false;

  static getInstance(): FaceRecognitionService {
    if (!FaceRecognitionService.instance) {
      FaceRecognitionService.instance = new FaceRecognitionService();
    }
    return FaceRecognitionService.instance;
  }

  async initialize() {
    if (this.isInitialized) return;

    if (typeof window !== 'undefined' && !window.isSecureContext) {
      console.warn('Running in an insecure context. WebGPU and camera access may be restricted.');
    }

    try {
      console.log('Initializing face recognition models...');
      
      // Initialize face detection model with fallback to CPU
      try {
        faceDetector = await pipeline(
          'object-detection',
          'Xenova/yolov8n-face',
          { device: 'webgpu' }
        );
      } catch (webgpuError) {
        console.warn('WebGPU not available for face detection, falling back to CPU:', webgpuError);
        faceDetector = await pipeline(
          'object-detection',
          'Xenova/yolov8n-face'
        );
      }

      // Initialize face embedding model for recognition with fallback
      try {
        faceEmbedder = await pipeline(
          'feature-extraction',
          'Xenova/mobilefacenet',
          { device: 'webgpu' }
        );
      } catch (webgpuError) {
        console.warn('WebGPU not available for face embeddings, falling back to CPU:', webgpuError);
        faceEmbedder = await pipeline(
          'feature-extraction',
          'Xenova/mobilefacenet'
        );
      }

      this.isInitialized = true;
      console.log('Face recognition models initialized successfully');
    } catch (error) {
      console.error('Failed to initialize face recognition:', error);
      throw error;
    }
  }

  async detectFaces(imageElement: HTMLImageElement): Promise<any[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const results = await faceDetector(imageElement);
      return results.filter((result: any) => result.score > 0.7); // High confidence only
    } catch (error) {
      console.error('Face detection failed:', error);
      return [];
    }
  }

  async extractFaceEmbedding(imageElement: HTMLImageElement): Promise<number[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Crop face from image (simplified - in production you'd use the bounding box)
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // Resize to standard face recognition input size
      canvas.width = 112;
      canvas.height = 112;
      ctx.drawImage(imageElement, 0, 0, 112, 112);
      
      // Convert to tensor and get embedding
      const result = await faceEmbedder(canvas);
      return Array.from(result.data);
    } catch (error) {
      console.error('Face embedding extraction failed:', error);
      throw error;
    }
  }

  calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      throw new Error('Embeddings must have the same length');
    }

    // Calculate cosine similarity
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  async recognizeFace(imageElement: HTMLImageElement, knownEmbeddings: { bartenderId: string, name: string, embedding: number[] }[]): Promise<{
    recognized: boolean;
    bartenderId?: string;
    name?: string;
    confidence: number;
  }> {
    try {
      const faces = await this.detectFaces(imageElement);
      
      if (faces.length === 0) {
        return { recognized: false, confidence: 0 };
      }

      const faceEmbedding = await this.extractFaceEmbedding(imageElement);
      
      let bestMatch = { bartenderId: '', name: '', confidence: 0 };
      
      for (const known of knownEmbeddings) {
        const similarity = this.calculateSimilarity(faceEmbedding, known.embedding);
        if (similarity > bestMatch.confidence) {
          bestMatch = {
            bartenderId: known.bartenderId,
            name: known.name,
            confidence: similarity
          };
        }
      }

      // Threshold for recognition (adjust based on testing)
      const RECOGNITION_THRESHOLD = 0.8;
      
      if (bestMatch.confidence > RECOGNITION_THRESHOLD) {
        return {
          recognized: true,
          bartenderId: bestMatch.bartenderId,
          name: bestMatch.name,
          confidence: bestMatch.confidence
        };
      }

      return { recognized: false, confidence: bestMatch.confidence };
    } catch (error) {
      console.error('Face recognition failed:', error);
      return { recognized: false, confidence: 0 };
    }
  }
}

export const faceRecognitionService = FaceRecognitionService.getInstance();