// lib/api/pair.ts

// ====================
// GLOBAL PAIRS
// ====================

export async function fetchGlobalPairs() {
  const res = await fetch("/api/pairs", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Gagal memuat pair global");
  }

  const data = await res.json();
  return data.pairs; // array of global pairs
}

// ====================
// USER PAIRS
// ====================

export async function fetchUserPairs() {
  const res = await fetch("/api/user-pair", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Gagal memuat user pair");
  }

  const data = await res.json();
  return data.pairs; // array of userPairs
}

interface AddUserPairPayload {
  pairId: string;
  customName?: string;
}

export async function addUserPair(payload: AddUserPairPayload) {
  const res = await fetch("/api/user-pair", {
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
    throw new Error(data.error || "Gagal menambah pair");
  }

  const data = await res.json();
  return data.pair;
}

export async function deleteUserPair(id: string) {
  const res = await fetch(`/api/user-pair/${id}`, {
    method: "DELETE",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Gagal menghapus pair");
  }

  const data = await res.json();
  return data.deletedCount;
}



export async function updateUserPair({ id, customName }: { id: string; customName: string }) {
  const res = await fetch(`/api/user-pair/${id}`, {
    method: "PUT",
    credentials: "include",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ customName }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Gagal mengupdate pair");
  }

  const data = await res.json();
  return data.updatedCount;
}

// ENUMS / TYPES
// ====================
export async function fetchPairTypes(): Promise<string[]> {
  const res = await fetch("/api/pairs/types", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Gagal memuat jenis pair");
  }

  const data: string[] = await res.json();
  return data; // langsung array
}


