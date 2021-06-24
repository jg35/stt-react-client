export const getImgIxSrc = (s3Path) => {
    return s3Path.replace('https://poggl.s3.eu-west-2.amazonaws.com', process.env.REACT_APP_IMGIX_BASE_URL);
}