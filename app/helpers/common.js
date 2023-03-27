export const checkObjValue = (obj) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([__, v]) => v !== undefined),
    );
  };