import { useState, useEffect } from 'react';

export default function ConvolutionalIntro() {
    const [introText, setIntroText] = useState('');

    useEffect(() => {
        fetch(`/convolutional/intro`)
            .then(response => response.text())
            .then(text => {
                setIntroText(text);
            });
    });

    return <div>
        <div>{introText}</div>
    </div>
}