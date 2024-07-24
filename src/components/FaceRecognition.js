import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; 
import * as faceapi from 'face-api.js';
import './css/FaceRecognition.css'; 

const FaceRecognition = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Cargar los modelos de face-api.js
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      console.log('Models loaded');
    };
    loadModels();
  }, []);

  useEffect(() => {
    // Obtener acceso a la cámara del dispositivo
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error('Error accessing the camera:', error);
      }
    };
    startVideo();
  }, []);

  useEffect(() => {
    const captureAndRecognize = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

      const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
      faceapi.matchDimensions(canvasRef.current, displaySize);

      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);

      canvasRef.current.toBlob(async (blob) => {
        if (!blob) {
          console.error('No blob created');
          return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('photo', blob);

        try {
          const response = await axios.post('http://localhost:3001/api/recognition/recognize', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          if (response.data.match) {
            setResult(`Match found: ${response.data.student.nombre_name} ${response.data.student.apellido}`);
            setError(null);
          } else {
            setResult('No match found');
            setError(null);
          }
        } catch (error) {
          console.error('Error recognizing photo:', error);
          setResult(null);
          setError('Error recognizing photo');
        } finally {
          setLoading(false);
        }
      }, 'image/jpeg');
    };

    // Capturar y reconocer cada 5 segundos
    const intervalId = setInterval(captureAndRecognize, 5000);

    return () => clearInterval(intervalId);
  }, [videoRef, canvasRef]);

  return (
    <div className="face-recognition-container">
      <video ref={videoRef} autoPlay muted className="video" />
      <canvas ref={canvasRef} className="canvas" width="640" height="480" />
      {loading && <div className="loading">Processing...</div>}
      {result && <div className="alert success">{result}</div>}
      {error && <div className="alert error">{error}</div>}
    </div>
  );
};

export default FaceRecognition;
