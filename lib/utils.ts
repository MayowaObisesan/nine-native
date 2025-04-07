import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';
import { getLanguageColor } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function truncateLetters(text: string, start: number, stop: number) {
  try {
    // consoler.innerHTML += "truncate_letters";
    start = Number(start);
    stop = Number(stop);
    text = text?.toString();
    let text_split = text?.split('');
    /*
    * Don't use splice in the below scenario, use slice instead.
    * Splice changes text_split.length to the text_split.length - stop which if;
    * text_split.length == 118 and stop = 80, text_split.splice(start, stop) changes the value to 38 when
    * subtracting the stop value from the text_split.length value below. */
    // let text_split_splice = text_split?.splice(start, stop)
    let text_split_splice = text_split?.slice(start, stop)
    // let text_split_splice_string = text_split_splice.toString();
    let truncated_letters = text_split_splice?.join('')
    // consoler.innerHTML += " Word Truncated :" + truncated_letters;
    return (text_split?.length > stop) ? truncated_letters + '...' : truncated_letters;
  } catch (err) {
    alert('TRUNCATE LETTERS ERROR:' + err)
  }
}

export function truncate_words(text: string, start: number, stop: number) {
  try {
    // consoler.innerHTML += "truncate_words";
    start = Number(start)
    stop = Number(stop)
    text = text?.toString();
    let text_split = text.split(' ')
    let text_split_splice = text_split.splice(start, stop)
    // let text_split_splice_string = text_split_splice.toString();
    let truncated_words = text_split_splice.join(' ')
    // consoler.innerHTML += " Word Truncated :" + truncated_words;
    return Number(text_split.length) > stop ? truncated_words + '...' : truncated_words
  } catch (err) {
    alert('TRUNCATE WORDS ERROR:' + err)
  }
}

export const getExternalLinkDomain = (url: string | undefined): string => {
  if (!url) return "-";
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return "External Download";
  }
};

export const getSocialAccountHandle = (socialAccountLink: string) => {
  const splittedLink = socialAccountLink.split("/");
  return splittedLink[splittedLink.length - 1];
};

export const isValidURL = (url: string) => {
  // const urlData = URL(url);
  // ["http:", "https:"].includes(urlData.protocol)
  return (url !== null || undefined) ? url?.startsWith("http") : false
}

export const deviceWidthEnum = {
  "desktop": 1200,
  "laptop": 992,
  "tablet": 768,
  "phone": 600
}

export const getFormattedPhoneNumber = (user: any) => {
  return "+" + user?.country_data?.callingCode[0] + user?.phone_no;
}

export function convertLanguageData(languages: { [key: string]: number }) {
  const defaultColor = '#8f8f8f'; // Default color for unknown languages
  return Object.entries(languages).map(([name, value]) => ({
    name,
    value,
    color: getLanguageColor(name) || defaultColor
  }));
}

export function getOwnerAndRepoFromUrl(url: string) {
  const [owner, repo] = new URL(url).pathname.replace("/", "").split("/");
  return [owner, repo];
}

export const arrayToIndexedObject = (array: string[]) => {
  return array.reduce((acc, item, index) => {
    acc[index] = item;
    return acc;
  }, {} as Record<number, string>);
};

export const formattedDate = (date: string) => {
  if (!date) return date;

  return new Date(date).toLocaleDateString("en-us", {
    year: "numeric",
    month: 'long',
    day: 'numeric'
  })
}
