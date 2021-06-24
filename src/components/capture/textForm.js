import React from "react";

export default function TextForm({ setItem, item }) {
  const placeholders = [
    "",
    "“A professional writer is an amateur who didn’t quit.” ~ Richard Bach",
    "“I only write when I’m inspired, so I see to it that I’m inspired every morning at nine o’clock.” ~ Peter De Vries",
    "“Talent is cheaper than table salt. What separates the talented individual from the successful one is a lot of hard work.” ~ Steven King",
    "“If you want to be a writer, you must do two things above all others: read a lot and write a lot.” ~ Stephen King",
    "“There is no greater agony than bearing an untold story inside you.” ~ Maya Angelou",
    "“I love deadlines. I love the whooshing noise they make as they go by.” ~ Douglas Adams, The Salmon of Doubt",
    "“If you want to be a writer, you must do two things above all others: read a lot and write a lot.” ~ Stephen King",
    "“There is no greater agony than bearing an untold story inside you.” ~ Maya Angelou",
    "“I love deadlines. I love the whooshing noise they make as they go by.” ~ Douglas Adams, The Salmon of Doubt",
    "“A writer is working when he’s staring out of the window.” ~ Burton Rascoe",
    "“Just write every day of your life. Read intensely. Then see what happens. Most of my friends who are put on that diet have very pleasant careers.” ~ Ray Bradbury",
    "“Close the door. Write with no one looking over your shoulder. Don’t try to figure out what other people want to hear from you; figure out what you have to say. It’s the one and only thing you have to offer.” ~ Barbara Kingsolver",
    "“The English language is an arsenal of weapons. If you are going to brandish them without checking to see whether or not they are loaded, you must expect to have them explode in your face from time to time.” ~ Stephen Fry",
  ];
  const placeholder =
    placeholders[Math.floor(Math.random() * placeholders.length) + 1];
  return (
    <>
      <h1 className="modal-title">
        {item.question
          ? item.question.title
          : `${!item.id ? "New" : "Edit"} memory`}
      </h1>
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <textarea
            autoFocus
            placeholder={placeholder}
            className="w-full h-full focus:outline-none resize-none pr-4 text-xl"
            onChange={(e) => setItem({ ...item, content: e.target.value })}
            value={item.content}
          />
        </div>
      </div>
    </>
  );
}
