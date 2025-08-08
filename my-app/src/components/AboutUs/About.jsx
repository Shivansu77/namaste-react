import React, { useState, useEffect } from 'react';
import { FaGithub, FaCode, FaUserFriends, FaBuilding, FaMapMarkerAlt, FaLink, FaStar, FaCodeBranch } from 'react-icons/fa';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Shimmer */}
          <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 rounded-2xl p-8 mb-8">
            <div className="animate-pulse text-center">
              <div className="w-32 h-32 bg-gray-600 rounded-full mx-auto mb-6"></div>
              <div className="h-8 bg-gray-600 rounded w-64 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-600 rounded w-48 mx-auto mb-8"></div>
            </div>
          </div>
          
          {/* Stats Shimmer */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          
          {/* Repos Shimmer */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Profile</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: <FaCode />, label: 'Public Repos', value: profile.public_repos },
    { icon: <FaUserFriends />, label: 'Followers', value: profile.followers },
    { icon: <FaUserFriends className="flipped" />, label: 'Following', value: profile.following },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="relative inline-block mb-8">
            <img 
              src={profile.avatar_url} 
              alt={profile.name || 'Profile'} 
              className="w-40 h-40 rounded-full border-4 border-white shadow-2xl"
            />
            <div className="absolute bottom-4 right-4 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
          </div>
          
          <h1 className="text-5xl font-bold mb-4">{profile.name || 'GitHub User'}</h1>
          <p className="text-2xl text-red-100 mb-6">@{profile.login}</p>
          <p className="max-w-3xl mx-auto text-xl text-red-100 mb-10 leading-relaxed">
            {profile.bio || 'Passionate developer creating awesome projects'}
          </p>
          
          <div className="flex justify-center gap-12 mb-10 flex-wrap">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <span className="text-3xl mb-2 text-red-300">{stat.icon}</span>
                <span className="text-3xl font-bold">{stat.value}</span>
                <span className="text-lg text-red-100">{stat.label}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center gap-6 flex-wrap">
            <a 
              href={profile.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 bg-white text-red-600 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <FaGithub className="text-2xl" /> View GitHub Profile
            </a>
            {profile.twitter_username && (
              <a 
                href={`https://twitter.com/${profile.twitter_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <FaXTwitter className="text-2xl" /> Follow on X
              </a>
            )}
          </div>
        </div>
      </header>
      
      {/* Details Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {profile.location && (
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 flex items-start gap-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <FaMapMarkerAlt className="text-red-500 text-3xl mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Location</h3>
                  <p className="text-gray-600">{profile.location}</p>
                </div>
              </div>
            )}
            
            {profile.company && (
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 flex items-start gap-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <FaBuilding className="text-red-500 text-3xl mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Company</h3>
                  <p className="text-gray-600">{profile.company}</p>
                </div>
              </div>
            )}
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 flex items-start gap-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <FaGithub className="text-red-500 text-3xl mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 text-lg">GitHub Member Since</h3>
                <p className="text-gray-600">{new Date(profile.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            
            {profile.blog && (
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 flex items-start gap-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <FaLink className="text-red-500 text-3xl mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Website</h3>
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
        </div>
      </section>
      
      {/* Featured Repositories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Repositories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Check out some of my latest projects and contributions on GitHub
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {repos.map(repo => (
              <a 
                key={repo.id} 
                href={repo.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group block bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-red-200 transform hover:-translate-y-2"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-200">
                    {repo.name}
                  </h3>
                  <FaGithub className="text-2xl text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {repo.description || 'No description provided'}
                </p>
                
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                  {repo.language && (
                    <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-red-100 to-red-200 text-red-800">
                      {repo.language}
                    </span>
                  )}
                  <span className="inline-flex items-center text-gray-600 text-sm font-medium">
                    <FaStar className="w-4 h-4 mr-1 text-yellow-500" />
                    {repo.stargazers_count}
                  </span>
                  <span className="inline-flex items-center text-gray-600 text-sm font-medium">
                    <FaCodeBranch className="w-4 h-4 mr-1 text-blue-500" />
                    {repo.forks_count}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Let's Build Something Amazing Together</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Interested in collaborating or have a project in mind? Let's connect and create something incredible!
          </p>
          <a 
            href={`https://github.com/${profile.login}?tab=repositories`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
          >
            <FaGithub className="w-6 h-6 mr-3" />
            View All Repositories
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;