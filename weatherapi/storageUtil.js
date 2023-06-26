import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (e) {
        console.log("storeData error", e);
    }
}

export const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key)
        return value;
    } catch(e) {
        console.log("getData error", e);
    }
}

export const removeData = async (key) => {
    try {
        await AsyncStorage.removeItem(key)
    } catch(e) {
        console.log("removeData error", e);
    }
}

export const getAllKeys = async () => {
    let keys = [];
    try {
        keys = await AsyncStorage.getAllKeys();
    } catch(e) {
        console.log("getAllKeys error", e);
    }
    return keys;
}

export const clearAll = async () => {
    try {
        await AsyncStorage.clear()
    } catch(e) {
        console.log("clearAll error", e);
    }
}

export const multiGet = async (keys) => {
    let values;
    try {
        values = await AsyncStorage.multiGet(keys);
    } catch(e) {
        console.log("multiGet error", e);
    }
    return values;
}

export const multiRemove = async (keys) => {
    try {
        await AsyncStorage.multiRemove(keys);
    } catch(e) {
        console.log("multiRemove error", e);
    }
}

export const multiSet = async (keyValuePairs) => {
    try {
        await AsyncStorage.multiSet(keyValuePairs);
    } catch(e) {
        console.log("multiSet error", e);
    }
}

export const mergeItem = async (key, value) => {
    try {
        await AsyncStorage.mergeItem(key, value);
    } catch(e) {
        console.log("mergeItem error", e);
    }
}