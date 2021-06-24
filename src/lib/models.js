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
  dateType: date ? "AUTO" : null,
  questionId,
  tag,
  mediaUrl: null,
  mediaCaption: "",
});

export const userEvent = (initialValue) => ({
  title: "",
  date: initialValue.date || null,
  type: "EVENT",
});
