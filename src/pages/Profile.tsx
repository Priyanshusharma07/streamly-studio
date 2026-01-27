import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Camera, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { VideoCard } from '@/components/video/VideoCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { mockVideos } from '@/data/mockData';

const Profile: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile, logout } = useAuth();
  const { toast } = useToast();

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);

  const activeTab = searchParams.get('tab') || 'profile';

  // Get videos for each section based on user's lists
  const watchHistory = mockVideos.filter((v) => user?.watchHistory.includes(v.id));
  const savedVideos = mockVideos.filter((v) => user?.savedVideos.includes(v.id));
  const likedVideos = mockVideos.filter((v) => user?.likedVideos.includes(v.id));

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    updateProfile({ username, email });
    setIsSaving(false);
    toast({ title: 'Profile updated successfully!' });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <div className="relative group">
              <Avatar className="w-24 h-24 md:w-32 md:h-32">
                <AvatarImage src={user?.avatar} alt={user?.username} />
                <AvatarFallback className="text-2xl">
                  {user?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Change avatar"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{user?.username}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-lg">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="glass-card rounded-xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Edit Profile</h2>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="profile-username">Username</Label>
                    <Input
                      id="profile-username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-email">Email</Label>
                    <Input
                      id="profile-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </div>

              {/* Liked Videos */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Liked Videos</h2>
                {likedVideos.length === 0 ? (
                  <p className="text-muted-foreground">No liked videos yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {likedVideos.map((video) => (
                      <VideoCard key={video.id} video={video} />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Watch History Tab */}
            <TabsContent value="history">
              <h2 className="text-lg font-semibold text-foreground mb-4">Watch History</h2>
              {watchHistory.length === 0 ? (
                <div className="glass-card rounded-xl p-8 text-center">
                  <p className="text-muted-foreground">Your watch history will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {watchHistory.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Saved Videos Tab */}
            <TabsContent value="saved">
              <h2 className="text-lg font-semibold text-foreground mb-4">Saved Videos</h2>
              {savedVideos.length === 0 ? (
                <div className="glass-card rounded-xl p-8 text-center">
                  <p className="text-muted-foreground">Videos you save will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {savedVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="glass-card rounded-xl p-6 space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Account Settings</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Manage your notification preferences
                      </p>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Privacy</p>
                      <p className="text-sm text-muted-foreground">Control your privacy settings</p>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Connected Accounts</p>
                      <p className="text-sm text-muted-foreground">
                        Manage linked social accounts
                      </p>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <Button variant="destructive" onClick={handleLogout}>
                    Sign Out
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
