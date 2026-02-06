# StreamVault Backend Roadmap

## 📋 Overview

This document outlines the complete backend architecture, API specifications, and implementation roadmap for StreamVault - a video streaming platform.

---

## 🏗️ Current App Architecture

### Frontend Routes & Features

| Route | Component | Description | Backend Requirements |
|-------|-----------|-------------|---------------------|
| `/` | Index | Landing/Home page with video carousels | Fetch videos, categories |
| `/home` | Home | Authenticated home with personalized content | User preferences, watch history |
| `/browse` | Browse | Video discovery with filters | Search, filter, pagination |
| `/watch/:id` | Watch | Video player page | Video streaming, interactions |
| `/live` | Live | Live streaming content | Real-time streams, chat |
| `/upload` | Upload | Video upload interface | File upload, processing |
| `/profile` | Profile | User profile management | User CRUD operations |
| `/login` | Login | Authentication | Auth API |
| `/signup` | Signup | User registration | Auth API |

### Current Data Flow (Mock → Real)

```
┌─────────────────────────────────────────────────────────────────┐
│                        CURRENT (Mock Data)                       │
├─────────────────────────────────────────────────────────────────┤
│  mockData.ts → Components → Static Display                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                        TARGET (Real Backend)                     │
├─────────────────────────────────────────────────────────────────┤
│  Supabase DB ← Edge Functions ← React Query ← Components        │
│       ↓                                                          │
│  Storage Buckets (videos, thumbnails)                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### Tables Created

#### 1. `profiles` - User Profiles
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  username TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 2. `videos` - Video Metadata
```sql
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  video_url TEXT,
  duration TEXT,
  category TEXT NOT NULL DEFAULT 'Uncategorized',
  language TEXT DEFAULT 'English',
  type TEXT CHECK (type IN ('movie', 'series', 'live', 'short')) DEFAULT 'movie',
  rating DECIMAL(2,1) DEFAULT 0,
  year INTEGER DEFAULT EXTRACT(YEAR FROM now()),
  views INTEGER DEFAULT 0,
  is_live BOOLEAN DEFAULT false,
  viewer_count INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('processing', 'ready', 'failed')) DEFAULT 'processing',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 3. `user_video_interactions` - User Engagement
```sql
CREATE TABLE public.user_video_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  video_id UUID REFERENCES public.videos ON DELETE CASCADE NOT NULL,
  liked BOOLEAN DEFAULT false,
  saved BOOLEAN DEFAULT false,
  watch_progress INTEGER DEFAULT 0,
  last_watched_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, video_id)
);
```

---

## 📦 Storage Buckets

| Bucket | Purpose | Access | Max Size |
|--------|---------|--------|----------|
| `videos` | Video files (mp4, webm, etc.) | Private (owner only) | 500MB |
| `thumbnails` | Video thumbnails | Public read | 5MB |

---

## 🔌 Required APIs (Edge Functions)

### 1. Video Management APIs

#### `POST /videos/upload`
Upload a new video with metadata.

**Request:**
```json
{
  "title": "string (required)",
  "description": "string",
  "category": "string",
  "language": "string",
  "type": "movie | series | live | short",
  "thumbnail": "File",
  "video": "File"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "string",
    "status": "processing",
    "thumbnail_url": "string",
    "created_at": "timestamp"
  }
}
```

---

#### `GET /videos`
Fetch videos with filters and pagination.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category |
| `language` | string | Filter by language |
| `type` | string | Filter by type (movie/series/live/short) |
| `search` | string | Search in title/description |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20) |
| `sort` | string | Sort field (views/rating/created_at) |
| `order` | string | asc/desc |

**Response:**
```json
{
  "success": true,
  "data": {
    "videos": [
      {
        "id": "uuid",
        "title": "string",
        "description": "string",
        "thumbnail_url": "string",
        "duration": "string",
        "category": "string",
        "language": "string",
        "type": "string",
        "rating": 4.5,
        "year": 2024,
        "views": "2.4M",
        "is_live": false,
        "user": {
          "username": "string",
          "avatar_url": "string"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "total_pages": 5
    }
  }
}
```

---

