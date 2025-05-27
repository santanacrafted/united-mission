import { Injectable } from '@angular/core';
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

@Injectable({ providedIn: 'root' })
export class GalleryService {
  constructor(private firestore: Firestore) {}

  getGalleryEvents(): Observable<GalleryEvent[]> {
    const ref = collection(this.firestore, 'galleryEvents');
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
    const folderRef = ref(storage, `church-gallery/${eventId}`);

    return listAll(folderRef).then(async (res) => {
      const urls = await Promise.all(
        res.items.map((itemRef) => getDownloadURL(itemRef))
      );
      return urls;
    });
  }
}
