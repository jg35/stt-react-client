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
  delete: {
    path: (color) => (
      <path
        fill={color}
        d="M32 464a48 48 0 0048 48h288a48 48 0 0048-48V128H32zm272-256a16 16 0 0132 0v224a16 16 0 01-32 0zm-96 0a16 16 0 0132 0v224a16 16 0 01-32 0zm-96 0a16 16 0 0132 0v224a16 16 0 01-32 0zM432 32H312l-9.4-18.7A24 24 0 00281.1 0H166.8a23.72 23.72 0 00-21.4 13.3L136 32H16A16 16 0 000 48v32a16 16 0 0016 16h416a16 16 0 0016-16V48a16 16 0 00-16-16z"
      />
    ),
    viewBox: "0 0 448 512",
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
};

export default icons;
