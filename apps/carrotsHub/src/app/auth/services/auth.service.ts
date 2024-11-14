import { Injectable, inject } from "@angular/core";
// import { HttpClient } from "@angular/common/http";
import type { Observable } from "rxjs";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { catchError, from, of, switchMap, throwError } from "rxjs";
import type firebase from "firebase/compat/app";
// import { environment } from "../../../environments/environment";
import "firebase/compat/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { Router } from "@angular/router";
import type { LoginCredentials, FirebaseError } from "../models/auth.models";
import { MESSAGES } from "../../shared/constants/notification-messages";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly auth = inject(AngularFireAuth);
  // private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
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

  logout(): Observable<void> {
    return from(this.auth.signOut());
  }

  register(name: string, email: string, password: string): Observable<void> {
    return from(this.auth.createUserWithEmailAndPassword(email, password)).pipe(
      switchMap((userCredential) => {
        const user = userCredential.user;
        if (user) {
          return from(user.updateProfile({ displayName: name }));
        }
        return of();
      }),
      catchError((error: FirebaseError) =>
        throwError(() => new Error(this.translateFirebaseErrorMessage(error)))
      )
    );
  }

  // recoverPassword(email: string): Observable<void> {
  //   return from(this.auth.sendPasswordResetEmail(email)).pipe(
  //     catchError((error: FirebaseError) =>
  //       throwError(() => new Error(this.translateFirebaseErrorMessage(error)))
  //     )
  //   );
  // }

  translateFirebaseErrorMessage({ code }: FirebaseError): string {
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
      default:
        return MESSAGES.errorUnknown;
    }
  }

  async googleLogin(): Promise<void> {
    const creds = await this.auth.signInWithPopup(new GoogleAuthProvider());
    this.router.navigate([""]);
    console.info(creds);
  }

  // async googleLogin(): Promise<void> {
  //   const provider = new firebase.auth.GoogleAuthProvider();
  //   const credential = await this.auth.signInWithPopup(provider);
  //   await this.sendTokenToBackend(credential.user as firebase.User);
  // }

  // private async sendTokenToBackend(user: firebase.User | null) {
  //   if (user) {
  //     const idToken = await user.getIdToken();
  //     await firstValueFrom(
  //       this.http.post(`${environment.backendUrl}/api/auth/login`, { idToken })
  //     );
  //   }
  // }

  // isAuth(): Observable<boolean> {
  //   return this.auth.authState.pipe(map((user) => !!user));
  //   // const user = await angularFireAuth.currentUser;
  //   // const isLoggedIn = !!user;
  //   // return isLoggedIn;
  // }

  // getUser(): Observable<firebase.User | null> {
  //   return this.auth.authState;
  // }
}
