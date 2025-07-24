import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, ExternalLink, Github, Filter, Upload, Image } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Project } from '../types';
import FileUpload from '../components/FileUpload';

const ProjectsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'Azure Infrastructure Automation',
      description: 'Comprehensive Terraform modules for automating Azure infrastructure deployment including VNets, VMs, and security groups.',
      images: ['https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=800'],
      links: ['https://github.com/example/azure-terraform', 'https://docs.example.com/azure-guide'],
      category: 'Cloud Infrastructure',
      tags: ['Azure', 'Terraform', 'DevOps', 'Infrastructure as Code'],
      createdAt: '2023-06-15'
    },
    {
      id: '2',
      title: 'CI/CD Pipeline Template',
      description: 'Reusable GitHub Actions workflows for automated testing, building, and deployment of web applications.',
      images: ['https://images.pexels.com/photos/1181290/pexels-photo-1181290.jpeg?auto=compress&cs=tinysrgb&w=800'],
      links: ['https://github.com/example/cicd-template'],
      category: 'DevOps',
      tags: ['GitHub Actions', 'CI/CD', 'Docker', 'Automation'],
      createdAt: '2023-05-20'
    }
  ]);

  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Persist projects to localStorage for resume generation
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const categories = [...new Set(projects.map(p => p.category))];
  const allTags = [...new Set(projects.flatMap(p => p.tags))];

  const filteredProjects = projects.filter(project => {
    if (selectedCategory && project.category !== selectedCategory) return false;
    if (selectedTag && !project.tags.includes(selectedTag)) return false;
    return true;
  });

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      description: '',
      images: [],
      links: [],
      category: '',
      tags: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProjects([newProject, ...projects]);
    setEditingProject(newProject.id);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleImageUpload = (projectId: string, file: File) => {
    const url = URL.createObjectURL(file);
    const project = projects.find(p => p.id === projectId);
    if (project) {
      updateProject(projectId, { images: [...project.images, url] });
    }
  };

  const removeImage = (projectId: string, imageIndex: number) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      const newImages = project.images.filter((_, index) => index !== imageIndex);
      updateProject(projectId, { images: newImages });
    }
  };

  const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    const isEditing = editingProject === project.id;

    if (isEditing && isAuthenticated) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <input
              type="text"
              value={project.title}
              onChange={(e) => updateProject(project.id, { title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Project Title"
            />
            <textarea
              value={project.description}
              onChange={(e) => updateProject(project.id, { description: e.target.value })}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg"
              placeholder="Project Description"
            />
            <input
              type="text"
              value={project.category}
              onChange={(e) => updateProject(project.id, { category: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Category"
            />
            <input
              type="text"
              value={project.tags.join(', ')}
              onChange={(e) => updateProject(project.id, { tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Tags (comma separated)"
            />
            <input
              type="text"
              value={project.images.filter(img => !img.startsWith('blob:')).join(', ')}
              onChange={(e) => {
                const urlImages = e.target.value.split(',').map(i => i.trim()).filter(i => i);
                const blobImages = project.images.filter(img => img.startsWith('blob:'));
                updateProject(project.id, { images: [...urlImages, ...blobImages] });
              }}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Image URLs (comma separated)"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
              <FileUpload
                onFileSelect={(file) => handleImageUpload(project.id, file)}
                accept="image/*"
                className="w-full"
              >
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                  <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                  <span className="text-sm text-gray-600">Upload Project Images</span>
                </div>
              </FileUpload>
            </div>
            
            {project.images.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Images</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {project.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img src={img} alt={`Project ${index + 1}`} className="w-full h-20 object-cover rounded" />
                      <button
                        onClick={() => removeImage(project.id, index)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <input
              type="text"
              value={project.links.join(', ')}
              onChange={(e) => updateProject(project.id, { links: e.target.value.split(',').map(l => l.trim()).filter(l => l) })}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Links (comma separated)"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingProject(null)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={16} className="mr-1" />
                Save
              </button>
              <button
                onClick={() => deleteProject(project.id)}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {project.images.length > 0 && (
          <img
            src={project.images[0]}
            alt={project.title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
            {isAuthenticated && (
              <button
                onClick={() => setEditingProject(project.id)}
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Edit size={16} />
              </button>
            )}
          </div>
          
          <p className="text-gray-600 mb-4">{project.description}</p>
          
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {project.category}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          
          {project.links.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.links.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors text-sm"
                >
                  {link.includes('github') ? <Github size={14} className="mr-1" /> : <ExternalLink size={14} className="mr-1" />}
                  {link.includes('github') ? 'GitHub' : 'View'}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Projects</h1>
          <p className="text-lg text-gray-600">A showcase of my work in cloud computing, automation, and software development</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          {isAuthenticated && (
            <button
              onClick={addProject}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Add Project
            </button>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-600" />
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <select
              value={selectedTag || ''}
              onChange={(e) => setSelectedTag(e.target.value || null)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No projects found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;