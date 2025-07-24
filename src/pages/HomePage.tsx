import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Eye, Mail, Github, Linkedin, MapPin, Briefcase, Edit, Save, Plus, Trash2, FileDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { generateResumePDF, ResumeData } from '../utils/resumeGenerator';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [skills, setSkills] = React.useState([
    'Azure', 'Cloud Computing', 'DevOps', 'Terraform', 'Python', 'PowerShell',
    'Docker', 'Kubernetes', 'CI/CD', 'Infrastructure as Code', 'Automation', 'Security'
  ]);
  const [isEditingSkills, setIsEditingSkills] = React.useState(false);
  const [newSkill, setNewSkill] = React.useState('');

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleResumeDownload = async () => {
    try {
      // Get data from localStorage (this would typically come from your state management)
      const experienceData = JSON.parse(localStorage.getItem('experiences') || '[]');
      const educationData = JSON.parse(localStorage.getItem('education') || '[]');
      const certificationsData = JSON.parse(localStorage.getItem('certifications') || '[]');
      const projectsData = JSON.parse(localStorage.getItem('projects') || '[]');
      
      const resumeData: ResumeData = {
        personalInfo: {
          name: 'Abdul Hadi Nabil',
          email: 'nabil4457@gmail.com',
          phone: '+880 123 456 7890',
          location: 'Sylhet, Bangladesh',
          title: 'Azure Administrator & Cloud Solutions Architect',
          summary: 'Passionate cloud computing professional with expertise in Azure infrastructure, automation, and DevOps practices. Experienced in designing and implementing scalable cloud solutions, Infrastructure as Code, and modern deployment strategies. Committed to helping organizations modernize their technology stack and optimize their cloud operations.'
        },
        experience: experienceData.length > 0 ? experienceData : [
          {
            title: 'Azure Administrator',
            company: 'Technology Solutions Ltd.',
            location: 'Sylhet, Bangladesh',
            startDate: '2020-01',
            endDate: '',
            current: true,
            description: 'Managing and optimizing Azure cloud infrastructure, implementing security best practices, and automating deployment processes. Led migration of 50+ applications to Azure, resulting in 30% cost reduction.'
          }
        ],
        education: educationData.length > 0 ? educationData : [
          {
            degree: 'Bachelor of Science in Computer Science and Engineering',
            institution: 'Metropolitan University',
            location: 'Sylhet, Bangladesh',
            startDate: '2015',
            endDate: '2019',
            description: 'Graduated with distinction. Specialized in cloud computing and software engineering.'
          }
        ],
        certifications: certificationsData.length > 0 ? certificationsData : [
          {
            title: 'Microsoft Azure Administrator Associate',
            issuer: 'Microsoft',
            issueDate: '2021-03',
            credentialId: 'AZ-104'
          }
        ],
        projects: projectsData.length > 0 ? projectsData.map((p: any) => ({
          title: p.title,
          description: p.description,
          category: p.category,
          tags: p.tags
        })) : [
          {
            title: 'Azure Infrastructure Automation',
            description: 'Comprehensive Terraform modules for automating Azure infrastructure deployment including VNets, VMs, and security groups.',
            category: 'Cloud Infrastructure',
            tags: ['Azure', 'Terraform', 'DevOps', 'Infrastructure as Code']
          }
        ],
        skills: skills
      };

      await generateResumePDF(resumeData);
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Error generating resume. Please try again.');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-4">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 animate-gradient"></div>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-white bg-opacity-10 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        
        <div className="container mx-auto max-w-6xl">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-10 lg:mb-0 animate-fadeInLeft">
              <h1 className="text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white">
                Abdul Hadi Nabil
              </h1>
              <p className="text-xl lg:text-2xl mb-6 text-purple-100">
              </p>
              <p className="text-xl lg:text-2xl mb-6 text-blue-100">
                Azure Administrator & Cloud Solutions Architect
              </p>
              <p className="text-lg mb-8 text-white text-opacity-90 leading-relaxed">
                Passionate about cloud computing, automation, and creating innovative tech solutions. 
                Transforming businesses through scalable cloud infrastructure and modern DevOps practices.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleResumeDownload}
                  className="btn-gradient inline-flex items-center px-6 py-3 text-white rounded-xl font-medium hover-lift transition-all duration-300"
                >
                  <FileDown size={20} className="mr-2" />
                  Download Resume
                </button>
                <Link 
                  to="/projects"
                  className="inline-flex items-center px-6 py-3 glass text-white rounded-xl font-medium hover-glow"
                >
                  <Eye size={20} className="mr-2" />
                  View Projects
                </Link>
                <Link 
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 bg-white bg-opacity-20 text-white rounded-xl font-medium hover-glow backdrop-blur-sm"
                >
                  <Mail size={20} className="mr-2" />
                  Contact Me
                </Link>
              </div>

              <div className="flex items-center space-x-6 text-white text-opacity-80">
                <div className="flex items-center">
                  <MapPin size={18} className="mr-2" />
                  <span>Sylhet, Bangladesh</span>
                </div>
                <div className="flex items-center">
                  <Briefcase size={18} className="mr-2" />
                  <span>Available for Projects</span>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 flex justify-center animate-fadeInRight">
              <div className="relative">
                <div className="w-80 h-80 rounded-full overflow-hidden border-8 border-white shadow-2xl hover-lift animate-pulse-soft">
                  <img 
                    src="/Abdul Hadi Nabil.png.jpeg" 
                    alt="Abdul Hadi Nabil" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold gradient-text mb-8 animate-fadeInUp">About Me</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            I'm a technology enthusiast from Sylhet, Bangladesh, with a Bachelor's degree in Computer Science and Engineering 
            from Metropolitan University. Currently working as an Azure Administrator, I specialize in cloud computing, 
            automation, and creating innovative tech solutions. With a deep curiosity for how things work, I'm always 
            exploring new ideas and pushing boundaries in digital technology.
          </p>
          <Link 
            to="/about" 
            className="btn-gradient inline-flex items-center px-8 py-4 text-white rounded-xl font-medium hover-lift animate-fadeInUp"
            style={{animationDelay: '0.4s'}}
          >
            Learn More About Me
          </Link>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold gradient-text animate-fadeInUp">Skills & Expertise</h2>
            {isAuthenticated && (
              <button
                onClick={() => setIsEditingSkills(!isEditingSkills)}
                className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                {isEditingSkills ? <Save size={16} className="mr-1" /> : <Edit size={16} className="mr-1" />}
                {isEditingSkills ? 'Save' : 'Edit Skills'}
              </button>
            )}
          </div>
          
          {isEditingSkills && isAuthenticated && (
            <div className="mb-8 p-6 bg-blue-50 rounded-2xl">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add new skill"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <button
                  onClick={addSkill}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} className="mr-1" />
                  Add
                </button>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {skills.map((skill, index) => (
              <div 
                key={skill} 
                className="card-dynamic p-6 rounded-2xl text-center hover-lift animate-fadeInUp relative group"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <span className="text-gray-800 font-semibold">{skill}</span>
                {isEditingSkills && isAuthenticated && (
                  <button
                    onClick={() => removeSkill(skill)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="container mx-auto max-w-4xl text-center">
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-8 animate-fadeInUp">Let's Connect</h3>
            <div className="flex justify-center space-x-8 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            <a 
              href="https://github.com/abdulhadinabbil" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 glass-blue rounded-2xl hover-glow transition-all duration-300"
            >
              <Github size={24} />
            </a>
            <a 
              href="https://linkedin.com/in/abdulhadinabil" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 glass-blue rounded-2xl hover-glow transition-all duration-300"
            >
              <Linkedin size={24} />
            </a>
            <a 
              href="mailto:contact@abdulhadinabil.com" 
              className="p-4 glass-blue rounded-2xl hover-glow transition-all duration-300"
            >
              <Mail size={24} />
            </a>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;