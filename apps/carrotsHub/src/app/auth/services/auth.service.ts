import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import type { Observable } from "rxjs";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { catchError, from, map, throwError } from "rxjs";
import type firebase from "firebase/compat/app";
// import { environment } from "../../../environments/environment";
import "firebase/compat/auth";
import type { LoginCredentials } from "../models/auth.models";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly auth = inject(AngularFireAuth);
  private readonly http = inject(HttpClient);

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

  private translateFirebaseErrorMessage({ code, message }: FirebaseError) {
    if (code === "auth/user-not-found") {
      return "User not found.";
    }
    if (code === "auth/wrong-password") {
      return "User not found.";
    }
    return message;
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

type FirebaseError = {
  code: string;
  message: string;
};
