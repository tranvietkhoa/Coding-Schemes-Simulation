/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import ShiftRegister from '../shift-register/shift-register';

const convolutionalIntroData = [
    {
        header: "Introduction",
        body: [
            {
                text: "Convolutional code works based on a shift register. The input stream to input through a shift register to produced the encoded message. On the receiving end, the encoded message is then decoded based on the information of the shift register."
            },
        ]
    },
    {
        header: "What is shift register?",
        body: [
            {
                text: "A shift register is an array of buckets, each containing a bit. There are readouts, each reads some bits on the register and performs XOR operation on those bits to output one single bits."
            },
            {
                src: <ShiftRegister />,
                caption: "A shift register",
            },
            {
                text: "After the readouts read the bits on the shift register, the bits on the shift register shifts to the right. As a result, one bit on the right is discarded, and there is one empty bucket on the left. This empty bucket is supplemented by the input stream. Consequently, the bits on the shift register change, and new bits are produced from the readouts. The cycle repeats until the input stream is exhausted."
            },
        ]
    },
    {
        header: "Shift register and convolutional code",
        body: [
            {
                text: "Convolutional code works based on a shift register. The original message is treated as the input stream. A shift register and some readouts are used to transform the input stream, producing the encoded message."
            },
            {
                text: "The received message may receive error."
            },
        ]
    }
];

export default function ConvolutionalIntro() {

    return <div css={convolutionalStyle}>
        {convolutionalIntroData.map((section, sectionIndex) => (
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
    return <div css={demoImageCss}>
        {src}
        <div css={demoImageCaptionCss}>{caption}</div>
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

const demoImageCss = css`
    width: fit-content;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const demoImageCaptionCss = css`
    font-size: 16px;
`;
