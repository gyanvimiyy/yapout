import { HangoutCategory } from '../types';

export interface PlannedHangoutResponse {
  title: string;
  category: HangoutCategory;
  description: string;
  campusSpot: string;
  vibe: string;
  costNote: string;
  duration: string;
  maxSpots: number;
  tags: string[];
  icebreakers?: string[];
}

export interface GemmaChatMessage {
  sender: 'user' | 'gemma';
  text: string;
  timestamp?: string;
}

export const gemmaService = {
  // Query Gemma 4 Assistant
  async askAssistant(prompt: string, history?: GemmaChatMessage[]): Promise<string> {
    const res = await fetch('/api/gemma/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, history })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Gemma 4 request failed (${res.status})`);
    }

    const data = await res.json();
    return data.reply;
  },

  // Auto-plan a hangout using Gemma 4
  async planHangout(idea: string, campus?: string): Promise<PlannedHangoutResponse> {
    const res = await fetch('/api/gemma/plan-hangout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea, campus })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to plan hangout with Gemma 4 (${res.status})`);
    }

    return await res.json();
  },

  // Generate icebreakers for Yap Channel
  async generateIcebreakers(hangoutTitle: string, hangoutVibe: string, count: number = 3): Promise<string> {
    const res = await fetch('/api/gemma/icebreakers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hangoutTitle, hangoutVibe, count })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to generate icebreakers (${res.status})`);
    }

    const data = await res.json();
    return data.icebreakers;
  },

  // Generate spontaneous campus beacon text
  async generateBeacon(location: string, freeTime: number, mood?: string): Promise<string> {
    const res = await fetch('/api/gemma/generate-beacon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location, freeTime, mood })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to generate beacon (${res.status})`);
    }

    const data = await res.json();
    return data.message;
  },

  // Check Gemma 4 status
  async getStatus(): Promise<{ status: string; model: string; provider: string }> {
    const res = await fetch('/api/gemma/status');
    if (!res.ok) throw new Error('Status check failed');
    return await res.json();
  }
};
