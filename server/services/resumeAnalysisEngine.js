import pdfParse from 'pdf-parse';

/**
 * Resume Analysis Engine
 * Intelligently analyzes resumes section-by-section and provides scoring
 */

// Common skill keywords by role
const ROLE_SKILLS = {
  Frontend: ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'sass', 'tailwind', 'next.js', 'redux', 'webpack', 'vite'],
  Backend: ['node.js', 'express', 'python', 'django', 'flask', 'java', 'spring', 'php', 'laravel', 'ruby', 'rails', 'sql', 'mongodb', 'postgresql'],
  'Full Stack': ['react', 'node.js', 'express', 'mongodb', 'postgresql', 'rest api', 'graphql', 'docker', 'aws', 'git'],
  DevOps: ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'ci/cd', 'terraform', 'ansible', 'linux'],
  'Data Science': ['python', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'machine learning', 'data analysis', 'sql', 'jupyter'],
};

// Section detection patterns
const SECTION_PATTERNS = {
  personalInfo: /\b(email|phone|address|contact|linkedin|github|portfolio)\b/gi,
  summary: /\b(summary|profile|objective|about|overview)\b/gi,
  skills: /\b(skills|technical skills|competencies|technologies|tools)\b/gi,
  workExperience: /\b(experience|work|employment|career|professional experience|work history)\b/gi,
  education: /\b(education|academic|university|college|degree|bachelor|master|phd)\b/gi,
  projects: /\b(projects|project|portfolio|personal projects)\b/gi,
  certifications: /\b(certifications|certificate|certified|certification)\b/gi,
};

/**
 * Extract text from PDF buffer
 */
export const extractTextFromPDF = async (pdfBuffer) => {
  try {
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (error) {
    throw new Error('Failed to extract text from PDF: ' + error.message);
  }
};

/**
 * Normalize resume text
 */
const normalizeText = (text) => {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim();
};

/**
 * Detect resume sections
 */
export const detectSections = (text) => {
  const normalizedText = normalizeText(text);
  const sections = {};

  for (const [section, pattern] of Object.entries(SECTION_PATTERNS)) {
    const matches = normalizedText.match(pattern);
    sections[section] = matches && matches.length > 0;
  }

  // Additional heuristics
  // Check for email pattern
  if (!sections.personalInfo && /[\w.-]+@[\w.-]+\.\w+/.test(normalizedText)) {
    sections.personalInfo = true;
  }

  // Check for phone pattern
  if (!sections.personalInfo && /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(normalizedText)) {
    sections.personalInfo = true;
  }

  // Check for education keywords in text
  if (!sections.education && /\b(b\.?s\.?|b\.?a\.?|m\.?s\.?|m\.?a\.?|ph\.?d\.?|bachelor|master|doctorate)\b/gi.test(normalizedText)) {
    sections.education = true;
  }

  // Check for work experience indicators
  if (!sections.workExperience && /\b(worked|employed|position|role|job|developer|engineer|manager)\b/gi.test(normalizedText)) {
    sections.workExperience = true;
  }

  return sections;
};

/**
 * Extract skills from resume text
 */
export const extractSkills = (text) => {
  const normalizedText = normalizeText(text).toLowerCase();
  const allSkills = [];
  
  // Combine all role skills
  const skillSet = new Set();
  Object.values(ROLE_SKILLS).flat().forEach(skill => skillSet.add(skill.toLowerCase()));
  
  // Add common technical terms
  const commonSkills = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
    'react', 'vue', 'angular', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel',
    'mongodb', 'postgresql', 'mysql', 'redis', 'sql', 'nosql',
    'html', 'css', 'sass', 'tailwind', 'bootstrap',
    'git', 'github', 'docker', 'kubernetes', 'aws', 'azure', 'gcp',
    'rest api', 'graphql', 'microservices', 'agile', 'scrum',
    'machine learning', 'ai', 'data science', 'tensorflow', 'pytorch',
  ];
  
  commonSkills.forEach(skill => skillSet.add(skill.toLowerCase()));
  
  // Match skills in text
  skillSet.forEach(skill => {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    if (regex.test(normalizedText)) {
      allSkills.push(skill);
    }
  });
  
  return [...new Set(allSkills)]; // Remove duplicates
};

