import { useTypewriter } from "../../hooks/useTypewriter";

export default function TypewriterText({ messages, className = "" }) {
  const text = useTypewriter(messages);
  return (
    <p className={`font-mono text-sm text-cyan-neon ${className}`}>
      {text}
      <span className="animate-pulse-slow">_</span>
    </p>
  );
}
