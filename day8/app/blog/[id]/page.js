import { notFound } from 'next/navigation';

export default async function BlogPostPage({ params }) {
  const { id } = params;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/posts/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return notFound();
    }

    const post = await res.json();

    return (
      <main className="p-6 max-w-3xl mx-auto">
        <a
          href="/user"
          className="inline-block mb-4 text-sm text-blue-500 hover:underline"
        >
          ← Back
        </a>
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-line">
          {post.content}
        </p>
      </main>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    return <p className="p-4 text-red-600">Error loading post.</p>;
  }
}
