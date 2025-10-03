'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Save, X, Upload, FileText, Plus, Trash2, Video 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function LessonEditPage() {
  const params = useParams();
  const router = useRouter();
  // Lesson ID for future API integration
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _lessonId = params.id as string;

  // Lesson state
  const [title, setTitle] = useState('Measure Phase Deep Dive');
  const [description, setDescription] = useState('Learn data collection strategies and measurement system analysis');
  const [type, setType] = useState<'video' | 'quiz' | 'exercise' | 'reading'>('video');
  const [duration, setDuration] = useState('25');
  const [videoUrl, setVideoUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [objectives, setObjectives] = useState<string[]>([
    'Create a comprehensive data collection plan',
    'Understand different types of data'
  ]);
  
  const [resources, setResources] = useState([
    { id: '1', title: 'Data Collection Template', type: 'Excel', url: '' },
    { id: '2', title: 'MSA Calculator', type: 'Excel', url: '' }
  ]);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Save to Supabase
      const lessonData = {
        title,
        description,
        type,
        duration_minutes: parseInt(duration),
        video_url: videoUrl,
        transcript,
        learning_objectives: objectives.filter(obj => obj.trim() !== ''),
        resources: resources.filter(r => r.title.trim() !== '')
      };

      console.log('Saving lesson:', lessonData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Lesson saved successfully!');
      router.push('/admin/academy/lessons');
    } catch (error) {
      console.error('Error saving lesson:', error);
      alert('Failed to save lesson');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddObjective = () => {
    setObjectives([...objectives, '']);
  };

  const handleRemoveObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const handleUpdateObjective = (index: number, value: string) => {
    const updated = [...objectives];
    updated[index] = value;
    setObjectives(updated);
  };

  const handleAddResource = () => {
    setResources([...resources, {
      id: Date.now().toString(),
      title: '',
      type: 'PDF',
      url: ''
    }]);
  };

  const handleRemoveResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
  };

  const handleUpdateResource = (id: string, field: string, value: string) => {
    setResources(resources.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Edit Lesson</h1>
              <p className="text-gray-600 text-sm">Add content, videos, transcripts, and resources</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/academy/lessons">
                <Button variant="outline">
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </Link>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Lesson'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="video">Video & Media</TabsTrigger>
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lesson Details</CardTitle>
                  <CardDescription>Basic information about this lesson</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Lesson Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Measure Phase Deep Dive"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of what this lesson covers"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Lesson Type *</Label>
                      <Select value={type} onValueChange={(value) => setType(value as typeof type)}>
                        <SelectTrigger id="type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">Video Lesson</SelectItem>
                          <SelectItem value="quiz">Quiz/Assessment</SelectItem>
                          <SelectItem value="exercise">Practical Exercise</SelectItem>
                          <SelectItem value="reading">Reading Material</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes) *</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="25"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Learning Objectives</CardTitle>
                      <CardDescription>What will students learn in this lesson?</CardDescription>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddObjective}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Objective
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {objectives.map((objective, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          value={objective}
                          onChange={(e) => handleUpdateObjective(index, e.target.value)}
                          placeholder={`Objective ${index + 1}`}
                        />
                      </div>
                      {objectives.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveObjective(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Video & Media Tab */}
            <TabsContent value="video" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Video Upload & Hosting</CardTitle>
                  <CardDescription>
                    Upload your video or provide a hosted video URL
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Video URL Input */}
                  <div className="space-y-2">
                    <Label htmlFor="videoUrl">Video URL</Label>
                    <Input
                      id="videoUrl"
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://your-video-host.com/video.mp4 or YouTube/Vimeo embed URL"
                    />
                    <p className="text-xs text-gray-500">
                      Supported: YouTube, Vimeo, Wistia, or direct MP4/WebM link
                    </p>
                  </div>

                  {/* OR Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">
                        Or upload directly
                      </span>
                    </div>
                  </div>

                  {/* File Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors">
                    <Video className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Upload Video File</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      [PLACEHOLDER] Drag and drop or click to browse
                    </p>
                    <Button type="button" variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Choose File
                    </Button>
                    <p className="text-xs text-gray-500 mt-4">
                      Supported formats: MP4, WebM, MOV (Max 2GB)
                    </p>
                  </div>

                  {/* Video Hosting Recommendations */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">💡 Video Hosting Recommendations</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• <strong>YouTube (Private/Unlisted):</strong> Free, reliable, good for unlisted content</li>
                      <li>• <strong>Vimeo:</strong> Professional, better privacy controls, customizable player</li>
                      <li>• <strong>Wistia:</strong> Best for business, detailed analytics, lead generation</li>
                      <li>• <strong>Direct Upload:</strong> Best control, requires storage solution (Supabase Storage)</li>
                    </ul>
                  </div>

                  {/* Video Preview */}
                  {videoUrl && (
                    <div>
                      <Label className="mb-2 block">Preview</Label>
                      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                        <p className="text-white">[PLACEHOLDER] Video preview would appear here</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Transcript Tab */}
            <TabsContent value="transcript" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Video Transcript</CardTitle>
                  <CardDescription>
                    Add the full transcript for accessibility and SEO
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="transcript">Transcript</Label>
                    <Textarea
                      id="transcript"
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      placeholder={`Welcome to the Measure Phase Deep Dive...

[PLACEHOLDER] Your full video transcript goes here.

You can paste it from:
- YouTube auto-captions (cleaned up)
- Rev.com transcription service
- Otter.ai or other transcription tools

Include timestamps if you want (optional):
[0:00] Introduction
[1:30] Data Collection Planning
[5:45] Measurement System Analysis`}
                      rows={20}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500">
                      Supports plain text or markdown. Timestamps are optional but helpful.
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-900 mb-2">📝 Why Transcripts Matter</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• <strong>Accessibility:</strong> Helps deaf/hard-of-hearing students</li>
                      <li>• <strong>Searchability:</strong> Students can search lesson content</li>
                      <li>• <strong>SEO:</strong> Google indexes text, not video content</li>
                      <li>• <strong>Learning:</strong> Some students prefer reading to watching</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Downloadable Resources</CardTitle>
                      <CardDescription>
                        Templates, worksheets, and reference materials for this lesson
                      </CardDescription>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddResource}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Resource
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {resources.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No resources added yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {resources.map((resource) => (
                        <div key={resource.id} className="flex gap-3 p-4 border rounded-lg">
                          <div className="flex-1 space-y-3">
                            <Input
                              value={resource.title}
                              onChange={(e) => handleUpdateResource(resource.id, 'title', e.target.value)}
                              placeholder="Resource title (e.g., Data Collection Template)"
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <Select
                                value={resource.type}
                                onValueChange={(value) => handleUpdateResource(resource.id, 'type', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="PDF">PDF</SelectItem>
                                  <SelectItem value="Excel">Excel</SelectItem>
                                  <SelectItem value="Word">Word</SelectItem>
                                  <SelectItem value="PowerPoint">PowerPoint</SelectItem>
                                  <SelectItem value="ZIP">ZIP</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                value={resource.url}
                                onChange={(e) => handleUpdateResource(resource.id, 'url', e.target.value)}
                                placeholder="File URL or path"
                              />
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveResource(resource.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Actions */}
          <div className="flex justify-between items-center pt-6 border-t mt-6">
            <Link href="/admin/academy/lessons">
              <Button type="button" variant="outline">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </Link>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Lesson'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
