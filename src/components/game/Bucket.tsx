import { motion } from 'framer-motion';
import { Bucket as BucketType, THEME_COLORS } from '@/types';

interface BucketProps {
  bucket: BucketType;
  isHighlighted?: boolean;
}

export function Bucket({ bucket, isHighlighted = false }: BucketProps) {
  const colors = THEME_COLORS[bucket.theme];

  return (
    <motion.div
      className="absolute flex flex-col items-center justify-end"
      style={{
        left: bucket.position.x - bucket.width / 2,
        top: bucket.position.y,
        width: bucket.width,
        height: bucket.height,
      }}
      animate={{
        scale: isHighlighted ? 1.1 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
    >
      {/* Bucket body - trapezoid shape using SVG */}
      <svg
        width={bucket.width}
        height={bucket.height}
        viewBox={`0 0 ${bucket.width} ${bucket.height}`}
        className="absolute top-0 left-0"
      >
        {/* Bucket shadow */}
        <path
          d={`
            M ${bucket.width * 0.1} 0
            L ${bucket.width * 0.05} ${bucket.height}
            L ${bucket.width * 0.95} ${bucket.height}
            L ${bucket.width * 0.9} 0
            Z
          `}
          fill="rgba(0,0,0,0.2)"
          transform="translate(4, 4)"
        />

        {/* Bucket body */}
        <path
          d={`
            M ${bucket.width * 0.1} 0
            L ${bucket.width * 0.05} ${bucket.height}
            L ${bucket.width * 0.95} ${bucket.height}
            L ${bucket.width * 0.9} 0
            Z
          `}
          fill={colors.bucketFill}
          stroke={colors.bucketStroke}
          strokeWidth={3}
        />

        {/* Bucket rim */}
        <rect
          x={bucket.width * 0.05}
          y={0}
          width={bucket.width * 0.9}
          height={8}
          fill={colors.bucketStroke}
          rx={4}
        />

        {/* Bucket highlight */}
        <path
          d={`
            M ${bucket.width * 0.15} 10
            L ${bucket.width * 0.12} ${bucket.height - 10}
          `}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={4}
          strokeLinecap="round"
        />
      </svg>

      {/* Label (for educational buckets) */}
      {bucket.label && (
        <motion.div
          className="absolute flex items-center justify-center font-bold text-white"
          style={{
            top: bucket.height * 0.3,
            fontSize: Math.min(bucket.width * 0.4, 32),
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}
          animate={{
            scale: isHighlighted ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 0.3,
            repeat: isHighlighted ? Infinity : 0,
            repeatDelay: 0.5,
          }}
        >
          {bucket.label}
        </motion.div>
      )}
    </motion.div>
  );
}

export default Bucket;
