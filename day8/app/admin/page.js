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

    const newPost = { title, content };

    try {
      let res;
      if (editing) {
        res = await fetch(`/api/posts/${editing._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPost),
        });
      } else {
        res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPost),
        });
      }

      if (!res.ok) throw new Error('Failed to save post');

      setTitle('');
      setContent('');
      setEditing(null);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete post');
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="admin-page p-4">
      <div className="user-toolbar flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="space-x-2">
          <button onClick={() => router.push('/profile')} className="bg-blue-500 px-4 py-2 text-white rounded">Profile</button>
          <button onClick={() => router.push('/terms')} className="bg-gray-500 px-4 py-2 text-white rounded">Terms</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-form space-y-4 mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter blog title"
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter blog content"
          className="w-full border p-2 rounded"
          required
        />
        <div className="form-actions space-x-2">
          <button type="submit" className="bg-green-600 px-4 py-2 text-white rounded">
            {editing ? 'Update Blog' : 'Add Blog'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setTitle('');
                setContent('');
              }}
              className="bg-red-400 px-4 py-2 text-white rounded"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <section className="blog-section">
        <h2 className="text-xl font-semibold mb-4">All Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-600">No posts found.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className={`border p-4 mb-4 rounded shadow-sm ${editing?._id === post._id ? 'bg-yellow-100' : 'bg-white'}`}
            >
              <h3 className="text-lg font-bold">{post.title}</h3>
              <p className="text-gray-700">{post.content}</p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => {
                    setEditing(post);
                    setTitle(post.title);
                    setContent(post.content);
                  }}
                  className="bg-yellow-500 px-3 py-1 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="bg-red-600 px-3 py-1 text-white rounded"
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
