const fetch = require('node-fetch');
const Hackathon = require('../models/hackathon');

// Generate hackathon PROJECT IDEAS (using OpenAI) ✅ CORRECT USE
const generateIdeas = async (req, res) => {
  try {
    const { interest, category, skillLevel } = req.body;

    const prompt = `Generate 5 unique hackathon ideas for a project in the "${category}" category. The ideas should be related to "${interest}" and be suitable for a "${skillLevel}" skill level. For each idea, provide a short description and a list of key technologies that could be used.`;

    // Call OpenAI to generate project ideas (this is appropriate)
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await aiResponse.json();
    const ideas = data.choices[0].message.content;

    res.json({ success: true, ideas });

  } catch (error) {
    console.error('Error generating hackathon ideas:', error);
    res.status(500).json({ success: false, message: 'Failed to generate ideas.' });
  }
};

// Fetch ACTUAL HACKATHON EVENTS from MongoDB database ✅ CORRECT APPROACH
const getHackathons = async (req, res) => {
  try {
    const { status, limit, page } = req.query;
    
    // Build query
    let query = {};
    if (status) {
      query.status = status;
    } else {
      // Default: get upcoming and ongoing hackathons
      query.$or = [
        { status: 'upcoming' },
        { status: 'ongoing' }
      ];
    }

    // Pagination
    const limitNum = parseInt(limit) || 50;
    const pageNum = parseInt(page) || 1;
    const skip = (pageNum - 1) * limitNum;

    // Fetch from database
    const hackathons = await Hackathon.find(query)
      .sort({ startDate: 1 }) // Sort by start date ascending
      .limit(limitNum)
      .skip(skip)
      .lean(); // Use lean() for better performance

    // If no hackathons in DB, return sample data and seed the database
    if (hackathons.length === 0) {
      console.log('No hackathons found in database. Seeding sample data...');
      await seedSampleHackathons();
      const seededHackathons = await Hackathon.find(query)
        .sort({ startDate: 1 })
        .limit(limitNum)
        .skip(skip)
        .lean();
      
      return res.json({ 
        success: true, 
        hackathons: seededHackathons.map(formatHackathon),
        message: 'Sample hackathons loaded'
      });
    }

    // Format hackathons for frontend
    const formattedHackathons = hackathons.map(formatHackathon);

    res.json({ 
      success: true, 
      hackathons: formattedHackathons,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: await Hackathon.countDocuments(query)
      }
    });

  } catch (error) {
    console.error('Error fetching hackathons:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch hackathons.' });
  }
};

// Format hackathon for frontend response
const formatHackathon = (hackathon) => {
  return {
    id: hackathon._id.toString(),
    title: hackathon.title,
    description: hackathon.description,
    date: hackathon.dateDisplay || formatDateRange(hackathon.startDate, hackathon.endDate),
    startDate: hackathon.startDate,
    endDate: hackathon.endDate,
    location: hackathon.location,
    isVirtual: hackathon.isVirtual,
    participants: hackathon.participantsText || `${hackathon.participants}+`,
    participantsCount: hackathon.participants,
    prize: hackathon.prize,
    prizeAmount: hackathon.prizeAmount,
    difficulty: hackathon.difficulty,
    tags: hackathon.tags || [],
    registrationLink: hackathon.registrationLink,
    deadline: hackathon.deadline ? formatDate(hackathon.deadline) : null,
    organizer: hackathon.organizer,
    image: hackathon.bannerUrl || hackathon.imageUrl || getDefaultImage(hackathon.tags),
    status: hackathon.status
  };
};

