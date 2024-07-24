import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import './css/FaceRecognition.css';

const FaceRecognition = () => {
  const videoRef = useRef();
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
      await faceapi.loadFaceLandmarkModel(MODEL_URL);
      await faceapi.loadFaceRecognitionModel(MODEL_URL);
      setIsModelLoaded(true);
    };

    loadModels();

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: {} })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error('Error accessing webcam: ', err));
    };

    startVideo();
  }, []);

  const handleVideoPlay = () => {
    const interval = setInterval(async () => {
      if (isModelLoaded && videoRef.current) {
        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;
        
        if (videoWidth === 0 || videoHeight === 0) {
          console.log('Video not ready yet, retrying...');
          return;
        }
        
        const displaySize = { width: videoWidth, height: videoHeight };
        faceapi.matchDimensions(videoRef.current, displaySize);

        const detections = await faceapi.detectAllFaces(videoRef.current).withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        if (resizedDetections.length > 0) {
          const canvas = faceapi.createCanvasFromMedia(videoRef.current);
          canvas.getContext('2d').drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
          const dataUrl = canvas.toDataURL('image/jpeg');
          sendImageToServer(dataUrl);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  const sendImageToServer = async (dataUrl) => {
    try {
      const response = await fetch('/api/recognize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: dataUrl }),
      });

      const result = await response.json();
      if (result.match) {
        setMessage(`Match found: ${result.student.name}`);
      } else {
        setMessage("No match found");
      }
    } catch (error) {
      console.error('Error sending image to server:', error);
      setMessage("Error sending image to server");
    }
  };

  return (
    <div className="container">
      <video ref={videoRef} autoPlay muted onPlay={handleVideoPlay} className="camera" />
      {message && <div className={`alert ${message.includes("No") ? "alert-error" : "alert-success"}`}>{message}</div>}
    </div>
  );
};

export default FaceRecognition;
