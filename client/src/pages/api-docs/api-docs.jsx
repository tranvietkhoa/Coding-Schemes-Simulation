/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import convolutionalApis from '../../data/convolutional-api.json';
import hammingApis from '../../data/hamming-api.json';
import reedSolomonApis from '../../data/reed-solomon-api.json';

export default function ApiDocs() {
    return <div css={mainCss}>
        <div css={titleCss}>API Docs</div>
        <div css={bodyCss}>
            <div>Hello there! You may use our following APIs, which calculate the encoded and decoded messages based on your inputs.</div>
            <ApiBlock title="Convolutional" apis={convolutionalApis} />
            <ApiBlock title="Hamming" apis={hammingApis} />
            <ApiBlock title="Reed-Solomon" apis={reedSolomonApis} />
        </div>
    </div>;
}

const mainCss = css`
    display: flex;
    flex-direction: column;
    gap: 30px;
    align-items: center;
`;

const titleCss = css`
    font-size: 30px;
    font-weight: 600;
`;

const bodyCss = css`
    display: flex;
    flex-direction: column;
    gap: 25px;
`;

const ApiBlock = ({ title, apis }) => {
    return <div css={blockCss}>
        <div css={blockTitleCss}>{title}</div>
        <div css={blockBodyCss}>
            {apis.map(api => (
                <ApiComponent api={api} key={api.path} />
            ))}
        </div>
    </div>;
}

const blockCss = css`
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 15px;
    border: 1px black solid;
    border-radius: 10px;
`;

const blockTitleCss = css`
    font-size: 25px;
    font-weight: 600;
    text-decoration: underline;
`;

const blockBodyCss = css`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const ApiComponent = ({ api }) => {
    return <div css={apiCss}>
        <div css={pathCss}>Path: {api.path}</div>
        <div css={parameterCss}>
            <div>GET parameters:</div>
            <table css={tableCss}>
                <thead>
                    <tr css={tableHeadCss}>
                        <td>Name</td>
                        <td>Description</td>
                    </tr>
                </thead>
                <tbody>
                    {api.parameters.map(parameter => (
                        <tr key={parameter.name}>
                            <td>{parameter.name}</td>
                            <td>{parameter.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div>Returns: {api.return}</div>
        <div css={exampleCss}>
            <div css={exampleTitleCss}>Example</div>
            <div>Address: <a css={exampleLinkCss} href={api.example.address}>{api.example.address}</a></div>
            <div>Output: {api.example.output}</div>
        </div>
    </div>;
};

const apiCss = css`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const pathCss = css`
    font-weight: 550;
`;

const tableCss = css`
    border-collapse: collapse;

    td {
        padding: 3px;
        border: 1px black solid;
    }
`;

const tableHeadCss = css`
    td {
        font-weight: 550;
    }
`;

const parameterCss = css`
    display: flex;
    flex-direction: column;
    gap: 3px;
`;

const exampleCss = css`
    display: flex;
    flex-direction: column;
    gap: 3px;
`;

const exampleTitleCss = css`
    text-decoration: underline;
`;

const exampleLinkCss = css`
    color: black;
    text-decoration: underline !important;

    &:visited {
        color: black;
    }
`;
