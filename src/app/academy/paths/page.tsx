'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Clock, Award, ChevronRight, Star, Target, Briefcase, Users, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Mock data - will be replaced with Supabase queries
const learningPaths = [
  {
    id: '1',
    name: 'Foundation Path',
    slug: 'foundation',
    description: 'Master the fundamentals of Continuous Improvement, Lean, and Six Sigma. Perfect for beginners looking to build a solid foundation.',
    beltLevel: 1,
    beltName: 'White Belt',
    estimatedHours: 40,
    coursesCount: 8,
    enrolledCount: 2456,
    isEnrolled: false,
    progress: 0,
    specialization: null,
    thumbnailUrl: null,
    color: 'bg-slate-100 text-slate-700',
    iconBg: 'bg-slate-200',
  },
  {
    id: '2',
    name: 'Practitioner Path',
    slug: 'practitioner',
    description: 'Develop practical skills to lead CI projects. Learn advanced Lean tools, data analysis, and project management.',
    beltLevel: 2,
    beltName: 'Yellow Belt',
    estimatedHours: 80,
    coursesCount: 12,
    enrolledCount: 1823,
    isEnrolled: true,
    progress: 45,
    specialization: null,
    thumbnailUrl: null,
    color: 'bg-yellow-100 text-yellow-800',
    iconBg: 'bg-yellow-200',
  },
  {
    id: '3',
    name: 'Specialist Path - Manufacturing',
    slug: 'specialist-manufacturing',
    description: 'Specialize in manufacturing excellence. Master OEE, TPM, value stream mapping, and production optimization.',
    beltLevel: 3,
    beltName: 'Green Belt',
    estimatedHours: 120,
    coursesCount: 15,
    enrolledCount: 987,
    isEnrolled: false,
    progress: 0,
    specialization: 'Manufacturing',
    thumbnailUrl: null,
    color: 'bg-green-100 text-green-800',
    iconBg: 'bg-green-200',
  },
  {
    id: '4',
    name: 'Specialist Path - Service',
    slug: 'specialist-service',
    description: 'Excel in service industry CI. Focus on process optimization, customer experience, and service quality.',
    beltLevel: 3,
    beltName: 'Green Belt',
    estimatedHours: 120,
    coursesCount: 14,
    enrolledCount: 756,
    isEnrolled: false,
    progress: 0,
    specialization: 'Service',
    thumbnailUrl: null,
    color: 'bg-green-100 text-green-800',
    iconBg: 'bg-green-200',
  },
  {
    id: '5',
    name: 'Expert Path',
    slug: 'expert',
    description: 'Become a Six Sigma expert. Master advanced statistical methods, design of experiments, and lead large-scale transformations.',
    beltLevel: 4,
    beltName: 'Black Belt',
    estimatedHours: 160,
    coursesCount: 18,
    enrolledCount: 432,
    isEnrolled: false,
    progress: 0,
    specialization: null,
    thumbnailUrl: null,
    color: 'bg-gray-900 text-white',
    iconBg: 'bg-gray-700',
  },
  {
    id: '6',
    name: 'Master Instructor Path',
    slug: 'master-instructor',
    description: 'Train the trainers. Learn to coach Black Belts, design CI programs, and drive organizational transformation.',
    beltLevel: 5,
    beltName: 'Master Black Belt',
    estimatedHours: 200,
    coursesCount: 20,
    enrolledCount: 145,
    isEnrolled: false,
    progress: 0,
    specialization: null,
    thumbnailUrl: null,
    color: 'bg-purple-100 text-purple-900',
    iconBg: 'bg-purple-200',
  },
];

export default function LearningPathsPage() {
  const router = useRouter();

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
        <h1 className="text-4xl font-bold mb-4">Learning Paths</h1>
        <p className="text-lg text-gray-600">
          Choose your journey from beginner to master. Each path builds on the previous one, 
          guiding you through a structured curriculum with hands-on projects and assessments.
        </p>
      </div>

      {/* Filter/Sort Section */}
      <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm">All Paths</Button>
          <Button variant="ghost" size="sm">In Progress</Button>
          <Button variant="ghost" size="sm">Not Started</Button>
          <Button variant="ghost" size="sm">Completed</Button>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-600">Sort by:</span>
          <Button variant="ghost" size="sm">Level</Button>
          <Button variant="ghost" size="sm">Duration</Button>
        </div>
      </div>

      {/* Learning Paths Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {learningPaths.map((path) => (
          <Card 
            key={path.id} 
            className={`hover:shadow-lg transition-shadow ${path.isEnrolled ? 'border-blue-300 border-2' : ''}`}
          >
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <div className={`p-3 rounded-lg ${path.iconBg}`}>
                  <Award className="h-6 w-6" />
                </div>
                {path.isEnrolled && (
                  <Badge variant="default" className="bg-blue-600">
                    In Progress
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl mb-2">{path.name}</CardTitle>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className={path.color}>
                  {path.beltName}
                </Badge>
                {path.specialization && (
                  <Badge variant="outline">
                    {path.specialization}
                  </Badge>
                )}
              </div>
              <CardDescription className="text-base">
                {path.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {/* Progress Bar (if enrolled) */}
              {path.isEnrolled && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold text-blue-600">{path.progress}%</span>
                  </div>
                  <Progress value={path.progress} className="h-2" />
                </div>
              )}

              {/* Path Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-t border-b">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Clock className="h-4 w-4 text-gray-500 mr-1" />
                  </div>
                  <div className="text-sm font-semibold">{path.estimatedHours}h</div>
                  <div className="text-xs text-gray-500">Duration</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Target className="h-4 w-4 text-gray-500 mr-1" />
                  </div>
                  <div className="text-sm font-semibold">{path.coursesCount}</div>
                  <div className="text-xs text-gray-500">Courses</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="h-4 w-4 text-gray-500 mr-1" />
                  </div>
                  <div className="text-sm font-semibold">{path.enrolledCount.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Students</div>
                </div>
              </div>

              {/* Action Button */}
              <Link href={`/academy/path/${path.slug}`}>
                <Button 
                  className="w-full" 
                  variant={path.isEnrolled ? 'default' : 'outline'}
                >
                  {path.isEnrolled ? 'Continue Learning' : 'View Details'}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coming Soon Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 border border-blue-200">
        <div className="flex items-start gap-6">
          <div className={`p-4 rounded-lg bg-blue-200`}>
            <Briefcase className="h-8 w-8 text-blue-700" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">Industry-Specific Certifications</h3>
            <p className="text-gray-700 mb-4">
              We&apos;re developing specialized certification paths for Healthcare, Financial Services, 
              Technology, and more. Get notified when they launch!
            </p>
            <Button>
              Join Waitlist
            </Button>
          </div>
        </div>
      </div>

      {/* Path Prerequisites Info */}
      <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <Star className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-lg mb-2">About Path Prerequisites</h4>
            <p className="text-gray-700">
              Each learning path builds upon the previous level. We recommend completing paths in sequence 
              for the best learning experience. However, if you have prior experience, you can take a 
              placement assessment to skip ahead.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

