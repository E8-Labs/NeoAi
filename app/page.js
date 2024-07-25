'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {

  const router = useRouter('');

  useEffect(() => {
    // router.push('/onboarding');
    // router.push('/onboarding');
    router.push('/auth/animation');
  }, [])

  //code for storing value of input

  return (
    <div className="flex justify-center" style={{ color: 'red', fontSize: 20, fontWeight: '500' }}>
      
    </div>
  );
}
