"use client"
import {Button} from "./button"
import {useRouter} from "next/navigation"
import React from 'react'
import {House} from "lucide-react"
const HomeButton = () => {
  const router = useRouter();
  return (
    <div className = "fixed top-2 right-10 z-50">
      <Button variant="ghost" className="cursor-pointer border-2" onClick={() => router.push('/')}>
        <House strokeWidth={1.25}/>
      </Button>
    </div>
  )
}

export default HomeButton