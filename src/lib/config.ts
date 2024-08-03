type Social = {
  platform: "twitter" | "github" | "youtube" | "linkedin" | "instagram" | "youtube" | "medium";
  handle: string;
  url: string;
}

export const socials: Social[] = [
  {
    platform: "twitter",
    handle: "@Eirfire1",
    url: "https://x.com/Eirfire1"
  },
  {
    platform: "github",
    handle: "jacobsamo",
    url: "https://github.com/jacobsamo"
  },
  // {
  //   platform: "youtube",
  //   handle: "jacobsamorowski",
  //   url: "https://youtube.com/jacobsamorowski"
  // },
  {
    platform: "linkedin",
    handle: "jacobsamorowski",
    url: "https://www.linkedin.com/in/jacob-samorowski"
  },
  // {
  //   platform: "instagram",
  //   handle: "jacobsamorowski",
  //   url: "https://instagram.com/jacobsamorowski"
  // }
]

export const siteConfig = {
  title: 'Jacob Samorowski',
  description: "Jacob Samorowski's personal website",
  socials: {
    twitter: {
      handle: '@jacobsamorowski',
      site: '@jacobsamorowski',
      cardType: 'summary_large_image',
    },
    github: {
      handle: 'jacobsamorowski',
      url: 'https://github.com/jacobsamorowski',
    },
    youtube: {
      handle: 'jacobsamorowski',
      url: 'https://youtube.com/jacobsamorowski',
    },
    linkedin: {
      handle: 'jacobsamorowski',
      url: 'https://linkedin.com/jacobsamorowski',
    },
    instagram: {
      handle: 'jacobsamorowski',
      url: 'https://instagram.com/jacobsamorowski',
    },
  },
  og: {
    url: 'https://www.jacobsamorowski.com/images/profile-picture.jpg',
    alt: "Jacob's profile",
    width: 400,
    height: 400,
  },
  keywords: [
    'jacob',
    'samorowski',
    'jacob samorowski',
    'software developer',
    'photographer',
    'blog',
    'website',
    'portfolio',
    'personal website',
  ],
};
