'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, Search, Edit, Trash2, Eye, BookOpen, Clock, Users 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CoursesManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPath, setFilterPath] = useState('all');

  // PLACEHOLDER DATA - Will be replaced with Supabase queries
  const courses = [
    {
      id: '1',
      title: 'Introduction to DMAIC',
      learningPath: 'Foundation Belt',
      pathId: 'foundation',
      lessons: 12,
      students: 456,
      estimatedHours: 8,
      published: true,
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      title: 'Basic Statistics for CI',
      learningPath: 'Foundation Belt',
      pathId: 'foundation',
      lessons: 8,
      students: 423,
      estimatedHours: 6,
      published: true,
      lastUpdated: '2024-01-10'
    },
    {
      id: '3',
      title: 'Advanced VSM',
      learningPath: 'Lean Practitioner',
      pathId: 'lean',
      lessons: 15,
      students: 234,
      estimatedHours: 12,
      published: true,
      lastUpdated: '2024-01-05'
    },
    {
      id: '4',
      title: 'Design of Experiments (DOE)',
      learningPath: 'Six Sigma Practitioner',
      pathId: 'six-sigma',
      lessons: 0,
      students: 0,
      estimatedHours: 20,
      published: false,
      lastUpdated: '2024-01-20'
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPath = filterPath === 'all' || course.pathId === filterPath;
    return matchesSearch && matchesPath;
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      // TODO: Implement delete
      alert(`Delete course ${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Manage Courses</h1>
              <p className="text-gray-600 mt-1">Create and manage all academy courses</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/academy">
                <Button variant="outline">
                  Back to Admin
                </Button>
              </Link>
              <Link href="/admin/academy/courses/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Course
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterPath} onValueChange={setFilterPath}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by path" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Paths</SelectItem>
                  <SelectItem value="foundation">Foundation Belt</SelectItem>
                  <SelectItem value="lean">Lean Practitioner</SelectItem>
                  <SelectItem value="six-sigma">Six Sigma Practitioner</SelectItem>
                  <SelectItem value="integration">CI Integration</SelectItem>
                  <SelectItem value="expert">Expert Belt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Course List */}
        <div className="space-y-4">
          {filteredCourses.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || filterPath !== 'all' 
                    ? 'Try adjusting your filters'
                    : 'Create your first course to get started'}
                </p>
                <Link href="/admin/academy/courses/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Course
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredCourses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{course.title}</CardTitle>
                        {!course.published && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                            Draft
                          </Badge>
                        )}
                        {course.published && (
                          <Badge className="bg-green-100 text-green-800">
                            Published
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-4 text-sm">
                        <span className="font-medium">{course.learningPath}</span>
                        <span className="text-gray-400">•</span>
                        <span>Last updated: {course.lastUpdated}</span>
                      </CardDescription>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link href={`/academy/course/${course.id}`} target="_blank">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/academy/courses/${course.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(course.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-600">Lessons</div>
                        <div className="font-semibold">{course.lessons}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-600">Students</div>
                        <div className="font-semibold">{course.students}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-600">Duration</div>
                        <div className="font-semibold">{course.estimatedHours} hours</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary */}
        {filteredCourses.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-600">
            Showing {filteredCourses.length} of {courses.length} courses
          </div>
        )}
      </div>
    </div>
  );
}
