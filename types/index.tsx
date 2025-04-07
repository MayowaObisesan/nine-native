// types.ts
export interface I_ImageAsset {
  base64: string;
  uri: string;
  width: number;
  height: number;
  type?: string;
}

export interface I_AppLogoProps {
  currentLogo?: string;
}
