const icons = {
  menu: {
    path: (color) => (
      <>
        <path d="M0 0h24v24H0z" fill="none"></path>
        <path
          d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
          fill={color}
        ></path>
      </>
    ),
  },
  settings: {
    path: (color) => (
      <path
        d="M2.25 8A.76.76 0 013 7.25h2.25V7A1.76 1.76 0 017 5.25h2A1.76 1.76 0 0110.75 7v.25H21a.75.75 0 010 1.5H10.75V9A1.76 1.76 0 019 10.75H7A1.76 1.76 0 015.25 9v-.25H3A.76.76 0 012.25 8zM21 15.25h-2.25V15A1.76 1.76 0 0017 13.25h-2A1.76 1.76 0 0013.25 15v.25H3a.75.75 0 000 1.5h10.25V17A1.76 1.76 0 0015 18.75h2A1.76 1.76 0 0018.75 17v-.25H21a.75.75 0 000-1.5z"
        data-name="setting"
        fill={color}
      />
    ),
  },
  plus: {
    viewBox: "0 0 448 512",
    path: (color) => (
      <path
        fill={color}
        d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"
      />
    ),
  },
  minus: {
    viewBox: "0 0 448 512",
    path: (color) => (
      <path
        fill={color}
        d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"
      />
    ),
  },

  chapter: {
    path: (color) => (
      <>
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          data-name="Path 41"
          d="M17 3H7a2.006 2.006 0 00-2 2v16l7-3 7 3V5a2.006 2.006 0 00-2-2z"
          fill={color}
        />
      </>
    ),
  },
  check: {
    viewBox: "0 0 512 512",
    path: (color) => (
      <path
        fill={color}
        d="M173.89 439.404l-166.4-166.4c-9.997-10-9.997-26.21 0-36.21l36.203-36.21c9.997-10 26.2-10 36.2 0l112.09 112.094 240.09-240.094c9.99-9.997 26.2-9.997 36.2 0l36.2 36.2c9.99 9.997 9.99 26.2 0 36.2l-294.4 294.4c-10 9.99-26.21 9.99-36.21-.01Z"
      />
    ),
  },
  cross: {
    viewBox: "0 0 352 512",
    path: (color) => (
      <path
        fill={color}
        d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
      />
    ),
  },
  logo: {
    path: (color) => (
      <g
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        strokeWidth="2"
      >
        <path
          data-name="Path 11"
          d="M25 14.143l-12.821 7.453-10.6-6.573A3.436 3.436 0 011 12.754c0-.554.162-.541.353-.692.574-.456 1.731.2 2.109.439.506.317 8.589 4.99 8.589 4.99L25 10.417"
        />
        <path data-name="Path 12" d="M23.651 11.154a3.8 3.8 0 00.422 3.364" />
        <path
          data-name="Path 13"
          d="M25 10.226l-12.821 7.452-10.6-6.573A3.435 3.435 0 011 8.838c0-.554.162-.541.353-.692.574-.456 1.731.2 2.109.439.506.315 8.589 4.989 8.589 4.989L25 6.499l-9.963-5.5L1.353 8.145"
        />
        <path data-name="Path 14" d="M23.651 7.236a3.8 3.8 0 00.422 3.364" />
      </g>
    ),
    viewBox: "0 0 26.367 22.596",
  },
  overflow: {
    path: (color) => (
      <path
        d="M10.323 2.323A2.323 2.323 0 118 0a2.321 2.321 0 012.323 2.323zM13.677 0A2.323 2.323 0 1016 2.323 2.321 2.321 0 0013.677 0zM2.322 0a2.323 2.323 0 102.323 2.323A2.321 2.321 0 002.323 0z"
        fill={color}
      />
    ),
    // -4 pushes to right, 24 width, 4 height
    viewBox: "-4 0 24 4",
  },
  private: {
    path: (color) => (
      <path
        d="M8.999 11.25a4.035 4.035 0 01-4.018-3.747l-2.95-2.28A9.374 9.374 0 00.999 6.789a.91.91 0 000 .821 9.021 9.021 0 008 4.993 8.736 8.736 0 002.191-.294l-1.458-1.133a4.054 4.054 0 01-.733.074zm8.826 1.634l-3.109-2.4a9.316 9.316 0 002.283-2.874.91.91 0 000-.821 9.021 9.021 0 00-8-4.986 8.667 8.667 0 00-4.143 1.06L1.279.095a.45.45 0 00-.632.079l-.548.71a.45.45 0 00.079.631l16.544 12.788a.45.45 0 00.632-.079l.552-.711a.45.45 0 00-.079-.629zM12.659 8.89l-1.105-.854a2.665 2.665 0 00-3.265-3.433 1.34 1.34 0 01.262.793 1.312 1.312 0 01-.043.281l-2.07-1.6a4 4 0 012.561-.927 4.048 4.048 0 014.05 4.05 3.954 3.954 0 01-.391 1.691z"
        fill={color}
      />
    ),
    viewBox: "0 -4 20 20",
  },
  public: {
    path: (color) => (
      <>
        <path d="M0 0h20v20H0z" fill="none" />
        <path
          d="M10 4.5A9.716 9.716 0 001 10a9.716 9.716 0 009 5.5 9.716 9.716 0 009-5.5 9.716 9.716 0 00-9-5.5zm0 9.167A3.9 3.9 0 015.909 10 3.9 3.9 0 0110 6.333 3.9 3.9 0 0114.091 10 3.9 3.9 0 0110 13.667zM10 7.8A2.335 2.335 0 007.545 10 2.335 2.335 0 0010 12.2a2.335 2.335 0 002.455-2.2A2.335 2.335 0 0010 7.8z"
          fill={color}
        />
      </>
    ),
    viewBox: "0 0 20 20",
  },
  shuffle: {
    path: (color) => (
      <path
        fill={color}
        d="M15.78 10.22a.75.75 0 010 1.061l-2.5 2.5A.751.751 0 0112 13.25V12h-1.837a.375.375 0 01-.274-.119l-2.2-2.362 1.667-1.786L11 9.5h1V8.251a.751.751 0 011.28-.53zM.375 4.5H3l1.649 1.767 1.667-1.786-2.2-2.362A.375.375 0 003.837 2H.375A.375.375 0 000 2.375v1.75a.375.375 0 00.375.375zM12 4.5v1.25a.751.751 0 001.28.53l2.5-2.5a.75.75 0 000-1.061l-2.5-2.5a.75.75 0 00-1.28.53V2h-1.837a.375.375 0 00-.274.119L3 9.5H.375A.375.375 0 000 9.875v1.75A.375.375 0 00.375 12h3.462a.375.375 0 00.274-.119L11 4.5z"
      />
    ),
    viewBox: "0 0 16 14",
  },
  edit: {
    path: (color) => (
      <>
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
          fill={color}
        />
      </>
    ),
  },
  question: {
    path: (color) => (
      <path
        fill={color}
        d="M504 256c0 136.997-111.043 248-248 248C119.043 504 8 392.99 8 256 8 119.083 119.043 8 256 8c136.957 0 248 111.083 248 248ZM262.65 90c-54.5 0-89.255 22.95-116.549 63.75 -3.54 5.28-2.36 12.41 2.71 16.25l34.69 26.31c5.2 3.94 12.62 3 16.66-2.13 17.86-22.66 30.113-35.797 57.3-35.797 20.42 0 45.69 13.14 45.69 32.958 0 14.97-12.363 22.667-32.54 33.976 -23.53 13.18-54.66 29.6-54.66 70.65v4c0 6.62 5.37 12 12 12h56c6.62 0 12-5.38 12-12v-1.34c0-28.47 83.18-29.65 83.18-106.667 0-58.01-60.17-102-116.531-102Zm-6.66 248c-25.37 0-46 20.63-46 46 0 25.36 20.63 46 46 46 25.36 0 46-20.64 46-46 0-25.37-20.64-46-46-46Z"
      />
    ),
    viewBox: "0 0 512 512",
  },
  // delete: {
  //   path: (color) => (
  //     <path
  //       fill={color}
  //       d="M32 464a48 48 0 0048 48h288a48 48 0 0048-48V128H32zm272-256a16 16 0 0132 0v224a16 16 0 01-32 0zm-96 0a16 16 0 0132 0v224a16 16 0 01-32 0zm-96 0a16 16 0 0132 0v224a16 16 0 01-32 0zM432 32H312l-9.4-18.7A24 24 0 00281.1 0H166.8a23.72 23.72 0 00-21.4 13.3L136 32H16A16 16 0 000 48v32a16 16 0 0016 16h416a16 16 0 0016-16V48a16 16 0 00-16-16z"
  //     />
  //   ),
  //   viewBox: "0 0 448 512",
  // },
  delete: {
    path: (color) => (
      <g>
        <path fill="none" d="M0 0h24v24H0Z" />
        <path
          fill={color}
          d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12ZM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4Z"
        />
      </g>
    ),
    viewBox: "0 0 24 24",
  },
  preview: {
    path: (color) => (
      <>
        <path fill="none" d="M0 0h24v24H0z" />
        <path
          fill={color}
          d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2V5a2 2 0 00-2-2zm0 16H5V7h14v12zm-5.5-6c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zM12 9c-2.73 0-5.06 1.66-6 4 .94 2.34 3.27 4 6 4s5.06-1.66 6-4c-.94-2.34-3.27-4-6-4zm0 6.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"
        />
      </>
    ),
  },
  fullscreen: {
    path: () => (
      <path d="M212.686 315.314L120 408l32.922 31.029c15.12 15.12 4.412 40.971-16.97 40.971h-112C10.697 480 0 469.255 0 456V344c0-21.382 25.803-32.09 40.922-16.971L72 360l92.686-92.686c6.248-6.248 16.379-6.248 22.627 0l25.373 25.373c6.249 6.248 6.249 16.378 0 22.627zm22.628-118.628L328 104l-32.922-31.029C279.958 57.851 290.666 32 312.048 32h112C437.303 32 448 42.745 448 56v112c0 21.382-25.803 32.09-40.922 16.971L376 152l-92.686 92.686c-6.248 6.248-16.379 6.248-22.627 0l-25.373-25.373c-6.249-6.248-6.249-16.378 0-22.627z" />
    ),
    viewBox: "0 0 448 512",
  },
  compress: {
    path: () => (
      <path d="M4.686 427.314L104 328l-32.922-31.029C55.958 281.851 66.666 256 88.048 256h112C213.303 256 224 266.745 224 280v112c0 21.382-25.803 32.09-40.922 16.971L152 376l-99.314 99.314c-6.248 6.248-16.379 6.248-22.627 0L4.686 449.941c-6.248-6.248-6.248-16.379 0-22.627zM443.314 84.686L344 184l32.922 31.029c15.12 15.12 4.412 40.971-16.97 40.971h-112C234.697 256 224 245.255 224 232V120c0-21.382 25.803-32.09 40.922-16.971L296 136l99.314-99.314c6.248-6.248 16.379-6.248 22.627 0l25.373 25.373c6.248 6.248 6.248 16.379 0 22.627z"></path>
    ),
    viewBox: "0 0 448 512",
  },
  cancel: {
    path: (color) => (
      <>
        <path opacity=".87" fill="none" d="M0 0h24v24H0V0Z" />
        <path
          fill={color}
          d="M12 2C6.47 2 2 6.47 2 12c0 5.53 4.47 10 10 10s10-4.47 10-10 -4.47-10-10-10Zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8 -3.59 8-8 8Zm3.59-13L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41Z"
        />
      </>
    ),
  },
  writing: {
    path: (color) => (
      <path
        fill={color}
        d="M136.6 138.79a64.003 64.003 0 0 0-43.31 41.35L0 460l14.69 14.69L164.8 324.58c-2.99-6.26-4.8-13.18-4.8-20.58 0-26.51 21.49-48 48-48s48 21.49 48 48-21.49 48-48 48c-7.4 0-14.32-1.81-20.58-4.8L37.31 497.31 52 512l279.86-93.29a64.003 64.003 0 0 0 41.35-43.31L416 224 288 96l-151.4 42.79zm361.34-64.62l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.75 18.75-49.15 0-67.91z"
      ></path>
    ),
    viewBox: "0 0 512 512",
  },
  photo: {
    path: (color) => (
      <path
        fill={color}
        d="M48 32C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48H48zm0 32h106c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H38c-3.3 0-6-2.7-6-6V80c0-8.8 7.2-16 16-16zm426 96H38c-3.3 0-6-2.7-6-6v-36c0-3.3 2.7-6 6-6h138l30.2-45.3c1.1-1.7 3-2.7 5-2.7H464c8.8 0 16 7.2 16 16v74c0 3.3-2.7 6-6 6zM256 424c-66.2 0-120-53.8-120-120s53.8-120 120-120 120 53.8 120 120-53.8 120-120 120zm0-208c-48.5 0-88 39.5-88 88s39.5 88 88 88 88-39.5 88-88-39.5-88-88-88zm-48 104c-8.8 0-16-7.2-16-16 0-35.3 28.7-64 64-64 8.8 0 16 7.2 16 16s-7.2 16-16 16c-17.6 0-32 14.4-32 32 0 8.8-7.2 16-16 16z"
      ></path>
    ),
    viewBox: "0 0 512 512",
  },
  calendar: {
    path: (color) => (
      <path
        fill={color}
        d="M148 288h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm108-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 96v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96-260v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48zm-48 346V160H48v298c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"
      ></path>
    ),

    viewBox: "0 0 448 512",
  },
  chevron: {
    path: (color, rotate) => (
      <g
        id="chevron_down"
        data-name="chevron down"
        transform={`translate(10) rotate(90)`}
      >
        <path d="M0,0H10V10H0Z" fill="none" />
        <path
          d="M1.029,0,0,1.175,3.344,5,0,8.825,1.029,10,5.41,5Z"
          transform="translate(2.377)"
          fill={color}
        />
      </g>
    ),
    viewBox: "0 0 10 10",
  },
  spinner: {
    path: (color = "currentColor", rotate) => (
      <>
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="4"
          fill="transparent"
        ></circle>
        <path
          className="opacity-75"
          fill={color}
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </>
    ),
    viewBox: "0 0 24 24",
  },
  google: {
    path: (color) => (
      <path
        fill={color}
        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
      ></path>
    ),
    viewBox: "0 0 448 512",
  },
  info: {
    viewBox: "0 0 192 512",
    path: (color) => (
      <path
        fill={color}
        d="M20 424.229h20v-144.46H20c-11.046 0-20-8.96-20-20v-47.78c0-11.05 8.954-20 20-20h112c11.04 0 20 8.95 20 20v212.22h20c11.04 0 20 8.95 20 20v47.77c0 11.04-8.96 20-20 20H20c-11.046 0-20-8.96-20-20v-47.78c0-11.05 8.954-20 20-20ZM96 0C56.23 0 24 32.23 24 72c0 39.76 32.23 72 72 72 39.76 0 72-32.24 72-72 0-39.77-32.24-72-72-72Z"
      />
    ),
  },
  alignLeft: {
    viewBox: "0 0 448 512",
    path: (color) => (
      <path
        fill={color}
        d="M12.83 352h262.34v0c7.08 0 12.82-5.73 12.83-12.81 0-.01 0-.02 0-.03v-38.34 0c0-7.09-5.73-12.83-12.81-12.83 -.01-.01-.02-.01-.03 0H12.82v-.001c-7.09-.01-12.83 5.72-12.83 12.8 -.01 0-.01.01 0 .02v38.34 0c-.01 7.08 5.72 12.82 12.8 12.83 0 0 .01 0 .02 0Zm0-256h262.34v0c7.08 0 12.82-5.73 12.83-12.81 0-.01 0-.02 0-.03V44.82v0c0-7.09-5.73-12.83-12.81-12.83 -.01-.01-.02-.01-.03 0H12.82h0C5.73 31.98-.01 37.71-.01 44.79c-.01 0-.01.01 0 .02v38.34 0c-.01 7.08 5.72 12.82 12.8 12.83 0 0 .01 0 .02 0ZM432 160H16v0c-8.84 0-16 7.16-16 16v32 0c0 8.83 7.16 16 16 16h416v0c8.83 0 16-7.17 16-16v-32 0c0-8.84-7.17-16-16-16Zm0 256H16v0c-8.84 0-16 7.16-16 16v32 0c0 8.83 7.16 16 16 16h416v0c8.83 0 16-7.17 16-16v-32 0c0-8.84-7.17-16-16-16Z"
      />
    ),
  },
  alignRight: {
    viewBox: "0 0 448 512",
    path: (color) => (
      <path
        fill={color}
        d="M16 224h416v0c8.83 0 16-7.17 16-16v-32 0c0-8.84-7.17-16-16-16H16v0c-8.84 0-16 7.16-16 16v32 0c0 8.83 7.16 16 16 16Zm416 192H16v0c-8.84 0-16 7.16-16 16v32 0c0 8.83 7.16 16 16 16h416v0c8.83 0 16-7.17 16-16v-32 0c0-8.84-7.17-16-16-16Zm3.17-384H172.83v0c-7.09-.01-12.83 5.72-12.83 12.8 -.01 0-.01.01 0 .02v38.34 0c-.01 7.08 5.72 12.82 12.8 12.83 0 0 .01 0 .02 0h262.34 0c7.08 0 12.82-5.73 12.83-12.81 0-.01 0-.02 0-.03V44.81h0c0-7.09-5.73-12.83-12.81-12.83 -.01-.01-.02-.01-.03 0Zm0 256H172.83v-.001c-7.09-.01-12.83 5.72-12.83 12.8 -.01 0-.01.01 0 .02v38.34 0c-.01 7.08 5.72 12.82 12.8 12.83 0 0 .01 0 .02 0h262.34l0 0c7.08 0 12.82-5.73 12.83-12.81 0-.01 0-.02 0-.03V300.8h0c0-7.09-5.73-12.83-12.81-12.83 -.01-.01-.02-.01-.03 0Z"
      />
    ),
  },
  alignCenter: {
    viewBox: "0 0 448 512",
    path: (color) => (
      <path
        fill={color}
        d="M432 160H16v0c-8.84 0-16 7.16-16 16v32 0c0 8.83 7.16 16 16 16h416v0c8.83 0 16-7.17 16-16v-32 0c0-8.84-7.17-16-16-16Zm0 256H16v0c-8.84 0-16 7.16-16 16v32 0c0 8.83 7.16 16 16 16h416v0c8.83 0 16-7.17 16-16v-32 0c0-8.84-7.17-16-16-16ZM108.1 96h231.81v0c6.67 0 12.09-5.42 12.09-12.09 0-.01-.01-.01-.01-.02V44.08v0c0-6.68-5.42-12.09-12.09-12.09H108.09l0 0c-6.68-.01-12.1 5.4-12.1 12.07 -.01 0-.01 0-.01.01v39.81 0c0 6.68 5.41 12.1 12.1 12.1Zm231.81 256v0c6.67 0 12.09-5.42 12.09-12.09 0-.01-.01-.01-.01-.02v-39.81 0c0-6.68-5.42-12.09-12.09-12.09H108.09h0c-6.68-.01-12.1 5.4-12.1 12.07 -.01 0-.01 0-.01.01v39.81h0c0 6.68 5.41 12.1 12.1 12.1Z"
      />
    ),
  },
  facebook: {
    viewBox: "0 0 512 512",
    path: (color) => (
      <path
        fill={color}
        d="M504 256C504 119 393 8 256 8 119 8 8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256Z"
      />
    ),
  },
  facebookMessenger: {
    viewBox: "0 0 512 512",
    path: (color) => (
      <path
        fill={color}
        d="M256.55 8C116.52 8 8 110.34 8 248.57c0 72.3 29.71 134.78 78.07 177.94 8.35 7.51 6.63 11.86 8.05 58.23v-.001c.37 10.99 9.59 19.6 20.59 19.22 2.51-.09 4.98-.65 7.28-1.66 52.91-23.3 53.59-25.14 62.56-22.7 153.29 42.19 319.44-55.91 319.44-231.04 0-138.23-107.41-240.57-247.45-240.57Zm149.24 185.13l-73 115.57v-.001c-11.06 17.42-34.15 22.59-51.58 11.53 -.8-.51-1.58-1.05-2.34-1.61l-58.08-43.47v0c-5.34-4-12.67-4-18 0l-78.37 59.44c-10.46 7.93-24.16-4.6-17.11-15.67l73-115.57v0c11.04-17.43 34.13-22.6 51.55-11.56 .8.51 1.58 1.05 2.35 1.62l58.06 43.46v0c5.33 4 12.66 4 18 0l78.41-59.38c10.44-7.98 24.14 4.54 17.09 15.62Z"
      />
    ),
  },
  twitter: {
    viewBox: "0 0 512 512",
    path: (color) => (
      <path
        fill={color}
        d="M459.37 151.71c.32 4.54.32 9.09.32 13.64 0 138.72-105.59 298.558-298.558 298.558 -59.452 0-114.68-17.22-161.137-47.11 8.447.97 16.56 1.29 25.34 1.29 49.05 0 94.21-16.57 130.27-44.84 -46.14-.98-84.792-31.19-98.112-72.78 6.49.97 12.99 1.62 19.81 1.62 9.42 0 18.84-1.3 27.61-3.58 -48.09-9.75-84.143-51.98-84.143-102.99v-1.3C34.73 202 50.98 206.88 68.2 207.52 39.93 188.67 21.42 156.51 21.42 120.13c0-19.5 5.19-37.36 14.29-52.96 51.65 63.67 129.3 105.25 216.365 109.8 -1.63-7.8-2.6-15.92-2.6-24.04 0-57.828 46.78-104.94 104.934-104.94 30.21 0 57.5 12.67 76.67 33.137 23.71-4.55 46.45-13.32 66.59-25.34 -7.8 24.366-24.37 44.833-46.14 57.827 21.11-2.28 41.584-8.122 60.42-16.25 -14.3 20.79-32.161 39.3-52.63 54.253Z"
      />
    ),
  },
  whatsapp: {
    viewBox: "0 0 448 512",
    path: (color) => (
      <path
        fill={color}
        d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111l-31.5 115 117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157Zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4 -69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6Zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18 -5.1-1.9-8.8-2.8-12.5 2.8 -3.7 5.6-14.3 18-17.6 21.8 -3.2 3.7-6.5 4.2-12 1.4 -32.6-16.3-54-29.1-75.5-66 -5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7 -1.4-2.8-12.5-30.1-17.1-41.2 -4.5-10.8-9.1-9.3-12.5-9.5 -3.2-.2-6.9-.2-10.6-.2 -3.7 0-9.7 1.4-14.8 6.9 -5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4 -1.3-2.5-5-3.9-10.5-6.6Z"
      />
    ),
  },
  email: {
    viewBox: "0 0 24 24",
    path: (color) => (
      <g>
        <path fill="none" d="M0 0h24v24H0V0Z" />
        <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6Zm-2 0l-8 5L4 6h16Zm0 12H4V8l8 5 8-5v10Z" />
      </g>
    ),
  },
};

export default icons;
