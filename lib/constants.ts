export const APP_NAME = 'Nine';

export const NINE_MEDIA_BUCKET_NAME = 'Nine-media-storage';

export const BLUR_HASH =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


export const LUCIDE_ICON_THEME_COLOR = {
  light: '#6b7280',
  dark: '#6b7280',
}

export const MAX_CATEGORY_COUNT = 4;

export const BRAND_COLOR_MAP: { [key: string]: string } = {
  'facebook': '#1877F2',
  'twitter': '#1DA1F2',
  'x': '#000000', // New Twitter/X brand color
  'instagram': '#E4405F',
  'linkedin': '#0A66C2',
  'github': '#181717',
  'youtube': '#FF0000',
  'tiktok': '#000000',
  'whatsapp': '#25D366',
  'telegram': '#26A5E4',
  'pinterest': '#BD081C',
  'snapchat': '#FFFC00',
  'medium': '#000000',
  'behance': '#1769FF',
  'dribbble': '#EA4C89',
  'twitch': '#9146FF',
  'discord': '#5865F2',
  'reddit': '#FF4500',
  'spotify': '#1DB954',
  'threads': '#000000'
};

export const NAV_THEME = {
  light: {
    background: 'hsl(0 0% 100%)', // background
    border: 'hsl(240 5.9% 90%)', // border
    card: 'hsl(0 0% 100%)', // card
    notification: 'hsl(0 84.2% 60.2%)', // destructive
    primary: 'hsl(240 5.9% 10%)', // primary
    text: 'hsl(240 10% 3.9%)', // foreground
  },
  dark: {
    background: 'hsl(240 10% 3.9%)', // background
    border: 'hsl(240 3.7% 15.9%)', // border
    card: 'hsl(240 10% 3.9%)', // card
    notification: 'hsl(0 72% 51%)', // destructive
    primary: 'hsl(0 0% 98%)', // primary
    text: 'hsl(0 0% 98%)', // foreground
  },
};

export const BUTTON_THEME = {
  light: {
    primary: "#1d4ed8",
    "secondary": "#93c5fd",
    "accent": "#bfdbfe",
    "neutral": "#dbeafe",
    "base-100": "#f3f4f6",
    "base-200": "#e5e7eb",
    "base-300": "#d1d5dd",
    "info": "#2563eb",
    "success": "#22c55e",
    "warning": "#facc15",
    "error": "#dc2626",
    "default": "#e8f2ff"
  },
  dark: {
    "primary": "#1d4ed8",
    "secondary": "#93c5fd",
    "accent": "#1a1a2f",
    "neutral": "#151931",
    "base-300": "#000304",
    "base-200": "#111315",
    "base-100": "#22242A",
    "info": "#2563eb",
    "success": "#22c55e",
    "warning": "#facc15",
    "warning-inverse": "#facc1530",
    "error": "#dc2626",
    "error-inverse": "#dc262640",
  }
}

export const GITHUB_CLIENT_ID = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.EXPO_PUBLIC_GITHUB_CLIENT_SECRET;
export const GITHUB_ACCESS_TOKEN = process.env.EXPO_PUBLIC_GITHUB_ACCESS_TOKEN!

export const getLanguageColor = (language: string): string => {
  const colors: { [key: string]: string } = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    Ruby: '#701516',
    Go: '#00ADD8',
    Swift: '#ffac45',
    Kotlin: '#A97BFF',
    Rust: '#dea584',
    PHP: '#4F5D95',
    CSS: '#563d7c',
    HTML: '#e34c26',
    Vue: '#41b883',
    React: '#61dafb',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#178600',
    Shell: '#89e051',
    Dart: '#00B4AB',
  };

  return colors[language] || '#8f8f8f'; // Default color for unknown languages
};

export const PROGRAMMING_LANGUAGE_ICONS: { [key: string]: string } = {
  'javascript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'typescript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  'kotlin': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
  'swift': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg',
  'rust': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg',
  'go': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg',
  'ruby': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg',
  'php': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
  'csharp': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
  'c#': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
  'cplusplus': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
  'c++': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
  'c': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
  'dart': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg',
  'html': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  'css': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  'react': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'vue': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
  'angular': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
  'shell': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg'
};

export const FRAMEWORK_ICONS: { [key: string]: string } = {
  'react': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'angular': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
  'vue': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
  'svelte': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg',
  'nextjs': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  'nuxtjs': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg',
  'gatsby': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gatsby/gatsby-original.svg',
  'ember': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ember/ember-original.svg',
  'backbonejs': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/backbonejs/backbonejs-original.svg',
  'meteor': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/meteor/meteor-original.svg',
  'express': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
  'django': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-original.svg',
  'flask': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg',
  'spring': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
  'laravel': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg',
  'rails': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rails/rails-original.svg',
  'symfony': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/symfony/symfony-original.svg',
  'codeigniter': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/codeigniter/codeigniter-original.svg',
  'zend': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/zend/zend-original.svg',
  'cakephp': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cakephp/cakephp-original.svg'
};
