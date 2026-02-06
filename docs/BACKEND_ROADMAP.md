# StreamVault Backend Roadmap & API Documentation

> Complete technical specification for transitioning from mock data to a production-ready backend.

---

## 📑 Table of Contents

1. [Project Overview](#-project-overview)
2. [Current Architecture](#-current-architecture)
3. [Target Architecture](#-target-architecture)
4. [Database Schema](#-database-schema)
5. [Storage Configuration](#-storage-configuration)
6. [API Specifications](#-api-specifications)
7. [Authentication System](#-authentication-system)
8. [Frontend Integration](#-frontend-integration)
9. [Implementation Phases](#-implementation-phases)
10. [Error Handling](#-error-handling)
11. [Security Considerations](#-security-considerations)
12. [Testing Strategy](#-testing-strategy)

---

## 🎯 Project Overview

### What is StreamVault?
StreamVault is a video streaming platform that allows users to:
- Browse and watch videos across multiple categories
- Upload their own video content
- Interact with videos (like, save, track progress)
- Watch live streams
- Manage their profile and preferences

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + TypeScript | UI Components |
| **Build Tool** | Vite | Fast development & bundling |
| **Styling** | Tailwind CSS + shadcn/ui | Design system |
| **Routing** | React Router v6 | Client-side navigation |
| **State** | React Query + Context | Server state & global state |
| **Backend** | Lovable Cloud (Supabase) | Database, Auth, Storage, Functions |
| **Database** | PostgreSQL | Relational data storage |
| **Storage** | Supabase Storage | Video & image files |
| **Functions** | Deno Edge Functions | API logic |

---

## 🏗️ Current Architecture

### How It Works Now (Mock Data)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CURRENT STATE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   src/data/mockData.ts                                                       │
│   ├── mockVideos: Video[]          ──→  VideoCarousel, VideoCard            │
│   ├── liveStreams: Video[]         ──→  Live page                           │
│   ├── featuredVideo: Video         ──→  HeroBanner                          │
│   ├── mockUser: User               ──→  AuthContext, Profile                │
│   ├── categories: string[]         ──→  Browse filters                      │
│   └── languages: string[]          ──→  Browse filters                      │
│                                                                              │
│   src/contexts/AuthContext.tsx                                               │
│   ├── login() → localStorage       ──→  Fake auth, always succeeds          │
│   ├── signup() → localStorage      ──→  Fake signup, always succeeds        │
│   └── logout() → clear storage     ──→  Removes local data                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Current Files Structure

```
src/
├── contexts/
│   └── AuthContext.tsx          # Mock authentication (to be replaced)
├── data/
│   └── mockData.ts              # Static data (to be replaced with API calls)
├── pages/
│   ├── Index.tsx                # Landing page
│   ├── Home.tsx                 # Authenticated home
│   ├── Browse.tsx               # Video discovery
│   ├── Watch.tsx                # Video player
│   ├── Live.tsx                 # Live streams
│   ├── Upload.tsx               # Video upload
│   ├── Profile.tsx              # User profile
│   ├── Login.tsx                # Login form
│   └── Signup.tsx               # Signup form
└── components/
    └── video/
        ├── VideoCard.tsx        # Video thumbnail card
        ├── VideoCarousel.tsx    # Horizontal video list
        └── HeroBanner.tsx       # Featured video banner
```

### Problems with Current Approach

| Issue | Impact |
|-------|--------|
| No data persistence | Data lost on refresh |
| No real authentication | Anyone can "login" |
| No file uploads | Can't upload videos |
| No user isolation | All users see same data |
| No real-time updates | Live features don't work |

---

## 🎯 Target Architecture

### How It Will Work (Real Backend)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              TARGET STATE                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   FRONTEND (React)                                                           │
│   ├── React Query Hooks                                                      │
│   │   ├── useVideos()           ──→  Fetch from /videos API                 │
│   │   ├── useVideo(id)          ──→  Fetch from /videos/:id API             │
│   │   ├── useProfile()          ──→  Fetch from /profile API                │
│   │   └── useInteractions()     ──→  Like, Save, Progress APIs              │
│   │                                                                          │
│   ├── Auth Context (Supabase)                                                │
│   │   ├── supabase.auth.signUp()                                            │
│   │   ├── supabase.auth.signIn()                                            │
│   │   └── supabase.auth.onAuthStateChange()                                 │
│   │                                                                          │
│   └── Storage Uploads                                                        │
│       ├── supabase.storage.upload('videos', file)                           │
│       └── supabase.storage.upload('thumbnails', file)                       │
│                                                                              │
│   ────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│   BACKEND (Supabase)                                                         │
│   ├── Edge Functions (API Layer)                                             │
│   │   ├── GET  /videos              → List videos with filters              │
│   │   ├── GET  /videos/:id          → Single video details                  │
│   │   ├── POST /videos              → Create video metadata                 │
│   │   ├── DEL  /videos/:id          → Delete video                          │
│   │   ├── POST /videos/:id/like     → Toggle like                           │
│   │   ├── POST /videos/:id/save     → Toggle save                           │
│   │   ├── POST /videos/:id/progress → Update watch progress                 │
│   │   ├── GET  /profile             → Get user profile                      │
│   │   ├── PATCH /profile            → Update profile                        │
│   │   └── GET  /profile/history     → Watch history                         │
│   │                                                                          │
│   ├── Database (PostgreSQL)                                                  │
│   │   ├── profiles                  → User profiles                         │
│   │   ├── videos                    → Video metadata                        │
│   │   └── user_video_interactions   → Likes, saves, progress                │
│   │                                                                          │
│   └── Storage Buckets                                                        │
│       ├── videos/                   → Video files (private)                 │
│       └── thumbnails/               → Thumbnail images (public)             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────────────────┐     ┌─────────────────────────┐
│      auth.users         │     │       profiles          │
│  (Supabase managed)     │     │                         │
├─────────────────────────┤     ├─────────────────────────┤
│ id (UUID) PK            │←────│ user_id (UUID) FK       │
│ email                   │     │ id (UUID) PK            │
│ created_at              │     │ username                │
│ ...                     │     │ avatar_url              │
└─────────────────────────┘     │ bio                     │
         │                      │ created_at              │
         │                      │ updated_at              │
         │                      └─────────────────────────┘
         │
         │                      ┌─────────────────────────┐
         │                      │        videos           │
         │                      ├─────────────────────────┤
         ├─────────────────────→│ user_id (UUID) FK       │
         │                      │ id (UUID) PK            │
         │                      │ title                   │
         │                      │ description             │
         │                      │ thumbnail_url           │
         │                      │ video_url               │
         │                      │ duration                │
         │                      │ category                │
         │                      │ language                │
         │                      │ type                    │
         │                      │ rating                  │
         │                      │ year                    │
         │                      │ views                   │
         │                      │ is_live                 │
         │                      │ viewer_count            │
         │                      │ status                  │
         │                      │ created_at              │
         │                      │ updated_at              │
         │                      └───────────┬─────────────┘
         │                                  │
         │                                  │
         │     ┌────────────────────────────┴──────────────────────────┐
         │     │              user_video_interactions                   │
         │     ├───────────────────────────────────────────────────────┤
         └────→│ user_id (UUID) FK                                     │
               │ video_id (UUID) FK ───────────────────────────────────┘
               │ id (UUID) PK
               │ liked (boolean)
               │ saved (boolean)
               │ watch_progress (integer) -- seconds watched
               │ last_watched_at (timestamp)
               │ created_at
               │ updated_at
               │ UNIQUE(user_id, video_id)
               └───────────────────────────────────────────────────────┘
```

### Table: `profiles`

Stores additional user information beyond auth.users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| `user_id` | UUID | FK → auth.users, UNIQUE, NOT NULL | Reference to auth user |
| `username` | TEXT | NOT NULL | Display name |
| `avatar_url` | TEXT | NULLABLE | Profile picture URL |
| `bio` | TEXT | NULLABLE | User biography |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Last update timestamp |

**RLS Policies:**
```sql
-- Anyone can view profiles (for displaying usernames on videos)
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- Users can only insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Table: `videos`

Stores all video metadata.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| `user_id` | UUID | FK → auth.users, NOT NULL | Video uploader |
| `title` | TEXT | NOT NULL | Video title |
| `description` | TEXT | NULLABLE | Video description |
| `thumbnail_url` | TEXT | NULLABLE | Thumbnail image URL |
| `video_url` | TEXT | NULLABLE | Video file URL |
| `duration` | TEXT | NULLABLE | Duration string (e.g., "2h 34m") |
| `category` | TEXT | NOT NULL, DEFAULT 'Uncategorized' | Video category |
| `language` | TEXT | DEFAULT 'English' | Video language |
| `type` | TEXT | CHECK (movie/series/live/short) | Content type |
| `rating` | DECIMAL(2,1) | DEFAULT 0 | Average rating (0-5) |
| `year` | INTEGER | DEFAULT current year | Release year |
| `views` | INTEGER | DEFAULT 0 | View count |
| `is_live` | BOOLEAN | DEFAULT false | Is live stream |
| `viewer_count` | INTEGER | DEFAULT 0 | Current live viewers |
| `status` | TEXT | CHECK (processing/ready/failed) | Processing status |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Upload timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Last update |

**RLS Policies:**
```sql
-- Anyone can view videos that are ready
CREATE POLICY "Videos are viewable by everyone"
  ON videos FOR SELECT USING (status = 'ready' OR auth.uid() = user_id);

-- Users can insert their own videos
CREATE POLICY "Users can upload videos"
  ON videos FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own videos
CREATE POLICY "Users can update own videos"
  ON videos FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own videos
CREATE POLICY "Users can delete own videos"
  ON videos FOR DELETE USING (auth.uid() = user_id);
```

### Table: `user_video_interactions`

Tracks user engagement with videos.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| `user_id` | UUID | FK → auth.users, NOT NULL | User reference |
| `video_id` | UUID | FK → videos ON DELETE CASCADE, NOT NULL | Video reference |
| `liked` | BOOLEAN | DEFAULT false | User liked this video |
| `saved` | BOOLEAN | DEFAULT false | User saved this video |
| `watch_progress` | INTEGER | DEFAULT 0 | Seconds watched |
| `last_watched_at` | TIMESTAMPTZ | NULLABLE | Last watch timestamp |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Last update |

**Constraints:**
- `UNIQUE(user_id, video_id)` - One interaction record per user per video

**RLS Policies:**
```sql
-- Users can only view their own interactions
CREATE POLICY "Users can view own interactions"
  ON user_video_interactions FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own interactions
CREATE POLICY "Users can create interactions"
  ON user_video_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own interactions
CREATE POLICY "Users can update own interactions"
  ON user_video_interactions FOR UPDATE USING (auth.uid() = user_id);
```

---

## 📦 Storage Configuration

### Bucket: `videos`

**Purpose:** Store uploaded video files

| Setting | Value | Reason |
|---------|-------|--------|
| Public | No | Videos should only be accessible to authenticated users |
| Max File Size | 500MB | Balance between quality and storage costs |
| Allowed MIME Types | video/mp4, video/webm, video/quicktime | Common web video formats |

**RLS Policies:**
```sql
-- Users can view videos (for streaming)
CREATE POLICY "Authenticated users can view videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'videos' AND auth.role() = 'authenticated');

-- Users can upload to their own folder
CREATE POLICY "Users can upload own videos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'videos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete their own videos
CREATE POLICY "Users can delete own videos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'videos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

**File Path Structure:**
```
videos/
├── {user_id}/
│   ├── {video_id}.mp4
│   ├── {video_id}.mp4
│   └── ...
```

### Bucket: `thumbnails`

**Purpose:** Store video thumbnail images

| Setting | Value | Reason |
|---------|-------|--------|
| Public | Yes | Thumbnails need to be publicly viewable |
| Max File Size | 5MB | Thumbnails should be optimized |
| Allowed MIME Types | image/jpeg, image/png, image/webp | Common image formats |

**File Path Structure:**
```
thumbnails/
├── {user_id}/
│   ├── {video_id}.jpg
│   ├── {video_id}.jpg
│   └── ...
```

---

## 🔌 API Specifications

### Base Configuration

**Base URL:** `https://xgicplexczvhxeimtyye.supabase.co/functions/v1`

**Headers (All Requests):**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {access_token}",
  "apikey": "{anon_key}"
}
```

**CORS Headers (All Responses):**
```json
{
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
}
```

---

### API 1: List Videos

**Endpoint:** `GET /videos`

**Purpose:** Fetch videos with optional filtering, sorting, and pagination.

**Authentication:** Optional (public videos shown to anonymous, all videos to authenticated)

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `category` | string | No | - | Filter by category (e.g., "Action", "Comedy") |
| `language` | string | No | - | Filter by language (e.g., "English") |
| `type` | string | No | - | Filter by type: "movie", "series", "live", "short" |
| `search` | string | No | - | Search in title and description |
| `page` | number | No | 1 | Page number for pagination |
| `limit` | number | No | 20 | Items per page (max: 50) |
| `sort` | string | No | "created_at" | Sort field: "views", "rating", "created_at", "title" |
| `order` | string | No | "desc" | Sort order: "asc" or "desc" |
| `user_id` | string | No | - | Filter by uploader |

#### Example Request

```bash
GET /videos?category=Action&limit=10&sort=views&order=desc
Authorization: Bearer eyJhbGciOiJIUzI1...
```

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "videos": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "title": "The Last Frontier",
        "description": "An epic journey through uncharted territories...",
        "thumbnail_url": "https://xgicplexczvhxeimtyye.supabase.co/storage/v1/object/public/thumbnails/user123/video1.jpg",
        "duration": "2h 34m",
        "category": "Action",
        "language": "English",
        "type": "movie",
        "rating": 4.8,
        "year": 2024,
        "views": 2400000,
        "views_formatted": "2.4M",
        "is_live": false,
        "status": "ready",
        "created_at": "2024-01-15T10:30:00Z",
        "user": {
          "id": "user-uuid-here",
          "username": "FilmMaker",
          "avatar_url": "https://..."
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total_items": 156,
      "total_pages": 16,
      "has_next": true,
      "has_prev": false
    },
    "filters_applied": {
      "category": "Action",
      "sort": "views",
      "order": "desc"
    }
  }
}
```

#### Error Responses

| Status | Code | Message |
|--------|------|---------|
| 400 | INVALID_PARAMS | "Invalid sort field. Allowed: views, rating, created_at, title" |
| 400 | INVALID_PARAMS | "Page must be a positive integer" |
| 500 | SERVER_ERROR | "Failed to fetch videos" |

---

### API 2: Get Single Video

**Endpoint:** `GET /videos/:id`

**Purpose:** Fetch complete details for a single video including user's interaction.

**Authentication:** Optional (includes user interaction if authenticated)

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | Video ID |

#### Example Request

```bash
GET /videos/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer eyJhbGciOiJIUzI1...
```

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "The Last Frontier",
    "description": "An epic journey through uncharted territories where survival meets destiny. Follow our heroes as they navigate treacherous landscapes and face unimaginable challenges.",
    "thumbnail_url": "https://xgicplexczvhxeimtyye.supabase.co/storage/v1/object/public/thumbnails/user123/video1.jpg",
    "video_url": "https://xgicplexczvhxeimtyye.supabase.co/storage/v1/object/sign/videos/user123/video1.mp4?token=...",
    "duration": "2h 34m",
    "duration_seconds": 9240,
    "category": "Action",
    "language": "English",
    "type": "movie",
    "rating": 4.8,
    "year": 2024,
    "views": 2400000,
    "views_formatted": "2.4M",
    "is_live": false,
    "status": "ready",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-20T15:45:00Z",
    "user": {
      "id": "user-uuid-here",
      "username": "FilmMaker",
      "avatar_url": "https://...",
      "bio": "Professional filmmaker with 10 years experience"
    },
    "user_interaction": {
      "liked": true,
      "saved": false,
      "watch_progress": 3600,
      "watch_progress_percent": 39,
      "last_watched_at": "2024-01-18T20:30:00Z"
    },
    "stats": {
      "likes_count": 45000,
      "saves_count": 12000
    },
    "related_videos": [
      {
        "id": "another-video-id",
        "title": "Related Video",
        "thumbnail_url": "...",
        "duration": "1h 45m"
      }
    ]
  }
}
```

#### Error Responses

| Status | Code | Message |
|--------|------|---------|
| 400 | INVALID_ID | "Invalid video ID format" |
| 404 | NOT_FOUND | "Video not found" |
| 500 | SERVER_ERROR | "Failed to fetch video" |

---

### API 3: Upload Video

**Endpoint:** `POST /videos`

**Purpose:** Create a new video entry and get upload URLs.

**Authentication:** Required

#### Request Body

```json
{
  "title": "My Awesome Video",
  "description": "This is a description of my video content.",
  "category": "Comedy",
  "language": "English",
  "type": "movie",
  "year": 2024
}
```

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `title` | string | Yes | 3-200 chars | Video title |
| `description` | string | No | Max 5000 chars | Video description |
| `category` | string | Yes | Must be valid category | Video category |
| `language` | string | No | Default: "English" | Video language |
| `type` | string | No | movie/series/live/short | Content type |
| `year` | number | No | 1900-current year | Release year |

#### Success Response (201)

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "My Awesome Video",
    "status": "processing",
    "created_at": "2024-01-15T10:30:00Z",
    "upload_urls": {
      "video": {
        "url": "https://xgicplexczvhxeimtyye.supabase.co/storage/v1/object/upload/videos/...",
        "expires_at": "2024-01-15T11:30:00Z",
        "max_size_mb": 500,
        "allowed_types": ["video/mp4", "video/webm", "video/quicktime"]
      },
      "thumbnail": {
        "url": "https://xgicplexczvhxeimtyye.supabase.co/storage/v1/object/upload/thumbnails/...",
        "expires_at": "2024-01-15T11:30:00Z",
        "max_size_mb": 5,
        "allowed_types": ["image/jpeg", "image/png", "image/webp"]
      }
    }
  },
  "message": "Video created. Upload files to the provided URLs."
}
```

#### Upload Flow

```
1. POST /videos (create metadata, get upload URLs)
        ↓
2. PUT {video_upload_url} (upload video file directly to storage)
        ↓
3. PUT {thumbnail_upload_url} (upload thumbnail directly to storage)
        ↓
4. PATCH /videos/:id (mark as ready, set URLs)
        ↓
5. Video available for viewing
```

#### Error Responses

| Status | Code | Message |
|--------|------|---------|
| 400 | VALIDATION_ERROR | "Title is required and must be 3-200 characters" |
| 400 | VALIDATION_ERROR | "Invalid category. Allowed: Action, Comedy, Drama..." |
| 401 | UNAUTHORIZED | "Authentication required" |
| 500 | SERVER_ERROR | "Failed to create video" |

---

### API 4: Update Video

**Endpoint:** `PATCH /videos/:id`

**Purpose:** Update video metadata or status.

**Authentication:** Required (must be video owner)

#### Request Body

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "category": "Drama",
  "status": "ready",
  "video_url": "https://...",
  "thumbnail_url": "https://...",
  "duration": "1h 45m"
}
```

All fields are optional. Only provided fields will be updated.

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Updated Title",
    "status": "ready",
    "updated_at": "2024-01-15T12:00:00Z"
  },
  "message": "Video updated successfully"
}
```

#### Error Responses

| Status | Code | Message |
|--------|------|---------|
| 401 | UNAUTHORIZED | "Authentication required" |
| 403 | FORBIDDEN | "You don't have permission to update this video" |
| 404 | NOT_FOUND | "Video not found" |

---

### API 5: Delete Video

**Endpoint:** `DELETE /videos/:id`

**Purpose:** Delete a video and its associated files.

**Authentication:** Required (must be video owner)

#### Success Response (200)

```json
{
  "success": true,
  "message": "Video deleted successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "files_deleted": {
      "video": true,
      "thumbnail": true
    }
  }
}
```

#### Error Responses

| Status | Code | Message |
|--------|------|---------|
| 401 | UNAUTHORIZED | "Authentication required" |
| 403 | FORBIDDEN | "You don't have permission to delete this video" |
| 404 | NOT_FOUND | "Video not found" |

---

### API 6: Like/Unlike Video

**Endpoint:** `POST /videos/:id/like`

**Purpose:** Toggle like status on a video.

**Authentication:** Required

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "video_id": "550e8400-e29b-41d4-a716-446655440000",
    "liked": true,
    "total_likes": 45001
  },
  "message": "Video liked"
}
```

Or if unliking:

```json
{
  "success": true,
  "data": {
    "video_id": "550e8400-e29b-41d4-a716-446655440000",
    "liked": false,
    "total_likes": 45000
  },
  "message": "Video unliked"
}
```

---

### API 7: Save/Unsave Video

**Endpoint:** `POST /videos/:id/save`

**Purpose:** Toggle save/bookmark status on a video.

**Authentication:** Required

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "video_id": "550e8400-e29b-41d4-a716-446655440000",
    "saved": true
  },
  "message": "Video saved to your list"
}
```

---

### API 8: Update Watch Progress

**Endpoint:** `POST /videos/:id/progress`

**Purpose:** Track user's watch progress for a video.

**Authentication:** Required

#### Request Body

```json
{
  "progress": 3600,
  "duration": 9240
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `progress` | number | Yes | Current position in seconds |
| `duration` | number | No | Total video duration in seconds |

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "video_id": "550e8400-e29b-41d4-a716-446655440000",
    "watch_progress": 3600,
    "progress_percent": 39,
    "last_watched_at": "2024-01-18T20:30:00Z"
  }
}
```

---

### API 9: Increment View Count

**Endpoint:** `POST /videos/:id/view`

**Purpose:** Increment video view count (called when video starts playing).

**Authentication:** Optional

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "video_id": "550e8400-e29b-41d4-a716-446655440000",
    "views": 2400001
  }
}
```

---

### API 10: Get User Profile

**Endpoint:** `GET /profile`

**Purpose:** Get current authenticated user's profile with stats.

**Authentication:** Required

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": "profile-uuid",
    "user_id": "user-uuid",
    "username": "StreamKing",
    "email": "user@example.com",
    "avatar_url": "https://...",
    "bio": "Content creator and video enthusiast",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z",
    "stats": {
      "videos_uploaded": 25,
      "total_views": 1500000,
      "total_likes": 75000,
      "total_followers": 5000
    }
  }
}
```

---

### API 11: Update Profile

**Endpoint:** `PATCH /profile`

**Purpose:** Update user's profile information.

**Authentication:** Required

#### Request Body

```json
{
  "username": "NewUsername",
  "bio": "Updated bio text"
}
```

For avatar, use multipart/form-data or upload directly to storage.

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": "profile-uuid",
    "username": "NewUsername",
    "bio": "Updated bio text",
    "updated_at": "2024-01-15T12:00:00Z"
  },
  "message": "Profile updated successfully"
}
```

---

### API 12: Get Watch History

**Endpoint:** `GET /profile/history`

**Purpose:** Get user's video watch history.

**Authentication:** Required

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "history": [
      {
        "video": {
          "id": "video-uuid",
          "title": "The Last Frontier",
          "thumbnail_url": "...",
          "duration": "2h 34m",
          "category": "Action"
        },
        "watch_progress": 3600,
        "progress_percent": 39,
        "last_watched_at": "2024-01-18T20:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45
    }
  }
}
```

---

### API 13: Get Saved Videos

**Endpoint:** `GET /profile/saved`

**Purpose:** Get user's saved/bookmarked videos.

**Authentication:** Required

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "videos": [
      {
        "id": "video-uuid",
        "title": "Saved Video Title",
        "thumbnail_url": "...",
        "duration": "1h 45m",
        "category": "Drama",
        "saved_at": "2024-01-10T15:00:00Z"
      }
    ],
    "total": 12
  }
}
```

---

### API 14: Get Liked Videos

**Endpoint:** `GET /profile/liked`

**Purpose:** Get user's liked videos.

**Authentication:** Required

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "videos": [
      {
        "id": "video-uuid",
        "title": "Liked Video Title",
        "thumbnail_url": "...",
        "duration": "45m",
        "category": "Documentary",
        "liked_at": "2024-01-12T10:00:00Z"
      }
    ],
    "total": 28
  }
}
```

