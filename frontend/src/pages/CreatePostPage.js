// frontend/src/pages/CreatePostPage.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, token } = useAuth(); // token needed for authorization
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!token) {
      setError('You must be logged in to create a post.');
      setLoading(false);
      return;
    }

    const fd = new FormData();
    fd.append('title', title);
    fd.append('body', body);

    if (user?.role === 'admin' && image) {
      fd.append('image', image);
    }

    try {
      const { data } = await API.post('/posts', fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Redirect to the created post
      navigate(`/posts/${data._id}`);
    } catch (err) {
      console.error('Create post error:', err);
      setError(err.response?.data?.message || 'Failed to publish post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-page" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2>Create a New Post</h2>

      {error && <p className="error-msg" style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          required
          style={{ padding: '8px', fontSize: '16px' }}
        />

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your post here..."
          rows={12}
          required
          style={{ padding: '8px', fontSize: '16px' }}
        />

        {user?.role === 'admin' && (
          <div>
            <label>Upload Cover Image (Admin only):</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              style={{ marginTop: '5px' }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#483C32',
            color: '#fff',
            border: '1px solid #483C32',
            cursor: 'pointer',
            marginTop: '10px',
          }}
        >
          {loading ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePostPage;