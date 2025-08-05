import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CVProfileManagerProps {
  userId: string;
  profile: any;
  onProfileUpdate: () => void;
}

export const CVProfileManager = ({ userId, profile, onProfileUpdate }: CVProfileManagerProps) => {
  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    location: "",
    personal_summary: "",
    tone: "Professional and warm"
  });
  const [skills, setSkills] = useState<any[]>([]);
  const [workExperience, setWorkExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        linkedin: profile.linkedin || "",
        github: profile.github || "",
        location: profile.location || "",
        personal_summary: profile.personal_summary || "",
        tone: profile.tone || "Professional and warm"
      });
      setSkills(profile.skills || []);
      setWorkExperience(profile.work_experience || []);
      setEducation(profile.education || []);
      setCertifications(profile.certifications || []);
      setLanguages(profile.languages || []);
    }
  }, [profile]);

  const saveProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          user_id: userId,
          ...profileData
        });

      if (error) throw error;

      toast({
        title: "Profile Saved",
        description: "Your profile has been updated successfully.",
      });
      onProfileUpdate();
    } catch (error: any) {
      toast({
        title: "Save Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addSkill = async () => {
    const skillName = prompt("Enter skill name:");
    if (!skillName) return;

    try {
      const { error } = await supabase
        .from("skills")
        .insert({
          user_id: userId,
          skill_name: skillName,
          category: "General"
        });

      if (error) throw error;
      onProfileUpdate();
      toast({
        title: "Skill Added",
        description: "New skill has been added to your profile.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteSkill = async (skillId: string) => {
    try {
      const { error } = await supabase
        .from("skills")
        .delete()
        .eq("id", skillId);

      if (error) throw error;
      onProfileUpdate();
      toast({
        title: "Skill Deleted",
        description: "Skill has been removed from your profile.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addWorkExperience = async () => {
    const jobTitle = prompt("Job Title:");
    const company = prompt("Company:");
    const startDate = prompt("Start Date (e.g., June 2025):");
    
    if (!jobTitle || !company || !startDate) return;

    try {
      const { error } = await supabase
        .from("work_experience")
        .insert({
          user_id: userId,
          job_title: jobTitle,
          company: company,
          start_date: startDate,
          end_date: "Present",
          responsibilities: ["Responsibility 1", "Responsibility 2"]
        });

      if (error) throw error;
      onProfileUpdate();
      toast({
        title: "Work Experience Added",
        description: "New work experience has been added.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Full Name"
              value={profileData.full_name}
              onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
            />
            <Input
              placeholder="Email"
              value={profileData.email}
              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            />
            <Input
              placeholder="Phone"
              value={profileData.phone}
              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
            />
            <Input
              placeholder="Location"
              value={profileData.location}
              onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
            />
            <Input
              placeholder="LinkedIn URL"
              value={profileData.linkedin}
              onChange={(e) => setProfileData(prev => ({ ...prev, linkedin: e.target.value }))}
            />
            <Input
              placeholder="GitHub URL"
              value={profileData.github}
              onChange={(e) => setProfileData(prev => ({ ...prev, github: e.target.value }))}
            />
          </div>
          
          <Textarea
            placeholder="Professional Summary"
            value={profileData.personal_summary}
            onChange={(e) => setProfileData(prev => ({ ...prev, personal_summary: e.target.value }))}
            rows={4}
          />

          <Button onClick={saveProfile} disabled={loading} className="w-full">
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="skills" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="certs">Certifications</TabsTrigger>
        </TabsList>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Skills</CardTitle>
                <Button onClick={addSkill} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex justify-between items-center p-2 bg-muted rounded">
                    <span>{skill.skill_name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSkill(skill.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Work Experience</CardTitle>
                <Button onClick={addWorkExperience} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workExperience.map((exp) => (
                  <div key={exp.id} className="p-4 bg-muted rounded">
                    <h4 className="font-medium">{exp.job_title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {exp.company} | {exp.start_date} - {exp.end_date}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="p-4 bg-muted rounded">
                    <h4 className="font-medium">{edu.degree}</h4>
                    <p className="text-sm text-muted-foreground">
                      {edu.institution} | {edu.start_year} - {edu.end_year}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certs">
          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.id} className="p-4 bg-muted rounded">
                    <h4 className="font-medium">{cert.certification_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {cert.issuing_organization}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};