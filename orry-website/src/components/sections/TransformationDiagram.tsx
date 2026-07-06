'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TransformItem {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

interface TransformationDiagramProps {
  beforeItems: TransformItem[];
  afterItems: TransformItem[];
  transitionText?: string;
}

/**
 * TransformationDiagram Component
 * Before/After comparison layout with arrow
 * Features: responsive stacking, animated arrow, centered layout
 */
export const TransformationDiagram: React.FC<TransformationDiagramProps> = ({
  beforeItems,
  afterItems,
  transitionText = 'Transform',
}) => {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {/* Desktop Layout */}
      <div className="hidden lg:grid grid-cols-3 gap-8 items-center mb-12">
        {/* Before */}
        <div>
          <h3
            className="text-xl font-bold mb-6 text-center"
            style={{ color: 'var(--color-burgundy)' }}
          >
            Before
          </h3>
          <div className="space-y-4">
            {beforeItems.map((item, idx) => (
              <motion.div
                key={idx}
                className="p-4 bg-gray-100 rounded-lg text-center"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                {item.icon && (
                  <div className="text-2xl mb-2" style={{ color: 'var(--color-burgundy)' }}>
                    {item.icon}
                  </div>
                )}
                <p className="font-semibold text-sm">{item.title}</p>
                {item.description && (
                  <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <motion.div
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl mb-4"
            style={{ color: 'var(--color-burgundy)' }}
          >
            →
          </motion.div>
          <p
            className="text-sm font-bold text-center"
            style={{ color: 'var(--color-burgundy)' }}
          >
            {transitionText}
          </p>
        </motion.div>

        {/* After */}
        <div>
          <h3
            className="text-xl font-bold mb-6 text-center"
            style={{ color: 'var(--color-burgundy)' }}
          >
            After
          </h3>
          <div className="space-y-4">
            {afterItems.map((item, idx) => (
              <motion.div
                key={idx}
                className="p-4 rounded-lg text-center"
                style={{ backgroundColor: 'var(--color-gold)' }}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                {item.icon && (
                  <div className="text-2xl mb-2" style={{ color: 'var(--color-burgundy)' }}>
                    {item.icon}
                  </div>
                )}
                <p className="font-semibold text-sm">{item.title}</p>
                {item.description && (
                  <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden space-y-6">
        <div>
          <h3
            className="text-xl font-bold mb-4 text-center"
            style={{ color: 'var(--color-burgundy)' }}
          >
            Before
          </h3>
          <div className="space-y-3">
            {beforeItems.map((item, idx) => (
              <motion.div
                key={idx}
                className="p-3 bg-gray-100 rounded-lg text-center text-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                {item.icon && <div className="text-lg mb-1">{item.icon}</div>}
                <p className="font-semibold">{item.title}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="text-center py-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-3xl mb-2"
            style={{ color: 'var(--color-burgundy)' }}
          >
            ↓
          </motion.div>
          <p className="font-bold" style={{ color: 'var(--color-burgundy)' }}>
            {transitionText}
          </p>
        </motion.div>

        <div>
          <h3
            className="text-xl font-bold mb-4 text-center"
            style={{ color: 'var(--color-burgundy)' }}
          >
            After
          </h3>
          <div className="space-y-3">
            {afterItems.map((item, idx) => (
              <motion.div
                key={idx}
                className="p-3 rounded-lg text-center text-sm"
                style={{ backgroundColor: 'var(--color-gold)' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                {item.icon && <div className="text-lg mb-1">{item.icon}</div>}
                <p className="font-semibold">{item.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

TransformationDiagram.displayName = 'TransformationDiagram';
