import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, X, Film, Image, CheckCircle, AlertCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { categories, languages } from '@/data/mockData';

type UploadStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('');
  const [videoType, setVideoType] = useState<'movie' | 'series' | 'short'>('movie');

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        toast({ title: 'Invalid file type', description: 'Please select a video file.', variant: 'destructive' });
        return;
      }
      if (file.size > 500 * 1024 * 1024) {
        toast({ title: 'File too large', description: 'Maximum file size is 500MB.', variant: 'destructive' });
        return;
      }
      setVideoFile(file);
    }
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: 'Invalid file type', description: 'Please select an image file.', variant: 'destructive' });
        return;
      }
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const simulateUpload = async () => {
    if (!videoFile || !title || !category || !language) {
      toast({ title: 'Missing fields', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }

    setUploadStatus('uploading');
    setUploadProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 2) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setUploadProgress(i);
    }

    setUploadStatus('processing');

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setUploadStatus('success');
    toast({ title: 'Upload complete!', description: 'Your video has been uploaded successfully.' });

    // Reset after 2 seconds
    setTimeout(() => {
      navigate('/browse');
    }, 2000);
  };

  const getStatusMessage = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Uploading video...';
      case 'processing':
        return 'Processing video...';
      case 'success':
        return 'Upload successful!';
      case 'error':
        return 'Upload failed. Please try again.';
      default:
        return '';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">Upload Video</h1>
          <p className="text-muted-foreground mb-8">Share your content with the world</p>

          <div className="space-y-8">
            {/* Video Upload Section */}
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Film className="w-5 h-5 text-primary" />
                Video File
              </h2>

              {!videoFile ? (
                <div
                  onClick={() => videoInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <UploadIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground">MP4, WebM, MOV up to 500MB</p>
                </div>
              ) : (
                <div className="bg-secondary/50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Film className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium truncate max-w-xs">{videoFile.name}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(videoFile.size)}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={removeVideo} disabled={uploadStatus !== 'idle'}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoSelect}
                className="hidden"
              />
            </div>

            {/* Thumbnail Upload Section */}
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Image className="w-5 h-5 text-primary" />
                Thumbnail
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {!thumbnailPreview ? (
                  <div
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all aspect-video flex flex-col items-center justify-center"
                  >
                    <Image className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Upload thumbnail</p>
                  </div>
                ) : (
                  <div className="relative aspect-video rounded-xl overflow-hidden group">
                    <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="ghost" size="icon" onClick={removeThumbnail} className="text-white">
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">Recommended:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Resolution: 1280x720 or higher</li>
                    <li>Aspect ratio: 16:9</li>
                    <li>Format: JPG, PNG, WebP</li>
                    <li>Max size: 5MB</li>
                  </ul>
                </div>
              </div>

              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailSelect}
                className="hidden"
              />
            </div>

            {/* Video Details Form */}
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Video Details</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter video title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                    disabled={uploadStatus !== 'idle'}
                  />
                  <p className="text-xs text-muted-foreground text-right">{title.length}/100</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell viewers about your video"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    maxLength={5000}
                    disabled={uploadStatus !== 'idle'}
                  />
                  <p className="text-xs text-muted-foreground text-right">{description.length}/5000</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select value={category} onValueChange={setCategory} disabled={uploadStatus !== 'idle'}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter((c) => c !== 'All').map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Language *</Label>
                    <Select value={language} onValueChange={setLanguage} disabled={uploadStatus !== 'idle'}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.filter((l) => l !== 'All').map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={videoType} onValueChange={(v) => setVideoType(v as typeof videoType)} disabled={uploadStatus !== 'idle'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="movie">Movie</SelectItem>
                        <SelectItem value="series">Series</SelectItem>
                        <SelectItem value="short">Short</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Progress */}
            {uploadStatus !== 'idle' && (
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  {uploadStatus === 'success' ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : uploadStatus === 'error' ? (
                    <AlertCircle className="w-6 h-6 text-destructive" />
                  ) : (
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  )}
                  <span className="text-foreground font-medium">{getStatusMessage()}</span>
                </div>

                {(uploadStatus === 'uploading' || uploadStatus === 'processing') && (
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300 ease-out"
                      style={{ width: `${uploadStatus === 'processing' ? 100 : uploadProgress}%` }}
                    />
                  </div>
                )}

                {uploadStatus === 'uploading' && (
                  <p className="text-sm text-muted-foreground mt-2">{uploadProgress}% complete</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => navigate(-1)} disabled={uploadStatus !== 'idle'}>
                Cancel
              </Button>
              <Button
                onClick={simulateUpload}
                disabled={!videoFile || !title || !category || !language || uploadStatus !== 'idle'}
                className="min-w-[140px]"
              >
                {uploadStatus === 'idle' ? (
                  <>
                    <UploadIcon className="w-4 h-4 mr-2" />
                    Upload Video
                  </>
                ) : (
                  'Uploading...'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UploadPage;
