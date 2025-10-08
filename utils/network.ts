import NetInfo, { NetInfoState, NetInfoSubscription } from '@react-native-community/netinfo';

const NETWORK_TIMEOUT = 5000; // 5 seconds timeout

export const checkNetworkStatus = async (): Promise<boolean> => {
  try {
    const timeoutPromise = new Promise<boolean>((_, reject) => {
      setTimeout(() => reject(new Error('Network check timeout')), NETWORK_TIMEOUT);
    });

    const networkPromise = NetInfo.fetch().then(state => !!state.isConnected);
    const result = await Promise.race([networkPromise, timeoutPromise]);
    return result;
  } catch (error) {
    console.warn('Network check failed:', error);
    return false;
  }
};

export const initNetworkListener = (
  onConnectionChange: (isConnected: boolean) => void
): NetInfoSubscription => {
  return NetInfo.addEventListener((state: NetInfoState) => {
    onConnectionChange(!!state.isConnected);
  });
};