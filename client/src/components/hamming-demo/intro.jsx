/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { ParityBits, ParityPositions } from "../parity/parity";

const hammingIntroData = [
    {
        header: "Introduction",
        body: [
            {
                text: "Hamming code works based on calculating some XOR values of some combinations of bits in the data. These new bits added ensure that when one bit is corrupted, the receiving end can still derive the original message based on the other bits. The new bits are called \"parity bits\"",
            },
        ],
    },
    {
        header: "What are the combinations of bits to XOR?",
        body: [
            {
                text: "The parity bits are chosen such that their positions in the encoded message are powers of 2.",
            },
            {
                src: <ParityPositions n={3} />,
            },
            {
                text: "To determine the bits that each parity bit captures, we convert the position of each bit to binary form. As a result, the positions of the parity bits only have one 1 each.",
            },
            {
                src: <ParityBits n={3} />,
            },
            {
                text: "The bits that each parity captures are those whose position in binary form has the same parity of 1 at the same index as the position in binary of the parity bit.",
            },
            {
                text: "The encoded message must be of length of a power of 2. The original message is therefore lengthened, where necessary, by adding extra zeros at the end.",
            },
        ],
    },
    {
        header: "How is error being detected?",
        body: [
            {
                text: "As we see above, each bit is involved in at least one XOR operation, and in a unique set of XOR operation. We therefore can XOR all bits that are involved in each set of bits in an XOR operation, upon receiving the encoded message. If all results of the \"reverse\" XOR operations are all zero, we can conclude that there no corrupted bits. However, if there are some results being one, we can derive the unique bit that is involved in exactly those XOR operations, and hence derive the corrupted bits.",
            },
            {
                text: "You might have noticed that this mechanism does not accommodate for two or more corrupted bits. Yes, with each combination of XOR operation corresponding to one and only one bit, we can only derive the corrupted bit if there is only one such.",
            },
            {
                text: "Proceed to the next pages to try out Hamming encoding and decoding algorithm.",
            },
        ],
    },
];

export default function HammingIntro() {
    return <div css={hammingIntroStyle}>
        {hammingIntroData.map((section, sectionIndex) => (
            <div key={sectionIndex} css={sectionStyle}>
                <div css={sectionHeaderStyle}>{section.header}</div>
                <div css={sectionBodyStyle}>
                    {section.body.map((subsection, subsectionIndex) => (
                        <div key={subsectionIndex}>
                            {subsection.text ? subsection.text : <div css={imageCss}>{subsection.src}</div>}
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>;
};

const hammingIntroStyle = css`
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

const imageCss = css`
    margin: auto;
    width: fit-content;
`;
