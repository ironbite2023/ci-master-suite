'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Save, X, Plus, GripVertical, Trash2, Video, FileText, Target, BookOpen 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'quiz' | 'exercise' | 'reading';
  duration: number;
  order: number;
}

interface Objective {
  id: string;
  text: string;
}

export default function NewCoursePage() {
  const router = useRouter();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [learningPathId, setLearningPathId] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [difficulty, setDifficulty] = useState('beginner');
  const [instructor, setInstructor] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  
  const [objectives, setObjectives] = useState<Objective[]>([
    { id: '1', text: '' }
  ]);
  
  const [lessons, setLessons] = useState<Lesson[]>([]);
  
  const [isSaving, setIsSaving] = useState(false);

  // Objectives management
  const handleAddObjective = () => {
    setObjectives([...objectives, { id: Date.now().toString(), text: '' }]);
  };

  const handleRemoveObjective = (id: string) => {
    setObjectives(objectives.filter(obj => obj.id !== id));
  };

  const handleUpdateObjective = (id: string, text: string) => {
    setObjectives(objectives.map(obj => 
      obj.id === id ? { ...obj, text } : obj
    ));
  };

  // Lessons management
  const handleAddLesson = () => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: '',
      type: 'video',
      duration: 15,
      order: lessons.length + 1
    };
    setLessons([...lessons, newLesson]);
  };

  const handleRemoveLesson = (id: string) => {
    setLessons(lessons.filter(lesson => lesson.id !== id));
  };

  const handleUpdateLesson = (id: string, updates: Partial<Lesson>) => {
    setLessons(lessons.map(lesson => 
      lesson.id === id ? { ...lesson, ...updates } : lesson
    ));
  };

  // Save course logic
  const saveCourse = async () => {
    setIsSaving(true);

    try {
      // TODO: Save to Supabase
      const courseData = {
        title,
        description,
        short_description: shortDescription,
        learning_path_id: learningPathId,
        estimated_hours: parseFloat(estimatedHours),
        difficulty,
        instructor_name: instructor,
        is_published: isPublished,
        objectives: objectives.filter(obj => obj.text.trim() !== '').map(obj => obj.text),
        // Lessons will be added separately
      };

      console.log('Saving course:', courseData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Course created successfully!');
      router.push('/admin/academy/courses');
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveCourse();
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4 text-blue-600" />;
      case 'quiz':
        return <FileText className="h-4 w-4 text-purple-600" />;
      case 'exercise':
        return <Target className="h-4 w-4 text-orange-600" />;
      case 'reading':
        return <BookOpen className="h-4 w-4 text-teal-600" />;
      default:
        return <Video className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Create New Course</h1>
              <p className="text-gray-600 text-sm">Add course details, lessons, and learning objectives</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/academy/courses">
                <Button variant="outline">
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </Link>
              <Button onClick={handleSubmit} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Course'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Core details about this course
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Introduction to DMAIC"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description *</Label>
                <Textarea
                  id="shortDescription"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Brief summary for course cards (1-2 sentences)"
                  rows={2}
                  required
                />
                <p className="text-xs text-gray-500">
                  This appears on course cards and listings
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed course description, what students will learn, prerequisites, etc."
                  rows={6}
                  required
                />
                <p className="text-xs text-gray-500">
                  Detailed description shown on the course detail page
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="learningPath">Learning Path *</Label>
                  <Select value={learningPathId} onValueChange={setLearningPathId} required>
                    <SelectTrigger id="learningPath">
                      <SelectValue placeholder="Select a path" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="foundation">Foundation Belt (White Belt)</SelectItem>
                      <SelectItem value="lean">Lean Practitioner (Yellow Belt)</SelectItem>
                      <SelectItem value="six-sigma">Six Sigma Practitioner (Yellow Belt)</SelectItem>
                      <SelectItem value="integration">CI Integration Specialist (Green Belt)</SelectItem>
                      <SelectItem value="expert">Expert Belt (Black Belt)</SelectItem>
                      <SelectItem value="master">Master Instructor (Master Black Belt)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level *</Label>
                  <Select value={difficulty} onValueChange={setDifficulty} required>
                    <SelectTrigger id="difficulty">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimatedHours">Estimated Hours *</Label>
                  <Input
                    id="estimatedHours"
                    type="number"
                    step="0.5"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(e.target.value)}
                    placeholder="e.g., 8"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructor">Instructor Name</Label>
                  <Input
                    id="instructor"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    placeholder="e.g., Dr. Sarah Chen"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublished"
                  checked={isPublished}
                  onCheckedChange={(checked) => setIsPublished(checked as boolean)}
                />
                <Label htmlFor="isPublished" className="text-sm font-normal cursor-pointer">
                  Publish course immediately (students can enroll)
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Learning Objectives */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Learning Objectives</CardTitle>
                  <CardDescription>
                    What will students be able to do after completing this course?
                  </CardDescription>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={handleAddObjective}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Objective
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {objectives.map((objective, index) => (
                <div key={objective.id} className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      value={objective.text}
                      onChange={(e) => handleUpdateObjective(objective.id, e.target.value)}
                      placeholder={`Objective ${index + 1}: e.g., "Apply DMAIC methodology to real-world problems"`}
                    />
                  </div>
                  {objectives.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveObjective(objective.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Lessons */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Course Lessons</CardTitle>
                  <CardDescription>
                    Add lessons to this course (you can add full lesson content later)
                  </CardDescription>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={handleAddLesson}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Lesson
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {lessons.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No lessons added yet. Click &quot;Add Lesson&quot; to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <div 
                      key={lesson.id}
                      className="flex items-center gap-3 p-4 border rounded-lg bg-white"
                    >
                      <div className="cursor-move">
                        <GripVertical className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex items-center gap-2">
                        {getLessonIcon(lesson.type)}
                        <span className="text-sm font-medium text-gray-600">
                          Lesson {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <Input
                          value={lesson.title}
                          onChange={(e) => handleUpdateLesson(lesson.id, { title: e.target.value })}
                          placeholder="Lesson title..."
                          className="border-none shadow-none"
                        />
                      </div>
                      <div className="w-32">
                        <Select
                          value={lesson.type}
                          onValueChange={(value) => handleUpdateLesson(lesson.id, { type: value as Lesson['type'] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="quiz">Quiz</SelectItem>
                            <SelectItem value="exercise">Exercise</SelectItem>
                            <SelectItem value="reading">Reading</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-24">
                        <Input
                          type="number"
                          value={lesson.duration}
                          onChange={(e) => handleUpdateLesson(lesson.id, { duration: parseInt(e.target.value) })}
                          placeholder="Min"
                          min="1"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveLesson(lesson.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-between items-center pt-6 border-t">
            <Link href="/admin/academy/courses">
              <Button type="button" variant="outline">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </Link>
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setIsPublished(false);
                  saveCourse();
                }}
                disabled={isSaving}
              >
                Save as Draft
              </Button>
              <Button type="submit" disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isPublished ? 'Save & Publish' : 'Save Course'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
