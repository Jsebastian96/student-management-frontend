import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { Modal, Box, Typography } from '@mui/material';

const FaceRecognition = () => {
  const videoRef = useRef(null);
  const [recognizedStudent, setRecognizedStudent] = useState(null);
  const [open, setOpen] = useState(false);
  const socket = io('http://localhost:4000');

  const handleClose = () => setOpen(false);

  useEffect(() => {
    let videoStream = null;

    const startVideo = async () => {
      try {
        videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = videoStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(error => {
            console.error("Error playing video: ", error);
          });
        };
      } catch (err) {
        console.error("Error accessing camera: ", err);
      }
    };

    const sendFrame = () => {
      if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/jpeg');
        const base64Image = dataURL.split(',')[1];
        socket.emit('frame', base64Image);
      }
    };

    socket.on('recognized', (data) => {
      if (data.name === 'Unknown') {
        setRecognizedStudent({ name: 'No student recognized', message: data.message });
      } else {
        setRecognizedStudent(data);
      }
      setOpen(true);
    });

    startVideo();

    const intervalId = setInterval(sendFrame, 1000);

    return () => {
      clearInterval(intervalId);
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
      socket.disconnect();
    };
  }, [socket]);

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <div>
      <h1>Face Recognition Module</h1>
      <video ref={videoRef} style={{ width: '100%' }} />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="student-modal-title"
        aria-describedby="student-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="student-modal-title" variant="h6" component="h2">
            {recognizedStudent?.name}
          </Typography>
          {recognizedStudent?.message ? (
            <Typography id="student-modal-description" sx={{ mt: 2 }}>
              {recognizedStudent.message}
            </Typography>
          ) : (
            <>
              <Typography id="student-modal-description" sx={{ mt: 2 }}>
                Email: {recognizedStudent?.email}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                Course: {recognizedStudent?.course}
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default FaceRecognition;
