/**
 * CommentSection Component
 * Comments and replies on testimonials
 */

'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: Date | string;
  replies?: Comment[];
  likes?: number;
}

interface CommentSectionProps {
  comments: Comment[];
  onAddComment?: (content: string, parentId?: string) => Promise<void>;
  onDeleteComment?: (commentId: string) => Promise<void>;
  isLoading?: boolean;
  allowComments?: boolean;
}

export function CommentSection({
  comments,
  onAddComment,
  onDeleteComment,
  isLoading = false,
  allowComments = true,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = async () => {
    if (!newComment.trim() || !onAddComment) return;
    setIsSubmitting(true);
    try {
      await onAddComment(newComment);
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddReply = async (parentId: string) => {
    if (!replyContent.trim() || !onAddComment) return;
    setIsSubmitting(true);
    try {
      await onAddComment(replyContent, parentId);
      setReplyContent('');
      setReplyingTo(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(d, { addSuffix: true });
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`space-y-3 ${isReply ? 'ml-8 mt-3' : ''}`}>
      <div className={`p-4 rounded-lg ${isReply ? 'bg-gray-50' : 'bg-white border border-gray-200'}`}>
        {/* Comment Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-medium text-gray-900">{comment.author}</p>
            <p className="text-xs text-gray-600">{formatDate(comment.createdAt)}</p>
          </div>
          {onDeleteComment && (
            <button
              onClick={() => onDeleteComment(comment.id)}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          )}
        </div>

        {/* Comment Content */}
        <p className="text-gray-700 text-sm">{comment.content}</p>

        {/* Comment Actions */}
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
          <button className="hover:text-blue-600">👍 Like {comment.likes ? `(${comment.likes})` : ''}</button>
          {!isReply && (
            <button
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="hover:text-blue-600"
            >
              💬 Reply
            </button>
          )}
        </div>
      </div>

      {/* Reply Form */}
      {replyingTo === comment.id && (
        <div className="ml-8 space-y-2">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleAddReply(comment.id)}
              disabled={isSubmitting || !replyContent.trim()}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded disabled:opacity-50"
            >
              Reply
            </button>
            <button
              onClick={() => {
                setReplyingTo(null);
                setReplyContent('');
              }}
              className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-900 text-sm rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg text-gray-900">
        Comments ({comments.length})
      </h3>

      {/* Add Comment Form */}
      {allowComments && (
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            disabled={isLoading || isSubmitting}
          />
          <button
            onClick={handleAddComment}
            disabled={isLoading || isSubmitting || !newComment.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => renderComment(comment))}
        </div>
      )}
    </div>
  );
}

