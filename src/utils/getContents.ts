import glob from 'tiny-glob';

/**
 * Fetches all file contents in a path.
 * @param {string} path Path to search.
 * @returns {Promise<T[]>} List of files in path.
 */
export const getContents = async <T>(path: string): Promise<T[]> => {
  const files = await glob(`${path}/**/*.{ts,js}`);

  const contents = await Promise.all(
    files.map((path) => import(`../../${path}`))
  );

  return contents;
};