/**
 * Determine role fit based on skills
 */
export const determineRoleFit = (skills) => {
  const skillCounts = {};
  
  Object.keys(ROLE_SKILLS).forEach(role => {
    skillCounts[role] = 0;
    const roleSkills = ROLE_SKILLS[role].map(s => s.toLowerCase());
    skills.forEach(skill => {
      if (roleSkills.includes(skill.toLowerCase())) {
        skillCounts[role]++;
      }
    });
  });
  
  // Find role with highest match
  const bestFit = Object.entries(skillCounts).reduce((a, b) => 
    skillCounts[a[0]] > skillCounts[b[0]] ? a : b
  );
  
  return bestFit[1] > 0 ? bestFit[0] : 'Other';
};

/**
 * Calculate keyword density
 */
export const calculateKeywordDensity = (text) => {
  const normalizedText = normalizeText(text).toLowerCase();
  const words = normalizedText.split(/\s+/);
  const wordCount = words.length;
  const keywordMap = new Map();
  
  // Count occurrences of important keywords
  const importantKeywords = [
    'experience', 'skills', 'project', 'education', 'achievement',
    'developed', 'implemented', 'managed', 'led', 'created', 'designed',
  ];
  
  importantKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = normalizedText.match(regex);
    const count = matches ? matches.length : 0;
    const density = wordCount > 0 ? (count / wordCount) * 100 : 0;
    keywordMap.set(keyword, parseFloat(density.toFixed(2)));
  });
  
  return Object.fromEntries(keywordMap);
};

/**
 * Score personal information section
 */
const scorePersonalInfo = (text, detectedSections) => {
  let score = 0;
  const normalizedText = normalizeText(text).toLowerCase();
  
  // Email (30 points)
  if (/[\w.-]+@[\w.-]+\.\w+/.test(text)) score += 30;
  
  // Phone (20 points)
  if (/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text)) score += 20;
  
  // LinkedIn (15 points)
  if (/linkedin\.com|linkedin/.test(normalizedText)) score += 15;
  
  // GitHub/Portfolio (15 points)
  if (/github\.com|github|portfolio|website/.test(normalizedText)) score += 15;
  
  // Location/Address (10 points)
  if (/\b(address|location|city|state|country)\b/gi.test(normalizedText)) score += 10;
  
  // Section header detected (10 points)
  if (detectedSections.personalInfo) score += 10;
  
  return Math.min(score, 100);
};

/**
 * Score summary section
 */
const scoreSummary = (text, detectedSections) => {
  let score = 0;
  const normalizedText = normalizeText(text);
  
  if (!detectedSections.summary) return 0;
  
  // Find summary section (usually first 200-300 words)
  const summaryMatch = normalizedText.match(/(?:summary|profile|objective|about|overview)[\s\S]{0,500}/i);
  if (!summaryMatch) return 20;
  
  const summaryText = summaryMatch[0];
  const wordCount = summaryText.split(/\s+/).length;
  
  // Length check (30 points) - ideal 50-150 words
  if (wordCount >= 50 && wordCount <= 150) score += 30;
  else if (wordCount >= 30 && wordCount <= 200) score += 20;
  else if (wordCount > 0) score += 10;
  
  // Keywords (40 points)
  const keywords = ['experience', 'skills', 'professional', 'developer', 'engineer', 'passionate', 'expertise'];
  const foundKeywords = keywords.filter(kw => summaryText.toLowerCase().includes(kw.toLowerCase())).length;
  score += (foundKeywords / keywords.length) * 40;
  
  // Action words (30 points)
  const actionWords = ['developed', 'created', 'implemented', 'managed', 'led', 'achieved', 'designed'];
  const foundActions = actionWords.filter(aw => summaryText.toLowerCase().includes(aw.toLowerCase())).length;
  score += (foundActions / actionWords.length) * 30;
  
  return Math.min(score, 100);
};

/**
 * Score skills section
 */
