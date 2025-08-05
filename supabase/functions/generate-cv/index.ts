import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { profile, jobDescription } = await req.json();

    if (!profile || !jobDescription) {
      throw new Error('Profile and job description are required');
    }

    // Prepare profile data for AI processing
    const profileSummary = {
      name: profile.full_name,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      linkedin: profile.linkedin,
      github: profile.github,
      summary: profile.personal_summary,
      skills: profile.skills?.map((s: any) => s.skill_name) || [],
      experience: profile.work_experience || [],
      education: profile.education || [],
      certifications: profile.certifications || [],
      languages: profile.languages || [],
      tone: profile.tone || 'Professional and warm'
    };

    console.log('Generating CV and cover letter for:', profile.full_name);

    // Generate CV
    const cvResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert CV writer. Create an ATS-compliant CV that:
            1. Matches keywords from the job description
            2. Uses standard headings (no tables, simple formatting)
            3. Highlights relevant experience and skills
            4. Uses bullet points with measurable achievements
            5. Tailors the professional summary to the job
            6. Removes or minimizes irrelevant experience
            
            Format the CV with clear sections: Contact Info, Professional Summary, Skills, Experience, Education, Certifications.`
          },
          {
            role: 'user',
            content: `Profile: ${JSON.stringify(profileSummary, null, 2)}
            
            Job Description: ${jobDescription}
            
            Generate a tailored, ATS-optimized CV.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const cvData = await cvResponse.json();
    const generatedCV = cvData.choices[0].message.content;

    // Generate Cover Letter
    const coverLetterResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert cover letter writer. Create a compelling cover letter that:
            1. Addresses the company (extract from job description) or "Dear Hiring Manager"
            2. Mentions the specific job title
            3. Shows alignment with job requirements using past experience
            4. Reflects passion and confidence
            5. Includes a call to action
            6. Keeps it under 350 words
            7. Uses the specified tone: ${profileSummary.tone}`
          },
          {
            role: 'user',
            content: `Profile: ${JSON.stringify(profileSummary, null, 2)}
            
            Job Description: ${jobDescription}
            
            Generate a tailored cover letter that demonstrates how this candidate is perfect for this specific role.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const coverLetterData = await coverLetterResponse.json();
    const generatedCoverLetter = coverLetterData.choices[0].message.content;

    console.log('Successfully generated CV and cover letter');

    return new Response(JSON.stringify({ 
      cv: generatedCV,
      coverLetter: generatedCoverLetter 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-cv function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});