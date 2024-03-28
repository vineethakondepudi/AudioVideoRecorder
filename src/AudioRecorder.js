import React, { useState, useRef } from 'react';
import './AudioRecorder.css'; // Import CSS file for styling

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false); 
  const [audioUrl, setAudioUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const mediaRecorder = useRef(null);
  const audioItem = useRef([]);
  const videoItem = useRef([]);

  const startRecording = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const videoStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      
      const audioTrack = audioStream.getAudioTracks()[0];
      videoStream.addTrack(audioTrack);

      mediaRecorder.current = new MediaRecorder(videoStream);
      mediaRecorder.current.addEventListener('dataavailable', handleDataAvailable);
      mediaRecorder.current.addEventListener('stop', handleStop);
      setIsRecording(true);
      mediaRecorder.current.start();
    } catch (error) {
      console.error('Error accessing microphone or screen:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      if (event.data.type.includes('audio')) {
        audioItem.current.push(event.data);
      } else if (event.data.type.includes('video')) {
        videoItem.current.push(event.data);
      }
    }
  };

  const handleStop = () => {
    const audioBlob = new Blob(audioItem.current, { type: 'audio/wav' });
    const videoBlob = new Blob(videoItem.current, { type: 'video/webm' });
    setAudioUrl(URL.createObjectURL(audioBlob));
    setVideoUrl(URL.createObjectURL(videoBlob));
    audioItem.current = [];
    videoItem.current = [];
    setIsRecording(false);
  };

 
  const downloadVideo = () => {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = 'recorded_video.webm';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="audio-recorder-container">
      <div className="button-container">
        {isRecording ? (
            <div>
                <h1>Click button to stop the recording and download the file using download button in below</h1>
          <button onClick={stopRecording} className="stop-button">Stop Recording</button>
          </div>
        ) : (
           <div>
            <h1>Please Click the button to start recording your screen</h1>
          <button onClick={startRecording} className="start-button">
           Recording start 
          </button>
          </div>
        )}
      </div>
      {audioUrl && (
        <div className="media-container">
          <audio src={audioUrl} controls />
        </div>
      )}
      {videoUrl && (
        <div className="media-container">
          <video src={videoUrl} controls />
          <button onClick={downloadVideo} className="download-button">Download Video</button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;