"use client"

import { useEffect, useRef, useState } from "react"
import {
  FaceDetector,
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision"

/**
 * Extracted from the Svelte KYC MediaPipe selfie flow and rewritten as a
 * standalone React component.
 *
 * Usage:
 * <MediapipeKycSelfie
 *   onConfirm={async ({ file, url }) => {
 *     console.log(file, url)
 *   }}
 * />
 *
 * Note:
 * This file is intentionally kept outside the current React app build so it
 * does not require any package installation or manifest changes in this repo.
 */

const MEDIAPIPE_WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
const FACE_DETECTOR_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite"
const FACE_LANDMARKER_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"

type CameraErrorName =
  | "CameraError"
  | "PermissionDeniedError"
  | "DeviceNotFoundError"
  | "FaceNotFoundError"
  | "FrameworkError"

type HeadTurn = "LEFT" | "RIGHT" | "CENTER" | null

type Rect = {
  width: number
  height: number
}

export type KycSelfieCapture = {
  file: File
  image: HTMLImageElement
  url: string
}

export type MediapipeKycSelfieProps = {
  className?: string
  onClose?: () => void
  onConfirm?: (capture: KycSelfieCapture) => Promise<void> | void
}

type CameraError = {
  name: CameraErrorName
  message: string
}

let visionPromise: Promise<Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>>> | null =
  null
let faceDetectorPromise: Promise<FaceDetector> | null = null
let faceLandmarkerPromise: Promise<FaceLandmarker> | null = null
let currentRunningMode: "IMAGE" | "VIDEO" = "IMAGE"

type StreamRef = {
  current: MediaStream | null
}

type CaptureRef = {
  current: KycSelfieCapture | null
}

async function getVision() {
  if (!visionPromise) {
    visionPromise = FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL).catch(
      (error) => {
        visionPromise = null
        throw error
      }
    )
  }

  return visionPromise
}

async function getFaceDetector() {
  if (!faceDetectorPromise) {
    faceDetectorPromise = (async () => {
      try {
        const vision = await getVision()

        currentRunningMode = "IMAGE"

        return await FaceDetector.createFromOptions(vision, {
          runningMode: "IMAGE",
          minDetectionConfidence: 0.5,
          baseOptions: {
            delegate: "GPU",
            modelAssetPath: FACE_DETECTOR_MODEL_URL,
          },
        })
      } catch (error) {
        faceDetectorPromise = null
        throw error
      })
    })()
  }

  return faceDetectorPromise
}

async function getFaceLandmarker() {
  if (!faceLandmarkerPromise) {
    faceLandmarkerPromise = (async () => {
      try {
        const vision = await getVision()

        return await FaceLandmarker.createFromOptions(vision, {
          runningMode: "VIDEO",
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: true,
          numFaces: 1,
          baseOptions: {
            delegate: "GPU",
            modelAssetPath: FACE_LANDMARKER_MODEL_URL,
          },
        })
      } catch (error) {
        faceLandmarkerPromise = null
        throw error
      })
    })()
  }

  return faceLandmarkerPromise
}

async function ensureDetectorRunningMode(mode: "IMAGE" | "VIDEO") {
  const detector = await getFaceDetector()

  if (currentRunningMode !== mode) {
    await detector.setOptions({ runningMode: mode })
    currentRunningMode = mode
  }

  return detector
}

async function validateFaceFromImage(image: HTMLImageElement) {
  try {
    const detector = await ensureDetectorRunningMode("IMAGE")
    const result = detector.detect(image)

    return result.detections.length > 0
  } catch (error) {
    console.error(error)
    return false
  }
}

