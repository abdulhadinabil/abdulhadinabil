import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, MessageCircle } from 'lucide-react';
import { Photo } from '../types';

const PhotoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Mock data - in a real app, this would come from your state management or API
  const [photo] = useState<Photo>({
    id: '1',
    title: 'Mountain Sunrise',
    description: 'Captured this breathtaking sunrise during my trek to the mountains. The golden hour light was absolutely magical. This photo represents one of those perfect moments when everything aligns - the weather, the light, and the composition. I woke up at 4 AM to hike to this viewpoint, and it was absolutely worth every step.',
    imageUrl: 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=1200',
    likes: 24,
    comments: [
      { id: '1', author: 'Sarah Johnson', content: 'Absolutely stunning! The colors are incredible.', createdAt: '2023-12-01T10:00:00Z' },
      { id: '2', author: 'Mike Chen', content: 'Great composition! What camera did you use?', createdAt: '2023-12-01T11:30:00Z' },
      { id: '3', author: 'Emma Davis', content: 'This makes me want to go hiking! Beautiful shot.', createdAt: '2023-12-01T14:15:00Z' },
      { id: '4', author: 'John Smith', content: 'The lighting is perfect. Well done!', createdAt: '2023-12-01T16:45:00Z' }
    ],
    createdAt: '2023-11-28T06:30:00Z'
  });

  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(photo.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setCurrentLikes(isLiked ? currentLikes - 1 : currentLikes + 1);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/photography/${photo.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Photo link copied to clipboard!');
  };

  const addComment = () => {
    if (!newComment.trim()) return;
    // In a real app, you would add the comment to your state/database
    setNewComment('');
    alert('Comment added! (This is a demo)');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const shareUrl = `${window.location.origin}/photography/${photo.id}`;

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/photography"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Photography
        </Link>

        {/* Photo */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <img
            src={photo.imageUrl}
            alt={photo.title}
            className="w-full h-96 object-cover"
          />
          
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{photo.title}</h1>
                <p className="text-gray-500">
                  Shared by <span className="font-medium">abdulhadinabil</span> • {formatDate(photo.createdAt)}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-6 leading-relaxed">{photo.description}</p>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-b py-4 mb-6">
              <div className="flex items-center space-x-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 transition-colors ${
                    isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
                  <span className="font-medium">{currentLikes}</span>
                </button>
                
                <div className="flex items-center space-x-2 text-gray-500">
                  <MessageCircle size={24} />
                  <span className="font-medium">{photo.comments.length}</span>
                </div>
              </div>
              
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
              >
                <Share2 size={24} />
                <span className="font-medium">Share</span>
              </button>
            </div>

            {/* Share URL */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Share this photo:</p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm"
                />
                <button
                  onClick={handleShare}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Comments */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Comments ({photo.comments.length})
              </h3>
              
              {/* Add Comment */}
              <div className="mb-6">
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                      placeholder="Add a comment..."
                    />
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={addComment}
                    disabled={!newComment.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Post Comment
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {photo.comments.map((comment) => (
                  <div key={comment.id} className="border-l-4 border-blue-100 pl-4 py-2">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-gray-900">{comment.author}</span>
                      <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetailPage;