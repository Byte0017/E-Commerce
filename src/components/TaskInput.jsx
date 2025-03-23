import { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

function TaskInput({ addTask, defaultLanguage = 'en-US' }) {
  const [recordedText, setRecordedText] = useState('');
  const [currentText, setCurrentText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [language, setLanguage] = useState(defaultLanguage);
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const timeoutRef = useRef(null);

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'es-ES', name: 'Spanish (Spain)' },
    { code: 'fr-FR', name: 'French (France)' },
    { code: 'de-DE', name: 'German (Germany)' },
    { code: 'it-IT', name: 'Italian (Italy)' },
    { code: 'ja-JP', name: 'Japanese (Japan)' },
    { code: 'zh-CN', name: 'Chinese (Mandarin)' },
    { code: 'hi-IN', name: 'Hindi (India)' },
    { code: 'ar-SA', name: 'Arabic (Saudi Arabia)' },
    { code: 'ru-RU', name: 'Russian (Russia)' },
  ];

  // Initialize speech recognition and audio analysis
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
    
    return () => {
      stopListening();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Audio level monitoring
  const setupAudioAnalysis = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateAudioLevel = () => {
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        setAudioLevel(average / 255);
        if (isListening) {
          requestAnimationFrame(updateAudioLevel);
        }
      };
      updateAudioLevel();
    } catch (err) {
      console.error('Audio setup error:', err);
    }
  }, [isListening]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      showMessage('Speech recognition not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.lang = language;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.continuous = true;
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + ' ';
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      
      setRecordedText((prev) => prev + finalTranscript);
      setCurrentText(interimTranscript);
    };

    recognitionRef.current.onerror = (event) => {
      showMessage(`Recognition error: ${event.error}`, 'error');
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      setCurrentText('');
      showMessage('Listening stopped.');
    };

    recognitionRef.current.onaudiostart = () => {
      setupAudioAnalysis();
    };

    try {
      recognitionRef.current.start();
      setIsListening(true);
      showMessage(`Listening (${languages.find((l) => l.code === language).name})...`);
    } catch (err) {
      showMessage('Failed to start listening: ' + err.message, 'error');
    }
  }, [language, isSupported, setupAudioAnalysis]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current.abort();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setAudioLevel(0);
  }, []);

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setMessage(''), 3000);
  };

  const handleAddTask = useCallback(() => {
    const taskText = (recordedText + ' ' + currentText).trim();
    if (!taskText) {
      showMessage('Please provide task text.', 'warning');
      return;
    }
    
    try {
      addTask(taskText, priority);
      setRecordedText('');
      setCurrentText('');
      showMessage('Task successfully added!', 'success');
    } catch (err) {
      showMessage('Failed to add task: ' + err.message, 'error');
    }
  }, [recordedText, currentText, priority, addTask]);

  const handleClear = () => {
    setRecordedText('');
    setCurrentText('');
    showMessage('Text cleared.');
  };

  return (
    <div className="bg-card-bg p-6 glass-effect shadow-luxury animate-slide-in rounded-xl">
      {/* Audio Visualizer */}
      {isListening && (
        <div className="mb-4 h-2 bg-neutral/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-100"
            style={{ width: `${audioLevel * 100}%` }}
          />
        </div>
      )}

      {/* Text Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium text-neutral-light block mb-1">
            Recorded Text
          </label>
          <textarea
            value={recordedText}
            onChange={(e) => setRecordedText(e.target.value)}
            placeholder="Final transcribed text appears here..."
            className="w-full p-3 bg-neutral/10 rounded-lg border-none focus:ring-2 focus:ring-primary/50 text-sm text-neutral placeholder-neutral-light resize-none"
            rows={3}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-neutral-light block mb-1">
            Live Speech
          </label>
          <textarea
            value={currentText}
            readOnly
            placeholder="Real-time speech preview..."
            className="w-full p-3 bg-neutral/5 rounded-lg border-none text-sm text-neutral placeholder-neutral-light resize-none"
            rows={3}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={isListening}
          className="p-2 bg-neutral/10 rounded-lg border-none focus:ring-2 focus:ring-primary/50 text-sm text-neutral cursor-pointer hover:bg-neutral/20 disabled:opacity-50"
          title="Select language"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="p-2 bg-neutral/10 rounded-lg border-none focus:ring-2 focus:ring-primary/50 text-sm text-neutral cursor-pointer hover:bg-neutral/20"
          title="Select priority"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <button
          onClick={handleClear}
          className="p-2 bg-neutral/10 rounded-lg text-sm text-neutral hover:bg-neutral/20 transition-all"
        >
          Clear Text
        </button>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 flex-wrap">
        <button
          onClick={startListening}
          disabled={isListening || !isSupported}
          className={`flex-1 py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Start Listening
        </button>
        <button
          onClick={stopListening}
          disabled={!isListening}
          className={`flex-1 py-2 px-4 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Stop Listening
        </button>
        <button
          onClick={handleAddTask}
          className="flex-1 py-2 px-4 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all"
        >
          Add Task
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <p 
          className={`mt-4 text-center text-sm p-2 rounded-lg animate-fade-in ${
            message.type === 'error' ? 'bg-red-500/20 text-red-200' :
            message.type === 'success' ? 'bg-green-500/20 text-green-200' :
            message.type === 'warning' ? 'bg-yellow-500/20 text-yellow-200' :
            'bg-neutral/10 text-neutral-light'
          }`}
        >
          {message.text}
        </p>
      )}

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (max-width: 640px) {
          .p-6 { padding: 1rem; }
          .flex-wrap { flex-direction: column; gap: 0.5rem; }
          .md\\:grid-cols-2, .md\\:grid-cols-3 { grid-template-columns: 1fr; }
          button, select { width: 100%; }
        }
      `}</style>
    </div>
  );
}

TaskInput.propTypes = {
  addTask: PropTypes.func.isRequired,
  defaultLanguage: PropTypes.string,
};

export default TaskInput;