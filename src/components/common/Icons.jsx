/** Inline stroke icons (24x24) used across the app. All accept className. */

const Svg = ({ className = 'h-5 w-5', children, strokeWidth = 1.8 }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth}
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

export const CheckIcon = (p) => <Svg strokeWidth={2.6} {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></Svg>;
export const ArrowRightIcon = (p) => <Svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
export const ArrowLeftIcon = (p) => <Svg {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></Svg>;
export const ShieldIcon = (p) => <Svg {...p}><path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3Z" /><path d="M9 12l2 2 4-4" /></Svg>;
export const LockIcon = (p) => <Svg {...p}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Svg>;
export const PhoneIcon = (p) => <Svg {...p}><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M11 18.5h2" /></Svg>;
export const MailIcon = (p) => <Svg {...p}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></Svg>;
export const UserIcon = (p) => <Svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6" /></Svg>;
export const IdCardIcon = (p) => <Svg {...p}><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><circle cx="8.5" cy="11" r="2" /><path d="M5.5 16c.6-1.5 1.8-2.2 3-2.2s2.4.7 3 2.2M14 10h4.5M14 13.5h3" /></Svg>;
export const HashIcon = (p) => <Svg {...p}><path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16" /></Svg>;
export const BuildingIcon = (p) => <Svg {...p}><path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-5h6v5M9 12h.01M15 12h.01" /></Svg>;
export const ChartIcon = (p) => <Svg {...p}><path d="M3 20h18M6 16l4-5 3 3 5-7" /><path d="M15 7h3v3" /></Svg>;
export const WalletIcon = (p) => <Svg {...p}><rect x="3" y="6" width="18" height="14" rx="2.5" /><path d="M3 10h18M16 15h2M7 6l9-3 1.5 3" /></Svg>;
export const LayersIcon = (p) => <Svg {...p}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></Svg>;
export const FileIcon = (p) => <Svg {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></Svg>;
export const UploadIcon = (p) => <Svg {...p}><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></Svg>;
export const PenIcon = (p) => <Svg {...p}><path d="M3 21h6l11-11a2.8 2.8 0 0 0-4-4L5 17l-2 4Z" /><path d="m14 7 3 3" /></Svg>;
export const CropIcon = (p) => <Svg {...p}><path d="M6 2v14a2 2 0 0 0 2 2h14M2 6h14a2 2 0 0 1 2 2v14" /></Svg>;
export const EyeIcon = (p) => <Svg {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></Svg>;
export const EyeOffIcon = (p) => <Svg {...p}><path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.1A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.2M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6" /></Svg>;
export const InfoIcon = (p) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></Svg>;
export const ClockIcon = (p) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>;
export const SwapIcon = (p) => <Svg {...p}><path d="M7 4 3 8l4 4M3 8h13M17 20l4-4-4-4M21 16H8" /></Svg>;
export const SparkIcon = (p) => <Svg {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></Svg>;
export const LogoutIcon = (p) => <Svg {...p}><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H4" /></Svg>;
export const AlertIcon = (p) => <Svg {...p}><path d="M12 3 2 20h20L12 3Z" /><path d="M12 10v4M12 17h.01" /></Svg>;
