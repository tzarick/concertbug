export function getHashParams(): { [key: string]: string } {
  const hash = window.location.hash.substr(1); // without the '#'
  return hash.split('&').reduce((obj, item) => {
    // put all params in an object
    const [key, value] = item.split('=');
    return { ...obj, [key]: value };
  }, {});
}

export function hashParamsExist(): boolean {
  return Object.keys(getHashParams())[0].length > 0;
}

export const UnknownVenueCoords = {
  // atlantic ocean
  lat: 35.46847,
  lng: -65.189576,
};
