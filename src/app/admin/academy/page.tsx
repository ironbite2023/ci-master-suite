'use client';

import React from 'react';
import Link from 'next/link';
import { 
  BookOpen, Users, TrendingUp, Plus, 
  Video, FileText, Award, MessageSquare 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AcademyAdminDashboard() {
  // PLACEHOLDER DATA - Will be replaced with real Supabase queries
  const stats = {
    totalCourses: 15,
    totalLessons: 187,
    totalStudents: 1234,
    totalCertificates: 456,
    pendingReviews: 23,
    activeThreads: 67
  };

  const recentActivity = [
    {
      id: '1',
      type: 'course_created',
      title: 'New course "Advanced SPC" created',
      user: 'Admin',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'student_enrolled',
      title: '5 new students enrolled in Foundation Belt',
      user: 'System',
      timestamp: '4 hours ago'
    },
    {
      id: '3',
      type: 'certificate_issued',
      title: 'Certificate issued to John Doe',
      user: 'System',
      timestamp: '1 day ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Academy Admin</h1>
              <p className="text-gray-600 mt-1">Manage courses, content, and students</p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">
                Back to Main Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">Across all learning paths</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLessons}</div>
              <p className="text-xs text-muted-foreground">Videos, quizzes, exercises</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCertificates}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>
                Create and manage learning content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/admin/academy/courses">
                  <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                    <div>
                      <div className="font-semibold">Manage Courses</div>
                      <div className="text-xs text-gray-500">{stats.totalCourses} courses</div>
                    </div>
                  </Button>
                </Link>

                <Link href="/admin/academy/lessons">
                  <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                    <Video className="h-8 w-8 text-purple-600" />
                    <div>
                      <div className="font-semibold">Manage Lessons</div>
                      <div className="text-xs text-gray-500">{stats.totalLessons} lessons</div>
                    </div>
                  </Button>
                </Link>

                <Link href="/admin/academy/quizzes">
                  <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                    <FileText className="h-8 w-8 text-orange-600" />
                    <div>
                      <div className="font-semibold">Manage Quizzes</div>
                      <div className="text-xs text-gray-500">Assessments & tests</div>
                    </div>
                  </Button>
                </Link>

                <Link href="/admin/academy/paths">
                  <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div>
                      <div className="font-semibold">Learning Paths</div>
                      <div className="text-xs text-gray-500">Path structure</div>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/academy/courses/new">
                <Button className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Course
                </Button>
              </Link>
              <Link href="/admin/academy/lessons/new">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Lesson
                </Button>
              </Link>
              <Link href="/admin/academy/bulk-upload">
                <Button variant="outline" className="w-full justify-start">
                  <Video className="mr-2 h-4 w-4" />
                  Bulk Upload Videos
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Pending Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates in the academy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.user} • {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Items</CardTitle>
              <CardDescription>
                Items requiring your attention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-sm">Project Reviews</p>
                    <p className="text-xs text-gray-600">Student submissions pending</p>
                  </div>
                </div>
                <Badge className="bg-orange-600">{stats.pendingReviews}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">Forum Questions</p>
                    <p className="text-xs text-gray-600">Unanswered threads</p>
                  </div>
                </div>
                <Badge className="bg-blue-600">{stats.activeThreads}</Badge>
              </div>

              <Link href="/admin/academy/reviews">
                <Button variant="outline" className="w-full">
                  View All Pending Items
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
