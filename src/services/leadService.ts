import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot,
  addDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export interface Lead {
  id?: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  createdAt?: string;
  status?: string;
  notes?: string;
  adminMemo?: string;
}

// Global Firestore Error Handler for advanced troubleshooting and compliance
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo, null, 2));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Service to handle all ContactForm (Lead) CRUD Operations in Cloud Firestore
 */
export const LeadService = {
  /**
   * CREATE: Adds a new lead safely with robust offline support & instant UI response.
   */
  async createLead(lead: Omit<Lead, 'id' | 'createdAt' | 'status'> & { id?: string; createdAt?: string; status?: string }): Promise<string> {
    const generatedId = lead.id || `lead_${Math.random().toString(36).slice(2, 11)}`;
    const leadData: Lead = {
      ...lead,
      createdAt: lead.createdAt || new Date().toISOString(),
      status: lead.status || 'Mới',
      notes: lead.notes || '',
      id: generatedId
    };

    // 1. Maintain local tracking IDs for client-side continuous status alerts
    try {
      const trackingIds = JSON.parse(localStorage.getItem('ts_client_lead_ids') || '[]');
      if (!trackingIds.includes(generatedId)) {
        trackingIds.push(generatedId);
        localStorage.setItem('ts_client_lead_ids', JSON.stringify(trackingIds));
      }
    } catch (trackErr) {
      console.warn('LocalStorage tracking save failed:', trackErr);
    }

    // 2. Queue lead locally for offline resilience
    try {
      const offlineLeads = JSON.parse(localStorage.getItem('ts_offline_leads') || '[]');
      offlineLeads.push(leadData);
      localStorage.setItem('ts_offline_leads', JSON.stringify(offlineLeads));
    } catch (err) {
      console.warn('LocalStorage offline queuing failed:', err);
    }

    // 3. Sync to Firestore in the background
    try {
      await setDoc(doc(db, 'leads', generatedId), leadData);
      
      // Successfully wrote online, clean up offline backup item
      try {
        const offlineLeads = JSON.parse(localStorage.getItem('ts_offline_leads') || '[]');
        const updated = offlineLeads.filter((l: any) => l.id !== generatedId);
        localStorage.setItem('ts_offline_leads', JSON.stringify(updated));
      } catch (err) {}
      
      console.log('Lead synced to background Firestore perfectly:', generatedId);
    } catch (error) {
      console.warn('Firestore write deferred or offline, lead safely preserved locally:', error);
      // We do not throw error here to allow robust offline operation ("nhấn là thông báo xong ngay")
    }

    return generatedId;
  },

  /**
   * READ: Fetches all leads from Firestore ordered by creation date (admin workspace utility)
   */
  async getLeads(): Promise<Lead[]> {
    const path = 'leads';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const docs: Lead[] = [];
      querySnapshot.forEach((docSnapshot) => {
        docs.push({ ...docSnapshot.data(), id: docSnapshot.id } as Lead);
      });
      return docs;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  /**
   * READ SINGLE: Retrieves a specific lead document by its unique ID
   */
  async getLeadById(leadId: string): Promise<Lead | null> {
    const path = `leads/${leadId}`;
    try {
      const docRef = doc(db, 'leads', leadId);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        return { ...docSnapshot.data(), id: docSnapshot.id } as Lead;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  /**
   * UPDATE: Updates a lead's attributes safely (status, notes, etc.)
   */
  async updateLead(leadId: string, updates: Partial<Omit<Lead, 'id' | 'createdAt'>>): Promise<void> {
    const path = `leads/${leadId}`;
    try {
      const leadRef = doc(db, 'leads', leadId);
      await updateDoc(leadRef, updates);
      console.log(`Lead ${leadId} updated successfully:`, updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  /**
   * DELETE: Permanently disposes of a lead record from Firestore
   */
  async deleteLead(leadId: string): Promise<void> {
    const path = `leads/${leadId}`;
    try {
      const leadRef = doc(db, 'leads', leadId);
      await deleteDoc(leadRef);
      console.log(`Lead ${leadId} deleted successfully.`);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  /**
   * SUBSCRIBE: Live real-time updates for the admin CRM panel
   */
  subscribeToLeads(onUpdate: (leads: Lead[]) => void, onError?: (error: Error) => void): () => void {
    const path = 'leads';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    
    return onSnapshot(
      q, 
      (snapshot) => {
        const docs: Lead[] = [];
        snapshot.forEach((docSnapshot) => {
          docs.push({ ...docSnapshot.data(), id: docSnapshot.id } as Lead);
        });
        onUpdate(docs);
      },
      (error) => {
        if (onError) {
          onError(error);
        } else {
          handleFirestoreError(error, OperationType.LIST, path);
        }
      }
    );
  },

  /**
   * SUBSCRIBE SINGLE: Live status alerts of a specific user request for clients
   */
  subscribeToLead(leadId: string, onUpdate: (lead: Lead | null) => void, onError?: (error: Error) => void): () => void {
    const path = `leads/${leadId}`;
    const docRef = doc(db, 'leads', leadId);

    return onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          onUpdate({ ...docSnapshot.data(), id: docSnapshot.id } as Lead);
        } else {
          onUpdate(null);
        }
      },
      (error) => {
        if (onError) {
          onError(error);
        } else {
          handleFirestoreError(error, OperationType.GET, path);
        }
      }
    );
  }
};
