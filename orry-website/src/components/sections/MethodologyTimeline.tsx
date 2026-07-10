'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface StageData {
  number: number;
  title: string;
  duration: string;
  purpose: string;
  content: string[];
  humanCentered?: boolean;
}

interface MethodologyTimelineProps {
  stages: StageData[];
  children?: React.ReactNode;
}

/**
 * MethodologyTimeline Component
 * Timeline layout for methodology stages
 * Features: horizontal (desktop) / vertical (mobile), connecting lines, numbered stages
 */
export const MethodologyTimeline: React.FC<MethodologyTimelineProps> = ({
  stages,
  children,
}) => {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Desktop Timeline */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* Connecting Line */}
          <div
            className="absolute top-8 left-0 right-0 h-1"
            style={{ backgroundColor: 'var(--color-border)' }}
          />

          {/* Stages Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 relative z-10">
            {stages.map((stage, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="text-center mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white mx-auto"
                    style={{ backgroundColor: 'var(--color-burgundy)' }}
                  >
                    {stage.number}
                  </div>
                </div>
                <h4
                  className="text-sm font-bold text-center"
                  style={{ color: 'var(--color-burgundy)' }}
                >
                  {stage.title}
                </h4>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Timeline */}
      <div className="lg:hidden">
        <div className="space-y-8">
          {stages.map((stage, idx) => (
            <motion.div
              key={idx}
              className="relative pl-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              {/* Vertical Line */}
              {idx !== stages.length - 1 && (
                <div
                  className="absolute left-3 top-12 w-1 h-12"
                  style={{ backgroundColor: 'var(--color-border)' }}
                />
              )}

              {/* Circle */}
              <div
                className="absolute -left-2 top-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                style={{ backgroundColor: 'var(--color-burgundy)' }}
              >
                {stage.number}
              </div>

              {/* Content */}
              <h4
                className="font-bold mb-1"
                style={{ color: 'var(--color-burgundy)' }}
              >
                {stage.title}
              </h4>
              <p className="text-sm text-gray-500">{stage.duration}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {children}
    </motion.div>
  );
};

MethodologyTimeline.displayName = 'MethodologyTimeline';
