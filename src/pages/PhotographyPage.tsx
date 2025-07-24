import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Save, X, Heart, MessageCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; // Fixed import path
import { Photo, Comment } from '../types';
import { supabase } from '../lib/supabase';
import FileUpload from '../components/FileUpload';

const PhotographyPage: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [editingPhoto, setEditingPhoto] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    description: '',
    imageUrl: '',
    imageFile: null as File | null
  });
  const [newComment, setNewComment] = useState<{ [photoId: string]: { author: string; content: string } }>({});

  useEffect(() => {
    fetchPhotos();
    
    // Subscribe to real-time updates for photos
    const photosSubscription = supabase
      .channel('photos')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'photos' },
        () => {
          fetchPhotos();
        }
      )
      .subscribe();

    // Subscribe to real-time updates for photo comments
    const commentsSubscription = supabase
      .channel('photo_comments')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'photo_comments' },
        () => {
          fetchPhotos();
        }
      )
      .subscribe();

    return () => {
      photosSubscription.unsubscribe();
      commentsSubscription.unsubscribe();
    };
  }, []);

  const fetchPhotos = async () => {
    try {
      const { data: photosData, error: photosError } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (photosError) throw photosError;

      // Fetch comments for each photo
      const photosWithComments = await Promise.all(
        (photosData || []).map(async (photo) => {
          const { data: commentsData, error: commentsError } = await supabase
            .from('photo_comments')
            .select('*')
            .eq('photo_id', photo.id)
            .order('created_at', { ascending: true });

          if (commentsError) {
            console.error('Error fetching comments:', commentsError);
            return { ...photo, comments: [] };
          }

          return {
            ...photo,
            comments: commentsData || [],
            createdAt: photo.created_at
          };
        })
      );

      setPhotos(photosWithComments);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const handleImageUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setNewPhoto(prev => ({ ...prev, imageUrl: url, imageFile: file }));
  };

  const addPhoto = async () => {
    if (!isAuthenticated || !newPhoto.title.trim() || !newPhoto.description.trim() || !newPhoto.imageFile) {
      alert('Please fill in all fields and upload an image');
      return;
    }

    if (!currentUser?.id) {
      alert('Authentication error. Please log in again.');
      return;
    }

    try {
      // Upload image file to Supabase Storage
      const fileExt = newPhoto.imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('photos-bucket')
        .upload(filePath, newPhoto.imageFile);

      if (uploadError) throw uploadError;

      // Get public URL for the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('photos-bucket')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      // Insert photo info into database
      const { data, error } = await supabase
        .from('photos')
        .insert([
          {
            title: newPhoto.title,
            description: newPhoto.description,
            image_url: publicUrl,
            likes: 0,
            user_id: currentUser.id,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Clear inputs and close modal
      setNewPhoto({ title: '', description: '', imageUrl: '', imageFile: null });
      setShowAddModal(false);

      // Refresh photos list
      fetchPhotos();
    } catch (error) {
      console.error('Error adding photo:', error);
      alert('Error adding photo. Please try again.');
    }
  };

  const updatePhoto = async (id: string, updates: Partial<Photo>) => {
    if (!isAuthenticated) return;
    
    try {
      const updateData: any = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;
      if (updates.likes !== undefined) updateData.likes = updates.likes;

      const { error } = await supabase
        .from('photos')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating photo:', error);
    }
  };

  const deletePhoto = async (id: string) => {
    if (!isAuthenticated) return;
    
    try {
      const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Refresh photos after deletion
      fetchPhotos();
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Error deleting photo. Please try again.');
    }
  };

  const handleLike = async (photoId: string) => {
    try {
      // Optimistic UI update
      setPhotos(prevPhotos => prevPhotos.map(photo => 
        photo.id === photoId ? { ...photo, likes: photo.likes + 1 } : photo
      ));

      const { error } = await supabase.rpc('increment_photo_likes', {
        photo_id: photoId
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error liking photo:', error);
      // Revert on error
      fetchPhotos();
    }
  };

  const addComment = async (photoId: string) => {
    const commentData = newComment[photoId];
    if (!commentData || !commentData.author.trim() || !commentData.content.trim()) return;

    try {
      // Optimistic UI update
      setPhotos(prevPhotos => prevPhotos.map(photo => {
        if (photo.id === photoId) {
          return {
            ...photo,
            comments: [
              ...photo.comments,
              {
                id: `temp-${Date.now()}`,
                photo_id: photoId,
                author: commentData.author,
                content: commentData.content,
                created_at: new Date().toISOString()
              }
            ]
          };
        }
        return photo;
      }));

      const { error } = await supabase
        .from('photo_comments')
        .insert([
          {
            photo_id: photoId,
            author: commentData.author,
            content: commentData.content
          }
        ]);

      if (error) throw error;

      // Clear comment form
      setNewComment(prev => ({ ...prev, [photoId]: { author: '', content: '' } }));
      
      // Refresh comments
      fetchPhotos();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error adding comment. Please try again.');
      // Revert on error
      fetchPhotos();
    }
  };

  const deleteComment = async (photoId: string, commentId: string) => {
    if (!isAuthenticated) return;
    
    try {
      // Optimistic UI update
      setPhotos(prevPhotos => prevPhotos.map(photo => {
        if (photo.id === photoId) {
          return {
            ...photo,
            comments: photo.comments.filter(comment => comment.id !== commentId)
          };
        }
        return photo;
      }));

      const { error } = await supabase
        .from('photo_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Error deleting comment. Please try again.');
      // Revert on error
      fetchPhotos();
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

  const PhotoCard: React.FC<{ photo: Photo }> = ({ photo }) => {
    const isEditing = editingPhoto === photo.id;

    if (isEditing && isAuthenticated) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <input
              type="text"
              value={photo.title}
              onChange={(e) => updatePhoto(photo.id, { title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Photo Title"
            />
            <textarea
              value={photo.description}
              onChange={(e) => updatePhoto(photo.id, { description: e.target.value })}
              className="w-full h-24 p-3 border border-gray-300 rounded-lg"
              placeholder="Photo Description"
            />
            <input
              type="url"
              value={photo.image_url}
              onChange={(e) => updatePhoto(photo.id, { imageUrl: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Image URL"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingPhoto(null)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={16} className="mr-1" />
                Save
              </button>
              <button
                onClick={() => deletePhoto(photo.id)}
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
        <div className="relative">
          <img
            src={photo.image_url}
            alt={photo.title}
            className="w-full h-64 object-cover"
          />
          {isAuthenticated && (
            <button
              onClick={() => setEditingPhoto(photo.id)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            >
              <Edit size={18} className="text-blue-600" />
            </button>
          )}
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{photo.title}</h3>
          <p className="text-gray-600 mb-4">{photo.description}</p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <span>{formatDate(photo.created_at)}</span>
          </div>
          
          <div className="flex items-center space-x-4 border-t border-gray-100 pt-4">
            <button 
              onClick={() => handleLike(photo.id)}
              className="flex items-center text-gray-600 hover:text-red-500 transition-colors"
            >
              <Heart size={16} className="mr-1" />
              <span>{photo.likes} likes</span>
            </button>
            
            <div className="flex items-center text-gray-600">
              <MessageCircle size={16} className="mr-1" />
              <span>{photo.comments.length} comments</span>
            </div>
            
            <Link
              to={`/photography/${photo.id}`}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors ml-auto"
            >
              View Details →
            </Link>
          </div>

          {/* Comments Section */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <h4 className="font-medium text-gray-900 mb-3">Comments</h4>
            
            <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
              {photo.comments.slice(0, 3).map(comment => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium text-gray-900 text-sm">{comment.author}</h5>
                      <p className="text-gray-500 text-xs mb-1">
                        {formatDateTime(comment.created_at)}
                      </p>
                      <p className="text-gray-700 text-sm">{comment.content}</p>
                    </div>
                    {isAuthenticated && (
                      <button 
                        onClick={() => deleteComment(photo.id, comment.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {photo.comments.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-2">No comments yet. Be the first to comment!</p>
              )}
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <input
                type="text"
                value={newComment[photo.id]?.author || ''}
                onChange={(e) => setNewComment({
                  ...newComment,
                  [photo.id]: { 
                    ...(newComment[photo.id] || { author: '', content: '' }), 
                    author: e.target.value 
                  }
                })}
                className="w-full p-2 border border-gray-300 rounded mb-2 text-sm"
                placeholder="Your name"
              />
              <textarea
                value={newComment[photo.id]?.content || ''}
                onChange={(e) => setNewComment({
                  ...newComment,
                  [photo.id]: { 
                    ...(newComment[photo.id] || { author: '', content: '' }), 
                    content: e.target.value 
                  }
                })}
                className="w-full p-2 border border-gray-300 rounded mb-2 text-sm"
                placeholder="Your comment"
                rows={2}
              />
              <button
                onClick={() => addComment(photo.id)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Photography</h1>
          <p className="text-lg text-gray-600">Capturing moments and sharing stories through the lens</p>
        </div>

        {/* Add Photo Button */}
        {isAuthenticated && (
          <div className="mb-8">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Add Photo
            </button>
          </div>
        )}

        {/* Photos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.length > 0 ? (
            photos.map(photo => (
              <PhotoCard key={photo.id} photo={photo} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No photos yet. Start sharing your photography!</p>
            </div>
          )}
        </div>

        {/* Add Photo Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add New Photo</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  value={newPhoto.title}
                  onChange={(e) => setNewPhoto(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Photo Title"
                />
                
                <textarea
                  value={newPhoto.description}
                  onChange={(e) => setNewPhoto(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg"
                  placeholder="Photo Description"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo</label>
                  <FileUpload
                    onFileSelect={handleImageUpload}
                    accept="image/*"
                    className="w-full"
                  >
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <ImageIcon size={32} className="mx-auto mb-2 text-gray-400" />
                      <span className="text-sm text-gray-600">Click to upload or drag and drop</span>
                    </div>
                  </FileUpload>
                </div>
                
                {newPhoto.imageUrl && (
                  <div className="mt-4">
                    <img 
                      src={newPhoto.imageUrl} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <button
                    onClick={addPhoto}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Photo
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotographyPage;