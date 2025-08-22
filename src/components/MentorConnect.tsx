import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "./AuthContext";
import { MessageCircle, Star, Users, Calendar, Send, Search, Filter } from "lucide-react";

export function MentorConnect() {
  const auth = useAuth();
  const user = auth ? auth.user : null;

  const mentors = [
    {
      name: "Sarah Chen",
      title: "Senior Software Engineer",
      company: "Google",
      expertise: ["React", "Node.js", "System Design"],
      rating: 4.9,
      sessions: 127,
      responseTime: "< 2 hours",
      price: "$50/hour",
      avatar: "https://images.unsplash.com/photo-1618173887111-3ecfc91c41b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50b3IlMjBtZW50b3JzaGlwJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc1NTUyMjE1OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      bio: "Passionate about helping students transition into tech careers. 5+ years at Google working on large-scale systems.",
      available: true
    },
    {
      name: "Michael Rodriguez",
      title: "Data Science Manager",
      company: "Meta",
      expertise: ["Python", "Machine Learning", "Analytics"],
      rating: 4.8,
      sessions: 89,
      responseTime: "< 4 hours",
      price: "$60/hour",
      avatar: "https://images.unsplash.com/photo-1618173887111-3ecfc91c41b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50b3IlMjBtZW50b3JzaGlwJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc1NTUyMjE1OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      bio: "Helping aspiring data scientists break into the field. Former researcher with expertise in ML and analytics.",
      available: false
    },
    {
      name: "Emily Johnson",
      title: "Product Designer",
      company: "Spotify",
      expertise: ["UI/UX", "Figma", "User Research"],
      rating: 4.9,
      sessions: 156,
      responseTime: "< 1 hour",
      price: "$45/hour",
      avatar: "https://images.unsplash.com/photo-1618173887111-3ecfc91c41b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50b3IlMjBtZW50b3JzaGlwJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc1NTUyMjE1OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      bio: "Design mentor with focus on helping students build portfolios and land their first design roles.",
      available: true
    }
  ];

  const chatMessages = [
    { sender: "Sarah Chen", message: "Hi! I reviewed your portfolio. Great work on the React projects!", time: "2:30 PM", isMe: false },
    { sender: "You", message: "Thank you! I'd love to get feedback on my system design skills.", time: "2:32 PM", isMe: true },
    { sender: "Sarah Chen", message: "Absolutely! Let's schedule a session this week. What's your availability?", time: "2:35 PM", isMe: false },
    { sender: "You", message: "I'm free Tuesday and Thursday evenings", time: "2:36 PM", isMe: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Mentor-Mentee Connect</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with industry professionals for personalized guidance and accelerate your career growth.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                  placeholder="Search mentors by expertise..." 
                  className="pl-12 pr-4 py-3 border-2 border-purple-200 focus:border-purple-500 rounded-xl"
                />
              </div>
              <Button variant="outline" className="flex items-center space-x-2 rounded-xl">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </Button>
            </div>

            {mentors.map((mentor, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={mentor.avatar} alt={mentor.name} />
                      <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-xl font-semibold text-gray-900">{mentor.name}</h3>
                            {mentor.available && (
                              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-lg text-gray-600">{mentor.title}</p>
                          <p className="text-purple-600 font-medium">{mentor.company}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="font-medium">{mentor.rating}</span>
                          </div>
                          <p className="text-sm text-gray-500">{mentor.sessions} sessions</p>
                        </div>
                      </div>

                      <p className="text-gray-600">{mentor.bio}</p>

                      <div className="flex flex-wrap gap-2">
                        {mentor.expertise.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>Response: {mentor.responseTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{mentor.price}</span>
                          </div>
                        </div>
                        <Button 
                          className={`rounded-lg ${
                            mentor.available 
                              ? "bg-gradient-to-r from-[#6A0DAD] to-[#9B4DFF] text-white" 
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                          disabled={!mentor.available || !user}
                        >
                          {!user ? "Sign In to Connect" : mentor.available ? "Connect" : "Unavailable"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl h-fit sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                  <span>Active Chat</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user ? (
                  <>
                    <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={mentors[0].avatar} alt={mentors[0].name} />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{mentors[0].name}</p>
                        <p className="text-sm text-green-600">Online</p>
                      </div>
                    </div>

                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {chatMessages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs px-3 py-2 rounded-lg ${
                            msg.isMe 
                              ? 'bg-gradient-to-r from-[#6A0DAD] to-[#9B4DFF] text-white' 
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm">{msg.message}</p>
                            <p className={`text-xs mt-1 ${
                              msg.isMe ? 'text-purple-100' : 'text-gray-500'
                            }`}>
                              {msg.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
                      <Input 
                        placeholder="Type a message..." 
                        className="flex-1 rounded-lg border-gray-200"
                      />
                      <Button size="sm" className="bg-gradient-to-r from-[#6A0DAD] to-[#9B4DFF] text-white rounded-lg">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-gray-100">
                      <p className="text-sm font-medium text-gray-700">Quick Actions</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="text-xs rounded-lg">
                          Schedule Call
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs rounded-lg">
                          Share Resume
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs rounded-lg">
                          Book Session
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs rounded-lg">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign In to Chat</h3>
                    <p className="text-gray-600 text-sm">Connect with mentors and start meaningful conversations about your career.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}