import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { initiateUpload, uploadFileToS3, completeUpload } from '@/services/api/videoApi';
import type { InitiateUploadDto } from '@/services/api/types';

export type UploadStep = 'idle' | 'initiating' | 'uploading' | 'completing' | 'processing' | 'success' | 'error';

interface UseVideoUploadReturn {
  step: UploadStep;
  progress: number;
  error: string | null;
  startUpload: (dto: InitiateUploadDto, videoFile: File, thumbnailFile?: File | null) => Promise<void>;
  reset: () => void;
}

export const useVideoUpload = (): UseVideoUploadReturn => {
  const [step, setStep] = useState<UploadStep>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStep('idle');
    setProgress(0);
    setError(null);
  }, []);

  const startUpload = useCallback(async (
    dto: InitiateUploadDto,
    videoFile: File,
    thumbnailFile?: File | null
  ) => {
    try {
      // Step 1: Initiate
      setStep('initiating');
      setProgress(0);
      const initResponse = await initiateUpload(dto);

      // Step 2: Upload video to S3
      setStep('uploading');
      await uploadFileToS3(initResponse.uploadUrls.video, videoFile, (p) => {
        // Scale video upload to 0-85% if thumbnail exists, 0-95% otherwise
        const scale = thumbnailFile ? 0.85 : 0.95;
        setProgress(Math.round(p * scale));
      });

      // Step 3: Upload thumbnail to S3 (if provided)
      if (thumbnailFile && initResponse.uploadUrls.thumbnail) {
        await uploadFileToS3(initResponse.uploadUrls.thumbnail, thumbnailFile, (p) => {
          setProgress(85 + Math.round(p * 0.1));
        });
      }

      setProgress(95);

      // Step 4: Complete upload → triggers transcoding
      setStep('completing');
      await completeUpload(initResponse.videoId);

      setProgress(100);
      setStep('processing');

      // The backend is now transcoding — we mark success from frontend perspective
      setTimeout(() => setStep('success'), 1500);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      setStep('error');
    }
  }, []);

  return { step, progress, error, startUpload, reset };
};
