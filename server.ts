import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '25mb' }));

// Shared Gemini Client with User-Agent header as required
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const STUDY_KIT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    isValidTranscript: {
      type: Type.BOOLEAN,
      description: 'True if input appears to be a lecture transcript or educational/academic spoken material. False if random text, spam, or totally non-lecture content.',
    },
    rejectionReason: {
      type: Type.STRING,
      description: 'If isValidTranscript is false, polite explanation to student why this is not recognized as a lecture transcript and how to proceed.',
    },
    overview: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Title of the lecture' },
        mainTopic: { type: Type.STRING, description: 'Main topic discussed' },
        subjectDomain: { type: Type.STRING, description: 'Academic subject/domain (e.g., Computer Science, Organic Chemistry, Macroeconomics, Physics)' },
        centralObjective: { type: Type.STRING, description: 'The primary learning objective or question addressed in the lecture' },
        estimatedComplexity: { type: Type.STRING, description: 'Academic level: Introductory, Intermediate, or Advanced' },
      },
      required: ['title', 'mainTopic', 'subjectDomain', 'centralObjective', 'estimatedComplexity'],
    },
    executiveSummary: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Concise paragraphs or bullet points giving an executive summary of the entire lecture without filler words.',
    },
    detailedNotes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          heading: { type: Type.STRING, description: 'Heading for this section of notes' },
          content: { type: Type.STRING, description: 'Detailed notes explaining concepts logically with Markdown sub-bullets where applicable' },
          keyTakeaways: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Key highlights for this section',
          },
        },
        required: ['heading', 'content'],
      },
      description: 'Structured comprehensive lecture notes in sequential logical order.',
    },
    keyConcepts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Concept name' },
          simpleExplanation: { type: Type.STRING, description: 'Simple, student-friendly explanation' },
          importantDetails: { type: Type.STRING, description: 'Crucial technical details, mechanics, or nuance' },
          example: { type: Type.STRING, description: 'Example given in lecture or relevant illustrating example' },
          relatedConcepts: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Connected concepts mentioned',
          },
        },
        required: ['name', 'simpleExplanation', 'importantDetails'],
      },
      description: 'List of key concepts from the lecture.',
    },
    definitionsAndFormulas: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, description: 'One of: definition, formula, law, principle' },
          termOrEquation: { type: Type.STRING, description: 'The exact term, law name, or equation (e.g. F = ma or Big-O notation)' },
          explanation: { type: Type.STRING, description: 'Detailed definition or explanation' },
          variablesAndSymbols: { type: Type.STRING, description: 'Meaning of each variable, symbol, or parameter' },
          units: { type: Type.STRING, description: 'Units of measurement or dimension, if applicable' },
          conditionsOfApplication: { type: Type.STRING, description: 'Under what conditions/assumptions this applies' },
          isSupplementary: { type: Type.BOOLEAN, description: 'True if this is supplementary clarification not explicitly in the transcript' },
        },
        required: ['type', 'termOrEquation', 'explanation'],
      },
      description: 'Significant definitions, laws, equations, and formulas strictly supported by the transcript.',
    },
    revisionPoints: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          point: { type: Type.STRING, description: 'High-value bullet point for rapid revision' },
          category: { type: Type.STRING, description: 'Fact, Step, Comparison, Lecturer Emphasis, or Mnemonic' },
          mnemonic: { type: Type.STRING, description: 'Optional helpful mnemonic if appropriate' },
        },
        required: ['point', 'category'],
      },
      description: 'Concise bullet points for rapid last-minute exam prep.',
    },
    practiceQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: { type: Type.STRING, description: 'short (5 items), conceptual (3 items), or long (2 items)' },
          question: { type: Type.STRING, description: 'Practice exam question' },
          answer: { type: Type.STRING, description: 'Comprehensive, accurate answer based strictly on transcript' },
          requiresExternalKnowledge: { type: Type.BOOLEAN, description: 'True if answering requires knowledge outside the transcript' },
          externalKnowledgeNote: { type: Type.STRING, description: 'Clarification note if external knowledge was needed' },
        },
        required: ['id', 'type', 'question', 'answer', 'requiresExternalKnowledge'],
      },
      description: 'Exact set: 5 short-answer questions, 3 conceptual questions, and 2 long-answer questions (10 questions total).',
    },
    flashcards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          front: { type: Type.STRING, description: 'Question, term, formula, or concept' },
          back: { type: Type.STRING, description: 'Concise and accurate answer or explanation' },
          topic: { type: Type.STRING, description: 'Topic category' },
        },
        required: ['id', 'front', 'back'],
      },
      description: '5 to 10 revision flashcards focusing on definitions, core concepts, formulas, and essential facts.',
    },
    knowledgeGaps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          issue: { type: Type.STRING, description: 'Brief summary of the gap or unclear statement' },
          contextInTranscript: { type: Type.STRING, description: 'What was said in transcript' },
          explanationOfGap: { type: Type.STRING, description: 'Why it is incomplete or ambiguous, without guessing missing facts' },
          isSignificant: { type: Type.BOOLEAN, description: 'Whether this materially impacts understanding' },
        },
        required: ['issue', 'contextInTranscript', 'explanationOfGap', 'isSignificant'],
      },
      description: 'Incomplete explanations, ambiguous statements, or missing context. If no gaps, return empty array.',
    },
    finalTakeaways: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Exactly 5 most critical takeaways a student must remember.',
    },
  },
  required: [
    'isValidTranscript',
    'overview',
    'executiveSummary',
    'detailedNotes',
    'keyConcepts',
    'definitionsAndFormulas',
    'revisionPoints',
    'practiceQuestions',
    'flashcards',
    'knowledgeGaps',
    'finalTakeaways',
  ],
};

