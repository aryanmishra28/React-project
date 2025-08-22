import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Briefcase, Calendar, MapPin, Clock, ExternalLink, Filter } from "lucide-react";

export function JobsAndUpdates() {
  const jobListings = [
    {
      title: "Frontend Developer Intern",
      company: "TechStartup Inc.",
      location: "Remote",
      type: "Internship",
      salary: "$2,000/month",
      posted: "2 days ago",
      deadline: "March 15, 2025",
      tags: ["React", "JavaScript", "CSS"],
      logo: "https://images.unsplash.com/photo-1718220216044-006f43e3a9b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzU1NDgyMjU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Data Science Intern",
      company: "Analytics Pro",
      location: "New York, NY",
      type: "Internship",
      salary: "$2,500/month",
      posted: "1 week ago",
      deadline: "March 20, 2025",
      tags: ["Python", "Machine Learning", "SQL"],
      logo: "https://images.unsplash.com/photo-1669023414180-4dcf35d943e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBkZXZlbG9wZXIlMjBjb21wdXRlcnxlbnwxfHx8fDE3NTU1MjIxNTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ];

  const hackathons = [
    {
      title: "Global Climate Hack 2025",
      organizer: "Green Tech Alliance",
      date: "March 15-17, 2025",
      prize: "$50,000",
      participants: "500+ registered",
      location: "Virtual",
      tags: ["Sustainability", "AI", "Climate"],
      deadline: "March 10, 2025",
      banner: "https://images.unsplash.com/photo-1653539465770-2d7120d830bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHdvcmtpbmclMjBsYXB0b3BzfGVufDF8fHx8MTc1NTUyMjE1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "AI for Education Hackathon",
      organizer: "EduTech Hub",
      date: "April 5-7, 2025",
      prize: "$25,000",
      participants: "300+ registered",
      location: "Boston, MA",
      tags: ["AI", "Education", "Machine Learning"],
      deadline: "March 25, 2025",
      banner: "https://images.unsplash.com/photo-1669023414180-4dcf35d943e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBkZXZlbG9wZXIlMjBjb21wdXRlcnxlbnwxfHx8fDE3NTU1MjIxNTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Jobs & Hackathon Updates</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest job opportunities and hackathon events tailored for students.
          </p>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </Button>
            <div className="flex space-x-2">
              <Badge variant="secondary">Remote</Badge>
              <Badge variant="secondary">Internship</Badge>
              <Badge variant="secondary">AI</Badge>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Showing 12 of 156 results
          </div>
        </div>

        <Tabs defaultValue="jobs" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-400 mx-auto">
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
            <TabsTrigger value="internships">Internships</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            {jobListings.map((job, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={job.logo}
                        alt={`${job.company} logo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                          <p className="text-lg text-gray-600">{job.company}</p>
                        </div>
                        <Badge 
                          variant={job.type === 'Internship' ? 'secondary' : 'default'}
                          className="ml-4"
                        >
                          {job.type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Briefcase className="w-4 h-4" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Posted {job.posted}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Deadline: {job.deadline}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {job.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button className="bg-gradient-to-r from-[#6A0DAD] to-[#9B4DFF] text-white rounded-lg">
                          Apply Now
                          <ExternalLink className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="hackathons" className="space-y-6">
            {hackathons.map((hackathon, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                <div className="h-48 relative">
                  <ImageWithFallback
                    src={hackathon.banner}
                    alt={`${hackathon.title} banner`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold">{hackathon.title}</h3>
                    <p className="text-lg opacity-90">{hackathon.organizer}</p>
                  </div>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span>{hackathon.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-purple-600" />
                      <span>{hackathon.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-purple-600" />
                      <span>Prize: {hackathon.prize}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span>Deadline: {hackathon.deadline}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {hackathon.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button className="bg-gradient-to-r from-[#6A0DAD] to-[#9B4DFF] text-white rounded-lg">
                      Register Now
                      <ExternalLink className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                  
                  <p className="text-sm text-gray-600">{hackathon.participants}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="internships" className="space-y-6">
            {jobListings.filter(job => job.type === 'Internship').map((job, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={job.logo}
                        alt={`${job.company} logo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                          <p className="text-lg text-gray-600">{job.company}</p>
                        </div>
                        <Badge variant="secondary">{job.type}</Badge>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Briefcase className="w-4 h-4" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Deadline: {job.deadline}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {job.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button className="bg-gradient-to-r from-[#6A0DAD] to-[#9B4DFF] text-white rounded-lg">
                          Apply Now
                          <ExternalLink className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}