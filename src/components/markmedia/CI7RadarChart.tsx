import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface CI7RadarChartProps {
  scores: { id: number; title: string; score: number; maxScore?: number }[];
  size?: number;
  animated?: boolean;
}

const CI7RadarChart = ({ scores, size = 200, animated = true }: CI7RadarChartProps) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = (size / 2) - 30;
  const levels = 5; // Max score per step

  // Calculate points for the radar chart
  const chartData = useMemo(() => {
    const numPoints = scores.length;
    const angleStep = (2 * Math.PI) / numPoints;
    
    // Calculate polygon points for each level (background rings)
    const levelPolygons = Array.from({ length: levels }, (_, levelIndex) => {
      const levelRadius = (radius / levels) * (levelIndex + 1);
      const points = scores.map((_, i) => {
        const angle = (angleStep * i) - (Math.PI / 2); // Start from top
        const x = centerX + Math.cos(angle) * levelRadius;
        const y = centerY + Math.sin(angle) * levelRadius;
        return `${x},${y}`;
      });
      return points.join(' ');
    });

    // Calculate data polygon (actual scores)
    const dataPoints = scores.map((item, i) => {
      const maxScore = item.maxScore || 5;
      const normalizedScore = item.score / maxScore;
      const pointRadius = normalizedScore * radius;
      const angle = (angleStep * i) - (Math.PI / 2);
      const x = centerX + Math.cos(angle) * pointRadius;
      const y = centerY + Math.sin(angle) * pointRadius;
      return { x, y, score: item.score, title: item.title, id: item.id };
    });

    // Calculate label positions
    const labelPositions = scores.map((item, i) => {
      const angle = (angleStep * i) - (Math.PI / 2);
      const labelRadius = radius + 20;
      const x = centerX + Math.cos(angle) * labelRadius;
      const y = centerY + Math.sin(angle) * labelRadius;
      
      // Determine text anchor based on position
      let textAnchor: 'start' | 'middle' | 'end' = 'middle';
      if (Math.cos(angle) < -0.1) textAnchor = 'end';
      else if (Math.cos(angle) > 0.1) textAnchor = 'start';
      
      return { x, y, textAnchor, title: item.title, id: item.id, score: item.score };
    });

    // Calculate axis lines
    const axisLines = scores.map((_, i) => {
      const angle = (angleStep * i) - (Math.PI / 2);
      const x2 = centerX + Math.cos(angle) * radius;
      const y2 = centerY + Math.sin(angle) * radius;
      return { x1: centerX, y1: centerY, x2, y2 };
    });

    return { levelPolygons, dataPoints, labelPositions, axisLines };
  }, [scores, centerX, centerY, radius, levels]);

  const dataPolygonPath = chartData.dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Add extra padding for legend
  const legendHeight = 30;
  
  return (
    <div className="relative" style={{ width: size, height: size + legendHeight }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* Background level rings */}
        {chartData.levelPolygons.map((points, idx) => (
          <polygon
            key={`level-${idx}`}
            points={points}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={idx === levels - 1 ? 1.5 : 0.5}
            opacity={0.5}
          />
        ))}

        {/* Axis lines */}
        {chartData.axisLines.map((line, idx) => (
          <line
            key={`axis-${idx}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="hsl(var(--border))"
            strokeWidth={0.5}
            opacity={0.5}
          />
        ))}

        {/* Data polygon fill */}
        <motion.polygon
          points={animated ? '' : dataPolygonPath}
          initial={animated ? { 
            points: chartData.dataPoints.map(() => `${centerX},${centerY}`).join(' ')
          } : undefined}
          animate={{ points: dataPolygonPath }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          fill="url(#radarGradient)"
          opacity={0.6}
        />

        {/* Data polygon stroke */}
        <motion.polygon
          points={animated ? '' : dataPolygonPath}
          initial={animated ? { 
            points: chartData.dataPoints.map(() => `${centerX},${centerY}`).join(' ')
          } : undefined}
          animate={{ points: dataPolygonPath }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
        />

        {/* Center badge inside SVG for perfect centering */}
        <motion.g
          initial={animated ? { scale: 0, opacity: 0 } : undefined}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2, type: "spring" }}
        >
          <circle
            cx={centerX}
            cy={centerY}
            r={22}
            fill="url(#centerGradient)"
            stroke="white"
            strokeWidth={2}
          />
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="central"
            fill="white"
            fontSize="11"
            fontWeight="bold"
          >
            CI+7
          </text>
        </motion.g>

        {/* Data points */}
        {chartData.dataPoints.map((point, idx) => (
          <motion.circle
            key={`point-${idx}`}
            cx={animated ? centerX : point.x}
            cy={animated ? centerY : point.y}
            initial={animated ? { cx: centerX, cy: centerY, r: 0 } : undefined}
            animate={{ cx: point.x, cy: point.y, r: 5 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 + idx * 0.05 }}
            fill={point.score <= 2 ? "hsl(var(--accent))" : "hsl(var(--primary))"}
            stroke="white"
            strokeWidth={2}
          />
        ))}

        {/* Gradient definitions */}
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
      </svg>

      {/* Labels with scores - positioned outside SVG */}
      {chartData.labelPositions.map((label, idx) => (
        <motion.div
          key={`label-${idx}`}
          className="absolute"
          style={{
            left: label.x,
            top: label.y,
            transform: `translate(-50%, -50%)`,
          }}
          initial={animated ? { opacity: 0, scale: 0.8 } : undefined}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 1 + idx * 0.05 }}
        >
          <div className="flex flex-col items-center">
            {/* Score badge */}
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md ${
              label.score <= 2 
                ? 'bg-accent text-white' 
                : 'bg-primary text-white'
            }`}>
              {label.score}
            </div>
            {/* Step number */}
            <span className="text-[9px] font-medium text-muted-foreground mt-0.5">
              P{label.id}
            </span>
          </div>
        </motion.div>
      ))}

      {/* Color Legend - centered below chart */}
      <motion.div
        className="absolute flex items-center justify-center gap-6 text-xs bg-muted/50 px-4 py-2 rounded-full"
        style={{ 
          top: size + 20, 
          left: 0, 
          right: 0,
          width: 'fit-content',
          margin: '0 auto'
        }}
        initial={animated ? { opacity: 0, y: -5 } : undefined}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent shadow-sm" />
          <span className="text-muted-foreground font-medium">A mejorar</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary shadow-sm" />
          <span className="text-muted-foreground font-medium">Fortaleza</span>
        </div>
      </motion.div>
    </div>
  );
};

export default CI7RadarChart;
