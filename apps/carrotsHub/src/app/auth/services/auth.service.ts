import { Injectable, inject } from "@angular/core";
import type { Observable } from "rxjs";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { catchError, from, of, switchMap, throwError } from "rxjs";
import type firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { GoogleAuthProvider } from "firebase/auth";
import type {
  LoginCredentials,
  RegistrationCredentials,
  FirebaseError,
} from "../models/auth.models";
import { MESSAGES } from "../../shared/constants/notification-messages";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly auth = inject(AngularFireAuth);
  private readonly db = inject(AngularFireDatabase);
  currentUser$ = this.auth.authState;

  login(params: LoginCredentials): Observable<firebase.auth.UserCredential> {
    return from(
      this.auth.signInWithEmailAndPassword(params.email, params.password)
    ).pipe(
      catchError((error: FirebaseError) =>
        throwError(() => new Error(this.translateFirebaseErrorMessage(error)))
      )
    );
  }

  googleLogin() {
    return from(this.auth.signInWithPopup(new GoogleAuthProvider())).pipe(
      switchMap((userCredential) => {
        const user = userCredential.user;
        if (user) {
          return this.db
            .object(`users/${user.uid}`)
            .valueChanges()
            .pipe(
              switchMap((data) => {
                if (!data) {
                  return this.db.object(`users/${user.uid}`).set({
                    uid: user.uid,
                    name: user.displayName,
                    email: user.email,
                    createdAt: new Date().toISOString(),
                  });
                }
                return of(null);
              })
            );
        }
        return of();
      }),
      catchError((error: FirebaseError) =>
        throwError(() => new Error(this.translateFirebaseErrorMessage(error)))
      )
    );
  }

  logout(): Observable<void> {
    return from(this.auth.signOut());
  }

  register(params: RegistrationCredentials): Observable<void> {
    return from(
      this.auth.createUserWithEmailAndPassword(params.email, params.password)
    ).pipe(
      switchMap((userCredential) => {
        const user = userCredential.user;
        if (user) {
          return from(user.updateProfile({ displayName: params.name })).pipe(
            switchMap(() =>
              this.db.object(`users/${user.uid}`).set({
                uid: user.uid,
                name: params.name,
                email: params.email,
                password: params.password,
                createdAt: new Date().toISOString(),
              })
            )
          );
        }
        return of();
      }),
      catchError((error: FirebaseError) =>
        throwError(() => new Error(this.translateFirebaseErrorMessage(error)))
      )
    );
  }

  private translateFirebaseErrorMessage({ code }: FirebaseError): string {
    switch (code) {
      case "auth/user-not-found":
      case "auth/invalid-credential":
        return MESSAGES.errorLogin;
      case "auth/network-request-failed":
        return MESSAGES.errorNoInternet;
      case "auth/too-many-requests":
        return MESSAGES.errorTooManyRequests;
      case "auth/internal-error":
        return MESSAGES.errorServer;
      case "auth/email-already-in-use":
        return MESSAGES.userAlreadyExist;
      case "auth/popup-closed-by-user":
        return MESSAGES.cancelGoogleLogin;
      default:
        return MESSAGES.errorUnknown;
    }
  }
}
