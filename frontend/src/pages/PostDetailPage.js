import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const PostDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [downvoteCount, setDownvoteCount] = useState(0);
  const [userVote, setUserVote] = useState(null); // 'up', 'down', or null
  const commentSectionRef = useRef(null);
  const commentInputRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const [postRes, commentsRes] = await Promise.all([
          API.get(`/posts/${id}`),
          API.get(`/comments/${id}`)
        ]);
        setPost(postRes.data);
        setComments(commentsRes.data);
        const upvotes = postRes.data.upvotes || [];
        const downvotes = postRes.data.downvotes || [];
        setUpvoteCount(upvotes.length);
        setDownvoteCount(downvotes.length);
        if (upvotes.some(v => v._id === user?._id)) {
          setUserVote('up');
        } else if (downvotes.some(v => v._id === user?._id)) {
          setUserVote('down');
        } else {
          setUserVote(null);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id, user]);

  const handleVote = async (vote) => {
    if (!user) return;
    try {
      const { data } = await API.post(`/posts/${id}/vote`, { vote });
      setUpvoteCount(data.upvotes.length);
      setDownvoteCount(data.downvotes.length);
      setUserVote(data.upvotes.some(v => v._id === user._id) ? 'up' : data.downvotes.some(v => v._id === user._id) ? 'down' : null);
    } catch (err) {
      console.error('Failed to vote', err);
    }
  };

  const scrollToComments = () => {
    commentSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => commentInputRef.current?.focus(), 250);
  };

  useEffect(() => {
    if (!loading && location.search.includes('focus=comment')) {
      commentSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => commentInputRef.current?.focus(), 250);
    }
  }, [loading, location.search]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    try {
      const { data } = await API.post(`/comments/${id}`, { body: newComment });
      setComments([...comments, data]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment', err);
    }
  };

  if (loading) return <p>Loading post...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '20px' }}>
        ← Back to feed
      </Link>

      <h2>{post.title}</h2>

      {post.image && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src={`http://localhost:5000/uploads/${post.image}`}
            alt={post.title}
            style={{ maxWidth: '600px', maxHeight: '400px', width: 'auto', height: 'auto', display: 'block', margin: '0 auto' }}
          />
        </div>
      )}

      <p>{post.body}</p>

      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        {post.author?.profilePic && (
          <img
            src={`http://localhost:5000/uploads/${post.author.profilePic}`}
            alt={post.author.name}
            style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
          />
        )}
        <p style={{ color: '#555', margin: 0 }}>
          By {post.author?.name || 'Unknown'} ·{' '}
          {post.createdAt ? new Date(post.createdAt).toLocaleString() : 'No date'}
        </p>
      </div>

      <div style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => handleVote('up')}
            disabled={!user}
            style={{
              backgroundColor: userVote === 'up' ? '#483C32' : '#f0f0f0',
              color: userVote === 'up' ? '#fff' : '#483C32',
              border: '1px solid #483C32',
              padding: '8px 12px',
              cursor: user ? 'pointer' : 'not-allowed',
              fontSize: '18px',
              borderRadius: '6px'
            }}
          >
            ▲
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#555' }}>Upvotes</div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{upvoteCount}</div>
          </div>
        </div>

        <button
          onClick={scrollToComments}
          style={{
            backgroundColor: '#fff',
            color: '#483C32',
            border: '1px solid #ddd',
            padding: '10px 15px',
            cursor: 'pointer',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          💬 Comments
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#555' }}>Downvotes</div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{downvoteCount}</div>
          </div>
          <button
            onClick={() => handleVote('down')}
            disabled={!user}
            style={{
              backgroundColor: userVote === 'down' ? '#483C32' : '#f0f0f0',
              color: userVote === 'down' ? '#fff' : '#483C32',
              border: '1px solid #483C32',
              padding: '8px 12px',
              cursor: user ? 'pointer' : 'not-allowed',
              fontSize: '18px',
              borderRadius: '6px'
            }}
          >
            ▼
          </button>
        </div>
      </div>

      <div style={{ marginTop: '30px' }} ref={commentSectionRef}>
        <h3>Comments</h3>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map(comment => (
            <div key={comment._id} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                {comment.author?.profilePic && (
                  <img
                    src={`http://localhost:5000/uploads/${comment.author.profilePic}`}
                    alt={comment.author.name}
                    style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                )}
                <strong>{comment.author?.name || 'Unknown'}</strong>
                <span style={{ color: '#555', fontSize: '0.9em' }}>
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <p>{comment.body}</p>
            </div>
          ))
        )}

        {user ? (
          <form onSubmit={handleCommentSubmit} style={{ marginTop: '20px' }}>
            <textarea
              ref={commentInputRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows="3"
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              required
            />
            <button
              type="submit"
              style={{
                marginTop: '10px',
                backgroundColor: '#483C32',
                color: '#fff',
                border: 'none',
                padding: '8px 15px',
                cursor: 'pointer'
              }}
            >
              Comment
            </button>
          </form>
        ) : (
          <p style={{ marginTop: '20px' }}>Login to add a comment.</p>
        )}
      </div>
    </div>
  );
};

export default PostDetailPage;
