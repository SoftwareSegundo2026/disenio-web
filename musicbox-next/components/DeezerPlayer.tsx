"use client";

import { useState } from "react";
import { searchDeezerTrack, type DeezerTrackResult } from "@/lib/deezer";
import { t } from "@/lib/i18n";

interface DeezerPlayerProps {
  trackName: string;
  artistName?: string | null;
}

export default function DeezerPlayer({ trackName, artistName }: DeezerPlayerProps) {
  const [track, setTrack] = useState<DeezerTrackResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handlePlay = async () => {
    if (loading) return;
    setLoading(true);
    setError(false);

    try {
      const result = await searchDeezerTrack(trackName, artistName);
      if (result) {
        setTrack(result);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (track) {
    return (
      <div>
        <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
          <iframe
            src={`https://widget.deezer.com/widget/auto/track/${track.id}`}
            className="absolute inset-0 w-full h-full rounded-lg"
            frameBorder={0}
            allow="encrypted-media; clipboard-write"
            title={`Deezer player - ${track.title}`}
          />
        </div>
        <button
          onClick={() => setTrack(null)}
          className="mt-2 text-xs text-on-surface-variant hover:text-on-surface cursor-pointer underline"
        >
          {t("track.close_player")}
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handlePlay}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-primary-container hover:bg-primary-container/90 disabled:opacity-50 text-on-primary font-bold rounded-lg cursor-pointer transition-all active:scale-95"
      >
        <span className="material-symbols-outlined text-lg">
          {loading ? "hourglass_top" : "play_arrow"}
        </span>
        {loading ? t("track.searching") : t("track.play_deezer")}
      </button>
      {error && (
        <p className="text-xs text-error-vibrant mt-2">
          {t("track.not_found")}
        </p>
      )}
    </div>
  );
}
