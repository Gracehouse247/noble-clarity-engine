
import * as React from 'react';
import { BusinessProfile, ProfileData, FinancialData, FinancialGoal, UserProfile, Notification, Review } from '../types';
import { INITIAL_DATA, BLANK_FINANCIAL_DATA, INITIAL_REVIEWS, STORAGE_KEYS } from '../constants';
import { db, auth } from '../firebaseConfig';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'time' | 'read'>) => void;
  markAsRead: (id: number) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) setNotifications(JSON.parse(saved));
  }, []);

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = React.useCallback((notification: Omit<Notification, 'id' | 'time' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 20));
  }, []);

  const markAsRead = React.useCallback((id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const clearAllNotifications = React.useCallback(() => setNotifications([]), []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, clearAllNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = React.useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within a NotificationProvider");
  return context;
};

interface UserContextType {
  userProfile: UserProfile;
  updateUserProfile: (profile: UserProfile) => void;
  upgradePlan: (plan: UserProfile['plan']) => void;
  apiKeys: { google: string; openai: string };
  updateApiKeys: (keys: { google?: string; openai?: string }, remember?: boolean) => void;
  reviews: Review[];
  submitReview: (review: Omit<Review, 'id' | 'date'>) => void;
  logout: () => void;
}

const UserContext = React.createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = React.useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (saved) return JSON.parse(saved);
    return {
      name: 'Noble User',
      email: '',
      role: 'Founder',
      avatarUrl: 'https://ui-avatars.com/api/?name=Noble+User',
      currency: 'USD',
      plan: 'starter',
      preferredProvider: 'gemini',
      notifications: {
        marketAlerts: true,
        weeklyDigest: true,
        productUpdates: false
      }
    };
  });

  // Sync from Firestore when auth changes (simplified via useEffect on auth.currentUser if we had it here)
  // For now, relies on AuthContext to set initial user, but we can double check here or listen to changes.
  // Actually, AuthContext handles the user object. This context handles Profile Data.
  // Let's add a listener or use an effect if possible? 
  // For simplicity, we assume `updateUserProfile` is called by AuthContext or valid actions.

  const updateUserProfile = React.useCallback(async (profile: UserProfile) => {
    setUserProfile(profile);
    const user = auth.currentUser;
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), profile as any);
      } catch (e) {
        console.error("Error updating profile in Firestore", e);
      }
    }
  }, []);

  const [apiKeys, setApiKeys] = React.useState({ google: '', openai: '' });
  const [reviews, setReviews] = React.useState<Review[]>(() => {
    const saved = localStorage.getItem('nobleClarityReviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Fetch profile from Firestore on auth change
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserProfile(prev => ({
              ...prev,
              ...data,
              email: user.email || data.email || prev.email,
              name: data.name || user.displayName || prev.name
            }));
          }
        } catch (e) {
          console.error("Error fetching user profile from Firestore:", e);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
  }, [userProfile]);

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  React.useEffect(() => {
    const localKeys = localStorage.getItem(STORAGE_KEYS.API_KEYS);
    const sessionKeys = sessionStorage.getItem(STORAGE_KEYS.API_KEYS);
    if (localKeys) setApiKeys(JSON.parse(localKeys));
    else if (sessionKeys) setApiKeys(JSON.parse(sessionKeys));
  }, []);

  const updateApiKeys = React.useCallback((keys: { google?: string; openai?: string }, remember: boolean = false) => {
    setApiKeys(prev => {
      const newKeys = { ...prev, ...keys };
      if (remember) localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(newKeys));
      else sessionStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(newKeys));
      return newKeys;
    });
  }, []);

  const upgradePlan = React.useCallback(async (plan: UserProfile['plan']) => {
    setUserProfile(prev => ({ ...prev, plan }));
    const user = auth.currentUser;
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), { plan });
      } catch (e) {
        console.error("Error upgrading plan in Firestore", e);
      }
    }
  }, []);

  const submitReview = React.useCallback((review: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...review,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [newReview, ...prev]);
  }, []);

  const logout = React.useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.API_KEYS);
    sessionStorage.removeItem(STORAGE_KEYS.API_KEYS);
    setApiKeys({ google: '', openai: '' });
  }, []);

  return (
    <UserContext.Provider value={{
      userProfile,
      updateUserProfile,
      upgradePlan,
      apiKeys,
      updateApiKeys,
      reviews,
      submitReview,
      logout
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};

// --- Business Data Context ---
interface BusinessContextType {
  profiles: BusinessProfile[];
  activeProfileId: string | null;
  activeProfile: BusinessProfile | undefined;
  activeProfileData: ProfileData | undefined;
  switchProfile: (id: string) => void;
  createProfile: (data: Omit<BusinessProfile, 'id'>) => void;
  deleteProfile: (id: string) => void;
  updateFinancialData: (data: FinancialData) => void;
  saveSnapshot: (data?: FinancialData) => void;
  deleteSnapshot: (period: string) => void;
  loadSnapshot: (data: FinancialData) => void;
  clearHistory: () => void;
  updateGoals: (goals: FinancialGoal[]) => void;
  updateProfile: (id: string, updates: Partial<BusinessProfile>) => void;
  resetProfile: () => void;
  wipeAppData: () => void;
}

const BusinessContext = React.createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = React.useState<BusinessProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = React.useState<string | null>(null);
  const [profilesData, setProfilesData] = React.useState<Record<string, ProfileData>>({});

  React.useEffect(() => {
    const savedProfiles = localStorage.getItem(STORAGE_KEYS.PROFILES);
    const savedActiveId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
    const savedProfilesData = localStorage.getItem(STORAGE_KEYS.PROFILES_DATA);

    if (savedProfiles && savedActiveId && savedProfilesData) {
      setProfiles(JSON.parse(savedProfiles));
      setActiveProfileId(savedActiveId);
      setProfilesData(JSON.parse(savedProfilesData));
    } else {
      const firstId = `profile_${Date.now()}`;
      const firstProfile = { id: firstId, name: 'Main Business', industry: 'Technology', currency: 'USD', businessSize: '1-10 Employees', foundingDate: new Date().toISOString().split('T')[0] };
      setProfiles([firstProfile]);
      setActiveProfileId(firstId);
      setProfilesData({ [firstId]: { current: INITIAL_DATA, history: [INITIAL_DATA], goals: [] } });
    }
  }, []);

  React.useEffect(() => { if (profiles.length > 0) localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles)); }, [profiles]);
  React.useEffect(() => { if (activeProfileId) localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, activeProfileId); }, [activeProfileId]);
  React.useEffect(() => { if (Object.keys(profilesData).length > 0) localStorage.setItem(STORAGE_KEYS.PROFILES_DATA, JSON.stringify(profilesData)); }, [profilesData]);

  const createProfile = React.useCallback((data: Omit<BusinessProfile, 'id' | 'currency'> & { currency?: string }) => {
    const newId = `profile_${Date.now()}`;
    const newProfile = { ...data, id: newId, currency: data.currency || 'USD' };
    const newFinancialData = { ...BLANK_FINANCIAL_DATA, industry: data.industry, period: `Q1 ${new Date().getFullYear()}` };
    setProfiles(prev => [...prev, newProfile]);
    setProfilesData(prev => ({ ...prev, [newId]: { current: newFinancialData, history: [newFinancialData], goals: [] } }));
    setActiveProfileId(newId);
  }, []);

  const deleteProfile = React.useCallback((id: string) => {
    if (profiles.length <= 1) return;
    if (window.confirm(`Delete profile?`)) {
      setProfiles(prev => {
        const remaining = prev.filter(p => p.id !== id);
        if (activeProfileId === id) setActiveProfileId(remaining[0].id);
        return remaining;
      });
    }
  }, [profiles, activeProfileId]);

  const updateFinancialData = (data: FinancialData) => {
    if (!activeProfileId) return;
    setProfilesData(prev => ({ ...prev, [activeProfileId]: { ...prev[activeProfileId], current: data } }));
  };

  const saveSnapshot = (data?: FinancialData) => {
    if (!activeProfileId) return;
    setProfilesData(prev => {
      const cur = prev[activeProfileId];
      const snap = data || cur.current;
      const history = cur.history.filter(h => h.period !== snap.period);
      return { ...prev, [activeProfileId]: { ...cur, history: [...history, snap] } };
    });
  };

  const deleteSnapshot = (period: string) => {
    if (!activeProfileId) return;
    setProfilesData(prev => ({ ...prev, [activeProfileId]: { ...prev[activeProfileId], history: prev[activeProfileId].history.filter(h => h.period !== period) } }));
  };

  const loadSnapshot = (data: FinancialData) => updateFinancialData(data);
  const clearHistory = () => {
    if (!activeProfileId) return;
    setProfilesData(prev => ({ ...prev, [activeProfileId]: { ...prev[activeProfileId], history: [prev[activeProfileId].current] } }));
  };
  const updateGoals = (goals: FinancialGoal[]) => {
    if (!activeProfileId) return;
    setProfilesData(prev => ({ ...prev, [activeProfileId]: { ...prev[activeProfileId], goals } }));
  };

  const updateProfile = React.useCallback((id: string, updates: Partial<BusinessProfile>) => {
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const resetProfile = React.useCallback(() => {
    if (!activeProfileId) return;
    setProfilesData(prev => ({
      ...prev,
      [activeProfileId]: {
        current: INITIAL_DATA,
        history: [INITIAL_DATA],
        goals: []
      }
    }));
  }, [activeProfileId]);

  const wipeAppData = React.useCallback(() => {
    if (window.confirm("CRITICAL: This will permanently delete ALL business profiles, financial history, and settings. This cannot be undone. Proceed?")) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  }, []);

  return (
    <BusinessContext.Provider value={{
      profiles, activeProfileId, activeProfile: profiles.find(p => p.id === activeProfileId),
      activeProfileData: activeProfileId ? profilesData[activeProfileId] : undefined,
      switchProfile: setActiveProfileId, createProfile, deleteProfile, updateFinancialData,
      saveSnapshot, deleteSnapshot, loadSnapshot, clearHistory, updateGoals, updateProfile,
      resetProfile, wipeAppData
    }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = React.useContext(BusinessContext);
  if (!context) throw new Error("useBusiness Error");
  return context;
};

export const NobleProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => (
  <NotificationProvider>
    <UserProvider>
      <BusinessProvider>
        {children}
      </BusinessProvider>
    </UserProvider>
  </NotificationProvider>
);
