import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  getDocs,
} from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { GalleryEvent, GalleryImage } from './gallery.model';
import { getDownloadURL, getStorage, listAll, ref } from 'firebase/storage';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { uploadBytes, Storage, deleteObject } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class GalleryService {
  functions = inject(Functions);
  storage = inject(Storage);

  constructor(private firestore: Firestore) {}

  getGalleryEvents(): Observable<GalleryEvent[]> {
    const ref = collection(this.firestore, 'unitedMissionsGalleryAlbums');
    return from(getDocs(ref)).pipe(
      map((snapshot) => {
        return snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as GalleryEvent)
        );
      })
    );
  }

  getEventImages(eventId: string): Promise<string[]> {
    const storage = getStorage();
    const folderRef = ref(storage, `united-mission-gallery/${eventId}`);

    return listAll(folderRef).then(async (res) => {
      const urls = await Promise.all(
        res.items.map((itemRef) => getDownloadURL(itemRef))
      );
      return urls;
    });
  }

  async createAlbum(
    albumName: string,
    albumNameEs: string,
    description: string,
    descriptionEs: string,
    coverPhotoFile: File,
    selectedImages: File[]
  ): Promise<{ albumId: string; coverPhotoUrl: string }> {
    const tempAlbumId = doc(
      collection(this.firestore, 'unitedMissionsGalleryAlbums')
    ).id;

    // Upload cover photo first
    const coverFilePath = `united-mission-gallery/${tempAlbumId}/cover_${Date.now()}_${
      coverPhotoFile.name
    }`;
    const coverRef = ref(this.storage, coverFilePath);
    const coverSnapshot = await uploadBytes(coverRef, coverPhotoFile);
    const coverPhotoUrl = await getDownloadURL(coverSnapshot.ref);

    // Create album with cover URL
    const createAlbumFn = httpsCallable(this.functions, 'createAlbum');
    await createAlbumFn({
      albumId: tempAlbumId,
      albumName,
      albumNameEs,
      description,
      descriptionEs,
      coverPhotoUrl,
      totalItems: selectedImages.length + 1,
    });

    // Upload additional images
    const imageUploadPromises = selectedImages.map(async (file) => {
      const filePath = `united-mission-gallery/${tempAlbumId}/${Date.now()}_${
        file.name
      }`;
      const imageRef = ref(this.storage, filePath);
      const snapshot = await uploadBytes(imageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      return { name: file.name, url };
    });

    const uploadedImages = await Promise.all(imageUploadPromises);

    // Register uploaded image URLs
    const addImagesFn = httpsCallable(this.functions, 'addImagesToAlbum');
    await addImagesFn({ albumId: tempAlbumId, images: uploadedImages });

    return { albumId: tempAlbumId, coverPhotoUrl };
  }

  async deleteAlbum(albumId: string): Promise<any> {
    const deleteFn = httpsCallable(this.functions, 'deleteGalleryAlbum');
    return deleteFn({ albumId });
  }

  async deleteImagesFromStorage(imageUrls: string[]): Promise<void> {
    const deletePromises = imageUrls.map(async (url) => {
      try {
        const path = this.extractStoragePathFromUrl(url);
        const storageRef = ref(this.storage, path);
        await deleteObject(storageRef);
      } catch (err) {
        console.error(`Error deleting ${url}:`, err);
        throw err;
      }
    });

    await Promise.all(deletePromises);
  }

  private extractStoragePathFromUrl(url: string): string {
    const match = decodeURIComponent(url).match(/\/o\/(.*?)\?/);
    if (match && match[1]) {
      return match[1]; // Path inside Firebase Storage
    } else {
      throw new Error('Invalid Firebase Storage URL');
    }
  }

  async addImagesToAlbum(
    albumId: string, // Or albumId, depending on your structure
    newImages: File[]
  ): Promise<any> {
    const addImagesToAlbum = httpsCallable(this.functions, 'addImagesToAlbum');

    const uploadPromises = newImages.map(async (file) => {
      const path = `united-mission-gallery/${albumId}/${Date.now()}_${
        file.name
      }`;
      const imageRef = ref(this.storage, path);
      const snapshot = await uploadBytes(imageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      return { name: file.name, url };
    });

    const uploadedImages = await Promise.all(uploadPromises);

    // Call Cloud Function to add metadata to Firestore
    return addImagesToAlbum({
      albumId, // or albumId
      images: uploadedImages,
    });
  }

  async updateAlbum(
    albumId: string,
    updatedTitleEn: string,
    updatedTitleEs: string,
    updatedDescriptionEn: string,
    updatedDescriptionEs: string,
    newCoverPhotoFile?: File // optional
  ): Promise<any> {
    const updateAlbumFn = httpsCallable(this.functions, 'updateAlbum');

    let newCoverPhotoUrl: string | null = null;

    // If a new cover photo was provided, upload it
    if (newCoverPhotoFile) {
      const filePath = `united-mission-gallery/${albumId}/cover_${Date.now()}_${
        newCoverPhotoFile.name
      }`;
      const imageRef = ref(this.storage, filePath);
      const snapshot = await uploadBytes(imageRef, newCoverPhotoFile);
      newCoverPhotoUrl = await getDownloadURL(snapshot.ref);
    }

    // Call cloud function to update the album metadata
    return updateAlbumFn({
      albumId,
      updatedTitleEn,
      updatedTitleEs,
      updatedDescriptionEn,
      updatedDescriptionEs,
      newCoverPhotoUrl, // null if unchanged
    });
  }
}
