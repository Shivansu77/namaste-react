import React, { useState, useEffect } from 'react';
import { FaGithub, FaCode, FaUserFriends, FaBuilding, FaMapMarkerAlt, FaLink } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error loading profile</h2>
        <p className="text-gray-700 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">

        <div className="max-w-7xl mx-auto text-center">
          <div className="relative inline-block mb-6">
            <img 
              src={profile.avatar_url} 
              alt={profile.name || 'Profile'} 
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{profile.name || 'GitHub User'}</h1>
          <p className="text-xl text-red-100 mb-4">@{profile.login}</p>
          <p className="max-w-2xl mx-auto text-lg text-red-100 mb-8">
            {profile.bio || 'Passionate developer creating awesome projects'}
          </p>
          
          <div className="flex justify-center gap-8 mb-8 flex-wrap">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <span className="text-2xl mb-1">{stat.icon}</span>
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-sm text-red-100">{stat.label}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center gap-4 flex-wrap">
            <a 
              href={profile.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-white text-red-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              <FaGithub className="text-xl" /> View GitHub Profile
            </a>
            {profile.twitter_username && (
              <a 
                href={`https://twitter.com/${profile.twitter_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                <FaXTwitter className="text-xl" /> Follow on X
              </a>
            )}
          </div>
        </div>
      </header>
      
      {/* Details Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {profile.location && (
            <div className="bg-white p-6 rounded-xl shadow-md flex items-start gap-4">
              <FaMapMarkerAlt className="text-red-500 text-2xl mt-1" />
              <div>
                <h3 className="font-semibold text-gray-700">Location</h3>
                <p className="text-gray-600">{profile.location}</p>
              </div>
            </div>
          )}
          
          {profile.company && (
            <div className="bg-white p-6 rounded-xl shadow-md flex items-start gap-4">
              <FaBuilding className="text-red-500 text-2xl mt-1" />
              <div>
                <h3 className="font-semibold text-gray-700">Company</h3>
                <p className="text-gray-600">{profile.company}</p>
              </div>
            </div>
          )}
          
          <div className="bg-white p-6 rounded-xl shadow-md flex items-start gap-4">
            <FaGithub className="text-red-500 text-2xl mt-1" />
            <div>
              <h3 className="font-semibold text-gray-700">GitHub Member Since</h3>
              <p className="text-gray-600">{new Date(profile.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          
          {profile.blog && (
            <div className="bg-white p-6 rounded-xl shadow-md flex items-start gap-4">
              <FaLink className="text-red-500 text-2xl mt-1" />
              <div>
                <h3 className="font-semibold text-gray-700">Website</h3>
                <a 
                  href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-red-500 hover:underline break-all"
                >
                  {profile.blog}
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Featured Repositories */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Repositories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map(repo => (
              <a 
                key={repo.id} 
                href={repo.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow border border-gray-100 h-full flex-col"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{repo.name}</h3>
                <p className="text-gray-600 mb-4 flex-grow">
                  {repo.description || 'No description provided'}
                </p>
                <div className="flex flex-wrap gap-3 mt-auto pt-3 border-t border-gray-100">
                  {repo.language && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {repo.language}
                    </span>
                  )}
                  <span className="inline-flex items-center text-gray-600 text-sm">
                    ⭐ {repo.stargazers_count}
                  </span>
                  <span className="inline-flex items-center text-gray-600 text-sm">
                    🍴 {repo.forks_count}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Let's Build Something Amazing Together</h2>
          <p className="text-xl text-gray-600 mb-8">Interested in collaborating or have a project in mind?</p>
          <a 
            href={`https://github.com/${profile.login}?tab=repositories`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
          >
            View All Repositories
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;