const scoreSkills = (text, detectedSections, extractedSkills) => {
  let score = 0;
  
  if (!detectedSections.skills && extractedSkills.length === 0) return 0;
  
  // Skills detected (40 points)
  if (detectedSections.skills) score += 40;
  
  // Number of skills (30 points) - ideal 10-20 skills
  if (extractedSkills.length >= 15) score += 30;
  else if (extractedSkills.length >= 10) score += 25;
  else if (extractedSkills.length >= 5) score += 20;
  else if (extractedSkills.length > 0) score += 10;
  
  // Skill categorization (30 points)
  const categories = {
    languages: ['javascript', 'python', 'java', 'typescript', 'c++', 'c#'],
    frameworks: ['react', 'vue', 'angular', 'node.js', 'express', 'django'],
    tools: ['git', 'docker', 'aws', 'mongodb', 'postgresql'],
  };
  
  let categoryCount = 0;
  Object.values(categories).forEach(catSkills => {
    if (catSkills.some(skill => extractedSkills.some(es => es.toLowerCase().includes(skill.toLowerCase())))) {
      categoryCount++;
    }
  });
  
  score += (categoryCount / Object.keys(categories).length) * 30;
  
  return Math.min(score, 100);
};

/**
 * Score work experience section
 */
const scoreWorkExperience = (text, detectedSections) => {
  let score = 0;
  const normalizedText = normalizeText(text);
  
  if (!detectedSections.workExperience) return 0;
  
  // Find experience section
  const expMatch = normalizedText.match(/(?:experience|work|employment)[\s\S]+?(?=(?:education|projects|skills|$))/i);
  if (!expMatch) return 20;
  
  const expText = expMatch[0];
  
  // Bullet points (30 points)
  const bulletPoints = (expText.match(/[•\-\*]\s/g) || []).length;
  if (bulletPoints >= 6) score += 30;
  else if (bulletPoints >= 4) score += 25;
  else if (bulletPoints >= 2) score += 20;
  else if (bulletPoints > 0) score += 10;
  
  // Action verbs (30 points)
  const actionVerbs = ['developed', 'created', 'implemented', 'designed', 'built', 'managed', 'led', 'achieved', 'improved', 'optimized'];
  const foundVerbs = actionVerbs.filter(verb => expText.toLowerCase().includes(verb.toLowerCase())).length;
  score += (foundVerbs / actionVerbs.length) * 30;
  
  // Quantifiable achievements (30 points)
  const quantifiers = /\b(\d+%|\d+\+|\$?\d+[kKmMbB]?|increased|decreased|reduced|improved)\b/gi;
  const quantMatches = expText.match(quantifiers);
  if (quantMatches && quantMatches.length >= 3) score += 30;
  else if (quantMatches && quantMatches.length >= 1) score += 20;
  
  // Company names and dates (10 points)
  if (/\b(20\d{2}|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/gi.test(expText)) score += 10;
  
  return Math.min(score, 100);
};

/**
 * Score education section
 */
const scoreEducation = (text, detectedSections) => {
  let score = 0;
  const normalizedText = normalizeText(text);
  
  if (!detectedSections.education) return 0;
  
  // Degree mentioned (40 points)
  if (/\b(b\.?s\.?|b\.?a\.?|m\.?s\.?|m\.?a\.?|ph\.?d\.?|bachelor|master|doctorate|degree)\b/gi.test(normalizedText)) {
    score += 40;
  }
  
  // University/College name (30 points)
  if (/\b(university|college|institute|school)\b/gi.test(normalizedText)) {
    score += 30;
  }
  
  // Graduation year or GPA (20 points)
  if (/\b(20\d{2}|gpa|grade|cgpa)\b/gi.test(normalizedText)) {
    score += 20;
  }
  
  // Field of study (10 points)
  if (/\b(computer science|engineering|information technology|software|cs|it)\b/gi.test(normalizedText)) {
    score += 10;
  }
  
  return Math.min(score, 100);
};

/**
 * Score projects section
 */
const scoreProjects = (text, detectedSections) => {
  let score = 0;
  const normalizedText = normalizeText(text);
  
  if (!detectedSections.projects) return 0;
  
  // Project mentions (50 points)
  const projectCount = (normalizedText.match(/\bproject\b/gi) || []).length;
  if (projectCount >= 3) score += 50;
  else if (projectCount >= 2) score += 40;
  else if (projectCount >= 1) score += 30;
  
  // Technologies mentioned (30 points)
  const techKeywords = ['github', 'deployed', 'technologies', 'stack', 'built with'];
  const foundTech = techKeywords.filter(kw => normalizedText.includes(kw.toLowerCase())).length;
  score += (foundTech / techKeywords.length) * 30;
  
  // Links/URLs (20 points)
  if (/github\.com|http|www\.|\.com|\.io/.test(normalizedText)) score += 20;
  
  return Math.min(score, 100);
};

/**
 * Score certifications section
 */
const scoreCertifications = (text, detectedSections) => {
  let score = 0;
  
  if (!detectedSections.certifications) return 0;
  
  // Certification mentions
  const certCount = (text.match(/\b(certified|certification|certificate)\b/gi) || []).length;
  if (certCount >= 2) score = 100;
  else if (certCount >= 1) score = 70;
  
  return score;
};

/**
 * Score formatting quality
 */
const scoreFormatting = (text) => {
  let score = 0;
  
  // Consistent spacing (20 points)
  const lineBreaks = (text.match(/\n/g) || []).length;
  if (lineBreaks >= 10 && lineBreaks <= 50) score += 20;
  else if (lineBreaks > 0) score += 10;
  
  // Section headers (30 points)
  const headers = (text.match(/^[A-Z][A-Z\s]{3,}$/gm) || []).length;
  if (headers >= 4) score += 30;
  else if (headers >= 2) score += 20;
  else if (headers >= 1) score += 10;
  
  // Bullet points (25 points)
  const bullets = (text.match(/[•\-\*]\s/g) || []).length;
  if (bullets >= 5) score += 25;
  else if (bullets >= 3) score += 20;
  else if (bullets >= 1) score += 10;
  
  // Length check (25 points) - ideal 1-2 pages
  const wordCount = text.split(/\s+/).length;
  if (wordCount >= 300 && wordCount <= 800) score += 25;
  else if (wordCount >= 200 && wordCount <= 1000) score += 20;
  else if (wordCount > 0) score += 10;
  
  return Math.min(score, 100);
};

/**
 * Calculate ATS compatibility score
 */
export const calculateATSScore = (text, detectedSections, extractedSkills) => {
  let score = 0;
  
  // Required sections (40 points)
  const requiredSections = ['personalInfo', 'workExperience', 'education', 'skills'];
  const foundSections = requiredSections.filter(sec => detectedSections[sec]).length;
  score += (foundSections / requiredSections.length) * 40;
  
  // Keywords/Skills (30 points)
  if (extractedSkills.length >= 10) score += 30;
  else if (extractedSkills.length >= 5) score += 20;
  else if (extractedSkills.length > 0) score += 10;
  
  // Formatting (20 points)
  const formattingScore = scoreFormatting(text);
  score += (formattingScore / 100) * 20;
  
  // Contact information (10 points)
  if (detectedSections.personalInfo) {
    if (/[\w.-]+@[\w.-]+\.\w+/.test(text) && /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text)) {
      score += 10;
    }
  }
  
  return Math.min(Math.round(score), 100);
};

