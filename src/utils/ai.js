import { analyzeResume } from '../lib/openai.js'
import { parseResume } from '../lib/pdf.js'
import { getSession } from './auth.js'
import { supabase } from '../lib/supabase.js'

// ─── COMPREHENSIVE ROLE KNOWLEDGE BASE ──────────────────────────────────────
const ROLE_KNOWLEDGE_BASE = {
  frontend: {
    title: 'Frontend Developer',
    requiredSkills: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Next.js', 'TailwindCSS', 'Git', 'REST APIs', 'Jest', 'Redux', 'Webpack', 'Sass'],
    salary: { junior: { inr: '4-8 LPA', usd: '$55k-$80k' }, mid: { inr: '8-18 LPA', usd: '$80k-$120k' }, senior: { inr: '18-40 LPA', usd: '$120k-$180k' } },
    marketDemand: 'Very High',
    demandTrend: '+32% YoY',
    topCompanies: ['Google', 'Meta', 'Airbnb', 'Shopify', 'Vercel', 'Netflix'],
    jobOpenings: '142,000+',
    avgTimeToHire: '3-5 months'
  },
  backend: {
    title: 'Backend Developer',
    requiredSkills: ['Node.js', 'Python', 'Express', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'REST APIs', 'GraphQL', 'SQL', 'AWS', 'Kubernetes', 'Java'],
    salary: { junior: { inr: '5-10 LPA', usd: '$60k-$90k' }, mid: { inr: '10-22 LPA', usd: '$90k-$130k' }, senior: { inr: '22-50 LPA', usd: '$130k-$200k' } },
    marketDemand: 'High',
    demandTrend: '+28% YoY',
    topCompanies: ['Amazon', 'Microsoft', 'Stripe', 'Uber', 'Twitter', 'Atlassian'],
    jobOpenings: '118,000+',
    avgTimeToHire: '4-6 months'
  },
  fullstack: {
    title: 'Fullstack Developer',
    requiredSkills: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'PostgreSQL', 'MongoDB', 'Docker', 'REST APIs', 'Git', 'AWS', 'GraphQL', 'Next.js'],
    salary: { junior: { inr: '6-12 LPA', usd: '$65k-$95k' }, mid: { inr: '12-25 LPA', usd: '$95k-$140k' }, senior: { inr: '25-55 LPA', usd: '$140k-$210k' } },
    marketDemand: 'Very High',
    demandTrend: '+38% YoY',
    topCompanies: ['Startups', 'GitHub', 'Figma', 'Notion', 'Linear', 'Supabase'],
    jobOpenings: '95,000+',
    avgTimeToHire: '3-4 months'
  },
  datascience: {
    title: 'Data Scientist',
    requiredSkills: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'Machine Learning', 'SQL', 'TensorFlow', 'PyTorch', 'Tableau', 'R', 'Statistics', 'Deep Learning', 'Spark'],
    salary: { junior: { inr: '6-12 LPA', usd: '$70k-$100k' }, mid: { inr: '12-28 LPA', usd: '$100k-$150k' }, senior: { inr: '28-60 LPA', usd: '$150k-$220k' } },
    marketDemand: 'Extremely High',
    demandTrend: '+45% YoY',
    topCompanies: ['Google DeepMind', 'OpenAI', 'Netflix', 'Spotify', 'Palantir', 'Databricks'],
    jobOpenings: '87,000+',
    avgTimeToHire: '5-7 months'
  },
  mleng: {
    title: 'Machine Learning Engineer',
    requiredSkills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-Learn', 'Deep Learning', 'MLOps', 'Docker', 'Kubernetes', 'AWS SageMaker', 'Spark', 'SQL', 'NumPy', 'CUDA'],
    salary: { junior: { inr: '8-15 LPA', usd: '$85k-$120k' }, mid: { inr: '15-35 LPA', usd: '$120k-$180k' }, senior: { inr: '35-80 LPA', usd: '$180k-$280k' } },
    marketDemand: 'Explosive',
    demandTrend: '+62% YoY',
    topCompanies: ['OpenAI', 'Anthropic', 'Google', 'Meta AI', 'Hugging Face', 'DeepMind'],
    jobOpenings: '54,000+',
    avgTimeToHire: '6-8 months'
  },
  devops: {
    title: 'DevOps Engineer',
    requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Linux', 'Jenkins', 'Ansible', 'Git', 'Bash', 'Python', 'Prometheus', 'Grafana'],
    salary: { junior: { inr: '5-10 LPA', usd: '$65k-$95k' }, mid: { inr: '10-24 LPA', usd: '$95k-$140k' }, senior: { inr: '24-55 LPA', usd: '$140k-$200k' } },
    marketDemand: 'High',
    demandTrend: '+25% YoY',
    topCompanies: ['HashiCorp', 'GitLab', 'RedHat', 'AWS', 'Google Cloud', 'DigitalOcean'],
    jobOpenings: '73,000+',
    avgTimeToHire: '4-6 months'
  },
  mobile: {
    title: 'Mobile Developer',
    requiredSkills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'TypeScript', 'iOS', 'Android', 'Firebase', 'REST APIs', 'Git', 'Dart', 'Objective-C'],
    salary: { junior: { inr: '4-9 LPA', usd: '$60k-$90k' }, mid: { inr: '9-20 LPA', usd: '$90k-$130k' }, senior: { inr: '20-45 LPA', usd: '$130k-$190k' } },
    marketDemand: 'High',
    demandTrend: '+22% YoY',
    topCompanies: ['Apple', 'Google', 'Snap', 'TikTok', 'Spotify', 'Swiggy'],
    jobOpenings: '68,000+',
    avgTimeToHire: '3-5 months'
  },
  qa: {
    title: 'QA Engineer',
    requiredSkills: ['Selenium', 'Cypress', 'Jest', 'Postman', 'Automation Testing', 'Python', 'Java', 'Jira', 'TestNG', 'API Testing', 'Performance Testing', 'SQL'],
    salary: { junior: { inr: '3-7 LPA', usd: '$50k-$75k' }, mid: { inr: '7-16 LPA', usd: '$75k-$110k' }, senior: { inr: '16-35 LPA', usd: '$110k-$160k' } },
    marketDemand: 'Moderate',
    demandTrend: '+18% YoY',
    topCompanies: ['Infosys', 'Wipro', 'TCS', 'Atlassian', 'Microsoft', 'IBM'],
    jobOpenings: '51,000+',
    avgTimeToHire: '2-4 months'
  },
  cybersecurity: {
    title: 'Cybersecurity Analyst',
    requiredSkills: ['Network Security', 'SIEM', 'Penetration Testing', 'Python', 'Linux', 'Firewall Management', 'OWASP', 'Kali Linux', 'SQL', 'Incident Response', 'ISO 27001', 'CEH'],
    salary: { junior: { inr: '5-10 LPA', usd: '$60k-$90k' }, mid: { inr: '10-25 LPA', usd: '$90k-$135k' }, senior: { inr: '25-60 LPA', usd: '$135k-$200k' } },
    marketDemand: 'Critical',
    demandTrend: '+55% YoY',
    topCompanies: ['Palo Alto Networks', 'CrowdStrike', 'Cisco', 'IBM Security', 'Microsoft', 'Deloitte'],
    jobOpenings: '43,000+',
    avgTimeToHire: '4-6 months'
  }
}

