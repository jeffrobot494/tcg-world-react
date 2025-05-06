import React, { createContext, useState, useContext } from 'react';

const ImagePreviewContext = createContext();

export const ImagePreviewProvider = ({ children }) => {
  const [previewImage, setPreviewImage] = useState(null);

  return (
    <ImagePreviewContext.Provider value={{ previewImage, setPreviewImage }}>
      {children}
    </ImagePreviewContext.Provider>
  );
};

export const useImagePreview = () => useContext(ImagePreviewContext);