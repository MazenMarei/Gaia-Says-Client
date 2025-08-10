"use client";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm text-center bg-card/30 rounded-2xl p-8 border border-cyan-300/30 shadow-2xl">
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center space-x-4">{children}</div>
  );
};

Card.Content = function CardContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="p-4">{children}</div>;
};

export default Card;