/**
 * Generate feedback suggestions
 */
export const generateFeedback = (text, detectedSections, sectionScores, extractedSkills, atsScore) => {
  const feedback = [];
  
  // Personal Info feedback
  if (sectionScores.personalInfo < 70) {
    feedback.push({
      section: 'Personal Information',
      type: 'warning',
      message: 'Ensure your resume includes email, phone number, and LinkedIn profile for better visibility.',
      priority: 'high',
    });
  }
  
  // Summary feedback
  if (!detectedSections.summary) {
    feedback.push({
      section: 'Summary',
      type: 'error',
      message: 'Add a professional summary section (50-150 words) highlighting your key qualifications and experience.',
      priority: 'high',
    });
  } else if (sectionScores.summary < 60) {
    feedback.push({
      section: 'Summary',
      type: 'warning',
      message: 'Improve your summary by including more action verbs and quantifiable achievements.',
      priority: 'medium',
    });
  }
  
  // Skills feedback
  if (extractedSkills.length < 5) {
    feedback.push({
      section: 'Skills',
      type: 'warning',
      message: 'Include more relevant technical skills. Aim for 10-15 skills across different categories.',
      priority: 'high',
    });
  }
  
  // Work Experience feedback
  if (!detectedSections.workExperience) {
    feedback.push({
      section: 'Work Experience',
      type: 'error',
      message: 'Work experience section is missing. This is critical for most job applications.',
      priority: 'high',
    });
  } else if (sectionScores.workExperience < 60) {
    feedback.push({
      section: 'Work Experience',
      type: 'warning',
      message: 'Enhance your work experience with more bullet points, action verbs, and quantifiable achievements.',
      priority: 'high',
    });
  }
  
  // Education feedback
  if (!detectedSections.education) {
    feedback.push({
      section: 'Education',
      type: 'error',
      message: 'Add your education details including degree, university, and graduation year.',
      priority: 'high',
    });
  }
  
  // Projects feedback
  if (!detectedSections.projects && extractedSkills.length > 0) {
    feedback.push({
      section: 'Projects',
      type: 'info',
      message: 'Consider adding a projects section to showcase your practical experience and skills.',
      priority: 'medium',
    });
  }
  
  // ATS feedback
  if (atsScore < 60) {
    feedback.push({
      section: 'ATS Compatibility',
      type: 'warning',
      message: 'Your resume has low ATS compatibility. Ensure all required sections are present and properly formatted.',
      priority: 'high',
    });
  }
  
  // Formatting feedback
  if (sectionScores.formatting < 60) {
    feedback.push({
      section: 'Formatting',
      type: 'warning',
      message: 'Improve resume formatting with consistent spacing, clear section headers, and bullet points.',
      priority: 'medium',
    });
  }
  
  return feedback;
};

