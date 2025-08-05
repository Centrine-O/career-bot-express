import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { CVGenerator } from "./CVGenerator";
import { CVProfileManager } from "./CVProfileManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CVDashboardProps {
  user: User;
}

export const CVDashboard = ({ user }: CVDashboardProps) => {
  const [jobDescription, setJobDescription] = useState("");
  const [generatedCV, setGeneratedCV] = useState("");
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, [user.id]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          skills(*),
          work_experience(*),
          education(*),
          certifications(*),
          languages(*)
        `)
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      setProfile(data);
    } catch (error: any) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generateDocuments = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Missing Job Description",
        description: "Please paste the job description first.",
        variant: "destructive",
      });
      return;
    }

    if (!profile) {
      toast({
        title: "Missing Profile",
        description: "Please complete your CV profile first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-cv", {
        body: {
          profile,
          jobDescription,
        },
      });

      if (error) throw error;

      setGeneratedCV(data.cv);
      setGeneratedCoverLetter(data.coverLetter);
      
      toast({
        title: "Success!",
        description: "Your tailored CV and cover letter have been generated.",
      });
    } catch (error: any) {
      toast({
        title: "Generation Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI CV Generator</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user.email}
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="generator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generator">CV Generator</TabsTrigger>
            <TabsTrigger value="profile">Manage Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Tailored CV & Cover Letter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Job Description
                  </label>
                  <Textarea
                    placeholder="Paste the complete job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={8}
                    className="resize-none"
                  />
                </div>
                
                <Button 
                  onClick={generateDocuments} 
                  disabled={loading || !profile}
                  className="w-full"
                  size="lg"
                >
                  {loading ? "Generating..." : "Generate CV & Cover Letter"}
                </Button>

                {!profile && (
                  <p className="text-sm text-muted-foreground text-center">
                    Complete your profile first in the "Manage Profile" tab
                  </p>
                )}
              </CardContent>
            </Card>

            {(generatedCV || generatedCoverLetter) && (
              <CVGenerator 
                cv={generatedCV}
                coverLetter={generatedCoverLetter}
              />
            )}
          </TabsContent>

          <TabsContent value="profile">
            <CVProfileManager 
              userId={user.id} 
              profile={profile}
              onProfileUpdate={fetchProfile}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};