// Helper function to format date range
const formatDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.getDate()}, ${end.getFullYear()}`;
  }
  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
};

// Helper function to format single date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Helper function to get default gradient image based on tags
const getDefaultImage = (tags) => {
  if (!tags || tags.length === 0) return 'bg-gradient-to-br from-[#6A0DAD] to-[#9B4DFF]';
  
  const tag = tags[0].toLowerCase();
  if (tag.includes('ai') || tag.includes('ml') || tag.includes('machine learning')) {
    return 'bg-gradient-to-br from-blue-500 to-purple-600';
  } else if (tag.includes('sustainability') || tag.includes('climate') || tag.includes('green')) {
    return 'bg-gradient-to-br from-green-500 to-teal-600';
  } else if (tag.includes('fintech') || tag.includes('blockchain') || tag.includes('crypto')) {
    return 'bg-gradient-to-br from-yellow-500 to-orange-600';
  } else if (tag.includes('health') || tag.includes('medical')) {
    return 'bg-gradient-to-br from-pink-500 to-red-600';
  } else {
    return 'bg-gradient-to-br from-[#6A0DAD] to-[#9B4DFF]';
  }
};

// Seed sample hackathons (called if database is empty)
const seedSampleHackathons = async () => {
  const sampleHackathons = [
    {
      title: 'AI Innovation Challenge 2024',
      description: 'Join us for an exciting hackathon focused on AI and machine learning innovations.',
      startDate: new Date('2024-12-15'),
      endDate: new Date('2024-12-17'),
      location: 'San Francisco, CA',
      isVirtual: false,
      registrationLink: 'https://devpost.com/hackathons',
      deadline: new Date('2024-12-10'),
      prize: '$50,000',
      prizeAmount: 50000,
      participants: 2500,
      participantsText: '2.5K+',
      difficulty: 'Advanced',
      tags: ['AI/ML', 'Healthcare', 'Social Impact'],
      organizer: 'Tech Innovators',
      status: 'upcoming',
      source: 'manual'
    },
    {
      title: 'Sustainable Tech Hackathon',
      description: 'Build solutions for climate change and sustainability challenges.',
      startDate: new Date('2025-01-08'),
      endDate: new Date('2025-01-10'),
      location: 'Virtual',
      isVirtual: true,
      registrationLink: 'https://devpost.com/hackathons',
      deadline: new Date('2025-01-05'),
      prize: '$25,000',
      prizeAmount: 25000,
      participants: 1800,
      participantsText: '1.8K+',
      difficulty: 'Intermediate',
      tags: ['Climate Tech', 'Sustainability', 'IoT'],
      organizer: 'Green Tech Alliance',
      status: 'upcoming',
      source: 'manual'
    },
    {
      title: 'Fintech Revolution',
      description: 'Innovate in financial technology, blockchain, and payment solutions.',
      startDate: new Date('2025-01-22'),
      endDate: new Date('2025-01-24'),
      location: 'New York, NY',
      isVirtual: false,
      registrationLink: 'https://devpost.com/hackathons',
      deadline: new Date('2025-01-18'),
      prize: '$75,000',
      prizeAmount: 75000,
      participants: 3200,
      participantsText: '3.2K+',
      difficulty: 'Advanced',
      tags: ['Fintech', 'Blockchain', 'Security'],
      organizer: 'Finance Hub',
      status: 'upcoming',
      source: 'manual'
    }
  ];

  try {
    await Hackathon.insertMany(sampleHackathons);
    console.log('Sample hackathons seeded successfully');
  } catch (error) {
    console.error('Error seeding hackathons:', error);
    throw error;
  }
};

// Sync hackathons from Devpost (web scraping approach)
// Note: Devpost doesn't have a public API, so this would require web scraping
// For now, this is a placeholder that can be extended with Puppeteer or Cheerio
const syncFromDevpost = async (req, res) => {
  try {
    // This is a placeholder - Devpost doesn't have a public API
    // You would need to implement web scraping using Puppeteer or Cheerio
    // For now, return a message
    
    res.json({ 
      success: true, 
      message: 'Devpost sync not yet implemented. Please add hackathons manually or implement web scraping.',
      note: 'To implement: Use Puppeteer/Cheerio to scrape https://devpost.com/hackathons'
    });

    // Example implementation (commented out):
    /*
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://devpost.com/hackathons');
    
    const hackathons = await page.evaluate(() => {
      // Scrape hackathon data from the page
      // Return array of hackathon objects
    });
    
    // Save to database
    for (const hackathon of hackathons) {
      await Hackathon.findOneAndUpdate(
        { externalId: hackathon.devpostId },
        hackathon,
        { upsert: true, new: true }
      );
    }
    
    await browser.close();
    */

  } catch (error) {
    console.error('Error syncing from Devpost:', error);
    res.status(500).json({ success: false, message: 'Failed to sync from Devpost.' });
  }
};

module.exports = {
  generateIdeas,      // For generating project ideas (OpenAI ✅)
  getHackathons,      // For fetching actual hackathon events (MongoDB ✅)
  syncFromDevpost     // For syncing hackathons from Devpost (placeholder)
};