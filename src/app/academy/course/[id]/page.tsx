'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  PlayCircle, CheckCircle2, Lock, Clock, BookOpen, Award, 
  FileText, Target, TrendingUp, MessageSquare, ChevronRight, ArrowLeft 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// PLACEHOLDER DATA - Will be replaced with Supabase queries
const getCourseData = (id: string) => {
  return {
    id: id,
    title: 'Introduction to DMAIC',
    description: 'Learn the structured problem-solving framework used in Six Sigma. Master each phase of DMAIC with hands-on examples and real-world case studies.',
    difficulty: 'beginner',
    estimatedHours: 8,
    instructor: 'Dr. Sarah Chen',
    learningPath: 'Foundation Belt',
    progress: 45,
    isEnrolled: true,
    completedLessons: 7,
    totalLessons: 12,
    nextLesson: {
      id: '3',
      title: 'Measure Phase Deep Dive',
      duration: 25
    },
    objectives: [
      'Understand each phase of the DMAIC methodology',
      'Apply DMAIC to real-world problems',
      'Create project charters and SIPOC diagrams',
      'Collect and analyze process data',
      'Implement and control improvements'
    ],
    lessons: [
      {
        id: '1',
        title: 'What is DMAIC?',
        type: 'video',
        duration: 15,
        completed: true,
        locked: false,
        description: 'Introduction to the DMAIC framework and its importance in Six Sigma'
      },
      {
        id: '2',
        title: 'Define Phase Overview',
        type: 'video',
        duration: 20,
        completed: true,
        locked: false,
        description: 'Learn how to properly define problems and create project charters'
      },
      {
        id: '3',
        title: 'Measure Phase Deep Dive',
        type: 'video',
        duration: 25,
        completed: false,
        locked: false,
        description: 'Data collection strategies and measurement system analysis'
      },
      {
        id: '4',
        title: 'Quiz: Define & Measure',
        type: 'quiz',
        duration: 15,
        completed: false,
        locked: false,
        description: 'Test your understanding of the first two DMAIC phases'
      },
      {
        id: '5',
        title: 'Analyze Phase Tools',
        type: 'video',
        duration: 30,
        completed: false,
        locked: false,
        description: 'Root cause analysis techniques and statistical analysis methods'
      },
      {
        id: '6',
        title: 'Practical Exercise: Root Cause Analysis',
        type: 'exercise',
        duration: 45,
        completed: false,
        locked: false,
        description: 'Apply 5 Whys and Fishbone diagrams to a real scenario'
      },
      {
        id: '7',
        title: 'Improve Phase Strategies',
        type: 'video',
        duration: 25,
        completed: false,
        locked: true,
        description: 'Solution generation and pilot testing'
      },
      {
        id: '8',
        title: 'Control Phase Best Practices',
        type: 'video',
        duration: 20,
        completed: false,
        locked: true,
        description: 'Creating control plans and sustaining improvements'
      },
      {
        id: '9',
        title: 'Case Study: Manufacturing DMAIC Project',
        type: 'reading',
        duration: 30,
        completed: false,
        locked: true,
        description: 'Complete case study from problem to solution'
      },
      {
        id: '10',
        title: 'Quiz: Analyze, Improve, Control',
        type: 'quiz',
        duration: 15,
        completed: false,
        locked: true,
        description: 'Test your knowledge of the final DMAIC phases'
      },
      {
        id: '11',
        title: 'Final Project: Your DMAIC Analysis',
        type: 'project',
        duration: 120,
        completed: false,
        locked: true,
        description: 'Apply DMAIC to a real problem from your workplace'
      },
      {
        id: '12',
        title: 'Course Completion Assessment',
        type: 'assessment',
        duration: 45,
        completed: false,
        locked: true,
        description: 'Comprehensive assessment covering all DMAIC phases'
      }
    ]
  };
};

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const course = getCourseData(courseId);

  const handleBackClick = () => {
    router.push('/academy/paths');
  };

  const getLessonIcon = (type: string, completed: boolean) => {
    if (completed) return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    
    switch (type) {
      case 'video':
        return <PlayCircle className="h-5 w-5 text-blue-600" />;
      case 'quiz':
      case 'assessment':
        return <FileText className="h-5 w-5 text-purple-600" />;
      case 'exercise':
      case 'project':
        return <Target className="h-5 w-5 text-orange-600" />;
      case 'reading':
        return <BookOpen className="h-5 w-5 text-teal-600" />;
      default:
        return <PlayCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-blue-100 text-blue-800';
      case 'quiz':
      case 'assessment':
        return 'bg-purple-100 text-purple-800';
      case 'exercise':
      case 'project':
        return 'bg-orange-100 text-orange-800';
      case 'reading':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Paths
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/academy" className="hover:text-blue-600">Academy</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/academy/paths" className="hover:text-blue-600">Learning Paths</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/academy/path/foundation" className="hover:text-blue-600">{course.learningPath}</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900">{course.title}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Course Info */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
              <p className="text-lg text-gray-600 mb-4">{course.description}</p>
              
              <div className="flex flex-wrap gap-3 mb-4">
                <Badge className={getDifficultyColor(course.difficulty)}>
                  {course.difficulty}
                </Badge>
                <Badge variant="outline">
                  <Clock className="h-4 w-4 mr-1" />
                  {course.estimatedHours} hours
                </Badge>
                <Badge variant="outline">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {course.totalLessons} lessons
                </Badge>
                <Badge variant="outline">
                  <Award className="h-4 w-4 mr-1" />
                  {course.instructor}
                </Badge>
              </div>

              {/* Progress */}
              {course.isEnrolled && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-blue-900">Your Progress</span>
                    <span className="text-blue-700 font-semibold">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2 mb-2" />
                  <p className="text-sm text-blue-700">
                    {course.completedLessons} of {course.totalLessons} lessons completed
                  </p>
                </div>
              )}
            </div>

            {/* Right: Quick Actions */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {course.isEnrolled ? (
                    <>
                      <Link href={`/academy/lesson/${course.nextLesson.id}`}>
                        <Button className="w-full" size="lg">
                          <PlayCircle className="mr-2 h-5 w-5" />
                          Continue Learning
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Discussion Forum
                      </Button>
                      <Button variant="outline" className="w-full">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        View Progress
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button className="w-full" size="lg">
                        Enroll in Course
                      </Button>
                      <p className="text-sm text-gray-600 text-center">
                        Free • Certificate upon completion
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="lessons" className="w-full">
          <TabsList>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Lessons Tab */}
          <TabsContent value="lessons" className="mt-6">
            <div className="space-y-3">
              {course.lessons.map((lesson, index) => (
                <Card 
                  key={lesson.id}
                  className={`${
                    lesson.locked 
                      ? 'opacity-60 bg-gray-50' 
                      : lesson.completed 
                      ? 'border-green-200 bg-green-50' 
                      : 'hover:shadow-md transition-shadow cursor-pointer'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {lesson.locked ? (
                          <Lock className="h-5 w-5 text-gray-400" />
                        ) : (
                          getLessonIcon(lesson.type, lesson.completed)
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="text-sm text-gray-500 mb-1">
                              Lesson {index + 1}
                            </div>
                            <h3 className="text-lg font-semibold">{lesson.title}</h3>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={getTypeColor(lesson.type)}>
                              {lesson.type}
                            </Badge>
                            <span className="text-sm text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {lesson.duration} min
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{lesson.description}</p>
                        
                        {lesson.completed && (
                          <Badge variant="outline" className="border-green-600 text-green-700">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                      
                      <div>
                        <Link href={`/academy/lesson/${lesson.id}`}>
                          <Button 
                            variant={lesson.completed ? 'outline' : 'default'}
                            disabled={lesson.locked}
                            size="sm"
                          >
                            {lesson.locked ? (
                              <>
                                <Lock className="mr-2 h-4 w-4" />
                                Locked
                              </>
                            ) : lesson.completed ? (
                              'Review'
                            ) : (
                              'Start'
                            )}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Objectives</CardTitle>
                  <CardDescription>
                    By the end of this course, you will be able to:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {course.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Course Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <PlayCircle className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Video Lessons</span>
                      </div>
                      <span className="text-sm font-semibold">
                        {course.lessons.filter(l => l.type === 'video').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-purple-600" />
                        <span className="font-medium">Quizzes</span>
                      </div>
                      <span className="text-sm font-semibold">
                        {course.lessons.filter(l => l.type === 'quiz' || l.type === 'assessment').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Target className="h-5 w-5 text-orange-600" />
                        <span className="font-medium">Practical Exercises</span>
                      </div>
                      <span className="text-sm font-semibold">
                        {course.lessons.filter(l => l.type === 'exercise' || l.type === 'project').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-teal-600" />
                        <span className="font-medium">Reading Materials</span>
                      </div>
                      <span className="text-sm font-semibold">
                        {course.lessons.filter(l => l.type === 'reading').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>About the Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    SC
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">{course.instructor}</h4>
                    <p className="text-gray-600 mb-2">
                      [PLACEHOLDER] Six Sigma Master Black Belt with 15+ years experience 
                      in manufacturing and process improvement. Former quality director at Fortune 500 companies.
                    </p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>50+ Courses</span>
                      <span>•</span>
                      <span>10,000+ Students</span>
                      <span>•</span>
                      <span>4.8 Rating</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Resources</CardTitle>
                <CardDescription>
                  Downloadable materials to support your learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">[PLACEHOLDER] DMAIC Template</p>
                        <p className="text-sm text-gray-500">PowerPoint • 2.5 MB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Download</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">[PLACEHOLDER] Project Charter Template</p>
                        <p className="text-sm text-gray-500">Word • 150 KB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Download</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">[PLACEHOLDER] DMAIC Quick Reference Guide</p>
                        <p className="text-sm text-gray-500">PDF • 850 KB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Download</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