/**
 * Determine resume strength level
 */
export const determineResumeStrength = (resumeScore) => {
  if (resumeScore >= 75) return 'Industry Ready';
  if (resumeScore >= 50) return 'Intermediate';
  return 'Beginner';
};

/**
 * Extract skills from job description
 */
export const extractJobSkills = (jobDescription) => {
  if (!jobDescription) return [];
  
  const normalizedText = normalizeText(jobDescription).toLowerCase();
  const allSkills = [];
  
  // Combine all role skills
  const skillSet = new Set();
  Object.values(ROLE_SKILLS).flat().forEach(skill => skillSet.add(skill.toLowerCase()));
  
  // Add common technical terms
  const commonSkills = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
    'react', 'vue', 'angular', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel',
    'mongodb', 'postgresql', 'mysql', 'redis', 'sql', 'nosql',
    'html', 'css', 'sass', 'tailwind', 'bootstrap',
    'git', 'github', 'docker', 'kubernetes', 'aws', 'azure', 'gcp',
    'rest api', 'graphql', 'microservices', 'agile', 'scrum',
    'machine learning', 'ai', 'data science', 'tensorflow', 'pytorch',
  ];
  
  commonSkills.forEach(skill => skillSet.add(skill.toLowerCase()));
  
  // Match skills in job description
  skillSet.forEach(skill => {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    if (regex.test(normalizedText)) {
      allSkills.push(skill);
    }
  });
  
  return [...new Set(allSkills)]; // Remove duplicates
};

/**
 * Match resume skills against job requirements
 */
