import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut
} from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

// Provider with Sheets API Scopes
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/spreadsheets');

let cachedAccessToken: string | null = null;
let isSigningIn = false;

// 1. Initialize authentication state change listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Clear cached token if user logged out or session ended
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// 2. Google sign-in Popup for Admin/Sheets
export const loginWithGoogle = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;

    if (!token) {
      throw new Error('Không thể lấy mã truy cập Google OAuth');
    }

    cachedAccessToken = token;
    return { user: result.user, accessToken: token };
  } catch (error) {
    console.error('Lỗi đăng nhập Google Auth:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// 3. Log out Google Auth
export const logoutFromGoogle = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

// 4. Save lead data persistently into Firestore
export const saveLeadToFirestore = async (lead: {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, 'leads'), {
      ...lead,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Lỗi lưu lead vào Firestore:', error);
    throw error;
  }
};

// 5. Fetch all leads from Firestore ordered by creation date
export const fetchLeadsFromFirestore = async () => {
  try {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const docs: any[] = [];
    querySnapshot.forEach((doc) => {
      docs.push({ id: doc.id, ...doc.data() });
    });
    return docs;
  } catch (error) {
    console.error('Lỗi nạp lead từ Firestore:', error);
    throw error;
  }
};

// 6. Create Google Spreadsheet
export const createGoogleSheet = async (accessToken: string): Promise<{ id: string; url: string }> => {
  try {
    const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        properties: {
          title: 'Danh Sách Liên Hệ Khách Hàng - TS Media Agency',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Tạo Google Sheet thất bại: ${errorText}`);
    }

    const data = await response.json();
    return {
      id: data.spreadsheetId,
      url: data.spreadsheetUrl,
    };
  } catch (error) {
    console.error('Lỗi khi tạo Google Sheet:', error);
    throw error;
  }
};

// 7. Sync all leads to spreadsheet
export const syncLeadsToGoogleSheet = async (
  spreadsheetId: string,
  leads: any[],
  accessToken: string
) => {
  try {
    // We clear current data or append to Sheet1 starting from A1
    // Let's write the headers first followed by all leads
    const headers = ['Thời gian gửi', 'Họ và Tên', 'Số Điện Thoại', 'Email', 'Dịch Vụ Quan Tâm', 'Lời nhắn / Mô tả'];
    
    const rows = leads.map(lead => [
      lead.createdAt ? new Date(lead.createdAt).toLocaleString('vi-VN') : '',
      lead.name || '',
      lead.phone || '',
      lead.email || '',
      lead.service || '',
      lead.message || '',
    ]);

    const values = [headers, ...rows];

    // Clear existing values in sheet
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:Z5000:clear`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Write values back using PUT
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          values,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Đồng bộ dữ liệu Sheets thất bại: ${errorText}`);
    }

    return true;
  } catch (error) {
    console.error('Lỗi khi đồng bộ Google Sheet:', error);
    throw error;
  }
};

// 8. Native Email Registration
export const registerUserWithEmail = async (email: string, password: string, fullName: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, {
      displayName: fullName
    });
    return userCredential.user;
  } catch (error: any) {
    console.error('Lỗi đăng ký email:', error);
    throw error;
  }
};

// 9. Native Email Sign In
export const loginUserWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Lỗi đăng nhập email:', error);
    throw error;
  }
};

// 10. General Logout
export const logoutUser = async () => {
  await signOut(auth);
};

// 11. Fetch leads entered by a specific client/user
export const fetchUserLeads = async (email: string) => {
  try {
    const q = query(
      collection(db, 'leads'), 
      where('email', '==', email),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const docs: any[] = [];
    querySnapshot.forEach((doc) => {
      docs.push({ id: doc.id, ...doc.data() });
    });
    return docs;
  } catch (error) {
    // Fallback if index is not ready yet or on other error
    console.warn('Lỗi truy vấn leads theo email, thử lọc phía client:', error);
    const all = await fetchLeadsFromFirestore();
    return all.filter(item => (item.email || '').toLowerCase() === email.toLowerCase());
  }
};