async function validateFaceFromVideo(
  video: HTMLVideoElement,
  guide: HTMLElement
) {
  if (video.readyState < 2) {
    return false
  }

  try {
    const detector = await ensureDetectorRunningMode("VIDEO")
    const result = detector.detectForVideo(video, performance.now())
    const detection = result.detections[0]

    if (!detection?.boundingBox) {
      return false
    }

    const videoRect = video.getBoundingClientRect()
    const guideRect = guide.getBoundingClientRect()

    const faceLeft =
      videoRect.left +
      (detection.boundingBox.originX / video.videoWidth) * videoRect.width
    const faceTop =
      videoRect.top +
      (detection.boundingBox.originY / video.videoHeight) * videoRect.height
    const faceRight =
      faceLeft +
      (detection.boundingBox.width / video.videoWidth) * videoRect.width
    const faceBottom =
      faceTop +
      (detection.boundingBox.height / video.videoHeight) * videoRect.height

    return (
      faceLeft >= guideRect.left &&
      faceTop >= guideRect.top &&
      faceRight <= guideRect.right &&
      faceBottom <= guideRect.bottom
    )
  } catch (error) {
    console.error(error)
    return false
  }
}

async function detectHeadTurn(video: HTMLVideoElement): Promise<HeadTurn> {
  if (video.readyState < 2) {
    return null
  }

  const landmarker = await getFaceLandmarker()
  const result = landmarker.detectForVideo(video, performance.now())
  const matrix = result.facialTransformationMatrixes?.[0]?.data

  if (!result.faceLandmarks.length || !matrix) {
    return null
  }

  const yaw = Math.atan2(matrix[8], matrix[10]) * (180 / Math.PI)

  if (yaw > 15) {
    return "RIGHT"
  }

  if (yaw < -15) {
    return "LEFT"
  }

  return "CENTER"
}