function formatStudyKitToMarkdown(data: any): string {
  if (!data || !data.isValidTranscript) {
    return '# Unable to process transcript\n\nThe submitted text could not be verified as a lecture transcript.';
  }

  let md = '';

  // 1. Lecture Overview
  md += `# 1. Lecture Overview\n`;
  md += `- **Lecture Title:** ${data.overview?.title || 'Untitled Lecture'}\n`;
  md += `- **Main Topic:** ${data.overview?.mainTopic || 'N/A'}\n`;
  md += `- **Subject/Domain:** ${data.overview?.subjectDomain || 'General'}\n`;
  md += `- **Central Objective:** ${data.overview?.centralObjective || 'N/A'}\n`;
  if (data.overview?.estimatedComplexity) {
    md += `- **Academic Level:** ${data.overview.estimatedComplexity}\n`;
  }
  md += `\n---\n\n`;

  // 2. Executive Summary
  md += `# 2. Executive Summary\n`;
  if (Array.isArray(data.executiveSummary)) {
    data.executiveSummary.forEach((para: string) => {
      md += `${para}\n\n`;
    });
  } else {
    md += `${data.executiveSummary || ''}\n\n`;
  }
  md += `---\n\n`;

  // 3. Detailed Lecture Notes
  md += `# 3. Detailed Lecture Notes\n\n`;
  if (Array.isArray(data.detailedNotes)) {
    data.detailedNotes.forEach((section: any, idx: number) => {
      md += `### 3.${idx + 1} ${section.heading}\n\n`;
      md += `${section.content}\n\n`;
      if (Array.isArray(section.keyTakeaways) && section.keyTakeaways.length > 0) {
        md += `*Key Highlights:*\n`;
        section.keyTakeaways.forEach((t: string) => {
          md += `- ${t}\n`;
        });
        md += `\n`;
      }
    });
  }
  md += `---\n\n`;

  // 4. Key Concepts
  md += `# 4. Key Concepts\n\n`;
  if (Array.isArray(data.keyConcepts)) {
    data.keyConcepts.forEach((c: any, idx: number) => {
      md += `### ${idx + 1}. ${c.name}\n`;
      md += `- **Explanation:** ${c.simpleExplanation}\n`;
      md += `- **Important Details:** ${c.importantDetails}\n`;
      if (c.example) {
        md += `- **Example:** ${c.example}\n`;
      }
      if (Array.isArray(c.relatedConcepts) && c.relatedConcepts.length > 0) {
        md += `- **Related Concepts:** ${c.relatedConcepts.join(', ')}\n`;
      }
      md += `\n`;
    });
  }
  md += `---\n\n`;

  // 5. Important Definitions and Formulas
  md += `# 5. Important Definitions and Formulas\n\n`;
  if (Array.isArray(data.definitionsAndFormulas) && data.definitionsAndFormulas.length > 0) {
    md += `| Type | Term / Equation | Explanation | Variables / Symbols | Units / Conditions |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- |\n`;
    data.definitionsAndFormulas.forEach((item: any) => {
      const typeStr = item.type ? item.type.toUpperCase() : 'DEF';
      const term = (item.termOrEquation || '').replace(/\|/g, '\\|');
      const expl = (item.explanation || '').replace(/\|/g, '\\|');
      const vars = (item.variablesAndSymbols || '—').replace(/\|/g, '\\|');
      const cond = `${item.units ? `Units: ${item.units}; ` : ''}${item.conditionsOfApplication || '—'}`.replace(/\|/g, '\\|');
      md += `| ${typeStr} | **${term}** | ${expl} | ${vars} | ${cond} |\n`;
    });
    md += `\n`;
  } else {
    md += `*No specific mathematical formulas or strict formal definitions identified in this transcript.*\n\n`;
  }
  md += `---\n\n`;

  // 6. Quick Revision Points
  md += `# 6. Quick Revision Points\n\n`;
  if (Array.isArray(data.revisionPoints)) {
    data.revisionPoints.forEach((rp: any) => {
      const tag = rp.category ? `**[${rp.category}]** ` : '';
      const mnemonicStr = rp.mnemonic ? ` *(Mnemonic: ${rp.mnemonic})*` : '';
      md += `- ${tag}${rp.point}${mnemonicStr}\n`;
    });
    md += `\n`;
  }
  md += `---\n\n`;

  // 7. Important Practice Questions with Answers
  md += `# 7. Important Practice Questions with Answers\n\n`;
  if (Array.isArray(data.practiceQuestions)) {
    const shortQ = data.practiceQuestions.filter((q: any) => q.type === 'short');
    const conceptualQ = data.practiceQuestions.filter((q: any) => q.type === 'conceptual');
    const longQ = data.practiceQuestions.filter((q: any) => q.type === 'long');

    if (shortQ.length > 0) {
      md += `### Short-Answer Questions\n\n`;
      shortQ.forEach((q: any, i: number) => {
        md += `**Q${i + 1}: ${q.question}**\n`;
        md += `> **Answer:** ${q.answer}\n`;
        if (q.requiresExternalKnowledge && q.externalKnowledgeNote) {
          md += `> *(Note: ${q.externalKnowledgeNote})*\n`;
        }
        md += `\n`;
      });
    }

    if (conceptualQ.length > 0) {
      md += `### Conceptual Questions\n\n`;
      conceptualQ.forEach((q: any, i: number) => {
        md += `**Q${i + 1}: ${q.question}**\n`;
        md += `> **Answer:** ${q.answer}\n`;
        if (q.requiresExternalKnowledge && q.externalKnowledgeNote) {
          md += `> *(Note: ${q.externalKnowledgeNote})*\n`;
        }
        md += `\n`;
      });
    }

    if (longQ.length > 0) {
      md += `### Long-Answer / Descriptive Questions\n\n`;
      longQ.forEach((q: any, i: number) => {
        md += `**Q${i + 1}: ${q.question}**\n`;
        md += `> **Answer:** ${q.answer}\n`;
        if (q.requiresExternalKnowledge && q.externalKnowledgeNote) {
          md += `> *(Note: ${q.externalKnowledgeNote})*\n`;
        }
        md += `\n`;
      });
    }
  }
  md += `---\n\n`;

  // 8. Flashcards
  md += `# 8. Flashcards\n\n`;
  if (Array.isArray(data.flashcards)) {
    data.flashcards.forEach((fc: any, i: number) => {
      md += `**Card ${i + 1}**\n`;
      md += `- **Front:** ${fc.front}\n`;
      md += `- **Back:** ${fc.back}\n\n`;
    });
  }
  md += `---\n\n`;

  // 9. Topics Requiring Further Clarification
  md += `# 9. Topics Requiring Further Clarification\n\n`;
  if (Array.isArray(data.knowledgeGaps) && data.knowledgeGaps.length > 0) {
    data.knowledgeGaps.forEach((g: any, i: number) => {
      md += `### 9.${i + 1} ${g.issue}\n`;
      md += `- **Transcript Context:** "${g.contextInTranscript}"\n`;
      md += `- **Missing Detail / Ambiguity:** ${g.explanationOfGap}\n\n`;
    });
  } else {
    md += `*No significant knowledge gaps, incomplete statements, or ambiguities were identified in the provided transcript.*\n\n`;
  }
  md += `---\n\n`;

  // 10. Final Takeaways
  md += `# 10. Final Takeaways\n\n`;
  if (Array.isArray(data.finalTakeaways)) {
    data.finalTakeaways.forEach((t: string, i: number) => {
      md += `${i + 1}. **${t}**\n`;
    });
    md += `\n`;
  }

  return md;
}

