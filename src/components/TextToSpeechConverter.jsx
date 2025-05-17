import React, { useState, useRef } from 'react';

function TextToSpeechConverter() {
  const [inputText, setInputText] = useState('');
  const [audioSrc, setAudioSrc] = useState('');
  const [status, setStatus] = useState({ message: '', color: 'black' });
  const [isProcessing, setIsProcessing] = useState(false);
  const audioRef = useRef(null);

  const MY_API_KEY = import.meta.env.VITE_SARVAM_API_KEY || "no key"
  const KEY_LOAD_STATUS = MY_API_KEY == "no key" ? "❌" : "✔"

  const convertToSpeech = async () => {
    const text = inputText.trim();

    if (!text) {
      setStatus({ message: 'Please enter some text first', color: 'red' });
      return;
    }

    setStatus({ message: 'Processing...', color: 'black' });
    setAudioSrc('');
    setIsProcessing(true);

    // bulbul:v1 is currently not working, switching to v2
    
    const options = {
      method: 'POST',
      headers: {
        'api-subscription-key': MY_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        speaker: "vidya", //optional
        target_language_code: "od-IN",
        inputs: [text],
        model: "bulbul:v2" //optional
      })
    };

    try {
      const response = await fetch('https://api.sarvam.ai/text-to-speech', options);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (data.audios && data.audios.length > 0) {
        setAudioSrc(`data:audio/wav;base64,${data.audios[0]}`);
        setStatus({ message: 'Conversion successful! Click play to listen.', color: 'green' });
      } else {
        throw new Error('No audio data found in response');
      }
    } catch (err) {
      console.error('Error:', err);
      setStatus({ message: `Error: ${err.message}`, color: 'red' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className='text-center flex justify-center min-h-screen bg-blue-100'>
      <div className='w-md shadow shadow-gray-400 p-8 flex flex-col items-center rounded-2xl'>
      <select name="hall" id="language-s" value="Odia">
        <option>Odia</option>
        <option>English</option>
        <option>Spanish</option>
        <option>French</option>
        <option>Chinese - Mandrin</option>
      </select>
        <h1 className='text-2xl text-blue-500 py-5'>Text to Speech Converter</h1>
        <p>API KEY STATUS: {KEY_LOAD_STATUS} </p>
        <p className="mb-2 text-sm text-gray-600">
        <span className="font-semibold">Language:</span> ଓଡ଼ିଆ (Odia) 
      </p>
        <p>Enter your text below and click "Convert to Speech"</p>
        <textarea className='border border-blue-200 p-2 rounded-2xl bg-gray-200 my-3'
          id="inputText"
          rows="5"
          cols="50"
          placeholder="Enter text to convert to speech"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <br />
        <button
          id="convertBtn"
          onClick={convertToSpeech}
          disabled={isProcessing}
          className="border border-gray-400 bg-gray-200 text-gray-800 font-semibold rounded-lg"
          style={{ padding: '8px 16px', cursor: isProcessing ? 'not-allowed' : 'pointer' }}
        >
          {isProcessing ? 'Processing...' : 'Convert to Speech'}
        </button>

        <div id="result" style={{ marginTop: '20px' }}>
          <h2>Result</h2>
          {audioSrc && (
  <div className="flex flex-col items-center">
    <audio
      id="audioPlayer"
      style={{ display: 'block', width: '100%' }}
      ref={audioRef}
    >
      <source src={audioSrc} type="audio/wav" />
      Your browser does not support the audio element.
    </audio>
    <div className="flex flex-row mt-4">
      <button
        onClick={() => audioRef.current && audioRef.current.play()}
        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition mr-2"
        style={{ fontSize: '1.1rem', minWidth: '140px' }}
        aria-label="Play Audio"
      >
        ▶️ Play Audio
      </button>
      <a
        href={audioSrc}
        download="converted-audio.wav"
        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition flex items-center justify-center"
        style={{ fontSize: '1.1rem', minWidth: '140px', textDecoration: 'none' }}
        aria-label="Download Audio"
      >
        ⬇️ Download Audio
      </a>
    </div>
  </div>
)}
          <div id="status" style={{ color: status.color, marginTop: '10px' }}>
            {status.message}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextToSpeechConverter;