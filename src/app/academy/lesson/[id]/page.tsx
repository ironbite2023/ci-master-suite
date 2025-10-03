'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ChevronLeft, ChevronRight, Check, BookOpen, FileText, 
  Download, Play, Pause, Volume2, Maximize, Settings 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

// PLACEHOLDER DATA - Will be replaced with Supabase queries and real video URLs
const getLessonData = (id: string) => {
  return {
    id: id,
    title: 'Measure Phase Deep Dive',
    courseId: '1',
    courseName: 'Introduction to DMAIC',
    pathName: 'Foundation Belt',
    type: 'video',
    duration: 25, // minutes
    completed: false,
    progress: 0, // percentage watched
    // PLACEHOLDER - You'll replace this with your real video URL
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Sample video
    transcript: `[PLACEHOLDER TRANSCRIPT]

Welcome to the Measure Phase Deep Dive. In this lesson, we'll explore 
the critical second phase of the DMAIC methodology.

The Measure phase is all about collecting data to establish a baseline
and understand the current state of your process.

Key objectives of the Measure phase:
1. Develop a data collection plan
2. Collect baseline data
3. Assess the measurement system
4. Calculate process capability

Let's start with data collection planning...

[Your real transcript will replace this placeholder]
`,
    description: 'Learn data collection strategies, measurement system analysis, and how to establish process baselines using statistical methods.',
    objectives: [
      'Create a comprehensive data collection plan',
      'Understand different types of data and sampling methods',
      'Perform measurement system analysis (MSA)',
      'Calculate process capability indices (Cp, Cpk)'
    ],
    resources: [
      {
        id: '1',
        title: '[PLACEHOLDER] Data Collection Template',
        type: 'Excel',
        size: '125 KB',
        url: '#'
      },
      {
        id: '2',
        title: '[PLACEHOLDER] MSA Calculator',
        type: 'Excel',
        size: '280 KB',
        url: '#'
      },
      {
        id: '3',
        title: '[PLACEHOLDER] Measure Phase Checklist',
        type: 'PDF',
        size: '95 KB',
        url: '#'
      }
    ],
    previousLesson: {
      id: '2',
      title: 'Define Phase Overview'
    },
    nextLesson: {
      id: '4',
      title: 'Quiz: Define & Measure'
    }
  };
};

export default function LessonPage() {
  const params = useParams();
  const lessonId = params.id as string;
  const lesson = getLessonData(lessonId);
  
  const [videoProgress] = useState(lesson.progress);
  const [isPlaying] = useState(false);
  const [notes, setNotes] = useState('');
  const [completed, setCompleted] = useState(lesson.completed);

  const handleMarkComplete = () => {
    setCompleted(true);
    // TODO: Save to database
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/academy/course/${lesson.courseId}`}>
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back to Course
                </Button>
              </Link>
              <div className="hidden md:block">
                <div className="text-xs text-gray-500">{lesson.pathName} → {lesson.courseName}</div>
                <div className="font-semibold">{lesson.title}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Progress value={videoProgress} className="w-32 h-2" />
              <span className="text-sm text-gray-600">{Math.round(videoProgress)}%</span>
              {!completed && (
                <Button onClick={handleMarkComplete} size="sm">
                  <Check className="mr-2 h-4 w-4" />
                  Mark Complete
                </Button>
              )}
              {completed && (
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <Check className="h-5 w-5" />
                  <span>Completed</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Video Player */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <Card>
              <CardContent className="p-0">
                <div className="relative bg-black aspect-video">
                  {/* PLACEHOLDER VIDEO PLAYER - Replace with your video hosting solution */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-900">
                    <div className="text-center text-white space-y-4">
                      <Play className="h-20 w-20 mx-auto opacity-80" />
                      <div>
                        <p className="text-2xl font-bold">Video Player Placeholder</p>
                        <p className="text-sm text-blue-200 mt-2">
                          [PLACEHOLDER] Your video will appear here
                        </p>
                        <p className="text-xs text-blue-300 mt-1">
                          Supported: YouTube, Vimeo, Wistia, Custom MP4
                        </p>
                      </div>
                      <div className="flex gap-3 justify-center items-center text-sm">
                        <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/20">
                          <Play className="mr-2 h-4 w-4" />
                          Play Demo
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Video Controls (Placeholder) */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="space-y-2">
                      <div className="h-1 bg-gray-600 rounded-full">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${videoProgress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-white text-sm">
                        <div className="flex items-center gap-3">
                          <button className="hover:text-blue-400">
                            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                          </button>
                          <button className="hover:text-blue-400">
                            <Volume2 className="h-5 w-5" />
                          </button>
                          <span>0:00 / {lesson.duration}:00</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="hover:text-blue-400">
                            <Settings className="h-5 w-5" />
                          </button>
                          <button className="hover:text-blue-400">
                            <Maximize className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lesson Info */}
            <Card>
              <CardHeader>
                <CardTitle>{lesson.title}</CardTitle>
                <CardDescription>{lesson.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Learning Objectives</h4>
                    <ul className="space-y-2">
                      {lesson.objectives.map((objective, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Transcript, Notes, Resources */}
            <Tabs defaultValue="transcript">
              <TabsList>
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
                <TabsTrigger value="notes">My Notes</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>

              <TabsContent value="transcript" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Video Transcript</CardTitle>
                    <CardDescription>
                      Full transcript of the video lesson
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                        {lesson.transcript}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Notes</CardTitle>
                    <CardDescription>
                      Take notes as you watch. Your notes are private and saved automatically.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      placeholder="Write your notes here..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={10}
                      className="w-full"
                    />
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Last saved: Just now
                      </span>
                      <Button size="sm">Save Notes</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Downloadable Resources</CardTitle>
                    <CardDescription>
                      Templates and materials for this lesson
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {lesson.resources.map((resource) => (
                        <div 
                          key={resource.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium">{resource.title}</p>
                              <p className="text-sm text-gray-500">
                                {resource.type} • {resource.size}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Navigation & Info */}
          <div className="space-y-6">
            {/* Navigation */}
            <Card>
              <CardHeader>
                <CardTitle>Lesson Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {lesson.previousLesson && (
                  <Link href={`/academy/lesson/${lesson.previousLesson.id}`}>
                    <Button variant="outline" className="w-full justify-start">
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous: {lesson.previousLesson.title}
                    </Button>
                  </Link>
                )}
                {lesson.nextLesson && (
                  <Link href={`/academy/lesson/${lesson.nextLesson.id}`}>
                    <Button className="w-full justify-start">
                      Next: {lesson.nextLesson.title}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Link href={`/academy/course/${lesson.courseId}`}>
                  <Button variant="ghost" className="w-full justify-start">
                    <BookOpen className="mr-2 h-4 w-4" />
                    View All Lessons
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Lesson Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold">{lesson.duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="font-semibold capitalize">{lesson.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Resources</span>
                    <span className="font-semibold">{lesson.resources.length} files</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`font-semibold ${completed ? 'text-green-600' : 'text-orange-600'}`}>
                      {completed ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-800 mb-3">
                  Having trouble with this lesson? Get support from instructors and peers.
                </p>
                <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-100">
                  Ask a Question
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
