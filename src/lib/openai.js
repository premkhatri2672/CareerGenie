import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';

const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
});

export const analyzeResume = async (text, targetRole) => {
  const mlApiUrl = import.meta.env.VITE_ML_API_URL;
  
  if (mlApiUrl) {
    try {
      console.log(`Connecting to local ML API: ${mlApiUrl}/api/analyze`);
      const response = await fetch(`${mlApiUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text,
          target_role: targetRole || 'Software Engineer'
        })
      });

      if (response.ok) {
        const mlResult = await response.json();
        console.log('Analysis completed successfully via local ML API Model:', mlResult);
        return {
          score: mlResult.score || 75,
          skills: mlResult.skills || [],
          missingSkills: mlResult.missingSkills || mlResult.missing_skills || [],
          roadmap: mlResult.roadmap || [],
          recommendedCourses: mlResult.recommendedCourses || mlResult.courses || []
        };
      } else {
        console.warn(`ML API failed with status ${response.status}. Falling back to OpenAI...`);
      }
    } catch (mlError) {
      console.warn('ML API unreachable. Falling back to OpenAI...', mlError);
    }
  }

  const prompt = `Analyze this resume text: ${text.substring(0, 4000)}. Target role: ${targetRole}.

Respond JSON:
{
  "score": 75,
  "skills": ["React", "JavaScript"],
  "missingSkills": ["TypeScript", "Next.js"],
  "roadmap": [
    "Learn TypeScript (2 weeks)",
    "Next.js course (3 weeks)",
    "Build portfolio (1 week)"
  ],
  "recommendedCourses": [
    "Udemy: Advanced React",
    "freeCodeCamp: TypeScript"
  ]
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' }
  });

  let rawContent = response.choices[0].message.content;
  
  // Strip markdown wraps if OpenAI returns them anyway
  if (rawContent.includes('```json')) {
    rawContent = rawContent.split('```json')[1].split('```')[0].trim();
  } else if (rawContent.includes('```')) {
    rawContent = rawContent.split('```')[1].split('```')[0].trim();
  }

  return JSON.parse(rawContent);
};

export default openai;
