import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Timestamp } from 'firebase/firestore';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  getDoc,
  addDoc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';

import * as CryptoJS from 'crypto-js';

const app = getApps().length
  ? getApp()
  : initializeApp(environment.firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private secretKey = 'MiClaveSecreta123';

  private currentUserIdSubject = new BehaviorSubject<string | null>(
    this.getUserIdFromToken()
  );

  currentUserId$ = this.currentUserIdSubject.asObservable();

  private currentUserRoleSubject = new BehaviorSubject<string | null>(
    this.checkRole()
  );
  currentUserRole$ = this.currentUserRoleSubject.asObservable();

  private autenticadoSubject = new BehaviorSubject<boolean>(this.checkToken());
  autenticado$ = this.autenticadoSubject.asObservable();

  constructor(private router: Router, private http: HttpClient) { }

  private checkRole(): string | null {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = this.decodeJWT(token);
      return decodedToken?.role || null;
    }
    return null;
  }

  private getUserIdFromToken(): string | null {
    const token = localStorage.getItem('jwtToken');
    if (!token) return null;

    try {
      const decodedToken = this.decodeJWT(token);
      return decodedToken?.id || null; // Aquí se extrae el ID del JWT
    } catch (error) {
      console.error('Error al obtener el ID desde el token', error);
      return null;
    }
  }

  async loginenvio(
    username: string,
    password: string,
    showError: (msg: string) => void,
    presentLoginAlert: () => void,
    showSplashSetter: (value: boolean) => void
  ) {
    showSplashSetter(true);
    localStorage.removeItem('jwtToken');

    try {
      const userData = await this.getUserData(username);
      if (!userData) {
        showError('Usuario no encontrado');
        showSplashSetter(false);
        return;
      }
      // console.log(userData)
      const DencryptedPss = this.decryptData(userData['password']);

      if (DencryptedPss !== password) {
        showError('Contraseña incorrecta');
        showSplashSetter(false);
        return;
      }
      const token = this.generateJWT(
        userData['fullName'],
        username,
        userData['email'],
        userData['role'],
        userData['id'],
        userData['birthDate'],
      );

      localStorage.setItem('jwtToken', token); // Guarda el token en localStorage

      showSplashSetter(false);
      presentLoginAlert();
    } catch (error) {
      console.error(error);
      showError('Hubo un problema al iniciar sesión');
      showSplashSetter(false);
    }
  }

  private async getUserData(username: string) {
    const db = getFirestore();
    const usersCollection = collection(db, 'users');
    const querySnapshot = await getDocs(
      query(usersCollection, where('username', '==', username.toLowerCase()))
    );
    return querySnapshot.empty ? null : querySnapshot.docs[0].data();
  }

  private generateJWT(
    fullName: string,
    username: string,
    email: string,
    roleData: string,
    userId: string,
    birthDate: Date | string
  ): string {
    console.log(roleData);
    const role = this.decryptData(roleData);

    const formattedBirthDate =
      birthDate instanceof Date ? birthDate.toISOString() : birthDate;

    const payload = {
      fullName,
      email,
      username,
      role,
      id: userId,
      birthDate: formattedBirthDate,
    };
    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));

    return `${encodedHeader}.${encodedPayload}`;
  }

  decodeJWT(token: string): any {
    try {
      const [encodedHeader, encodedPayload] = token.split('.');
      const decodedPayload = JSON.parse(atob(encodedPayload));
      return decodedPayload;
    } catch (error) {
      console.error('Error al decodificar el token', error);
      return null;
    }
  }

  async getAllUsers() {
    const db = getFirestore();
    const usersCollection = collection(db, 'users');
    const querySnapshot = await getDocs(usersCollection);

    const users = [];
    for (const doc of querySnapshot.docs) {
      const userData = doc.data();
      users.push({
        ...userData,
        id: doc.id,
      });
    }
    return users;
  }

  private checkToken(): boolean {
    return !!localStorage.getItem('jwtToken');
  }

  logout() {
    localStorage.removeItem('jwtToken');
    this.currentUserRoleSubject.next(null); // Se reinicia el rol global
    this.autenticadoSubject.next(false);
    this.router.navigate(['/navbar/login']);
  }

  getUsernameFromToken(): string | null {
    const token = localStorage.getItem('jwtToken');
    if (!token) return null;

    try {
      const decodedToken = this.decodeJWT(token);
      return decodedToken?.username || null;
    } catch (error) {
      console.error(
        'Error al obtener el nombre de usuario desde el token',
        error
      );
      return null;
    }
  }

  getFullNameFromToken(): string | null {
    const token = localStorage.getItem('jwtToken');
    if (!token) return null;

    try {
      const decodedToken = this.decodeJWT(token);
      return decodedToken?.fullName || null;
    } catch (error) {
      console.error(
        'Error al obtener el nombre de usuario desde el token',
        error
      );
      return null;
    }
  }

  async eliminarUsuario(userId: string): Promise<void> {
    const db = getFirestore();
    const userDocRef = doc(db, 'users', userId);

    try {
      // Elimina el documento de Firestore
      await deleteDoc(userDocRef);
      console.log('Usuario eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar el usuario', error);
      throw new Error('No se pudo eliminar el usuario');
    }
  }

  async registerUser(
    username: string,
    email: string,
    password: string,
    fullName: string,
    birthDate: string
  ) {
    try {

      console.log('Usuario registrado correctamente');
    } catch (error) {
      console.error('Error al registrar el usuario:', (error as Error).message);
      throw error;
    }
  }

  async updateUser(
    username: string,
    email: string,
    password: string,
    fullName: string,
    birthDate: string,
    idUser: string
  ) {
    try {
      const usersCollection = collection(db, "users");

      // Consultar si el username o email ya están en uso por otro usuario
      const usernameQuery = query(usersCollection, where("username", "==", username), where("__name__", "!=", idUser));
      const emailQuery = query(usersCollection, where("email", "==", email), where("__name__", "!=", idUser));

      const [usernameSnapshot, emailSnapshot] = await Promise.all([
        getDocs(usernameQuery),
        getDocs(emailQuery),
      ]);

      if (!usernameSnapshot.empty) {
        throw new Error("El nombre de usuario ya está en uso por otro usuario.");
      }

      if (!emailSnapshot.empty) {
        throw new Error("El correo electrónico ya está registrado por otro usuario.");
      }

      // Si no hay conflictos, proceder con la actualización
      const userDocRef = doc(db, "users", idUser);
      const updatedUser = {
        username,
        fullName,
        email,
        password,
        birthDate: Timestamp.fromDate(new Date(birthDate)),
      };

      await updateDoc(userDocRef, updatedUser);
      console.log("Usuario actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw new Error("Error al actualizar el usuario: " + (error as Error).message);
    }
  }

  register(data: any): Observable<any> {
    return this.http.post(`${ environment.function_registro}`, data).pipe(
      tap((response) => {
        this.guardaStorage(response);
      })
    );
  }



  loginService(username:String, password:String): Observable<any> {
    return this.http.post(`${environment.function_login}`, {username, password} ).pipe(
      tap((response: any) => {
        if (response?.token) {
          this.guardaStorage(response);
        } else {
          console.warn('Login exitoso, pero sin token');
        }
      }),
      catchError((error) => {
        console.error('Error en el login:', error);
        return throwError(() => new Error('Credenciales incorrectas'));
      })
    );
  }
  

  guardaStorage(response: any) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    console.log(response)
  }



  private decryptData(encryptedRole: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedRole, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
