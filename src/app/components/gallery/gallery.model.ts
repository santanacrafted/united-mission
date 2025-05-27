export interface GalleryEvent {
  id: string;
  title: { en: string; es: string };
  description: { en: string; es: string };
  coverImage: string;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
}
