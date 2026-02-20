import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Camera, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useProfile, useChangePassword } from '@/hooks/useAuth';

const Profile: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile, logout } = useAuth();
  const { toast } = useToast();

  // Fetch fresh profile data from the API
  const { data: freshProfile, isLoading: profileLoading } = useProfile(isAuthenticated);
  const changePasswordMutation = useChangePassword();

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const activeTab = searchParams.get('tab') || 'profile';

  // Sync form fields when fresh profile data arrives
  useEffect(() => {
    if (freshProfile) {
      setUsername(freshProfile.username);
      setEmail(freshProfile.email);
      updateProfile({ username: freshProfile.username, email: freshProfile.email, avatar: freshProfile.avatar });
    }
  }, [freshProfile]);

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

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast({ title: 'Missing fields', description: 'Please fill in both password fields.', variant: 'destructive' });
      return;
    }
    try {
      await changePasswordMutation.mutateAsync({ currentPassword, newPassword });
      toast({ title: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      toast({ title: 'Failed to change password', description: err.message, variant: 'destructive' });
    }
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
            <TabsList className="grid w-full grid-cols-3 max-w-lg">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="glass-card rounded-xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Edit Profile</h2>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="profile-username">Username</Label>
                    <Input id="profile-username" value={username} onChange={(e) => setUsername(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-email">Email</Label>
                    <Input id="profile-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Watch History Tab */}
            <TabsContent value="history">
              <h2 className="text-lg font-semibold text-foreground mb-4">Watch History</h2>
              <div className="glass-card rounded-xl p-8 text-center">
                <p className="text-muted-foreground">Watch history will be available once connected to the backend.</p>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="glass-card rounded-xl p-6 space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Change Password</h2>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>
                  <Button
                    onClick={handleChangePassword}
                    disabled={changePasswordMutation.isPending}
                  >
                    {changePasswordMutation.isPending ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Changing...</>
                    ) : (
                      'Change Password'
                    )}
                  </Button>
                </div>
                <div className="pt-6 border-t border-border">
                  <Button variant="destructive" onClick={handleLogout}>Sign Out</Button>
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