// ─── SKILL LEARNING TIME (weeks) ─────────────────────────────────────────────
const SKILL_LEARNING_TIME = {
  'React': 6, 'JavaScript': 10, 'TypeScript': 4, 'HTML': 3, 'CSS': 3,
  'Next.js': 3, 'TailwindCSS': 2, 'Redux': 3, 'Webpack': 2, 'Jest': 3,
  'Node.js': 5, 'Python': 8, 'Express': 3, 'PostgreSQL': 4, 'MongoDB': 3,
  'Redis': 2, 'Docker': 3, 'Kubernetes': 5, 'AWS': 8, 'GraphQL': 3,
  'SQL': 5, 'Git': 2, 'REST APIs': 2, 'Machine Learning': 12,
  'Deep Learning': 10, 'TensorFlow': 6, 'PyTorch': 6, 'Pandas': 4,
  'NumPy': 3, 'Scikit-Learn': 5, 'CI/CD': 3, 'Terraform': 4,
  'Linux': 4, 'Ansible': 3, 'Jenkins': 2, 'Bash': 3,
  'React Native': 5, 'Flutter': 6, 'Swift': 8, 'Kotlin': 6,
  'Selenium': 3, 'Cypress': 2, 'Postman': 1, 'Sass': 2,
  'Vue': 5, 'Angular': 8, 'Spring Boot': 8, 'Java': 12,
  'Firebase': 2, 'Supabase': 2, 'Spark': 6, 'R': 6, 'Tableau': 3,
}

