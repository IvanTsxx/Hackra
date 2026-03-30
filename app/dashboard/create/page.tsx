import { CreateHackathonForm } from "./_components/create-form";

export const metadata = {
  description: "Create a new hackathon event",
  title: "Create Hackathon - Hackra",
};

export default function CreateHackathonPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create Hackathon</h1>
          <p className="text-muted-foreground">
            Launch your own hackathon event and connect with developers
            worldwide
          </p>
        </div>

        <div className="max-w-2xl">
          <CreateHackathonForm />
        </div>
      </div>
    </main>
  );
}
