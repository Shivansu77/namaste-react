import React, { useState, useEffect } from 'react';
import { FaGithub, FaCode, FaUserFriends, FaBuilding, FaMapMarkerAlt, FaLink } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import './About.css';

const About = () => {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        // Fetch profile data
        const profileResponse = await fetch('https://api.github.com/users/Shivansu77');
        if (!profileResponse.ok) throw new Error('Failed to fetch profile');
        const profileData = await profileResponse.json();
        
        // Fetch repositories
        const reposResponse = await fetch(profileData.repos_url + '?sort=updated&per_page=6');
        if (!reposResponse.ok) throw new Error('Failed to fetch repositories');
        const reposData = await reposResponse.json();
        
        setProfile(profileData);
        setRepos(reposData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error loading profile</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  const stats = [
    { icon: <FaCode />, label: 'Public Repos', value: profile.public_repos },
    { icon: <FaUserFriends />, label: 'Followers', value: profile.followers },
    { icon: <FaUserFriends className="flipped" />, label: 'Following', value: profile.following },
  ];

  return (
    <div className="about-container">
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <div className="profile-image-container">
            <img 
              src={profile.avatar_url} 
              alt={profile.name || 'Profile'} 
              className="profile-image"
            />
            <div className="online-status"></div>
          </div>
          <h1>{profile.name || 'GitHub User'}</h1>
          <p className="username">@{profile.login}</p>
          <p className="bio">{profile.bio || 'Passionate developer creating awesome projects'}</p>
          
          <div className="profile-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <span className="stat-icon">{stat.icon}</span>
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
          
          <div className="profile-links">
            <a 
              href={profile.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="github-btn"
            >
              <FaGithub /> View GitHub Profile
            </a>
            {profile.twitter_username && (
              <a 
                href={`https://twitter.com/${profile.twitter_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="twitter-btn"
              >
                <FaXTwitter /> Follow on X
              </a>
            )}
          </div>
        </div>
      </header>
      
      {/* Details Section */}
      <section className="details-section">
        <div className="details-grid">
          {profile.location && (
            <div className="detail-card">
              <FaMapMarkerAlt className="detail-icon" />
              <div>
                <h3>Location</h3>
                <p>{profile.location}</p>
              </div>
            </div>
          )}
          
          {profile.company && (
            <div className="detail-card">
              <FaBuilding className="detail-icon" />
              <div>
                <h3>Company</h3>
                <p>{profile.company}</p>
              </div>
            </div>
          )}
          
          <div className="detail-card">
            <FaGithub className="detail-icon" />
            <div>
              <h3>GitHub Member Since</h3>
              <p>{new Date(profile.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          
          {profile.blog && (
            <div className="detail-card">
              <FaLink className="detail-icon" />
              <div>
                <h3>Website</h3>
                <a href={profile.blog} target="_blank" rel="noopener noreferrer">
                  {profile.blog}
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Featured Repositories */}
      <section className="repos-section">
        <h2>Featured Repositories</h2>
        <div className="repos-grid">
          {repos.map(repo => (
            <a 
              key={repo.id} 
              href={repo.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="repo-card"
            >
              <h3>{repo.name}</h3>
              <p className="repo-description">
                {repo.description || 'No description provided'}
              </p>
              <div className="repo-meta">
                <span className={`repo-language ${repo.language?.toLowerCase() || 'other'}`}>
                  {repo.language || 'Text'}
                </span>
                <span className="repo-stars">
                  ⭐ {repo.stargazers_count}
                </span>
                <span className="repo-forks">
                  🍴 {repo.forks_count}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="cta-section">
        <h2>Let's Build Something Amazing Together</h2>
        <p>Interested in collaborating or have a project in mind?</p>
        <a 
          href={`https://github.com/${profile.login}?tab=repositories`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="cta-button"
        >
          View All Repositories
        </a>
      </section>
    </div>
  );
};

export default About;