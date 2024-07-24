import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/FaceRecognition.css';  

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

      // Mostrar mensaje de procesamiento
      const processingId = toast.info("Face detected, processing...", { autoClose: false });

      // Enviar imagen al servidor
      const result = await sendImageToServer(dataUrl);

      // Cerrar mensaje de procesamiento
      toast.dismiss(processingId);

      // Mostrar mensaje de resultado
      if (result && result.match) {
        toast.success(`Estudiante Encontrado: ${result.student.name}`);
      } else {
        toast.error("No Encontrado");
      }
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
      console.log('Server response:', result); // Agregar mensaje de consola para la respuesta del servidor
      return result;
    } catch (error) {
      console.error('Error sending image to server:', error);
      toast.error("Error sending image to server");
      return null;
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
