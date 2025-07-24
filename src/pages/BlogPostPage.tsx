import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Eye, Tag, Share2 } from 'lucide-react';
import { BlogPost } from '../types';

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Mock data - in a real app, this would come from your state management or API
  const [post, setPost] = useState<BlogPost>({
    id: '1',
    title: 'Getting Started with Azure Infrastructure as Code',
    content: `Infrastructure as Code (IaC) has revolutionized how we manage and deploy cloud resources. In this comprehensive guide, I'll walk you through the fundamentals of using Terraform with Azure to automate your infrastructure deployment.

## Why Infrastructure as Code?

Traditional infrastructure management involves manual processes that are error-prone, time-consuming, and difficult to replicate. IaC solves these problems by:

- **Consistency**: Every deployment is identical
- **Version Control**: Track changes over time
- **Automation**: Reduce manual errors
- **Scalability**: Easily replicate environments

## Getting Started with Terraform

First, let's set up our development environment:

\`\`\`bash
# Install Terraform
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
sudo apt-get update && sudo apt-get install terraform
\`\`\`

## Creating Your First Azure Resource

Here's a simple example of creating a resource group:

\`\`\`hcl
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "main" {
  name     = "rg-myapp-prod"
  location = "East US"
}
\`\`\`

## Best Practices

When working with Terraform and Azure, keep these best practices in mind:

### 1. Use Remote State
Always store your Terraform state remotely for team collaboration:

\`\`\`hcl
terraform {
  backend "azurerm" {
    resource_group_name  = "tfstate-rg"
    storage_account_name = "tfstatestorage"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
  }
}
\`\`\`

### 2. Organize with Modules
Create reusable modules for common patterns:

\`\`\`
modules/
├── networking/
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
├── compute/
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
└── storage/
    ├── main.tf
    ├── variables.tf
    └── outputs.tf
\`\`\`

### 3. Implement Proper Naming Conventions
Use consistent naming conventions across all resources:

\`\`\`hcl
locals {
  naming_convention = {
    resource_group = "rg-\${var.project}-\${var.environment}"
    storage_account = "st\${var.project}\${var.environment}"
    virtual_network = "vnet-\${var.project}-\${var.environment}"
  }
}
\`\`\`

## Advanced Topics

### State Management
Understanding Terraform state is crucial for successful IaC implementation. The state file keeps track of the mapping between your configuration and the real-world resources.

### CI/CD Integration
Integrate Terraform with your CI/CD pipeline for automated deployments:

\`\`\`yaml
# Azure DevOps Pipeline
trigger:
- main

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: TerraformInstaller@0
  displayName: 'Install Terraform'
  inputs:
    terraformVersion: '1.0.0'

- script: |
    terraform init
    terraform plan -out=tfplan
    terraform apply tfplan
  displayName: 'Terraform Apply'
\`\`\`

## Conclusion

Infrastructure as Code with Terraform and Azure provides a powerful foundation for managing cloud resources at scale. By following these practices and gradually building your expertise, you'll be able to create robust, maintainable infrastructure that grows with your needs.

This is just the beginning of your IaC journey. In future posts, I'll cover more advanced topics like:
- Multi-environment deployments
- Security best practices
- Cost optimization strategies
- Disaster recovery planning

Stay tuned for more content, and feel free to reach out if you have any questions!`,
    excerpt: 'Learn how to automate your Azure infrastructure deployment using Terraform. This comprehensive guide covers the basics of Infrastructure as Code and practical examples.',
    featuredImage: 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tags: ['Azure', 'Terraform', 'DevOps', 'Infrastructure as Code'],
    views: 1247,
    createdAt: '2023-12-01T10:00:00Z',
    updatedAt: '2023-12-01T10:00:00Z'
  });

  // Increment view count when component mounts
  useEffect(() => {
    setPost(prev => ({ ...prev, views: prev.views + 1 }));
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    alert('Blog post link copied to clipboard!');
  };

  // Simple markdown-like rendering (basic implementation)
  const renderContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{line.substring(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">{line.substring(4)}</h3>;
        }
        
        // Code blocks
        if (line.startsWith('```')) {
          return <div key={index} className="my-4" />; // Placeholder for code blocks
        }
        
        // Lists
        if (line.startsWith('- ')) {
          return <li key={index} className="ml-6 mb-2">{line.substring(2)}</li>;
        }
        
        // Bold text (simple implementation)
        if (line.includes('**')) {
          const parts = line.split('**');
          return (
            <p key={index} className="mb-4 leading-relaxed">
              {parts.map((part, i) => 
                i % 2 === 1 ? <strong key={i}>{part}</strong> : part
              )}
            </p>
          );
        }
        
        // Regular paragraphs
        if (line.trim()) {
          return <p key={index} className="mb-4 leading-relaxed text-gray-700">{line}</p>;
        }
        
        return <br key={index} />;
      });
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Blog
        </Link>

        {/* Article */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Featured Image */}
          {post.featuredImage && (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-64 object-cover"
            />
          )}
          
          <div className="p-8">
            {/* Header */}
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center justify-between text-gray-600 mb-6">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye size={16} className="mr-2" />
                    <span>{post.views} views</span>
                  </div>
                </div>
                
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    <Tag size={12} className="mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            {/* Content */}
            <div className="prose max-w-none">
              {renderContent(post.content)}
            </div>

            {/* Footer */}
            <footer className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">
                    Written by <span className="font-medium text-gray-900">Abdul Hadi Nabil</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Azure Administrator & Cloud Solutions Architect
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Link
                    to="/contact"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Get in Touch
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </article>

        {/* Related Posts */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">More Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/blog/2"
              className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src="https://images.pexels.com/photos/1181290/pexels-photo-1181290.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Building Resilient Cloud Applications"
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2">Building Resilient Cloud Applications</h3>
                <p className="text-sm text-gray-600">Best practices for creating applications that can handle failures gracefully...</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogPostPage;