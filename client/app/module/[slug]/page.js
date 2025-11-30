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
  const [downloaded, setDownloaded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef(null);
  const { slug } = useParams();

  useEffect(() => {
    async function fetchLesson() {
      const res = await axios.post(
        "http://localhost:5000/api/lesson/create",
        { id: slug },
        { withCredentials: true }
      );
      const lessons = res.data.module.lessons;
      setLesson(Array.isArray(lessons) ? lessons[0] : lessons);
    }
    fetchLesson();

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [slug]);

  if (!lesson) return <Loading />;

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
    window.open(`http://localhost:5000/api/lesson/download/${slug}`, "_blank");
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
