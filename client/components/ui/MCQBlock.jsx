"use client";
import { useState, useMemo, useEffect } from "react";
import { Button } from "./button";

const MCQBlock = ({ mcqs }) => {
  const initialAnswers = useMemo(() => {
    return Array.isArray(mcqs) ? Array(mcqs.length).fill(null) : [];
  }, [mcqs]);

  const [answers, setAnswers] = useState(initialAnswers);

  useEffect(() => {
    if (Array.isArray(mcqs)) {
      setAnswers(Array(mcqs.length).fill(null));
    } else {
      setAnswers([]);
    }
  }, [mcqs]);

  function getAnswer(idx, key) {
    const updated = [...answers];
    if (updated[idx] === null) {
      updated[idx] = key === mcqs[idx].answer ? "Correct!" : "Wrong Answer";
      setAnswers(updated);
    }
  }

  if (!Array.isArray(mcqs) || mcqs.length === 0) {
    return null;
  }

  return (
    <div className="p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-semibold mb-2">MCQs</h2>
      <ul className="list-disc pl-5">
        {mcqs.map((mcq, idx) => (
          <li key={idx} className="mb-3">
            <div className="font-medium mb-1">{mcq.question}</div>
            <ul className="flex flex-col w-100">
              {Object.entries(mcq.options).map(([key, value]) => {
                const isSelected = answers[idx] !== null;

                return (
                  <Button
                    disabled={isSelected}
                    variant="ghost"
                    onClick={() => getAnswer(idx, key)}
                    key={key}
                    className="mb-1 flex items-center justify-start"
                  >
                    <span
                      className="font-semibold text-left mr-2"
                      style={{
                        textAlign: "left",
                        width: "2em",
                        display: "inline-block",
                      }}
                    >
                      {key}:
                    </span>
                    <span className="text-left">{value}</span>
                  </Button>
                );
              })}
            </ul>
            <div>
              {answers[idx] && (
                <h2
                  className={`border border-1 w-fit p-1 ${
                    answers[idx] === "Correct!"
                      ? "border-green-500   text-green-200"
                      : "border-red-500   text-red-400"
                  }`}
                >
                  {answers[idx]}
                </h2>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MCQBlock;