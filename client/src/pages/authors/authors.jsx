/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import nguyenPhoto from '../../assets/Nguyen.jpeg';
import khoaPhoto from '../../assets/Khoa.jpg';
import githubIcon from '../../assets/github.png';
import linkedinIcon from '../../assets/linkedin.webp';
import nguyenWebsiteIcon from '../../assets/nguyen-website.png';

const nguyenData = {
    name: "Nguyen Khoi Nguyen",
    image: nguyenPhoto,
    readme: `I am currently pursuing Computer Science in NUS.\n
    I previously interned at Decision Science Agency, and engineered Singlife's websites e-service forms.\n
    Inspired by how technology can transform websites and enhance quality of life, I aspire to further pursue software development and artificial intelligence.`,
    links: [
        {
            icon: githubIcon,
            link: "https://github.com/nknguyenhc",
            text: "Github",
        },
        {
            icon: linkedinIcon,
            link: "https://www.linkedin.com/in/nguyen-khoi-nguyen-6279341a8/",
            text: "Linkedin",
        },
        {
            icon: nguyenWebsiteIcon,
            link: "https://nknguyenhc.github.io",
            text: "Portfolio",
        },
    ],
}

const khoaData = {
    name: "Tran Viet Khoa",
    image: khoaPhoto,
    readme: `I am currently reading Mathematics and Computer Science at NTU Singapore.\n
    I am interested in various fields of Mathematics and how they can transform our lives for the better.\n
    Furthermore, I am also educating myself on the topics of AI and data science.`,
    links: [
        {
            icon: githubIcon,
            link: "https://github.com/tranvietkhoa",
            text: "Github",
        },
        {
            icon: linkedinIcon,
            link: "https://www.linkedin.com/in/vietkhoa-tran/",
            text: "Linkedin",
        },
    ],
}

export default function Authors() {
    return <div>
        <div css={headerCss}>This website is made by the two of us</div>
        <div css={pageCss}>
            <div css={authorCss}>
                <div css={authorNameCss}>{nguyenData.name}</div>
                <div css={imageCss}>
                    <img src={nguyenData.image} alt="Nguyen" />
                </div>
                <div css={readmeCss}>{nguyenData.readme}</div>
                <div css={linksCss}>
                    {nguyenData.links.map(link => (
                        <a href={link.link} key={link.text} css={linkCss}>
                            <div css={linkImgCss}>
                                <img src={link.icon} alt="" />
                            </div>
                            <div>{link.text}</div>
                        </a>
                    ))}
                </div>
            </div>
            <div css={authorCss}>
                <div css={authorNameCss}>{khoaData.name}</div>
                <div css={imageCss}>
                    <img src={khoaData.image} alt="Khoa" />
                </div>
                <div css={readmeCss}>{khoaData.readme}</div>
                <div css={linksCss}>
                    {khoaData.links.map(link => (
                        <a href={link.link} key={link.text} css={linkCss}>
                            <div css={linkImgCss}>
                                <img src={link.icon} alt="" />
                            </div>
                            <div>{link.text}</div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    </div>;
}

const headerCss = css`
    text-align: center;
    padding-bottom: 30px;
`;

const pageCss = css`
    display: flex;
    flex-direction: row;
`;

const authorCss = css`
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`;

const authorNameCss = css`
    font-size: 30px;
    font-weight: 600;
`;

const imageCss = css`
    width: 400px;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        max-width: 100%;
        max-height: 100%;
    }
`;

const readmeCss = css`
    width: 80%;
    text-align: justify;
    font-family: Inter;
    line-height: 120%;
    letter-spacing: 0.02em;
    white-space: pre-line;
`;

const linksCss = css`
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 70%;
`;

const linkCss = css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    width: fit-content;
    color: black;

    &:hover {
        text-decoration: underline !important;
    }

    &:visited {
        color: black;
    }
`;

const linkImgCss = css`
    height: 25px;
    width: 25px;

    img {
        max-height: 100%;
        max-width: 100%;
    }
`;
