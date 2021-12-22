import React, { Component } from 'react'

export class HomePage extends Component {

    render() {
        return (
            <main className="home-page">
                <section className="homepage-fold">
                    <div className="homepage-heading flex column  justify-center align-center">
                        <h1>Chello</h1>
                        <h2>Task Managment,</h2>
                        <h2>The <span>Clever</span> Way.</h2>
                        <a href="/board/600dd8e1580369065cfff3eb" className="cta-btn primary-btn">Start Now</a>
                    </div>
                    <div className="homepage-image">
                    </div>
                </section>

                <section className="features  ">
                    <div className="features-feature-1">
                        <div className="feature-1-bg"></div>
                        <div className="feature-1-txt flex column justify-center">
                            <h3>All the tools your team needs</h3>
                            <span>Organize and assign tasks.</span>
                            <span>With lists, teams see immediately what they need to do,</span>
                            <span>which tasks are a priority, and when work is due.</span>
                        </div>
                    </div>
                    <div className="features-feature-2">
                        <div className="feature-2-txt flex column justify-center">
                            <h3>Manage your time wisely</h3>
                            <span>Instantly see which projects are on track,</span>
                            <span>which ones are falling behind,</span>
                            <span>and what every team member is working on at a glance.</span>
                        </div>
                        <div className="feature-2-bg"></div>
                    </div>
                    <div className="features-feature-3">
                        <div className="feature-3-bg"></div>
                        <div className="feature-3-txt flex column justify-center">
                            <h3>Organize anything</h3>
                            <h3>with anyone, anywhere</h3>
                            <span>Bring your team’s work together in one shared space.</span>
                            <span>Choose the project view that suits your style, and collaborate no matter where you are.</span>
                        </div>
                    </div>

                    <section className="bottom-cta flex justify-center">
                        <a href="/board/600dd8e1580369065cfff3eb">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            Get Started</a>
                    </section>
                </section>
                <footer className="flex align-center justify-center">
                    <p>® 2021 Chello | Reem Ben David | <a href="https://www.linkedin.com/in/yehonathan-segev-743a431a5/">Yehonathan Segev</a> | Nofar Yunger</p>
                </footer>
            </main>
        )
    }
}
