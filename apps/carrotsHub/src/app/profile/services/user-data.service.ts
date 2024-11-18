import { inject, Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { from, type Observable } from "rxjs";
import type { UserData } from "../models/user-data.interface";

@Injectable({
  providedIn: "root",
})
export class UserDataService {
  private readonly db = inject(AngularFireDatabase);

  getUserData(uid: string): Observable<UserData | null> {
    return this.db.object<UserData>(`users/${uid}`).valueChanges();
  }

  setUserData(uid: string, userData: UserData): Observable<void> {
    return from(this.db.object(`users/${uid}`).set(userData));
  }

  updateUserData(uid: string, userData: Partial<UserData>): Observable<void> {
    return from(this.db.object(`users/${uid}`).update(userData));
  }

  deleteUserData(uid: string): Observable<void> {
    return from(this.db.object(`users/${uid}`).remove());
  }
}