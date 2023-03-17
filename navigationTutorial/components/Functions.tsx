import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function getFromStorage(key: string) {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue;
    } catch (e) {
        console.log('Error getting' + key);
        return '';
    };
}

export const saveToStorage = async (key: string, array: any) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(array));
        // console.log('Stored' + key);
    } catch (e) {
        console.log('Error saving' + key);
    }
}