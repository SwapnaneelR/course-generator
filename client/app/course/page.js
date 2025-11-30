"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Home from "@/components/ui/Home";
import HomeButton from "@/components/ui/HomeButton";

export const dynamic = 'force-dynamic';

const Page = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [courses, setCourses] = useState([]);
    useEffect(() => {
      async function fetchCourses() {
        if (!session) return;
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/course/get`,
            {
              user: session.user,
            },
            { withCredentials: true }
          );
          setCourses(response.data.courses || []);
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      }
      fetchCourses();
    }, [session]);
  const viewCourse = async (course) => {
    router.push(`course/${course._id}`);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-white p-4 bg-dots overflow-y-auto">
    
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-7xl mt-10">
    <HomeButton/>
      {courses.map((course, index) => (
        <Card
          key={index}
          className="bg-zinc-900  rounded-2xl shadow-xl border-3 border-zinc-700 p-6 flex flex-col justify-between hover:scale-[1.02] transition-all"
        >
          <CardTitle className="mb-4">
            <h1 className="text-lg font-semibold text-zinc-100">
              {course?.title}
            </h1>
          </CardTitle>

          <Button 
            className="cursor-pointer w-full mt-6" 
            onClick={() => viewCourse(course)}
          >
            View Course
          </Button>
        </Card>
      ))}

    </div>
  </div>
  );
};

export default Page;
