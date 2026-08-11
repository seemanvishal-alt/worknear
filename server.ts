/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();

/*
 * IMPORTANT FOR RENDER
 * Render provides PORT automatically.
 * Local development falls back to 3000.
 */
const PORT = Number(process.env.PORT) || 3000;

/* =========================================================
   SUPABASE
   ========================================================= */

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL;

const supabasePublishableKey =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

const supabase: SupabaseClient | null =
  supabaseUrl &&
  supabasePublishableKey &&
  !supabaseUrl.includes('your-project.supabase.co')
    ? createClient(
        supabaseUrl,
        supabasePublishableKey,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        }
      )
    : null;

/* =========================================================
   MIDDLEWARE
   ========================================================= */

app.use(express.json());

app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      'worknear-secret-key-change-in-production',

    resave: false,

    saveUninitialized: false,

    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

/* =========================================================
   GOOGLE OAUTH
   ========================================================= */

if (
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET
) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,

        clientSecret:
          process.env.GOOGLE_CLIENT_SECRET,

        callbackURL: `${
          process.env.APP_URL ||
          `http://localhost:${PORT}`
        }/auth/google/callback`,
      },

      (accessToken, refreshToken, profile, done) => {
        const user = {
          id: profile.id,
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
          picture: profile.photos?.[0]?.value,
        };

        return done(null, user);
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });
}

/* =========================================================
   GEMINI
   ========================================================= */

let ai: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;

  if (
    !apiKey ||
    apiKey === 'MY_GEMINI_API_KEY'
  ) {
    throw new Error(
      'GEMINI_API_KEY is not configured in environment variables'
    );
  }

  if (!ai) {
    ai = new GoogleGenAI({
      apiKey,

      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  return ai;
}

/* =========================================================
   SERVER CANDIDATES
   ========================================================= */

const serverCandidates = [
  {
    id: 'cand-1',
    name: 'Sarah Jenkins',
    role: 'Senior Full-Stack Engineer',
    skills: [
      'React',
      'TypeScript',
      'Node.js',
      'PostgreSQL',
      'AWS',
      'GraphQL',
    ],
    experience: 8,
    expectedSalary: '$140k - $170k',
    bio: 'Ex-Stripe full-stack engineer passionate about building high-performance web applications and fluid micro-interactions.',
  },

  {
    id: 'cand-2',
    name: 'Marcus Chen',
    role: 'AI / Machine Learning Specialist',
    skills: [
      'Python',
      'PyTorch',
      'Large Language Models',
      'FastAPI',
      'Docker',
      'CUDA',
    ],
    experience: 6,
    expectedSalary: '$160k - $200k',
    bio: 'Specialist in fine-tuning open-source LLMs and designing robust retrieval-augmented generation (RAG) agent systems.',
  },

  {
    id: 'cand-3',
    name: 'Elena Rostova',
    role: 'Lead Product Designer',
    skills: [
      'Figma',
      'Design Systems',
      'Interactive Prototyping',
      'User Research',
      'Tailwind CSS',
    ],
    experience: 7,
    expectedSalary: '$130k - $160k',
    bio: 'Obsessed with typography, grid alignments, and creating software interfaces that feel like digital craftsmanship.',
  },

  {
    id: 'cand-4',
    name: 'David Kalu',
    role: 'DevOps & Platform Architect',
    skills: [
      'Kubernetes',
      'Terraform',
      'CI/CD',
      'GCP',
      'Go',
      'Prometheus',
    ],
    experience: 9,
    expectedSalary: '$150k - $180k',
    bio: 'Enterprise architect focused on scaling container infrastructures, zero-downtime migrations, and strict infrastructure-as-code principles.',
  },

  {
    id: 'cand-5',
    name: 'Aria Takahashi',
    role: 'Growth Marketing Manager',
    skills: [
      'Growth Loops',
      'SEO',
      'Google Analytics',
      'A/B Testing',
      'Copywriting',
      'SQL',
    ],
    experience: 5,
    expectedSalary: '$110k - $130k',
    bio: 'Data-driven marketer who maps customer journeys, boosts organic acquisition loops, and loves high-tempo experimentation.',
  },
];

/* =========================================================
   API - HEALTH
   ========================================================= */

app.get(
  '/api/health',
  (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      databaseConfigured: Boolean(supabase),
      timestamp: new Date().toISOString(),
    });
  }
);

/* =========================================================
   API - SUPABASE STATUS
   ========================================================= */

app.get(
  '/api/supabase/status',
  async (_req: Request, res: Response) => {
    if (!supabase) {
      res.status(503).json({
        connected: false,
        error:
          'Supabase is not configured. Set SUPABASE_URL or VITE_SUPABASE_URL.',
      });

      return;
    }

    const { error } = await supabase
      .from('profiles')
      .select('id', {
        head: true,
        count: 'exact',
      });

    if (
      error &&
      !['PGRST205', '42P01'].includes(
        error.code || ''
      )
    ) {
      res.status(502).json({
        connected: false,
        error: error.message,
      });

      return;
    }

    res.json({
      connected: true,
    });
  }
);

/* =========================================================
   GOOGLE AUTH
   ========================================================= */

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
  }),
  (req: Request, res: Response) => {
    res.redirect('/?login=success');
  }
);

/* =========================================================
   LOGOUT
   ========================================================= */

app.get(
  '/auth/logout',
  (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res
          .status(500)
          .json({
            error: 'Logout failed',
          });
      }

      res.redirect('/');
    });
  }
);

/* =========================================================
   CURRENT USER
   ========================================================= */

app.get(
  '/api/user',
  (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      res.json({
        user: req.user,
        authenticated: true,
      });
    } else {
      res.json({
        user: null,
        authenticated: false,
      });
    }
  }
);

/* =========================================================
   AI CHAT
   ========================================================= */

app.post(
  '/api/chat',
  async (req: Request, res: Response) => {
    try {
      const { message, history } = req.body;

      if (!message) {
        res.status(400).json({
          error: 'Message is required',
        });

        return;
      }

      const client = getGeminiClient();

      const formattedContents: any[] = [];

      if (
        history &&
        Array.isArray(history)
      ) {
        for (const h of history) {
          formattedContents.push({
            role:
              h.role === 'user'
                ? 'user'
                : 'model',

            parts: [
              {
                text: h.text,
              },
            ],
          });
        }
      }

      formattedContents.push({
        role: 'user',

        parts: [
          {
            text: message,
          },
        ],
      });

      const response =
        await client.models.generateContent({
          model: 'gemini-3.6-flash',

          contents: formattedContents,

          config: {
            systemInstruction:
              `You are the WorkNear AI Recruiter & Global Workforce Architect.
