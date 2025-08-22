import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Add CORS middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Add logger
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Health check
app.get('/make-server-226989e6/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// User signup
app.post('/make-server-226989e6/auth/signup', async (c) => {
  try {
    const { email, password, name, studentId, university } = await c.req.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, studentId, university },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Signup error for ${email}: ${error}`);
      return c.json({ error: error.message }, 400);
    }

    // Store additional user profile data
    await kv.set(`profile:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      studentId,
      university,
      createdAt: new Date().toISOString(),
      resumeScore: null,
      mentorConnections: [],
      appliedJobs: [],
      hackathonIdeas: []
    });

    console.log(`User signed up successfully: ${email}`);
    return c.json({ user: data.user, message: 'User created successfully' });
  } catch (error) {
    console.log(`Signup system error: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Resume analysis
app.post('/make-server-226989e6/resume/analyze', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      console.log(`Resume analysis authorization error: ${authError}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { resumeText, fileName } = await c.req.json();

    // Simulate AI analysis (in production, this would call an AI service)
    const analysis = {
      score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
      strengths: [
        { title: "Technical Skills", description: "Strong programming background detected", icon: "CheckCircle" },
        { title: "Project Experience", description: "Well-documented projects found", icon: "Award" },
        { title: "Education", description: "Relevant degree and coursework highlighted", icon: "Target" }
      ],
      weaknesses: [
        { title: "Keywords", description: "Missing industry-specific keywords", icon: "AlertCircle" },
        { title: "Quantified Results", description: "Add more measurable achievements", icon: "TrendingUp" },
        { title: "Soft Skills", description: "Include leadership examples", icon: "Target" }
      ],
      suggestions: [
        { category: "Format", priority: "High", description: "Use ATS-friendly template", progress: 85 },
        { category: "Content", priority: "Medium", description: "Add quantified achievements", progress: 60 },
        { category: "Keywords", priority: "High", description: "Include relevant industry terms", progress: 90 },
        { category: "Length", priority: "Low", description: "Optimize for 1-2 pages", progress: 40 }
      ],
      analyzedAt: new Date().toISOString()
    };

    // Store analysis results
    await kv.set(`resume_analysis:${user.id}`, {
      userId: user.id,
      fileName,
      analysis,
      resumeText: resumeText.substring(0, 1000) // Store first 1000 chars for reference
    });

    // Update user profile with latest score
    const profile = await kv.get(`profile:${user.id}`);
    if (profile) {
      profile.resumeScore = analysis.score;
      await kv.set(`profile:${user.id}`, profile);
    }

    console.log(`Resume analyzed for user ${user.id}: score ${analysis.score}`);
    return c.json({ analysis });
  } catch (error) {
    console.log(`Resume analysis error: ${error}`);
    return c.json({ error: 'Analysis failed' }, 500);
  }
});

