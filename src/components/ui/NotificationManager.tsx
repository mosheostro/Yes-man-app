"use client";

import { useEffect } from "react";
import { useAppStore } from "@/stores/appStore";

const REMINDER_HOUR = 20; // 8 PM daily reminder

function getNextReminderMs(): number {
  const now = new Date();
  const target = new Date();
  target.setHours(REMINDER_HOUR, 0, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  return target.getTime() - now.getTime();
}

async function scheduleNotification(name: string, message: string) {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  const ms = getNextReminderMs();
  setTimeout(() => {
    new Notification("YesMan — Daily Reminder 🛡️", {
      body: message,
      icon: "/icons/icon-192.svg",
      tag: "daily-reminder",
    });
    // Re-schedule for next day
    scheduleNotification(name, message);
  }, ms);
}

export function NotificationManager() {
  const profile = useAppStore((s) => s.profile);

  useEffect(() => {
    if (!profile?.onboardingComplete) return;

    // Check if notifications preference is stored
    const notifPref = localStorage.getItem("yesmanNotifications");
    if (notifPref !== "true") return;

    if (!("Notification" in window)) return;

    const message = profile.name
      ? `Hey ${profile.name} — time for today's boundary exercise! 💪`
      : "Time for today's boundary exercise! 💪";

    if (Notification.permission === "granted") {
      scheduleNotification(profile.name, message);
    }
  }, [profile?.onboardingComplete]);

  return null;
}

export async function requestNotificationPermission(
  name: string
): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  const perm = await Notification.requestPermission();
  return perm === "granted";
}
