// ====================
// GLOBAL PSYCHOLOGIES
// ====================

export async function fetchGlobalPsychologies() {
  const res = await fetch("/api/psychology", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Gagal memuat psikologi global");
  }

  const data = await res.json();
  return data.psychologies; // array of global psychologies
}

// ====================
// USER PSYCHOLOGIES
// ====================

export async function fetchUserPsychologies() {
  const res = await fetch("/api/user-psychology", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Gagal memuat psikologi milik user");
  }

  const data = await res.json();
  return data.psychologies; // ✅ sinkron dengan return backend
}

interface AddUserPsychologyPayload {
  psychologyId?: string;
  customName?: string;
}

export async function addUserPsychology(payload: AddUserPsychologyPayload) {
  const res = await fetch("/api/user-psychology", {
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
    throw new Error(data.error || "Gagal menambah psikologi");
  }

  const data = await res.json();
  return data; // return created userPsychology
}

export async function deleteUserPsychology(id: string) {
  const res = await fetch(`/api/user-psychology/${id}`, {
    method: "DELETE",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Gagal menghapus psikologi");
  }

  const data = await res.json();
  return data.message;
}

export async function updateUserPsychology({
  id,
  customName,
  hidden,
}: {
  id: string;
  customName?: string;
  hidden?: boolean;
}) {
  const res = await fetch(`/api/user-psychology/${id}`, {
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
    throw new Error(data.error || "Gagal mengupdate psikologi");
  }

  const data = await res.json();
  return data.message;
}