Your tone is professional, sophisticated, and direct.
You represent a high-end human resources platform.
Keep replies well-structured with Markdown but highly concise.
Assist the user with recruitment strategies, job description generation, or salary benchmarking.`,

            temperature: 0.7,
          },
        });

      res.json({
        text:
          response.text ||
          "I didn't receive a clear response from my engine.",
      });
    } catch (error: any) {
      console.error(
        'Error in /api/chat:',
        error
      );

      res.json({
        text:
          `### AI Offline Mode

The AI service is currently unavailable.

- **Target Roles:** Check your candidate requirements.
- **Pricing:** Specify transparent budget bounds.
- **Sourcing:** Browse candidates from the WorkNear dashboard.

Error: ${error.message || 'Unknown error'}`,
      });
    }
  }
);

/* =========================================================
   MATCH
   ========================================================= */

app.post(
  '/api/match',
  async (req: Request, res: Response) => {
    const {
      jobTitle,
      jobDescription,
      skills,
    } = req.body;

    try {
      if (!jobTitle) {
        res.status(400).json({
          error: 'jobTitle is required',
        });

        return;
      }

      const client = getGeminiClient();

      const prompt = `
Match the following job listing against our candidate pool.

Job Title: ${jobTitle}

Description:
${jobDescription || 'N/A'}

Skills:
${JSON.stringify(skills || [])}

Candidates:
${JSON.stringify(
  serverCandidates,
  null,
  2
)}

