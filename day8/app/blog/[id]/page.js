'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function BlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.error('Error loading blog post:', error);
      }
    };

    if (id) fetchPost();
  }, [id]);

  if (!post) return <p className="p-4 text-lg">Loading post...</p>;

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => router.back()}
        className="mb-4 bg-gray-600 text-white px-4 py-2 rounded"
      >
        ← Back
      </button>

      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-line">
        {post.content}
      </p>
    </main>
  );
}
