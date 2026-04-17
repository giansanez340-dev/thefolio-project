// src/pages/PostPage.js

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function PostPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !body) {
      setError("All fields are required");
      return;
    }

    try {
      await API.post("/posts", { title, body });

      navigate("/feed"); // or "/"
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Post</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <textarea
          placeholder="Write your post..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows="5"
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <button type="submit">Post</button>
      </form>
    </div>
  );
}

export default PostPage;