#### `GET /videos/:id`
Get single video details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "video_url": "string",
    "thumbnail_url": "string",
    "duration": "string",
    "category": "string",
    "language": "string",
    "type": "string",
    "rating": 4.5,
    "year": 2024,
    "views": 2400000,
    "is_live": false,
    "status": "ready",
    "user": {
      "id": "uuid",
      "username": "string",
      "avatar_url": "string"
    },
    "user_interaction": {
      "liked": true,
      "saved": false,
      "watch_progress": 45
    }
  }
}
```

---

#### `DELETE /videos/:id`
Delete a video (owner only).

**Response:**
```json
{
  "success": true,
  "message": "Video deleted successfully"
}
```

---

### 2. User Interaction APIs

#### `POST /videos/:id/like`
Toggle like on a video.

**Response:**
```json
{
  "success": true,
  "data": {
    "liked": true
  }
}
```

---

#### `POST /videos/:id/save`
Toggle save/bookmark on a video.

**Response:**
```json
{
  "success": true,
  "data": {
    "saved": true
  }
}
```

---

#### `POST /videos/:id/progress`
Update watch progress.

**Request:**
```json
{
  "progress": 120
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "watch_progress": 120,
    "last_watched_at": "timestamp"
  }
}
```

---

#### `POST /videos/:id/view`
Increment view count.

**Response:**
```json
{
  "success": true,
  "data": {
    "views": 2400001
  }
}
```

---

### 3. User Profile APIs

#### `GET /profile`
Get current user's profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "username": "string",
    "email": "string",
    "avatar_url": "string",
    "bio": "string",
    "stats": {
      "videos_uploaded": 10,
      "total_views": 50000,
      "total_likes": 1200
    }
  }
}
```

---

#### `PATCH /profile`
Update user profile.

**Request:**
```json
{
  "username": "string",
  "bio": "string",
  "avatar": "File (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "string",
    "avatar_url": "string",
    "bio": "string",
    "updated_at": "timestamp"
  }
}
```

---

#### `GET /profile/history`
Get user's watch history.

**Response:**
```json
{
  "success": true,
  "data": {
    "videos": [
      {
        "video": { /* video object */ },
        "watch_progress": 120,
        "last_watched_at": "timestamp"
      }
    ]
  }
}
```

---

#### `GET /profile/saved`
Get user's saved videos.

**Response:**
```json
{
  "success": true,
  "data": {
    "videos": [ /* array of video objects */ ]
  }
}
```

---

#### `GET /profile/liked`
Get user's liked videos.

**Response:**
```json
{
  "success": true,
  "data": {
    "videos": [ /* array of video objects */ ]
  }
}
```

---

### 4. Live Streaming APIs

#### `GET /live`
Get active live streams.

**Response:**
```json
{
  "success": true,
  "data": {
    "streams": [
      {
        "id": "uuid",
        "title": "string",
        "thumbnail_url": "string",
        "category": "string",
        "viewer_count": 45000,
        "user": {
          "username": "string",
          "avatar_url": "string"
        }
      }
    ]
  }
}
```

---

### 5. Categories & Metadata APIs

#### `GET /categories`
Get all available categories.

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      "Action", "Comedy", "Drama", "Horror", 
      "Sci-Fi", "Documentary", "Animation", 
      "Thriller", "Romance"
    ]
  }
}
```

---

#### `GET /languages`
Get supported languages.

**Response:**
```json
{
  "success": true,
  "data": {
    "languages": [
      "English", "Spanish", "French", 
      "Japanese", "Korean", "Hindi"
    ]
  }
}
```

---

## 🔐 Authentication Flow

### Sign Up Flow
```
User → Sign Up Form → Supabase Auth → Create Profile → Redirect to Home
```

### Login Flow
```
User → Login Form → Supabase Auth → Load Profile → Redirect to Home
```

### Session Management
- Sessions stored in localStorage
- Auto-refresh tokens enabled
- Auth state listener for real-time updates

---

## 📊 Implementation Phases

### Phase 1: Core Infrastructure ✅
- [x] Database schema creation
- [x] Storage buckets setup
- [x] RLS policies configuration
- [ ] Supabase client integration

### Phase 2: Authentication
- [ ] Replace mock AuthContext with Supabase Auth
- [ ] Implement profile creation on signup
- [ ] Add protected routes
- [ ] Session persistence

### Phase 3: Video APIs
- [ ] Create video upload edge function
- [ ] Implement video listing with filters
- [ ] Add video detail fetching
- [ ] Video deletion functionality

### Phase 4: User Interactions
- [ ] Like/Unlike functionality
- [ ] Save/Unsave functionality  
- [ ] Watch progress tracking
- [ ] View count incrementing

### Phase 5: Profile Features
- [ ] Profile management
- [ ] Watch history
- [ ] Saved videos list
- [ ] Liked videos list

### Phase 6: Live Streaming (Future)
- [ ] Live stream creation
- [ ] Real-time viewer count
- [ ] Live chat integration

---

## 🛠️ Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| State Management | React Query + Context |
| Backend | Supabase (Lovable Cloud) |
| Database | PostgreSQL |
| Storage | Supabase Storage |
| Auth | Supabase Auth |
| Edge Functions | Deno (Supabase Functions) |

---

## 📝 Error Response Format

All APIs follow this error format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {} 
  }
}
```

### Common Error Codes
| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | No permission |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid input |
| `SERVER_ERROR` | 500 | Internal error |

---

## 🚀 Next Steps

1. **Approve pending migration** - Creates all database tables
2. **Update AuthContext** - Switch from mock to Supabase Auth
3. **Create Edge Functions** - Implement API endpoints
4. **Update Components** - Connect to real data via React Query
5. **Test & Iterate** - Verify all flows work correctly

---

*Last Updated: February 2025*
