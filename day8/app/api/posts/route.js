import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Post from '../../../models/Post';



export async function GET() {
  await dbConnect();
  const allPosts = await Post.find().sort({ createdAt: -1 });
  return NextResponse.json(allPosts);
}

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const newPost = await Post.create(body);
  return NextResponse.json(newPost);
}