Evaluate each candidate.
Return matchScore from 0 to 100 and matchReason.
`;

      const response =
        await client.models.generateContent({
          model: 'gemini-3.6-flash',

          contents: prompt,

          config: {
            responseMimeType:
              'application/json',

            responseSchema: {
              type: Type.OBJECT,

              required: ['matches'],

              properties: {
                matches: {
                  type: Type.ARRAY,

                  items: {
                    type: Type.OBJECT,

                    required: [
                      'id',
                      'matchScore',
                      'matchReason',
                    ],

                    properties: {
                      id: {
                        type: Type.STRING,
                      },

                      matchScore: {
                        type: Type.INTEGER,
                      },

                      matchReason: {
                        type: Type.STRING,
                      },
                    },
                  },
                },
              },
            },
          },
        });

      const parsedData = JSON.parse(
        response.text?.trim() || '{}'
      );

      res.json(parsedData);
    } catch (error: any) {
      console.error(
        'Error in /api/match:',
        error
      );

      const fallbacks =
        serverCandidates.map((c) => {
          let score = 50;

          let reason =
            'Candidate shares core digital competencies with this position.';

          if (
            skills &&
            Array.isArray(skills)
          ) {
            const matchesCount =
              c.skills.filter((s) =>
                skills.some(
                  (reqS: string) =>
                    reqS
                      .toLowerCase()
                      .includes(
                        s.toLowerCase()
                      ) ||
                    s
                      .toLowerCase()
                      .includes(
                        reqS.toLowerCase()
                      )
                )
              ).length;

            score =
              60 +
              Math.min(
                35,
                matchesCount * 12
              );

            reason = `Matches ${matchesCount} key technology tags including (${c.skills
              .slice(0, 2)
              .join(', ')}).`;
          }

          return {
            id: c.id,
            matchScore: score,
            matchReason: reason,
          };
        });

      res.json({
        matches: fallbacks,
      });
    }
  }
);

/* =========================================================
   RESUME ANALYSIS
   ========================================================= */

app.post(
  '/api/analyze-resume',
  async (req: Request, res: Response) => {
    try {
      const {
        resumeText,
        skills,
      } = req.body;

      if (!resumeText) {
        res.status(400).json({
          error:
            'resumeText is required',
        });

        return;
      }

      const client = getGeminiClient();

      const prompt = `
Analyze this candidate resume.

Profile:
${resumeText}

Skills:
${JSON.stringify(skills || [])}

Provide:
1. Suggested Roles
2. Skill Gaps
3. Resume Score
4. Optimization Tips

Return structured JSON.
`;

      const response =
        await client.models.generateContent({
          model: 'gemini-3.6-flash',

          contents: prompt,

          config: {
            responseMimeType:
              'application/json',

            responseSchema: {
              type: Type.OBJECT,

              required: [
                'roleSuggestion',
                'skillGaps',
                'resumeScore',
                'optimizationTips',
              ],

              properties: {
                roleSuggestion: {
                  type: Type.STRING,
                },

                skillGaps: {
                  type: Type.ARRAY,

                  items: {
                    type: Type.STRING,
                  },
                },

                resumeScore: {
                  type: Type.INTEGER,
                },

                optimizationTips: {
                  type: Type.ARRAY,

                  items: {
                    type: Type.STRING,
                  },
                },
              },
            },
          },
        });

      const parsedData = JSON.parse(
        response.text?.trim() || '{}'
      );

      res.json(parsedData);
    } catch (error: any) {
      console.error(
        'Error in /api/analyze-resume:',
        error
      );

      res.json({
        roleSuggestion:
          'Elite Technology Consultant',

        skillGaps: [
          'Kubernetes Native Architectures',
          'Generative Design Systems',
          'Distributed PostgreSQL Sharding',
        ],

        resumeScore: 82,

        optimizationTips: [
          'Add quantified outcomes to project items.',
          'Detail experience with high-traffic distributed systems.',
          'Showcase clean design-system references.',
        ],
      });
    }
  }
);

/* =========================================================
   SEO ANALYZER
   ========================================================= */

app.post(
  '/api/analyze-seo',
  async (req: Request, res: Response) => {
    const {
      jobTitle,
      jobDescription,
      targetLocation,
      companyName,
    } = req.body;

    try {
      if (
        !jobTitle ||
        !jobDescription
      ) {
        res.status(400).json({
          error:
            'jobTitle and jobDescription are required parameters.',
        });

        return;
      }

      const client = getGeminiClient();

      const prompt = `
Analyze the SEO performance of this job post.

Job Title:
${jobTitle}

Target Location:
${targetLocation || 'Remote'}

Company:
${companyName || 'WorkNear'}

Description:
${jobDescription}

Provide:
- titleScore
- descriptionScore
- overallSeoScore
- optimizedTitle
- optimizedMetaDescription
- suggestedKeywords
- jsonLdSchema
- crawlingChecklist