---

### API 15: Get Live Streams

**Endpoint:** `GET /live`

**Purpose:** Get currently active live streams.

**Authentication:** Optional

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "streams": [
      {
        "id": "stream-uuid",
        "title": "Gaming Championship Finals",
        "thumbnail_url": "...",
        "category": "Gaming",
        "viewer_count": 45000,
        "started_at": "2024-01-18T18:00:00Z",
        "user": {
          "username": "ProGamer",
          "avatar_url": "..."
        }
      }
    ],
    "total_live": 15
  }
}
```

---

### API 16: Get Categories

**Endpoint:** `GET /categories`

**Purpose:** Get all available video categories.

**Authentication:** Not required

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "categories": [
      { "id": "action", "name": "Action", "video_count": 245 },
      { "id": "comedy", "name": "Comedy", "video_count": 189 },
      { "id": "drama", "name": "Drama", "video_count": 312 },
      { "id": "horror", "name": "Horror", "video_count": 98 },
      { "id": "sci-fi", "name": "Sci-Fi", "video_count": 156 },
      { "id": "documentary", "name": "Documentary", "video_count": 203 },
      { "id": "animation", "name": "Animation", "video_count": 87 },
      { "id": "thriller", "name": "Thriller", "video_count": 145 },
      { "id": "romance", "name": "Romance", "video_count": 112 }
    ]
  }
}
```

