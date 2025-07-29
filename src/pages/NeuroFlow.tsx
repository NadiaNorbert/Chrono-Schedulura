import Navigation from "@/components/Navigation";

const NeuroFlow = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Neuro Flow
        </h1>
        <p className="text-muted-foreground">
          Activity analysis and smart scheduling coming soon...
        </p>
      </div>
    </div>
  );
};

export default NeuroFlow;