export default function MediapipeKycSelfie({
  className,
  onClose,
  onConfirm,
}: MediapipeKycSelfieProps) {
  const [started, setStarted] = useState(false)
  const [frameworkReady, setFrameworkReady] = useState(false)
  const [frameworkError, setFrameworkError] = useState<string | null>(null)
  const [loadingCamera, setLoadingCamera] = useState(false)
  const [snapping, setSnapping] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [cameraError, setCameraError] = useState<CameraError | null>(null)
  const [capture, setCapture] = useState<KycSelfieCapture | null>(null)
  const [pendingOpen, setPendingOpen] = useState(false)
  const [faceDetected, setFaceDetected] = useState(false)
  const [livenessRightDetected, setLivenessRightDetected] = useState(false)
  const [livenessLeftDetected, setLivenessLeftDetected] = useState(false)
  const [wrapperElement, setWrapperElement] = useState<HTMLDivElement | null>(
    null
  )
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null)
  const [guideElement, setGuideElement] = useState<HTMLDivElement | null>(null)

  const wrapperRect = useElementRect(wrapperElement)
  const videoRect = useElementRect(videoElement)

  const streamRef = useRef<MediaStream | null>(null)
  const mountedRef = useRef(true)
  const captureRef = useRef<KycSelfieCapture | null>(null)
  const faceValidationBusyRef = useRef(false)
  const livenessBusyRef = useRef(false)

  const guideSize = Math.max(Math.min(videoRect.width, videoRect.height) - 32, 0)
  const guideOffsetX = Math.max((wrapperRect.width - guideSize) / 2, 0)
  const guideOffsetY = Math.max((wrapperRect.height - guideSize) / 2, 0)
  const showGuide = livenessRightDetected && livenessLeftDetected

  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
      void stopStream(streamRef)

      if (captureRef.current?.url) {
        URL.revokeObjectURL(captureRef.current.url)
      }
    }
  }, [])

  useEffect(() => {
    let active = true

    void Promise.all([getFaceDetector(), getFaceLandmarker()])
      .then(() => {
        if (!active || !mountedRef.current) {
          return
        }

        setFrameworkReady(true)
        setFrameworkError(null)
      })
      .catch((error) => {
        console.error("Failed to load MediaPipe models", error)

        if (!active || !mountedRef.current) {
          return
        }

        setFrameworkReady(false)
        setFrameworkError(
          error instanceof Error
            ? error.message
            : "Failed to load the selfie verification models."
        )
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!started || !frameworkReady || !videoElement || capture) {
      return
    }

    if (livenessRightDetected && livenessLeftDetected) {
      return
    }

    const interval = window.setInterval(() => {
      if (!videoElement || livenessBusyRef.current) {
        return
      }

      livenessBusyRef.current = true

      void detectHeadTurn(videoElement)
        .then((turn) => {
          if (!mountedRef.current) {
            return
          }

          if (!livenessRightDetected) {
            setLivenessRightDetected(turn === "RIGHT")
            return
          }

          if (!livenessLeftDetected) {
            setLivenessLeftDetected(turn === "LEFT")
          }
        })
        .finally(() => {
          livenessBusyRef.current = false
        })
    }, 1000)

    return () => {
      window.clearInterval(interval)
    }
  }, [
    capture,
    frameworkReady,
    livenessLeftDetected,
    livenessRightDetected,
    started,
    videoElement,
  ])

  useEffect(() => {
    if (
      !started ||
      !frameworkReady ||
      !videoElement ||
      !guideElement ||
      !showGuide ||
      capture
    ) {
      setFaceDetected(false)
      return
    }

    const interval = window.setInterval(() => {
      if (!videoElement || !guideElement || faceValidationBusyRef.current) {
        return
      }

      faceValidationBusyRef.current = true

      void validateFaceFromVideo(videoElement, guideElement)
        .then((isInsideGuide) => {
          if (!mountedRef.current) {
            return
          }

          setFaceDetected(isInsideGuide)
        })
        .finally(() => {
          faceValidationBusyRef.current = false
        })
    }, 1000)

    return () => {
      window.clearInterval(interval)
    }
  }, [capture, frameworkReady, guideElement, showGuide, started, videoElement])

  useEffect(() => {
    if (!started || !pendingOpen || !videoElement) {
      return
    }

    setPendingOpen(false)
    void openCamera()
  }, [pendingOpen, started, videoElement])

  async function openCamera() {
    await stopStream(streamRef)

    replaceCapture(null, captureRef, setCapture)
    setCameraError(null)
    setFaceDetected(false)
    setLivenessRightDetected(false)
    setLivenessLeftDetected(false)
    setLoadingCamera(true)

    if (!videoElement) {
      setLoadingCamera(false)
      setCameraError({
        name: "CameraError",
        message: "The video element is not ready yet.",
      })

      return
    }

    try {
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
          width: { ideal: 9999 },
          height: { ideal: 9999 },
          aspectRatio: isDesktop ? 16 / 9 : 4 / 3,
          frameRate: { ideal: 90, max: 120 },
        },
      })

      streamRef.current = stream
      videoElement.srcObject = stream
      await videoElement.play()
    } catch (error) {
      setCameraError(mapCameraError(error))
    } finally {
      if (mountedRef.current) {
        setLoadingCamera(false)
      }
    }
  }

  async function closeSession() {
    await stopStream(streamRef)

    replaceCapture(null, captureRef, setCapture)
    setStarted(false)
    setCameraError(null)
    setFaceDetected(false)
    setLivenessRightDetected(false)
    setLivenessLeftDetected(false)
    setSnapping(false)
    setConfirming(false)
    onClose?.()
  }

  async function retakePhoto() {
    replaceCapture(null, captureRef, setCapture)
    setCameraError(null)
    setFaceDetected(false)
    setLivenessRightDetected(false)
    setLivenessLeftDetected(false)
    setSnapping(false)
    await openCamera()
  }

  async function capturePhoto() {
    if (!videoElement || videoElement.readyState < 2) {
      setCameraError({
        name: "CameraError",
        message: "The camera is not ready. Please try again.",
      })
      return
    }

    if (!guideElement) {
      setCameraError({
        name: "CameraError",
        message: "The selfie guide is not available yet.",
      })
      return
    }

    setSnapping(true)
    setCameraError(null)

    let frame: KycSelfieCapture | null = null

    try {
      frame = await captureFrame(videoElement)
      const hasFace = await validateFaceFromImage(frame.image)

      if (!hasFace) {
        throw createCameraError(
          "FaceNotFoundError",
          "No face was detected in the image. Please try again."
        )
      }

      const cropped = await cropToGuide(frame.image, videoElement, guideElement)
      replaceCapture(cropped, captureRef, setCapture)
      await stopStream(streamRef)
    } catch (error) {
      setCameraError(normalizeCameraError(error))
    } finally {
      if (frame?.url) {
        URL.revokeObjectURL(frame.url)
      }

      if (mountedRef.current) {
        setSnapping(false)
      }
    }
  }

  async function confirmPhoto() {
    if (!capture || !onConfirm) {
      return
    }

    setConfirming(true)
    setCameraError(null)

    try {
      await onConfirm(capture)
    } catch (error) {
      setCameraError(normalizeCameraError(error))
    } finally {
      if (mountedRef.current) {
        setConfirming(false)
      }
    }
  }

  return (
    <div className={`kyc-selfie-card ${className ?? ""}`.trim()}>
      <button
        type="button"
        className="kyc-close-button"
        onClick={() => {
          void closeSession()
        }}
      >
        x
      </button>

      {!started ? (
        <section className="kyc-section">
          <h2 className="kyc-title">Take a selfie</h2>
          <p className="kyc-copy">
            Verify you are a real person by taking a quick selfie.
          </p>

          <div className="kyc-warning">
            <div>
              <h3 className="kyc-subtitle">Photosensitivity warning</h3>
              <p className="kyc-copy kyc-copy-sm">
                This selfie check may show brief colored lights. Proceed with
                caution if you are photosensitive.
              </p>
            </div>
          </div>

          <h3 className="kyc-subtitle kyc-subtitle-top">
            How to take your selfie
          </h3>

          <ol className="kyc-steps">
            <li>When the guide appears, position your face inside it.</li>
            <li>Make sure your screen brightness is high.</li>
            <li>Remove hats, sunglasses, or masks.</li>
            <li>Stay in a well-lit area, away from direct sunlight.</li>
            <li>Hold your device steady and look straight at the camera.</li>
          </ol>

          {frameworkError ? (
            <div className="kyc-error-banner">
              <strong>MediaPipe failed to load.</strong>
              <span>{frameworkError}</span>
            </div>
          ) : !frameworkReady ? (
            <p className="kyc-copy kyc-copy-sm">Preparing face checks...</p>
          ) : null}

          <div className="kyc-actions">
            <button
              type="button"
              className="kyc-button"
              disabled={Boolean(frameworkError)}
              onClick={() => {
                setStarted(true)
                setPendingOpen(true)
              }}
            >
              Open camera
            </button>
          </div>
        </section>
      ) : cameraError ? (
        <section className="kyc-section">
          <h2 className="kyc-title">{cameraError.name}</h2>
          <p className="kyc-copy">{cameraError.message}</p>

          <div className="kyc-actions">
            <button
              type="button"
              className="kyc-button"
              disabled={loadingCamera}
              onClick={() => {
                void openCamera()
              }}
            >
              Retry
            </button>
            <button
              type="button"
              className="kyc-button kyc-button-secondary"
              disabled={loadingCamera}
              onClick={() => {
                void closeSession()
              }}
            >
              Close
            </button>
          </div>
        </section>
      ) : capture ? (
        <section className="kyc-section">
          <h2 className="kyc-title">Selfie captured successfully</h2>
          <p className="kyc-copy">
            Your selfie was captured and verified. Review it before continuing.
          </p>

          <div className="kyc-preview-frame">
            <img
              src={capture.url}
              alt="Captured KYC selfie preview"
              className="kyc-preview-image"
            />
          </div>

          <div className="kyc-actions">
            <button
              type="button"
              className="kyc-button kyc-button-secondary"
              disabled={confirming}
              onClick={() => {
                void retakePhoto()
              }}
            >
              Retake photo
            </button>
            {onConfirm ? (
              <button
                type="button"
                className="kyc-button"
                disabled={confirming}
                onClick={() => {
                  void confirmPhoto()
                }}
              >
                {confirming ? "Using photo..." : "Use photo"}
              </button>
            ) : null}
          </div>
        </section>
      ) : (
        <section className="kyc-section">
          <h2 className="kyc-title">Take a selfie</h2>
          <p className="kyc-copy">
            Make sure your face is clearly visible, with no glare or blur.
          </p>

          {loadingCamera ? (
            <div className="kyc-loading-panel">
              <div className="kyc-spinner" />
              <span>Loading camera...</span>
            </div>
          ) : null}

          <div
            ref={setWrapperElement}
            className="kyc-camera-wrapper"
            style={{ display: loadingCamera ? "none" : "block" }}
          >
            <video
              ref={setVideoElement}
              className="kyc-video"
              autoPlay
              muted
              playsInline
              preload="none"
            />

            {showGuide ? (
              <>
                <div
                  ref={setGuideElement}
                  className={`kyc-guide ${faceDetected ? "kyc-guide-ok" : ""}`}
                  style={{
                    width: `${guideSize}px`,
                    height: `${guideSize}px`,
                  }}
                />
                <div
                  className="kyc-mask kyc-mask-top"
                  style={{ height: `${guideOffsetY}px` }}
                />
                <div
                  className="kyc-mask kyc-mask-bottom"
                  style={{ height: `${guideOffsetY}px` }}
                />
                <div
                  className="kyc-mask kyc-mask-left"
                  style={{
                    top: `${guideOffsetY}px`,
                    bottom: `${guideOffsetY}px`,
                    width: `${guideOffsetX}px`,
                  }}
                />
                <div
                  className="kyc-mask kyc-mask-right"
                  style={{
                    top: `${guideOffsetY}px`,
                    bottom: `${guideOffsetY}px`,
                    width: `${guideOffsetX}px`,
                  }}
                />
              </>
            ) : null}

            {!showGuide ? (
              <div className="kyc-liveness-guide">
                {!livenessRightDetected ? (
                  <>
                    <span className="kyc-arrow">-&gt;</span>
                    <span>Turn right</span>
                  </>
                ) : !livenessLeftDetected ? (
                  <>
                    <span className="kyc-arrow">&lt;-</span>
                    <span>Turn left</span>
                  </>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="kyc-status-row">
            <span className={livenessRightDetected ? "kyc-status-ok" : ""}>
              Right turn {livenessRightDetected ? "done" : "pending"}
            </span>
            <span className={livenessLeftDetected ? "kyc-status-ok" : ""}>
              Left turn {livenessLeftDetected ? "done" : "pending"}
            </span>
            <span className={faceDetected ? "kyc-status-ok" : ""}>
              Face in guide {faceDetected ? "done" : "pending"}
            </span>
          </div>

          <div className="kyc-actions">
            <button
              type="button"
              className="kyc-button"
              disabled={
                loadingCamera ||
                snapping ||
                !faceDetected ||
                !livenessRightDetected ||
                !livenessLeftDetected
              }
              onClick={() => {
                void capturePhoto()
              }}
            >
              {snapping ? "Capturing..." : "Capture"}
            </button>
          </div>
        </section>
      )}

      <style>{`
        .kyc-selfie-card {
          position: relative;
          margin: 0 auto;
          max-width: 780px;
          border: 1px solid #fde272;
          border-radius: 20px;
          background: #fef7c3;
          padding: 24px;
          color: #713b12;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
        }

        .kyc-close-button {
          position: absolute;
          top: 14px;
          right: 14px;
          border: 0;
          background: transparent;
          color: #eaaa08;
          font-size: 18px;
          cursor: pointer;
        }

        .kyc-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .kyc-title {
          margin: 0;
          text-align: center;
          font-size: 24px;
          font-weight: 700;
        }

        .kyc-subtitle {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
        }

        .kyc-subtitle-top {
          margin-top: 8px;
          text-align: center;
        }

        .kyc-copy {
          margin: 0;
          text-align: center;
          color: #a15c07;
          line-height: 1.5;
        }

        .kyc-copy-sm {
          font-size: 14px;
        }

        .kyc-warning,
        .kyc-error-banner {
          display: flex;
          flex-direction: column;
          gap: 8px;
          border: 1px solid #fde272;
          border-radius: 16px;
          background: #fefbe8;
          padding: 16px;
        }

        .kyc-error-banner {
          background: #fef2f2;
          border-color: #fecaca;
          color: #991b1b;
        }

        .kyc-steps {
          margin: 0;
          padding-left: 20px;
          color: #a15c07;
          line-height: 1.6;
        }

        .kyc-camera-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: 18px;
          background: #fefbe8;
          min-height: 260px;
        }

        .kyc-video {
          display: block;
          width: 100%;
          height: auto;
          background: transparent;
        }

        .kyc-guide {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 3;
          transform: translate(-50%, -50%);
          border: 3px dashed #fde272;
          box-sizing: border-box;
        }

        .kyc-guide-ok {
          border-color: #12b76a;
        }

        .kyc-mask {
          position: absolute;
          z-index: 2;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
        }

        .kyc-mask-top {
          top: 0;
          left: 0;
          right: 0;
        }

        .kyc-mask-bottom {
          left: 0;
          right: 0;
          bottom: 0;
        }

        .kyc-mask-left {
          left: 0;
        }

        .kyc-mask-right {
          right: 0;
        }

        .kyc-liveness-guide {
          position: absolute;
          inset: 0;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #e8fff1;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .kyc-liveness-guide span {
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(17, 87, 55, 0.72);
        }

        .kyc-arrow {
          color: #079455;
          animation: kyc-sway 1.1s ease-in-out infinite;
        }

        .kyc-status-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          color: #a15c07;
          font-size: 14px;
        }

        .kyc-status-ok {
          color: #079455;
          font-weight: 700;
        }

        .kyc-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
        }

        .kyc-button {
          border: 0;
          border-radius: 999px;
          background: #ca8504;
          color: white;
          padding: 12px 18px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .kyc-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .kyc-button-secondary {
          background: transparent;
          color: #a15c07;
          border: 1px solid #eaaa08;
        }

        .kyc-loading-panel {
          display: flex;
          min-height: 260px;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 12px;
          color: #a15c07;
        }

        .kyc-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(202, 133, 4, 0.25);
          border-top-color: #ca8504;
          border-radius: 999px;
          animation: kyc-spin 1s linear infinite;
        }

        .kyc-preview-frame {
          display: flex;
          justify-content: center;
          overflow: hidden;
          border-radius: 18px;
          background: #fefbe8;
          min-height: 260px;
        }

        .kyc-preview-image {
          display: block;
          max-width: 100%;
          width: auto;
          object-fit: cover;
        }

        @keyframes kyc-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes kyc-sway {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(8px);
          }
        }

        @media (max-width: 640px) {
          .kyc-selfie-card {
            padding: 20px 16px;
          }

          .kyc-title {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  )
}

function useElementRect(element: HTMLElement | null): Rect {
  const [rect, setRect] = useState<Rect>({ width: 0, height: 0 })

  useEffect(() => {
    if (!element) {
      setRect({ width: 0, height: 0 })
      return
    }

    const update = () => {
      const next = element.getBoundingClientRect()
      setRect({
        width: next.width,
        height: next.height,
      })
    }

    update()

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update)

      return () => {
        window.removeEventListener("resize", update)
      }
    }

    const observer = new ResizeObserver(update)
    observer.observe(element)
    window.addEventListener("resize", update)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [element])

  return rect
}

async function captureFrame(video: HTMLVideoElement) {
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d", { willReadFrequently: true })

  if (!context) {
    throw createCameraError(
      "CameraError",
      "Failed to access the camera frame. Please try again."
    )
  }

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  context.drawImage(video, 0, 0, canvas.width, canvas.height)

  return canvasToCapture(canvas, `selfie-${Date.now()}.jpeg`, 0.9)
}

async function cropToGuide(
  image: HTMLImageElement,
  video: HTMLVideoElement,
  guide: HTMLElement
) {
  const guideRect = guide.getBoundingClientRect()
  const videoRect = video.getBoundingClientRect()
  const scaleX = image.width / videoRect.width
  const scaleY = image.height / videoRect.height

  const cropTop = clamp((guideRect.top - videoRect.top) * scaleY, 0, image.height)
  const cropLeft = clamp((guideRect.left - videoRect.left) * scaleX, 0, image.width)
  const cropWidth = clamp(
    guideRect.width * scaleX,
    1,
    image.width - cropLeft
  )
  const cropHeight = clamp(
    guideRect.height * scaleY,
    1,
    image.height - cropTop
  )

  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")

  if (!context) {
    throw createCameraError(
      "CameraError",
      "Failed to prepare the cropped selfie image."
    )
  }

  canvas.width = 1200
  canvas.height = 1200
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = "high"
  context.filter = "brightness(1.05)"

  context.drawImage(
    image,
    cropLeft,
    cropTop,
    cropWidth,
    cropHeight,
    0,
    0,
    canvas.width,
    canvas.height
  )

  return canvasToCapture(canvas, `selfie-crop-${Date.now()}.jpeg`, 1)
}

function canvasToCapture(
  canvas: HTMLCanvasElement,
  fileName: string,
  quality: number
) {
  return new Promise<KycSelfieCapture>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(
            createCameraError(
              "CameraError",
              "Failed to generate the captured image."
            )
          )
          return
        }

        const file = new File([blob], fileName, {
          type: "image/jpeg",
          lastModified: Date.now(),
        })
        const url = URL.createObjectURL(file)
        const image = new Image()

        image.src = url
        image.width = canvas.width
        image.height = canvas.height
        image.onerror = () => {
          URL.revokeObjectURL(url)
          reject(
            createCameraError(
              "CameraError",
              "Failed to load the captured image preview."
            )
          )
        }
        image.onload = () => {
          resolve({
            file,
            image,
            url,
          })
        }
      },
      "image/jpeg",
      quality
    )
  })
}

async function stopStream(streamRef: StreamRef) {
  if (!streamRef.current) {
    return
  }

  for (const track of streamRef.current.getTracks()) {
    track.stop()
  }

  streamRef.current = null
}

function mapCameraError(error: unknown): CameraError {
  if (error instanceof Error) {
    if (error.name === "NotAllowedError") {
      return createCameraError(
        "PermissionDeniedError",
        "You need to allow camera access to use this feature."
      )
    }

    if (error.name === "NotFoundError") {
      return createCameraError(
        "DeviceNotFoundError",
        "No camera was found on this device."
      )
    }
  }

  return createCameraError(
    "CameraError",
    "Failed to open the camera. Check your device settings and try again."
  )
}

function normalizeCameraError(error: unknown): CameraError {
  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    "message" in error &&
    typeof error.name === "string" &&
    typeof error.message === "string"
  ) {
    return {
      name: error.name as CameraErrorName,
      message: error.message,
    }
  }

  if (error instanceof Error) {
    return createCameraError(
      "CameraError",
      error.message || "Something went wrong. Please try again."
    )
  }

  return createCameraError("CameraError", "Something went wrong. Please try again.")
}

function createCameraError(name: CameraErrorName, message: string): CameraError {
  return { name, message }
}

function replaceCapture(
  next: KycSelfieCapture | null,
  captureRef: CaptureRef,
  setCapture: (value: KycSelfieCapture | null) => void
) {
  const previousUrl = captureRef.current?.url

  if (previousUrl && previousUrl !== next?.url) {
    URL.revokeObjectURL(previousUrl)
  }

  captureRef.current = next
  setCapture(next)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
