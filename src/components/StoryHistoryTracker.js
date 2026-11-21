
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  recordVisit,
  selectHistoryHydrated,
} from "../lib/features/history/historySlice";

export default function StoryHistoryTracker({ story }) {
  const dispatch = useDispatch();
  const historyIsHydrated = useSelector(selectHistoryHydrated);

  useEffect(() => {
    if (!historyIsHydrated) {
      return;
    }

    dispatch(
      recordVisit({
        ...story,
        visitedAt: Date.now(),
      })
    );
  }, [dispatch, historyIsHydrated, story]);

  return null;
}