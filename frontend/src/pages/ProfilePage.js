// frontend/src/pages/ProfilePage.js
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [pic, setPic] = useState(null);

  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');

  const [msg, setMsg] = useState('');

  const handleProfile = async (e) => {
    e.preventDefault();
    setMsg('');

    const fd = new FormData();
    fd.append('name', name);
    fd.append('bio', bio);

    if (pic) {
      fd.append('profilePic', pic);
    }

    try {
      // Do NOT manually set Content-Type — Axios handles multipart
      const { data } = await API.put('/auth/profile', fd);

      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      setMsg('Profile updated successfully!');

    } catch (err) {
      setMsg(err.response?.data?.message || err.message || 'Error');
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setMsg('');

    try {
      await API.put('/auth/change-password', {
        currentPassword: curPw,
        newPassword: newPw
      });

      setMsg('Password changed successfully!');
      setCurPw('');
      setNewPw('');

    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  const picSrc = user?.profilePic
    ? `http://localhost:5000/uploads/${user.profilePic}`
    : '/default-avatar.svg';

  return (
    <div className="profile-page container py-4">
      <h2>My Profile</h2>

      <div className="row gy-4">
        <div className="col-lg-4">
          <div className="profile-card p-4 h-100">
            <div className="text-center mb-3">
              <img
                src={picSrc}
                alt="Profile"
                className="profile-pic-preview"
              />
            </div>

            <div className="profile-summary">
              <p><strong>Name:</strong> {user?.name || 'Unknown'}</p>
              <p><strong>Email:</strong> {user?.email || 'Not available'}</p>
              <p><strong>Bio:</strong><br />{user?.bio || 'No bio yet.'}</p>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          {msg && <div className="alert alert-info">{msg}</div>}

          <div className="profile-card p-4 mb-4">
            <form onSubmit={handleProfile}>
              <h3>Edit Profile</h3>

              <input
                className="form-control mb-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Display name"
              />

              <textarea
                className="form-control mb-3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Short bio..."
                rows={3}
              />

              <label htmlFor="profilePicInput">Change Profile Picture:</label>
              <input
                id="profilePicInput"
                className="form-control mb-3"
                type="file"
                accept="image/*"
                onChange={(e) => setPic(e.target.files[0])}
              />

              <button className="btn btn-primary" type="submit">Save Profile</button>
            </form>
          </div>

          <div className="profile-card p-4">
            <form onSubmit={handlePassword}>
              <h3>Change Password</h3>

              <input
                className="form-control mb-3"
                type="password"
                placeholder="Current password"
                value={curPw}
                onChange={(e) => setCurPw(e.target.value)}
                required
              />

              <input
                className="form-control mb-3"
                type="password"
                placeholder="New password (min 6 chars)"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                required
                minLength={6}
              />

              <button className="btn btn-secondary" type="submit">Change Password</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;