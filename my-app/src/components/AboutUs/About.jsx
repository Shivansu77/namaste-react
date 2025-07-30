import React from 'react';
import { FaUtensils, FaLeaf, FaAward, FaUsers } from 'react-icons/fa';

const About = () => {
  const features = [
    {
      icon: <FaUtensils className="feature-icon" />,
      title: "Quality Food",
      description: "We source only the finest ingredients to create delicious meals that delight your taste buds."
    },
    {
      icon: <FaLeaf className="feature-icon" />,
      title: "Fresh Ingredients",
      description: "Our commitment to freshness means you get the best quality in every bite."
    },
    {
      icon: <FaAward className="feature-icon" />,
      title: "Award Winning",
      description: "Recognized for excellence in taste, service, and innovation in the food industry."
    },
    {
      icon: <FaUsers className="feature-icon" />,
      title: "Community Focused",
      description: "We believe in giving back and supporting our local community."
    }
  ];

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="hero-content">
          <h1>Our Story</h1>
          <p className="subtitle">Delivering happiness since 2023</p>
        </div>
      </section>

      <section className="about-mission">
        <div className="container">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>
              At FoodieHub, we're passionate about bringing people together through the joy of food. 
              Our mission is to deliver exceptional dining experiences by combining innovative recipes, 
              fresh ingredients, and outstanding service.
            </p>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="icon-wrapper">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="team">
        <div className="container">
          <h2 className="section-title">Meet Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image chef1"></div>
              <h3>Sarah Johnson</h3>
              <p>Head Chef</p>
            </div>
            <div className="team-member">
              <div className="member-image chef2"></div>
              <h3>Michael Chen</h3>
              <p>Master Baker</p>
            </div>
            <div className="team-member">
              <div className="member-image chef3"></div>
              <h3>Elena Rodriguez</h3>
              <p>Pastry Chef</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;