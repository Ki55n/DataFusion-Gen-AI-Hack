"use client";

import Answer from "@/components/chat/Answer";
import Footer from "@/components/chat/Footer";
import Header from "@/components/chat/Header";
import Hero from "@/components/chat/Hero";
import SimilarTopics from "@/components/chat/SimilarTopics";
import Sources from "@/components/chat/Sources";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import { ArrowLeft, ChevronLeft, Sidebar } from "lucide-react";
import Asidebar from "@/components/chat/Asidebar";
import { UserAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isOpen, setIsOpen] = useState(true);
  const [promptValue, setPromptValue] = useState("");
  const [question, setQuestion] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [sources, setSources] = useState<{ name: string; url: string }[]>([]);
  const [isLoadingSources, setIsLoadingSources] = useState(false);
  const [answer, setAnswer] = useState("");
  const [showHero, setShowHero] = useState(true);
  const [similarQuestions, setSimilarQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const { user, loading: authLoading }: any = UserAuth(); // Use 'loading' from auth context
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login"); // Redirect to the login page if not authenticated
    }
  }, [user, authLoading, router]);

  const handleDisplayResult = async (newQuestion?: string) => {
    newQuestion = newQuestion || promptValue;

    setShowResult(true);
    setLoading(true);
    setQuestion(newQuestion);
    setPromptValue("");
    setShowHero(false);

    await Promise.all([
      handleSourcesAndAnswer(newQuestion),
      handleSimilarQuestions(newQuestion),
    ]);

    setLoading(false);
  };

  async function handleSourcesAndAnswer(question: string) {
    setIsLoadingSources(true);
    let sourcesResponse = await fetch("/api/getSources", {
      method: "POST",
      body: JSON.stringify({ question }),
    });
    if (sourcesResponse.ok) {
      let sources = await sourcesResponse.json();

      setSources(sources);
    } else {
      setSources([]);
    }
    setIsLoadingSources(false);

    const response = await fetch("/api/getAnswer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, sources }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    if (response.status === 202) {
      const fullAnswer = await response.text();
      setAnswer(fullAnswer);
      return;
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const onParse = (event: ParsedEvent | ReconnectInterval) => {
      if (event.type === "event") {
        const data = event.data;
        try {
          const text = JSON.parse(data).text ?? "";
          setAnswer((prev) => prev + text);
        } catch (e) {
          console.error(e);
        }
      }
    };

    // https://web.dev/streams/#the-getreader-and-read-methods
    const reader = data.getReader();
    const decoder = new TextDecoder();
    const parser = createParser(onParse);
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      parser.feed(chunkValue);
    }
  }

  async function handleSimilarQuestions(question: string) {
    let res = await fetch("/api/getSimilarQuestions", {
      method: "POST",
      body: JSON.stringify({ question }),
    });
    let questions = await res.json();
    setSimilarQuestions(questions);
  }

  const reset = () => {
    setShowHero(true);
    setShowResult(false);
    setPromptValue("");
    setQuestion("");
    setAnswer("");
    setSources([]);
    setSimilarQuestions([]);
  };
  const handleBack = () => {
    if (!showHero) {
      reset();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="flex">
      <div className="nav-bar flex bg-gray-800 rounded-md h-auto px-2">
        <div className="nav-items">
          <button
            onClick={handleBack}
            className="flex items-center justify-center ml-1 mt-4 w-10 h-10 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors duration-100"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="flex-grow relative overflow-hidden bg-gray-900 ">
        <header className="flex items-center">
          <Header />
        </header>

        <main className="h-full px-4 pb-4">
          {!showResult && (
            <Hero
              promptValue={promptValue}
              setPromptValue={setPromptValue}
              handleDisplayResult={handleDisplayResult}
            />
          )}

          {showResult && (
            <div className="flex h-full min-h-[68vh] w-full grow flex-col justify-between">
              <div className="container w-full space-y-2">
                <div className="container space-y-2 ">
                  <div className="container flex w-full items-start gap-3 px-5 pt-2 lg:px-10 ">
                    <div className="flex w-fit items-center gap-4">
                      <Image
                        unoptimized
                        src={"/img/message-question-circle.svg"}
                        alt="message"
                        width={30}
                        height={30}
                        className="size-[24px]"
                      />
                      <p className="pr-5 font-bold uppercase leading-[152%] text-gray-400">
                        Question:
                      </p>
                    </div>
                    <div className="grow text-gray-400">
                      &quot;{question}&quot;
                    </div>
                  </div>
                  <>
                    <Sources sources={sources} isLoading={isLoadingSources} />
                    <Answer answer={answer} />
                    <SimilarTopics
                      similarQuestions={similarQuestions}
                      handleDisplayResult={handleDisplayResult}
                      reset={reset}
                    />
                  </>
                </div>

                <div
                  className="justify-center pt-1 sm:pt-2 bg-[rgb(239,242,243)]"
                  ref={chatContainerRef}
                ></div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
