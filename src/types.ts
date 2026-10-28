export interface LectureOverview {
  title: string;
  mainTopic: string;
  subjectDomain: string;
  centralObjective: string;
  estimatedComplexity: 'Introductory' | 'Intermediate' | 'Advanced';
}

export interface DetailedNoteSection {
  heading: string;
  content: string;
  keyTakeaways?: string[];
}

export interface KeyConcept {
  name: string;
  simpleExplanation: string;
  importantDetails: string;
  example?: string;
  relatedConcepts?: string[];
}

export interface DefinitionOrFormula {
  type: 'formula' | 'definition' | 'law' | 'principle';
  termOrEquation: string;
  explanation: string;
  variablesAndSymbols?: string;
  units?: string;
  conditionsOfApplication?: string;
  isSupplementary?: boolean;
}

export interface RevisionPoint {
  point: string;
  category: 'Fact' | 'Step' | 'Comparison' | 'Lecturer Emphasis' | 'Mnemonic' | string;
  mnemonic?: string;
}

export interface PracticeQuestion {
  id: string;
  type: 'short' | 'conceptual' | 'long';
  question: string;
  answer: string;
  requiresExternalKnowledge: boolean;
  externalKnowledgeNote?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  topic?: string;
}

export interface KnowledgeGap {
  issue: string;
  contextInTranscript: string;
  explanationOfGap: string;
  isSignificant: boolean;
}

export interface LectureStudyKit {
  isValidTranscript: boolean;
  rejectionReason?: string;
  overview: LectureOverview;
  executiveSummary: string[];
  detailedNotes: DetailedNoteSection[];
  keyConcepts: KeyConcept[];
  definitionsAndFormulas: DefinitionOrFormula[];
  revisionPoints: RevisionPoint[];
  practiceQuestions: PracticeQuestion[];
  flashcards: Flashcard[];
  knowledgeGaps: KnowledgeGap[];
  finalTakeaways: string[];
  rawMarkdown: string;
}

export interface SavedLectureSession {
  id: string;
  date: string;
  title: string;
  subject: string;
  transcriptPreview: string;
  transcript: string;
  studyKit: LectureStudyKit;
}
