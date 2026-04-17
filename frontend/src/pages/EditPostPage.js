import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then(res => res.json())
      .then(data => {
        setTitle(data.title);
        setContent(data.content);
      });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, content })
    });

    alert("Post updated");
    navigate("/");
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;

    await fetch(`/api/posts/${id}`, {
      method: "DELETE"
    });

    alert("Post deleted");
    navigate("/");
  };

  return (
    <div>
      <h2>Edit Post</h2>

      <form onSubmit={handleUpdate}>
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <button type="submit">Update Post</button>
      </form>

      <br />

      <button onClick={handleDelete} style={{color:"red"}}>
        Delete Post
      </button>
    </div>
  );
}

export default EditPostPage;