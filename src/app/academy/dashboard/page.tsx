'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trophy, BookOpen, Award, TrendingUp, Clock, Target, Flame, Star, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function AcademyDashboardPage() {
  const router = useRouter();
  // Mock data - will be replaced with real data from Supabase
  const currentStreak = 15;
  const totalPoints = 2450;
  const weeklyRank = 23;

  const handleBackClick = () => {
    router.push('/academy');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" onClick={handleBackClick}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Academy
          </Button>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Learning Dashboard</h1>
        <p className="text-gray-600">Welcome back! Keep up the great progress.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Streak</p>
                <p className="text-3xl font-bold text-orange-600">{currentStreak}</p>
                <p className="text-xs text-gray-500">days</p>
              </div>
              <Flame className="h-12 w-12 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Points</p>
                <p className="text-3xl font-bold text-blue-600">{totalPoints.toLocaleString()}</p>
                <p className="text-xs text-gray-500">earned</p>
              </div>
              <Star className="h-12 w-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Weekly Rank</p>
                <p className="text-3xl font-bold text-green-600">#{weeklyRank}</p>
                <p className="text-xs text-gray-500">leaderboard</p>
              </div>
              <Trophy className="h-12 w-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Hours Learned</p>
                <p className="text-3xl font-bold text-purple-600">24.5</p>
                <p className="text-xs text-gray-500">this month</p>
              </div>
              <Clock className="h-12 w-12 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Current Learning */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Learning */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Continue Learning
              </CardTitle>
              <CardDescription>Pick up where you left off</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Course 1 */}
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">Foundation Belt</h3>
                    <p className="text-sm text-gray-600">Module 3: Lean Fundamentals</p>
                  </div>
                  <Badge variant="outline" className="bg-blue-50">In Progress</Badge>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">12/30 lessons</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
                <div className="flex gap-3">
                  <Link href="/academy/lesson/value-stream-mapping-basics" className="flex-1">
                    <Button className="w-full">
                      Continue Lesson
                    </Button>
                  </Link>
                  <Link href="/academy/course/foundation-belt">
                    <Button variant="outline">View All</Button>
                  </Link>
                </div>
              </div>

              {/* Course 2 */}
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">Basic Statistics</h3>
                    <p className="text-sm text-gray-600">Next: Introduction to Hypothesis Testing</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50">75% Complete</Badge>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">9/12 lessons</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="flex gap-3">
                  <Link href="/academy/lesson/hypothesis-testing-intro" className="flex-1">
                    <Button className="w-full">
                      Start Next Lesson
                    </Button>
                  </Link>
                  <Link href="/academy/course/basic-statistics">
                    <Button variant="outline">View All</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Assessments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Upcoming Assessments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <p className="font-semibold">Lean Fundamentals Quiz</p>
                  <p className="text-sm text-gray-600">Module 3 Assessment • 15 questions</p>
                </div>
                <Link href="/academy/assessment/lean-fundamentals-quiz">
                  <Button size="sm">Take Quiz</Button>
                </Link>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="font-semibold">A3 Problem Solving Project</p>
                  <p className="text-sm text-gray-600">Capstone Project • Due in 5 days</p>
                </div>
                <Link href="/academy/project/a3-problem-solving">
                  <Button size="sm" variant="outline">View Details</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-full p-2">
                    <Award className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Earned Badge: 5S Specialist</p>
                    <p className="text-sm text-gray-600">Completed 5S Audit with 95% score</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Completed Lesson</p>
                    <p className="text-sm text-gray-600">Value Stream Mapping Basics</p>
                    <p className="text-xs text-gray-500">Yesterday</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 rounded-full p-2">
                    <Star className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Reached Level 5</p>
                    <p className="text-sm text-gray-600">Earned 100 XP this week</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Progress & Badges */}
        <div className="space-y-6">
          {/* Overall Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Path Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Foundation Belt</span>
                  <span className="text-sm text-gray-600">40%</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Practitioner Belt</span>
                  <span className="text-sm text-gray-600">0%</span>
                </div>
                <Progress value={0} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Complete Foundation Belt first</p>
              </div>
            </CardContent>
          </Card>

          {/* Earned Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Earned Badges</span>
                <Link href="/academy/badges">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                    <Trophy className="h-8 w-8 text-yellow-600" />
                  </div>
                  <p className="text-xs font-medium">First Steps</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-xs font-medium">Bookworm</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-xs font-medium">5S Specialist</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                    <Flame className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="text-xs font-medium">7 Day Streak</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                    <Target className="h-8 w-8 text-orange-600" />
                  </div>
                  <p className="text-xs font-medium">Goal Crusher</p>
                </div>
                <div className="text-center opacity-40">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <p className="text-xs font-medium">Locked</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Goal */}
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Goal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Learning Time</span>
                  <span className="text-sm font-medium">25 / 30 min</span>
                </div>
                <Progress value={83} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Lessons Completed</span>
                  <span className="text-sm font-medium">1 / 2</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>

              <p className="text-xs text-gray-600 text-center mt-4">
                🎯 Complete one more lesson to reach your daily goal!
              </p>
            </CardContent>
          </Card>

          {/* Study Group Invitation */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="text-lg">Join a Study Group</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Learn faster with peers. Join or create a study group to collaborate and stay motivated.
              </p>
              <Link href="/academy/study-groups">
                <Button className="w-full" variant="outline">
                  Browse Groups
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