// ─── CURATED SKILL COURSES DB ─────────────────────────────────────────────────
// Each skill maps to 2-3 real, verified courses with actual links
const SKILL_COURSES_DB = {
  'React': [
    { title: 'React - The Complete Guide 2024', platform: 'Udemy', url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', thumbnail: 'https://img-c.udemycdn.com/course/240x135/1362070_b9a1_2.jpg', duration: '68h', instructor: 'Maximilian Schwarzmüller', rating: 4.8 },
    { title: 'Full Stack Open (React + Node)', platform: 'freeCodeCamp', url: 'https://fullstackopen.com/en/', thumbnail: 'https://fullstackopen.com/static/logo.png', duration: '12 weeks', instructor: 'University of Helsinki', rating: 4.9 },
    { title: 'React JS Crash Course 2024', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', videoId: 'w7ejDZ8SWv8', thumbnail: `https://img.youtube.com/vi/w7ejDZ8SWv8/hqdefault.jpg`, duration: '1.5h', instructor: 'Traversy Media', rating: 4.9 },
  ],
  'JavaScript': [
    { title: 'The Complete JavaScript Course 2024', platform: 'Udemy', url: 'https://www.udemy.com/course/the-complete-javascript-course/', thumbnail: 'https://img-c.udemycdn.com/course/240x135/851712_fc61_6.jpg', duration: '69h', instructor: 'Jonas Schmedtmann', rating: 4.8 },
    { title: 'JavaScript Algorithms and Data Structures', platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', thumbnail: 'https://cdn.freecodecamp.org/platform/universal/fcc_primary.svg', duration: '300h', instructor: 'freeCodeCamp', rating: 4.7 },
    { title: 'JavaScript Tutorial Full Course - Beginner to Pro', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=EerdGm-ehJQ', videoId: 'EerdGm-ehJQ', thumbnail: `https://img.youtube.com/vi/EerdGm-ehJQ/hqdefault.jpg`, duration: '8h', instructor: 'SuperSimpleDev', rating: 4.9 },
  ],
  'TypeScript': [
    { title: 'Understanding TypeScript 2024', platform: 'Udemy', url: 'https://www.udemy.com/course/understanding-typescript/', thumbnail: 'https://img-c.udemycdn.com/course/240x135/947098_02ec_3.jpg', duration: '22h', instructor: 'Maximilian Schwarzmüller', rating: 4.8 },
    { title: 'TypeScript Full Course for Beginners', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=gp5HZO7BMz0', videoId: 'gp5HZO7BMz0', thumbnail: `https://img.youtube.com/vi/gp5HZO7BMz0/hqdefault.jpg`, duration: '3h', instructor: 'Dave Gray', rating: 4.8 },
  ],
  'Next.js': [
    { title: 'Next.js 14 & React - The Complete Guide', platform: 'Udemy', url: 'https://www.udemy.com/course/nextjs-react-the-complete-guide/', thumbnail: 'https://img-c.udemycdn.com/course/240x135/5187290_3a27_4.jpg', duration: '38h', instructor: 'Maximilian Schwarzmüller', rating: 4.7 },
    { title: 'Next.js 14 Full Course 2024', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=ZVnjOPwW4ZA', videoId: 'ZVnjOPwW4ZA', thumbnail: `https://img.youtube.com/vi/ZVnjOPwW4ZA/hqdefault.jpg`, duration: '5h', instructor: 'Dave Gray', rating: 4.9 },
  ],
  'Python': [
    { title: '100 Days of Code: Python Bootcamp', platform: 'Udemy', url: 'https://www.udemy.com/course/100-days-of-code/', thumbnail: 'https://img-c.udemycdn.com/course/240x135/2776760_f176_10.jpg', duration: '58h', instructor: 'Dr. Angela Yu', rating: 4.8 },
    { title: 'Python for Everybody Specialization', platform: 'Coursera', url: 'https://www.coursera.org/specializations/python', thumbnail: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/fb/434400d9ac11e5afbfa359f34ae5f0/pythonlearn_thumbnail_1x1.png', duration: '8 months', instructor: 'University of Michigan', rating: 4.8 },
    { title: 'Learn Python - Full Course for Beginners', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=rfscVSVCvtQ', videoId: 'rfscVSVCvtQ', thumbnail: `https://img.youtube.com/vi/rfscVSVCvtQ/hqdefault.jpg`, duration: '4.5h', instructor: 'freeCodeCamp', rating: 4.9 },
  ],
  'Node.js': [
    { title: 'Node.js, Express, MongoDB & More: The Complete Bootcamp', platform: 'Udemy', url: 'https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/', thumbnail: 'https://img-c.udemycdn.com/course/240x135/1672410_b61e_3.jpg', duration: '42h', instructor: 'Jonas Schmedtmann', rating: 4.8 },
    { title: 'Node.js Crash Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4', videoId: 'fBNz5xF-Kx4', thumbnail: `https://img.youtube.com/vi/fBNz5xF-Kx4/hqdefault.jpg`, duration: '1.5h', instructor: 'Traversy Media', rating: 4.8 },
  ],
  'Docker': [
    { title: 'Docker & Kubernetes: The Practical Guide', platform: 'Udemy', url: 'https://www.udemy.com/course/docker-kubernetes-the-practical-guide/', thumbnail: 'https://img-c.udemycdn.com/course/240x135/2035228_6e89_2.jpg', duration: '24h', instructor: 'Maximilian Schwarzmüller', rating: 4.7 },
    { title: 'Docker Tutorial for Beginners - Full Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=99LowisZMu8', videoId: '99LowisZMu8', thumbnail: `https://img.youtube.com/vi/99LowisZMu8/hqdefault.jpg`, duration: '4h', instructor: 'TechWorld with Nana', rating: 4.9 },
  ],
  'Kubernetes': [
    { title: 'Kubernetes for the Absolute Beginners', platform: 'Udemy', url: 'https://www.udemy.com/course/learn-kubernetes/', thumbnail: 'https://img-c.udemycdn.com/course/240x135/2926228_3f02_3.jpg', duration: '6h', instructor: 'KodeKloud', rating: 4.7 },
    { title: 'Kubernetes Tutorial for Beginners', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=X48VuDVv0do', videoId: 'X48VuDVv0do', thumbnail: `https://img.youtube.com/vi/X48VuDVv0do/hqdefault.jpg`, duration: '4h', instructor: 'TechWorld with Nana', rating: 4.9 },
  ],
  'AWS': [
    { title: 'AWS Certified Cloud Practitioner 2024', platform: 'Udemy', url: 'https://www.udemy.com/course/aws-certified-cloud-practitioner-new/', thumbnail: 'https://img-c.udemycdn.com/course/240x135/2196488_8fc7_10.jpg', duration: '20h', instructor: 'Stephane Maarek', rating: 4.8 },
    { title: 'AWS Cloud Practitioner Essentials', platform: 'Coursera', url: 'https://www.coursera.org/learn/aws-cloud-practitioner-essentials', thumbnail: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/46/5e44c023af11e8b8e4c79b2e4eb63e/AWS-CC-CLF-C01-Coursera-Logo.png', duration: '15h', instructor: 'AWS', rating: 4.6 },
    { title: 'AWS Tutorial for Beginners - Full Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=k1RI5locZE4', videoId: 'k1RI5locZE4', thumbnail: `https://img.youtube.com/vi/k1RI5locZE4/hqdefault.jpg`, duration: '5h', instructor: 'Simplilearn', rating: 4.7 },
  ],
  'Machine Learning': [
    { title: 'Machine Learning Specialization', platform: 'Coursera', url: 'https://www.coursera.org/specializations/machine-learning-introduction', thumbnail: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/e3/a2d0b0d81711e8a7b9cd26d03adbcc/MachineLearning_Specialization_SocialImage_1200x627px.png', duration: '3 months', instructor: 'Andrew Ng (Stanford)', rating: 4.9 },
    { title: 'Machine Learning A-Z 2024', platform: 'Udemy', url: 'https://www.udemy.com/course/machinelearning/', thumbnail: 'https://img-c.udemycdn.com/course/240x135/950390_270f_3.jpg', duration: '44h', instructor: 'Kirill Eremenko', rating: 4.6 },
    { title: 'Machine Learning Full Course - 12 Hours', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=KNAWp2S3w94', videoId: 'KNAWp2S3w94', thumbnail: `https://img.youtube.com/vi/KNAWp2S3w94/hqdefault.jpg`, duration: '12h', instructor: 'Simplilearn', rating: 4.7 },
  ],
  'Deep Learning': [
    { title: 'Deep Learning Specialization', platform: 'Coursera', url: 'https://www.coursera.org/specializations/deep-learning', thumbnail: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/de/b81e70d3dc11e78a1c6162c841fc65/dl_logo_1x1_white.png', duration: '5 months', instructor: 'Andrew Ng (deeplearning.ai)', rating: 4.9 },
    { title: 'Neural Networks & Deep Learning Full Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=Gu1uYU7RKMQ', videoId: 'Gu1uYU7RKMQ', thumbnail: `https://img.youtube.com/vi/Gu1uYU7RKMQ/hqdefault.jpg`, duration: '6h', instructor: 'freeCodeCamp', rating: 4.8 },
  ],
  'TensorFlow': [
    { title: 'TensorFlow Developer Certificate Bootcamp', platform: 'Udemy', url: 'https://www.udemy.com/course/tensorflow-developer-certificate-machine-learning-zero-to-mastery/', thumbnail: 'https://img-c.udemycdn.com/course/240x135/3545214_3c54_2.jpg', duration: '64h', instructor: 'Daniel Bourke', rating: 4.7 },
    { title: 'TensorFlow 2.0 Complete Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=tPYj3fFJGjk', videoId: 'tPYj3fFJGjk', thumbnail: `https://img.youtube.com/vi/tPYj3fFJGjk/hqdefault.jpg`, duration: '7h', instructor: 'freeCodeCamp', rating: 4.8 },
  ],
  'PyTorch': [
    { title: 'PyTorch for Deep Learning Bootcamp', platform: 'Udemy', url: 'https://www.udemy.com/course/pytorch-for-deep-learning-and-computer-vision/', thumbnail: 'https://img-c.udemycdn.com/course/240x135/2453436_1721_2.jpg', duration: '20h', instructor: 'Jose Portilla', rating: 4.6 },
    { title: 'PyTorch for Deep Learning Full Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=V_xro1bcAuA', videoId: 'V_xro1bcAuA', thumbnail: `https://img.youtube.com/vi/V_xro1bcAuA/hqdefault.jpg`, duration: '26h', instructor: 'Daniel Bourke', rating: 4.9 },
  ],
  'SQL': [
    { title: 'The Complete SQL Bootcamp', platform: 'Udemy', url: 'https://www.udemy.com/course/the-complete-sql-bootcamp/', thumbnail: 'https://img-c.udemycdn.com/course/240x135/762616_7693_3.jpg', duration: '9h', instructor: 'Jose Portilla', rating: 4.7 },
    { title: 'SQL Tutorial - Full Database Course for Beginners', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', videoId: 'HXV3zeQKqGY', thumbnail: `https://img.youtube.com/vi/HXV3zeQKqGY/hqdefault.jpg`, duration: '4h', instructor: 'freeCodeCamp', rating: 4.9 },
  ],
  'PostgreSQL': [
    { title: 'SQL & PostgreSQL for Beginners', platform: 'Udemy', url: 'https://www.udemy.com/course/sql-and-postgresql/', thumbnail: 'https://img-c.udemycdn.com/course/240x135/2496760_78f3_4.jpg', duration: '11h', instructor: 'Stephen Grider', rating: 4.7 },
    { title: 'PostgreSQL Tutorial for Beginners', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=qw--VYLpxG4', videoId: 'qw--VYLpxG4', thumbnail: `https://img.youtube.com/vi/qw--VYLpxG4/hqdefault.jpg`, duration: '4h', instructor: 'freeCodeCamp', rating: 4.8 },
  ],
  'MongoDB': [
    { title: 'MongoDB - The Complete Developer Guide', platform: 'Udemy', url: 'https://www.udemy.com/course/mongodb-the-complete-developers-guide/', thumbnail: 'https://img-c.udemycdn.com/course/240x135/2261658_84ea_2.jpg', duration: '21h', instructor: 'Maximilian Schwarzmüller', rating: 4.7 },
    { title: 'MongoDB Crash Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=ofme2o29ngU', videoId: 'ofme2o29ngU', thumbnail: `https://img.youtube.com/vi/ofme2o29ngU/hqdefault.jpg`, duration: '1h', instructor: 'Traversy Media', rating: 4.8 },
  ],
  'GraphQL': [
    { title: 'GraphQL with React: The Complete Developers Guide', platform: 'Udemy', url: 'https://www.udemy.com/course/graphql-with-react-course/', thumbnail: 'https://img-c.udemycdn.com/course/240x135/1037740_43a6.jpg', duration: '13h', instructor: 'Stephen Grider', rating: 4.7 },
    { title: 'GraphQL Full Course - Novice to Expert', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=ed8SzALpx1Q', videoId: 'ed8SzALpx1Q', thumbnail: `https://img.youtube.com/vi/ed8SzALpx1Q/hqdefault.jpg`, duration: '4h', instructor: 'freeCodeCamp', rating: 4.8 },
  ],
  'CI/CD': [
    { title: 'DevOps Beginners to Advanced - CI/CD with Jenkins', platform: 'Udemy', url: 'https://www.udemy.com/course/decodingdevops/', thumbnail: 'https://img-c.udemycdn.com/course/240x135/2714264_1c96_5.jpg', duration: '39h', instructor: 'Imran Teli', rating: 4.6 },
    { title: 'GitHub Actions Tutorial - Basic Concepts and CI/CD Pipeline', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=R8_veQiYBjI', videoId: 'R8_veQiYBjI', thumbnail: `https://img.youtube.com/vi/R8_veQiYBjI/hqdefault.jpg`, duration: '1.5h', instructor: 'TechWorld with Nana', rating: 4.9 },
  ],
  'Terraform': [
    { title: 'HashiCorp Certified: Terraform Associate 2024', platform: 'Udemy', url: 'https://www.udemy.com/course/terraform-beginner-to-advanced/', thumbnail: 'https://img-c.udemycdn.com/course/240x135/3064908_6714_2.jpg', duration: '13h', instructor: 'Zeal Vora', rating: 4.5 },
    { title: 'Terraform Course for Beginners', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=SLB_c_ayRMo', videoId: 'SLB_c_ayRMo', thumbnail: `https://img.youtube.com/vi/SLB_c_ayRMo/hqdefault.jpg`, duration: '2.5h', instructor: 'freeCodeCamp', rating: 4.8 },
  ],
  'Flutter': [
    { title: 'Flutter & Dart - The Complete Guide 2024', platform: 'Udemy', url: 'https://www.udemy.com/course/learn-flutter-dart-to-build-ios-android-apps/', thumbnail: 'https://img-c.udemycdn.com/course/240x135/1708340_7fb0_5.jpg', duration: '42h', instructor: 'Maximilian Schwarzmüller', rating: 4.7 },
    { title: 'Flutter Tutorial for Beginners', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=1ukSR1GRtMU', videoId: '1ukSR1GRtMU', thumbnail: `https://img.youtube.com/vi/1ukSR1GRtMU/hqdefault.jpg`, duration: '5h', instructor: 'Net Ninja', rating: 4.8 },
  ],
  'Swift': [
    { title: 'iOS & Swift - The Complete iOS App Development Bootcamp', platform: 'Udemy', url: 'https://www.udemy.com/course/ios-13-app-development-bootcamp/', thumbnail: 'https://img-c.udemycdn.com/course/240x135/1778502_f4b9_12.jpg', duration: '55h', instructor: 'Dr. Angela Yu', rating: 4.8 },
    { title: 'Swift Tutorial for Beginners', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=comQ1-x2a1Q', videoId: 'comQ1-x2a1Q', thumbnail: `https://img.youtube.com/vi/comQ1-x2a1Q/hqdefault.jpg`, duration: '5h', instructor: 'CodeWithChris', rating: 4.7 },
  ],
  'Kotlin': [
    { title: 'Android 14 & Kotlin Development Masterclass', platform: 'Udemy', url: 'https://www.udemy.com/course/android-kotlin-developer/', thumbnail: 'https://img-c.udemycdn.com/course/240x135/1940804_b4ea_2.jpg', duration: '52h', instructor: 'Denis Panjuta', rating: 4.5 },
    { title: 'Kotlin Course - Tutorial for Beginners', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=F9UC9DY-vIU', videoId: 'F9UC9DY-vIU', thumbnail: `https://img.youtube.com/vi/F9UC9DY-vIU/hqdefault.jpg`, duration: '2.5h', instructor: 'freeCodeCamp', rating: 4.8 },
  ],
  'Redux': [
    { title: 'Modern React with Redux 2024', platform: 'Udemy', url: 'https://www.udemy.com/course/react-redux/', thumbnail: 'https://img-c.udemycdn.com/course/240x135/705264_caa9_13.jpg', duration: '52h', instructor: 'Stephen Grider', rating: 4.7 },
    { title: 'Redux Toolkit Tutorial', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=iBUJVy8phqw', videoId: 'iBUJVy8phqw', thumbnail: `https://img.youtube.com/vi/iBUJVy8phqw/hqdefault.jpg`, duration: '1.5h', instructor: 'Dave Gray', rating: 4.8 },
  ],
  'Jest': [
    { title: 'JavaScript Testing Introduction', platform: 'Udemy', url: 'https://www.udemy.com/course/javascript-unit-testing-the-practical-guide/', thumbnail: 'https://img-c.udemycdn.com/course/240x135/5066344_a2ef.jpg', duration: '9h', instructor: 'Maximilian Schwarzmüller', rating: 4.6 },
    { title: 'Jest Crash Course - Unit Testing in JavaScript', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=7r4xVDI2vho', videoId: '7r4xVDI2vho', thumbnail: `https://img.youtube.com/vi/7r4xVDI2vho/hqdefault.jpg`, duration: '1.5h', instructor: 'Traversy Media', rating: 4.7 },
  ],
  'TailwindCSS': [
    { title: 'Tailwind CSS From Scratch', platform: 'Udemy', url: 'https://www.udemy.com/course/tailwind-from-scratch/', thumbnail: 'https://img-c.udemycdn.com/course/240x135/4704792_2b06.jpg', duration: '9h', instructor: 'Brad Traversy', rating: 4.7 },
    { title: 'Tailwind CSS Tutorial', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=ft30zcMlFao', videoId: 'ft30zcMlFao', thumbnail: `https://img.youtube.com/vi/ft30zcMlFao/hqdefault.jpg`, duration: '2h', instructor: 'Net Ninja', rating: 4.8 },
  ],
  'Linux': [
    { title: 'Linux Command Line & Shell Scripting Bible', platform: 'Udemy', url: 'https://www.udemy.com/course/linux-command-line-volume1/', thumbnail: 'https://img-c.udemycdn.com/course/240x135/1660573_aac5_3.jpg', duration: '12h', instructor: 'Jason Cannon', rating: 4.7 },
    { title: 'Linux Command Line Tutorial For Beginners', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=cBokz0LTizk', videoId: 'cBokz0LTizk', thumbnail: `https://img.youtube.com/vi/cBokz0LTizk/hqdefault.jpg`, duration: '3h', instructor: 'Guru99', rating: 4.6 },
  ],
  'Scikit-Learn': [
    { title: 'ML with Python & Sklearn - Supervised Learning', platform: 'Coursera', url: 'https://www.coursera.org/learn/machine-learning-with-python', thumbnail: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/ef/8d4b0c5c9c11e8a10571e67c4b46ac/ML0101ENv3.png', duration: '6 weeks', instructor: 'IBM (Joseph Santarcangelo)', rating: 4.5 },
    { title: 'Scikit-learn Crash Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=0B5eIE_1vpU', videoId: '0B5eIE_1vpU', thumbnail: `https://img.youtube.com/vi/0B5eIE_1vpU/hqdefault.jpg`, duration: '2h', instructor: 'freeCodeCamp', rating: 4.7 },
  ],
}

// Fallback for skills not in the DB
const getFallbackCourse = (skill) => [
  { title: `${skill} - Complete Beginner to Advanced`, platform: 'Udemy', url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(skill)}`, thumbnail: 'https://www.udemy.com/staticx/udemy/images/v7/logo-udemy.svg', duration: '10-20h', instructor: 'Various Experts', rating: 4.5 },
  { title: `${skill} Full Course for Beginners`, platform: 'YouTube', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' full course freecodecamp')}`, thumbnail: 'https://www.youtube.com/favicon.ico', duration: '3-8h', instructor: 'freeCodeCamp', rating: 4.6 },
]

// ─── ROLE RESOLVER ───────────────────────────────────────────────────────────
const resolveRole = (targetRole) => {
  const r = (targetRole || '').toLowerCase()
  if (r.includes('full') && (r.includes('stack') || r.includes('web'))) return 'fullstack'
  if (r.includes('front') || r.includes('react') || r.includes('ui') || r.includes('vue') || r.includes('angular')) return 'frontend'
  if (r.includes('back') || r.includes('node') || r.includes('server') || r.includes('api') || r.includes('django') || r.includes('spring')) return 'backend'
  if (r.includes('ml') || r.includes('machine') || r.includes('ai engineer') || r.includes('mle')) return 'mleng'
  if (r.includes('data') || r.includes('science') || r.includes('analyst') && r.includes('data')) return 'datascience'
  if (r.includes('devops') || r.includes('cloud') || r.includes('infra') || r.includes('platform') || r.includes('sre')) return 'devops'
  if (r.includes('mobil') || r.includes('ios') || r.includes('android') || r.includes('flutter')) return 'mobile'
  if (r.includes('qa') || r.includes('test') || r.includes('automation') || r.includes('quality')) return 'qa'
  if (r.includes('cyber') || r.includes('security') || r.includes('pentest')) return 'cybersecurity'
  return 'fullstack' // best generic fallback
}

// ─── RICH ANALYSIS GENERATOR ─────────────────────────────────────────────────
const generateRichAnalysis = (targetRole, resumeText = '', userProvidedSkills = []) => {
  const roleKey = resolveRole(targetRole)
  const roleData = ROLE_KNOWLEDGE_BASE[roleKey]
  const requiredSkills = roleData.requiredSkills

  // Normalize user skills
  const allKnownSkills = Object.keys(SKILL_COURSES_DB)
  let userSkills = []

  if (userProvidedSkills.length > 0) {
    userProvidedSkills.forEach(s => {
      const matched = allKnownSkills.find(k => k.toLowerCase() === s.trim().toLowerCase())
        || requiredSkills.find(k => k.toLowerCase() === s.trim().toLowerCase())
      userSkills.push(matched || s.trim())
    })
  } else if (resumeText) {
    requiredSkills.forEach(skill => {
      const regex = new RegExp(`\\b${skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i')
      if (regex.test(resumeText)) userSkills.push(skill)
    })
  }

  // Missing skills
  const missingSkills = requiredSkills.filter(
    skill => !userSkills.some(us => us.toLowerCase() === skill.toLowerCase())
  )

  // Score
  const matchCount = userSkills.length
  const totalCount = requiredSkills.length
  const hasAll = missingSkills.length === 0 && totalCount > 2
  let score
  if (hasAll) {
    score = Math.floor(85 + Math.random() * 13)
  } else {
    const base = totalCount > 0 ? Math.round((matchCount / totalCount) * 100) : 70
    score = Math.max(42, Math.min(84, base))
  }

  // Level
  const level = score >= 80 ? 'Senior' : score >= 60 ? 'Mid-level' : 'Junior'

  // Salary
  const salaryLevel = score >= 80 ? 'senior' : score >= 60 ? 'mid' : 'junior'
  const salary = roleData.salary[salaryLevel]

  // Course recommendations — for top missing skills
  const coursesForMissing = missingSkills.slice(0, 4).flatMap(skill => {
    const courses = SKILL_COURSES_DB[skill] || getFallbackCourse(skill)
    return courses.slice(0, 2).map(c => ({ ...c, forSkill: skill }))
  })

  // Also add 1 course for a skill the user has (to go deeper)
  const strengthCourses = userSkills.slice(0, 2).flatMap(skill => {
    const courses = SKILL_COURSES_DB[skill]
    if (!courses) return []
    // Return the most advanced course (last one)
    return [{ ...courses[courses.length - 1], forSkill: skill, isAdvanced: true }]
  })

  // Learning time for missing skills
  const missingWithTime = missingSkills.map(skill => ({
    skill,
    weeks: SKILL_LEARNING_TIME[skill] || 4
  }))

  // Roadmap
  const roadmapByLevel = {
    junior: [
      `🌱 Start with fundamentals: Master ${missingSkills.slice(0, 2).join(' & ')} first`,
      `Week 1-4: Focus on core ${roleData.title} concepts and daily hands-on coding`,
      `Week 5-8: Build 2-3 portfolio projects using what you've learned`,
      `Week 9-12: Learn ${missingSkills.slice(2, 4).join(' & ')} and add to projects`,
      `Month 4-5: Apply to Junior roles, contribute to open source`,
      `🎯 Target: Land first ${roleData.title} job in 4-6 months`,
    ],
    mid: [
      `🚀 Level-up path: Bridge ${missingSkills.length} key skill gaps`,
      `Priority 1: Deep dive into ${missingSkills[0] || 'advanced patterns'} (${SKILL_LEARNING_TIME[missingSkills[0]] || 4} weeks)`,
      `Priority 2: Build production-ready project showcasing ${missingSkills.slice(0, 3).join(', ')}`,
      `Priority 3: Master ${missingSkills[1] || 'system design'} for system design interviews`,
      `Priority 4: Study DSA — LeetCode 75 problems (3 months parallel)`,
      `🎯 Target: Mid-level ${roleData.title} at ${roleData.topCompanies.slice(0, 3).join(', ')}`,
    ],
    senior: [
      `⚡ Senior track: Sharpen architecture & leadership skills`,
      `Phase 1: System design mastery — design scalable distributed systems`,
      `Phase 2: Learn ${missingSkills[0] || 'advanced tooling'} for cutting-edge stack`,
      `Phase 3: Mentoring, code review leadership, tech blog writing`,
      `Phase 4: Open source contributions — build credibility`,
      `🎯 Target: Senior ${roleData.title} at ${roleData.topCompanies.slice(0, 2).join(' or ')}`,
    ]
  }

  const roadmap = hasAll ? roadmapByLevel.senior
    : score < 58 ? roadmapByLevel.junior
    : score < 78 ? roadmapByLevel.mid
    : roadmapByLevel.senior

  // Stats insight
  const insights = {
    marketDemand: roleData.marketDemand,
    demandTrend: roleData.demandTrend,
    jobOpenings: roleData.jobOpenings,
    avgTimeToHire: roleData.avgTimeToHire,
    topCompanies: roleData.topCompanies,
    totalLearningWeeks: missingWithTime.reduce((sum, s) => sum + s.weeks, 0),
  }

  return {
    score,
    level,
    salary,
    missingSkills,
    missingWithTime,
    userSkills,
    roadmap,
    coursesData: [...coursesForMissing, ...strengthCourses],
    // Keep backward-compat string format for old consumers
    recommendedCourses: [...coursesForMissing, ...strengthCourses]
      .map(c => `${c.platform}: ${c.title} | ${c.url}`),
    insights,
    roleData: { title: roleData.title, topCompanies: roleData.topCompanies },
    roadmap_levels: { junior: roadmapByLevel.junior, mid: roadmapByLevel.mid, senior: roadmapByLevel.senior },
    courses_levels: { beginner: coursesForMissing.slice(0, 3).map(c => c.title), expert: strengthCourses.map(c => c.title) }
  }
}

const ROLE_SKILLS = {
  frontend: ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Redux", "Webpack", "Jest", "TailwindCSS", "Next.js", "Vue", "Angular", "Sass"],
  backend: ["Node.js", "Express", "Python", "Django", "PostgreSQL", "MongoDB", "Redis", "Docker", "REST APIs", "GraphQL", "SQL", "Java", "Spring Boot"],
  datascience: ["Python", "Pandas", "NumPy", "Scikit-Learn", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "SQL", "R", "Tableau"],
  devops: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform", "Linux", "Jenkins", "Ansible", "Git", "Bash"],
  mobile: ["React Native", "Swift", "Kotlin", "Flutter", "iOS", "Android", "Dart", "Objective-C"],
  qa: ["Selenium", "Cypress", "QA Testing", "Jest", "Manual Testing", "Automation", "Postman"]
}

const analyzeWithMLBackend = async (resumeText, targetRole) => {
  const mlApiUrl = import.meta.env.VITE_ML_API_URL || 'http://127.0.0.1:5000'
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 4000) // 4 second timeout limit

  try {
    const response = await fetch(`${mlApiUrl}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: resumeText, target_role: targetRole }),
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    if (!response.ok) {
      const errText = await response.text().catch(() => '')
      throw new Error(`ML analyze failed (${response.status}): ${errText}`)
    }
    return response.json()
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

export const performAnalysis = async (resumeFile, targetRole, userProvidedSkills = []) => {
  try {
    const session = await getSession()
    const userId = session?.user?.id || 'guest-user-id'

    let resumeText = ''
    let extractedSkills = []

    if (resumeFile) {
      try {
        resumeText = await parseResume(resumeFile)
      } catch (err) {
        console.warn('PDF parsing failed, using filename.', err)
        resumeText = resumeFile.name || ''
      }
    }

    if (userProvidedSkills.length > 0) {
      extractedSkills = userProvidedSkills
      resumeText = userProvidedSkills.join(', ')
    } else if (!resumeText) {
      resumeText = 'General skills'
    }

    let result
    let isOfflineMock = false

    // 1) Try ML backend
    try {
      const mlResult = await analyzeWithMLBackend(resumeText, targetRole)
      const missingSkillsArray = mlResult.missingSkills || []
      const roadmapArray = mlResult.roadmap || []

      // Enrich with our rich course data
      const enriched = generateRichAnalysis(targetRole, resumeText, userProvidedSkills)
      result = {
        score: mlResult.score,
        level: mlResult.level || enriched.level,
        salary: enriched.salary,
        missingSkills: missingSkillsArray.length > 0 ? missingSkillsArray : enriched.missingSkills,
        missingWithTime: enriched.missingWithTime,
        userSkills: enriched.userSkills,
        roadmap: roadmapArray.length > 0 ? roadmapArray : enriched.roadmap,
        coursesData: enriched.coursesData,
        recommendedCourses: enriched.recommendedCourses,
        insights: enriched.insights,
        roleData: enriched.roleData,
        roadmap_levels: enriched.roadmap_levels,
        courses_levels: enriched.courses_levels
      }
    } catch (mlError) {
      console.warn('ML backend unavailable. Using rich offline engine.', mlError.message)
      isOfflineMock = true
      result = generateRichAnalysis(targetRole, resumeText, extractedSkills)
    }

    // Save to DB
    const missingSkillsArray = result.missingSkills || []
    const roadmapArray = result.roadmap || []
    const finalCourses = Array.isArray(result.recommendedCourses) ? result.recommendedCourses : []

    const analysisRow = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      user_id: userId,
      role_transition: targetRole,
      score: result.score ?? 75,
      missing_skills: JSON.stringify(missingSkillsArray),
      roadmap: JSON.stringify(roadmapArray),
      courses: JSON.stringify(finalCourses),
      roadmap_levels: JSON.stringify(result.roadmap_levels || {}),
      courses_levels: JSON.stringify(result.courses_levels || {}),
      raw_resume: (resumeText || '').substring(0, 10000),
      created_at: new Date().toISOString()
    }

    let data = null
    let databaseSaved = false

    const runSupabaseInsert = async () => {
      const { data: sbData, error: sbError } = await supabase
        .from('analyses')
        .insert({
          user_id: analysisRow.user_id,
          role_transition: analysisRow.role_transition,
          score: analysisRow.score,
          missing_skills: analysisRow.missing_skills,
          roadmap: analysisRow.roadmap,
          courses: analysisRow.courses,
          roadmap_levels: analysisRow.roadmap_levels,
          courses_levels: analysisRow.courses_levels,
          raw_resume: analysisRow.raw_resume
        })
        .select()
        .single()

      if (sbError) throw sbError
      return sbData
    }

    try {
      // Race Supabase insert against a 3-second timeout
      const sbData = await Promise.race([
        runSupabaseInsert(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase save timeout')), 3000))
      ])
      if (sbData) {
        data = sbData
        databaseSaved = true
      }
    } catch (sbErr) {
      console.warn('[ai.js] Supabase save failed or timed out:', sbErr.message || sbErr)
    }

    if (!databaseSaved) {
      const mlApiUrl = import.meta.env.VITE_ML_API_URL || 'http://127.0.0.1:5000'
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000)
      try {
        const res = await fetch(`${mlApiUrl}/api/analyses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...analysisRow, user_id: analysisRow.user_id || 'guest-user-id' }),
          signal: controller.signal
        })
        clearTimeout(timeoutId)
        if (res.ok) {
          data = await res.json()
          databaseSaved = true
        }
      } catch (e) {
        clearTimeout(timeoutId)
        console.warn('[ai.js] Backend storage unavailable or timed out.', e.message || e)
      }
    }

    try {
      const localDataStr = localStorage.getItem('careergenie_analyses') || '[]'
      const localData = JSON.parse(localDataStr)
      localData.unshift(analysisRow)
      localStorage.setItem('careergenie_analyses', JSON.stringify(localData))
    } catch (lsErr) {
      console.error('LocalStorage write failed:', lsErr)
    }

    if (!databaseSaved) data = analysisRow

    return {
      ...data,
      // Pass rich fields directly
      coursesData: result.coursesData,
      missingWithTime: result.missingWithTime,
      salary: result.salary,
      insights: result.insights,
      roleData: result.roleData,
      level: result.level,
      userSkills: result.userSkills,
      isOfflineMock
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getUserAnalyses = async () => {
  let localData = []
  try {
    const localDataStr = localStorage.getItem('careergenie_analyses') || '[]'
    localData = JSON.parse(localDataStr)
  } catch (e) {
    console.error('LocalStorage read failed:', e)
  }

  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Network fetch timeout')), 1800)
  )

  const fetchNetworkData = async () => {
    // 1. Try Supabase
    try {
      const session = await getSession()
      const userId = session?.user?.id
      if (userId) {
        const { data: sbAnalyses, error: sbError } = await supabase
          .from('analyses')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (!sbError && sbAnalyses && sbAnalyses.length > 0) {
          try {
            localStorage.setItem('careergenie_analyses', JSON.stringify(sbAnalyses))
          } catch (e) {}
          return sbAnalyses
        }
      }
    } catch (e) {
      console.warn('[ai.js] Supabase read failed:', e)
    }

    // 2. Try Python API server
    try {
      const session = await getSession()
      const userId = session?.user?.id || 'guest-user-id'
      const mlApiUrl = import.meta.env.VITE_ML_API_URL || 'http://127.0.0.1:5000'
      const response = await fetch(`${mlApiUrl}/api/analyses?user_id=${encodeURIComponent(userId)}`)
      if (response.ok) {
        const dbData = await response.json()
        if (dbData && dbData.length > 0) {
          try {
            localStorage.setItem('careergenie_analyses', JSON.stringify(dbData))
          } catch (e) {}
          return dbData
        }
      }
    } catch (e) {
      console.warn('[ai.js] Backend read failed.', e)
    }

    return null
  }

  try {
    // Race network calls against a 1.8-second timeout for snappy UI
    const networkData = await Promise.race([
      fetchNetworkData(),
      timeoutPromise
    ])
    if (networkData && networkData.length > 0) {
      return networkData
    }
  } catch (err) {
    console.warn('[ai.js] Network fetch timed out or failed; returning local cache.', err.message)
  }

  return localData
}

// Export the knowledge base for use in ResumeAnalyzer
export { ROLE_KNOWLEDGE_BASE, SKILL_COURSES_DB, SKILL_LEARNING_TIME, resolveRole, generateRichAnalysis }