export const matchResumeToJob = (resumeSkills, jobSkills) => {
  if (!jobSkills || jobSkills.length === 0) {
    return {
      matchScore: 0,
      matchedSkills: [],
      missingSkills: [],
    };
  }

  const resumeSkillsLower = resumeSkills.map(s => s.toLowerCase());
  const jobSkillsLower = jobSkills.map(s => s.toLowerCase());
  
  // Find matched skills
  const matchedSkills = jobSkillsLower.filter(jobSkill => 
    resumeSkillsLower.some(resumeSkill => 
      resumeSkill.includes(jobSkill) || jobSkill.includes(resumeSkill)
    )
  );
  
  // Find missing skills
  const missingSkills = jobSkillsLower.filter(jobSkill => 
    !resumeSkillsLower.some(resumeSkill => 
      resumeSkill.includes(jobSkill) || jobSkill.includes(resumeSkill)
    )
  );
  
  // Calculate match score (percentage of job skills found in resume)
  const matchScore = jobSkills.length > 0 
    ? Math.round((matchedSkills.length / jobSkills.length) * 100)
    : 0;
  
  return {
    matchScore,
    matchedSkills: matchedSkills.map(s => {
      // Return original case from jobSkills
      const index = jobSkillsLower.indexOf(s);
      return jobSkills[index] || s;
    }),
    missingSkills: missingSkills.map(s => {
      const index = jobSkillsLower.indexOf(s);
      return jobSkills[index] || s;
    }),
  };
};

/**
 * Main analysis function
 */
export const analyzeResume = async (pdfBuffer, fileName = 'resume.pdf', jobDescription = null) => {
  try {
    // Extract text
    const resumeText = await extractTextFromPDF(pdfBuffer);
    
    // Detect sections
    const detectedSections = detectSections(resumeText);
    
    // Extract skills
    const extractedSkills = extractSkills(resumeText);
    
    // Determine role fit
    const roleFit = determineRoleFit(extractedSkills);
    
    // Calculate section scores
    const sectionScores = {
      personalInfo: scorePersonalInfo(resumeText, detectedSections),
      summary: scoreSummary(resumeText, detectedSections),
      skills: scoreSkills(resumeText, detectedSections, extractedSkills),
      workExperience: scoreWorkExperience(resumeText, detectedSections),
      education: scoreEducation(resumeText, detectedSections),
      projects: scoreProjects(resumeText, detectedSections),
      certifications: scoreCertifications(resumeText, detectedSections),
      formatting: scoreFormatting(resumeText),
    };
    
    // Calculate overall resume score (weighted average)
    const weights = {
      personalInfo: 0.05,
      summary: 0.10,
      skills: 0.20,
      workExperience: 0.30,
      education: 0.15,
      projects: 0.10,
      certifications: 0.05,
      formatting: 0.05,
    };
    
    let overallScore = 0;
    Object.keys(weights).forEach(section => {
      overallScore += sectionScores[section] * weights[section];
    });
    overallScore = Math.round(overallScore);
    
    // Calculate ATS score
    const atsScore = calculateATSScore(resumeText, detectedSections, extractedSkills);
    
    // Determine resume strength
    const resumeStrength = determineResumeStrength(overallScore);
    
    // Generate feedback
    const feedback = generateFeedback(resumeText, detectedSections, sectionScores, extractedSkills, atsScore);
    
    // Calculate keyword density
    const keywordDensity = calculateKeywordDensity(resumeText);
    
    // Determine missing skills (common skills not found)
    const allCommonSkills = Object.values(ROLE_SKILLS).flat();
    const missingSkills = allCommonSkills
      .filter(skill => !extractedSkills.some(es => es.toLowerCase().includes(skill.toLowerCase())))
      .slice(0, 10); // Limit to top 10
    
    // Job matching (if job description provided)
    let jobMatch = null;
    if (jobDescription) {
      const jobSkills = extractJobSkills(jobDescription);
      jobMatch = matchResumeToJob(extractedSkills, jobSkills);
    }
    
    return {
      resumeText,
      fileName,
      jobDescription: jobDescription || null,
      detectedSections,
      sectionScores,
      extractedSkills,
      matchedSkills: jobMatch ? jobMatch.matchedSkills : extractedSkills,
      missingSkills: jobMatch ? jobMatch.missingSkills : missingSkills,
      jobMatchScore: jobMatch ? jobMatch.matchScore : null,
      atsScore,
      roleFit,
      resumeScore: overallScore,
      resumeStrength,
      feedback,
      keywordDensity,
    };
  } catch (error) {
    throw new Error('Resume analysis failed: ' + error.message);
  }
};

