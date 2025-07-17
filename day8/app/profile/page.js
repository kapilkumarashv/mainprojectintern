'use client';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import '../globals.css';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <main className="profile-page">
      <div className="profile-header">
        <h1 className="profile-title">Your Profile</h1>
      </div>

      <div className="toolbar-buttons top-toolbar">
        <button onClick={() => router.back()}>← Back</button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {user ? (
        <div className="profile-details">
          <p><span>Username:</span> {user.username}</p>
          <p><span>Password:</span> {user.password}</p>
          <p><span>Role:</span> {user.role}</p>
        </div>
      ) : (
        <p className="no-user">No user is logged in.</p>
      )}
    </main>
  );
}
