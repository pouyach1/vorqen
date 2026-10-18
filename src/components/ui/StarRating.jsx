export default function StarRating({ rating = 5, max = 5 }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i < rating ? "fill-cyan-neon drop-shadow-[0_0_4px_rgba(0,243,255,0.7)]" : "fill-slate-700"}`}
        >
          <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7z" />
        </svg>
      ))}
    </div>
  );
}
