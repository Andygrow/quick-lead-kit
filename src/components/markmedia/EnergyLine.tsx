interface EnergyLineProps {
  direction?: "left" | "right";
  className?: string;
}

const EnergyLine = ({ direction = "right", className = "" }: EnergyLineProps) => {
  const isRight = direction === "right";
  
  return (
    <div
      className={`absolute h-0.5 energy-line ${className}`}
      style={{
        width: "120px",
        background: `linear-gradient(${isRight ? "90deg" : "270deg"}, transparent, hsl(187 100% 50%), hsl(187 100% 70%), transparent)`,
      }}
    />
  );
};

export default EnergyLine;
