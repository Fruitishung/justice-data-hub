
interface AudioVisualizerProps {
  audioLevel: number;
}

export const AudioVisualizer = ({ audioLevel }: AudioVisualizerProps) => (
  <div className="w-1 h-20 bg-gray-200 rounded-full overflow-hidden">
    <div
      className="w-full bg-[#0EA5E9] transition-all duration-100 rounded-full"
      style={{
        height: `${audioLevel * 100}%`,
        opacity: 0.8 + (audioLevel * 0.2),
      }}
    />
  </div>
);