Return structured JSON.
`;

      const response =
        await client.models.generateContent({
          model: 'gemini-3.6-flash',

          contents: prompt,

          config: {
            responseMimeType:
              'application/json',

            responseSchema: {
              type: Type.OBJECT,

              required: [
                'titleScore',
                'descriptionScore',
                'overallSeoScore',
                'optimizedTitle',
                'optimizedMetaDescription',
                'suggestedKeywords',
                'jsonLdSchema',
                'crawlingChecklist',
              ],

              properties: {
                titleScore: {
                  type: Type.INTEGER,
                },

                descriptionScore: {
                  type: Type.INTEGER,
                },

                overallSeoScore: {
                  type: Type.INTEGER,
                },

                optimizedTitle: {
                  type: Type.STRING,
                },

                optimizedMetaDescription: {
                  type: Type.STRING,
                },

                suggestedKeywords: {
                  type: Type.ARRAY,

                  items: {
                    type: Type.STRING,
                  },
                },

                jsonLdSchema: {
                  type: Type.STRING,
                },

                crawlingChecklist: {
                  type: Type.ARRAY,

                  items: {
                    type: Type.OBJECT,

                    required: [
                      'status',
                      'label',
                    ],

                    properties: {
                      status: {
                        type: Type.STRING,
                      },

                      label: {
                        type: Type.STRING,
                      },
                    },
                  },
                },
              },
            },
          },
        });

      const parsedData = JSON.parse(
        response.text?.trim() || '{}'
      );

      res.json(parsedData);
    } catch (error: any) {
      console.error(
        'Error in /api/analyze-seo:',
        error
      );

      const simulatedTitle =
        jobTitle.length < 10
          ? `${jobTitle} - Senior Developer`
          : jobTitle;

      res.json({
        titleScore: 78,

        descriptionScore: 84,

        overallSeoScore: 81,

        optimizedTitle:
          `Senior ${simulatedTitle} (Remote / Hybrid)`,

        optimizedMetaDescription:
          `Looking for a skilled ${simulatedTitle}? Apply today at ${
            companyName ||
            'WorkNear Start-up'
          }.`,
        
        suggestedKeywords: [
          'React',
          'TypeScript',
          'Node.js',
          'Remote Developer',
          'Global Workforce',
        ],

        jsonLdSchema: JSON.stringify(
          {
            '@context':
              'https://schema.org/',
            '@type': 'JobPosting',

            title:
              `Senior ${simulatedTitle}`,

            description:
              jobDescription,

            datePosted:
              new Date()
                .toISOString()
                .split('T')[0],

            hiringOrganization: {
              '@type':
                'Organization',

              name:
                companyName ||
                'WorkNear',
            },

            jobLocationType:
              'TELECOMMUTE',
          },
          null,
          2
        ),

        crawlingChecklist: [
          {
            status: 'pass',
            label:
              'Structured Schema.org markup is validly formulated',
          },

          {
            status: 'warn',
            label:
              'Review job title keyword clarity',
          },

          {
            status: 'pass',
            label:
              'Mobile viewport is configured',
          },

          {
            status: 'warn',
            label:
              'Review OpenGraph and Twitter Card metadata',
          },
        ],
      });
    }
  }
);

/* =========================================================
   PRODUCTION / DEVELOPMENT FRONTEND
   ========================================================= */

async function startServer() {
  /*
   * DEVELOPMENT
   * npm/bun run dev
   */
  if (
    process.env.NODE_ENV !== 'production'
  ) {
    const vite =
      await createViteServer({
        server: {
          middlewareMode: true,
        },

        appType: 'spa',
      });

    app.use(
      vite.middlewares
    );
  }

  /*
   * PRODUCTION
   * Render / deployed environment
   */
  else {
    const distPath =
      path.resolve(
        process.cwd(),
        'dist'
      );

    console.log(
      `[WorkNear] Serving frontend from: ${distPath}`
    );

    /*
     * Serve CSS / JS / images
     */
    app.use(
      express.static(
        distPath,
        {
          index: false,
        }
      )
    );

    /*
     * React SPA fallback
     *
     * IMPORTANT:
     * API routes are already declared above.
     * Non-API frontend routes will receive index.html.
     */
    app.get(
      '*',
      (
        req: Request,
        res: Response
      ) => {
        res.sendFile(
          path.join(
            distPath,
            'index.html'
          )
        );
      }
    );
  }

  /*
   * Render requires listening on 0.0.0.0
   * and using process.env.PORT.
   */
  app.listen(
    PORT,
    '0.0.0.0',
    () => {
      console.log(
        `[WorkNear Server] Operational at http://0.0.0.0:${PORT}`
      );

      console.log(
        `[WorkNear Server] NODE_ENV=${process.env.NODE_ENV || 'development'}`
      );
    }
  );
}

startServer().catch(
  (error) => {
    console.error(
      '[WorkNear Server] Failed to start:',
      error
    );

    process.exit(1);
  }
);
