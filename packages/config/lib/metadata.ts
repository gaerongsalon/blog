import metadataJson from "../metadata.json";

export interface Metadata {
  title: string;
  url: string;
  locale: string;
  cdnUrl: string;
  options: {
    hideWriter: boolean;
  };
  auth: {
    url: string;
    googleClientId: string;
  };
}

const metadata = metadataJson as Metadata;

export default metadata;
