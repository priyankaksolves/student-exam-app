import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { toast } from "react-toastify";

const FaceMonitor: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const issueRef = useRef<{
    type: "none" | "multiple" | null;
    startTime: number | null;
    lastWarnedTime: number | null;
  }>({
    type: null,
    startTime: null,
    lastWarnedTime: null,
  });

  useEffect(() => {
    const loadAllModels = async () => {
      try {
        const MODEL_URL = "/models";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
        ]);
        console.log("Models loaded successfully");
        setModelsLoaded(true);
      } catch (err) {
        toast.error("Failed to load face-api models.");
      }
    };
    loadAllModels();
  }, []);

  useEffect(() => {
    if (!modelsLoaded) return;

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setVideoStarted(true);
          };
        }
      } catch (err) {
        toast.error("Failed to access webcam!");
      }
    };

    startVideo();
  }, [modelsLoaded]);

  useEffect(() => {
    if (!videoStarted) return;

    const monitorFaces = () => {
      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 320,
        scoreThreshold: 0.2,
      });

      intervalRef.current = setInterval(async () => {
        if (!videoRef.current) return;
        if (videoRef.current.readyState !== 4) {
          return;
        }

        // Perform detection
        const detections = await faceapi
          .detectAllFaces(videoRef.current, options)
          .withFaceLandmarks(true);

        const faceCount = detections.length;
        const now = Date.now();

        if (faceCount === 0) {
          if (issueRef.current.type !== "none") {
            toast.warn("No face detected!", { autoClose: 3000 });
            issueRef.current = {
              type: "none",
              startTime: now,
              lastWarnedTime: now,
            };
          } 
          else {
            if (
              issueRef.current.startTime &&
              now - issueRef.current.lastWarnedTime! >= 10000
            ) {
              toast.warn("No face detected for longer period!");
              issueRef.current.lastWarnedTime = now;
            }
          }
        } else if (faceCount > 1) {
          if (issueRef.current.type !== "multiple") {
            toast.error("Multiple faces detected!", { autoClose: 3000 });
            issueRef.current = {
              type: "multiple",
              startTime: now,
              lastWarnedTime: now,
            };
          } else {
            if (
              issueRef.current.startTime &&
              now - issueRef.current.lastWarnedTime! >= 10000
            ) {
              toast.error("Multiple faces detected for longer period!");
              issueRef.current.lastWarnedTime = now;
            }
          }
        } else {
          if (issueRef.current.type !== null) {
            console.log("Face detection back to normal");
            issueRef.current = {
              type: null,
              startTime: null,
              lastWarnedTime: null,
            };
          }
        }
      }, 2000);
    };

    monitorFaces();

    return () => {
      if (streamRef.current) {
        console.log("Stopping video stream");
        streamRef.current.getTracks().forEach((track) => track.stop());
      } else {
        console.log("No video stream found to clean up.");
      }
    };
  }, [videoStarted]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      hidden
      style={{
        position: "fixed",
        top: 150,
        right: 100,
        width: 350,
        height: 300,
        borderRadius: 10,
        zIndex: 9999,
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
        background: "#333",
      }}
    />
  );
};

export default FaceMonitor;
