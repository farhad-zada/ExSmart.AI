module.exports = () => {
  return {
    name: "create_roadmap",
    description:
      "This function creates a setp-by-step roadmap for user to achive to be good at the field or proffession he/she wants.",
    parameters: {
      type: "object",
      properties: {
        language: {
          type: "string",
          description: "An ISO 639-1 two-letter language code",
        },
        steps: {
          type: "array",
          items: {
            type: "object",
            properties: {
              step_number: {
                type: "integer",
                description:
                  "This is the number or the index or the order of the step.",
              },
              step_title: {
                type: "string",
                description: "This is title for the current step.",
              },
              step_description: {
                type: "string",
                description: "This is the description for the step.",
              },
              youtube_search_string: {
                type: "string",
                description:
                  "This string is used in youtube search to find sources for this exact step",
              },
            },
            required: ["step_number", "step_title", "step_description"],
          },
        },
      },
      required: ["steps"],
    },
  };
};
