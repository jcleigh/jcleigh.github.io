import React from 'react';
import './About.css';

const About: React.FC = () => {
    return (
        <main className="about-section">
            <article>
                <h3>About Me</h3>
                <p>
                    Hi! My name is Jordan Cleigh. I spend most of my time as a Staff Software Engineer and Platform Architect at <a href="https://fmgsuite.com" target="_blank">FMG</a>.
                    <br />
                    I have focused on enterprise-grade software development for nearly a decade. Prior to that, I specialized in small-business IT, marketing, and web development for years.
                    <br />
                    I love to learn, do, and teach. I am always looking for new opportunities to grow and help others grow.
                </p>
            </article>
        </main>
    );
};

export default About;