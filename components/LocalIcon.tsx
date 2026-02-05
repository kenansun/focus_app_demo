import React from 'react';

interface LocalIconProps {
  name: string;
  className?: string;
  size?: number;
  title?: string;
}

const paths: Record<string, React.ReactNode> = {
  security: (
    <path d="M12 2l7 4v6c0 5-3.8 9.3-7 10-3.2-.7-7-5-7-10V6l7-4z" />
  ),
  verified_user: (
    <>
      <path d="M12 2l7 4v6c0 5-3.8 9.3-7 10-3.2-.7-7-5-7-10V6l7-4z" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  touch_app: (
    <>
      <path d="M9 7a3 3 0 116 0 3 3 0 01-6 0z" />
      <path d="M12 12v6l4 2 2-3-3-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  layers: (
    <>
      <path d="M12 4l8 4-8 4-8-4 8-4z" />
      <path d="M4 12l8 4 8-4" stroke="currentColor" strokeWidth="2" fill="none" />
    </>
  ),
  data_usage: (
    <>
      <path d="M4 18h16" stroke="currentColor" strokeWidth="2" />
      <path d="M6 14l3-4 3 3 4-6 2 3" stroke="currentColor" strokeWidth="2" fill="none" />
    </>
  ),
  admin_panel_settings: (
    <>
      <path d="M12 2l7 4v6c0 5-3.8 9.3-7 10-3.2-.7-7-5-7-10V6l7-4z" />
      <circle cx="16.5" cy="13.5" r="3" fill="currentColor" opacity="0.2" />
      <path d="M16.5 11.8v3.4M14.8 13.5h3.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  arrow_back: (
    <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  ),
  chevron_right: (
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  ),
  category: (
    <>
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </>
  ),
  group: (
    <>
      <circle cx="9" cy="8" r="3" />
      <circle cx="15" cy="10" r="3" />
      <path d="M3 20c0-3.3 4-5 6-5s6 1.7 6 5" stroke="currentColor" strokeWidth="2" fill="none" />
    </>
  ),
  sports_esports: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="6" />
      <path d="M8 12h4M10 10v4" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="16" cy="10" r="1.5" />
      <circle cx="18" cy="13" r="1.5" />
    </>
  ),
  school: (
    <>
      <path d="M12 4l9 5-9 5-9-5 9-5z" />
      <path d="M5 12v5l7 4 7-4v-5" stroke="currentColor" strokeWidth="2" fill="none" />
    </>
  ),
  work: (
    <>
      <rect x="4" y="7" width="16" height="11" rx="2" />
      <path d="M9 7V5h6v2" stroke="currentColor" strokeWidth="2" fill="none" />
    </>
  ),
};

export const LocalIcon: React.FC<LocalIconProps> = ({ name, className = '', size = 24, title }) => {
  const content = paths[name] || <circle cx="12" cy="12" r="10" />;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={title || name}
    >
      {content}
    </svg>
  );
};
