import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import type { Observable } from "rxjs";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { catchError, from, map, throwError } from "rxjs";
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
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

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

  isAuth(): Observable<boolean> {
    return this.auth.authState.pipe(map((user) => !!user));
    // const user = await angularFireAuth.currentUser;
    // const isLoggedIn = !!user;
    // return isLoggedIn;
  }

  // async registerUser(email: string, password: string): Promise<void> {
  //   try {
  //     const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
  //     console.log("User registered successfully:", userCredential.user);
  //   } catch (error) {
  //     console.error("Registration failed:", error);
  //   }
  // }

  // recoverPassword(email: string): Observable<void> {
  //   return from(this.auth.sendPasswordResetEmail(email)).pipe(
  //     catchError((error: FirebaseError) =>
  //       throwError(() => new Error(this.translateFirebaseErrorMessage(error)))
  //     )
  //   );
  // }

  translateFirebaseErrorMessage({ code }: FirebaseError): string {
    if (code === "auth/user-not-found" || code === "auth/invalid-credential") {
      return MESSAGES.errorLogin;
    }
    if (code === "auth/network-request-failed") {
      return MESSAGES.errorNoInternet;
    }
    if (code === "auth/too-many-requests") {
      return MESSAGES.errorTooManyRequests;
    }
    if (code === "auth/internal-error") {
      return MESSAGES.errorServer;
    }
    return MESSAGES.errorUnknown;
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

  getUser(): Observable<firebase.User | null> {
    return this.auth.authState;
  }
}
