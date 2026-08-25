// src/hooks/useTrackView.ts
import { useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";

export function useTrackView(
  storyId?: string,
  viewType: "view" | "read" = "view",
) {
  const { user } = useAuth();
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!storyId || hasTracked.current) return;

    const trackView = async () => {
      try {
        // Generate a session ID if not exists
        let sessionId = sessionStorage.getItem("kisa_session_id");
        if (!sessionId) {
          sessionId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          sessionStorage.setItem("kisa_session_id", sessionId);
        }

        // Get device info
        const userAgent = navigator.userAgent;
        const deviceType = getDeviceType(userAgent);

        // Get IP from a service (optional - can skip if not needed)
        let ipAddress = null;
        try {
          const ipRes = await fetch("https://api.ipify.org?format=json");
          const ipData = await ipRes.json();
          ipAddress = ipData.ip;
        } catch (e) {
          console.log("Could not get IP address, continuing without it");
        }

        // Check if already tracked in this session
        const viewKey = `${viewType}_${storyId}`;
        if (sessionStorage.getItem(viewKey)) {
          console.log(`📊 ${viewType} already tracked this session`);
          hasTracked.current = true;
          return;
        }

        // Call the tracking function
        const { data, error } = await supabase.rpc("track_story_view", {
          p_story_id: storyId,
          p_user_id: user?.id || null,
          p_session_id: sessionId,
          p_ip_address: ipAddress,
          p_user_agent: userAgent,
          p_device_type: deviceType,
          p_view_type: viewType,
        });

        if (error) {
          console.error("Error tracking view:", error);
          return;
        }

        // Mark as tracked
        sessionStorage.setItem(viewKey, "true");
        hasTracked.current = true;
        console.log(`📊 ${viewType} tracked successfully, total: ${data}`);

        return data;
      } catch (err) {
        console.error("Error tracking view:", err);
      }
    };

    // Small delay to ensure story is fully loaded
    const timer = setTimeout(trackView, 500);
    return () => clearTimeout(timer);
  }, [storyId, user, viewType]);
}

// Helper to detect device type
function getDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase();

  if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua)) {
    return "mobile";
  }
  if (/tablet|ipad/i.test(ua)) {
    return "tablet";
  }
  return "desktop";
}
