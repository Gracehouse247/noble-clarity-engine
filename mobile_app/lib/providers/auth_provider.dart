import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../services/api_service.dart';
import 'package:google_sign_in/google_sign_in.dart';
import '../core/firebase_config.dart';

@immutable
class AuthState {
  final String? userId;
  final String? email;
  final String? displayName;
  final String? photoUrl;
  final bool isAuthenticated;
  final bool isLoading;
  final String? errorMessage;
  final bool isTwoFactorEnabled;

  const AuthState({
    this.userId,
    this.email,
    this.displayName,
    this.photoUrl,
    this.isAuthenticated = false,
    this.isLoading = false,
    this.errorMessage,
    this.isTwoFactorEnabled = false,
  });

  AuthState copyWith({
    String? userId,
    String? email,
    String? displayName,
    String? photoUrl,
    bool? isAuthenticated,
    bool? isLoading,
    String? errorMessage,
    bool? isTwoFactorEnabled,
  }) {
    return AuthState(
      userId: userId ?? this.userId,
      email: email ?? this.email,
      displayName: displayName ?? this.displayName,
      photoUrl: photoUrl ?? this.photoUrl,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage,
      isTwoFactorEnabled: isTwoFactorEnabled ?? this.isTwoFactorEnabled,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final Ref ref;
  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: ['email', 'profile'],
    serverClientId: FirebaseConfig.webClientId,
  );

  AuthNotifier(this.ref) : super(const AuthState()) {
    // Listen to auth state changes
    _firebaseAuth.authStateChanges().listen((User? user) {
      if (user != null) {
        state = AuthState(
          userId: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoUrl: user.photoURL,
          isAuthenticated: true,
          isLoading: false,
        );
      } else {
        state = const AuthState();
      }
    });
  }

  // Email/Password Login
  Future<void> login(String email, String password) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final userCredential = await _firebaseAuth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );

      final user = userCredential.user;
      if (user != null) {
        state = AuthState(
          userId: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoUrl: user.photoURL,
          isAuthenticated: true,
          isLoading: false,
        );
      }
    } on FirebaseAuthException catch (e) {
      String errorMessage = 'Login failed';
      if (e.code == 'user-not-found' || e.code == 'invalid-credential') {
        // Handle specifically for redirecting to signup
        errorMessage = 'NO_USER_FOUND';
      } else if (e.code == 'wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (e.code == 'invalid-email') {
        errorMessage = 'Invalid email address';
      }

      state = state.copyWith(isLoading: false, errorMessage: errorMessage);
      rethrow;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'An unexpected error occurred',
      );
      rethrow;
    }
  }

  // Email/Password Signup
  Future<void> signup(String email, {String? password}) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      // If no password provided, generate a random one (for Google sign-in compatibility)
      final pwd = password ?? DateTime.now().millisecondsSinceEpoch.toString();

      final userCredential = await _firebaseAuth.createUserWithEmailAndPassword(
        email: email,
        password: pwd,
      );

      final user = userCredential.user;
      if (user != null) {
        // Send internal Firebase verification email
        await user.sendEmailVerification();

        // Send custom tailored welcome email via our backend
        await ref.read(apiServiceProvider).sendWelcomeEmail(email, user.uid);

        // Sync profile to backend after user creation
        await _syncProfileToBackend();

        state = AuthState(
          userId: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoUrl: user.photoURL,
          isAuthenticated: true,
          isLoading: false,
        );
      }
    } on FirebaseAuthException catch (e) {
      String errorMessage = 'Sign up failed';
      if (e.code == 'weak-password') {
        errorMessage = 'Password is too weak';
      } else if (e.code == 'email-already-in-use') {
        errorMessage = 'An account already exists with this email';
      } else if (e.code == 'invalid-email') {
        errorMessage = 'Invalid email address';
      }

      state = state.copyWith(isLoading: false, errorMessage: errorMessage);
      rethrow;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'An unexpected error occurred',
      );
      rethrow;
    }
  }

  // Google Sign-In
  Future<void> signInWithGoogle() async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      // Trigger the Google Sign-In flow
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();

      if (googleUser == null) {
        // User canceled the sign-in
        state = state.copyWith(isLoading: false);
        return;
      }

      // Obtain the auth details from the request
      final GoogleSignInAuthentication googleAuth =
          await googleUser.authentication;

      // Create a new credential
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      // Sign in to Firebase with the Google credential
      final userCredential = await _firebaseAuth.signInWithCredential(
        credential,
      );

      final user = userCredential.user;
      if (user != null) {
        state = AuthState(
          userId: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoUrl: user.photoURL,
          isAuthenticated: true,
          isLoading: false,
        );
      }
    } on FirebaseAuthException catch (e) {
      String errorMessage = 'Google sign-in failed';
      if (e.code == 'account-exists-with-different-credential') {
        errorMessage = 'An account already exists with this email';
      } else if (e.code == 'invalid-credential') {
        errorMessage = 'Invalid credentials';
      }

      state = state.copyWith(isLoading: false, errorMessage: errorMessage);
      rethrow;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Google sign-in failed: ${e.toString()}',
      );
      rethrow;
    }
  }

  // Logout
  Future<void> logout() async {
    try {
      await Future.wait([_firebaseAuth.signOut(), _googleSignIn.signOut()]);
      state = const AuthState();
    } catch (e) {
      debugPrint('Logout error: $e');
    }
  }

  // Get current user
  User? get currentUser => _firebaseAuth.currentUser;

  // Profile Customization
  Future<void> updateDisplayName(String name) async {
    final user = _firebaseAuth.currentUser;
    if (user != null) {
      await user.updateDisplayName(name);
      state = state.copyWith(displayName: name);
      // Sync to backend
      _syncProfileToBackend();
    }
  }

  Future<void> _syncProfileToBackend() async {
    final user = _firebaseAuth.currentUser;
    if (user == null) return;

    try {
      await ref.read(apiServiceProvider).saveProfile(user.uid, {
        'name': user.displayName,
        'email': user.email,
        'photoUrl': user.photoURL,
      });
    } catch (e) {
      debugPrint('Error syncing auth profile to backend: $e');
    }
  }

  Future<void> updatePhotoUrl(String url) async {
    final user = _firebaseAuth.currentUser;
    if (user != null) {
      await user.updatePhotoURL(url);
      state = state.copyWith(photoUrl: url);
      _syncProfileToBackend();
    }
  }

  Future<void> updateEmail(String email) async {
    final user = _firebaseAuth.currentUser;
    if (user != null) {
      await user.verifyBeforeUpdateEmail(email);
      state = state.copyWith(email: email);
      _syncProfileToBackend();
    }
  }

  // Two-Factor Authentication
  Future<void> toggleTwoFactor(bool enabled) async {
    // This is a simplified mock implementation of the toggle
    // In a real scenario, this would involve Firebase Multi-Factor Authentication (MFA)
    state = state.copyWith(isTwoFactorEnabled: enabled);
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref);
});
