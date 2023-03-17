import glob from 'tiny-glob';

/**
 * Fetches all file contents in a path.
 * @param {string} path Path to search.
 * @returns {Promise<any[]>} List of files in path.
 */
export async function getContents(path: string): Promise<any[]> {
  const files = await glob(`${path}/**/*.{ts,js}`);

  const contents = await Promise.all(
    files.map((path) => import(`../../${path}`))
  );

  return contents;
}
