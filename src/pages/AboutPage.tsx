import React, { useState, useEffect } from 'react';
import { Edit, Plus, Trash2, Save, X, MapPin, Calendar, Building, GraduationCap, Award, Heart, Upload, File, Image, Video } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import FileUpload from '../components/FileUpload';

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string;
  current: boolean;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description?: string;
}

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  certificateFile?: string;
  certificateType?: 'image' | 'pdf';
}

const AboutPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isEditingStory, setIsEditingStory] = useState(false);
  const [storyImages, setStoryImages] = useState<string[]>([]);
  const [storyVideos, setStoryVideos] = useState<string[]>([]);
  const [story, setStory] = useState(`I'm a technology enthusiast from Sylhet, Bangladesh, with a passion for cloud computing and automation. My journey in tech began during my undergraduate studies at Metropolitan University, where I discovered my love for solving complex problems through innovative solutions.

Currently working as an Azure Administrator, I specialize in designing and implementing scalable cloud infrastructure solutions. I'm particularly interested in Infrastructure as Code, DevOps practices, and helping organizations modernize their technology stack.

When I'm not working with cloud technologies, I enjoy exploring new programming languages, contributing to open-source projects, and sharing my knowledge through technical writing and mentoring.`);

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: '1',
      title: 'Azure Administrator',
      company: 'Technology Solutions Ltd.',
      location: 'Sylhet, Bangladesh',
      startDate: '2020-01',
      endDate: '',
      current: true,
      description: 'Managing and optimizing Azure cloud infrastructure, implementing security best practices, and automating deployment processes. Led migration of 50+ applications to Azure, resulting in 30% cost reduction.'
    },
    {
      id: '2',
      title: 'Junior Cloud Engineer',
      company: 'Digital Innovations Inc.',
      location: 'Dhaka, Bangladesh',
      startDate: '2019-06',
      endDate: '2019-12',
      current: false,
      description: 'Assisted in cloud infrastructure setup and maintenance. Gained hands-on experience with Azure services and DevOps tools.'
    }
  ]);

  const [education, setEducation] = useState<Education[]>([
    {
      id: '1',
      degree: 'Bachelor of Science in Computer Science and Engineering',
      institution: 'Metropolitan University',
      location: 'Sylhet, Bangladesh',
      startDate: '2015',
      endDate: '2019',
      description: 'Graduated with distinction. Specialized in cloud computing and software engineering.'
    }
  ]);

  const [certifications, setCertifications] = useState<Certification[]>([
    {
      id: '1',
      title: 'Microsoft Azure Administrator Associate',
      issuer: 'Microsoft',
      issueDate: '2021-03',
      credentialId: 'AZ-104',
      certificateFile: '',
      certificateType: 'image'
    },
    {
      id: '2',
      title: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      issueDate: '2022-01',
      credentialId: 'SAA-C02',
      certificateFile: '',
      certificateType: 'pdf'
    }
  ]);

  const [hobbies, setHobbies] = useState([
    'Photography', 'Hiking', 'Reading Tech Blogs', 'Open Source Contributing', 'Chess', 'Traveling'
  ]);

  const [editingExperience, setEditingExperience] = useState<string | null>(null);
  const [editingEducation, setEditingEducation] = useState<string | null>(null);
  const [editingCertification, setEditingCertification] = useState<string | null>(null);
  const [isEditingHobbies, setIsEditingHobbies] = useState(false);
  const [newHobby, setNewHobby] = useState('');
  const [hoveredHobby, setHoveredHobby] = useState<string | null>(null);

  // Gradient colors for hobbies
  const hobbyColors = [
    'from-blue-500 to-blue-700',
    'from-purple-500 to-purple-700',
    'from-green-500 to-green-700',
    'from-yellow-500 to-yellow-700',
    'from-pink-500 to-pink-700',
    'from-indigo-500 to-indigo-700',
    'from-red-500 to-red-700',
    'from-teal-500 to-teal-700'
  ];

  const handleStoryImageUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setStoryImages([...storyImages, url]);
  };

  const handleStoryVideoUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setStoryVideos([...storyVideos, url]);
  };

  const handleCertificateUpload = (certId: string, file: File) => {
    const url = URL.createObjectURL(file);
    const fileType = file.type.startsWith('image/') ? 'image' : 'pdf';
    
    setCertifications(certifications.map(cert => 
      cert.id === certId 
        ? { ...cert, certificateFile: url, certificateType: fileType }
        : cert
    ));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Present';
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setExperiences([newExp, ...experiences]);
    setEditingExperience(newExp.id);
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    setEducation([newEdu, ...education]);
    setEditingEducation(newEdu.id);
  };

  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      title: '',
      issuer: '',
      issueDate: '',
      credentialId: '',
      certificateFile: '',
      certificateType: 'image'
    };
    setCertifications([newCert, ...certifications]);
    setEditingCertification(newCert.id);
  };

  const addHobby = () => {
    if (newHobby.trim() !== '') {
      setHobbies([...hobbies, newHobby.trim()]);
      setNewHobby('');
    }
  };

  const removeHobby = (hobbyToRemove: string) => {
    setHobbies(hobbies.filter(hobby => hobby !== hobbyToRemove));
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    localStorage.setItem('experiences', JSON.stringify(experiences));
  }, [experiences]);

  useEffect(() => {
    localStorage.setItem('education', JSON.stringify(education));
  }, [education]);

  useEffect(() => {
    localStorage.setItem('certifications', JSON.stringify(certifications));
  }, [certifications]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      storyImages.forEach(url => URL.revokeObjectURL(url));
      storyVideos.forEach(url => URL.revokeObjectURL(url));
      certifications.forEach(cert => {
        if (cert.certificateFile) URL.revokeObjectURL(cert.certificateFile);
      });
    };
  }, [storyImages, storyVideos, certifications]);

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Me</h1>
          <p className="text-lg text-gray-600">Get to know more about my journey, experience, and interests</p>
        </div>

        {/* Story Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Story</h2>
            {isAuthenticated && (
              <button
                onClick={() => setIsEditingStory(!isEditingStory)}
                className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                {isEditingStory ? <X size={16} className="mr-1" /> : <Edit size={16} className="mr-1" />}
                {isEditingStory ? 'Cancel' : 'Edit'}
              </button>
            )}
          </div>
          
          {isEditingStory && isAuthenticated ? (
            <div className="space-y-4">
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell your story..."
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add Images</label>
                  <FileUpload
                    onFileSelect={handleStoryImageUpload}
                    accept="image/*"
                    className="w-full"
                  >
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                      <Image size={24} className="mx-auto mb-2 text-gray-400" />
                      <span className="text-sm text-gray-600">Upload Images</span>
                    </div>
                  </FileUpload>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add Videos</label>
                  <FileUpload
                    onFileSelect={handleStoryVideoUpload}
                    accept="video/*"
                    maxSize={50}
                    className="w-full"
                  >
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                      <Video size={24} className="mx-auto mb-2 text-gray-400" />
                      <span className="text-sm text-gray-600">Upload Videos</span>
                    </div>
                  </FileUpload>
                </div>
              </div>
              
              {storyImages.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Story Images</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {storyImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img src={img} alt={`Story ${index + 1}`} className="w-full h-20 object-cover rounded" />
                        <button
                          onClick={() => setStoryImages(storyImages.filter((_, i) => i !== index))}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {storyVideos.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Story Videos</label>
                  <div className="grid grid-cols-1 gap-4">
                    {storyVideos.map((video, index) => (
                      <div key={index} className="relative group">
                        <video 
                          src={video} 
                          className="w-full rounded-lg bg-black" 
                          controls 
                          style={{ maxHeight: '400px' }}
                        />
                        <button
                          onClick={() => setStoryVideos(storyVideos.filter((_, i) => i !== index))}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <button
                onClick={() => setIsEditingStory(false)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={16} className="mr-1" />
                Save
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{story}</p>
              
              {storyImages.length > 0 && (
                <div className="mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {storyImages.map((img, index) => (
                      <img 
                        key={index} 
                        src={img} 
                        alt={`Story ${index + 1}`} 
                        className="w-full h-48 object-cover rounded-lg hover:opacity-90 transition-opacity"
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {storyVideos.length > 0 && (
                <div className="mt-6">
                  <div className="grid grid-cols-1 gap-6">
                    {storyVideos.map((video, index) => (
                      <div key={index} className="relative">
                        <video 
                          src={video} 
                          className="w-full rounded-lg bg-black" 
                          controls 
                          style={{ maxHeight: '500px' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Experience Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Experience</h2>
            {isAuthenticated && (
              <button
                onClick={addExperience}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} className="mr-1" />
                Add Experience
              </button>
            )}
          </div>
          
          <div className="space-y-6">
            {experiences.map((exp) => (
              <div key={exp.id} className="bg-white p-6 rounded-lg shadow-sm">
                {editingExperience === exp.id && isAuthenticated ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => setExperiences(experiences.map(e => e.id === exp.id ? {...e, title: e.target.value} : e))}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Job Title"
                    />
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => setExperiences(experiences.map(e => e.id === exp.id ? {...e, company: e.target.value} : e))}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Company"
                    />
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => setExperiences(experiences.map(e => e.id === exp.id ? {...e, location: e.target.value} : e))}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Location"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => setExperiences(experiences.map(e => e.id === exp.id ? {...e, startDate: e.target.value} : e))}
                        className="p-3 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => setExperiences(experiences.map(e => e.id === exp.id ? {...e, endDate: e.target.value} : e))}
                        className="p-3 border border-gray-300 rounded-lg"
                        disabled={exp.current}
                      />
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => setExperiences(experiences.map(e => e.id === exp.id ? {...e, current: e.target.checked, endDate: e.target.checked ? '' : e.endDate} : e))}
                        className="mr-2"
                      />
                      Currently working here
                    </label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => setExperiences(experiences.map(e => e.id === exp.id ? {...e, description: e.target.value} : e))}
                      className="w-full h-24 p-3 border border-gray-300 rounded-lg"
                      placeholder="Description"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingExperience(null)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Save size={16} className="mr-1" />
                        Save
                      </button>
                      <button
                        onClick={() => setExperiences(experiences.filter(e => e.id !== exp.id))}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{exp.title}</h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Building size={16} className="mr-1" />
                          <span>{exp.company}</span>
                        </div>
                        <div className="flex items-center text-gray-600 mt-1">
                          <MapPin size={16} className="mr-1" />
                          <span>{exp.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Calendar size={16} className="mr-1" />
                          <span>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                        </div>
                      </div>
                      {isAuthenticated && (
                        <button
                          onClick={() => setEditingExperience(exp.id)}
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700">{exp.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Education</h2>
            {isAuthenticated && (
              <button
                onClick={addEducation}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} className="mr-1" />
                Add Education
              </button>
            )}
          </div>
          
          <div className="space-y-6">
            {education.map((edu) => (
              <div key={edu.id} className="bg-white p-6 rounded-lg shadow-sm">
                {editingEducation === edu.id && isAuthenticated ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => setEducation(education.map(e => e.id === edu.id ? {...e, degree: e.target.value} : e))}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Degree"
                    />
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => setEducation(education.map(e => e.id === edu.id ? {...e, institution: e.target.value} : e))}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Institution"
                    />
                    <input
                      type="text"
                      value={edu.location}
                      onChange={(e) => setEducation(education.map(e => e.id === edu.id ? {...e, location: e.target.value} : e))}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Location"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="number"
                        value={edu.startDate}
                        onChange={(e) => setEducation(education.map(e => e.id === edu.id ? {...e, startDate: e.target.value} : e))}
                        className="p-3 border border-gray-300 rounded-lg"
                        placeholder="Start Year"
                      />
                      <input
                        type="number"
                        value={edu.endDate}
                        onChange={(e) => setEducation(education.map(e => e.id === edu.id ? {...e, endDate: e.target.value} : e))}
                        className="p-3 border border-gray-300 rounded-lg"
                        placeholder="End Year"
                      />
                    </div>
                    <textarea
                      value={edu.description || ''}
                      onChange={(e) => setEducation(education.map(e => e.id === edu.id ? {...e, description: e.target.value} : e))}
                      className="w-full h-24 p-3 border border-gray-300 rounded-lg"
                      placeholder="Description (optional)"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingEducation(null)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Save size={16} className="mr-1" />
                        Save
                      </button>
                      <button
                        onClick={() => setEducation(education.filter(e => e.id !== edu.id))}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{edu.degree}</h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <GraduationCap size={16} className="mr-1" />
                          <span>{edu.institution}</span>
                        </div>
                        <div className="flex items-center text-gray-600 mt-1">
                          <MapPin size={16} className="mr-1" />
                          <span>{edu.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Calendar size={16} className="mr-1" />
                          <span>{edu.startDate} - {edu.endDate}</span>
                        </div>
                      </div>
                      {isAuthenticated && (
                        <button
                          onClick={() => setEditingEducation(edu.id)}
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                    </div>
                    {edu.description && <p className="text-gray-700">{edu.description}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Certifications Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Certifications</h2>
            {isAuthenticated && (
              <button
                onClick={addCertification}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} className="mr-1" />
                Add Certification
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certifications.map((cert) => (
              <div key={cert.id} className="bg-white p-6 rounded-lg shadow-sm">
                {editingCertification === cert.id && isAuthenticated ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={cert.title}
                      onChange={(e) => setCertifications(certifications.map(c => c.id === cert.id ? {...c, title: e.target.value} : c))}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Certification Title"
                    />
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => setCertifications(certifications.map(c => c.id === cert.id ? {...c, issuer: e.target.value} : c))}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Issuer"
                    />
                    <input
                      type="month"
                      value={cert.issueDate}
                      onChange={(e) => setCertifications(certifications.map(c => c.id === cert.id ? {...c, issueDate: e.target.value} : c))}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      value={cert.credentialId || ''}
                      onChange={(e) => setCertifications(certifications.map(c => c.id === cert.id ? {...c, credentialId: e.target.value} : c))}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Credential ID (optional)"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Certificate</label>
                      <FileUpload
                        onFileSelect={(file) => handleCertificateUpload(cert.id, file)}
                        accept="image/*,.pdf"
                        className="w-full"
                      >
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                          <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                          <span className="text-sm text-gray-600">Upload Certificate (Image or PDF)</span>
                        </div>
                      </FileUpload>
                    </div>
                    
                    {cert.certificateFile && (
                      <div className="mt-2">
                        {cert.certificateType === 'image' ? (
                          <img 
                            src={cert.certificateFile} 
                            alt={cert.title}
                            className="w-full max-h-48 object-contain rounded-lg border"
                          />
                        ) : (
                          <a 
                            href={cert.certificateFile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <File size={16} className="mr-2" />
                            View Certificate PDF
                          </a>
                        )}
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingCertification(null)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Save size={16} className="mr-1" />
                        Save
                      </button>
                      <button
                        onClick={() => setCertifications(certifications.filter(c => c.id !== cert.id))}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{cert.title}</h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Award size={16} className="mr-1" />
                          <span>{cert.issuer}</span>
                        </div>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Calendar size={16} className="mr-1" />
                          <span>{formatDate(cert.issueDate)}</span>
                        </div>
                        {cert.credentialId && (
                          <div className="text-sm text-gray-500 mt-1">
                            ID: {cert.credentialId}
                          </div>
                        )}
                        {cert.certificateFile && (
                          <div className="mt-4">
                            {cert.certificateType === 'image' ? (
                              <div className="border rounded-lg overflow-hidden">
                                <img 
                                  src={cert.certificateFile} 
                                  alt={cert.title}
                                  className="w-full max-h-48 object-contain cursor-pointer"
                                  onClick={() => window.open(cert.certificateFile, '_blank')}
                                />
                              </div>
                            ) : (
                              <a 
                                href={cert.certificateFile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                              >
                                <File size={16} className="mr-2" />
                                View Certificate PDF
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                      {isAuthenticated && (
                        <button
                          onClick={() => setEditingCertification(cert.id)}
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Hobbies Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Hobbies & Interests</h2>
            {isAuthenticated && (
              <button
                onClick={() => setIsEditingHobbies(!isEditingHobbies)}
                className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                {isEditingHobbies ? <X size={16} className="mr-1" /> : <Edit size={16} className="mr-1" />}
                {isEditingHobbies ? 'Cancel' : 'Edit'}
              </button>
            )}
          </div>
          
          {isEditingHobbies && isAuthenticated ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 mb-4">
                {hobbies.map((hobby, index) => (
                  <div 
                    key={index}
                    className="relative"
                    onMouseEnter={() => setHoveredHobby(hobby)}
                    onMouseLeave={() => setHoveredHobby(null)}
                  >
                    <span
                      className={`flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                        `bg-gradient-to-r ${hobbyColors[index % hobbyColors.length]} text-white`
                      }`}
                    >
                      <Heart size={14} className="mr-1" />
                      {hobby}
                    </span>
                    {hoveredHobby === hobby && (
                      <button
                        onClick={() => removeHobby(hobby)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newHobby}
                  onChange={(e) => setNewHobby(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg"
                  placeholder="Add new hobby..."
                  onKeyDown={(e) => e.key === 'Enter' && addHobby()}
                />
                <button
                  onClick={addHobby}
                  className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <button
                onClick={() => setIsEditingHobbies(false)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={16} className="mr-1" />
                Save Changes
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex flex-wrap gap-3">
                {hobbies.map((hobby, index) => (
                  <span
                    key={index}
                    className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      `bg-gradient-to-r ${hobbyColors[index % hobbyColors.length]} text-white shadow-md`
                    }`}
                  >
                    <Heart size={14} className="mr-1" />
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AboutPage;