export const fragment = ({
  type,
  questionId = null,
  tag = null,
  content,
  date = null,
}) => ({
  type,
  content: content || "",
  date,
  questionId,
  tag,
  mediaUrl: null,
  mediaCaption: "",
});

export const userEvent = ({ date = null }) => ({
  title: "",
  date,
  type: "EVENT",
});
