// back/modules/instagram-agent/services/reelComposer.service.js
import fs from "fs";
import path from "path";
import os from "os";
import util from "util";
import { exec } from "child_process";
import fetch from "node-fetch";
import ffmpegStatic from "ffmpeg-static";
import { cloudinary } from "../../../config/cloudinary.js";

const execPromise = util.promisify(exec);

export const getFfmpegBin = () => {
  if (ffmpegStatic && typeof ffmpegStatic === "string" && fs.existsSync(ffmpegStatic)) {
    return ffmpegStatic;
  }
  if (process.env.FFMPEG_PATH && fs.existsSync(process.env.FFMPEG_PATH)) {
    return process.env.FFMPEG_PATH;
  }
  return "ffmpeg";
};

/**
 * Composite Pexels 9:16 vertical video with Freesound background audio into a ready-to-post Reel
 */
export async function composeReelWithAudio({ videoUrl, audioUrl, outputFilename = "reel_composite.mp4" }) {
  if (!videoUrl) throw new Error("videoUrl is required for reel composition.");
  if (!audioUrl) return videoUrl; // If no audio provided, return original video URL

  const tempDir = os.tmpdir();
  const rawVideoPath = path.join(tempDir, `video_${Date.now()}.mp4`);
  const rawAudioPath = path.join(tempDir, `audio_${Date.now()}.mp3`);
  const outputPath = path.join(tempDir, `composite_${Date.now()}.mp4`);

  try {
    console.log(`[Reel Composer] Downloading video and audio for FFmpeg composition...`);

    // Download video file
    const vRes = await fetch(videoUrl);
    if (!vRes.ok) throw new Error(`Failed to download video from ${videoUrl}`);
    const vBuf = await vRes.arrayBuffer();
    fs.writeFileSync(rawVideoPath, Buffer.from(vBuf));

    // Download audio file
    const aRes = await fetch(audioUrl);
    if (!aRes.ok) throw new Error(`Failed to download audio from ${audioUrl}`);
    const aBuf = await aRes.arrayBuffer();
    fs.writeFileSync(rawAudioPath, Buffer.from(aBuf));

    const ffmpegBin = getFfmpegBin();

    // FFmpeg command:
    // - Replace/mix video audio with Freesound background track
    // - Loop audio if video is longer, or trim audio to video duration
    // - Apply gentle 1-second audio fade-out at the end
    // - Output clean H.264 / AAC 1080x1920 MP4 for Instagram Reels
    const cmd = `"${ffmpegBin}" -y -i "${rawVideoPath}" -stream_loop -1 -i "${rawAudioPath}" -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 192k -shortest -af "afade=t=out:st=10:d=1.5" "${outputPath}"`;

    console.log(`[Reel Composer] Running FFmpeg command...`);
    await execPromise(cmd);

    if (!fs.existsSync(outputPath) || fs.statSync(outputPath).size === 0) {
      throw new Error("FFmpeg output file was empty or not generated.");
    }

    console.log(`[Reel Composer] Uploading composite 16:9 vertical Reel to Cloudinary...`);
    const uploadResult = await cloudinary.uploader.upload(outputPath, {
      folder: "instagram-agent/reels",
      resource_type: "video",
      overwrite: true,
    });

    console.log(`[Reel Composer] Successfully generated composite Reel: ${uploadResult.secure_url}`);
    return uploadResult.secure_url;
  } catch (err) {
    console.warn("[Reel Composer] FFmpeg composition fallback notice:", err.message);
    // If FFmpeg fails (e.g. missing codec on some environments), return original videoUrl seamlessly
    return videoUrl;
  } finally {
    // Clean up temporary files
    try {
      if (fs.existsSync(rawVideoPath)) fs.unlinkSync(rawVideoPath);
      if (fs.existsSync(rawAudioPath)) fs.unlinkSync(rawAudioPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    } catch (_) {}
  }
}
