/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';

export default function ConvolutionalIntro() {
    const [intro, setIntro] = useState([]);

    useEffect(() => {
        fetch(`/convolutional/intro`)
            .then(response => response.json())
            .then(data => {
                setIntro(data);
            });
    });

    return <div css={convolutionalStyle}>
        {intro.map((section, sectionIndex) => (
            <div css={sectionStyle} key={sectionIndex}>
                <div css={sectionHeaderStyle}>{section.header}</div>
                <div css={sectionBodyStyle}>
                    {section.body.map((subsection, subsectionIndex) => (
                        <div key={subsectionIndex}>
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
    return <div>
        <img src={src} alt="demo" />
        <div>{caption}</div>
    </div>
}

const convolutionalStyle = css`
    display: flex;
    flex-direction: column;
    gap: 45px;
`;

const sectionStyle = css`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const sectionHeaderStyle = css`
    font-weight: 600;
    font-size: 28px;
`;

const sectionBodyStyle = css`
    text-align: justify;
    display: flex;
    flex-direction: column;
    gap: 15px;
`;
