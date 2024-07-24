import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FaceRecognition = () => {
  const videoRef = useRef();
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      setIsModelLoaded(true);
    };

    loadModels();
    startVideo();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error('Error accessing webcam: ', err));
  };

  const captureAndCompare = async () => {
    if (isModelLoaded && videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      toast.info("Face detected, processing...");
      await sendImageToServer(dataUrl);
    }
  };

  const sendImageToServer = async (dataUrl) => {
    try {
      const response = await fetch('http://localhost:3001/api/recognize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: dataUrl }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.match) {
        toast.success(`Match found: ${result.student.name}`);
      } else {
        toast.error("No match found");
      }
    } catch (error) {
      console.error('Error sending image to server:', error);
      toast.error("Error sending image to server");
    }
  };

  return (
    <div className="container">
      <div className="video-container">
        <video ref={videoRef} autoPlay muted className="camera" />
      </div>
      <button onClick={captureAndCompare}>Capture and Compare</button>
      <ToastContainer />
    </div>
  );
};

export default FaceRecognition;
