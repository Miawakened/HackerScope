
export const mockCommentsByStory = {
  1: [
    {
      id: "comment-101",
      by: "simonw",
      timeAgo: "1 hour ago",
      score: 42,
      text: "SQLite can be a great fit when you want a capable database without extra operational complexity.",
      replies: [
        {
          id: "comment-102",
          by: "maya",
          timeAgo: "35 minutes ago",
          score: 12,
          text: "Agreed. Keeping the setup simple can make a big difference for small teams.",
          replies: [],
        },
      ],
    },
    {
      id: "comment-103",
      by: "devin",
      timeAgo: "2 hours ago",
      score: 18,
      text: "I would be interested to hear how this performs as the project grows.",
      replies: [],
    },
  ],

  2: [
    {
      id: "comment-201",
      by: "sarah",
      timeAgo: "45 minutes ago",
      score: 15,
      text: "I like seeing small search projects. What did you use to build the index?",
      replies: [],
    },
  ],

  3: [
    {
      id: "comment-301",
      by: "patio11",
      timeAgo: "30 minutes ago",
      score: 9,
      text: "I am working on improving the documentation for a project this week.",
      replies: [],
    },
  ],

  4: [
    {
      id: "comment-401",
      by: "maya",
      timeAgo: "1 hour ago",
      score: 21,
      text: "Reducing unnecessary JavaScript made a noticeable difference for my project.",
      replies: [],
    },
  ],
};