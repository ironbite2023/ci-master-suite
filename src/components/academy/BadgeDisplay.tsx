'use client';

import React from 'react';
import Image from 'next/image';
import { Award, Lock, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge as BadgeUI } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BadgeDisplayProps } from '@/types/academy';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({
  badge,
  earned = false,
  progress = 0,
}) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'rare':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'epic':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'legendary':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-500';
      case 'rare':
        return 'bg-blue-500';
      case 'epic':
        return 'bg-purple-500';
      case 'legendary':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            earned ? getRarityColor(badge.rarity) : 'opacity-60 grayscale'
          } border-2`}
        >
          <CardContent className="p-4 text-center">
            <div className="relative mx-auto w-20 h-20 mb-3">
              {earned ? (
                badge.icon_url ? (
                  <Image src={badge.icon_url} alt={badge.name} width={80} height={80} className="w-full h-full" />
                ) : (
                  <div className={`w-full h-full rounded-full flex items-center justify-center ${getRarityColor(badge.rarity)}`}>
                    <Award className="h-10 w-10" />
                  </div>
                )
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                  <Lock className="h-10 w-10 text-gray-500" />
                </div>
              )}
              
              {/* Rarity indicator */}
              <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full ${getRarityBadgeColor(badge.rarity)} flex items-center justify-center`}>
                <span className="text-xs text-white font-bold">
                  {badge.rarity === 'common' ? 'C' : badge.rarity === 'rare' ? 'R' : badge.rarity === 'epic' ? 'E' : 'L'}
                </span>
              </div>
            </div>

            <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
            <p className="text-xs text-gray-600 line-clamp-2">{badge.description}</p>

            {!earned && progress > 0 && (
              <div className="mt-3">
                <Progress value={progress} className="h-1.5" />
                <p className="text-xs text-gray-500 mt-1">{progress}% complete</p>
              </div>
            )}

            {badge.points > 0 && (
              <div className="mt-2">
                <BadgeUI variant="secondary" className="text-xs">
                  +{badge.points} XP
                </BadgeUI>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getRarityColor(badge.rarity)}`}>
              {badge.icon_url ? (
                <Image src={badge.icon_url} alt={badge.name} width={48} height={48} className="w-12 h-12" />
              ) : (
                <Award className="h-8 w-8" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold">{badge.name}</h3>
              <BadgeUI className={getRarityBadgeColor(badge.rarity) + ' text-white text-xs'}>
                {badge.rarity.toUpperCase()}
              </BadgeUI>
            </div>
          </DialogTitle>
          <DialogDescription className="text-base">
            {badge.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* How to Earn */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              How to Earn
            </h4>
            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              {badge.category === 'tool-mastery' && (
                <p>Complete 10 analyses using specific CI Master Suite tools</p>
              )}
              {badge.category === 'methodology' && (
                <p>Complete all lessons in a specific methodology track</p>
              )}
              {badge.category === 'streak' && (
                <p>Maintain a learning streak for consecutive days</p>
              )}
              {badge.category === 'achievement' && (
                <p>Reach specific milestones in your learning journey</p>
              )}
              {badge.category === 'community' && (
                <p>Contribute to the community through discussions and peer reviews</p>
              )}
              {badge.category === 'project' && (
                <p>Complete capstone projects with excellent scores</p>
              )}
            </div>
          </div>

          {/* Progress */}
          {!earned && progress > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Your Progress</h4>
              <Progress value={progress} className="h-2 mb-2" />
              <p className="text-sm text-gray-600">
                {progress}% complete - Keep going!
              </p>
            </div>
          )}

          {earned && (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-green-800 font-semibold">✓ Badge Earned!</p>
              <p className="text-sm text-green-700">You earned this on [Date]</p>
            </div>
          )}

          {/* Reward Info */}
          {badge.points > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Reward</h4>
              <div className="flex items-center gap-2">
                <BadgeUI variant="secondary" className="text-base">
                  +{badge.points} XP
                </BadgeUI>
                <span className="text-sm text-gray-600">added to your total score</span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