---

## 🔐 Authentication System

### Supabase Auth Integration

Replace the current mock `AuthContext` with real Supabase authentication.

### Auth Flow Diagrams

#### Sign Up Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                            SIGN UP FLOW                                   │
└──────────────────────────────────────────────────────────────────────────┘

User fills signup form
        ↓
┌───────────────────────┐
│  Validate inputs      │
│  - Email format       │
│  - Password strength  │
│  - Username unique    │
└───────────┬───────────┘
            ↓
┌───────────────────────┐
│ supabase.auth.signUp  │
│ {                     │
│   email,              │
│   password,           │
│   options: {          │
│     emailRedirectTo   │
│   }                   │
│ }                     │
└───────────┬───────────┘
            ↓
    ┌───────┴───────┐
    ↓               ↓
 Success         Error
    ↓               ↓
┌─────────┐   ┌─────────────┐
│ Create  │   │ Show error  │
│ Profile │   │ message     │
└────┬────┘   └─────────────┘
     ↓
┌─────────────┐
│ Redirect to │
│ Home page   │
└─────────────┘
```

#### Login Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                            LOGIN FLOW                                     │
└──────────────────────────────────────────────────────────────────────────┘

User fills login form
        ↓
┌───────────────────────────────┐
│ supabase.auth.signInWithPassword │
│ { email, password }           │
└───────────────┬───────────────┘
                ↓
        ┌───────┴───────┐
        ↓               ↓
     Success         Error
        ↓               ↓
┌───────────────┐   ┌─────────────┐
│ Set session   │   │ Show error  │
│ in context    │   │ message     │
└───────┬───────┘   └─────────────┘
        ↓
┌───────────────┐
│ Redirect to   │
│ intended page │
└───────────────┘
```

