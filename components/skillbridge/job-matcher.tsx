"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Briefcase, MapPin, DollarSign, Calendar, TrendingUp, 
  Search, Upload, ExternalLink, Target, CheckCircle, 
  AlertCircle, Sparkles, Building2, Lightbulb
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  posted: string;
  matchScore: number;
  url: string;
  matchedSkills: string[];
  missingSkills: string[];
  description: string;
  type: string; // "Full-time", "Remote", etc.
  seniority: string; // "Junior", "Mid-level", "Senior"
}

interface RoleRecommendation {
  title: string;
  matchScore: number;
  reasoning: string;
  averageSalary: string;
  demandLevel: 'High' | 'Medium' | 'Low';
  skills: string[];
}

interface JobMatcherProps {
  currentSkills?: string[];
}

export function JobMatcher({ currentSkills = [] }: JobMatcherProps) {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [searching, setSearching] = useState(false);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [roleRecommendations, setRoleRecommendations] = useState<RoleRecommendation[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  // Profile Matcher state
  const [jobDescription, setJobDescription] = useState('');
  const [analyzingProfile, setAnalyzingProfile] = useState(false);
  const [profileMatchScore, setProfileMatchScore] = useState<number | null>(null);
  const [profileAnalysis, setProfileAnalysis] = useState<any>(null);
  const [shareableProfileUrl, setShareableProfileUrl] = useState('');

  // Mock job matching (will connect to real APIs)
  const findJobs = async () => {
    setSearching(true);
    setShowResults(false);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Mock job matches
    const mockJobs: JobMatch[] = [
      {
        id: '1',
        title: 'Full-Stack Developer',
        company: 'TechCorp',
        location: 'San Francisco, CA (Remote)',
        salary: '$95K - $135K',
        posted: '2 days ago',
        matchScore: 92,
        url: 'https://jobs.techcorp.com/12345',
        matchedSkills: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'Git'],
        missingSkills: ['Docker', 'Kubernetes'],
        description: 'We are looking for a Full-Stack Developer to join our growing team. You will work on building scalable web applications...',
        type: 'Full-time, Remote',
        seniority: 'Mid-level'
      },
      {
        id: '2',
        title: 'Frontend Engineer',
        company: 'StartupXYZ',
        location: 'New York, NY',
        salary: '$85K - $120K',
        posted: '1 week ago',
        matchScore: 88,
        url: 'https://jobs.startupxyz.com/67890',
        matchedSkills: ['React', 'JavaScript', 'CSS', 'TypeScript'],
        missingSkills: ['Redux', 'Testing Library'],
        description: 'Join our team to build beautiful user interfaces for our SaaS platform. Experience with modern React required...',
        type: 'Full-time, Hybrid',
        seniority: 'Junior to Mid-level'
      },
      {
        id: '3',
        title: 'Software Engineer',
        company: 'MegaCorp',
        location: 'Austin, TX',
        salary: '$100K - $150K',
        posted: '3 days ago',
        matchScore: 85,
        url: 'https://careers.megacorp.com/job/456',
        matchedSkills: ['JavaScript', 'Python', 'Git', 'SQL'],
        missingSkills: ['AWS', 'System Design', 'Microservices'],
        description: 'Looking for a Software Engineer to work on our cloud infrastructure team. Strong backend skills required...',
        type: 'Full-time, On-site',
        seniority: 'Mid to Senior-level'
      },
      {
        id: '4',
        title: 'React Developer',
        company: 'Digital Agency',
        location: 'Los Angeles, CA (Remote)',
        salary: '$80K - $110K',
        posted: '5 days ago',
        matchScore: 90,
        url: 'https://careers.digitalagency.com/react-dev',
        matchedSkills: ['React', 'JavaScript', 'HTML', 'CSS', 'Git'],
        missingSkills: ['Next.js', 'Styled Components'],
        description: 'We need a talented React Developer to build client websites and web applications. Portfolio required...',
        type: 'Full-time, Remote',
        seniority: 'Junior'
      },
      {
        id: '5',
        title: 'Full-Stack Engineer',
        company: 'FinTech Inc',
        location: 'Remote (US)',
        salary: '$110K - $160K',
        posted: '1 day ago',
        matchScore: 82,
        url: 'https://jobs.fintech.com/fullstack-456',
        matchedSkills: ['JavaScript', 'Node.js', 'React', 'SQL'],
        missingSkills: ['GraphQL', 'Redis', 'Security Best Practices'],
        description: 'Join our FinTech team to build secure financial applications. Experience with payment systems a plus...',
        type: 'Full-time, Remote',
        seniority: 'Senior'
      }
    ];

    // Mock role recommendations
    const mockRoles: RoleRecommendation[] = [
      {
        title: 'Full-Stack Developer',
        matchScore: 92,
        reasoning: 'Your skills in React, JavaScript, and backend technologies make you a strong candidate for full-stack roles.',
        averageSalary: '$95K - $135K',
        demandLevel: 'High',
        skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker']
      },
      {
        title: 'Frontend Engineer',
        matchScore: 90,
        reasoning: 'Strong frontend skills with React and JavaScript. Consider adding testing frameworks to increase opportunities.',
        averageSalary: '$85K - $120K',
        demandLevel: 'High',
        skills: ['React', 'TypeScript', 'CSS', 'Testing Library', 'Next.js']
      },
      {
        title: 'Backend Developer',
        matchScore: 75,
        reasoning: 'Your backend knowledge is solid, but expanding Node.js and database skills would open more opportunities.',
        averageSalary: '$90K - $140K',
        demandLevel: 'Medium',
        skills: ['Node.js', 'PostgreSQL', 'API Design', 'Microservices', 'AWS']
      }
    ];

    setJobMatches(mockJobs);
    setRoleRecommendations(mockRoles);
    setSearching(false);
    setShowResults(true);
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDemandColor = (level: string) => {
    if (level === 'High') return 'bg-green-600';
    if (level === 'Medium') return 'bg-yellow-600';
    return 'bg-red-600';
  };

  // Analyze profile match against job description
  const analyzeProfileMatch = async () => {
    if (!jobDescription.trim()) {
      alert('Please paste a job description to analyze');
      return;
    }

    setAnalyzingProfile(true);
    setProfileMatchScore(null);
    setProfileAnalysis(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock analysis based on skills
    const requiredSkills = ['React', 'TypeScript', 'Node.js', 'AWS', 'Docker', 'GraphQL'];
    const matchedSkills = currentSkills.filter(skill => 
      requiredSkills.some(req => req.toLowerCase().includes(skill.toLowerCase()) || 
                                  skill.toLowerCase().includes(req.toLowerCase()))
    );
    const missingSkills = requiredSkills.filter(req => 
      !currentSkills.some(skill => req.toLowerCase().includes(skill.toLowerCase()) || 
                                    skill.toLowerCase().includes(req.toLowerCase()))
    );

    const matchScore = Math.round((matchedSkills.length / requiredSkills.length) * 100);

    const analysis = {
      matchedSkills,
      missingSkills,
      recommendations: [
        'Add Docker and Kubernetes to your skillset',
        'Build a project showcasing GraphQL APIs',
        'Highlight your React experience with concrete metrics'
      ],
      strengths: [
        'Strong frontend development background',
        'Good understanding of modern JavaScript',
        'Experience with version control'
      ],
      profileCompleteness: {
        skills: currentSkills.length > 0 ? 100 : 0,
        linkedin: linkedinUrl ? 100 : 0,
        resume: resumeText ? 100 : 0,
        overall: Math.round(
          ((currentSkills.length > 0 ? 100 : 0) + 
           (linkedinUrl ? 100 : 0) + 
           (resumeText ? 100 : 0)) / 3
        )
      }
    };

    setProfileMatchScore(matchScore);
    setProfileAnalysis(analysis);
    
    // Generate shareable URL
    const profileId = `profile_${Date.now()}`;
    setShareableProfileUrl(`https://skillbridge.ai/profile-match/${profileId}`);
    
    setAnalyzingProfile(false);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            🎯 AI-Powered Job Matcher
          </CardTitle>
          <CardDescription>
            Find jobs that match your skills from real job boards. Connect your LinkedIn or paste your resume for personalized matches.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Skills Display */}
          {currentSkills.length > 0 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Your Current Skills:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentSkills.map((skill, idx) => (
                  <Badge key={idx} variant="outline" className="bg-white dark:bg-gray-900">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* LinkedIn URL */}
          <div>
            <label htmlFor="linkedin" className="text-sm font-medium mb-2 block">
              LinkedIn Profile (Optional)
            </label>
            <Input
              id="linkedin"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
              className="mb-2"
            />
            <p className="text-xs text-muted-foreground">
              We'll analyze your profile to find better matches
            </p>
          </div>

          {/* Resume Upload/Paste */}
          <div>
            <label htmlFor="resume" className="text-sm font-medium mb-2 block">
              Resume / Experience (Optional)
            </label>
            <Textarea
              id="resume"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume or describe your experience here..."
              className="h-32"
            />
            <div className="flex items-center gap-2 mt-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload PDF/DOCX
              </Button>
              <span className="text-xs text-muted-foreground">
                Or paste text above
              </span>
            </div>
          </div>

          {/* Search Button */}
          <Button
            onClick={findJobs}
            disabled={searching}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="lg"
          >
            {searching ? (
              <>
                <Search className="h-5 w-5 mr-2 animate-spin" />
                Searching Job Boards...
              </>
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                Find Matching Jobs
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Searches: Indeed, LinkedIn Jobs, Glassdoor, RemoteOK, and more
          </p>
        </CardContent>
      </Card>

      {/* Profile Matcher - Check Match Against Specific Job */}
      <Card className="border-2 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-purple-600" />
            📊 Profile Matcher - Check Your Match Score
          </CardTitle>
          <CardDescription>
            Paste a job description to see how well you match. Share your profile match score with recruiters!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Job Description Input */}
          <div>
            <label htmlFor="job-description" className="text-sm font-medium mb-2 block">
              Job Description or Requirements
            </label>
            <Textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here... (e.g., We're looking for a Senior Full-Stack Developer with React, TypeScript, Node.js...)"
              className="h-32"
            />
          </div>

          {/* Analyze Button */}
          <Button
            onClick={analyzeProfileMatch}
            disabled={analyzingProfile || !jobDescription.trim() || currentSkills.length === 0}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            size="lg"
          >
            {analyzingProfile ? (
              <>
                <Search className="h-5 w-5 mr-2 animate-spin" />
                Analyzing Your Match...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Analyze My Profile Match
              </>
            )}
          </Button>

          {currentSkills.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please complete the <strong>Skill Analysis</strong> tab first to analyze your profile match.
              </AlertDescription>
            </Alert>
          )}

          {/* Match Score Results */}
          {profileMatchScore !== null && profileAnalysis && (
            <div className="space-y-4 pt-4 border-t">
              {/* Match Score Display */}
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Your Match Score</h3>
                  <p className="text-sm text-muted-foreground">Based on skills, experience, and requirements</p>
                </div>
                <div className="text-center">
                  <div className={`text-5xl font-bold ${getMatchScoreColor(profileMatchScore)}`}>
                    {profileMatchScore}%
                  </div>
                  <Badge className={profileMatchScore >= 70 ? 'bg-green-600' : 'bg-yellow-600'}>
                    {profileMatchScore >= 85 ? 'Excellent Match' : 
                     profileMatchScore >= 70 ? 'Good Match' : 
                     profileMatchScore >= 50 ? 'Fair Match' : 'Needs Work'}
                  </Badge>
                </div>
              </div>

              {/* Profile Completeness */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Progress value={profileAnalysis.profileCompleteness.skills} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">Skills Analyzed</p>
                </div>
                <div className="text-center">
                  <Progress value={profileAnalysis.profileCompleteness.linkedin} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">LinkedIn Connected</p>
                </div>
                <div className="text-center">
                  <Progress value={profileAnalysis.profileCompleteness.resume} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">Resume Added</p>
                </div>
                <div className="text-center">
                  <Progress value={profileAnalysis.profileCompleteness.overall} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground font-medium">Overall Profile</p>
                </div>
              </div>

              {/* Matched vs Missing Skills */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                  <p className="text-sm font-medium mb-2 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Your Matching Skills ({profileAnalysis.matchedSkills.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {profileAnalysis.matchedSkills.map((skill: string, idx: number) => (
                      <Badge key={idx} className="bg-green-600 text-white">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg bg-orange-50 dark:bg-orange-950">
                  <p className="text-sm font-medium mb-2 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    Skills to Learn ({profileAnalysis.missingSkills.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {profileAnalysis.missingSkills.map((skill: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="border-orange-300">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Strengths and Recommendations */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    Your Strengths
                  </h4>
                  <ul className="text-sm space-y-1">
                    {profileAnalysis.strengths.map((strength: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-1">
                    <Lightbulb className="h-4 w-4 text-purple-600" />
                    Recommendations
                  </h4>
                  <ul className="text-sm space-y-1">
                    {profileAnalysis.recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-purple-600 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Share Profile */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-blue-600" />
                  Share Your Profile Match with Recruiters
                </h4>
                <div className="flex gap-2">
                  <Input 
                    value={shareableProfileUrl} 
                    readOnly 
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(shareableProfileUrl);
                      alert('Link copied to clipboard!');
                    }}
                  >
                    Copy Link
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(`mailto:?subject=My Profile Match&body=Check out my profile match score: ${shareableProfileUrl}`, '_blank')}
                  >
                    Email
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  ✨ Recruiters can view your match score, skills, and recommendations through this link
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Recommendations */}
      {showResults && roleRecommendations.length > 0 && (
        <Card className="border-2 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Recommended Roles for You
            </CardTitle>
            <CardDescription>
              Based on your skills, here are the best role matches
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {roleRecommendations.map((role, idx) => (
              <div key={idx} className="p-4 border rounded-lg hover:border-purple-400 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{role.title}</h3>
                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {role.averageSalary}
                      </span>
                      <Badge className={getDemandColor(role.demandLevel)}>
                        {role.demandLevel} Demand
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getMatchScoreColor(role.matchScore)}`}>
                      {role.matchScore}%
                    </div>
                    <span className="text-xs text-muted-foreground">Match</span>
                  </div>
                </div>

                <p className="text-sm mb-3">{role.reasoning}</p>

                <div>
                  <p className="text-xs font-medium mb-2">Key Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {role.skills.map((skill, skillIdx) => (
                      <Badge key={skillIdx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Job Matches */}
      {showResults && jobMatches.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Found {jobMatches.length} Matching Jobs
            </h3>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Export Results
            </Button>
          </div>

          {jobMatches.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <Badge className={`
                        ${job.matchScore >= 85 ? 'bg-green-600' : 
                          job.matchScore >= 70 ? 'bg-yellow-600' : 'bg-red-600'}
                      `}>
                        {job.matchScore}% Match
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {job.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {job.posted}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <span className="flex items-center gap-1 font-semibold text-green-600">
                        <DollarSign className="h-4 w-4" />
                        {job.salary}
                      </span>
                      <Badge variant="outline">{job.type}</Badge>
                      <Badge variant="outline">{job.seniority}</Badge>
                    </div>
                  </div>

                  <Progress 
                    value={job.matchScore} 
                    className={`w-24 h-24 rounded-full ${
                      job.matchScore >= 85 ? '[&>div]:bg-green-600' : 
                      job.matchScore >= 70 ? '[&>div]:bg-yellow-600' : '[&>div]:bg-red-600'
                    }`}
                  />
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {job.description}
                </p>

                {/* Skills Match */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs font-medium mb-2 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Your Matching Skills ({job.matchedSkills.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {job.matchedSkills.map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-green-100 dark:bg-green-900">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium mb-2 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 text-orange-600" />
                      Skills to Learn ({job.missingSkills.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {job.missingSkills.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-orange-300">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex-1" asChild>
                    <a href={job.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Job
                    </a>
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Save Job
                  </Button>
                  <Button variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Learn Missing Skills
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Summary Card */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">💡 Next Steps</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Apply to jobs with 85%+ match score first</li>
                    <li>• Learn the "missing skills" to increase your match scores</li>
                    <li>• Save jobs you're interested in for later</li>
                    <li>• Update your LinkedIn profile to get better matches</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!showResults && !searching && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ready to find your next role?</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
              Click "Find Matching Jobs" above to search thousands of positions from top job boards.
              We'll match you based on your skills and show you exactly what you need to learn.
            </p>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <span>✓ Real-time job data</span>
              <span>✓ Skill gap analysis</span>
              <span>✓ Salary insights</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

