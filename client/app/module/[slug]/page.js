"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Loading from "@/components/ui/Loading";
import NotesBlock from "@/components/ui/NotesBlock";
import LinkBlock from "@/components/ui/LinkBlock";
import MCQBlock from "@/components/ui/MCQBlock";
import HomeButton from "@/components/ui/HomeButton";
import { Download, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Volume2, Pause } from "lucide-react"; 
import YoutubeBlock from "@/components/ui/YoutubeBlock";

export const dynamic = 'force-dynamic';

const Page = () => {
  const [lesson, setLesson] = useState(null);
  const [jobStatus, setJobStatus] = useState("idle");
  const [error, setError] = useState("");
  const [downloaded, setDownloaded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef(null);
  const { slug } = useParams();

  useEffect(() => {
    let isMounted = true;
    let timerId;

    async function pollLessonStatus(jobId) {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/lesson/status/${jobId}`,
          { withCredentials: true }
        );

        if (!isMounted) return;

        setJobStatus(res.data.status || "processing");

        if (res.data.status === "completed") {
          const lessonData = res.data.lesson;
          setLesson(Array.isArray(lessonData) ? lessonData[0] : lessonData);
          return;
        }

        if (res.data.status === "failed") {
          setError(res.data.message || "Lesson generation failed.");
          return;
        }

        timerId = setTimeout(() => pollLessonStatus(jobId), 3000);
      } catch (pollError) {
        if (!isMounted) return;
        setError(
          pollError?.response?.data?.message ||
            "Unable to fetch lesson status."
        );
      }
    }

    async function fetchLesson() {
      try {
        setError("");
        setJobStatus("queued");

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/lesson/create`,
          { id: slug },
          { withCredentials: true }
        );

        if (!isMounted) return;

        if (res.data.status === "completed") {
          const lessonData = res.data.lesson || res.data.module?.lessons;
          setJobStatus("completed");
          setLesson(Array.isArray(lessonData) ? lessonData[0] : lessonData);
          return;
        }

        if (!res.data.jobId) {
          setError("Could not start lesson generation job.");
          return;
        }

        await pollLessonStatus(res.data.jobId);
      } catch (fetchError) {
        if (!isMounted) return;
        setError(
          fetchError?.response?.data?.message || "Failed to generate lesson."
        );
      }
    }

    fetchLesson();

    return () => {
      isMounted = false;
      if (timerId) {
        clearTimeout(timerId);
      }
      window.speechSynthesis.cancel();
    };
  }, [slug]);

  if (!lesson) {
    return (
      <main className="flex overflow-auto flex-col items-center justify-center min-h-screen bg-zinc-900 text-white p-4 gap-4">
        <Loading />
        <p className="text-sm text-zinc-300">Status: {jobStatus}</p>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
      </main>
    );
  }

  const content = lesson?.content || {};

  function speakText(text) {
    // Stop existing speech
    window.speechSynthesis.cancel();

    const cleanText = text?.replace(/<[^>]*>/g, "") || text;
    const utterance = new SpeechSynthesisUtterance(cleanText);

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utteranceRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  function toggleSpeech() {
    if (!isSpeaking) {
      speakText(content.notes);
    } else {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }

  function downloadPDF() {
    if (downloaded) return;
    setDownloaded(true);
    window.open(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/lesson/download/${slug}`, "_blank");
  }

  return (
    <main className="flex overflow-auto flex-col items-center justify-center min-h-screen bg-zinc-900 text-white p-4">
      <div className="p-4">
        <h1 className="text-5xl font-bold mb-6 text-white/80">
          {lesson.title}
        </h1>
 
        <Button
          onClick={toggleSpeech}
          variant="primary"
          className="text-white px-4 py-4 border-2 rounded-full cursor-pointer transition-colors"
          style={{ zIndex: 50 }}
        >
          {isSpeaking ? <Pause /> : <Volume2 strokeWidth={1.25} />}
          {isSpeaking ? "Pause" : "Listen"}
        </Button>
 
        <Button
          variant="primary"
          className="border-2 right-8 cursor-pointer fixed"
          style={{ top: "5rem" }}
          onClick={downloadPDF}
        >
          <Download /> PDF
        </Button>
      </div>

      <div>
        <HomeButton />
        <NotesBlock notes={content.notes} />
        <LinkBlock links={content.links} />
        <MCQBlock mcqs={content.mcqs} />
        <YoutubeBlock videos={lesson.videos} />
      </div>
    </main>
  );
};

export default Page;
