'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import '../globals.css';

export default function UserPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'user') {
      router.push('/login');
      return;
    }

    // Fetch from MongoDB via API
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };

    fetchPosts();
  }, [user]);

  return (
    <main className="user-fullpage">
      <header className="user-toolbar">
        <h1 className="welcome-msg">Welcome, {user?.username}</h1>
        <div className="toolbar-buttons">
          <button onClick={() => router.push('/profile')}>Profile</button>
          <button onClick={() => router.push('/terms')}>Terms</button>
        </div>
      </header>

      <section className="blog-section">
        <h2>All Blogs</h2>
        {posts.length === 0 ? (
          <p className="no-posts">No posts found.</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="blog-card">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
