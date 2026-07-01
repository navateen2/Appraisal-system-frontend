export type ListResponse = [[]]

export interface IDPCreateUpdate {
  idp_text: string;
}

export interface IDPResponse {
  idp_text: string | null;
  updated_at: string; 
}

export interface MeetingNotesCreateUpdate {
  meeting_notes: string;
}

export interface MeetingNotesMutationResponse {
  message: string;
  meeting_notes: string;
  updated_at: string;
}

export interface MeetingNotesGetResponse {
  meeting_notes: string | null ;
  updated_at: string;
}