import React, { useState } from 'react';

function TextToSpeech() {
  const [text, setText] = useState("");

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div>
      <textarea
        placeholder="Enter text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={speak}>Read Aloud</button>
    </div>
  );
}

export default TextToSpeech;