### Session Management

```typescript
// AuthContext.tsx - Real implementation

useEffect(() => {
  // Set up auth state listener FIRST
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Defer profile fetch
      if (session?.user) {
        setTimeout(() => fetchProfile(session.user.id), 0);
      }
    }
  );

  // THEN check for existing session
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    setUser(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
}, []);
```

---

## 🔄 Frontend Integration

### React Query Hooks to Create

```typescript
// src/hooks/useVideos.ts
export function useVideos(filters?: VideoFilters) {
  return useQuery({
    queryKey: ['videos', filters],
    queryFn: () => fetchVideos(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// src/hooks/useVideo.ts
export function useVideo(id: string) {
  return useQuery({
    queryKey: ['video', id],
    queryFn: () => fetchVideo(id),
    enabled: !!id,
  });
}

// src/hooks/useVideoInteractions.ts
export function useLikeVideo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (videoId: string) => toggleLike(videoId),
    onSuccess: (data, videoId) => {
      queryClient.invalidateQueries({ queryKey: ['video', videoId] });
    },
  });
}
```

### Component Migration Pattern

```tsx
// BEFORE (Mock Data)
import { mockVideos } from '@/data/mockData';

function VideoList() {
  return mockVideos.map(video => <VideoCard key={video.id} video={video} />);
}

// AFTER (Real Data)
import { useVideos } from '@/hooks/useVideos';

function VideoList() {
  const { data, isLoading, error } = useVideos();
  
  if (isLoading) return <SkeletonLoader />;
  if (error) return <ErrorMessage error={error} />;
  
  return data?.videos.map(video => <VideoCard key={video.id} video={video} />);
}
```

