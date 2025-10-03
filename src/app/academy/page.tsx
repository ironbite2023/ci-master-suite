'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap, Award, Users, TrendingUp, BookOpen, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AcademyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <GraduationCap className="h-20 w-20" />
            </div>
            <h1 className="text-5xl font-bold mb-6">CI Master Academy</h1>
            <p className="text-xl mb-8 text-blue-100">
              Transform from beginner to expert in Continuous Improvement, Lean Manufacturing, and Six Sigma
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/academy/paths">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Explore Learning Paths
                </Button>
              </Link>
              <Link href="/academy/dashboard">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                  My Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 -mt-16">
          <Card className="shadow-lg">
            <CardContent className="pt-6 text-center">
              <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900">150+</div>
              <div className="text-sm text-gray-600">Lessons</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="pt-6 text-center">
              <Target className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-600">Practical Exercises</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="pt-6 text-center">
              <Award className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900">5</div>
              <div className="text-sm text-gray-600">Belt Levels</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="pt-6 text-center">
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900">1000+</div>
              <div className="text-sm text-gray-600">Students</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Learning Paths Preview */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Learning Path</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Progress through our structured belt system, from Foundation to Master level
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Foundation Belt */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="bg-gray-100">Level 1</Badge>
                <Badge>30 hours</Badge>
              </div>
              <CardTitle className="text-2xl">Foundation Belt</CardTitle>
              <CardDescription>White Belt Equivalent</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Learn the fundamentals of CI, Lean, and Six Sigma. Perfect for beginners.
              </p>
              <ul className="space-y-2 mb-6 text-sm text-gray-700">
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Introduction to Process Improvement
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Basic Statistics
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Lean Fundamentals
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> DMAIC Overview
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> CI Tools & Techniques
                </li>
              </ul>
              <Link href="/academy/path/foundation-belt">
                <Button className="w-full">Start Learning</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Practitioner Belt */}
          <Card className="hover:shadow-xl transition-shadow border-2 border-blue-200">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="bg-blue-100">Level 2</Badge>
                <Badge>60 hours</Badge>
              </div>
              <CardTitle className="text-2xl">Practitioner Belt</CardTitle>
              <CardDescription>Yellow Belt Equivalent</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Choose a specialization track: Lean, Six Sigma, or CI Integration.
              </p>
              <ul className="space-y-2 mb-6 text-sm text-gray-700">
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Advanced Value Stream Mapping
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Kanban Systems Design
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Statistical Process Control
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Design of Experiments
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Capstone Projects
                </li>
              </ul>
              <Link href="/academy/path/practitioner-belt">
                <Button className="w-full" variant="outline">View Details</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Specialist Belt */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="bg-green-100">Level 3</Badge>
                <Badge>120 hours</Badge>
              </div>
              <CardTitle className="text-2xl">Specialist Belt</CardTitle>
              <CardDescription>Green Belt Equivalent</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Master advanced techniques and lead improvement initiatives.
              </p>
              <ul className="space-y-2 mb-6 text-sm text-gray-700">
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Advanced DOE
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Measurement System Analysis
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Process Optimization
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Change Management
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Major Project Required
                </li>
              </ul>
              <Link href="/academy/path/specialist-belt">
                <Button className="w-full" variant="outline" disabled>
                  Complete Level 2 First
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Expert Belt */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="bg-yellow-100">Level 4</Badge>
                <Badge>180 hours</Badge>
              </div>
              <CardTitle className="text-2xl">Expert Belt</CardTitle>
              <CardDescription>Black Belt Equivalent</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Lead complex projects and mentor others in CI methodologies.
              </p>
              <ul className="space-y-2 mb-6 text-sm text-gray-700">
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Strategic CI Leadership
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Advanced Analytics
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Organizational Change
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Project Portfolio Management
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Mentorship Component
                </li>
              </ul>
              <Button className="w-full" variant="outline" disabled>
                Complete Level 3 First
              </Button>
            </CardContent>
          </Card>

          {/* Master Instructor */}
          <Card className="hover:shadow-xl transition-shadow border-2 border-purple-200">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="bg-purple-100">Level 5</Badge>
                <Badge>500+ hours</Badge>
              </div>
              <CardTitle className="text-2xl">Master Instructor</CardTitle>
              <CardDescription>Master Black Belt</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Become a CI thought leader and train the next generation.
              </p>
              <ul className="space-y-2 mb-6 text-sm text-gray-700">
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Teaching Excellence
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Original Research
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Program Development
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Enterprise Consulting
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Community Leadership
                </li>
              </ul>
              <Button className="w-full" variant="outline" disabled>
                Complete Level 4 First
              </Button>
            </CardContent>
          </Card>

          {/* Coming Soon */}
          <Card className="hover:shadow-xl transition-shadow bg-gradient-to-br from-gray-50 to-gray-100">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">Specialty</Badge>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
              <CardTitle className="text-2xl">Industry Certifications</CardTitle>
              <CardDescription>Specialized Tracks</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Industry-specific certifications in healthcare, manufacturing, and services.
              </p>
              <ul className="space-y-2 mb-6 text-sm text-gray-700">
                <li className="flex items-center">
                  <span className="mr-2">•</span> Healthcare Quality
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span> Manufacturing Excellence
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span> Service Operations
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span> Supply Chain Optimization
                </li>
              </ul>
              <Button className="w-full" variant="outline" disabled>
                Notify Me
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose CI Master Academy?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hands-On Learning</h3>
              <p className="text-gray-600">
                70% practical exercises using CI Master Suite tools. Learn by doing, not just watching.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Industry-Recognized Certificates</h3>
              <p className="text-gray-600">
                Earn verified certifications that employers trust and value in the marketplace.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Support</h3>
              <p className="text-gray-600">
                Join study groups, get peer reviews, and connect with mentors in our vibrant community.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Join thousands of practitioners who have transformed their careers with CI Master Academy
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/academy/paths">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Browse All Paths
                </Button>
              </Link>
              <Link href="/academy/dashboard">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
