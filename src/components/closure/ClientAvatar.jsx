/** Friendly user illustration for the Step 2 gradient panel. */
export default function ClientAvatar({ className = 'h-24 w-24' }) {
  return (
    <div className="relative">
      <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber-300" />
      <span className="absolute -left-2 bottom-3 h-2 w-2 rounded-full bg-amber-200" />
      <span className="absolute -bottom-1 right-2 h-1.5 w-1.5 rounded-full bg-sky-200" />
      <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
        <defs>
          <clipPath id="avatar-clip"><circle cx="48" cy="48" r="44" /></clipPath>
        </defs>
        <circle cx="48" cy="48" r="46" fill="#ffffff" opacity="0.95" />
        <circle cx="48" cy="48" r="44" fill="#A7DDEB" />
        <g clipPath="url(#avatar-clip)">
          <path d="M14 96c2-18 15-28 34-28s32 10 34 28Z" fill="#6FB7D6" />
          <path d="M40 62h16v10c0 4-4 7-8 7s-8-3-8-7Z" fill="#F2C29E" />
          <ellipse cx="48" cy="44" rx="16" ry="19" fill="#F6D0B1" />
          <path d="M31 42c-1-14 8-22 18-22 11 0 18 8 17 21-3-6-8-9-14-10-5 4-13 6-21 11Z" fill="#B5652E" />
          <circle cx="42" cy="46" r="1.8" fill="#3b2a20" />
          <circle cx="54" cy="46" r="1.8" fill="#3b2a20" />
          <path d="M43 54c3 2.5 7 2.5 10 0" stroke="#b5583a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