---

## 📅 Implementation Phases

### Phase 1: Database & Storage ✅ DONE

- [x] Create database tables (profiles, videos, user_video_interactions)
- [x] Set up RLS policies
- [x] Create storage buckets
- [x] Configure storage policies
- [x] Add indexes for performance

### Phase 2: Authentication (Next)

| Task | Priority | Effort | Description |
|------|----------|--------|-------------|
| Replace AuthContext | High | 4h | Switch from mock to Supabase Auth |
| Profile creation trigger | High | 1h | Auto-create profile on signup |
| Protected routes | High | 2h | Add route guards |
| Login/Signup forms | Medium | 2h | Update to use Supabase |
| Session persistence | High | 1h | Remember logged in users |

### Phase 3: Video APIs

| Task | Priority | Effort | Description |
|------|----------|--------|-------------|
| videos edge function | High | 4h | List/filter/paginate videos |
| video-detail edge function | High | 2h | Single video with interactions |
| video-upload edge function | High | 4h | Create video + upload URLs |
| video-delete edge function | Medium | 1h | Delete video + files |

### Phase 4: Interaction APIs

| Task | Priority | Effort | Description |
|------|----------|--------|-------------|
| like/unlike function | High | 2h | Toggle like status |
| save/unsave function | High | 2h | Toggle save status |
| watch-progress function | High | 2h | Track viewing progress |
| view-count function | Medium | 1h | Increment views |

