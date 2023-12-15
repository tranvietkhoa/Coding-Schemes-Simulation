/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import ShiftRegister from '../shift-register/shift-register';
import Trelis from '../trelis/trelis';

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
                text: "Convolutional code works based on a shift register. The original message is treated as the input stream. A shift register and some readouts are used to transform the input stream."
            },
            {
                text: "In each iteration, the readouts on the shift register output the same number of bits. The bits on the shift register then shift to the right, and the next bit from the input stream is supplied to the left of the shift register."
            },
            {
                text: "Take note that the readouts' bit positions, and the length of the shift register is communicated before the data transmission. Proceed to page 2 to see how encoding works."
            },
        ]
    },
    {
        header: "Decoding convolutional code",
        body: [
            {
                text: "The process of decoding a convolutional code is simply reverse engineering the shift register with the given readouts information and the shift register length. This is done by keep track of possible states of the shift register, and work backwards. If there are k number of bits in the input stream, we iterate 7 times to consider all possible sequences of states of the shift register and their corresponding encoded message, and take the path with the lowest number of errors (bit difference with the actual encoded message)."
            },
            {
                text: "This may seem like a lot of states to consider. However, note that there is a limited number of states that the shift register can have. In each iteration, multiple input streams can end up in the same state. Hence in each iteration, for each possible state of the shift register, we only keep the state with the lowest number of errors so far. Take note that we do not need to keep track of the last bit on the right of the shift register, since it does not affect the next state of the shift register."
            },
            {
                src: <Trelis
                    k={6}
                    l={3}
                    n={2}
                    adders={[ [true, true, true], [true, false, true] ]}
                    originalEncodedMessage={[true, true, true, false, false, true, false, true, true, true, true, true]}
                />,
                caption: "Trelis diagram",
            },
            {
                text: "The diagram above shows how the message is decoded with a Trelis diagram, with k = 6, n = 2, l = 3. At the top is the original corrupted encoded message, and the message right below is the restored encoded message. Each node corresponds to a state of the shift register excluding the last bit, and a step index. Each node indicates the lowest total number of errors if that node is chosen as part of the final corrected encoded message. Each edge indicates the bits that are produced from the adders acting on the corresponding starting shift register."
            },
            {
                text: "At the end, the path with the lowest number of errors is chosen to be the corrected message. When there is a tie in number of errors, there is no determinate rule to determine which one is the true correct message.",
            },
            {
                text: "Proceed to page 3 to see how decoding works.",
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
