import {
  CatalogValidationError,
  parseCatalogManifest,
  parseExportedCatalog,
  resolveStaticUrl,
} from './catalog.schema.ts';
import type { CatalogManifest, ExportedCatalog } from './catalog.schema.ts';
import type { CatalogErrorCopy, CatalogMetadata, FlowerProduct } from './product.type.ts';

export type CatalogLoadErrorCode = 'missing-file' | 'network' | 'invalid-data';

export class CatalogLoadError extends Error {
  readonly code: CatalogLoadErrorCode;

  constructor(code: CatalogLoadErrorCode, message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'CatalogLoadError';
    this.code = code;
  }
}

export interface CatalogSnapshot {
  products: FlowerProduct[];
  metadata: CatalogMetadata;
}

type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

interface LoadCatalogOptions {
  fetcher?: Fetcher;
  publicBaseUrl?: string;
  documentUrl?: string;
}

interface JsonPayload {
  bytes: ArrayBuffer;
  value: unknown;
}

const parseResponseJson = async (response: Response, label: string): Promise<JsonPayload> => {
  try {
    const bytes = await response.arrayBuffer();
    const value = JSON.parse(new TextDecoder().decode(bytes)) as unknown;
    return { bytes, value };
  } catch (error) {
    throw new CatalogLoadError('invalid-data', `${label} is not valid JSON.`, { cause: error });
  }
};

const fetchJson = async (
  fetcher: Fetcher,
  url: URL,
  label: string,
  cache: RequestCache,
): Promise<JsonPayload> => {
  let response: Response;
  try {
    response = await fetcher(url, {
      cache,
      headers: { Accept: 'application/json' },
    });
  } catch (error) {
    throw new CatalogLoadError('network', `Could not request ${label}.`, { cause: error });
  }

  if (!response.ok) {
    const code: CatalogLoadErrorCode = response.status === 404 ? 'missing-file' : 'network';
    throw new CatalogLoadError(code, `${label} returned HTTP ${response.status}.`);
  }
  return parseResponseJson(response, label);
};

const sha256Hex = async (bytes: ArrayBuffer): Promise<string> => {
  if (!globalThis.crypto?.subtle) {
    throw new CatalogLoadError('invalid-data', 'This browser cannot verify the product catalog checksum.');
  }
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const validateSnapshot = (manifest: CatalogManifest, catalog: ExportedCatalog): void => {
  if (catalog.generatedAt !== manifest.generatedAt) {
    throw new CatalogLoadError('invalid-data', 'Manifest and product export timestamps do not match.');
  }
  if (catalog.schemaVersion !== manifest.schemaVersion) {
    throw new CatalogLoadError('invalid-data', 'Manifest and product export schema versions do not match.');
  }
  if (catalog.products.length !== manifest.catalog.productCount) {
    throw new CatalogLoadError('invalid-data', 'Manifest product count does not match products.json.');
  }
  const imageCount = catalog.products.reduce((total, product) => total + product.images.length, 0);
  if (imageCount !== manifest.imageCount) {
    throw new CatalogLoadError('invalid-data', 'Manifest image count does not match products.json.');
  }
};

const mapProducts = (
  catalog: ExportedCatalog,
  catalogUrl: URL,
  generatedDirectoryUrl: URL,
  version: string,
): FlowerProduct[] => catalog.products.map((product) => ({
  ...product,
  images: [...product.images]
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((image) => {
      const resolvedUrl = resolveStaticUrl(image.url, catalogUrl.href, generatedDirectoryUrl.href);
      resolvedUrl.searchParams.set('v', version);
      return { ...image, url: resolvedUrl.href };
    }),
}));

const runtimeDocumentUrl = (): string => globalThis.location?.href ?? 'http://localhost/';

export const loadProductCatalog = async (options: LoadCatalogOptions = {}): Promise<CatalogSnapshot> => {
  const fetcher = options.fetcher ?? globalThis.fetch.bind(globalThis);
  const publicBaseUrl = options.publicBaseUrl ?? import.meta.env?.BASE_URL ?? '/';
  const documentUrl = options.documentUrl ?? runtimeDocumentUrl();
  const publicRootUrl = new URL(publicBaseUrl.endsWith('/') ? publicBaseUrl : `${publicBaseUrl}/`, documentUrl);
  const manifestUrl = new URL('fe-data/manifest.json', publicRootUrl);

  try {
    const manifestPayload = await fetchJson(fetcher, manifestUrl, 'catalog manifest', 'no-store');
    const manifest = parseCatalogManifest(manifestPayload.value);
    const generatedDirectoryUrl = new URL('.', manifestUrl);
    const catalogUrl = resolveStaticUrl(
      manifest.catalog.href,
      manifestUrl.href,
      generatedDirectoryUrl.href,
    );
    catalogUrl.searchParams.set('v', manifest.catalog.version);

    const catalogPayload = await fetchJson(fetcher, catalogUrl, 'product catalog', 'no-cache');
    const catalogDigest = await sha256Hex(catalogPayload.bytes);
    if (catalogDigest !== manifest.catalog.version.toLowerCase()) {
      throw new CatalogLoadError('invalid-data', 'Product catalog checksum does not match the manifest.');
    }
    const catalog = parseExportedCatalog(catalogPayload.value);
    validateSnapshot(manifest, catalog);

    return {
      products: mapProducts(catalog, catalogUrl, generatedDirectoryUrl, manifest.catalog.version),
      metadata: {
        schemaVersion: manifest.schemaVersion,
        generatedAt: manifest.generatedAt,
        version: manifest.catalog.version,
        productCount: manifest.catalog.productCount,
        imageCount: manifest.imageCount,
        priceDeviationPercent: catalog.settings.priceDeviationPercent,
      },
    };
  } catch (error) {
    if (error instanceof CatalogLoadError) throw error;
    if (error instanceof CatalogValidationError) {
      throw new CatalogLoadError('invalid-data', error.message, { cause: error });
    }
    throw new CatalogLoadError('invalid-data', 'The catalog export could not be read.', { cause: error });
  }
};

export const catalogErrorCopy = (error: unknown): CatalogErrorCopy => {
  if (error instanceof CatalogLoadError && error.code === 'missing-file') {
    return {
      title: 'The flower catalog is not available yet',
      message: 'Lamie has not published a storefront export. Please try again shortly.',
    };
  }
  if (error instanceof CatalogLoadError && error.code === 'invalid-data') {
    return {
      title: 'The flower catalog needs attention',
      message: 'The latest export could not be read safely. Please retry after it is published again.',
    };
  }
  return {
    title: 'We could not load the flower catalog',
    message: 'Check your connection and try again. The rest of Lamie remains available.',
  };
};
