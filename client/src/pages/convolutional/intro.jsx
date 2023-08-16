import { useState, useEffect } from 'react';
import './intro.css';

export default function ConvolutionalIntro() {
    const [intro, setIntro] = useState([]);

    useEffect(() => {
        fetch(`/convolutional/intro`)
            .then(response => response.json())
            .then(data => {
                setIntro(data);
            });
    });

    return <div className="convolutional">
        {intro.map((section, sectionIndex) => (
            <div className="convolutional-section" key={sectionIndex}>
                <div className="convolutional-section-header">{section.header}</div>
                <div className="convolutional-section-body">
                    {section.body.map((subsection, subsectionIndex) => (
                        <div className="convolutional-subsection" key={subsectionIndex}>
                            {subsection.text ? subsection.text
                            : <DemoImage src={subsection.src} caption={subsection.caption} />}
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
}

const DemoImage = ({ src, caption }) => {
    return <div className="convolutional-image">
        <img src={src} alt="demo" />
        <div className="convolutional-caption">{caption}</div>
    </div>
}