// Get jobs and hackathons
app.get('/make-server-226989e6/opportunities', async (c) => {
  try {
    const type = c.req.query('type') || 'all'; // 'jobs', 'hackathons', or 'all'
    
    // Get opportunities from KV store (in production, this might come from external APIs)
    let opportunities = await kv.getByPrefix('opportunity:');
    
    if (!opportunities.length) {
      // Seed with sample data if none exists
      const sampleJobs = [
        {
          id: 'job1',
          type: 'job',
          title: 'Frontend Developer Intern',
          company: 'TechStartup Inc.',
          location: 'Remote',
          jobType: 'Internship',
          salary: '$2,000/month',
          tags: ['React', 'JavaScript', 'CSS'],
          deadline: '2025-03-15',
          postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'hack1',
          type: 'hackathon',
          title: 'Global Climate Hack 2025',
          organizer: 'Green Tech Alliance',
          date: '2025-03-15 to 2025-03-17',
          prize: '$50,000',
          location: 'Virtual',
          tags: ['Sustainability', 'AI', 'Climate'],
          deadline: '2025-03-10',
          postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      for (const opp of sampleJobs) {
        await kv.set(`opportunity:${opp.id}`, opp);
      }
      opportunities = sampleJobs;
    }

    // Filter by type if specified
    if (type !== 'all') {
      opportunities = opportunities.filter(opp => opp.type === type);
    }

    return c.json({ opportunities });
  } catch (error) {
    console.log(`Error fetching opportunities: ${error}`);
    return c.json({ error: 'Failed to fetch opportunities' }, 500);
  }
});

// Mentor matching and messaging
app.get('/make-server-226989e6/mentors', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      console.log(`Mentor fetch authorization error: ${authError}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    let mentors = await kv.getByPrefix('mentor:');
    
    if (!mentors.length) {
      // Seed with sample mentor data
      const sampleMentors = [
        {
          id: 'mentor1',
          name: 'Sarah Chen',
          title: 'Senior Software Engineer',
          company: 'Google',
          expertise: ['React', 'Node.js', 'System Design'],
          rating: 4.9,
          sessions: 127,
          responseTime: '< 2 hours',
          price: '$50/hour',
          bio: 'Passionate about helping students transition into tech careers.',
          available: true
        },
        {
          id: 'mentor2',
          name: 'Michael Rodriguez',
          title: 'Data Science Manager',
          company: 'Meta',
          expertise: ['Python', 'Machine Learning', 'Analytics'],
          rating: 4.8,
          sessions: 89,
          responseTime: '< 4 hours',
          price: '$60/hour',
          bio: 'Helping aspiring data scientists break into the field.',
          available: false
        }
      ];

      for (const mentor of sampleMentors) {
        await kv.set(`mentor:${mentor.id}`, mentor);
      }
      mentors = sampleMentors;
    }

    return c.json({ mentors });
  } catch (error) {
    console.log(`Error fetching mentors: ${error}`);
    return c.json({ error: 'Failed to fetch mentors' }, 500);
  }
});

// Send message to mentor
app.post('/make-server-226989e6/messages', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      console.log(`Message send authorization error: ${authError}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { mentorId, message, chatId } = await c.req.json();

    const messageData = {
      id: crypto.randomUUID(),
      chatId,
      senderId: user.id,
      mentorId,
      message,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    await kv.set(`message:${messageData.id}`, messageData);

    // Update chat metadata
    const existingChat = await kv.get(`chat:${chatId}`) || {
      id: chatId,
      studentId: user.id,
      mentorId,
      lastMessage: message,
      lastMessageAt: messageData.timestamp,
      createdAt: messageData.timestamp
    };

    existingChat.lastMessage = message;
    existingChat.lastMessageAt = messageData.timestamp;
    await kv.set(`chat:${chatId}`, existingChat);

    console.log(`Message sent from user ${user.id} to mentor ${mentorId}`);
    return c.json({ message: messageData, success: true });
  } catch (error) {
    console.log(`Error sending message: ${error}`);
    return c.json({ error: 'Failed to send message' }, 500);
  }
});

// Get chat messages
app.get('/make-server-226989e6/chats/:chatId/messages', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      console.log(`Chat fetch authorization error: ${authError}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const chatId = c.req.param('chatId');
    const messages = await kv.getByPrefix(`message:`);
    const chatMessages = messages
      .filter(msg => msg.chatId === chatId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return c.json({ messages: chatMessages });
  } catch (error) {
    console.log(`Error fetching chat messages: ${error}`);
    return c.json({ error: 'Failed to fetch messages' }, 500);
  }
});

// Generate hackathon ideas with AI (mock implementation)
app.post('/make-server-226989e6/hackathon/generate', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      console.log(`Hackathon generation authorization error: ${authError}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { category, interests, skillLevel } = await c.req.json();

    // Mock AI-generated ideas
    const ideaTemplates = [
      {
        title: "Smart Campus Assistant",
        description: "Create an AI-powered chatbot to help students navigate campus resources and services.",
        difficulty: "Intermediate",
        tags: ["AI", "Chatbot", "Education"],
        timeEstimate: "48 hours"
      },
      {
        title: "Sustainable Transport Tracker",
        description: "Build an app that gamifies eco-friendly transportation choices with rewards.",
        difficulty: "Beginner",
        tags: ["Sustainability", "Mobile", "Gamification"],
        timeEstimate: "36 hours"
      }
    ];

    const randomIdea = ideaTemplates[Math.floor(Math.random() * ideaTemplates.length)];
    const generatedIdea = {
      ...randomIdea,
      id: crypto.randomUUID(),
      generatedFor: user.id,
      generatedAt: new Date().toISOString(),
      category,
      interests,
      skillLevel
    };

    await kv.set(`generated_idea:${generatedIdea.id}`, generatedIdea);

    console.log(`Generated hackathon idea for user ${user.id}: ${generatedIdea.title}`);
    return c.json({ idea: generatedIdea });
  } catch (error) {
    console.log(`Error generating hackathon idea: ${error}`);
    return c.json({ error: 'Failed to generate idea' }, 500);
  }
});

Deno.serve(app.fetch);