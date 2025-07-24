import React, { useState, useEffect } from 'react';
import { Send, MessageCircle, User, Clock, Reply, Check, CheckCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  admin_reply?: string;
  replied_at?: string;
  is_read: boolean;
}

const AdminMessaging: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages();
    
    // Subscribe to real-time updates
    const subscription = supabase
      .channel('contact_messages')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'contact_messages' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [payload.new as ContactMessage, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setMessages(prev => prev.map(msg => 
              msg.id === payload.new.id ? payload.new as ContactMessage : msg
            ));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const sendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({
          admin_reply: replyText,
          replied_at: new Date().toISOString(),
          is_read: true
        })
        .eq('id', selectedMessage.id);

      if (error) throw error;

      // In a real app, you would also send an email notification here
      alert('Reply sent successfully! (In production, this would send an email)');
      setReplyText('');
      setSelectedMessage(null);
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Error sending reply. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
        <h2 className="text-2xl font-bold flex items-center">
          <MessageCircle className="mr-3" size={24} />
          Contact Messages ({messages.filter(m => !m.is_read).length} unread)
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 h-96">
        {/* Messages List */}
        <div className="border-r border-gray-200 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
              <p>No messages yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (!message.is_read) {
                      markAsRead(message.id);
                    }
                  }}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !message.is_read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  } ${selectedMessage?.id === message.id ? 'bg-blue-100' : ''}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <User size={16} className="mr-2 text-gray-400" />
                      <span className="font-medium text-gray-900">{message.name}</span>
                      {!message.is_read && (
                        <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock size={12} className="mr-1" />
                      {formatDate(message.created_at)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{message.email}</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{message.message}</p>
                  {message.admin_reply && (
                    <div className="mt-2 flex items-center text-xs text-green-600">
                      <CheckCheck size={12} className="mr-1" />
                      Replied
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="flex flex-col">
          {selectedMessage ? (
            <>
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-bold text-gray-900">{selectedMessage.name}</h3>
                <p className="text-sm text-gray-600">{selectedMessage.email}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(selectedMessage.created_at)}
                </p>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Original Message:</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedMessage.message}
                  </p>
                </div>

                {selectedMessage.admin_reply && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Your Reply:</h4>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-gray-700">{selectedMessage.admin_reply}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Sent: {formatDate(selectedMessage.replied_at!)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder={selectedMessage.admin_reply ? "Send another reply..." : "Type your reply..."}
                  />
                  <button
                    onClick={sendReply}
                    disabled={!replyText.trim() || sending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {sending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Send size={16} className="mr-1" />
                        Reply
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Reply size={48} className="mx-auto mb-4 opacity-50" />
                <p>Select a message to view and reply</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessaging;