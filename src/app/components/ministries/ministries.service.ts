import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  getDocs,
} from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { Ministries } from './ministries.model';

@Injectable({ providedIn: 'root' })
export class MinistriesService {
  constructor(private firestore: Firestore) {}

  getMinistries(): Observable<Ministries[]> {
    const ref = collection(this.firestore, 'ministries');
    return from(getDocs(ref)).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => {
          const data = doc.data() as Ministries;
          return {
            ...data,
            id: doc.id, // Optional: include doc ID if needed
          };
        })
      )
    );
  }
}
