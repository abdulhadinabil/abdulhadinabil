import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Edit, Trash2, Save, Eye, Calendar, Tag, 
  Bold, Italic, Underline, Strikethrough, AlignLeft, 
  AlignCenter, AlignRight, AlignJustify, List, ListOrdered,
  Link as LinkIcon, Image, Youtube, Paperclip, 
  Heading1, Heading2, Heading3, Quote, Code, Table,
  Undo, Redo, PaintBucket, Palette, Type, Minus, 
  ArrowDown, ArrowUp, Columns, Rows, Merge, Split,
  Heart, MessageCircle  // Added missing icons here
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { BlogPost, Comment } from '../types';
import { supabase } from '../lib/supabase';

// Rich Text Editor Component
const RichTextEditor: React.FC<{
  content: string;
  onChange: (content: string) => void;
  onInsertImage: () => void;
  onInsertVideo: () => void;
  onInsertLink: () => void;
  onInsertTable: (rows: number, cols: number) => void;
}> = ({ content, onChange, onInsertImage, onInsertVideo, onInsertLink, onInsertTable }) => {
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const editorRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState('16px');
  const [fontColor, setFontColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');

  const applyFormat = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInsertTable = () => {
    let tableHTML = '<table style="border-collapse: collapse; width: 100%;">';
    for (let i = 0; i < rows; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < cols; j++) {
        tableHTML += `<td style="border: 1px solid #ddd; padding: 8px;">Cell ${i+1}-${j+1}</td>`;
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</table>';
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      const div = document.createElement('div');
      div.innerHTML = tableHTML;
      const fragment = document.createDocumentFragment();
      while (div.firstChild) {
        fragment.appendChild(div.firstChild);
      }
      
      range.insertNode(fragment);
      onChange(editorRef.current?.innerHTML || '');
    }
    setShowTableDialog(false);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      selection.getRangeAt(0).deleteContents();
      selection.getRangeAt(0).insertNode(document.createTextNode(text));
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const img = document.createElement('img');
            img.src = event.target.result as string;
            img.style.maxWidth = '100%';
            
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              range.deleteContents();
              range.insertNode(img);
              if (editorRef.current) {
                onChange(editorRef.current.innerHTML);
              }
            }
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg">
      {/* Formatting Toolbar */}
      <div className="flex flex-wrap items-center p-2 bg-gray-100 border-b border-gray-300 gap-1">
        <select 
          value={fontSize} 
          onChange={(e) => applyFormat('fontSize', e.target.value)}
          className="p-1 border rounded text-sm"
        >
          <option value="1">8px</option>
          <option value="2">10px</option>
          <option value="3">12px</option>
          <option value="4">14px</option>
          <option value="5">18px</option>
          <option value="6">24px</option>
          <option value="7">36px</option>
        </select>
        
        <div className="flex items-center">
          <input 
            type="color" 
            value={fontColor}
            onChange={(e) => {
              setFontColor(e.target.value);
              applyFormat('foreColor', e.target.value);
            }}
            className="w-6 h-6 border-0 cursor-pointer"
          />
          <span className="text-xs ml-1">Text</span>
        </div>
        
        <div className="flex items-center">
          <input 
            type="color" 
            value={bgColor}
            onChange={(e) => {
              setBgColor(e.target.value);
              applyFormat('hiliteColor', e.target.value);
            }}
            className="w-6 h-6 border-0 cursor-pointer"
          />
          <span className="text-xs ml-1">Bg</span>
        </div>
        
        <button onClick={() => applyFormat('bold')} className="p-1 hover:bg-gray-200 rounded">
          <Bold size={16} />
        </button>
        <button onClick={() => applyFormat('italic')} className="p-1 hover:bg-gray-200 rounded">
          <Italic size={16} />
        </button>
        <button onClick={() => applyFormat('underline')} className="p-1 hover:bg-gray-200 rounded">
          <Underline size={16} />
        </button>
        <button onClick={() => applyFormat('strikethrough')} className="p-1 hover:bg-gray-200 rounded">
          <Strikethrough size={16} />
        </button>
        
        <button onClick={() => applyFormat('justifyLeft')} className="p-1 hover:bg-gray-200 rounded">
          <AlignLeft size={16} />
        </button>
        <button onClick={() => applyFormat('justifyCenter')} className="p-1 hover:bg-gray-200 rounded">
          <AlignCenter size={16} />
        </button>
        <button onClick={() => applyFormat('justifyRight')} className="p-1 hover:bg-gray-200 rounded">
          <AlignRight size={16} />
        </button>
        <button onClick={() => applyFormat('justifyFull')} className="p-1 hover:bg-gray-200 rounded">
          <AlignJustify size={16} />
        </button>
        
        <button onClick={() => applyFormat('insertUnorderedList')} className="p-1 hover:bg-gray-200 rounded">
          <List size={16} />
        </button>
        <button onClick={() => applyFormat('insertOrderedList')} className="p-1 hover:bg-gray-200 rounded">
          <ListOrdered size={16} />
        </button>
        
        <button onClick={() => applyFormat('formatBlock', '<H1>')} className="p-1 hover:bg-gray-200 rounded">
          <Heading1 size={16} />
        </button>
        <button onClick={() => applyFormat('formatBlock', '<H2>')} className="p-1 hover:bg-gray-200 rounded">
          <Heading2 size={16} />
        </button>
        <button onClick={() => applyFormat('formatBlock', '<H3>')} className="p-1 hover:bg-gray-200 rounded">
          <Heading3 size={16} />
        </button>
        <button onClick={() => applyFormat('formatBlock', '<BLOCKQUOTE>')} className="p-1 hover:bg-gray-200 rounded">
          <Quote size={16} />
        </button>
        <button onClick={() => applyFormat('formatBlock', '<PRE>')} className="p-1 hover:bg-gray-200 rounded">
          <Code size={16} />
        </button>
        
        <button onClick={onInsertLink} className="p-1 hover:bg-gray-200 rounded">
          <LinkIcon size={16} />
        </button>
        <button onClick={onInsertImage} className="p-1 hover:bg-gray-200 rounded">
          <Image size={16} />
        </button>
        <button onClick={onInsertVideo} className="p-1 hover:bg-gray-200 rounded">
          <Youtube size={16} />
        </button>
        
        <button 
          onClick={() => setShowTableDialog(true)} 
          className="p-1 hover:bg-gray-200 rounded"
        >
          <Table size={16} />
        </button>
        
        <button onClick={() => applyFormat('undo')} className="p-1 hover:bg-gray-200 rounded">
          <Undo size={16} />
        </button>
        <button onClick={() => applyFormat('redo')} className="p-1 hover:bg-gray-200 rounded">
          <Redo size={16} />
        </button>
        
        <button 
          onClick={() => applyFormat('insertHorizontalRule')} 
          className="p-1 hover:bg-gray-200 rounded"
        >
          <Minus size={16} />
        </button>
      </div>
      
      {/* Editor Content */}
      <div
        ref={editorRef}
        className="min-h-[300px] p-4 bg-white"
        contentEditable
        dangerouslySetInnerHTML={{ __html: content }}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onPaste={handlePaste}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
      
      {/* Table Insertion Dialog */}
      {showTableDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Insert Table</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Rows</label>
                <div className="flex items-center">
                  <button 
                    onClick={() => setRows(Math.max(1, rows - 1))}
                    className="p-1 border border-gray-300 rounded-l"
                  >
                    <ArrowDown size={16} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={rows}
                    onChange={(e) => setRows(Math.max(1, parseInt(e.target.value)))}
                    className="w-full p-1 border-y border-gray-300 text-center"
                  />
                  <button 
                    onClick={() => setRows(rows + 1)}
                    className="p-1 border border-gray-300 rounded-r"
                  >
                    <ArrowUp size={16} />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Columns</label>
                <div className="flex items-center">
                  <button 
                    onClick={() => setCols(Math.max(1, cols - 1))}
                    className="p-1 border border-gray-300 rounded-l"
                  >
                    <ArrowDown size={16} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={cols}
                    onChange={(e) => setCols(Math.max(1, parseInt(e.target.value)))}
                    className="w-full p-1 border-y border-gray-300 text-center"
                  />
                  <button 
                    onClick={() => setCols(cols + 1)}
                    className="p-1 border border-gray-300 rounded-r"
                  >
                    <ArrowUp size={16} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowTableDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertTable}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BlogPage: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    return [
      {
        id: '1',
        title: 'Getting Started with Azure Infrastructure as Code',
        content: `<h2>Why Infrastructure as Code?</h2>
<p>Infrastructure as Code (IaC) has revolutionized how we manage and deploy cloud resources. Traditional infrastructure management involves manual processes that are:</p>
<ul>
  <li>Error-prone</li>
  <li>Time-consuming</li>
  <li>Difficult to replicate</li>
</ul>
<p>IaC solves these problems by:</p>
<ul>
  <li><strong>Consistency</strong>: Every deployment is identical</li>
  <li><strong>Version Control</strong>: Track changes over time</li>
  <li><strong>Automation</strong>: Reduce manual errors</li>
  <li><strong>Scalability</strong>: Easily replicate environments</li>
</ul>
<h2>Getting Started with Terraform</h2>
<p>First, let's set up our development environment:</p>
<pre><code># Install Terraform
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
sudo apt-get update && sudo apt-get install terraform</code></pre>
<h2>Creating Your First Azure Resource</h2>
<p>Here's a simple example of creating a resource group:</p>
<pre><code>terraform {
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
}</code></pre>
<p>This is just the beginning of your IaC journey. In future posts, I'll cover more advanced topics like state management, modules, and CI/CD integration.</p>`,
        excerpt: 'Learn how to automate your Azure infrastructure deployment using Terraform. This comprehensive guide covers the basics of Infrastructure as Code and practical examples.',
        featuredImage: 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['Azure', 'Terraform', 'DevOps', 'Infrastructure as Code'],
        views: 1247,
        likes: 42,
        createdAt: '2023-12-01T10:00:00Z',
        updatedAt: '2023-12-01T10:00:00Z',
        comments: [
          {
            id: 'c1',
            author: 'DevOps Engineer',
            content: 'Great introduction! Looking forward to the advanced topics.',
            createdAt: '2023-12-02T14:30:00Z'
          },
          {
            id: 'c2',
            author: 'Cloud Architect',
            content: 'Would love to see a comparison with AWS CloudFormation.',
            createdAt: '2023-12-03T09:15:00Z'
          }
        ]
      },
      {
        id: '2',
        title: 'Building Resilient Cloud Applications',
        content: `<h2>The Pillars of Resilience</h2>
<h3>1. Redundancy</h3>
<p>Never rely on a single point of failure. Implement redundancy at every level:</p>
<ul>
  <li>Multiple availability zones</li>
  <li>Load balancers</li>
  <li>Database replicas</li>
</ul>
<h3>2. Monitoring and Alerting</h3>
<p>You can't fix what you can't see. Implement comprehensive monitoring:</p>
<ul>
  <li>Application performance monitoring</li>
  <li>Infrastructure metrics</li>
  <li>Custom business metrics</li>
</ul>
<h3>3. Graceful Degradation</h3>
<p>When components fail, your application should degrade gracefully rather than crash completely.</p>
<h2>Practical Implementation</h2>
<p>Here's how I implement these principles in my Azure applications:</p>
<pre><code># Azure Application Gateway configuration
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database.primary: "primary-db.database.windows.net"
  database.secondary: "secondary-db.database.windows.net"
  retry.maxAttempts: "3"
  timeout.seconds: "30"</code></pre>
<p>Building resilient applications is an ongoing process that requires careful planning and continuous improvement.</p>`,
        excerpt: 'Discover best practices for building resilient cloud applications that can handle failures gracefully and scale efficiently.',
        featuredImage: 'https://images.pexels.com/photos/1181290/pexels-photo-1181290.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['Cloud Architecture', 'Resilience', 'Best Practices', 'Azure'],
        views: 892,
        likes: 28,
        createdAt: '2023-11-28T14:30:00Z',
        updatedAt: '2023-11-28T14:30:00Z',
        comments: [
          {
            id: 'c3',
            author: 'Software Developer',
            content: 'The graceful degradation pattern saved our app during the last outage!',
            createdAt: '2023-11-29T16:45:00Z'
          }
        ]
      }
    ];
  });

  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [expandedCommentsPost, setExpandedCommentsPost] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<{ [postId: string]: { author: string; content: string } }>({});

  useEffect(() => {
    fetchBlogPosts();
    
    // Subscribe to real-time updates for blog posts
    const postsSubscription = supabase
      .channel('blog_posts')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'blog_posts' },
        () => {
          fetchBlogPosts();
        }
      )
      .subscribe();

    // Subscribe to real-time updates for comments
    const commentsSubscription = supabase
      .channel('blog_comments')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'blog_comments' },
        () => {
          fetchBlogPosts();
        }
      )
      .subscribe();

    return () => {
      postsSubscription.unsubscribe();
      commentsSubscription.unsubscribe();
    };
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // Fetch comments for each post
      const postsWithComments = await Promise.all(
        (postsData || []).map(async (post) => {
          const { data: commentsData, error: commentsError } = await supabase
            .from('blog_comments')
            .select('*')
            .eq('blog_post_id', post.id)
            .order('created_at', { ascending: true });

          if (commentsError) {
            console.error('Error fetching comments:', commentsError);
            return { ...post, comments: [] };
          }

          return {
            ...post,
            comments: commentsData || [],
            createdAt: post.created_at,
            updatedAt: post.updated_at
          };
        })
      );

      setPosts(postsWithComments);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  const allTags = [...new Set(posts.flatMap(p => p.tags))];

  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags.includes(selectedTag))
    : posts;

  const addPost = () => {
    if (!isAuthenticated) return;
    
    const createPost = async () => {
      try {
        // Get the current user ID or use default admin ID
        const userId = '00000000-0000-0000-0000-000000000000';
        
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([
            {
              title: 'New Blog Post',
              content: '<p>Start writing your content here...</p>',
              excerpt: 'Brief summary of your post',
              featured_image: '',
              tags: [],
              views: 0,
              user_id: userId
            }
          ])
          .select()
          .single();

        if (error) throw error;
        setEditingPost(data.id);
      } catch (error) {
        console.error('Error creating post:', error);
        alert('Error creating post. Please try again.');
      }
    };

    createPost();
  };

  const updatePost = async (id: string, updates: Partial<BlogPost>) => {
    if (!isAuthenticated) return;
    
    try {
      const updateData: any = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.content !== undefined) updateData.content = updates.content;
      if (updates.excerpt !== undefined) updateData.excerpt = updates.excerpt;
      if (updates.featuredImage !== undefined) updateData.featured_image = updates.featuredImage;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.likes !== undefined) updateData.likes = updates.likes;
      if (updates.views !== undefined) updateData.views = updates.views;
      
      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const deletePost = async (id: string) => {
    if (!isAuthenticated) return;
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLike = async (postId: string) => {
    try {
      const { error } = await supabase.rpc('increment_blog_likes', {
        post_id: postId
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const addComment = async (postId: string) => {
    const commentData = newComment[postId];
    if (!commentData || !commentData.author.trim() || !commentData.content.trim()) return;

    try {
      const { error } = await supabase
        .from('blog_comments')
        .insert([
          {
            blog_post_id: postId,
            author: commentData.author,
            content: commentData.content
          }
        ]);

      if (error) throw error;

      // Clear comment form
      setNewComment(prev => ({ ...prev, [postId]: { author: '', content: '' } }));
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error adding comment. Please try again.');
    }
  };

  const deleteComment = async (postId: string, commentId: string) => {
    if (!isAuthenticated) return;
    
    try {
      const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Error deleting comment. Please try again.');
    }
  };

  const handleInsertLink = (postId: string) => {
    const url = prompt('Enter URL:');
    const text = prompt('Enter link text:') || 'Link';
    
    if (url) {
      const markdownLink = `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      const post = posts.find(p => p.id === postId);
      if (post) {
        updatePost(postId, { content: `${post.content} ${markdownLink}` });
      }
    }
  };

  const handleInsertImage = (postId: string) => {
    const url = prompt('Enter image URL:');
    const altText = prompt('Enter alt text:') || 'Image';
    
    if (url) {
      const markdownImage = `<img src="${url}" alt="${altText}" style="max-width: 100%; display: block; margin: 1rem auto;" />`;
      const post = posts.find(p => p.id === postId);
      if (post) {
        updatePost(postId, { content: `${post.content} ${markdownImage}` });
      }
    }
  };

  const handleInsertVideo = (postId: string) => {
    const url = prompt('Enter video URL:');
    if (url) {
      const videoEmbed = `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 1rem auto;">
  <iframe 
    src="${url}" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
    allowfullscreen
  ></iframe>
</div>`;
      const post = posts.find(p => p.id === postId);
      if (post) {
        updatePost(postId, { content: `${post.content} ${videoEmbed}` });
      }
    }
  };

  const handleInsertTable = (postId: string, rows: number, cols: number) => {
    let tableHTML = '<table style="border-collapse: collapse; width: 100%; margin: 1rem 0;">';
    for (let i = 0; i < rows; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < cols; j++) {
        tableHTML += `<td style="border: 1px solid #ddd; padding: 8px;">Cell ${i+1}-${j+1}</td>`;
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</table>';
    
    const post = posts.find(p => p.id === postId);
    if (post) {
      updatePost(postId, { content: `${post.content} ${tableHTML}` });
    }
  };

  const BlogPostCard: React.FC<{ post: BlogPost }> = ({ post }) => {
    const isEditing = editingPost === post.id;
    const commentsExpanded = expandedCommentsPost === post.id;

    if (isEditing && isAuthenticated) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="space-y-4">
            <input
              type="text"
              value={post.title}
              onChange={(e) => updatePost(post.id, { title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg text-lg font-medium"
              placeholder="Blog Post Title"
            />
            
            <input
              type="text"
              value={post.excerpt}
              onChange={(e) => updatePost(post.id, { excerpt: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Brief excerpt or summary"
            />
            
            <input
              type="url"
              value={post.featuredImage || ''}
              onChange={(e) => updatePost(post.id, { featuredImage: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Featured image URL (optional)"
            />
            
            <input
              type="text"
              value={post.tags.join(', ')}
              onChange={(e) => updatePost(post.id, { 
                tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
              })}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Tags (comma separated)"
            />
            
            <RichTextEditor
              content={post.content}
              onChange={(content) => updatePost(post.id, { content })}
              onInsertImage={() => handleInsertImage(post.id)}
              onInsertVideo={() => handleInsertVideo(post.id)}
              onInsertLink={() => handleInsertLink(post.id)}
              onInsertTable={(rows, cols) => handleInsertTable(post.id, rows, cols)}
            />
            
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingPost(null)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={16} className="mr-1" />
                Save Post
              </button>
              <button
                onClick={() => deletePost(post.id)}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 size={16} className="mr-1" />
                Delete Post
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow mb-8">
        {post.featuredImage && (
          <div className="relative">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-4 right-4 flex space-x-2">
              {isAuthenticated && (
                <button
                  onClick={() => setEditingPost(post.id)}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                  <Edit size={18} className="text-blue-600" />
                </button>
              )}
            </div>
          </div>
        )}
        
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors mb-3">
            <Link to={`/blog/${post.id}`}>{post.title}</Link>
          </h2>
          
          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm cursor-pointer hover:bg-blue-200 transition-colors"
                onClick={() => setSelectedTag(tag)}
              >
                <Tag size={12} className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            
            <div className="flex items-center">
              <Eye size={14} className="mr-1" />
              <span>{post.views} views</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 border-t border-gray-100 pt-3">
            <button 
              onClick={() => handleLike(post.id)}
              className="flex items-center text-gray-600 hover:text-red-500 transition-colors"
            >
              <Heart size={16} className="mr-1" />
              <span>{post.likes} likes</span>
            </button>
            
            <button 
              onClick={() => setExpandedCommentsPost(commentsExpanded ? null : post.id)}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <MessageCircle size={16} className="mr-1" />
              <span>{post.comments.length} comments</span>
            </button>
            
            <Link
              to={`/blog/${post.id}`}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors ml-auto"
            >
              Read Full Post →
            </Link>
          </div>

          {/* Comments Section */}
          {commentsExpanded && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h3 className="text-lg font-medium mb-4">Comments ({post.comments.length})</h3>
              
              <div className="space-y-4 mb-6">
                {post.comments.map(comment => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{comment.author}</h4>
                        <p className="text-gray-500 text-sm mb-2">
                          {formatDateTime(comment.created_at)}
                        </p>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                      {isAuthenticated && (
                        <button 
                          onClick={() => deleteComment(post.id, comment.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                {post.comments.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                )}
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Add a comment</h4>
                <input
                  type="text"
                  value={newComment[post.id]?.author || ''}
                  onChange={(e) => setNewComment({
                    ...newComment,
                    [post.id]: { 
                      ...(newComment[post.id] || { author: '', content: '' }), 
                      author: e.target.value 
                    }
                  })}
                  className="w-full p-2 border border-gray-300 rounded mb-3"
                  placeholder="Your name"
                />
                <textarea
                  value={newComment[post.id]?.content || ''}
                  onChange={(e) => setNewComment({
                    ...newComment,
                    [post.id]: { 
                      ...(newComment[post.id] || { author: '', content: '' }), 
                      content: e.target.value 
                    }
                  })}
                  className="w-full p-2 border border-gray-300 rounded mb-3"
                  placeholder="Your comment"
                  rows={3}
                />
                <button
                  onClick={() => addComment(post.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Post Comment
                </button>
              </div>
            </div>
          )}
        </div>
      </article>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Tech Blog</h1>
          <p className="text-lg text-gray-600">Thoughts, tutorials, and insights about cloud computing and technology</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          {isAuthenticated && (
            <button
              onClick={addPost}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              New Post
            </button>
          )}

          {/* Tag Filter */}
          <div className="flex items-center space-x-2">
            <Tag size={16} className="text-gray-600" />
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

        {/* Blog Posts */}
        <div>
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <BlogPostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No blog posts found matching your filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;