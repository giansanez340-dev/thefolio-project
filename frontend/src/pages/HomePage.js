// frontend/src/pages/HomePage.js

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await API.get("/posts");
        console.log("Posts fetched:", res.data); // Debug log
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleVote = async (postId, vote) => {
    if (!user) return;
    try {
      const { data } = await API.post(`/posts/${postId}/vote`, { vote });
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                upvotes: data.upvotes,
                downvotes: data.downvotes
              }
            : post
        )
      );
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  const goToComment = (postId) => {
    navigate(`/posts/${postId}?focus=comment`);
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="home-page">
      <h2>Latest Posts</h2>

      <Link to="/create">
        <button style={{ marginBottom: "15px" }}>+ Create Post</button>
      </Link>

      {posts.length === 0 ? (
        <p>No posts yet. Be the first to write one!</p>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post._id} className="post-card">
              {post.image && (
                <img
                  src={`http://localhost:5000/uploads/${post.image}`}
                  alt={post.title}
                  style={{ maxWidth: "100%" }}
                />
              )}

              <h3>
                <Link to={`/posts/${post._id}`}>{post.title}</Link>
              </h3>

              <p>{post.body?.substring(0, 120) || ""}...</p>

              <small>
                By {post.author?.name || "Unknown"} ·{" "}
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString()
                  : "No date"}
              </small>

              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => handleVote(post._id, 'up')}
                  disabled={!user}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #483C32', backgroundColor: '#483C32', color: '#fff', cursor: user ? 'pointer' : 'not-allowed' }}
                >
                  ▲ {post.upvotes?.length || 0}
                </button>
                <button
                  type="button"
                  onClick={() => handleVote(post._id, 'down')}
                  disabled={!user}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #483C32', backgroundColor: '#483C32', color: '#fff', cursor: user ? 'pointer' : 'not-allowed' }}
                >
                  ▼ {post.downvotes?.length || 0}
                </button>
                <button
                  type="button"
                  onClick={() => goToComment(post._id)}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer' }}
                >
                  💬 {post.commentCount || 0}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;