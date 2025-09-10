import React, { useState } from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  Calendar, 
  Users, 
  Trophy, 
  Clock, 
  MapPin,
  ExternalLink,
  Zap,
  RefreshCw,
  Star,
  Code,
  Rocket
} from 'lucide-react';

export function HackathonIdeas() {
  const [selectedSkill, setSelectedSkill] = useState('');
  const [generatedIdeas, setGeneratedIdeas] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const skills = [
    'Web Development', 'Mobile Apps', 'AI/ML', 'Blockchain', 
    'IoT', 'AR/VR', 'Data Science', 'Cybersecurity', 'Game Development'
  ];

  const featuredHackathons = [
    {
      title: 'AI Innovation Challenge 2024',
      date: 'Dec 15-17, 2024',
      location: 'San Francisco, CA',
      participants: '2.5K+',
      prize: '$50,000',
      difficulty: 'Advanced',
      tags: ['AI/ML', 'Healthcare', 'Social Impact'],
      image: 'bg-gradient-to-br from-blue-500 to-purple-600'
    },
    {
      title: 'Sustainable Tech Hackathon',
      date: 'Jan 8-10, 2025',
      location: 'Virtual',
      participants: '1.8K+',
      prize: '$25,000',
      difficulty: 'Intermediate',
      tags: ['Climate Tech', 'Sustainability', 'IoT'],
      image: 'bg-gradient-to-br from-green-500 to-teal-600'
    },
    {
      title: 'Fintech Revolution',
      date: 'Jan 22-24, 2025',
      location: 'New York, NY',
      participants: '3.2K+',
      prize: '$75,000',
      difficulty: 'Advanced',
      tags: ['Fintech', 'Blockchain', 'Security'],
      image: 'bg-gradient-to-br from-yellow-500 to-orange-600'
    }
  ];

  const projectIdeas = [
    {
      title: 'EcoTrack - Carbon Footprint Monitor',
      description: 'AI-powered app that tracks daily activities and suggests eco-friendly alternatives',
      difficulty: 'Intermediate',
      tech: ['React Native', 'Python', 'TensorFlow'],
      category: 'Sustainability'
    },
    {
      title: 'StudyBuddy - AI Learning Assistant',
      description: 'Personalized learning platform with AI tutoring and progress tracking',
      difficulty: 'Advanced',
      tech: ['Next.js', 'OpenAI API', 'PostgreSQL'],
      category: 'Education'
    },
    {
      title: 'HealthGuard - Medication Reminder',
      description: 'Smart medication management with IoT sensors and mobile alerts',
      difficulty: 'Beginner',
      tech: ['Flutter', 'Arduino', 'Firebase'],
      category: 'Healthcare'
    }
  ];

  // replace generateIdeas in Frontend/src/components/HackathonIdeas.tsx
const generateIdeas = async () => {
  if (!selectedSkill) return;
  setIsGenerating(true);
  try {
    const res = await fetch('http://localhost:5000/api/hackathon/generate-ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ interest: selectedSkill, category: 'Innovation', skillLevel: 'Intermediate' }),
    });
    const data = await res.json();
    // data.ideas is a text block from the model — render as text or parse into cards
    setGeneratedIdeas([{ title: 'Ideas', description: data.ideas, difficulty: 'Intermediate', tech: [], category: 'AI' }]);
  } finally {
    setIsGenerating(false);
  }
};

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#6A0DAD] via-[#8B5FBF] to-[#9B4DFF] py-16">
        <div className="max-w-7xl mx-auto px-6 text-center text-white">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Lightbulb size={40} className="text-yellow-300" />
            <h1 className="text-4xl md:text-5xl font-bold">Hackathon Hub</h1>
          </div>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Discover exciting hackathons and get AI-powered project ideas to kickstart your innovation journey
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* AI Idea Generator */}
        <section className="mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Sparkles className="text-[#6A0DAD]" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">AI Project Idea Generator</h2>
              </div>
              <p className="text-gray-600">Get personalized hackathon project ideas based on your skills</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What's your main skill or interest?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {skills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => setSelectedSkill(skill)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                        selectedSkill === skill
                          ? 'border-[#6A0DAD] bg-[#6A0DAD]/5 text-[#6A0DAD]'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generateIdeas}
                disabled={!selectedSkill || isGenerating}
                className="w-full bg-gradient-to-r from-[#6A0DAD] to-[#9B4DFF] text-white py-4 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="animate-spin" size={20} />
                    <span>Generating Ideas...</span>
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    <span>Generate Project Ideas</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated Ideas */}
            {generatedIdeas.length > 0 && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {generatedIdeas.map((idea, index) => (
                  <div key={index} className="p-6 bg-gradient-to-br from-[#6A0DAD]/5 to-[#9B4DFF]/5 rounded-2xl border border-[#6A0DAD]/20">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{idea.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(idea.difficulty)}`}>
                        {idea.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{idea.description}</p>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {idea.tech.map((tech, techIndex) => (
                          <span key={techIndex} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#6A0DAD] font-medium">{idea.category}</span>
                        <button className="text-[#6A0DAD] hover:text-[#9B4DFF] transition-colors">
                          <Star size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Featured Hackathons */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Hackathons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredHackathons.map((hackathon, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className={`h-32 ${hackathon.image} flex items-center justify-center`}>
                  <div className="text-center text-white">
                    <Trophy size={32} className="mx-auto mb-2" />
                    <p className="font-bold text-lg">{hackathon.prize}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 leading-tight">{hackathon.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(hackathon.difficulty)}`}>
                      {hackathon.difficulty}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar size={14} className="mr-2" />
                      {hackathon.date}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin size={14} className="mr-2" />
                      {hackathon.location}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Users size={14} className="mr-2" />
                      {hackathon.participants} participants
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {hackathon.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-2 py-1 bg-[#6A0DAD]/10 text-[#6A0DAD] rounded-lg text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button className="w-full bg-gradient-to-r from-[#6A0DAD] to-[#9B4DFF] text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2">
                    <span>Register Now</span>
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Project Ideas */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Project Ideas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectIdeas.map((project, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Code className="text-[#6A0DAD]" size={20} />
                    <h3 className="font-semibold text-gray-900">{project.title}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(project.difficulty)}`}>
                    {project.difficulty}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{project.description}</p>
                
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <span key={techIndex} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#6A0DAD] font-medium">{project.category}</span>
                    <button className="flex items-center space-x-1 text-[#6A0DAD] hover:text-[#9B4DFF] transition-colors">
                      <Rocket size={16} />
                      <span className="text-sm font-medium">Start Project</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}