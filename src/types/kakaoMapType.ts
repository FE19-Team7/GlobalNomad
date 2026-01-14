// 좌표 타입
export interface Coordinates {
  lat: number;
  lng: number;
}

// 카카오맵 타입 정의
export interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}

export interface KakaoMarker {
  setMap(map: KakaoMap | null): void;
}

export interface KakaoMap {
  setCenter(latlng: KakaoLatLng): void;
  getLevel(): number;
  setLevel(level: number): void;
}

export interface KakaoMaps {
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMap;
  Marker: new (options: { position: KakaoLatLng }) => KakaoMarker;
  load(callback: () => void): void;
}

export interface Kakao {
  maps: KakaoMaps;
}

// 카카오맵 전역 타입 선언
declare global {
  interface Window {
    kakao: Kakao;
  }
}

export {};