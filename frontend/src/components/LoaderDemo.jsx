import React, { useState } from 'react';
import Loader from './Loader';
import './LoaderDemo.css';

const LoaderDemo = () => {
    const [showFullScreen, setShowFullScreen] = useState(false);

    const loaderVariants = [
        { name: 'Default (8-Blade)', variant: 'default' },
        { name: 'Dots', variant: 'dots' },
        { name: 'Spinner (Triple Ring)', variant: 'spinner' },
        { name: 'Pulse', variant: 'pulse' },
        { name: 'Bars', variant: 'bars' },
        { name: 'Gradient', variant: 'gradient' }
    ];

    return (
        <div className="loader-demo-page">
            <div className="demo-header">
                <h1>🎨 Premium Loader Components</h1>
                <p>Beautiful, modern loading animations for your e-commerce app</p>
            </div>

            <div className="demo-grid">
                {loaderVariants.map((loader) => (
                    <div key={loader.variant} className="demo-card">
                        <h3>{loader.name}</h3>
                        <div className="demo-preview">
                            <Loader variant={loader.variant} message="Loading..." />
                        </div>
                        <div className="demo-code">
                            <code>{`<Loader variant="${loader.variant}" />`}</code>
                        </div>
                    </div>
                ))}
            </div>

            <div className="demo-section">
                <h2>Full Screen Loader</h2>
                <button
                    className="demo-button"
                    onClick={() => setShowFullScreen(true)}
                >
                    Show Full Screen Loader
                </button>

                {showFullScreen && (
                    <div onClick={() => setShowFullScreen(false)}>
                        <Loader
                            variant="gradient"
                            message="Loading your content..."
                            fullScreen={true}
                        />
                    </div>
                )}
            </div>

            <div className="demo-usage">
                <h2>📖 Usage Examples</h2>

                <div className="usage-example">
                    <h3>Basic Usage</h3>
                    <pre><code>{`import Loader from './components/Loader';

// Default loader
<Loader />

// With custom message
<Loader message="Fetching products..." />

// Different variant
<Loader variant="dots" message="Please wait..." />`}</code></pre>
                </div>

                <div className="usage-example">
                    <h3>Full Screen Loader</h3>
                    <pre><code>{`// For page-level loading
{loading && (
    <Loader 
        variant="gradient" 
        message="Loading..." 
        fullScreen={true}
    />
)}`}</code></pre>
                </div>

                <div className="usage-example">
                    <h3>Available Variants</h3>
                    <ul>
                        <li><code>default</code> - 8-blade spinner (recommended)</li>
                        <li><code>dots</code> - Bouncing dots</li>
                        <li><code>spinner</code> - Triple ring spinner</li>
                        <li><code>pulse</code> - Pulsing circle</li>
                        <li><code>bars</code> - Animated bars</li>
                        <li><code>gradient</code> - Gradient spinner</li>
                    </ul>
                </div>

                <div className="usage-example">
                    <h3>Props</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Prop</th>
                                <th>Type</th>
                                <th>Default</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>variant</code></td>
                                <td>string</td>
                                <td>'default'</td>
                                <td>Loader animation style</td>
                            </tr>
                            <tr>
                                <td><code>message</code></td>
                                <td>string</td>
                                <td>'Loading...'</td>
                                <td>Text to display below loader</td>
                            </tr>
                            <tr>
                                <td><code>fullScreen</code></td>
                                <td>boolean</td>
                                <td>false</td>
                                <td>Show as full screen overlay</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LoaderDemo;
