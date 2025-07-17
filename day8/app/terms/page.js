'use client';
import { useRouter } from 'next/navigation';
import '../globals.css';

export default function TermsPage() {
  const router = useRouter();

  return (
    <main className="terms-page">
      <button className="back-btn" onClick={() => router.back()}>← Back</button>

      <h1 className="terms-title">Terms and Conditions</h1>
      <p className="terms-text">
        This is a blog app which the admin will be login by github and user by normal local storage and the blogs are stored in the mongodb storage -atlas.
      </p>
    </main>
  );
}
