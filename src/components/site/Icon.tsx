export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg className={`arrow ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}
