/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const reedSolomonIntroData = [
    {
        header: "Introduction",
        body: [
            {
                text: "Reed-Solomon code is based on a finite field. The raw message is first transformed into a multiple of a generator polynomial of the finite field. When the message is corrupted, the remainder of Reed-Solomon code is then used to determine the errors.",
            },
        ],
    },
    {
        header: "What is a finite field?",
        body: [
            {
                text: "A finite field is a field with a maximum. In particular for Reed-Solomon code, we use the set of integer remainders of a number as a finite field. Two common finite fields for Reed-Solomon code are remainders of 929 and 2.",
            },
            {
                text: "For Reed-Solomon codes, each number in a code is an element of the finite field.",
            },
            {
                text: "When remainders of 929 are used as the finite field, the raw message can have at most 3 numbers, each being a remainder modulo 929. The encoded message has 7 numbers.",
            },
            {
                text: "When remainders of 2 are used as the finite field, the raw message can have at most 233 numbers, each being either 0 or 1. The encoded message has 255 numbers.",
            },
        ],
    },
    {
        header: "What is a generator polynomial?",
        body: [
            {
                text: "First, a field primitive is a number such that its powers are different elements of the finite field. To be exact, when there are k numbers in the raw message and n numbers in the encoded message, the field primitive is such that its power are n - k different elements of the finite field.",
            },
            {
                text: "A generator polynomial is then a polynomial whose roots are the n - k different powers of the field primitive. Here, note that the polynomial is not valued over integers, but over the finite field. Hence, any value, including coefficients of the polynomial and the evaluations of the polynomial, are taken remainder modulo 929 or 2 (depending on which number is chosen to determine the finite field).",
            },
        ],
    },
    {
        header: "Encoding",
        body: [
            {
                text: "To encode a message of length k, the numbers are first treated as coefficients of a polynomial of powers between n - k and n - 1 (inclusive). The polynomial is then taken remainder modulo the generator polynomial. The difference is then taken between the polynomial and the remainder. The difference is therefore a multiple of the generator polynomial. We take the difference polynomial as the encoded message. To be precise, the coefficients of the difference polynomial are the numbers in the encoded message.",
            },
        ],
    },
    {
        header: "Decoding",
        body: [
            {
                text: "The received polynomial is first evaluated with powers of the field primitive. If all evaluations are zero, it means there are no corruptions in the transmitted data.",
            },
            {
                text: "Note that the algorithm can tolerate at most (n - k) / 2 errors. When there are errors, some evaluations are non-zero. Those then can be used to determine the error magnitude and positions, thereby the original encoded message and the original raw message."
            }
        ],
    }
]

export default function ReedSolomonIntro() {
    return <div css={reedSolomonStyle}>
        {reedSolomonIntroData.map((section, sectionIndex) => (
            <div css={sectionStyle} key={sectionIndex}>
                <div css={sectionHeaderStyle}>{section.header}</div>
                <div css={sectionBodyStyle}>
                    {section.body.map((subsection, subsectionIndex) => (
                        <div key={subsectionIndex}>
                            {subsection.text}
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>;
};

const reedSolomonStyle = css`
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
