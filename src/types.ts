/**
 * Types definition for the DevOps Capstone Companion
 */

export interface UserStory {
  id: string;
  title: string;
  role: string;
  functionDef: string;
  benefit: string;
  details: string;
  acceptanceCriteria: string;
  status: 'new-issues' | 'icebox' | 'product-backlog' | 'sprint-backlog' | 'in-progress' | 'review-qa' | 'done';
  points?: number; // 3, 5, 8, 13
  label?: 'technical-debt' | 'enhancement' | 'none';
  sprint?: 'sprint-1' | 'sprint-2' | 'sprint-3' | 'none';
  assignee?: string;
}

export interface FileArtifact {
  id: string;
  title: string;
  filename: string;
  description: string;
  content: string;
  language: string;
}

export interface TerminalLog {
  text: string;
  type: 'info' | 'success' | 'error' | 'input' | 'output';
  timestamp: string;
}