### Phase 5: Profile APIs

| Task | Priority | Effort | Description |
|------|----------|--------|-------------|
| profile function | High | 2h | Get/update profile |
| watch-history function | Medium | 2h | User's watch history |
| saved-videos function | Medium | 1h | User's bookmarks |
| liked-videos function | Medium | 1h | User's likes |

### Phase 6: Frontend Migration

| Task | Priority | Effort | Description |
|------|----------|--------|-------------|
| Create React Query hooks | High | 3h | Data fetching layer |
| Update Home page | High | 2h | Real video carousels |
| Update Browse page | High | 3h | Real filtering |
| Update Watch page | High | 4h | Real player + interactions |
| Update Upload page | High | 4h | Real file uploads |
| Update Profile page | Medium | 3h | Real user data |

---

## ❌ Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional context"
    }
  }
}
```

### Error Codes Reference

| HTTP Status | Code | Description | User Message |
|-------------|------|-------------|--------------|
| 400 | `VALIDATION_ERROR` | Invalid input data | "Please check your input and try again" |
| 400 | `INVALID_PARAMS` | Invalid query params | "Invalid filter options" |
| 400 | `INVALID_ID` | Malformed ID | "Invalid video ID" |
| 401 | `UNAUTHORIZED` | Not authenticated | "Please log in to continue" |
| 403 | `FORBIDDEN` | No permission | "You don't have permission" |
| 404 | `NOT_FOUND` | Resource not found | "Video not found" |
| 409 | `CONFLICT` | Already exists | "Username already taken" |
| 413 | `FILE_TOO_LARGE` | Upload too big | "File exceeds maximum size" |
| 415 | `INVALID_FILE_TYPE` | Wrong file format | "Unsupported file format" |
| 429 | `RATE_LIMITED` | Too many requests | "Please wait before trying again" |
| 500 | `SERVER_ERROR` | Internal error | "Something went wrong" |

---

## 🔒 Security Considerations

### Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:
- Users can only modify their own content
- Public content is readable by all
- Private content is restricted to owners

### Input Validation

All API inputs are validated:
- Email format validation
- Password strength requirements
- String length limits
- Type checking
- SQL injection prevention (via parameterized queries)

### File Upload Security

- MIME type validation
- File size limits
- Path traversal prevention
- Virus scanning (if configured)

### Rate Limiting

- 100 requests per minute per IP (general)
- 10 uploads per hour per user
- 1000 views per hour per video (prevents abuse)

---

## 🧪 Testing Strategy

### Unit Tests

- API endpoint logic
- Validation functions
- Data transformations

### Integration Tests

- Database operations
- Storage operations
- Auth flows

### E2E Tests

- Complete user flows
- Video upload process
- Authentication journey

---

## 📚 Appendix

### Categories List

```javascript
const categories = [
  'Action',
  'Comedy', 
  'Drama',
  'Horror',
  'Sci-Fi',
  'Documentary',
  'Animation',
  'Thriller',
  'Romance'
];
```

### Languages List

```javascript
const languages = [
  'English',
  'Spanish',
  'French',
  'Japanese',
  'Korean',
  'Hindi'
];
```

### Video Types

```javascript
const videoTypes = [
  { value: 'movie', label: 'Movies' },
  { value: 'series', label: 'Series' },
  { value: 'live', label: 'Live' },
  { value: 'short', label: 'Shorts' }
];
```

---

*Document Version: 1.0*
*Last Updated: February 2025*
*Author: StreamVault Development Team*
