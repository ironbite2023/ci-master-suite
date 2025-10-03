'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Award, Clock, Target, CheckCircle2, Lock, PlayCircle, FileText, 
  Trophy, Users, TrendingUp, BookOpen, ChevronRight, ArrowLeft 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data - will be replaced with Supabase queries based on slug
const pathData = {
  id: '2',
  name: 'Practitioner Path',
  slug: 'practitioner',
  description: 'Develop practical skills to lead CI projects. Learn advanced Lean tools, data analysis, and project management techniques to drive measurable improvements.',
  beltLevel: 2,
  beltName: 'Yellow Belt',
  estimatedHours: 80,
  isEnrolled: true,
  progress: 45,
  enrolledCount: 1823,
  completionRate: 78,
  avgRating: 4.7,
  prerequisites: ['Foundation Path (White Belt)'],
  skills: [
    'Process Mapping',
    'Root Cause Analysis',
    'Statistical Basics',
    'DMAIC Methodology',
    'Project Charter Development',
    '5 Whys & Fishbone',
    'Lean Principles',
    'Data Collection',
  ],
  outcomes: [
    'Lead small to medium-sized improvement projects',
    'Identify and eliminate waste in processes',
    'Collect and analyze data for decision making',
    'Present findings to stakeholders',
    'Coach team members on CI tools',
  ],
};

const courses = [
  {
    id: '1',
    title: 'Introduction to DMAIC',
    description: 'Learn the structured problem-solving framework used in Six Sigma',
    sequence: 1,
    estimatedHours: 8,
    lessonsCount: 12,
    progress: 100,
    status: 'completed',
    difficulty: 'beginner',
  },
  {
    id: '2',
    title: 'Statistical Process Control Fundamentals',
    description: 'Master control charts and statistical process monitoring',
    sequence: 2,
    estimatedHours: 10,
    lessonsCount: 15,
    progress: 80,
    status: 'in-progress',
    difficulty: 'intermediate',
  },
  {
    id: '3',
    title: 'Root Cause Analysis Techniques',
    description: 'Deep dive into 5 Whys, Fishbone diagrams, and other RCA tools',
    sequence: 3,
    estimatedHours: 6,
    lessonsCount: 10,
    progress: 30,
    status: 'in-progress',
    difficulty: 'beginner',
  },
  {
    id: '4',
    title: 'Process Capability Analysis',
    description: 'Understand Cp, Cpk, and process capability studies',
    sequence: 4,
    estimatedHours: 8,
    lessonsCount: 12,
    progress: 0,
    status: 'locked',
    difficulty: 'intermediate',
  },
  {
    id: '5',
    title: 'Value Stream Mapping Advanced',
    description: 'Create detailed current and future state maps',
    sequence: 5,
    estimatedHours: 10,
    lessonsCount: 14,
    progress: 0,
    status: 'locked',
    difficulty: 'intermediate',
  },
  {
    id: '6',
    title: 'Hypothesis Testing Basics',
    description: 'Learn t-tests, ANOVA, and chi-square tests',
    sequence: 6,
    estimatedHours: 12,
    lessonsCount: 16,
    progress: 0,
    status: 'locked',
    difficulty: 'advanced',
  },
];

export default function LearningPathDetailPage() {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/academy/paths');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <PlayCircle className="h-5 w-5 text-blue-600" />;
      case 'locked':
        return <Lock className="h-5 w-5 text-gray-400" />;
      default:
        return <BookOpen className="h-5 w-5 text-gray-400" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBackClick}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Paths
            </Button>
            <div className="flex items-center gap-2 text-blue-100">
              <Link href="/academy/paths" className="hover:underline">
                Learning Paths
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white">{pathData.name}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Main Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <Award className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">{pathData.name}</h1>
                  <Badge className="mt-2 bg-yellow-100 text-yellow-800 border-yellow-300">
                    {pathData.beltName}
                  </Badge>
                </div>
              </div>
              
              <p className="text-xl text-blue-50 mb-6">
                {pathData.description}
              </p>

              {/* Progress */}
              {pathData.isEnrolled && (
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Your Progress</span>
                    <span className="font-semibold">{pathData.progress}%</span>
                  </div>
                  <Progress value={pathData.progress} className="h-2 bg-white/20" />
                  <p className="text-sm text-blue-100 mt-2">
                    Keep it up! You&apos;re making great progress.
                  </p>
                </div>
              )}
            </div>

            {/* Right: Stats Card */}
            <div className="bg-white text-gray-900 rounded-lg p-6 shadow-xl">
              <h3 className="font-semibold mb-4">Path Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-semibold">{pathData.estimatedHours} hours</div>
                    <div className="text-sm text-gray-500">Total duration</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-semibold">{courses.length} courses</div>
                    <div className="text-sm text-gray-500">Structured curriculum</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-semibold">{pathData.enrolledCount.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Students enrolled</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-semibold">{pathData.completionRate}%</div>
                    <div className="text-sm text-gray-500">Completion rate</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                {pathData.isEnrolled ? (
                  <Button className="w-full" size="lg">
                    Continue Learning
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                ) : (
                  <Button className="w-full" size="lg">
                    Enroll Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="curriculum" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="outcomes">Learning Outcomes</TabsTrigger>
          </TabsList>

          {/* Curriculum Tab */}
          <TabsContent value="curriculum">
            <div className="space-y-4">
              {courses.map((course) => (
                <Card 
                  key={course.id}
                  className={`${
                    course.status === 'locked' 
                      ? 'opacity-60 bg-gray-50' 
                      : 'hover:shadow-md transition-shadow'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(course.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="text-sm text-gray-500 mb-1">
                              Course {course.sequence}
                            </div>
                            <CardTitle className="text-xl">{course.title}</CardTitle>
                          </div>
                          <Badge className={getDifficultyColor(course.difficulty)}>
                            {course.difficulty}
                          </Badge>
                        </div>
                        <CardDescription className="text-base mb-3">
                          {course.description}
                        </CardDescription>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {course.estimatedHours}h
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {course.lessonsCount} lessons
                          </span>
                        </div>

                        {course.status !== 'locked' && course.progress > 0 && (
                          <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-semibold">{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                      <div>
                        <Link href={`/academy/course/${course.id}`}>
                          <Button 
                            variant={course.status === 'locked' ? 'ghost' : 'outline'}
                            disabled={course.status === 'locked'}
                          >
                            {course.status === 'locked' && <Lock className="mr-2 h-4 w-4" />}
                            {course.status === 'locked' 
                              ? 'Locked' 
                              : course.status === 'completed' 
                              ? 'Review' 
                              : 'Start'}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* Final Assessment */}
            <Card className="mt-6 border-2 border-yellow-200 bg-yellow-50">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-200 rounded-lg">
                    <FileText className="h-6 w-6 text-yellow-700" />
                  </div>
                  <div className="flex-1">
                    <CardTitle>Yellow Belt Certification Exam</CardTitle>
                    <CardDescription>
                      Complete all courses to unlock the final certification assessment
                    </CardDescription>
                  </div>
                  <Button disabled>
                    <Lock className="mr-2 h-4 w-4" />
                    Locked
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Prerequisites</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {pathData.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span>{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills You&apos;ll Gain</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {pathData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Learning Outcomes Tab */}
          <TabsContent value="outcomes">
            <Card>
              <CardHeader>
                <CardTitle>What You&apos;ll Be Able To Do</CardTitle>
                <CardDescription>
                  Upon completing this learning path, you will have the skills to:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {pathData.outcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-lg">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

