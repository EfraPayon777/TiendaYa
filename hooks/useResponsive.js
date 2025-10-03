import { useState, useEffect } from 'react';
import { Platform, Dimensions } from 'react-native';

export const useResponsive = () => {
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  useEffect(() => {
    const onChange = (result) => {
      setScreenData(result.window);
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  const isWeb = Platform.OS === 'web';
  const isMobile = screenData.width < 768;
  const isTablet = screenData.width >= 768 && screenData.width < 1024;
  const isDesktop = screenData.width >= 1024;

  return {
    isWeb,
    isMobile,
    isTablet,
    isDesktop,
    screenWidth: screenData.width,
    screenHeight: screenData.height,
  };
};
