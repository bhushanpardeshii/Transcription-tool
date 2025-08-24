import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables first
    if (!process.env.PERPLEXITY_API_KEY) {
      console.error('PERPLEXITY_API_KEY environment variable is not set');
      return NextResponse.json({ 
        error: 'Server configuration error: Missing Perplexity API key' 
      }, { status: 500 });
    }

    const body = await request.json();
    const { transcript } = body;
    
    if (!transcript || typeof transcript !== 'string' || transcript.trim().length === 0) {
      return NextResponse.json({ 
        error: 'No transcript provided or transcript is empty' 
      }, { status: 400 });
    }

    // Log transcript information for debugging
    console.log(`Analyzing transcript with Perplexity: ${transcript.length} characters`);

    // Create a comprehensive prompt for interview transcript analysis
    const prompt = `
Please analyze the following interview transcript and provide comprehensive feedback for both interviewees and recruiters. Structure your response as a JSON object with the following fields:

1. "summary": A concise summary of the interview content (2-3 sentences)
2. "interview_type": Detected type of interview (technical, behavioral, panel, phone, etc.)
3. "overall_sentiment": Overall sentiment of the interview (positive, negative, neutral, mixed)
4. "interview_flow_score": How well the interview flowed (scale 1-10)

5. "interviewee_feedback": {
   "what_went_well": Array of things the interviewee did well
   "areas_for_improvement": Array of specific areas where the interviewee could improve
   "actionable_tips": Array of concrete, actionable advice for future interviews
   "confidence_level": Perceived confidence level (low, moderate, high)
}

6. "recruiter_feedback": {
   "areas_missed": Array of important areas or topics the recruiter may have missed exploring
   "questions_not_asked": Array of valuable questions the recruiter could have asked but didn't
   "missed_red_flags": Potential concerns or red flags that weren't adequately explored
}

7. "key_topics_discussed": Array of main topics covered in the interview
8. "improvement_recommendations": {
   "for_next_interview": Suggestions for immediate next steps
   "long_term_development": Areas for longer-term skill development
}

Analyze this as an interview scenario even if it's not explicitly stated. Look for patterns typical of job interviews such as questions about experience, skills, challenges, goals, etc.

Transcript to analyze:
"${transcript}"

Please respond with valid JSON only, no additional text or formatting.
`;

    try {
      console.log('Sending request to Perplexity AI...');
      
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'sonar-pro',
          messages: [
            {
              role: 'system',
              content: 'You are an expert interview analyst. Provide detailed, actionable feedback for both interviewees and recruiters based on interview transcripts. Always respond with valid JSON only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 4000,
          temperature: 0.2,
          top_p: 0.9,
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Perplexity API error:', response.status, response.statusText, errorData);
        
        if (response.status === 401) {
          return NextResponse.json({ 
            error: 'Invalid API key configuration' 
          }, { status: 500 });
        } else if (response.status === 429) {
          return NextResponse.json({ 
            error: 'API quota exceeded. Please try again later.' 
          }, { status: 429 });
        } else {
          throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      console.log('Received response from Perplexity AI');
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from Perplexity API');
      }

      const text = data.choices[0].message.content;
      console.log('Raw response length:', text.length);

      // Try to parse the response as JSON
      let analysis;
      try {
        // Clean the response text to ensure it's valid JSON
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        analysis = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error('Failed to parse Perplexity response as JSON:', parseError);
        console.error('Raw response:', text);
        
        // Fallback: return a structured response with the raw text
        analysis = {
          summary: "Analysis completed but response format was not structured.",
          interview_type: "unknown",
          overall_sentiment: "neutral",
          interview_flow_score: 7,
          interviewee_feedback: {
            what_went_well: ["Raw analysis provided in feedback section"],
            areas_for_improvement: ["Review the transcript analysis in the feedback section"],
            actionable_tips: ["Check the raw feedback for detailed analysis"],
            confidence_level: "moderate"
          },
          recruiter_feedback: {
            areas_missed: ["Raw analysis provided in feedback section"],
            questions_not_asked: ["Check the raw feedback for suggestions"],
            missed_red_flags: ["Check raw feedback for potential concerns"]
          },
          key_topics_discussed: ["General interview analysis"],
          improvement_recommendations: {
            for_next_interview: ["Review the raw feedback"],
            long_term_development: ["Check raw feedback for development suggestions"]
          },
          raw_feedback: text
        };
      }

      return NextResponse.json({ 
        success: true,
        analysis: analysis,
        metadata: {
          transcript_length: transcript.length,
          analysis_timestamp: new Date().toISOString(),
          model_used: "sonar-pro"
        }
      });

    } catch (perplexityError) {
      console.error('Perplexity API error:', perplexityError);
      throw perplexityError;
    }

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ 
      error: 'Failed to analyze transcript', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
