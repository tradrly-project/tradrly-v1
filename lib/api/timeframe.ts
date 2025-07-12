// lib/api/timeframe.ts

// ====================
// GLOBAL TIMEFRAMES
// ====================

export async function fetchGlobalTimeframes() {
  const res = await fetch("/api/timeframe", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Gagal memuat timeframe global");
  }

  const data = await res.json();
  return data.timeframes; // array of global timeframes
}

// ====================
// USER TIMEFRAMES
// ====================

export async function fetchUserTimeframes() {
  const res = await fetch("/api/user-timeframe", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Gagal memuat timeframe milik user");
  }

  const data = await res.json();
  return data.timeframes; // ✅ sinkron dengan return backend
}

export interface AddUserTimeframePayload {
  timeframeId?: string | null;
  customName?: string;
}

export async function addUserTimeframe(payload: AddUserTimeframePayload) {
  const res = await fetch("/api/user-timeframe", {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Gagal menambah timeframe");
  }

  const data = await res.json();
  return data; // return created userTimeframe
}

export async function deleteUserTimeframe(id: string) {
  const res = await fetch(`/api/user-timeframe/${id}`, {
    method: "DELETE",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Gagal menghapus timeframe");
  }

  const data = await res.json();
  return data.message;
}

export async function updateUserTimeframe({
  id,
  customName,
  hidden,
}: {
  id: string;
  customName?: string;
  hidden?: boolean;
}) {
  const res = await fetch(`/api/user-timeframe/${id}`, {
    method: "PATCH",
    credentials: "include",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ customName, hidden }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Gagal mengupdate timeframe");
  }

  const data = await res.json();
  return data.message;
}
