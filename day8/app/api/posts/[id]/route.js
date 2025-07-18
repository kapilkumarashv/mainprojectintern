// app/api/posts/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Post from '../../../../models/Post';

// PUT: Update blog post by ID
export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = params;
  const body = await request.json();

  try {
    const updatedPost = await Post.findByIdAndUpdate(id, body, { new: true });
    if (!updatedPost) return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating post', error }, { status: 500 });
  }
}

// DELETE: Delete blog post by ID
export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting post', error }, { status: 500 });
  }
}
