import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "ZIKR_LIST";

export const getTodayKey = () => {
  const now = new Date();
  return now.toISOString().split("T")[0];
};

export const loadZikrs = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json != null ? JSON.parse(json) : [];
  } catch (e) {
    console.log("Failed to load zikrs ", e);
    return [];
  }
};

export const saveZikrs = async (zikrs) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(zikrs));
  } catch (e) {
    console.log("Failed to save zikrs ", e);
  }
};

export const addZikr = async (name, target = 33) => {
  const zikrs = await loadZikrs();
  const newZikr = {
    id: `${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    name,
    target,
    count: 0,
    history: {},
  };
  const updated = [...zikrs, newZikr];
  await saveZikrs(updated);
  return updated;
};

export const updateZikr = async (id, changes) => {
  const zikrs = await loadZikrs();
  const updated = zikrs.map((z) =>
    z.id === id ? { ...z, ...changes } : z,
  );
  await saveZikrs(updated);
  return updated;
};

export const deleteZikr = async (id) => {
  const zikrs = await loadZikrs();
  const updated = zikrs.filter((z) => z.id !== id);
  await saveZikrs(updated);
  return updated;
};

export const incrementZikr = async (id) => {
  const zikrs = await loadZikrs();
  const todayKey = getTodayKey();
  const updated = zikrs.map((z) => {
    if (z.id !== id) return z;
    const newCount = z.count + 1;
    return {
      ...z,
      count: newCount,
      history: {
        ...z.history,
        [todayKey]: newCount,
      },
    };
  });
  await saveZikrs(updated);
  return updated;
};

export const resetZikrCount = async (id) => {
  const zikrs = await loadZikrs();
  const updated = zikrs.map((z) =>
    z.id === id ? { ...z, count: 0 } : z,
  );
  await saveZikrs(updated);
  return updated;
};