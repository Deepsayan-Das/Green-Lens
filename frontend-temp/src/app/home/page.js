'use client';

import { useUser } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import UserProfile from '../components/UserProfile';

export default function HomePage() {
  const { isLoaded, isSignedIn, user } = useUser();

  // Loading state
  
    return (
      <div className="min-h-screen flex items-center justify-center">
       <UserProfile/>
    </div>
  );

}