type UrlParam = {
  [key: string]: string;
};

export abstract class MusicLibraryReader {
  public authorizeUrl: string = '';
  abstract authenticate(): boolean;
  abstract fetchArtists(): string[];

  protected buildFullUrl(baseUrl: string, params: UrlParam[]): string {
    params.forEach((param, i) => {
      const [key] = Object.keys(param);
      const [value] = Object.values(param);

      baseUrl += i === 0 ? '?' : '&';
      baseUrl += `${key}=${encodeURIComponent(value)}`;
    });

    return baseUrl;
  }

  static getHashParams(): { [key: string]: string } {
    const hash = window.location.hash.substr(1); // without the '#'
    return hash.split('&').reduce((obj, item) => {
      // put all params in an object
      const [key, value] = item.split('=');
      return { ...obj, [key]: value };
    }, {});
  }

  static hashParamsExist(): boolean {
    return this.getHashParams() !== undefined;
  }
}
