import { create } from 'zustand';
import type { Question, Sponsor } from '@/lib/types';

interface AdminState {
  questions: Question[];
  sponsors: Sponsor[];
  loading: boolean;

  fetchQuestions: () => Promise<void>;
  createQuestion: (data: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateQuestion: (id: string, data: Partial<Question>) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;

  fetchSponsors: () => Promise<void>;
  createSponsor: (data: Omit<Sponsor, 'id' | 'createdAt'>) => Promise<void>;
  updateSponsor: (id: string, data: Partial<Sponsor>) => Promise<void>;
  deleteSponsor: (id: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
  questions: [],
  sponsors: [],
  loading: false,

  fetchQuestions: async () => {
    set({ loading: true });
    const res = await fetch('/api/questions');
    const data = await res.json();
    set({ questions: data, loading: false });
  },

  createQuestion: async (data) => {
    const res = await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const created = await res.json();
    set((s) => ({ questions: [...s.questions, created] }));
  },

  updateQuestion: async (id, data) => {
    const res = await fetch(`/api/questions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(err.error ?? `HTTP ${res.status}`);
    }
    const updated = await res.json();
    set((s) => ({
      questions: s.questions.map((q) => (q.id === id ? updated : q)),
    }));
  },

  deleteQuestion: async (id) => {
    await fetch(`/api/questions/${id}`, { method: 'DELETE' });
    set((s) => ({ questions: s.questions.filter((q) => q.id !== id) }));
  },

  fetchSponsors: async () => {
    const res = await fetch('/api/sponsors');
    const data = await res.json();
    set({ sponsors: data });
  },

  createSponsor: async (data) => {
    const res = await fetch('/api/sponsors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const created = await res.json();
    set((s) => ({ sponsors: [...s.sponsors, created] }));
  },

  updateSponsor: async (id, data) => {
    const res = await fetch(`/api/sponsors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(err.error ?? `HTTP ${res.status}`);
    }
    const updated = await res.json();
    set((s) => ({
      sponsors: s.sponsors.map((sp) => (sp.id === id ? updated : sp)),
    }));
  },

  deleteSponsor: async (id) => {
    await fetch(`/api/sponsors/${id}`, { method: 'DELETE' });
    set((s) => ({ sponsors: s.sponsors.filter((sp) => sp.id !== id) }));
  },
}));
