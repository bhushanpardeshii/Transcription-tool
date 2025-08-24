'use client';

import { AnalysisResult } from '@/lib/schemas';
import { AlertCircle, AlertTriangle, BookOpen, BriefcaseBusiness, CheckCircle, CircleQuestionMark, FileUser, GraduationCap, Lightbulb } from 'lucide-react';

interface AnalysisResultsProps {
  analysis: AnalysisResult;
}

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <GraduationCap className="w-6 h-6 text-green-600 mr-2" />
        Interview Analysis Results
      </h2>
      
      <div className="space-y-8">
        {/* Overview Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">Interview Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-sm text-blue-600 dark:text-blue-400">Type</p>
              <p className="text-lg font-semibold text-blue-900 dark:text-blue-100 capitalize">{analysis.interview_type}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-600 dark:text-blue-400">Sentiment</p>
              <div className="flex items-center justify-center">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                  analysis.overall_sentiment.toLowerCase() === 'positive' ? 'bg-green-500' :
                  analysis.overall_sentiment.toLowerCase() === 'negative' ? 'bg-red-500' :
                  analysis.overall_sentiment.toLowerCase() === 'mixed' ? 'bg-yellow-500' : 'bg-gray-500'
                }`}></span>
                <span className="text-lg font-semibold text-blue-900 dark:text-blue-100 capitalize">
                  {analysis.overall_sentiment}
                </span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-600 dark:text-blue-400">Flow Score</p>
              <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">{analysis.interview_flow_score}/10</p>
            </div>
          </div>
          <p className="text-blue-800 dark:text-blue-200 leading-relaxed">{analysis.summary}</p>
        </div>

        {/* Interviewee Feedback Section */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-6 flex items-center">
            <FileUser className="w-6 h-6 mr-2" />
            Feedback for Interviewee
          </h3>

          {/* Confidence Level */}
          <div className="mb-6">
            <div className="bg-white dark:bg-gray-700 rounded-lg p-4 max-w-sm">
              <h4 className="text-sm text-green-600 dark:text-green-400 mb-1">Confidence Level</h4>
              <span className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {analysis.interviewee_feedback.confidence_level}
              </span>
            </div>
          </div>

          {/* What Went Well */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center">
             <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              What Went Well
            </h4>
            <ul className="space-y-2">
              {analysis.interviewee_feedback.what_went_well.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-green-800 dark:text-green-200">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
              Areas for Improvement
            </h4>
            <ul className="space-y-2">
              {analysis.interviewee_feedback.areas_for_improvement.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-green-800 dark:text-green-200">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actionable Tips */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-blue-600" />
              Actionable Tips
            </h4>
            <ul className="space-y-2">
              {analysis.interviewee_feedback.actionable_tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span className="text-green-800 dark:text-green-200">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recruiter Feedback Section */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-6 flex items-center">
            <BriefcaseBusiness className="w-6 h-6 mr-2" />
            Feedback for Recruiter
          </h3>

          {/* Areas Missed */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
              Areas That May Have Been Missed
            </h4>
            <ul className="space-y-2">
              {analysis.recruiter_feedback.areas_missed.map((area, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-purple-800 dark:text-purple-200">{area}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Questions Not Asked */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3 flex items-center">
              <CircleQuestionMark className="w-5 h-5 mr-2 text-orange-600" />
              Valuable Questions Not Asked
            </h4>
            <ul className="space-y-2">
              {analysis.recruiter_feedback.questions_not_asked.map((question, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-purple-800 dark:text-purple-200">{question}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Missed Red Flags */}
          {analysis.recruiter_feedback.missed_red_flags.length > 0 && (
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                Potential Red Flags to Explore
              </h4>
              <ul className="space-y-2">
                {analysis.recruiter_feedback.missed_red_flags.map((flag, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-purple-800 dark:text-purple-200">{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Topics Discussed */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-3">Key Topics Discussed</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.key_topics_discussed.map((topic, index) => (
              <span 
                key={index}
                className="inline-block bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm font-medium"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Improvement Recommendations */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-4">Improvement Recommendations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-semibold text-yellow-800 dark:text-yellow-200 mb-3 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                For Next Interview
              </h4>
              <ul className="space-y-2">
                {analysis.improvement_recommendations.for_next_interview.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-yellow-800 dark:text-yellow-200 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-md font-semibold text-yellow-800 dark:text-yellow-200 mb-3 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Long-term Development
              </h4>
              <ul className="space-y-2">
                {analysis.improvement_recommendations.long_term_development.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-yellow-800 dark:text-yellow-200 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Raw Feedback (if available) */}
        {analysis.raw_feedback && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Raw AI Feedback</h3>
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{analysis.raw_feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
}
