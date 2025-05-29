export interface GalleryEvent {
  id: string;
  name: { en: string; es: string };
  description: { en: string; es: string };
  coverImage: string;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  name: string;
  description: string;
}
