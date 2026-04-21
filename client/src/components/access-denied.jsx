"use client"

import React from 'react'
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

function AccessDenied() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='min-h-screen min-w-screen flex justify-center items-center'>
      <div className='flex flex-col justify-center items-center gap-7'>
        <h1 className='font-body text-2xl text-muted-foreground'>Please logout from existing session to login as an issuer.</h1>
        <div className="group relative cursor-pointer rounded-lg px-6 py-3 h-10 flex items-center gap-2 text-sm font-bold border bg-white border-white/17 uppercase tracking-widest text-black">
          <Button onClick={handleLogout} className="relative z-10">Logout</Button>
        </div>
      </div>
    </div>
  )
}

export default AccessDenied