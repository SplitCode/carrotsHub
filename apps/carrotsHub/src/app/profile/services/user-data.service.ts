import { inject, Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { from, type Observable } from "rxjs";
import type { UserData, UserDataForDate } from "../models/user-data.interface";

@Injectable({
  providedIn: "root",
})
export class UserDataService {
  private readonly db = inject(AngularFireDatabase);

  getUserData(uid: string): Observable<UserData | null> {
    return this.db.object<UserData>(`users/${uid}`).valueChanges();
  }

  updateUserData(uid: string, userData: Partial<UserData>): Observable<void> {
    return from(this.db.object(`users/${uid}`).update(userData));
  }

  getUserDataForDate(
    uid: string,
    date: string
  ): Observable<UserDataForDate | null> {
    return this.db
      .object<UserDataForDate>(`users/${uid}/dates/${date}`)
      .valueChanges();
  }

  updateUserDataForDate(
    uid: string,
    date: string,
    userDataForDate: Partial<UserDataForDate>
  ): Observable<void> {
    return from(
      this.db.object(`users/${uid}/dates/${date}`).update(userDataForDate)
    );
  }
}
