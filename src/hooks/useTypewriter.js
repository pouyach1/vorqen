import { useEffect, useState } from "react";

/**
 * Cycles through an array of messages, typing and deleting each one.
 * @param {string[]} messages
 * @param {{ typeSpeed?: number, deleteSpeed?: number, pauseMs?: number }} options
 */
export function useTypewriter(messages, options = {}) {
  const { typeSpeed = 45, deleteSpeed = 25, pauseMs = 1800 } = options;
  const [messageIndex, setMessageIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!messages?.length) return undefined;
    const current = messages[messageIndex % messages.length];

    let timeout;
    if (!isDeleting && text.length < current.length) {
      timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), typeSpeed);
    } else if (!isDeleting && text.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), pauseMs);
    } else if (isDeleting && text.length > 0) {
      timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), deleteSpeed);
    } else if (isDeleting && text.length === 0) {
      setIsDeleting(false);
      setMessageIndex((i) => i + 1);
    }
    return () => clearTimeout(timeout);
  }, [text, isDeleting, messageIndex, messages, typeSpeed, deleteSpeed, pauseMs]);

  return text;
}
