'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import '../globals.css';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }

    fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPost = {
      title,
      content,
    };

    try {
      if (editing) {
        const res = await fetch(`/api/posts/${editing._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPost),
        });
        if (!res.ok) throw new Error('Failed to update post');
      } else {
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPost),
        });
        if (!res.ok) throw new Error('Failed to create post');
      }

      setTitle('');
      setContent('');
      setEditing(null);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete post');
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="admin-page">
      <div className="user-toolbar">
        <h1 className="welcome-msg">Admin Dashboard</h1>
        <div className="toolbar-buttons">
          <button onClick={() => router.push('/profile')}>Profile</button>
          <button onClick={() => router.push('/terms')}>Terms</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter blog title"
          required
        />
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter blog content"
          required
        />
        <div className="form-actions">
          <button type="submit" className="primary-btn">
            {editing ? 'Update Blog' : 'Add Blog'}
          </button>
          {editing && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setEditing(null);
                setTitle('');
                setContent('');
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <section className="blog-section">
        <h2>All Posts</h2>
        {posts.length === 0 ? (
          <p className="no-posts">No posts found.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className={`blog-card ${editing?._id === post._id ? 'editing' : ''}`}
            >
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <div className="post-actions">
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditing(post);
                    setTitle(post.title);
                    setContent(post.content);
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(post._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
