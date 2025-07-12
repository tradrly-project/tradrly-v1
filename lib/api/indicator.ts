// ====================
// GLOBAL INDICATORS
// ====================

export async function fetchGlobalIndicators() {
  const res = await fetch("/api/indicator", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Gagal memuat indikator global");
  }

  const data = await res.json();
  return data.indicators; // array of global indicators
}

// ====================
// USER INDICATORS
// ====================

export async function fetchUserIndicators() {
  const res = await fetch("/api/user-indicator", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Gagal memuat indikator milik user");
  }

  const data = await res.json();
  return data.indicators; // ✅ sesuai dengan response backend
}

export interface AddUserIndicatorPayload {
  indicatorId?: string | null;
  customName?: string | null;
  customCode?: string | null;
}

export async function addUserIndicator(payload: AddUserIndicatorPayload) {
  const res = await fetch("/api/user-indicator", {
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
    throw new Error(data.error || "Gagal menambah indikator");
  }

  const data = await res.json();
  return data; // return created userIndicator
}

export async function deleteUserIndicator(id: string) {
  const res = await fetch(`/api/user-indicator/${id}`, {
    method: "DELETE",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Gagal menghapus indikator");
  }

  const data = await res.json();
  return data.message;
}

export async function updateUserIndicator({
  id,
  customCode,
}: {
  id: string;
  customCode?: string;
}) {
  const res = await fetch(`/api/user-indicator/${id}`, {
    method: "PATCH",
    credentials: "include",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ customCode }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Gagal mengupdate indikator");
  }

  const data = await res.json();
  return data.message;
}