// API: Process Lecture Transcript
app.post('/api/summarize', async (req, res) => {
  try {
    const { transcript, focusMode, customPrompt } = req.body;

    if (!transcript || typeof transcript !== 'string' || transcript.trim().length < 20) {
      return res.status(400).json({
        error: 'Transcript is required and must contain at least 20 characters of lecture text.',
      });
    }

    const systemInstruction = `
You are an intelligent, rigorous AI-powered study assistant designed to transform lecture transcripts into concise summaries, important concepts, organized notes, and effective revision material for students.

Your role & responsibilities:
1. Base the primary notes strictly on the supplied transcript.
2. Do not fabricate facts, examples, quotations, statistics, formulas, or lecturer statements.
3. Preserve the original meaning of the lecture.
4. Remove unnecessary repetitions, stutters, filler words, and digressions.
5. Extract key concepts with simple student-friendly explanations and technical details.
6. Extract definitions, laws, equations, and formulas. Explain variables, symbols, units, and conditions. Never invent formulas not in the transcript; mark any clarification as supplementary.
7. Provide quick revision points for last-minute exam prep.
8. Generate EXACTLY:
   - 5 short-answer practice questions with accurate transcript-grounded answers.
   - 3 conceptual questions with accurate transcript-grounded answers.
   - 2 long-answer or descriptive questions with accurate transcript-grounded answers.
   (Total 10 questions). If external knowledge is required to answer, explicitly flag it.
9. Generate 5-10 revision flashcards with Front (question/term) and Back (concise answer).
10. Identify knowledge gaps or unclear statements without guessing missing facts.
11. End with exactly 5 final takeaways.

Input validation:
- If the input is NOT a lecture transcript (e.g. random letters, unrelated cooking recipe, song lyrics, casual chat), set isValidTranscript = false and provide rejectionReason.
- If it is a valid lecture transcript, set isValidTranscript = true.

Target tone: Academic, clear, structured, encouraging, undergraduate-friendly.
Focus mode requested by user: ${focusMode || 'Comprehensive Revision Kit (All 10 Sections)'}
${customPrompt ? `Additional user instructions: ${customPrompt}` : ''}
`;

    const userPrompt = `Please analyze and transform this lecture transcript according to the requested 10-section study kit:\n\n${transcript}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: STUDY_KIT_SCHEMA,
      },
    });

    const text = response.text || '';
    let parsedData: any;
    try {
      parsedData = JSON.parse(text);
    } catch (parseErr) {
      console.error('Failed to parse JSON response:', text);
      return res.status(500).json({
        error: 'Failed to parse model output into structured study kit. Please try again.',
      });
    }

    // Attach raw Markdown conforming strictly to # 1 through # 10 format
    parsedData.rawMarkdown = formatStudyKitToMarkdown(parsedData);

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error generating lecture summary:', error);
    return res.status(500).json({
      error: error?.message || 'An error occurred while analyzing the lecture transcript.',
    });
  }
});

// API: Ask Questions Grounded in the Current Lecture
app.post('/api/ask-lecture', async (req, res) => {
  try {
    const { transcript, studyKitContext, question, conversationHistory } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const systemInstruction = `
You are the AI Lecture Revision Assistant for this specific lecture.
Your job is to answer student queries, explain difficult points, provide additional intuitive analogies, test their knowledge, or clarify formulas.
CRITICAL ACCURACY RULES:
1. Base your explanations firmly on the lecture transcript provided.
2. If the lecture transcript does not mention a specific fact or question asked, explicitly declare that the lecture did not cover it, but you may provide a helpful academic explanation clearly labeled as "Supplementary Academic Knowledge".
3. Keep answers clear, supportive, and pedagogical. Use Markdown formatting.
`;

    const promptContext = `
[LECTURE OVERVIEW]
Title: ${studyKitContext?.overview?.title || 'Unknown'}
Domain: ${studyKitContext?.overview?.subjectDomain || 'Unknown'}
Summary: ${Array.isArray(studyKitContext?.executiveSummary) ? studyKitContext.executiveSummary.join('\n') : ''}

[LECTURE TRANSCRIPT]
${transcript ? transcript.slice(0, 15000) : 'Transcript not provided'}

[STUDENT QUESTION]
${question}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptContext,
      config: {
        systemInstruction,
      },
    });

    const answer = response.text || 'No response generated.';
    return res.json({ answer });
  } catch (error: any) {
    console.error('Error in ask-lecture:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to answer question.',
    });
  }
});

// Full-stack Vite dev middleware or production static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Synapse server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
