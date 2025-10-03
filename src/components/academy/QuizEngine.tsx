'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { QuizEngineProps } from '@/types/academy';

export const QuizEngine: React.FC<QuizEngineProps> = ({
  assessment,
  onSubmit,
  timeLimit,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit ? timeLimit * 60 : null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / assessment.questions.length) * 100;

  const calculateScore = useCallback(() => {
    let totalPoints = 0;
    let earnedPoints = 0;

    assessment.questions.forEach((question) => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];
      
      if (question.type === 'multiple-choice' || question.type === 'true-false') {
        if (userAnswer === question.correct_answer) {
          earnedPoints += question.points;
        }
      } else if (question.type === 'calculation') {
        const tolerance = 0.01; // 1% tolerance
        const correct = Number(question.correct_answer);
        const user = Number(userAnswer);
        if (Math.abs(correct - user) / correct <= tolerance) {
          earnedPoints += question.points;
        }
      }
    });

    return { earnedPoints, totalPoints, percentage: (earnedPoints / totalPoints) * 100 };
  }, [assessment.questions, answers]);

  const handleSubmit = useCallback(() => {
    const results = calculateScore();
    setScore(results.percentage);
    setShowResults(true);
    onSubmit(answers);
  }, [calculateScore, answers, onSubmit]);

  // Timer
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, handleSubmit]);

  const handleAnswerChange = (questionId: string, answer: unknown) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    const passed = score >= assessment.passing_score;
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Assessment Results</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div>
            {passed ? (
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
            ) : (
              <XCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
            )}
            <h3 className="text-3xl font-bold mb-2">
              {score.toFixed(1)}%
            </h3>
            <p className="text-lg text-gray-600">
              {passed ? 'Congratulations! You passed!' : 'Keep trying! You can retake this assessment.'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Passing Score:</span>
              <span className="font-semibold">{assessment.passing_score}%</span>
            </div>
            <div className="flex justify-between">
              <span>Your Score:</span>
              <span className="font-semibold">{score.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Questions Answered:</span>
              <span className="font-semibold">
                {Object.keys(answers).length} / {assessment.questions.length}
              </span>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              Review Answers
            </Button>
            <Button onClick={() => window.history.back()}>
              Continue Learning
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">{assessment.title}</h2>
              <p className="text-gray-600">
                Question {currentQuestionIndex + 1} of {assessment.questions.length}
              </p>
            </div>
            {timeRemaining !== null && (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-600" />
                <span className={`text-lg font-semibold ${timeRemaining < 60 ? 'text-red-600' : ''}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="flex-1">{currentQuestion.question}</CardTitle>
            <span className="text-sm text-gray-600">
              {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Multiple Choice */}
          {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
            <RadioGroup
              value={answers[currentQuestion.id] as string || ''}
              onValueChange={(value: string) => handleAnswerChange(currentQuestion.id, value)}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {/* True/False */}
          {currentQuestion.type === 'true-false' && (
            <RadioGroup
              value={answers[currentQuestion.id] as string || ''}
              onValueChange={(value: string) => handleAnswerChange(currentQuestion.id, value)}
            >
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="true" id="true" />
                <Label htmlFor="true" className="flex-1 cursor-pointer">True</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="false" id="false" />
                <Label htmlFor="false" className="flex-1 cursor-pointer">False</Label>
              </div>
            </RadioGroup>
          )}

          {/* Calculation */}
          {currentQuestion.type === 'calculation' && (
            <div>
              <Label htmlFor="calculation-answer">Enter your answer:</Label>
              <Input
                id="calculation-answer"
                type="number"
                step="0.01"
                value={String(answers[currentQuestion.id] || '')}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                placeholder="Enter numerical answer"
                className="text-lg"
              />
            </div>
          )}

          {/* Short Answer */}
          {currentQuestion.type === 'short-answer' && (
            <div>
              <Label htmlFor="short-answer">Your answer:</Label>
              <Input
                id="short-answer"
                type="text"
                value={String(answers[currentQuestion.id] || '')}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                placeholder="Enter your answer"
                className="text-lg"
              />
            </div>
          )}

          {/* Hint */}
          {!answers[currentQuestion.id] && (
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <p className="text-sm text-blue-900">
                Take your time and choose the best answer. You can navigate between questions before submitting.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {assessment.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`h-8 w-8 rounded ${
                index === currentQuestionIndex
                  ? 'bg-blue-600 text-white'
                  : answers[assessment.questions[index].id]
                  ? 'bg-green-200 text-green-800'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestionIndex === assessment.questions.length - 1 ? (
          <Button onClick={handleSubmit}>
            Submit Assessment
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
};
