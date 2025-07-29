import Navigation from "@/components/Navigation";

const Reminders = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Intelligent Reminders
        </h1>
        <p className="text-muted-foreground">
          Adaptive reminder system coming soon...
        </p>
      </div>
    </div>
  );
};

export default Reminders;