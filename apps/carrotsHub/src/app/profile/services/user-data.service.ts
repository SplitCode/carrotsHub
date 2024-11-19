import { inject, Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { from, type Observable } from "rxjs";
import type { UserData } from "../models/user-data.interface";

export interface UserDataForDate {
  caloriesMax: number;
  caloriesConsumed: number;
  proteinCurrent: number;
  fatCurrent: number;
  carbsCurrent: number;
  totalWater: number;
  waterGlasses: boolean[];
}

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

  getUserDataForDate(uid: string, date: string) {
    return this.db.object<UserDataForDate>(`users/${uid}`).valueChanges();
    console.info(uid, date);
  }
}
