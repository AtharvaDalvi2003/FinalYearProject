import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { useNavigate } from "react-router-dom";

export default function FaceAttendance() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const intervalRef = useRef(null);
  const captureTimeoutRef = useRef(null);
  const capturedRef = useRef(false);

  const navigate = useNavigate();
  const [message, setMessage] = useState("Loading models...");

  // 🔹 Load models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      startVideo();
    };

    loadModels();
    return cleanup;
  }, []);

  // 🔹 Start camera
  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  };

  const stopVideo = () => {
    const stream = videoRef.current?.srcObject;
    stream?.getTracks().forEach((t) => t.stop());
  };

  // 🔥 PERFECT HEAD → SHOULDER CAPTURE (FIXED)
  const captureFace = async (faceDetection) => {
    if (capturedRef.current) return;
    capturedRef.current = true;

    try {
      const video = videoRef.current;
      const { x, y, width, height } = faceDetection.box;

      // 🎯 Expansion logic
      const expandX = width * 0.4;      // sides
      const expandTop = height * 0.35;  // hair
      const expandBottom = height * 1.4; // shoulders

      const cropX = Math.max(0, x - expandX);
      const cropY = Math.max(0, y - expandTop);

      const desiredWidth = width + expandX * 2;
      const desiredHeight = height + expandTop + expandBottom;

      const cropWidth = Math.min(
        video.videoWidth - cropX,
        desiredWidth
      );

      const cropHeight = Math.min(
        video.videoHeight - cropY,
        desiredHeight
      );

      const canvas = document.createElement("canvas");
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        video,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.95)
      );

      const formData = new FormData();
      formData.append("images", blob);

      const res = await fetch(
        "http://localhost:5000/api/student/upload-face",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      setMessage("✅ Attendance captured");

    } catch (err) {
      console.error("Capture error:", err);
    } finally {
      cleanup();
      setTimeout(() => navigate("/student/dashboard"), 1200);
    }
  };

  // 🔄 Detection loop
  const detectLoop = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || video.videoWidth === 0) return;
    if (capturedRef.current) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();

    if (!detections.length) {
      setMessage("❌ No face detected");
      return;
    }

    const resized = faceapi.resizeResults(detections, {
      width: video.videoWidth,
      height: video.videoHeight,
    });

    faceapi.draw.drawDetections(canvas, resized);
    faceapi.draw.drawFaceLandmarks(canvas, resized);

    setMessage("⏳ Hold still… Capturing in 5 seconds");

    if (!captureTimeoutRef.current) {
      captureTimeoutRef.current = setTimeout(() => {
        captureFace(detections[0].detection);
      }, 5000);
    }
  };

  const onPlay = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(detectLoop, 150);
    }
  };

  const cleanup = () => {
    clearInterval(intervalRef.current);
    clearTimeout(captureTimeoutRef.current);
    intervalRef.current = null;
    captureTimeoutRef.current = null;
    stopVideo();
  };

  return (
    <div style={{ textAlign: "center", background: "black", height: "100vh" }}>
      <h2 style={{ color: "#00c2ff" }}>Live Face Detection</h2>
      <p style={{ color: "white" }}>{message}</p>

      <div style={{ position: "relative", display: "inline-block" }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onPlay={onPlay}
          style={{ transform: "scaleX(-1)", borderRadius: "12px" }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: "scaleX(-1)",
          }}
        />
      </div>
    </div>
  );
}
