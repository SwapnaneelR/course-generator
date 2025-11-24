"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Loading from "@/components/ui/Loading";
import NotesBlock from "@/components/ui/NotesBlock";
import LinkBlock from "@/components/ui/LinkBlock";
import MCQBlock from "@/components/ui/MCQBlock";
import HomeButton from "@/components/ui/HomeButton";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
const Page = () => {
  const [lesson, setLesson] = useState(null);
  const [downloaded, setDownloaded] = useState(false);
  const { slug } = useParams();
  useEffect(() => {
    async function fetchLesson() {
      const res = await axios.post(
        "http://localhost:5000/api/lesson/create",
        {
          id: slug,
        },
        {
          withCredentials: true,
        }
      );
      // If lessons is an array, get the first lesson
      const lessons = res.data.module.lessons;
      setLesson(Array.isArray(lessons) ? lessons[0] : lessons);
      console.log(Array.isArray(lessons) ? lessons[0] : lessons);
    }
    fetchLesson();
  }, [slug]);

  if (!lesson) return <Loading />;
  const content = lesson?.content || {};
  function downloadPDF() {
    // alert("Download feature coming soon!");
    if (downloaded) return; // Prevent multiple downloads
    setDownloaded(true);
    window.open(`http://localhost:5000/api/lesson/download/${slug}`, "_blank");
  }

  return (
    <main className="flex overflow-auto flex-col items-center justify-center  min-h-screen bg-zinc-900 text-white p-4">
      <div className="p-4">
        <h1 className="text-5xl font-bold mb-6 text-white/80 ">
          {lesson.title}
        </h1>
       <Button variant="outline" className ="border-2 right-8 fixed" onClick={downloadPDF} >
          Download Lesson<Download   /> 
        </Button>
        <HomeButton />
        <NotesBlock notes={content.notes} />
        <LinkBlock links={content.links} />
        <MCQBlock mcqs={content.mcqs} />
      </div>
    </main>
  );
};

export default Page;
